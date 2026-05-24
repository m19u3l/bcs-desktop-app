/**
 * Assembly (Line Item Package) Route
 * An assembly is a named template of child line items.
 * Adding an assembly to an estimate explodes it into individual line items.
 */
import express from 'express';
import db from '../db.js';

const router = express.Router();

await db.run(`
  CREATE TABLE IF NOT EXISTS assemblies (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    category    TEXT,
    description TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).catch(console.error);

await db.run(`
  CREATE TABLE IF NOT EXISTS assembly_items (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    assembly_id   INTEGER NOT NULL REFERENCES assemblies(id) ON DELETE CASCADE,
    description   TEXT NOT NULL,
    unit          TEXT DEFAULT 'EA',
    unit_price    REAL DEFAULT 0,
    qty_formula   TEXT DEFAULT '1',
    category      TEXT,
    sort_order    INTEGER DEFAULT 0
  )
`).catch(console.error);

// ── Helpers ───────────────────────────────────────────────────────────────────

const parseAssembly = (row, items = []) => row ? { ...row, items } : null;

async function withItems(row) {
  if (!row) return null;
  const items = await db.all(
    'SELECT * FROM assembly_items WHERE assembly_id=? ORDER BY sort_order, id',
    [row.id]
  );
  return parseAssembly(row, items);
}

// ── List all assemblies ───────────────────────────────────────────────────────

router.get('/', async (req, res, next) => {
  try {
    const rows = await db.all('SELECT * FROM assemblies ORDER BY category, name');
    const result = await Promise.all(rows.map(withItems));
    res.json(result);
  } catch (e) { next(e); }
});

// ── Get single assembly ───────────────────────────────────────────────────────

router.get('/:id', async (req, res, next) => {
  try {
    const row = await db.get('SELECT * FROM assemblies WHERE id=?', [req.params.id]);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(await withItems(row));
  } catch (e) { next(e); }
});

// ── Create assembly ───────────────────────────────────────────────────────────

router.post('/', async (req, res, next) => {
  try {
    const { name, category, description, items = [] } = req.body;
    const r = await db.run(
      'INSERT INTO assemblies (name, category, description) VALUES (?,?,?)',
      [name, category || null, description || null]
    );
    const id = r.lastID;
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      await db.run(
        'INSERT INTO assembly_items (assembly_id, description, unit, unit_price, qty_formula, category, sort_order) VALUES (?,?,?,?,?,?,?)',
        [id, it.description, it.unit || 'EA', it.unit_price || 0, it.qty_formula || '1', it.category || null, i]
      );
    }
    res.status(201).json(await withItems(await db.get('SELECT * FROM assemblies WHERE id=?', [id])));
  } catch (e) { next(e); }
});

// ── Update assembly ───────────────────────────────────────────────────────────

router.put('/:id', async (req, res, next) => {
  try {
    const { name, category, description, items } = req.body;
    await db.run(
      'UPDATE assemblies SET name=?, category=?, description=?, updated_at=CURRENT_TIMESTAMP WHERE id=?',
      [name, category || null, description || null, req.params.id]
    );
    if (Array.isArray(items)) {
      await db.run('DELETE FROM assembly_items WHERE assembly_id=?', [req.params.id]);
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        await db.run(
          'INSERT INTO assembly_items (assembly_id, description, unit, unit_price, qty_formula, category, sort_order) VALUES (?,?,?,?,?,?,?)',
          [req.params.id, it.description, it.unit || 'EA', it.unit_price || 0, it.qty_formula || '1', it.category || null, i]
        );
      }
    }
    res.json(await withItems(await db.get('SELECT * FROM assemblies WHERE id=?', [req.params.id])));
  } catch (e) { next(e); }
});

// ── Delete assembly ───────────────────────────────────────────────────────────

router.delete('/:id', async (req, res, next) => {
  try {
    await db.run('DELETE FROM assemblies WHERE id=?', [req.params.id]);
    res.json({ deleted: req.params.id });
  } catch (e) { next(e); }
});

// ── Explode assembly → line items (for use in estimates) ─────────────────────
// POST /api/assemblies/:id/explode  body: { qty_multiplier, room_area, room_perimeter }
// Returns flat array of ready-to-use line items with qty computed

router.post('/:id/explode', async (req, res, next) => {
  try {
    const row = await db.get('SELECT * FROM assemblies WHERE id=?', [req.params.id]);
    if (!row) return res.status(404).json({ error: 'Assembly not found' });
    const items = await db.all(
      'SELECT * FROM assembly_items WHERE assembly_id=? ORDER BY sort_order, id',
      [req.params.id]
    );

    const ctx = {
      qty:       parseFloat(req.body.qty_multiplier) || 1,
      area:      parseFloat(req.body.room_area)       || 1,
      perimeter: parseFloat(req.body.room_perimeter)  || 1,
      volume:    parseFloat(req.body.room_volume)      || 1,
    };

    const exploded = items.map(item => {
      let qty = 1;
      try {
        // Safe eval of simple math formulas using context variables
        // Supports: area, perimeter, volume, qty, +, -, *, /, Math.ceil, Math.round
        const fn = new Function('area','perimeter','volume','qty','Math',
          `return ${item.qty_formula || '1'}`
        );
        qty = Math.max(1, Math.ceil(fn(ctx.area, ctx.perimeter, ctx.volume, ctx.qty, Math)));
      } catch (_) { qty = 1; }

      return {
        description: item.description,
        unit:        item.unit,
        qty,
        unit_price:  item.unit_price,
        subtotal:    Math.round(qty * item.unit_price * 100) / 100,
        category:    item.category || row.category,
        assembly_id: row.id,
        assembly_name: row.name,
      };
    });

    res.json({ assembly: row, items: exploded });
  } catch (e) { next(e); }
});

export default router;
