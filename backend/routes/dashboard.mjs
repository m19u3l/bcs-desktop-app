import express from 'express';
import db from '../db.js';

const router = express.Router();

// ── helpers ───────────────────────────────────────────────────────────────
const num  = v => parseFloat(v) || 0;
const int  = v => parseInt(v)   || 0;
const safe = fn => { try { return fn(); } catch { return null; } };

// ── GET /api/dashboard/stats ──────────────────────────────────────────────
// Returns all fields the UI stat cards read directly.
router.get('/stats', async (req, res, next) => {
  try {
    // ── Counts ──────────────────────────────────────────────────────────
    const [
      clients,
      employees,
      totalWO,
      activeJobs,
      openClaims,
      completedWO,
      pendingEstimates,
      totalEstimates,
    ] = await Promise.all([
      db.get('SELECT COUNT(*) AS n FROM clients'),
      db.get('SELECT COUNT(*) AS n FROM employees'),
      db.get('SELECT COUNT(*) AS n FROM work_orders'),
      db.get("SELECT COUNT(*) AS n FROM work_orders WHERE status = 'in_progress'"),
      db.get("SELECT COUNT(*) AS n FROM work_orders WHERE status NOT IN ('completed','cancelled')"),
      db.get("SELECT COUNT(*) AS n FROM work_orders WHERE status = 'completed'"),
      db.get("SELECT COUNT(*) AS n FROM estimates  WHERE status NOT IN ('approved','cancelled')"),
      db.get('SELECT COUNT(*) AS n FROM estimates'),
    ]);

    // ── Invoice stats ────────────────────────────────────────────────────
    const [
      paidInv,
      pendingInv,
      overdueInv,
    ] = await Promise.all([
      db.get(`SELECT COUNT(*) AS n, COALESCE(SUM(total_amount),0) AS total
              FROM invoices WHERE status = 'paid'`),
      db.get(`SELECT COUNT(*) AS n, COALESCE(SUM(total_amount),0) AS total
              FROM invoices WHERE status IN ('pending','sent')`),
      db.get(`SELECT COUNT(*) AS n, COALESCE(SUM(total_amount),0) AS total
              FROM invoices
              WHERE status NOT IN ('paid','cancelled')
                AND due_date IS NOT NULL
                AND date(due_date) < date('now')`),
    ]);

    // ── Revenue: this month vs last month ────────────────────────────────
    const [thisMonth, lastMonth] = await Promise.all([
      db.get(`SELECT COALESCE(SUM(total_amount),0) AS total FROM invoices
              WHERE status = 'paid'
                AND strftime('%Y-%m', paid_date) = strftime('%Y-%m','now')`),
      db.get(`SELECT COALESCE(SUM(total_amount),0) AS total FROM invoices
              WHERE status = 'paid'
                AND strftime('%Y-%m', paid_date) = strftime('%Y-%m','now','-1 month')`),
    ]);

    const thisRev = num(thisMonth?.total);
    const lastRev = num(lastMonth?.total);
    const revChangePct = lastRev > 0
      ? Math.round(((thisRev - lastRev) / lastRev) * 100)
      : null;

    // ── Avg job value (completed, paid invoices) ─────────────────────────
    const avgJob = safe(() => db.get(`
      SELECT AVG(i.total_amount) AS avg
      FROM invoices i
      JOIN work_orders wo ON i.work_order_id = wo.id
      WHERE wo.status = 'completed' AND i.status = 'paid'
    `));

    // ── Completion rate ──────────────────────────────────────────────────
    const totalWOCount = int(totalWO?.n);
    const completionRate = totalWOCount > 0
      ? Math.round((int(completedWO?.n) / totalWOCount) * 100)
      : 0;

    res.json({
      // ── Stat card fields (read directly by dashboard UI) ──
      active_jobs:        int(activeJobs?.n),
      pending_estimates:  int(pendingEstimates?.n),
      pending_invoices:   int(pendingInv?.n),
      open_claims:        int(openClaims?.n),

      // ── Revenue ──
      total_revenue:       num(paidInv?.total),
      pending_revenue:     num(pendingInv?.total),
      overdue_amount:      num(overdueInv?.total),
      this_month_revenue:  thisRev,
      last_month_revenue:  lastRev,
      revenue_change_pct:  revChangePct,

      // ── Counts ──
      total_clients:       int(clients?.n),
      total_employees:     int(employees?.n),
      total_work_orders:   totalWOCount,
      total_invoices:      int(paidInv?.n) + int(pendingInv?.n),
      total_estimates:     int(totalEstimates?.n),
      completed_jobs:      int(completedWO?.n),
      overdue_count:       int(overdueInv?.n),
      paid_invoices_count: int(paidInv?.n),
      completion_rate:     completionRate,
      avg_job_value:       Math.round(num(avgJob?.avg)),
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/dashboard/revenue-trend ─────────────────────────────────────
// Monthly paid revenue for the last 6 months — for charts.
router.get('/revenue-trend', async (req, res, next) => {
  try {
    const rows = await db.all(`
      SELECT
        strftime('%Y-%m', paid_date)            AS month,
        COALESCE(SUM(total_amount), 0)          AS revenue,
        COUNT(*)                                AS invoice_count
      FROM invoices
      WHERE status = 'paid'
        AND paid_date IS NOT NULL
        AND paid_date >= date('now', '-6 months')
      GROUP BY strftime('%Y-%m', paid_date)
      ORDER BY month ASC
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ── GET /api/dashboard/recent-activity ───────────────────────────────────
router.get('/recent-activity', async (req, res, next) => {
  try {
    const rows = await db.all(`
      SELECT
        wo.id,
        wo.work_order_number,
        wo.title,
        wo.status,
        wo.created_at,
        c.name  AS client_name,
        'work_order' AS entity_type,
        (wo.title || ' — ' || wo.status) AS description
      FROM work_orders wo
      LEFT JOIN clients c ON wo.client_id = c.id
      ORDER BY wo.created_at DESC
      LIMIT 15
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ── GET /api/dashboard/recent-payments ───────────────────────────────────
router.get('/recent-payments', async (req, res, next) => {
  try {
    const rows = await db.all(`
      SELECT
        i.id,
        i.invoice_number,
        COALESCE(i.total_amount, i.amount, 0) AS amount,
        i.status,
        i.paid_date,
        i.updated_at,
        c.name AS client_name
      FROM invoices i
      LEFT JOIN clients c ON i.client_id = c.id
      WHERE i.status = 'paid'
      ORDER BY COALESCE(i.paid_date, i.updated_at) DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ── GET /api/dashboard/past-due-invoices ─────────────────────────────────
router.get('/past-due-invoices', async (req, res, next) => {
  try {
    const rows = await db.all(`
      SELECT
        i.id,
        i.invoice_number,
        COALESCE(i.total_amount, i.amount, 0) AS amount,
        i.status,
        i.due_date,
        c.name  AS client_name,
        c.phone AS client_phone,
        c.email AS client_email,
        CAST(julianday('now') - julianday(i.due_date) AS INTEGER) AS days_overdue
      FROM invoices i
      LEFT JOIN clients c ON i.client_id = c.id
      WHERE i.status NOT IN ('paid','cancelled')
        AND i.due_date IS NOT NULL
        AND date(i.due_date) < date('now')
      ORDER BY i.due_date ASC
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ── GET /api/dashboard/recent-transactions ───────────────────────────────
router.get('/recent-transactions', async (req, res, next) => {
  try {
    const rows = await db.all(`
      SELECT
        i.id,
        i.invoice_number,
        COALESCE(i.total_amount, i.amount, 0) AS amount,
        i.status,
        i.due_date,
        i.created_at,
        c.name  AS client_name,
        wo.work_order_number,
        'invoice' AS transaction_type
      FROM invoices i
      LEFT JOIN clients c  ON i.client_id    = c.id
      LEFT JOIN work_orders wo ON i.work_order_id = wo.id
      ORDER BY i.created_at DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ── GET /api/dashboard (legacy — kept for backwards compat) ──────────────
router.get('/', async (req, res, next) => {
  try {
    const [clients, workOrders, invoices, revenue] = await Promise.all([
      db.get('SELECT COUNT(*) AS count FROM clients'),
      db.get('SELECT COUNT(*) AS count FROM work_orders'),
      db.get('SELECT COUNT(*) AS count FROM invoices'),
      db.get("SELECT COALESCE(SUM(total_amount),0) AS total FROM invoices WHERE status='paid'"),
    ]);
    res.json({
      totalClients:    int(clients?.count),
      totalWorkOrders: int(workOrders?.count),
      totalInvoices:   int(invoices?.count),
      totalRevenue:    num(revenue?.total),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
