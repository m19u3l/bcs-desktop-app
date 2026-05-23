import express from 'express';
import db from '../db.js';

const router = express.Router();

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

export default router;
