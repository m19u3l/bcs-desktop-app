import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { division, search, unit } = req.query;
    let q = 'SELECT * FROM rsmeans_pricing WHERE is_active = 1';
    const p = [];
    if (division) { q += ' AND csi_division = ?'; p.push(division); }
    if (unit)     { q += ' AND unit = ?';          p.push(unit); }
    if (search) {
      q += ' AND (description LIKE ? OR csi_code LIKE ?)';
      p.push(`%${search}%`, `%${search}%`);
    }
    q += ' ORDER BY csi_division, csi_code';
    res.json(await db.all(q, p) || []);
  } catch (e) { next(e); }
});

router.get('/divisions', async (_req, res, next) => {
  try {
    const divs = await db.all('SELECT DISTINCT csi_division, MIN(description) as sample FROM rsmeans_pricing GROUP BY csi_division ORDER BY csi_division');
    const names = {
      '01':'General Requirements','02':'Existing Conditions','03':'Concrete',
      '04':'Masonry','05':'Metals','06':'Wood & Plastics','07':'Thermal & Moisture',
      '08':'Openings','09':'Finishes','22':'Plumbing','23':'HVAC','26':'Electrical',
    };
    res.json(divs.map(d => ({ division: d.csi_division, name: names[d.csi_division] || `Division ${d.csi_division}` })));
  } catch (e) { next(e); }
});

router.get('/summary', async (_req, res, next) => {
  try {
    res.json(await db.all(`
      SELECT csi_division, COUNT(*) as items,
             ROUND(AVG(sd_total),2) as avg_cost,
             ROUND(MIN(sd_total),2) as min_cost,
             ROUND(MAX(sd_total),2) as max_cost
      FROM rsmeans_pricing WHERE is_active=1
      GROUP BY csi_division ORDER BY csi_division
    `) || []);
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const item = await db.get('SELECT * FROM rsmeans_pricing WHERE id = ?', [req.params.id]);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (e) { next(e); }
});

export default router;
