import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path
const DB_DIR = path.join(__dirname, 'database');
const DB_PATH = process.env.DB_PATH || path.join(DB_DIR, 'bcs-database.db');

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
  console.log('📁 Created database directory');
}

// Schema creation SQL
const SCHEMA_SQL = `
-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  company TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  position TEXT,
  hire_date DATE,
  hourly_rate REAL,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Equipment table
CREATE TABLE IF NOT EXISTS equipment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  model TEXT,
  serial_number TEXT,
  purchase_date DATE,
  purchase_cost REAL,
  status TEXT DEFAULT 'available',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Materials table
CREATE TABLE IF NOT EXISTS materials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  unit TEXT DEFAULT 'each',
  unit_price REAL,
  quantity_on_hand INTEGER DEFAULT 0,
  reorder_level INTEGER DEFAULT 10,
  supplier TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  services TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Work Orders table
CREATE TABLE IF NOT EXISTS work_orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER,
  employee_id INTEGER,
  work_order_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  scheduled_date DATE,
  estimated_cost REAL,
  location TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER,
  work_order_id INTEGER,
  invoice_number TEXT UNIQUE NOT NULL,
  amount REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  due_date DATE,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME,
  project_id INTEGER,
  estimate_id INTEGER,
  type TEXT DEFAULT 'invoice',
  subtotal REAL DEFAULT 0,
  tax_rate REAL DEFAULT 0,
  tax_amount REAL DEFAULT 0,
  discount_amount REAL DEFAULT 0,
  total_amount REAL DEFAULT 0,
  amount_paid REAL DEFAULT 0,
  amount_due REAL DEFAULT 0,
  issue_date DATE,
  paid_date DATE,
  notes TEXT,
  payment_terms TEXT,
  created_by INTEGER,
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Estimates table
CREATE TABLE IF NOT EXISTS estimates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER,
  estimate_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  total_amount REAL,
  status TEXT DEFAULT 'draft',
  valid_until DATE,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  project_id INTEGER,
  type TEXT DEFAULT 'estimate',
  subtotal REAL DEFAULT 0,
  tax_rate REAL DEFAULT 0,
  tax_amount REAL DEFAULT 0,
  discount_amount REAL DEFAULT 0,
  terms TEXT,
  created_by INTEGER,
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Change Orders table
CREATE TABLE IF NOT EXISTS change_orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  work_order_id INTEGER,
  change_order_number TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  reason TEXT,
  cost_impact REAL DEFAULT 0,
  time_impact_days INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  requested_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (work_order_id) REFERENCES work_orders(id)
);

-- Price List table
CREATE TABLE IF NOT EXISTS price_list (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  xactimate_code TEXT UNIQUE,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  unit TEXT DEFAULT 'EA',
  unit_price REAL NOT NULL,
  labor_hours REAL DEFAULT 0,
  material_cost REAL DEFAULT 0,
  equipment_cost REAL DEFAULT 0,
  tax_rate REAL DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Xactimate Line Items table
CREATE TABLE IF NOT EXISTS xactimate_line_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  estimate_id INTEGER,
  price_list_id INTEGER,
  xactimate_code TEXT,
  description TEXT NOT NULL,
  quantity REAL NOT NULL,
  unit TEXT DEFAULT 'EA',
  unit_price REAL NOT NULL,
  total_price REAL NOT NULL,
  labor_hours REAL DEFAULT 0,
  overhead_profit REAL DEFAULT 0,
  tax_amount REAL DEFAULT 0,
  line_total REAL NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (estimate_id) REFERENCES estimates(id) ON DELETE CASCADE,
  FOREIGN KEY (price_list_id) REFERENCES price_list(id)
);

-- Pricing Rules table
CREATE TABLE IF NOT EXISTS pricing_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rule_name TEXT NOT NULL,
  category TEXT,
  markup_percentage REAL DEFAULT 0,
  overhead_percentage REAL DEFAULT 10,
  profit_percentage REAL DEFAULT 10,
  tax_percentage REAL DEFAULT 0,
  minimum_charge REAL DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Company Settings table
CREATE TABLE IF NOT EXISTS company_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  company_name TEXT NOT NULL DEFAULT 'Your Company Name',
  business_name TEXT,
  logo_url TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  license_number TEXT,
  ein_tax_id TEXT,
  estimates_legal_disclaimer TEXT DEFAULT 'This estimate is valid for 30 days. Prices subject to change based on material costs and unforeseen conditions.',
  invoices_legal_disclaimer TEXT DEFAULT 'Payment is due upon receipt. Late payments subject to 1.5% monthly finance charge.',
  payment_terms TEXT DEFAULT 'Net 30',
  warranty_text TEXT DEFAULT 'All work is guaranteed for 1 year from date of completion.',
  square_access_token TEXT,
  square_location_id TEXT,
  stripe_api_key TEXT,
  stripe_publishable_key TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  square_app_id TEXT
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id INTEGER,
  payment_method TEXT,
  payment_provider TEXT,
  transaction_id TEXT,
  amount REAL NOT NULL,
  payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'completed',
  notes TEXT,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);

-- Document Templates table
CREATE TABLE IF NOT EXISTS document_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL,
  html_content TEXT,
  css_styles TEXT,
  is_default INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Estimate Line Items table
CREATE TABLE IF NOT EXISTS estimate_line_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  estimate_id INTEGER NOT NULL,
  item_name TEXT NOT NULL,
  description TEXT,
  quantity REAL DEFAULT 1,
  unit_price REAL DEFAULT 0,
  total_price REAL DEFAULT 0,
  category TEXT,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (estimate_id) REFERENCES estimates(id) ON DELETE CASCADE
);

-- Invoice Line Items table
CREATE TABLE IF NOT EXISTS invoice_line_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id INTEGER NOT NULL,
  item_name TEXT NOT NULL,
  description TEXT,
  quantity REAL DEFAULT 1,
  unit_price REAL DEFAULT 0,
  total_price REAL DEFAULT 0,
  category TEXT,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

-- Remediation Dryout table
CREATE TABLE IF NOT EXISTS remediation_dryout (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_number TEXT UNIQUE,
  work_order_id INTEGER,
  client_id INTEGER NOT NULL,
  loss_type TEXT,
  affected_area_sqft REAL,
  category INTEGER,
  start_date TEXT,
  completion_date TEXT,
  moisture_readings TEXT,
  equipment_used TEXT,
  daily_logs TEXT,
  status TEXT DEFAULT 'in_progress',
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (work_order_id) REFERENCES work_orders(id),
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Remediation Reconstruction table
CREATE TABLE IF NOT EXISTS remediation_reconstruction (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_number TEXT UNIQUE,
  dryout_job_id INTEGER,
  work_order_id INTEGER,
  client_id INTEGER NOT NULL,
  scope_of_work TEXT,
  start_date TEXT,
  estimated_completion TEXT,
  actual_completion TEXT,
  permit_number TEXT,
  inspection_dates TEXT,
  status TEXT DEFAULT 'not_started',
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dryout_job_id) REFERENCES remediation_dryout(id),
  FOREIGN KEY (work_order_id) REFERENCES work_orders(id),
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Equipment Logs table
CREATE TABLE IF NOT EXISTS equipment_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER,
  equipment_id INTEGER NOT NULL,
  work_order_id INTEGER,
  deployed_date TEXT,
  retrieved_date TEXT,
  location TEXT,
  readings TEXT,
  hours_used REAL,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (equipment_id) REFERENCES equipment(id),
  FOREIGN KEY (work_order_id) REFERENCES work_orders(id)
);

-- Moisture Logs table
CREATE TABLE IF NOT EXISTS moisture_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER NOT NULL,
  work_order_id INTEGER,
  log_date TEXT NOT NULL,
  location TEXT,
  material_type TEXT,
  moisture_reading REAL,
  target_reading REAL,
  temperature REAL,
  humidity REAL,
  technician TEXT,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (work_order_id) REFERENCES work_orders(id)
);

-- Stored Items table
CREATE TABLE IF NOT EXISTS stored_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER NOT NULL,
  client_id INTEGER NOT NULL,
  work_order_id INTEGER,
  item_description TEXT NOT NULL,
  room TEXT,
  quantity INTEGER DEFAULT 1,
  condition TEXT,
  photo_url TEXT,
  storage_location TEXT,
  packed_date TEXT,
  returned_date TEXT,
  status TEXT DEFAULT 'in_storage',
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (work_order_id) REFERENCES work_orders(id)
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  certificate_number TEXT UNIQUE,
  certificate_type TEXT NOT NULL,
  work_order_id INTEGER,
  client_id INTEGER NOT NULL,
  issue_date TEXT,
  description TEXT,
  issued_by TEXT,
  file_path TEXT,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (work_order_id) REFERENCES work_orders(id),
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Calendar Events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT,
  event_date TEXT NOT NULL,
  start_time TEXT,
  end_time TEXT,
  client_id INTEGER,
  work_order_id INTEGER,
  assigned_to INTEGER,
  location TEXT,
  status TEXT DEFAULT 'scheduled',
  reminder_sent INTEGER DEFAULT 0,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (work_order_id) REFERENCES work_orders(id),
  FOREIGN KEY (assigned_to) REFERENCES employees(id)
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  expense_number TEXT UNIQUE,
  work_order_id INTEGER,
  category TEXT,
  vendor_id INTEGER,
  description TEXT NOT NULL,
  amount REAL NOT NULL,
  expense_date TEXT,
  payment_method TEXT,
  receipt_url TEXT,
  billable INTEGER DEFAULT 0,
  reimbursable INTEGER DEFAULT 0,
  approved INTEGER DEFAULT 0,
  approved_by INTEGER,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (work_order_id) REFERENCES work_orders(id),
  FOREIGN KEY (vendor_id) REFERENCES vendors(id),
  FOREIGN KEY (approved_by) REFERENCES employees(id)
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  priority TEXT DEFAULT 'normal',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  unit_price REAL DEFAULT 0,
  unit_type TEXT DEFAULT 'each',
  taxable INTEGER DEFAULT 1,
  active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT,
  description TEXT,
  location TEXT,
  quantity INTEGER DEFAULT 0,
  unit TEXT DEFAULT 'each',
  cost REAL DEFAULT 0,
  available INTEGER DEFAULT 1,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  parameters TEXT,
  generated_by TEXT,
  file_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Job Tracking table
CREATE TABLE IF NOT EXISTS job_tracking (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  work_order_id INTEGER,
  job_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  assigned_to INTEGER,
  start_date DATE,
  end_date DATE,
  completion_percentage INTEGER DEFAULT 0,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES employees(id) ON DELETE SET NULL
);

-- Line Items table
CREATE TABLE IF NOT EXISTS line_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT NOT NULL,
  quantity REAL DEFAULT 1,
  unit_price REAL DEFAULT 0,
  total REAL DEFAULT 0,
  category TEXT,
  taxable INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Pricing table
CREATE TABLE IF NOT EXISTS pricing (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  base_price REAL DEFAULT 0,
  markup_percentage REAL DEFAULT 0,
  category TEXT,
  effective_date DATE,
  expiration_date DATE,
  active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Xactimate table
CREATE TABLE IF NOT EXISTS xactimate (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  estimate_id INTEGER,
  claim_number TEXT,
  date_of_loss DATE,
  policy_number TEXT,
  insurance_company TEXT,
  adjuster_name TEXT,
  adjuster_phone TEXT,
  rcv_total REAL DEFAULT 0,
  acv_total REAL DEFAULT 0,
  depreciation REAL DEFAULT 0,
  deductible REAL DEFAULT 0,
  tax REAL DEFAULT 0,
  overhead_profit REAL DEFAULT 0,
  net_claim REAL DEFAULT 0,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (estimate_id) REFERENCES estimates(id) ON DELETE CASCADE
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  active INTEGER DEFAULT 1,
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Logs table
CREATE TABLE IF NOT EXISTS logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  level TEXT NOT NULL,
  message TEXT NOT NULL,
  source TEXT,
  user_id INTEGER,
  metadata TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Service Requests table (public intake form submissions)
CREATE TABLE IF NOT EXISTS service_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  address TEXT,
  service_type TEXT NOT NULL,
  preferred_date DATE,
  preferred_time TEXT,
  description TEXT,
  status TEXT DEFAULT 'new',
  client_id INTEGER,
  work_order_id INTEGER,
  calendar_event_id INTEGER,
  source TEXT DEFAULT 'website',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Dry Out Jobs view
CREATE VIEW IF NOT EXISTS dry_out_jobs AS SELECT * FROM remediation_dryout;

-- Insert default company settings if not exists
INSERT OR IGNORE INTO company_settings (id, company_name) VALUES (1, 'Building Care Solutions');
`;

export async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('❌ Error creating database:', err.message);
        reject(err);
        return;
      }

      console.log(`📂 Database path: ${DB_PATH}`);

      // Execute schema
      db.exec(SCHEMA_SQL, (err) => {
        if (err) {
          console.error('❌ Error initializing schema:', err.message);
          reject(err);
          return;
        }

        console.log('✅ Database schema initialized successfully');
        db.close();
        resolve();
      });
    });
  });
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initializeDatabase()
    .then(() => {
      console.log('✅ Database initialization complete');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Database initialization failed:', err);
      process.exit(1);
    });
}
