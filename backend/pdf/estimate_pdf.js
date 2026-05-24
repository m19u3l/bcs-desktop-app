import PDFDocument from 'pdfkit';
import fs from 'fs';
import { applyBranding, drawFooter } from './brand.js';

const fmt = n => `$${parseFloat(n || 0).toFixed(2)}`;

export function generateEstimatePDF(estimateData, outputPath, settings = {}) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'LETTER', margin: 50, autoFirstPage: true });
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // ── Branding header ───────────────────────────────────────────────────
      let y = applyBranding(doc, settings);

      // ── Document title ────────────────────────────────────────────────────
      doc.fontSize(18).fillColor('#059669').font('Helvetica-Bold')
        .text('PROJECT ESTIMATE', 50, y, { align: 'center', width: 512 });
      y += 28;

      // ── Prepared For / Estimate Info ──────────────────────────────────────
      const topY = y;
      doc.fontSize(9).fillColor('#000').font('Helvetica-Bold')
        .text('PREPARED FOR:', 50, topY);
      doc.fontSize(8.5).fillColor('#333').font('Helvetica')
        .text(estimateData.client_name    || '', 50, topY + 14)
        .text(estimateData.client_address || '', 50)
        .text([estimateData.client_city, estimateData.client_state, estimateData.client_zip].filter(Boolean).join(', '), 50)
        .text(estimateData.client_phone   || '', 50)
        .text(estimateData.client_email   || '', 50);

      const labels = ['Estimate #', 'Date', 'Valid Until', 'Status'];
      const values = [
        estimateData.estimate_number || estimateData.id || '—',
        estimateData.estimate_date   || estimateData.created_at?.slice(0, 10) || '—',
        estimateData.valid_until     || '—',
        estimateData.status          || 'Draft',
      ];
      doc.fontSize(9).fillColor('#000').font('Helvetica-Bold');
      labels.forEach((l, i) => doc.text(l + ':', 360, topY + i * 14));
      doc.fontSize(8.5).fillColor('#059669').font('Helvetica');
      values.forEach((v, i) => doc.text(String(v), 440, topY + i * 14));

      y = topY + 70;

      // ── Project description ───────────────────────────────────────────────
      if (estimateData.description || estimateData.project_description) {
        const desc = estimateData.description || estimateData.project_description;
        doc.fontSize(9).fillColor('#000').font('Helvetica-Bold').text('PROJECT DESCRIPTION:', 50, y);
        doc.fontSize(8.5).fillColor('#333').font('Helvetica').text(desc, 50, y + 13, { width: 512 });
        y += 13 + Math.ceil(desc.length / 85) * 11 + 8;
      }

      // ── Line items table ──────────────────────────────────────────────────
      y += 6;
      const COL = { desc: 50, qty: 270, unit: 318, rate: 378, amount: 458 };
      const TW  = 512;

      doc.rect(50, y, TW, 20).fillAndStroke('#059669', '#059669');
      doc.fontSize(8.5).fillColor('#fff').font('Helvetica-Bold')
        .text('Description', COL.desc + 4, y + 5, { width: 215 })
        .text('Qty',         COL.qty  + 4, y + 5, { width: 43,  align: 'right' })
        .text('Unit',        COL.unit + 4, y + 5, { width: 55,  align: 'right' })
        .text('Unit Price',  COL.rate + 4, y + 5, { width: 75,  align: 'right' })
        .text('Amount',      COL.amount+4, y + 5, { width: 100, align: 'right' });
      y += 24;

      const lineItems = estimateData.line_items || [];
      let lastCategory = null;
      doc.font('Helvetica');

      lineItems.forEach((item, i) => {
        if (y > 700) {
          drawFooter(doc, settings);
          doc.addPage();
          y = applyBranding(doc, settings) + 10;
          lastCategory = null;
        }
        // Category sub-header
        if (item.category && item.category !== lastCategory) {
          doc.rect(50, y, TW, 14).fillAndStroke('#f0fdf4', '#d1fae5');
          doc.fontSize(7.5).fillColor('#065f46').font('Helvetica-Bold')
            .text(item.category.toUpperCase(), COL.desc + 4, y + 3, { width: TW - 8 });
          y += 16;
          lastCategory = item.category;
        }
        const bg = i % 2 === 0 ? '#ffffff' : '#f8fafc';
        doc.rect(50, y - 2, TW, 16).fillAndStroke(bg, '#e2e8f0');
        doc.fontSize(8).fillColor('#333').font('Helvetica')
          .text(item.description || '', COL.desc + 4, y, { width: 215 })
          .text(String(item.qty || item.quantity || 1), COL.qty + 4, y, { width: 43, align: 'right' })
          .text(item.unit || '', COL.unit + 4, y, { width: 55, align: 'right' })
          .text(fmt(item.unit_price || item.rate), COL.rate + 4, y, { width: 75, align: 'right' })
          .text(fmt(item.subtotal   || item.amount), COL.amount + 4, y, { width: 100, align: 'right' });
        y += 16;
      });

      // ── Totals ────────────────────────────────────────────────────────────
      y += 12;
      const totX = 380;
      const totW = 180;
      const totRows = [
        ['Subtotal',        fmt(estimateData.subtotal),                          false],
        ['Overhead (10%)',  fmt((estimateData.subtotal || 0) * 0.10),            false],
        ['Profit (12%)',    fmt((estimateData.subtotal || 0) * 0.12),            false],
        ['Tax (8.75%)',     fmt(estimateData.tax_amount || estimateData.tax),    false],
        ['TOTAL',           fmt(estimateData.total_amount || estimateData.total), true],
      ];
      totRows.forEach(([label, value, bold]) => {
        if (bold) {
          doc.rect(totX - 4, y - 2, totW + 8, 18).fillAndStroke('#f0fdf4', '#d1fae5');
        }
        doc.fontSize(bold ? 10 : 8.5)
          .fillColor(bold ? '#059669' : '#333')
          .font(bold ? 'Helvetica-Bold' : 'Helvetica')
          .text(label, totX, y, { width: 95 })
          .text(value, totX + 95, y, { width: totW - 95, align: 'right' });
        y += bold ? 18 : 13;
      });

      // ── Terms ─────────────────────────────────────────────────────────────
      const terms = estimateData.terms
        || settings.estimates_legal_disclaimer
        || 'Estimate valid 30 days. A 50% deposit is required to begin work. Final pricing may vary based on conditions discovered during work.';
      y += 14;
      if (y < 690) {
        doc.fontSize(9).fillColor('#000').font('Helvetica-Bold').text('TERMS & CONDITIONS:', 50, y);
        doc.fontSize(8).fillColor('#64748b').font('Helvetica').text(terms, 50, y + 13, { width: 512 });
      }

      // ── Footer ────────────────────────────────────────────────────────────
      drawFooter(doc, settings, 1, 1);

      doc.end();
      stream.on('finish', () => resolve(outputPath));
      stream.on('error', reject);
    } catch (err) { reject(err); }
  });
}

export default generateEstimatePDF;
