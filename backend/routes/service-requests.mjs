import express from 'express';
import cors from 'cors';
import db from '../db.js';
import { sendSMS } from '../services/smsService.js';

const router = express.Router();

// Owner phone — receives all new request notifications
const OWNER_PHONE = process.env.OWNER_PHONE || '+18587378499';
// Additional alert phones (comma-separated in env, e.g. "+16195550001,+16195550002")
const ALERT_PHONES = (process.env.ALERT_PHONES || '')
  .split(',').map(p => p.trim()).filter(Boolean);

const ALL_ALERT_PHONES = [OWNER_PHONE, ...ALERT_PHONES];

// ── Allow any origin for the public submit endpoint only ─────────────────────
const publicCors = cors({ origin: '*' });

// ── Helper: format phone to E.164 ────────────────────────────────────────────
function toE164(phone) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return null;
}

// ── Helper: generate work order number ───────────────────────────────────────
async function nextWONumber() {
  const row = await db.get('SELECT COUNT(*) AS n FROM work_orders');
  const seq = (row?.n || 0) + 1;
  return `WO-${String(seq).padStart(5, '0')}`;
}

// ── POST /api/service-requests/submit (PUBLIC) ────────────────────────────────
router.post('/submit', publicCors, async (req, res) => {
  const {
    name, email, phone, address,
    service_type, preferred_date, preferred_time, description
  } = req.body;

  if (!name || !phone || !service_type) {
    return res.status(400).json({ error: 'Name, phone, and service type are required.' });
  }

  try {
    // ── 1. Find or create client ──────────────────────────────────────────
    let client = null;
    if (phone) {
      const digits = phone.replace(/\D/g, '');
      client = await db.get(
        `SELECT * FROM clients WHERE replace(replace(replace(phone,' ',''),'-',''),'(','') LIKE ? LIMIT 1`,
        [`%${digits.slice(-10)}%`]
      );
    }
    if (!client && email) {
      client = await db.get('SELECT * FROM clients WHERE email = ? LIMIT 1', [email]);
    }

    if (!client) {
      const r = await db.run(
        'INSERT INTO clients (name, email, phone, address) VALUES (?, ?, ?, ?)',
        [name, email || null, phone, address || null]
      );
      client = await db.get('SELECT * FROM clients WHERE id = ?', [r.lastID]);
    }

    // ── 2. Create work order ──────────────────────────────────────────────
    const woNumber = await nextWONumber();
    const woTitle = `${service_type} — ${name}`;
    const woDesc = description
      ? `Service request from website.\n\n${description}`
      : 'Service request from website.';

    const woResult = await db.run(
      `INSERT INTO work_orders (client_id, work_order_number, title, description, status, priority, scheduled_date, location)
       VALUES (?, ?, ?, ?, 'pending', 'medium', ?, ?)`,
      [client.id, woNumber, woTitle, woDesc, preferred_date || null, address || null]
    );
    const workOrder = await db.get('SELECT * FROM work_orders WHERE id = ?', [woResult.lastID]);

    // ── 3. Create calendar event ──────────────────────────────────────────
    let calEvent = null;
    if (preferred_date) {
      const evResult = await db.run(
        `INSERT INTO calendar_events (title, description, event_type, event_date, start_time, client_id, work_order_id, location, status)
         VALUES (?, ?, 'service_request', ?, ?, ?, ?, ?, 'scheduled')`,
        [
          woTitle,
          `Requested by ${name} | Phone: ${phone}${description ? '\n' + description : ''}`,
          preferred_date,
          preferred_time || null,
          client.id,
          workOrder.id,
          address || null
        ]
      );
      calEvent = await db.get('SELECT * FROM calendar_events WHERE id = ?', [evResult.lastID]);
    }

    // ── 4. Save service request record ────────────────────────────────────
    const srResult = await db.run(
      `INSERT INTO service_requests
         (name, email, phone, address, service_type, preferred_date, preferred_time, description,
          client_id, work_order_id, calendar_event_id, source)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'website')`,
      [
        name, email || null, phone, address || null,
        service_type, preferred_date || null, preferred_time || null, description || null,
        client.id, workOrder.id, calEvent?.id || null
      ]
    );

    // Update work_order_id cross-link on calendar event
    if (calEvent) {
      await db.run(
        'UPDATE service_requests SET calendar_event_id = ? WHERE id = ?',
        [calEvent.id, srResult.lastID]
      );
    }

    // ── 5. SMS notifications ──────────────────────────────────────────────
    const dateStr = preferred_date
      ? new Date(preferred_date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      : 'Date TBD';
    const timeStr = preferred_time || 'Time TBD';

    const ownerMsg =
      `NEW SERVICE REQUEST — ${woNumber}\n` +
      `Client: ${name}\n` +
      `Phone: ${phone}\n` +
      `Service: ${service_type}\n` +
      `Date: ${dateStr} at ${timeStr}\n` +
      `Address: ${address || 'Not provided'}\n` +
      (description ? `Notes: ${description}` : '');

    const clientMsg =
      `Hi ${name.split(' ')[0]}, thank you for contacting Building Care Solutions!\n\n` +
      `We received your request for ${service_type}.\n` +
      (preferred_date ? `Preferred date: ${dateStr} at ${timeStr}\n` : '') +
      `We will call you shortly to confirm your appointment.\n\n` +
      `Questions? Call 858-737-8499 or (866) 982-4796\nReply STOP to opt out.`;

    // Fire SMS without blocking the response
    const smsJobs = ALL_ALERT_PHONES.map(p => sendSMS(p, ownerMsg).catch(e => console.error('SMS alert failed:', e)));
    const clientPhone = toE164(phone);
    if (clientPhone) {
      smsJobs.push(sendSMS(clientPhone, clientMsg).catch(e => console.error('SMS client confirm failed:', e)));
    }
    await Promise.allSettled(smsJobs);

    res.status(201).json({
      success: true,
      message: 'Service request received! We will contact you shortly.',
      work_order_number: woNumber,
      request_id: srResult.lastID
    });
  } catch (err) {
    console.error('Error processing service request:', err);
    res.status(500).json({ error: 'Failed to process request. Please call 858-737-8499 or (866) 982-4796.' });
  }
});

// ── GET /api/service-requests (admin) ─────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const rows = await db.all(`
      SELECT sr.*,
             wo.work_order_number,
             wo.status AS work_order_status
      FROM service_requests sr
      LEFT JOIN work_orders wo ON sr.work_order_id = wo.id
      ORDER BY sr.created_at DESC
    `);
    res.json(rows || []);
  } catch (err) { next(err); }
});

// ── GET /api/service-requests/:id ─────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const row = await db.get('SELECT * FROM service_requests WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) { next(err); }
});

// ── PUT /api/service-requests/:id (update status / assign) ────────────────────
router.put('/:id', async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    await db.run(
      'UPDATE service_requests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status || 'new', req.params.id]
    );
    const updated = await db.get('SELECT * FROM service_requests WHERE id = ?', [req.params.id]);
    res.json(updated);
  } catch (err) { next(err); }
});

// ── DELETE /api/service-requests/:id ─────────────────────────────────────────
router.delete('/:id', async (req, res, next) => {
  try {
    await db.run('DELETE FROM service_requests WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted', id: req.params.id });
  } catch (err) { next(err); }
});

export default router;
