import Imap from 'imap';
import { simpleParser } from 'mailparser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const imapConfig = {
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASSWORD,
  host: process.env.IMAP_HOST || 'imap.ionos.com',
  port: parseInt(process.env.IMAP_PORT) || 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
  authTimeout: 10000
};

console.log('Testing IMAP Connection with:', {
  host: imapConfig.host,
  port: imapConfig.port,
  user: imapConfig.user,
  password: imapConfig.password ? '******' : 'MISSING'
});

const imap = new Imap(imapConfig);

imap.once('ready', () => {
  console.log('✅ IMAP Ready');
  imap.openBox('INBOX', true, (err, box) => {
    if (err) {
      console.error('❌ Error opening INBOX:', err);
      imap.end();
      return;
    }
    console.log('📬 Inbox opened. Total messages:', box.messages.total);
    imap.end();
  });
});

imap.once('error', (err) => {
  console.error('❌ IMAP Error:', err);
});

imap.once('end', () => {
  console.log('🔌 IMAP Connection Ended');
});

console.log('Connecting...');
imap.connect();
