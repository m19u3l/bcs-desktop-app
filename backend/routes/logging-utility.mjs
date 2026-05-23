import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all logs
router.get('/', async (req, res, next) => {
  try {
    const items = await db.all('SELECT * FROM logs ORDER BY created_at DESC');
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching logs:', error);
    next(error);
  }
});

// GET single log by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get('SELECT * FROM logs WHERE id = ?', [id]);

    if (!item) {
      return res.status(404).json({ error: 'Log entry not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching log:', error);
    next(error);
  }
});

// CREATE new log entry
router.post('/', async (req, res, next) => {
  try {
    const { level, source, message, context, user_id } = req.body;

    const result = await db.run(
      `INSERT INTO logs (level, source, message, context, user_id) VALUES (?, ?, ?, ?, ?)`,
      [level || 'info', source, message, context, user_id]
    );

    const newItem = await db.get('SELECT * FROM logs WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating log entry:', error);
    next(error);
  }
});

// UPDATE log entry
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { level, source, message, context, user_id } = req.body;

    await db.run(
      `UPDATE logs SET level = ?, source = ?, message = ?, context = ?, user_id = ? WHERE id = ?`,
      [level, source, message, context, user_id, id]
    );

    const updatedItem = await db.get('SELECT * FROM logs WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating log entry:', error);
    next(error);
  }
});

// DELETE log entry
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM logs WHERE id = ?', [id]);
    res.json({ message: 'Log entry deleted successfully', id });
  } catch (error) {
    console.error('Error deleting log entry:', error);
    next(error);
  }
});

export default router;
