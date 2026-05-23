import { createTransport } from 'nodemailer';
import Imap from 'imap';
import { simpleParser } from 'mailparser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

// SMTP Transporter
const transporter = createTransport({
  host: process.env.SMTP_HOST || 'smtp.ionos.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: { rejectUnauthorized: false }
});

// IMAP Configuration
const imapConfig = {
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASSWORD,
  host: process.env.IMAP_HOST || 'imap.ionos.com',
  port: parseInt(process.env.IMAP_PORT) || 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
  authTimeout: 10000
};

/**
 * Send an email
 */
export async function sendEmail({ to, subject, html, text, attachments = [] }) {
  try {
    const mailOptions = {
      from: `"Building Care Solutions" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
      attachments
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
}

/**
 * Get recent emails from inbox
 */
export async function getRecentEmails(limit = 10) {
  return new Promise((resolve, reject) => {
    console.log('📬 Connecting to IMAP:', imapConfig.host, 'for', imapConfig.user);
    const imap = new Imap(imapConfig);
    const emailPromises = [];

    imap.once('ready', () => {
      imap.openBox('INBOX', true, (err, box) => {
        if (err) {
          console.error('❌ Error opening INBOX:', err);
          imap.end();
          return reject(err);
        }

        const totalMessages = box.messages.total;
        if (totalMessages === 0) {
          console.log('📭 Inbox is empty');
          imap.end();
          return resolve([]);
        }

        const fetchCount = Math.min(limit, totalMessages);
        const start = totalMessages - fetchCount + 1;
        console.log(`📥 Fetching last ${fetchCount} emails (seqno ${start}:${totalMessages})...`);

        const f = imap.seq.fetch(`${start}:${totalMessages}`, { bodies: '' });

        f.on('message', (msg, seqno) => {
          const p = new Promise((resolveMsg) => {
            msg.on('body', (stream) => {
              simpleParser(stream)
                .then(parsed => {
                  resolveMsg({
                    seqno,
                    from: parsed.from?.text || 'Unknown',
                    subject: parsed.subject || '(No Subject)',
                    date: parsed.date || new Date(),
                    text: parsed.text || '',
                    html: parsed.html || ''
                  });
                })
                .catch(err => {
                  console.error(`❌ Parser error for msg ${seqno}:`, err);
                  resolveMsg(null);
                });
            });
          });
          emailPromises.push(p);
        });

        f.once('error', (err) => {
          console.error('❌ Fetch stream error:', err);
          imap.end();
          reject(err);
        });

        f.once('end', () => {
          console.log('✅ Fetch stream ended, parsing emails...');
          Promise.all(emailPromises).then(results => {
            const filteredResults = results.filter(r => r !== null);
            filteredResults.sort((a, b) => b.seqno - a.seqno);
            console.log(`✨ Successfully parsed ${filteredResults.length} emails`);
            imap.end();
            resolve(filteredResults);
          });
        });
      });
    });

    imap.once('error', (err) => {
      console.error('❌ IMAP Error:', err);
      if (imap.state !== 'disconnected') imap.end();
      reject(err);
    });

    imap.once('end', () => {
      console.log('🔌 IMAP connection closed');
    });

    imap.connect();
  });
}

/**
 * Send invoice email
 */
export async function sendInvoiceEmail({ clientEmail, clientName, invoiceNumber, amount, dueDate, pdfAttachment }) {
  const html = `<h2>Invoice ${invoiceNumber}</h2><p>Dear ${clientName}, your invoice for $${amount} is ready.</p>`;
  return sendEmail({
    to: clientEmail,
    subject: `Invoice ${invoiceNumber} from Building Care Solutions`,
    html,
    text: `Invoice ${invoiceNumber} - Amount Due: $${amount}`,
    attachments: pdfAttachment ? [pdfAttachment] : []
  });
}

/**
 * Send past due reminder
 */
export async function sendPastDueReminder({ clientEmail, clientName, invoiceNumber, amount, daysOverdue }) {
  const html = `<h2>Past Due Reminder</h2><p>Invoice ${invoiceNumber} is ${daysOverdue} days overdue.</p>`;
  return sendEmail({
    to: clientEmail,
    subject: `⚠️ Past Due Reminder: Invoice ${invoiceNumber}`,
    html,
    text: `Your invoice ${invoiceNumber} is ${daysOverdue} days overdue.`
  });
}

export default {
  sendEmail,
  getRecentEmails,
  sendInvoiceEmail,
  sendPastDueReminder
};
