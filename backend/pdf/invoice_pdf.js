import PDFDocument from 'pdfkit';
import fs from 'fs';
import { applyBranding, drawFooter } from './brand.js';

const fmt = n => `$${parseFloat(n || 0).toFixed(2)}`;

export function generateInvoicePDF(invoiceData, outputPath, settings = {}) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'LETTER', margin: 50, autoFirstPage: true });
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // ── Branding header ───────────────────────────────────────────────────
      let y = applyBranding(doc, settings);

      // ── Document title ────────────────────────────────────────────────────
      doc.fontSize(18).fillColor('#1e40af').font('Helvetica-Bold')
        .text('INVOICE', 50, y, { align: 'center', width: 512 });
      y += 28;

      // ── Bill To / Invoice Info ────────────────────────────────────────────
      const topY = y;
      doc.fontSize(9).fillColor('#000').font('Helvetica-Bold')
        .text('BILL TO:', 50, topY);
      doc.fontSize(8.5).fillColor('#333').font('Helvetica')
        .text(invoiceData.client_name    || '', 50, topY + 14)
        .text(invoiceData.client_address || '', 50)
        .text([invoiceData.client_city, invoiceData.client_state, invoiceData.client_zip].filter(Boolean).join(', '), 50)
        .text(invoiceData.client_phone   || '', 50)
        .text(invoiceData.client_email   || '', 50);

      const labels = ['Invoice #', 'Invoice Date', 'Due Date', 'Status'];
      const values = [
        invoiceData.invoice_number || '—',
        invoiceData.invoice_date   || '—',
        invoiceData.due_date       || '—',
        invoiceData.status         || 'Pending',
      ];
      doc.fontSize(9).fillColor('#000').font('Helvetica-Bold');
      labels.forEach((l, i) => doc.text(l + ':', 360, topY + i * 14));
      doc.fontSize(8.5).fillColor('#1e40af').font('Helvetica');
      values.forEach((v, i) => doc.text(v, 440, topY + i * 14));

      y = topY + 70;

      // ── Line items table ──────────────────────────────────────────────────
      const COL = { desc: 50, qty: 290, unit: 340, rate: 390, amount: 470 };
      const TW  = 512;

      // Header row
      doc.rect(50, y, TW, 20).fillAndStroke('#1e40af', '#1e40af');
      doc.fontSize(8.5).fillColor('#fff').font('Helvetica-Bold')
        .text('Description', COL.desc + 4, y + 5, { width: 235 })
        .text('Qty',         COL.qty  + 4, y + 5, { width: 45,  align: 'right' })
        .text('Unit',        COL.unit + 4, y + 5, { width: 45,  align: 'right' })
        .text('Rate',        COL.rate + 4, y + 5, { width: 75,  align: 'right' })
        .text('Amount',      COL.amount+4, y + 5, { width: 90,  align: 'right' });
      y += 24;

      const lineItems = invoiceData.line_items || [];
      doc.font('Helvetica');
      lineItems.forEach((item, i) => {
        if (y > 700) {
          drawFooter(doc, settings);
          doc.addPage();
          y = applyBranding(doc, settings) + 10;
        }
        const bg = i % 2 === 0 ? '#f8fafc' : '#ffffff';
        doc.rect(50, y - 3, TW, 18).fillAndStroke(bg, '#e2e8f0');
        doc.fontSize(8).fillColor('#333')
          .text(item.description || '', COL.desc + 4, y, { width: 235 })
          .text(String(item.quantity || 1), COL.qty + 4, y, { width: 45, align: 'right' })
          .text(item.unit || '', COL.unit + 4, y, { width: 45, align: 'right' })
          .text(fmt(item.rate),   COL.rate + 4,   y, { width: 75,  align: 'right' })
          .text(fmt(item.amount), COL.amount + 4, y, { width: 90,  align: 'right' });
        y += 18;
      });

      // ── Totals ────────────────────────────────────────────────────────────
      y += 10;
      const totX = 390;
      const totW = 170;
      const rows = [
        ['Subtotal', fmt(invoiceData.subtotal), false],
        ['Tax',      fmt(invoiceData.tax_amount || invoiceData.tax), false],
        ['TOTAL',    fmt(invoiceData.total_amount || invoiceData.total), true],
      ];
      rows.forEach(([label, value, bold]) => {
        doc.fontSize(bold ? 10 : 8.5)
          .fillColor(bold ? '#1e40af' : '#333')
          .font(bold ? 'Helvetica-Bold' : 'Helvetica')
          .text(label, totX, y, { width: 80 })
          .text(value, totX + 80, y, { width: totW - 80, align: 'right' });
        y += bold ? 16 : 13;
      });

      // ── Notes ─────────────────────────────────────────────────────────────
      if (invoiceData.notes) {
        y += 12;
        doc.fontSize(9).fillColor('#000').font('Helvetica-Bold').text('Notes:', 50, y);
        doc.fontSize(8.5).fillColor('#333').font('Helvetica').text(invoiceData.notes, 50, y + 13, { width: 512 });
      }

      // ── Payment terms ─────────────────────────────────────────────────────
      const terms = settings.payment_terms || 'Net 30 days. Late fees may apply.';
      doc.fontSize(7.5).fillColor('#64748b').font('Helvetica')
        .text(`Payment Terms: ${terms}`, 50, 730, { align: 'center', width: 512 });

      // ── Footer ────────────────────────────────────────────────────────────
      drawFooter(doc, settings, 1, 1);

      doc.end();
      stream.on('finish', () => resolve(outputPath));
      stream.on('error', reject);
    } catch (err) { reject(err); }
  });
}

export default generateInvoicePDF;
