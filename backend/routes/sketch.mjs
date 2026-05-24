import express from 'express';
import multer  from 'multer';
import db from '../db.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });
const DXF_BRIDGE = process.env.DXF_BRIDGE_URL || 'http://localhost:8001';

await db.run(`
  CREATE TABLE IF NOT EXISTS sketches (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL DEFAULT 'Untitled Sketch',
    client_id   INTEGER,
    estimate_id INTEGER,
    rooms_json  TEXT DEFAULT '[]',
    notes       TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).catch(console.error);

const parse = row => row ? { ...row, rooms: JSON.parse(row.rooms_json || '[]') } : null;

// ── CRUD ──────────────────────────────────────────────────────────────────────

router.get('/', async (req, res, next) => {
  try {
    const rows = await db.all('SELECT * FROM sketches ORDER BY updated_at DESC');
    res.json(rows.map(parse));
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const row = await db.get('SELECT * FROM sketches WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(parse(row));
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const { name = 'Untitled Sketch', client_id, rooms = [], notes } = req.body;
    const r = await db.run(
      'INSERT INTO sketches (name, client_id, rooms_json, notes) VALUES (?,?,?,?)',
      [name, client_id || null, JSON.stringify(rooms), notes || null]
    );
    res.status(201).json(parse(await db.get('SELECT * FROM sketches WHERE id = ?', [r.lastID])));
  } catch (e) { next(e); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { name, client_id, rooms, notes, estimate_id } = req.body;
    await db.run(
      `UPDATE sketches
         SET name=?, client_id=?, rooms_json=?, notes=?, estimate_id=?, updated_at=CURRENT_TIMESTAMP
       WHERE id=?`,
      [name, client_id || null, JSON.stringify(rooms || []), notes || null, estimate_id || null, req.params.id]
    );
    res.json(parse(await db.get('SELECT * FROM sketches WHERE id = ?', [req.params.id])));
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await db.run('DELETE FROM sketches WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted', id: req.params.id });
  } catch (e) { next(e); }
});

// ── DXF Import ────────────────────────────────────────────────────────────────

router.post('/import/dxf', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // Forward to Python DXF bridge
    const form = new FormData();
    const blob = new Blob([req.file.buffer], { type: 'application/octet-stream' });
    form.append('file', blob, req.file.originalname || 'upload.dxf');

    let bridgeData;
    try {
      const bridgeRes = await fetch(`${DXF_BRIDGE}/parse`, { method: 'POST', body: form });
      if (!bridgeRes.ok) {
        const err = await bridgeRes.text();
        return res.status(502).json({ error: `DXF bridge error: ${err}` });
      }
      bridgeData = await bridgeRes.json();
    } catch (fetchErr) {
      return res.status(503).json({ error: 'DXF bridge is not running. Start it with: cd backend/dxf_bridge && ./start.sh' });
    }

    // bridgeData.rooms: [{ id, name, x, y, w, h, area_sf, damages:[] }]
    const rooms = (bridgeData.rooms || []).map((r, i) => ({
      id:      r.id || (Date.now() + i),
      name:    r.name || `Room ${i + 1}`,
      x:       Math.round(r.x / 24) || 0,
      y:       Math.round(r.y / 24) || 0,
      w:       Math.max(2, Math.round(r.w / 24)),
      h:       Math.max(2, Math.round(r.h / 24)),
      ceilH:   8,
      damages: [],
    }));

    const name = (req.file.originalname || 'DXF Import').replace(/\.dxf$/i, '');
    const result = await db.run(
      'INSERT INTO sketches (name, rooms_json) VALUES (?,?)',
      [name, JSON.stringify(rooms)]
    );
    res.status(201).json(parse(await db.get('SELECT * FROM sketches WHERE id = ?', [result.lastID])));
  } catch (e) { next(e); }
});

// ── DXF Export ────────────────────────────────────────────────────────────────

router.get('/:id/export/dxf', async (req, res, next) => {
  try {
    const row = await db.get('SELECT * FROM sketches WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ error: 'Not found' });
    const rooms = JSON.parse(row.rooms_json || '[]');

    const lines = [
      '0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1015\n0\nENDSEC',
      '0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n70\n2',
      '0\nLAYER\n2\nROOMS\n70\n0\n62\n5\n6\nCONTINUOUS',
      '0\nLAYER\n2\nLABELS\n70\n0\n62\n7\n6\nCONTINUOUS',
      '0\nENDTAB\n0\nENDSEC',
      '0\nSECTION\n2\nENTITIES',
    ];

    for (const r of rooms) {
      // LWPOLYLINE rectangle (closed) in feet
      const pts = [[r.x, r.y],[r.x+r.w, r.y],[r.x+r.w, r.y+r.h],[r.x, r.y+r.h]];
      lines.push(`0\nLWPOLYLINE\n8\nROOMS\n90\n4\n70\n1`);
      for (const [px, py] of pts) lines.push(`10\n${px}\n20\n${py}`);
      // Label
      lines.push(`0\nTEXT\n8\nLABELS\n10\n${r.x + r.w/2}\n20\n${r.y + r.h/2}\n40\n1\n1\n${r.name} (${r.w}x${r.h}ft)`);
    }

    lines.push('0\nENDSEC\n0\nEOF');
    const dxf = lines.join('\n');

    res.setHeader('Content-Type', 'application/dxf');
    res.setHeader('Content-Disposition', `attachment; filename="${row.name || 'sketch'}.dxf"`);
    res.send(dxf);
  } catch (e) { next(e); }
});

export default router;
