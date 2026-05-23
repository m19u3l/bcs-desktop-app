import express from 'express';
import db from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/plans', (_req, res) => {
  res.json([
    { id: 'free',       name: 'Free',       price: 0,    seats: 1,  features: ['5 estimates/mo','SD price list','PDF export'] },
    { id: 'pro',        name: 'Pro',        price: 79,   seats: 3,  features: ['Unlimited estimates','RSMeans database','Competitor pricing','PDF export','Priority support'] },
    { id: 'team',       name: 'Team',       price: 149,  seats: 10, features: ['Everything in Pro','10 users','Custom markup rules','White-label PDF','API access'] },
    { id: 'enterprise', name: 'Enterprise', price: 299,  seats: -1, features: ['Everything in Team','Unlimited users','Dedicated support','Custom integrations','Training'] },
  ]);
});

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const company = req.user?.company_id
      ? await db.get('SELECT * FROM companies WHERE id = ?', [req.user.company_id])
      : null;
    const sub = company
      ? await db.get('SELECT * FROM subscriptions WHERE company_id = ? AND status = "active" ORDER BY id DESC LIMIT 1', [company.id])
      : null;
    res.json({ company, subscription: sub });
  } catch (e) { next(e); }
});

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, phone, city, state, zip, license_number } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const result = await db.run(
      `INSERT INTO companies (name, slug, email, phone, city, state, zip, license_number, plan, plan_seats)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'free', 1)`,
      [name, `${slug}-${Date.now()}`, email, phone, city || 'San Diego', state || 'CA', zip, license_number]
    );
    const company = await db.get('SELECT * FROM companies WHERE id = ?', [result.lastID]);
    await db.run(`INSERT INTO subscriptions (company_id, plan, status, price_monthly) VALUES (?, 'free', 'active', 0)`, [result.lastID]);
    res.status(201).json(company);
  } catch (e) { next(e); }
});

export default router;
