const Database = require('better-sqlite3');
const path = require('path');

// Use the existing database path
const dbPath = path.resolve(__dirname, '../backend/database/bcs-database.db');
const db = new Database(dbPath);

// --- HELPER: Get Client by Name ---
function getClient(name) {
  if (!name) return null;
  return db.prepare('SELECT * FROM clients WHERE name LIKE ?').get(`%${name}%`);
}

// --- CLIENTS ---
function addClient(data) {
  return db.prepare(
    'INSERT INTO clients (name, email, phone, address, company) VALUES (?, ?, ?, ?, ?)'
  ).run(data.name, data.email, data.phone, data.address, data.company);
}

// --- PROJECTS ---
function createProject(data) {
  const client = getClient(data.client_name);
  const clientId = client ? client.id : null;
  const projectNumber = `PRJ-${Date.now()}`;
  return db.prepare(
    'INSERT INTO projects (client_id, project_number, name, type, notes) VALUES (?, ?, ?, ?, ?)'
  ).run(clientId, projectNumber, data.project_name, data.project_type || 'restoration', data.notes);
}

// --- INVOICES ---
function addInvoice(data) {
  const client = getClient(data.client_name);
  const clientId = client ? client.id : null;
  const invNumber = `INV-${Date.now()}`;
  const total = data.items ? data.items.reduce((s, i) => s + (i.quantity * i.unit_price), 0) : 0;
  
  return db.prepare(
    'INSERT INTO invoices (client_id, invoice_number, amount, due_date, description, status) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(clientId, invNumber, total, data.due_date, data.notes, 'pending');
}

// --- ESTIMATES ---
function addEstimate(data) {
  const client = getClient(data.client_name);
  const clientId = client ? client.id : null;
  const estNumber = `EST-${Date.now()}`;
  return db.prepare(
    'INSERT INTO estimates (client_id, estimate_number, title, total_amount, description, status) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(clientId, estNumber, data.job_type, data.estimated_cost, data.details, 'draft');
}

// --- CALENDAR ---
function scheduleEvent(data) {
  const client = getClient(data.client_name);
  const clientId = client ? client.id : null;
  return db.prepare(
    'INSERT INTO calendar_events (title, event_date, start_time, description, client_id) VALUES (?, ?, ?, ?, ?)'
  ).run(data.title, data.date, data.time, data.description, clientId);
}

// --- WORK ORDERS ---
function createWorkOrder(data) {
  const client = getClient(data.client_name);
  const clientId = client ? client.id : null;
  const woNumber = `WO-${Date.now()}`;
  return db.prepare(
    'INSERT INTO work_orders (client_id, work_order_number, title, description, priority, scheduled_date) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(clientId, woNumber, data.title, data.description, data.priority || 'medium', data.scheduled_date);
}

// --- SEARCH ---
function searchRecords(data) {
  const q = `%${data.query}%`;
  let results = [];
  
  if (data.category === 'clients' || data.category === 'all') {
    const clients = db.prepare('SELECT id, name, email, phone FROM clients WHERE name LIKE ? OR email LIKE ? LIMIT 5').all(q, q);
    results = results.concat(clients.map(c => ({ type: 'Client', ...c })));
  }
  
  if (data.category === 'invoices' || data.category === 'all') {
    const invoices = db.prepare('SELECT id, invoice_number, amount, status FROM invoices WHERE invoice_number LIKE ? LIMIT 5').all(q);
    results = results.concat(invoices.map(i => ({ type: 'Invoice', ...i })));
  }
  
  return results;
}

// --- NOTES ---
function addNote(data) {
  return db.prepare(
    'INSERT INTO notes (title, content, category) VALUES (?, ?, ?)'
  ).run(data.title || 'AI Note', data.content, data.category || 'General');
}

module.exports = { 
  getClient,
  addClient, 
  createProject, 
  addInvoice, 
  addEstimate, 
  scheduleEvent, 
  createWorkOrder, 
  searchRecords, 
  addNote 
};
