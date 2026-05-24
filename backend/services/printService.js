import htmlPdf from 'html-pdf-node';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const PRINT_OUTPUT_DIR = path.join(__dirname, '../prints');
const UPLOADS_DIR      = path.join(__dirname, '../uploads');

if (!fs.existsSync(PRINT_OUTPUT_DIR)) fs.mkdirSync(PRINT_OUTPUT_DIR, { recursive: true });

const fmt  = n => `$${parseFloat(n || 0).toFixed(2)}`;
const safe = s => String(s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ── Logo handling ─────────────────────────────────────────────────────────────

function logoDataUrl(logoUrl) {
  if (!logoUrl) return null;
  try {
    const candidates = [
      path.isAbsolute(logoUrl) ? logoUrl : null,
      path.join(UPLOADS_DIR, path.basename(logoUrl)),
    ].filter(Boolean);
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        const ext  = path.extname(p).slice(1).toLowerCase().replace('jpg', 'jpeg');
        const data = fs.readFileSync(p).toString('base64');
        return `data:image/${ext};base64,${data}`;
      }
    }
  } catch (_) {}
  return null;
}

// ── Shared CSS ────────────────────────────────────────────────────────────────

const BASE_CSS = `
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Arial, sans-serif; font-size: 12px; color: #333; }
  .page { padding: 32px 40px; max-width: 800px; margin: 0 auto; position: relative; }

  /* Header */
  .brand-header { display:flex; align-items:center; justify-content:space-between; padding-bottom:16px; border-bottom:3px solid var(--accent); margin-bottom:24px; }
  .brand-logo   { max-height:70px; max-width:120px; object-fit:contain; }
  .brand-name   { font-size:22px; font-weight:bold; color:var(--accent); }
  .brand-tag    { font-size:11px; color:#64748b; margin-top:2px; }
  .brand-contact{ text-align:right; font-size:10px; color:#64748b; line-height:1.6; }

  /* Watermark */
  .watermark { position:fixed; top:50%; left:50%; transform:translate(-50%,-50%) rotate(-45deg);
    font-size:90px; font-weight:bold; color:rgba(0,0,0,0.035); white-space:nowrap;
    pointer-events:none; z-index:0; }

  /* Title */
  .doc-title { text-align:center; font-size:26px; font-weight:bold; color:var(--accent); margin-bottom:20px; }

  /* Info grid */
  .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px; }
  .info-box  { padding:14px; background:#f8fafc; border-left:4px solid var(--accent); border-radius:2px; }
  .info-label{ font-weight:bold; color:#64748b; font-size:10px; margin-bottom:2px; text-transform:uppercase; }
  .info-value{ font-size:12px; color:#111; margin-bottom:6px; }

  /* Table */
  table  { width:100%; border-collapse:collapse; margin:12px 0; }
  th     { background:var(--accent); color:#fff; padding:10px 8px; text-align:left; font-size:10px; }
  td     { padding:8px; border-bottom:1px solid #e5e7eb; font-size:11px; vertical-align:top; }
  tr:nth-child(even) { background:#f8fafc; }
  .cat-row td { background:#f0f9ff; font-weight:bold; font-size:10px; text-transform:uppercase; color:#0369a1; padding:5px 8px; }

  /* Totals */
  .totals-wrap { display:flex; justify-content:flex-end; margin-top:16px; }
  .totals      { width:280px; }
  .tot-row     { display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #e5e7eb; font-size:12px; }
  .tot-grand   { background:var(--accent); color:#fff; padding:10px 12px; margin-top:4px; border-radius:2px; display:flex; justify-content:space-between; font-size:14px; font-weight:bold; }

  /* Status badge */
  .badge        { display:inline-block; padding:3px 10px; border-radius:12px; font-size:10px; font-weight:bold; }
  .badge-paid   { background:#d1fae5; color:#065f46; }
  .badge-pending{ background:#fef3c7; color:#92400e; }
  .badge-overdue{ background:#fee2e2; color:#991b1b; }
  .badge-draft  { background:#e0e7ff; color:#3730a3; }

  /* Footer */
  .doc-footer { margin-top:32px; padding-top:14px; border-top:1px solid #e5e7eb; text-align:center; font-size:10px; color:#94a3b8; }
  .page-break { page-break-after: always; }
`;

function buildHeader(s, accentColor = '#1d4ed8') {
  const logoUrl = logoDataUrl(s.logo_url);
  const name    = safe(s.company_name || 'Building Care Solutions');
  const tag     = 'Professional Restoration & Reconstruction';
  const addr    = [s.address_line1, s.city && `${s.city}, ${s.state} ${s.zip || ''}`.trim()].filter(Boolean).join(' · ');
  const contact = [s.phone && `Phone: ${safe(s.phone)}`, s.email && `Email: ${safe(s.email)}`, s.website && safe(s.website), s.license_number && `Lic. #${safe(s.license_number)}`].filter(Boolean).join('<br>');

  return `
    <div class="brand-header">
      <div style="display:flex;align-items:center;gap:14px;">
        ${logoUrl ? `<img src="${logoUrl}" class="brand-logo" alt="logo">` : ''}
        <div>
          <div class="brand-name">${name}</div>
          <div class="brand-tag">${tag}</div>
          ${addr ? `<div class="brand-tag" style="margin-top:2px;">${safe(addr)}</div>` : ''}
        </div>
      </div>
      <div class="brand-contact">${contact}</div>
    </div>`;
}

function buildFooter(s) {
  const name = safe(s.company_name || 'Building Care Solutions');
  const lic  = s.license_number ? ` · Lic. #${safe(s.license_number)}` : '';
  return `<div class="doc-footer"><p>${name}${lic}</p><p style="margin-top:4px;">Thank you for your business!</p></div>`;
}

// ── PDF generator ─────────────────────────────────────────────────────────────

export async function generatePDF(htmlContent, filename, options = {}) {
  const defaultOptions = {
    format: 'Letter',
    margin: { top: '0.4in', right: '0.4in', bottom: '0.4in', left: '0.4in' },
    printBackground: true,
    ...options,
  };
  const pdfBuffer  = await htmlPdf.generatePdf({ content: htmlContent }, defaultOptions);
  const outputPath = path.join(PRINT_OUTPUT_DIR, filename);
  fs.writeFileSync(outputPath, pdfBuffer);
  return { success: true, filename, path: outputPath, size: pdfBuffer.length };
}

// ── Invoice ───────────────────────────────────────────────────────────────────

export async function printInvoice(invoice, client, lineItems = [], settings = {}) {
  const accent = '#1d4ed8';
  const status = (invoice.status || 'pending').toLowerCase();

  const rows = lineItems.map((item, i) => `
    <tr>
      <td>${safe(item.description)}</td>
      <td style="text-align:right;">${safe(item.quantity)}</td>
      <td style="text-align:right;">${safe(item.unit || '')}</td>
      <td style="text-align:right;">${fmt(item.unit_price || item.rate)}</td>
      <td style="text-align:right;">${fmt(item.total || item.amount)}</td>
    </tr>`).join('');

  const subtotal = parseFloat(invoice.subtotal || invoice.amount || 0);
  const tax      = parseFloat(invoice.tax_amount || invoice.tax || 0);
  const total    = parseFloat(invoice.total_amount || invoice.total || invoice.amount || 0);
  const terms    = safe(settings.payment_terms || invoice.payment_terms || 'Net 30 days.');

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
    <style>:root{--accent:${accent};}${BASE_CSS}</style></head>
    <body>
    <div class="page">
      <div class="watermark">${safe((settings.company_name || 'BCS').toUpperCase())}</div>
      ${buildHeader(settings, accent)}
      <div class="doc-title">INVOICE
        <span class="badge badge-${status}" style="font-size:13px;margin-left:12px;">${status.toUpperCase()}</span>
      </div>
      <div class="info-grid">
        <div class="info-box">
          <div class="info-label">Invoice #</div><div class="info-value">${safe(invoice.invoice_number)}</div>
          <div class="info-label">Invoice Date</div><div class="info-value">${new Date(invoice.invoice_date || invoice.created_at).toLocaleDateString()}</div>
          <div class="info-label">Due Date</div><div class="info-value">${invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '—'}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Bill To</div>
          <div class="info-value"><strong>${safe(client?.name)}</strong></div>
          ${client?.company  ? `<div class="info-value">${safe(client.company)}</div>`  : ''}
          ${client?.address  ? `<div class="info-value">${safe(client.address)}</div>`  : ''}
          ${client?.city     ? `<div class="info-value">${safe(client.city)}, ${safe(client.state)} ${safe(client.zip)}</div>` : ''}
          ${client?.email    ? `<div class="info-value">${safe(client.email)}</div>`    : ''}
          ${client?.phone    ? `<div class="info-value">${safe(client.phone)}</div>`    : ''}
        </div>
      </div>
      <table>
        <thead><tr>
          <th>Description</th>
          <th style="text-align:right;width:55px;">Qty</th>
          <th style="text-align:right;width:50px;">Unit</th>
          <th style="text-align:right;width:90px;">Unit Price</th>
          <th style="text-align:right;width:90px;">Total</th>
        </tr></thead>
        <tbody>${rows || '<tr><td colspan="5" style="text-align:center;color:#94a3b8;">No line items</td></tr>'}</tbody>
      </table>
      <div class="totals-wrap"><div class="totals">
        <div class="tot-row"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
        <div class="tot-row"><span>Tax</span><span>${fmt(tax)}</span></div>
        <div class="tot-grand"><span>TOTAL DUE</span><span>${fmt(total)}</span></div>
      </div></div>
      <p style="margin-top:20px;font-size:10px;color:#64748b;">Payment Terms: ${terms}</p>
      ${invoice.notes ? `<p style="margin-top:12px;font-size:11px;"><strong>Notes:</strong> ${safe(invoice.notes)}</p>` : ''}
      ${buildFooter(settings)}
    </div></body></html>`;

  return generatePDF(html, `invoice-${invoice.invoice_number || invoice.id}-${Date.now()}.pdf`);
}

// ── Estimate ──────────────────────────────────────────────────────────────────

export async function printEstimate(estimate, client, lineItems = [], settings = {}) {
  const accent = '#059669';

  let lastCat = null;
  const rows = lineItems.map(item => {
    let catRow = '';
    if (item.category && item.category !== lastCat) {
      catRow = `<tr class="cat-row"><td colspan="5">${safe(item.category)}</td></tr>`;
      lastCat = item.category;
    }
    return catRow + `<tr>
      <td>${safe(item.description)}</td>
      <td style="text-align:right;">${safe(item.qty || item.quantity || 1)}</td>
      <td style="text-align:right;">${safe(item.unit || '')}</td>
      <td style="text-align:right;">${fmt(item.unit_price || item.rate)}</td>
      <td style="text-align:right;">${fmt(item.subtotal || item.total || item.amount)}</td>
    </tr>`;
  }).join('');

  const subtotal = parseFloat(estimate.subtotal || 0);
  const overhead = subtotal * 0.10;
  const profit   = subtotal * 0.12;
  const tax      = parseFloat(estimate.tax_amount || estimate.tax || 0);
  const total    = parseFloat(estimate.total_amount || estimate.total || 0);
  const terms    = safe(estimate.terms || settings.estimates_legal_disclaimer
    || 'Estimate valid 30 days. A 50% deposit is required to begin work.');

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
    <style>:root{--accent:${accent};}${BASE_CSS}</style></head>
    <body>
    <div class="page">
      <div class="watermark">${safe((settings.company_name || 'BCS').toUpperCase())}</div>
      ${buildHeader(settings, accent)}
      <div class="doc-title">PROJECT ESTIMATE</div>
      <div class="info-grid">
        <div class="info-box">
          <div class="info-label">Estimate #</div><div class="info-value">${safe(estimate.estimate_number || estimate.id)}</div>
          <div class="info-label">Date</div><div class="info-value">${new Date(estimate.created_at || Date.now()).toLocaleDateString()}</div>
          <div class="info-label">Valid Until</div><div class="info-value">${estimate.valid_until ? new Date(estimate.valid_until).toLocaleDateString() : '30 days'}</div>
          <div class="info-label">Status</div><div class="info-value"><span class="badge badge-${(estimate.status||'draft').toLowerCase()}">${safe(estimate.status || 'Draft').toUpperCase()}</span></div>
        </div>
        <div class="info-box">
          <div class="info-label">Prepared For</div>
          <div class="info-value"><strong>${safe(client?.name)}</strong></div>
          ${client?.company  ? `<div class="info-value">${safe(client.company)}</div>`  : ''}
          ${client?.address  ? `<div class="info-value">${safe(client.address)}</div>`  : ''}
          ${client?.city     ? `<div class="info-value">${safe(client.city)}, ${safe(client.state)} ${safe(client.zip)}</div>` : ''}
          ${client?.email    ? `<div class="info-value">${safe(client.email)}</div>`    : ''}
          ${client?.phone    ? `<div class="info-value">${safe(client.phone)}</div>`    : ''}
        </div>
      </div>
      ${estimate.description ? `<div style="margin-bottom:16px;padding:12px;background:#f0fdf4;border-left:3px solid #059669;font-size:11px;">${safe(estimate.description)}</div>` : ''}
      <table>
        <thead><tr>
          <th>Description</th>
          <th style="text-align:right;width:55px;">Qty</th>
          <th style="text-align:right;width:50px;">Unit</th>
          <th style="text-align:right;width:90px;">Unit Price</th>
          <th style="text-align:right;width:90px;">Amount</th>
        </tr></thead>
        <tbody>${rows || '<tr><td colspan="5" style="text-align:center;color:#94a3b8;">No line items</td></tr>'}</tbody>
      </table>
      <div class="totals-wrap"><div class="totals">
        <div class="tot-row"><span>Materials / Services</span><span>${fmt(subtotal)}</span></div>
        <div class="tot-row"><span>Overhead (10%)</span><span>${fmt(overhead)}</span></div>
        <div class="tot-row"><span>Profit (12%)</span><span>${fmt(profit)}</span></div>
        <div class="tot-row"><span>Tax (8.75%)</span><span>${fmt(tax)}</span></div>
        <div class="tot-grand"><span>ESTIMATED TOTAL</span><span>${fmt(total)}</span></div>
      </div></div>
      <div style="margin-top:20px;padding:12px;background:#f8fafc;border:1px solid #e2e8f0;font-size:10px;color:#64748b;">
        <strong>Terms & Conditions:</strong> ${terms}
      </div>
      ${buildFooter(settings)}
    </div></body></html>`;

  return generatePDF(html, `estimate-${estimate.estimate_number || estimate.id}-${Date.now()}.pdf`);
}

export default { generatePDF, printInvoice, printEstimate };
