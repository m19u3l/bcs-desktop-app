import express from 'express';
import multer  from 'multer';
import path    from 'path';
import fs      from 'fs';
import db      from '../db.js';
import { fileURLToPath } from 'url';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const ATTACH_DIR = path.join(__dirname, '..', 'uploads', 'attachments');

if (!fs.existsSync(ATTACH_DIR)) fs.mkdirSync(ATTACH_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, ATTACH_DIR),
  filename:    (_req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase();
    const safe = path.basename(file.originalname, ext).replace(/[^a-z0-9]/gi, '_').slice(0, 40);
    cb(null, `${safe}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /^(image\/(jpeg|png|gif|webp)|application\/pdf|video\/(mp4|quicktime))$/.test(file.mimetype);
    cb(ok ? null : new Error('Unsupported file type'), ok);
  },
});

const router = express.Router();

await db.run(`
  CREATE TABLE IF NOT EXISTS document_attachments (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_type   TEXT NOT NULL,
    entity_id     INTEGER NOT NULL,
    filename      TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_type     TEXT,
    file_size     INTEGER,
    caption       TEXT,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).catch(console.error);

await db.run(`
  CREATE INDEX IF NOT EXISTS idx_attach_entity ON document_attachments (entity_type, entity_id)
`).catch(console.error);

// ── Serve attachment file ─────────────────────────────────────────────────────

router.get('/file/:filename', (req, res, next) => {
  const fp = path.join(ATTACH_DIR, path.basename(req.params.filename));
  if (!fs.existsSync(fp)) return res.status(404).json({ error: 'File not found' });
  res.sendFile(fp);
});

// ── List attachments for an entity ────────────────────────────────────────────

router.get('/', async (req, res, next) => {
  try {
    const { entity_type, entity_id } = req.query;
    if (!entity_type || !entity_id) return res.status(400).json({ error: 'entity_type and entity_id required' });
    const rows = await db.all(
      'SELECT * FROM document_attachments WHERE entity_type=? AND entity_id=? ORDER BY created_at DESC',
      [entity_type, entity_id]
    );
    res.json(rows);
  } catch (e) { next(e); }
});

// ── Upload + attach files ─────────────────────────────────────────────────────

router.post('/', upload.array('files', 20), async (req, res, next) => {
  try {
    const { entity_type, entity_id, caption } = req.body;
    if (!entity_type || !entity_id) return res.status(400).json({ error: 'entity_type and entity_id required' });
    if (!req.files?.length) return res.status(400).json({ error: 'No files provided' });

    const inserted = [];
    for (const file of req.files) {
      const r = await db.run(
        `INSERT INTO document_attachments (entity_type, entity_id, filename, original_name, file_type, file_size, caption)
         VALUES (?,?,?,?,?,?,?)`,
        [entity_type, entity_id, file.filename, file.originalname, file.mimetype, file.size, caption || null]
      );
      inserted.push({
        id: r.lastID, entity_type, entity_id,
        filename: file.filename, original_name: file.originalname,
        file_type: file.mimetype, file_size: file.size, caption: caption || null,
      });
    }
    res.status(201).json(inserted);
  } catch (e) { next(e); }
});

// ── Delete attachment ─────────────────────────────────────────────────────────

router.delete('/:id', async (req, res, next) => {
  try {
    const row = await db.get('SELECT * FROM document_attachments WHERE id=?', [req.params.id]);
    if (!row) return res.status(404).json({ error: 'Not found' });
    await db.run('DELETE FROM document_attachments WHERE id=?', [req.params.id]);
    const fp = path.join(ATTACH_DIR, row.filename);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
    res.json({ deleted: req.params.id });
  } catch (e) { next(e); }
});

export default router;
