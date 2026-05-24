/**
 * BCS PDF Branding Module
 * Shared header, footer, and watermark drawn on every page.
 * Call applyBranding() once per document before writing content.
 */
import path from 'path';
import fs   from 'fs';
import { fileURLToPath } from 'url';

const __dirname   = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

const BRAND_BLUE  = '#1d4ed8';
const BRAND_DARK  = '#0f172a';
const MUTED       = '#64748b';
const PAGE_W      = 612;  // LETTER width in points
const PAGE_H      = 792;  // LETTER height
const MARGIN      = 50;
const FOOTER_Y    = PAGE_H - 50;

function resolveLogoPath(logoUrl) {
  if (!logoUrl) return null;
  // Absolute local path
  if (path.isAbsolute(logoUrl) && fs.existsSync(logoUrl)) return logoUrl;
  // Filename only → look in uploads dir
  const local = path.join(UPLOADS_DIR, path.basename(logoUrl));
  if (fs.existsSync(local)) return local;
  return null;
}

function addr(s) {
  const parts = [];
  if (s.address_line1) parts.push(s.address_line1);
  if (s.address_line2) parts.push(s.address_line2);
  const cityLine = [s.city, s.state, s.zip].filter(Boolean).join(', ');
  if (cityLine) parts.push(cityLine);
  return parts.join(' · ');
}

/**
 * Draw the branded header. Returns Y position where body content should begin.
 */
export function drawHeader(doc, settings = {}) {
  const name    = settings.company_name || 'Building Care Solutions';
  const phone   = settings.phone   || '';
  const email   = settings.email   || '';
  const website = settings.website || '';
  const lic     = settings.license_number || '';
  const address = addr(settings);
  const logoPath = resolveLogoPath(settings.logo_url);

  let logoRight = MARGIN;

  // Logo (if available)
  if (logoPath) {
    try {
      doc.image(logoPath, MARGIN, MARGIN, { fit: [80, 60], align: 'left', valign: 'top' });
      logoRight = MARGIN + 90;
    } catch (_) { /* logo missing or unreadable — skip */ }
  }

  // Company name
  doc.fontSize(20)
    .fillColor(BRAND_BLUE)
    .font('Helvetica-Bold')
    .text(name, logoRight, MARGIN, { align: logoPath ? 'left' : 'center', width: logoPath ? PAGE_W - logoRight - MARGIN : PAGE_W - MARGIN * 2 });

  // Tagline
  const tagY = MARGIN + 26;
  doc.fontSize(9)
    .fillColor(MUTED)
    .font('Helvetica')
    .text('Professional Restoration & Reconstruction', logoRight, tagY, {
      align: logoPath ? 'left' : 'center',
      width: logoPath ? PAGE_W - logoRight - MARGIN : PAGE_W - MARGIN * 2,
    });

  // Contact line (right-aligned block on same row as name, or centered below)
  const contactLines = [
    phone && `Phone: ${phone}`,
    email && `Email: ${email}`,
    website && website,
    lic && `Lic. #${lic}`,
  ].filter(Boolean);

  const contactX = PAGE_W - MARGIN - 180;
  let contactY   = MARGIN;
  doc.fontSize(8).fillColor(MUTED).font('Helvetica');
  for (const line of contactLines) {
    doc.text(line, contactX, contactY, { width: 180, align: 'right' });
    contactY += 11;
  }

  // Address line
  if (address) {
    doc.fontSize(8)
      .fillColor(MUTED)
      .text(address, MARGIN, tagY + 14, { align: logoPath ? 'left' : 'center', width: PAGE_W - MARGIN * 2 });
  }

  // Horizontal rule
  const ruleY = MARGIN + 68;
  doc.moveTo(MARGIN, ruleY)
    .lineTo(PAGE_W - MARGIN, ruleY)
    .strokeColor(BRAND_BLUE)
    .lineWidth(1.5)
    .stroke();

  return ruleY + 12;  // caller starts body content here
}

/**
 * Draw footer at the bottom of the current page.
 * Call once per page (or register on pageAdded).
 */
export function drawFooter(doc, settings = {}, pageNum = 1, totalPages = 1) {
  const name    = settings.company_name || 'Building Care Solutions';
  const lic     = settings.license_number ? ` · Lic. #${settings.license_number}` : '';
  const website = settings.website || '';
  const disclaimer = settings.invoices_legal_disclaimer || settings.estimates_legal_disclaimer || '';

  doc.fontSize(7.5)
    .fillColor(MUTED)
    .font('Helvetica');

  // Left: company name + lic
  doc.text(`${name}${lic}`, MARGIN, FOOTER_Y, { width: 250, align: 'left' });

  // Center: website
  if (website) {
    doc.text(website, MARGIN, FOOTER_Y, { width: PAGE_W - MARGIN * 2, align: 'center' });
  }

  // Right: page number
  doc.text(`Page ${pageNum} of ${totalPages}`, MARGIN, FOOTER_Y, { width: PAGE_W - MARGIN * 2, align: 'right' });

  // Top rule of footer
  doc.moveTo(MARGIN, FOOTER_Y - 6)
    .lineTo(PAGE_W - MARGIN, FOOTER_Y - 6)
    .strokeColor('#e2e8f0')
    .lineWidth(0.75)
    .stroke();

  // Disclaimer (second line)
  if (disclaimer) {
    doc.fontSize(6.5)
      .fillColor('#94a3b8')
      .text(disclaimer, MARGIN, FOOTER_Y + 11, { width: PAGE_W - MARGIN * 2, align: 'center' });
  }
}

/**
 * Registers a watermark on every page.
 * Call BEFORE writing any content, immediately after doc creation.
 * @param {PDFDocument} doc
 * @param {string} text  Watermark text (default: company name)
 */
export function registerWatermark(doc, text = 'BUILDING CARE SOLUTIONS') {
  const drawWM = () => {
    doc.save();
    // Rotate around center
    doc.translate(PAGE_W / 2, PAGE_H / 2)
      .rotate(-45);
    doc.fontSize(72)
      .fillColor('#e2e8f0')   // very light gray
      .font('Helvetica-Bold')
      .text(text, -260, -36, { width: 520, align: 'center', lineBreak: false });
    doc.restore();
  };

  doc.on('pageAdded', drawWM);
  drawWM();  // also draw on the first page
}

/**
 * Full branding setup: watermark + header.
 * Returns the Y coordinate where body content should begin.
 */
export function applyBranding(doc, settings = {}, { watermark = false } = {}) {
  if (watermark) {
    registerWatermark(doc, (settings.company_name || 'BCS').toUpperCase());
  }
  return drawHeader(doc, settings);
}
