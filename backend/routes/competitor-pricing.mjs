import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = `
      SELECT cp.*,
             pl.unit_price as bcs_price,
             pl.labor_cost,
             pl.material_cost,
             ((pl.unit_price / NULLIF(cp.market_high, 0)) * 100) as bcs_vs_market_pct
      FROM competitor_pricing cp
      LEFT JOIN price_list pl ON cp.xactimate_code = pl.xactimate_code
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      query += ' AND cp.trade_category = ?';
      params.push(category);
    }
    if (search) {
      query += ' AND (cp.description LIKE ? OR cp.xactimate_code LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY cp.trade_category, cp.xactimate_code';
    const items = await db.all(query, params);
    res.json(items || []);
  } catch (error) {
    next(error);
  }
});

router.get('/categories', async (req, res, next) => {
  try {
    const cats = await db.all('SELECT DISTINCT trade_category FROM competitor_pricing ORDER BY trade_category');
    res.json(cats.map(c => c.trade_category));
  } catch (error) {
    next(error);
  }
});

router.get('/summary', async (req, res, next) => {
  try {
    const summary = await db.all(`
      SELECT
        cp.trade_category,
        COUNT(*) as item_count,
        ROUND(AVG(pl.unit_price), 2) as avg_bcs_price,
        ROUND(AVG(cp.servpro_price), 2) as avg_servpro,
        ROUND(AVG(cp.paul_davis_price), 2) as avg_paul_davis,
        ROUND(AVG(cp.market_low), 2) as avg_market_low,
        ROUND(AVG(cp.market_high), 2) as avg_market_high,
        ROUND(((AVG(pl.unit_price) - AVG(cp.servpro_price)) / NULLIF(AVG(cp.servpro_price), 0)) * 100, 1) as savings_vs_servpro_pct
      FROM competitor_pricing cp
      LEFT JOIN price_list pl ON cp.xactimate_code = pl.xactimate_code
      GROUP BY cp.trade_category
      ORDER BY cp.trade_category
    `);
    res.json(summary || []);
  } catch (error) {
    next(error);
  }
});

export default router;
