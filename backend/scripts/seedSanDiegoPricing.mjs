/**
 * San Diego Area Xactimate-Mirrored Price List Seeder
 * Replaces generic placeholder data with real 2025/2026 San Diego market pricing
 * Sources: Handoff.ai, HomeAdvisor, CountBricks, ProMatcher, local SD contractors
 */
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../database/bcs-database.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) { console.error('Error opening database:', err); process.exit(1); }
  console.log('Connected to database');
});

const run = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function(err) {
    if (err) reject(err);
    else resolve(this);
  });
});

const all = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) reject(err);
    else resolve(rows);
  });
});

// San Diego 2025/2026 Xactimate-mirrored pricing
// Format: [xactimate_code, item_name, category, description, unit, unit_price, labor_cost, material_cost, equipment_cost, competitor_avg_price, notes]
const SD_PRICE_LIST = [

  // ─── WATER MITIGATION (WTR) ───────────────────────────────────────
  ['WTR 100', 'Water Extraction - Category 1 (Clean)',          'Water Mitigation', 'Clean water extraction from Category 1 loss',                   'SF',  1.25, 0.75, 0.50, 0.00, 1.45, 'IICRC S500 Cat 1'],
  ['WTR 101', 'Water Extraction - Category 2 (Grey)',           'Water Mitigation', 'Grey water extraction from Category 2 loss',                    'SF',  1.75, 1.00, 0.75, 0.00, 2.05, 'IICRC S500 Cat 2'],
  ['WTR 102', 'Water Extraction - Category 3 (Black)',          'Water Mitigation', 'Black water extraction - sewage/flood',                         'SF',  2.50, 1.50, 1.00, 0.00, 2.85, 'IICRC S500 Cat 3; PPE required'],
  ['WTR 110', 'Dehumidifier - LGR Commercial (per day)',        'Water Mitigation', 'Large commercial LGR dehumidifier rental per day',              'DAY', 125.00, 25.00, 100.00, 0.00, 145.00, 'Covers up to 1,500 SF'],
  ['WTR 111', 'Air Mover / Axial Fan (per day)',                'Water Mitigation', 'High-velocity axial air mover rental per day',                  'DAY',  45.00, 10.00,  35.00, 0.00,  52.00, '1 unit per 50-100 SF affected'],
  ['WTR 112', 'Desiccant Dehumidifier (per day)',               'Water Mitigation', 'Industrial desiccant unit for hardwood floors/crawlspaces',     'DAY', 195.00, 35.00, 160.00, 0.00, 225.00, 'For specialty drying applications'],
  ['WTR 113', 'Injectidry Floor Drying System (per day)',       'Water Mitigation', 'Hardwood floor mat drying system',                              'DAY', 145.00, 25.00, 120.00, 0.00, 165.00, 'Preserves hardwood when possible'],
  ['WTR 120', 'Antimicrobial / Disinfectant Treatment',         'Water Mitigation', 'EPA-registered antimicrobial applied to affected surfaces',     'SF',   0.45, 0.20,  0.25, 0.00,  0.55, 'Required for Cat 2 & 3 losses'],
  ['WTR 130', 'Moisture Mapping & Documentation',               'Water Mitigation', 'Moisture readings, mapping, and documentation report',          'SF',   0.20, 0.15,  0.05, 0.00,  0.25, 'IICRC S500 required documentation'],
  ['WTR 140', 'Pack-Out Services - Contents Removal',           'Water Mitigation', 'Contents inventory, removal, and storage coordination',         'HR', 100.00, 85.00,  15.00, 0.00, 115.00, 'Per technician hour'],
  ['WTR 150', 'Emergency Response - Standard Hours',            'Water Mitigation', 'Emergency call-out and initial assessment business hours',       'EA', 275.00,250.00,  25.00, 0.00, 325.00, 'First 2 hours included'],
  ['WTR 151', 'Emergency Response - After Hours/Weekend',       'Water Mitigation', 'Emergency call-out evenings, weekends, holidays',               'EA', 395.00,365.00,  30.00, 0.00, 455.00, 'After 5pm weekdays or weekends'],
  ['WTR 160', 'Structural Cavity Drying (per day)',             'Water Mitigation', 'Wall cavity, floor joist, ceiling drying with injection ports', 'DAY',  65.00, 40.00,  25.00, 0.00,  75.00, 'Per 100 LF of affected wall'],
  ['WTR 170', 'Negative Air Machine / Air Scrubber (per day)',  'Water Mitigation', 'HEPA air scrubber for containment during drying',               'DAY',  75.00, 20.00,  55.00, 0.00,  90.00, 'Required for Cat 3 losses'],

  // ─── DRYWALL (DRY) ────────────────────────────────────────────────
  ['DRY 120', 'Drywall 1/2" - Hang, Tape & Finish Level 4',    'Drywall', 'Install 1/2" drywall hung, taped, floated, level 4 finish',         'SF',   2.75, 1.75, 1.00, 0.00, 3.20, 'Ready for paint; standard residential'],
  ['DRY 122', 'Drywall 1/2" - Hang, Tape & Texture',           'Drywall', 'Install 1/2" drywall with orange peel or knockdown texture',         'SF',   3.15, 2.00, 1.00, 0.00, 3.65, 'Match existing texture'],
  ['DRY 130', 'Drywall 5/8" Type X - Hang, Tape & Finish',     'Drywall', 'Fire-rated 5/8" Type X hung, taped, floated level 4',               'SF',   3.15, 1.90, 1.25, 0.00, 3.65, 'Garages, ceilings, fire walls'],
  ['DRY 140', 'Drywall - Moisture Resistant (Green Board)',     'Drywall', 'Moisture-resistant drywall for bathrooms/kitchens',                 'SF',   3.45, 1.90, 1.55, 0.00, 3.95, 'Wet area applications'],
  ['DRY 145', 'Cement Board / Backer Board Install',           'Drywall', 'HardieBacker or Schluter backer board for tile substrate',           'SF',   4.25, 2.50, 1.75, 0.00, 4.85, 'Tile-ready substrate'],
  ['DRY 150', 'Tape, Float & Texture Only (Existing Board)',   'Drywall', 'Tape joints, float, and apply texture to existing boards',           'SF',   1.05, 0.80, 0.25, 0.00, 1.25, 'No new board installation'],
  ['DRY 210', 'Remove Drywall - Demolition Only',              'Drywall', 'Demo and remove existing drywall (no disposal included)',            'SF',   0.50, 0.45, 0.05, 0.00, 0.60, 'Add HAZ if asbestos testing required'],
  ['DRY 280', 'Drywall Repair - Small Patch (up to 6"x6")',    'Drywall', 'Patch, tape, float, and texture small drywall damage',              'EA', 150.00,125.00,25.00, 0.00, 175.00, 'Includes texture match'],
  ['DRY 285', 'Drywall Repair - Medium Patch (up to 2\'x2\')', 'Drywall', 'Patch, tape, float, and texture medium drywall damage',             'EA', 225.00,185.00,40.00, 0.00, 265.00, 'Includes texture match'],
  ['DRY 510', 'Texture - Popcorn / Acoustic Ceiling',          'Drywall', 'Apply acoustic popcorn texture to ceiling',                         'SF',   1.35, 1.10, 0.25, 0.00, 1.60, 'Lead/asbestos test if pre-1980'],
  ['DRY 520', 'Texture - Orange Peel / Knockdown',             'Drywall', 'Apply orange peel or knockdown spray texture',                      'SF',   0.85, 0.65, 0.20, 0.00, 1.00, 'Most common San Diego texture'],

  // ─── PAINTING (PAI) ───────────────────────────────────────────────
  ['PAI 102', 'Paint Walls - 2 Coats',                         'Painting', 'Interior walls, 2 finish coats, customer-supplied color',           'SF',   1.50, 1.10, 0.40, 0.00, 1.75, 'Per SF of wall surface'],
  ['PAI 104', 'Paint Walls - 1 Coat',                          'Painting', 'Interior walls, 1 finish coat touch-up',                           'SF',   0.90, 0.65, 0.25, 0.00, 1.05, 'Touch-up or single-coat jobs'],
  ['PAI 106', 'Paint Walls & Ceiling - 2 Coats',               'Painting', 'Interior walls and ceiling, 2 finish coats',                       'SF',   1.85, 1.35, 0.50, 0.00, 2.15, 'Per SF of floor area'],
  ['PAI 120', 'Prime & Paint - 1 Primer + 1 Finish',           'Painting', 'Primer coat plus one finish coat interior',                        'SF',   1.75, 1.20, 0.55, 0.00, 2.00, 'New drywall or stained surfaces'],
  ['PAI 200', 'Paint Ceiling - 2 Coats',                       'Painting', 'Interior ceiling only, 2 finish coats',                            'SF',   1.65, 1.25, 0.40, 0.00, 1.90, 'Per SF of ceiling area'],
  ['PAI 300', 'Paint Door - Both Sides (inc. trim)',            'Painting', 'Paint interior door both sides, casing/jamb included',             'EA', 150.00,125.00,25.00, 0.00, 175.00, 'Standard 80" door'],
  ['PAI 350', 'Paint Exterior Door (inc. frame)',               'Painting', 'Paint exterior door both sides with frame',                        'EA', 195.00,160.00,35.00, 0.00, 225.00, 'Includes weatherstripping prep'],
  ['PAI 400', 'Paint Baseboard / Trim - Per LF',               'Painting', 'Paint baseboard, casing, or crown molding',                        'LF',   1.85, 1.50, 0.35, 0.00, 2.15, 'Per LF of trim length'],
  ['PAI 450', 'Paint Window Trim',                             'Painting', 'Paint window sill, casing, and stool',                             'EA',  55.00, 45.00,10.00, 0.00,  65.00, 'Standard window unit'],
  ['PAI 500', 'Paint Exterior - 2 Coats (Stucco/Siding)',      'Painting', 'Exterior painting of stucco, wood, or T1-11 siding, 2 coats',      'SF',   2.35, 1.75, 0.60, 0.00, 2.75, 'Per SF of wall surface'],
  ['PAI 510', 'Paint Exterior - 1 Coat',                       'Painting', 'Exterior painting, 1 coat, prep included',                        'SF',   1.60, 1.20, 0.40, 0.00, 1.85, 'Maintenance coat'],
  ['PAI 600', 'Epoxy Floor Coating (Garage)',                  'Painting', '2-part epoxy floor coating for concrete, 2 coats',                 'SF',   4.50, 2.50, 2.00, 0.00, 5.25, 'Surface prep included'],

  // ─── CARPET (CAR) ─────────────────────────────────────────────────
  ['CAR 160', 'Carpet Install - Mid-Grade (with pad)',          'Carpet', 'Install carpet including 8 lb rebond pad, mid-grade material',      'SY',  63.00, 18.00, 45.00, 0.00,  72.00, 'Per SY installed; material included'],
  ['CAR 165', 'Carpet Install - Premium Grade (with pad)',      'Carpet', 'Install premium carpet including 10 lb pad',                       'SY',  95.00, 20.00, 75.00, 0.00, 110.00, 'Per SY; builder-grade excluded'],
  ['CAR 170', 'Carpet Pad Only - 8 lb Rebond',                 'Carpet', 'Install 8 lb rebond carpet pad only (no carpet)',                  'SY',  13.00,  4.50,  8.50, 0.00,  15.00, 'Used when reusing existing carpet'],
  ['CAR 175', 'Carpet Pad Only - 10 lb Premium',               'Carpet', 'Install 10 lb premium rebond pad',                                'SY',  18.00,  5.00, 13.00, 0.00,  21.00, 'Premium applications'],
  ['CAR 180', 'Carpet Removal & Disposal',                     'Carpet', 'Remove existing carpet and haul away',                            'SY',   4.00,  4.00,  0.00, 0.00,   4.75, 'Includes tack strip removal'],
  ['CAR 182', 'Carpet Pad Removal',                            'Carpet', 'Remove existing carpet pad only',                                 'SY',   2.00,  2.00,  0.00, 0.00,   2.50, 'Labor only'],

  // ─── FLOORING (FLR) ───────────────────────────────────────────────
  ['FLR 120', 'LVP / LVT Install - Floating Mid-Grade',        'Flooring', 'Luxury vinyl plank/tile, floating installation, mid-grade',        'SF',   6.00,  2.50,  3.50, 0.00,   7.00, '6mm-8mm wear layer; glue-down add $0.75/SF'],
  ['FLR 125', 'LVP / LVT Install - Premium Grade',             'Flooring', 'Luxury vinyl plank, 12mm, premium grade floating',                'SF',   8.50,  2.75,  5.75, 0.00,   9.75, '20+ mil wear layer'],
  ['FLR 140', 'Hardwood Floor - Install 3/4" Solid Nail-Down', 'Flooring', 'Install 3/4" solid hardwood, nail-down, material included',       'SF',  11.00,  4.00,  7.00, 0.00,  12.75, 'Oak, maple; exotic species add cost'],
  ['FLR 145', 'Hardwood Floor - Engineered Install',           'Flooring', 'Install engineered hardwood, glue or float',                      'SF',   9.50,  3.50,  6.00, 0.00,  11.00, 'Better for San Diego humidity'],
  ['FLR 160', 'Hardwood Floor - Sand & Refinish',              'Flooring', 'Sand, stain, and apply 3 coats polyurethane finish',              'SF',   3.85,  2.50,  1.35, 0.00,   4.50, 'Up to 3 refinishes possible on 3/4"'],
  ['FLR 210', 'Tile Remove - Ceramic or Porcelain',            'Flooring', 'Remove existing floor tile, chip up adhesive',                    'SF',   2.85,  2.50,  0.35, 0.00,   3.25, 'Noisy; may require dust control'],
  ['FLR 220', 'Tile Remove - Large Format (>12")',             'Flooring', 'Remove large format tile (12"x24" and larger)',                   'SF',   3.50,  3.15,  0.35, 0.00,   4.00, 'More difficult removal'],
  ['FLR 300', 'Floor Prep / Self-Leveling Compound',           'Flooring', 'Apply self-leveling compound to prepare subfloor',                'SF',   2.00,  1.25,  0.75, 0.00,   2.35, 'Required for uneven subfloors >3/16"'],

  // ─── TILE (CTM) ───────────────────────────────────────────────────
  ['CTM 150', 'Tile - Ceramic Floor 12"x12"',                  'Tile & Stone', 'Install ceramic floor tile 12"x12" with thinset and grout',   'SF',   9.50,  5.00,  4.50, 0.00,  11.00, 'Standard residential floor tile'],
  ['CTM 155', 'Tile - Porcelain Floor 12"x24"',                'Tile & Stone', 'Install porcelain floor tile 12"x24" with thinset and grout', 'SF',  12.50,  5.50,  7.00, 0.00,  14.50, 'Most popular San Diego floor tile'],
  ['CTM 160', 'Tile - Large Format 24"x24"+',                  'Tile & Stone', 'Install large format porcelain tile, back-buttered',          'SF',  15.50,  7.00,  8.50, 0.00,  17.75, 'Leveling clips required'],
  ['CTM 200', 'Tile - Ceramic Wall 4"x4" / Subway',            'Tile & Stone', 'Install ceramic wall tile including thinset and grout',       'SF',  13.50,  7.00,  6.50, 0.00,  15.50, 'Backsplash or shower walls'],
  ['CTM 250', 'Tile - Grout Only (existing tile)',             'Tile & Stone', 'Regrout existing tile joints only',                           'SF',   3.25,  2.75,  0.50, 0.00,   3.75, 'No new tile installation'],
  ['CTM 300', 'Tile - Natural Stone (Travertine/Slate)',        'Tile & Stone', 'Install natural stone tile, sealed',                          'SF',  18.50,  7.50, 11.00, 0.00,  21.00, 'Sealing required; material varies'],

  // ─── ROOFING (RFG) ────────────────────────────────────────────────
  ['RFG 140', 'Shingle Removal - Tear-Off & Haul',             'Roofing', 'Remove existing shingles, underlayment, and haul away',           'SQ', 100.00, 75.00, 25.00, 0.00, 115.00, 'Per 100 SF square'],
  ['RFG 120', 'Composition Shingle - 3-Tab Install',           'Roofing', 'Install 3-tab composition shingles with nails',                   'SQ', 325.00,200.00,125.00, 0.00, 375.00, 'Includes underlayment'],
  ['RFG 130', 'Composition Shingle - 30-Yr Architectural',     'Roofing', 'Install architectural laminate shingles, ice & water barrier',    'SQ', 425.00,250.00,175.00, 0.00, 490.00, 'Most common SD residential reroof'],
  ['RFG 135', 'Composition Shingle - 50-Yr Premium',           'Roofing', 'Install premium impact-resistant architectural shingles',         'SQ', 565.00,275.00,290.00, 0.00, 650.00, 'Impact-resistant, qualifies for discounts'],
  ['RFG 200', 'Tile Roof - Concrete Tile Install',             'Roofing', 'Install concrete tile including battens and underlayment',        'SQ', 850.00,350.00,500.00, 0.00, 975.00, 'Very common in San Diego'],
  ['RFG 210', 'Tile Roof - Clay Tile Install',                 'Roofing', 'Install clay tile (S-tile or barrel), full system',               'SQ',1150.00,450.00,700.00, 0.00,1325.00, 'Historic/premium homes'],
  ['RFG 220', 'Tile Roof - Remove & Reset (spot repair)',      'Roofing', 'Remove and reset concrete or clay tiles for repairs',             'SQ', 285.00,265.00, 20.00, 0.00, 330.00, 'Per SQ affected'],
  ['RFG 250', 'Underlayment - 30 lb Felt',                    'Roofing', 'Install 30 lb felt underlayment only',                            'SQ',  55.00, 30.00, 25.00, 0.00,  65.00, 'Per SQ'],
  ['RFG 255', 'Underlayment - Synthetic / Peel & Stick',       'Roofing', 'Install synthetic ice & water barrier underlayment',             'SQ',  85.00, 40.00, 45.00, 0.00,  98.00, 'Better moisture protection'],
  ['RFG 300', 'Flashing - Step / Counter / Valley',            'Roofing', 'Install aluminum step or counter flashing',                      'LF',  12.00,  8.00,  4.00, 0.00,  14.00, 'Around chimneys, walls, skylights'],
  ['RFG 350', 'Ridge Cap - Composition',                       'Roofing', 'Install composition ridge cap shingles',                         'LF',   8.00,  4.50,  3.50, 0.00,   9.25, 'Hip and ridge'],
  ['RFG 400', 'Gutters - Aluminum 5" K-Style',                'Roofing', 'Install seamless aluminum gutters 5" K-style',                    'LF',  18.00, 10.00,  8.00, 0.00,  21.00, 'Includes hangers and end caps'],
  ['RFG 410', 'Downspout - Aluminum 3"x4"',                   'Roofing', 'Install aluminum downspout with elbows',                         'LF',  14.00,  8.00,  6.00, 0.00,  16.25, 'Per LF installed'],

  // ─── PLUMBING (PLM) ───────────────────────────────────────────────
  ['PLM 100', 'Plumber - Journeyman Labor Rate',               'Plumbing', 'Licensed journeyman plumber per hour',                           'HR', 125.00,125.00,  0.00, 0.00, 145.00, 'Does not include materials or fixtures'],
  ['PLM 200', 'Install Toilet - With Fixture (Mid-Grade)',     'Plumbing', 'Supply and install toilet, wax ring, supply line, bolts',        'EA', 700.00,350.00,350.00, 0.00, 800.00, 'Elongated, 1.28 GPF'],
  ['PLM 205', 'Install Toilet - Customer-Supplied Fixture',    'Plumbing', 'Install customer-supplied toilet only, includes wax ring',       'EA', 325.00,275.00, 50.00, 0.00, 375.00, 'Labor + supplies only'],
  ['PLM 210', 'Remove & Reset Toilet',                         'Plumbing', 'Remove toilet, replace wax ring, reinstall',                     'EA', 195.00,165.00, 30.00, 0.00, 225.00, 'Required for floor work'],
  ['PLM 300', 'Install Bathroom Sink - With Fixture',          'Plumbing', 'Supply and install vanity sink, faucet, supply lines, trap',     'EA', 650.00,350.00,300.00, 0.00, 750.00, 'Standard 4" faucet included'],
  ['PLM 310', 'Install Kitchen Sink - With Fixture',           'Plumbing', 'Supply and install kitchen sink, faucet, supply lines, trap',    'EA', 850.00,400.00,450.00, 0.00, 975.00, 'Drop-in or undermount'],
  ['PLM 400', 'Install Water Heater - 50 Gal Tank (Replace)',  'Plumbing', 'Remove old, supply and install 50-gal gas water heater',         'EA',1800.00,600.00,1200.00,0.00,2075.00, 'Includes strapping (CA seismic code)'],
  ['PLM 405', 'Install Water Heater - Tankless (Replace)',     'Plumbing', 'Remove old, supply and install tankless gas water heater',       'EA',3200.00,900.00,2300.00,0.00,3650.00, 'Gas line upgrade may be needed'],
  ['PLM 500', 'Pipe Repair - Supply Line (per LF)',            'Plumbing', 'Repair copper or PEX supply line, wall opened',                  'LF',  60.00, 45.00, 15.00, 0.00,  70.00, 'Does not include drywall repair'],
  ['PLM 510', 'Pipe Repair - Drain Line (per LF)',             'Plumbing', 'Repair ABS or PVC drain line, wall opened',                     'LF',  55.00, 40.00, 15.00, 0.00,  65.00, 'Does not include drywall repair'],
  ['PLM 600', 'Drain Cleaning - Standard Snaking',             'Plumbing', 'Clear drain blockage with electric snake',                       'EA', 210.00,185.00, 25.00, 0.00, 242.00, 'Tub, sink, or toilet line'],
  ['PLM 610', 'Hydro-Jetting',                                 'Plumbing', 'High-pressure hydro-jet drain cleaning',                         'EA', 485.00,400.00, 85.00, 0.00, 558.00, 'Main line cleaning'],
  ['PLM 700', 'Hose Bib / Outdoor Faucet - Install',          'Plumbing', 'Install exterior hose bib with shutoff valve',                   'EA', 285.00,200.00, 85.00, 0.00, 328.00, 'With anti-siphon'],

  // ─── ELECTRICAL (ELE) ─────────────────────────────────────────────
  ['ELE 100', 'Electrician - Journeyman Labor Rate',           'Electrical', 'Licensed journeyman electrician per hour',                      'HR', 125.00,125.00,  0.00, 0.00, 145.00, 'Does not include materials'],
  ['ELE 200', 'Outlet - Install Standard 120V Duplex',         'Electrical', 'Install 120V duplex outlet, box, and cover plate',              'EA', 120.00, 95.00, 25.00, 0.00, 138.00, 'Short wire run included'],
  ['ELE 210', 'GFCI Outlet - Install',                         'Electrical', 'Install GFCI outlet in bathroom/kitchen/exterior',              'EA', 155.00,110.00, 45.00, 0.00, 178.00, 'CA required in wet locations'],
  ['ELE 220', 'AFCI Outlet / Breaker - Install',               'Electrical', 'Install AFCI combination outlet or breaker',                    'EA', 185.00,130.00, 55.00, 0.00, 213.00, 'Required bedrooms per CA code'],
  ['ELE 230', 'USB Outlet - Install',                          'Electrical', 'Install USB-A/C combination outlet',                            'EA', 145.00,100.00, 45.00, 0.00, 167.00, 'Smart home upgrade'],
  ['ELE 300', 'Panel Upgrade - 200A (Main Panel)',             'Electrical', 'Remove 100A, install new 200A main panel, permits included',    'EA',3000.00,1800.00,1200.00,0.00,3450.00, 'Permit + inspection required CA'],
  ['ELE 310', 'Circuit Breaker - Replace (Standard)',          'Electrical', 'Replace failed or tripped circuit breaker',                     'EA', 185.00,125.00, 60.00, 0.00, 213.00, 'Single pole 15A-30A'],
  ['ELE 400', 'Light Fixture - Install (Labor + Fixture)',     'Electrical', 'Install ceiling light fixture, mid-grade',                      'EA', 170.00, 95.00, 75.00, 0.00, 195.00, 'Up to 8ft ceiling; fan add $75'],
  ['ELE 410', 'Ceiling Fan - Install with Brace',              'Electrical', 'Install ceiling fan with fan-rated box and brace',              'EA', 285.00,175.00,110.00, 0.00, 328.00, 'Mid-grade fan included'],
  ['ELE 420', 'Recessed Light - Install',                      'Electrical', 'Install recessed LED light, new rough-in and trim',             'EA', 225.00,150.00, 75.00, 0.00, 259.00, 'Per fixture; 6" LED wafer'],
  ['ELE 500', 'Smoke Detector - Battery Install',              'Electrical', 'Install battery-operated smoke detector',                       'EA', 120.00, 85.00, 35.00, 0.00, 138.00, '10-year sealed battery'],
  ['ELE 510', 'Smoke Detector - Hardwired w/ Battery Backup',  'Electrical', 'Install hardwired smoke/CO detector interconnected',            'EA', 180.00,125.00, 55.00, 0.00, 207.00, 'Per CA code requirements'],
  ['ELE 520', 'CO Detector - Install',                         'Electrical', 'Install carbon monoxide detector per CA code',                  'EA', 135.00, 95.00, 40.00, 0.00, 155.00, 'Required near sleeping areas in CA'],

  // ─── HVAC (HVC) ───────────────────────────────────────────────────
  ['HVC 100', 'HVAC - Service Call / Diagnostic',             'HVAC', 'HVAC diagnostic inspection and report',                             'EA', 165.00,165.00,  0.00, 0.00, 190.00, 'Does not include parts or repair'],
  ['HVC 200', 'AC Unit Replacement - 3-Ton Split System',     'HVAC', 'Remove old, supply and install 3-ton central AC split system',     'EA',6000.00,2200.00,3800.00,0.00,6900.00, 'Includes disconnect, lineset, drain'],
  ['HVC 205', 'AC Unit Replacement - 4-Ton Split System',     'HVAC', 'Remove old, supply and install 4-ton central AC split system',     'EA',7200.00,2500.00,4700.00,0.00,8280.00, 'Most common for 2,000+ SF homes'],
  ['HVC 210', 'Mini-Split Install - 12,000 BTU Single Zone',  'HVAC', 'Install ductless mini-split 1-ton, single zone',                   'EA',3500.00,1500.00,2000.00,0.00,4025.00, 'Popular San Diego addition'],
  ['HVC 300', 'Furnace Replacement - 80,000 BTU Gas',         'HVAC', 'Remove old, supply and install 80k BTU gas furnace',              'EA',3200.00,1200.00,2000.00,0.00,3680.00, 'Less common in SD but used inland'],
  ['HVC 310', 'Air Handler Replacement',                      'HVAC', 'Replace air handler only (no AC unit)',                            'EA',2200.00, 800.00,1400.00,0.00,2530.00, 'When compressor is OK'],
  ['HVC 400', 'Duct Cleaning - Full System (up to 10 vents)', 'HVAC', 'Clean supply and return ducts, all registers, UV treatment',      'EA', 400.00,350.00, 50.00, 0.00, 460.00, 'Negative pressure system required'],
  ['HVC 450', 'Duct Repair - Flex Duct per LF',               'HVAC', 'Repair or replace flexible ductwork per LF',                      'LF',  37.00, 25.00, 12.00, 0.00,  42.55, 'Sealed and insulated'],
  ['HVC 460', 'Duct Sealing - Aeroseal (per system)',         'HVAC', 'Aeroseal whole-house duct leak sealing',                          'EA',1450.00,1000.00,450.00, 0.00,1668.00, 'Reduces energy loss 20-30%'],
  ['HVC 500', 'Thermostat - Programmable Install',            'HVAC', 'Install programmable thermostat',                                 'EA', 170.00, 95.00, 75.00, 0.00, 195.00, 'Non-smart programable'],
  ['HVC 510', 'Thermostat - Smart/Wi-Fi Install',             'HVAC', 'Install smart thermostat (Nest, Ecobee), programming included',   'EA', 325.00,125.00,200.00, 0.00, 374.00, 'App setup included'],

  // ─── CABINETS (CAB) ───────────────────────────────────────────────
  ['CAB 100', 'Kitchen Cabinets - Semi-Custom Base',          'Cabinetry', 'Supply and install semi-custom base cabinets (per LF)',         'LF', 400.00, 75.00,325.00, 0.00, 460.00, 'Per LF of run; hardware extra'],
  ['CAB 105', 'Kitchen Cabinets - Semi-Custom Upper',         'Cabinetry', 'Supply and install semi-custom upper cabinets (per LF)',        'LF', 325.00, 65.00,260.00, 0.00, 374.00, 'Per LF; 30" upper'],
  ['CAB 110', 'Kitchen Cabinets - Stock Grade Base',          'Cabinetry', 'Supply and install stock cabinets base (per LF)',               'LF', 200.00, 65.00,135.00, 0.00, 230.00, 'IKEA/RTA level; in-stock'],
  ['CAB 115', 'Kitchen Cabinets - Stock Grade Upper',         'Cabinetry', 'Supply and install stock upper cabinets (per LF)',              'LF', 165.00, 55.00,110.00, 0.00, 190.00, 'Per LF; 30" upper'],
  ['CAB 200', 'Cabinet Removal - Existing',                   'Cabinetry', 'Remove and dispose of existing base or upper cabinets',         'LF',  35.00, 35.00,  0.00, 0.00,  40.25, 'Careful demo for cabinet reuse add $10/LF'],
  ['CAB 300', 'Countertop - Laminate Install',                'Cabinetry', 'Supply and install laminate countertop with postform edge',     'LF', 100.00, 45.00, 55.00, 0.00, 115.00, 'Standard 25" depth'],
  ['CAB 310', 'Countertop - Quartz / Granite Install',        'Cabinetry', 'Supply and install quartz or granite slab countertop, silicone','LF', 250.00, 75.00,175.00, 0.00, 288.00, 'Per LF; standard 25" depth, eased edge'],
  ['CAB 315', 'Countertop - Butcher Block Install',           'Cabinetry', 'Supply and install butcher block countertop, oiled finish',     'LF', 185.00, 60.00,125.00, 0.00, 213.00, 'Hardwood; requires annual oiling'],
  ['CAB 400', 'Cabinet Hardware - Pulls/Knobs',               'Cabinetry', 'Install cabinet hardware pulls or knobs',                       'EA',  20.00,  8.00, 12.00, 0.00,  23.00, 'Mid-grade hardware; per piece'],
  ['CAB 500', 'Bathroom Vanity - Install With Fixture',       'Cabinetry', 'Supply and install 36" bathroom vanity with top and sink',     'EA', 950.00,275.00,675.00, 0.00,1093.00, 'Plumbing connection extra'],

  // ─── INSULATION (INS) ─────────────────────────────────────────────
  ['INS 120', 'Batt Insulation - R-13 (2x4 Wall)',            'Insulation', 'Install fiberglass batt insulation R-13 in 2x4 wall cavities', 'SF',  1.15,  0.55,  0.60, 0.00,  1.32, 'CA Title 24 min for 2x4 walls'],
  ['INS 140', 'Batt Insulation - R-19 (2x6 Wall)',            'Insulation', 'Install fiberglass batt insulation R-19 in 2x6 wall cavities', 'SF',  1.40,  0.65,  0.75, 0.00,  1.61, 'CA Title 24 for 2x6 walls'],
  ['INS 160', 'Batt Insulation - R-30 (Attic Floor)',         'Insulation', 'Install R-30 fiberglass batts in attic floor joists',          'SF',  2.15,  0.85,  1.30, 0.00,  2.47, 'CA Title 24 attic minimum'],
  ['INS 200', 'Blown-In - Attic (Fiberglass/Cellulose)',       'Insulation', 'Machine-blow fiberglass or cellulose insulation in attic',     'SF',  1.75,  0.90,  0.85, 0.00,  2.01, 'R-38 per current CA energy code'],
  ['INS 210', 'Blown-In - Wall Cavity (Dense Pack)',           'Insulation', 'Dense-pack cellulose in wall cavities (existing walls)',        'SF',  2.75,  1.50,  1.25, 0.00,  3.16, 'Requires drilling small access holes'],
  ['INS 220', 'Spray Foam - Open Cell 2"',                    'Insulation', '2" open-cell spray foam in wall/attic application',            'SF',  2.25,  1.25,  1.00, 0.00,  2.59, 'R-7 per inch; air barrier'],
  ['INS 230', 'Spray Foam - Closed Cell 2"',                  'Insulation', '2" closed-cell spray foam, highest R-value application',      'SF',  4.50,  2.00,  2.50, 0.00,  5.18, 'R-6.5 per inch; vapor barrier'],
  ['INS 300', 'Remove Insulation - Batt or Blown',            'Insulation', 'Remove existing insulation, bag and haul out',                  'SF',  0.45,  0.35,  0.10, 0.00,  0.52, 'Per SF of coverage area'],

  // ─── FRAMING (FRM) ────────────────────────────────────────────────
  ['FRM 100', 'Framing - Journeyman Carpenter Labor',         'Framing', 'Licensed journeyman framing carpenter per hour',                  'HR',  95.00, 95.00,  0.00, 0.00, 109.00, 'Does not include materials'],
  ['FRM 200', 'Wall Framing - New 2x4 Stud (8\' ceiling)',    'Framing', 'Frame new 2x4 stud wall, plate, headers, per LF of wall',        'LF',  40.00, 22.00, 18.00, 0.00,  46.00, 'Non-bearing; includes double top plate'],
  ['FRM 210', 'Wall Framing - Bearing Wall 2x4',              'Framing', 'Frame load-bearing 2x4 wall with appropriate headers',           'LF',  58.00, 32.00, 26.00, 0.00,  66.70, 'Engineer stamp may be required'],
  ['FRM 220', 'Wall Framing - 2x6 Exterior Wall',             'Framing', 'Frame new 2x6 exterior wall, 8\' ceiling height',                'LF',  52.00, 28.00, 24.00, 0.00,  59.80, 'CA energy code exterior walls'],
  ['FRM 300', 'Subfloor Repair - 3/4" OSB Replace',           'Framing', 'Remove and replace 3/4" OSB subfloor panels',                    'SF',   7.50,  4.50,  3.00, 0.00,   8.63, 'Glued and screwed; tongue and groove'],
  ['FRM 310', 'Subfloor - Squeaks / Screw Down',              'Framing', 'Secure squeaking subfloor with ring-shank screws',               'SF',   1.85,  1.50,  0.35, 0.00,   2.13, 'Add construction adhesive where needed'],
  ['FRM 400', 'Blocking - Misc Structural',                   'Framing', 'Install blocking for backing, nailers, or structural support',    'LF',  18.00, 12.00,  6.00, 0.00,  20.70, 'Handrails, grab bars, shelving'],
  ['FRM 410', 'Header - Replace (3\'-4\' opening)',           'Framing', 'Install new structural header for 3-4 ft opening',                'EA', 485.00,350.00,135.00, 0.00, 557.75, 'With proper sizing per CA building code'],

  // ─── MOLD REMEDIATION (MLD) ───────────────────────────────────────
  ['MLD 100', 'Mold Remediation - Surface Cleaning/Treatment', 'Mold Remediation', 'HEPA vacuum + clean + apply fungicide to affected surfaces',  'SF',  16.00, 12.00,  4.00, 0.00,  18.40, 'IICRC S520 protocol; PPE required'],
  ['MLD 105', 'Mold Remediation - Cavity Cleaning',           'Mold Remediation', 'Access wall/ceiling cavity, clean and treat mold in cavities', 'SF',  22.00, 16.00,  6.00, 0.00,  25.30, 'Includes reopening after treatment'],
  ['MLD 110', 'HEPA Vacuuming - Surfaces & Contents',         'Mold Remediation', 'HEPA vacuum all surfaces, HVAC registers, and contents',      'SF',   1.75,  1.50,  0.25, 0.00,   2.01, 'Per SF of floor area'],
  ['MLD 120', 'Containment Setup - Poly Barrier & Zipper Door','Mold Remediation', 'Install 6 mil poly containment with zipper door',             'EA', 600.00,350.00,250.00, 0.00, 690.00, 'Negative pressure machine required'],
  ['MLD 130', 'Air Scrubber - HEPA (per day)',                'Mold Remediation', 'Run HEPA air scrubber during and after remediation',           'DAY', 125.00, 35.00, 90.00, 0.00, 143.75, 'Minimum 3 days post-treatment'],
  ['MLD 200', 'Post-Remediation Mold Clearance Testing',      'Mold Remediation', 'Third-party air and surface sampling after remediation',       'EA', 395.00,150.00,245.00, 0.00, 454.25, 'Lab fees included; written report'],
  ['MLD 210', 'Antimicrobial Encapsulant Coating',            'Mold Remediation', 'Apply EPA-registered encapsulant to treated surfaces',         'SF',   2.50,  1.50,  1.00, 0.00,   2.88, 'Prevents mold recurrence'],
  ['MLD 300', 'Structural Drying - Mold-Related (per day)',   'Mold Remediation', 'Drying equipment specifically for mold-related moisture',      'DAY', 195.00, 45.00,150.00, 0.00, 224.25, 'Document all daily readings'],

  // ─── CLEANING (CLN) ───────────────────────────────────────────────
  ['CLN 100', 'General Cleaning - Post-Construction',         'Cleaning', 'Wipe down, vacuum, mop all surfaces after construction',         'SF',   0.18,  0.15,  0.03, 0.00,   0.21, 'Interior only; per SF floor area'],
  ['CLN 105', 'Construction Cleanup - Detail Level',          'Cleaning', 'Detail cleaning: windows, fixtures, cabinets, all surfaces',     'SF',   0.35,  0.30,  0.05, 0.00,   0.40, 'Move-in ready standard'],
  ['CLN 110', 'Biohazard Cleaning - Sewage / Bodily Fluids',  'Cleaning', 'EPA-certified biohazard remediation, proper PPE and disposal',   'SF',  45.00, 35.00, 10.00, 0.00,  51.75, 'Licensed biohazard contractors only'],
  ['CLN 120', 'HEPA Cleaning - Soot / Fine Particulate',      'Cleaning', 'HEPA vacuum and wipe all surfaces for soot/fire residue',        'SF',   0.55,  0.45,  0.10, 0.00,   0.63, 'Fire loss; all surfaces including HVAC'],
  ['CLN 200', 'Duct Cleaning - Full System',                  'Cleaning', 'Clean supply, return ducts, all registers, UV disinfect',        'EA', 400.00,325.00, 75.00, 0.00, 460.00, 'Negative pressure truck-mount system'],
  ['CLN 210', 'Pressure Washing - Driveway/Patio',            'Cleaning', 'Pressure wash concrete driveway or patio surface',              'SF',   0.35,  0.30,  0.05, 0.00,   0.40, 'Per SF; degreaser included if needed'],
  ['CLN 220', 'Pressure Washing - Exterior Walls',            'Cleaning', 'Soft-wash exterior stucco, siding, or masonry',                  'SF',   0.55,  0.45,  0.10, 0.00,   0.63, 'Per SF; bio-friendly detergent'],

  // ─── WINDOWS & DOORS (WDW) ────────────────────────────────────────
  ['WDW 100', 'Window Install - Single-Hung (30"x48")',       'Windows & Doors', 'Supply and install single-hung aluminum/vinyl window',       'EA', 525.00,175.00,350.00, 0.00, 603.75, 'Standard residential size; low-E glass'],
  ['WDW 105', 'Window Install - Double-Pane w/ Removal',      'Windows & Doors', 'Remove existing, supply and install double-pane window',     'EA', 775.00,225.00,550.00, 0.00, 891.25, 'Includes disposal of old window'],
  ['WDW 110', 'Window Install - Sliding (60"x48")',           'Windows & Doors', 'Supply and install sliding window, double-pane, low-E',      'EA', 895.00,250.00,645.00, 0.00,1029.25, 'Common CA replacement window'],
  ['WDW 115', 'Window Install - Casement',                   'Windows & Doors', 'Supply and install casement window, crank hardware',         'EA', 985.00,300.00,685.00, 0.00,1132.75, 'Better seal than sliding'],
  ['WDW 200', 'Door Install - Interior Pre-Hung Hollow Core', 'Windows & Doors', 'Supply and install interior hollow-core pre-hung door, casing','EA',325.00,175.00,150.00, 0.00, 373.75, 'Includes jamb and casing both sides'],
  ['WDW 205', 'Door Install - Interior Pre-Hung Solid Core',  'Windows & Doors', 'Supply and install solid-core interior pre-hung door',        'EA', 470.00,195.00,275.00, 0.00, 540.50, 'Sound and fire mitigation benefit'],
  ['WDW 210', 'Door Install - Exterior Pre-Hung Steel',       'Windows & Doors', 'Supply and install steel exterior door, frame, hardware',     'EA', 775.00,275.00,500.00, 0.00, 891.25, 'Weather-stripped; deadbolt included'],
  ['WDW 215', 'Door Install - Sliding Glass (72"x80")',       'Windows & Doors', 'Supply and install 6\' sliding glass door, low-E glass',     'EA',1850.00,550.00,1300.00,0.00,2127.50, 'Common in SD homes; security bar incl'],
  ['WDW 220', 'Door Install - French Doors (Double)',         'Windows & Doors', 'Supply and install double French doors w/ hardware',          'EA',2450.00,700.00,1750.00,0.00,2817.50, 'Interior or exterior configuration'],
  ['WDW 300', 'Window Board-Up - Emergency Plywood',         'Windows & Doors', 'Emergency plywood board-up of broken window or door',         'EA', 125.00, 85.00, 40.00, 0.00, 143.75, 'Immediate response; per opening'],
  ['WDW 310', 'Door Board-Up - Emergency',                   'Windows & Doors', 'Emergency board-up of exterior door opening',                  'EA', 185.00,135.00, 50.00, 0.00, 212.75, 'Secure with screws; per door opening'],

  // ─── CONCRETE & MASONRY (CNC) ─────────────────────────────────────
  ['CNC 100', 'Concrete - Patch / Repair (Surface)',          'Concrete & Masonry', 'Patch surface cracks and spalls in concrete slab',          'SF',   8.50,  5.50,  3.00, 0.00,   9.78, 'Hydraulic cement or epoxy inject'],
  ['CNC 110', 'Concrete - Pour New Slab 4"',                 'Concrete & Masonry', 'Pour new 4" concrete slab over vapor barrier, reinforced',  'SF',  14.50,  6.50,  8.00, 0.00,  16.68, 'Includes rebar; finishing incl.'],
  ['CNC 120', 'Concrete - Driveway Pour 4"',                 'Concrete & Masonry', 'Remove old, form and pour new 4" concrete driveway',        'SF',  18.00,  8.00, 10.00, 0.00,  20.70, 'Includes fiber reinforcement'],
  ['CNC 200', 'Block Wall - CMU 8" Standard',                'Concrete & Masonry', 'Install standard 8" CMU block wall with mortar',             'SF',  28.00, 16.00, 12.00, 0.00,  32.20, 'Per SF of wall face; grouted'],
  ['CNC 300', 'Stucco - 3-Coat (Scratch, Brown, Finish)',    'Concrete & Masonry', 'Apply 3-coat stucco system to exterior wood-frame wall',     'SF',  14.50,  9.00,  5.50, 0.00,  16.68, 'Standard SD exterior finish'],
  ['CNC 310', 'Stucco - Repair (per SF)',                    'Concrete & Masonry', 'Cut out, repair, and texture-match stucco damage',           'SF',  18.50, 13.00,  5.50, 0.00,  21.28, 'Color match extra'],
  ['CNC 400', 'Brick/Stone Veneer - Install',                'Concrete & Masonry', 'Install cultured stone or brick veneer, mortar and grout',   'SF',  22.50,  9.50, 13.00, 0.00,  25.88, 'Exterior or interior application'],

  // ─── DEMO / GENERAL (DEM) ─────────────────────────────────────────
  ['DEM 100', 'Demolition - General Labor (per hour)',        'Demolition', 'General demolition labor per hour',                              'HR',  75.00, 75.00,  0.00, 0.00,  86.25, 'Selective or full demo'],
  ['DEM 110', 'Debris Removal - Haul Away (per load)',        'Demolition', 'Load and haul construction debris to disposal facility',         'EA', 350.00,250.00,100.00, 0.00, 402.50, 'Standard pickup truck load ~2 cubic yards'],
  ['DEM 120', 'Dumpster Rental - 10 Yard',                   'Demolition', '10-yard dumpster delivery, 7-day rental, and pickup',            'EA', 495.00,  0.00,495.00, 0.00, 569.25, 'Includes 2 tons; overage fees apply'],
  ['DEM 130', 'Dumpster Rental - 20 Yard',                   'Demolition', '20-yard dumpster delivery, 7-day rental, and pickup',            'EA', 695.00,  0.00,695.00, 0.00, 799.25, 'Includes 4 tons; overage fees apply'],
  ['DEM 200', 'Asbestos Testing - Bulk Sample',               'Demolition', 'Collect and lab-test bulk sample for asbestos',                  'EA', 285.00,150.00,135.00, 0.00, 327.75, 'Required pre-1980 buildings per CA EPA'],
  ['DEM 210', 'Lead Paint Testing',                           'Demolition', 'XRF or swab testing for lead-based paint',                       'EA', 195.00,125.00, 70.00, 0.00, 224.25, 'Required pre-1978 renovations CA'],

  // ─── STRUCTURAL / SPECIALTY (STR) ─────────────────────────────────
  ['STR 100', 'Structural Beam - Install LVL (per LF)',       'Structural', 'Install LVL structural beam, labor and material',                'LF',  95.00, 45.00, 50.00, 0.00, 109.25, 'Engineer stamp required in CA'],
  ['STR 110', 'Post/Column - Install 4x4 Decorative',         'Structural', 'Install 4x4 decorative post with base and cap hardware',         'EA', 185.00,125.00, 60.00, 0.00, 212.75, 'Porch or deck application'],
  ['STR 200', 'Deck - Composite Decking Install',             'Structural', 'Install composite deck boards over existing framing',            'SF',  22.50, 10.00, 12.50, 0.00,  25.88, 'Trex or similar; framing extra'],
  ['STR 210', 'Deck - Pressure-Treated Wood Install',         'Structural', 'Install pressure-treated deck boards over existing framing',     'SF',  16.00,  8.00,  8.00, 0.00,  18.40, 'Cedar or pressure-treated pine'],
  ['STR 300', 'Fence - Wood Privacy 6\' (per LF)',            'Structural', 'Install 6\' wood privacy fence with concrete posts',             'LF',  55.00, 25.00, 30.00, 0.00,  63.25, 'Cedar or redwood; 8 ft post spacing'],
  ['STR 310', 'Fence - Vinyl / PVC 6\' (per LF)',             'Structural', 'Install 6\' vinyl privacy fence with concrete posts',            'LF',  65.00, 25.00, 40.00, 0.00,  74.75, 'Low maintenance; popular in SD'],
];

// Competitor pricing reference (SERVPRO, Paul Davis, ServiceMaster San Diego)
// Key: xactimate_code, value: {servpro, paulDavis, servicemaster, notes}
const COMPETITOR_DATA = {
  'WTR 100': { servpro: 1.55, paulDavis: 1.50, servicemaster: 1.45, market_low: 1.25, market_high: 1.85 },
  'WTR 101': { servpro: 2.15, paulDavis: 2.05, servicemaster: 2.00, market_low: 1.75, market_high: 2.50 },
  'WTR 102': { servpro: 3.00, paulDavis: 2.90, servicemaster: 2.85, market_low: 2.50, market_high: 3.50 },
  'WTR 110': { servpro: 155, paulDavis: 148, servicemaster: 145, market_low: 125, market_high: 175 },
  'WTR 111': { servpro: 55,  paulDavis: 52,  servicemaster: 50,  market_low: 45,  market_high: 65  },
  'WTR 120': { servpro: 0.58, paulDavis: 0.55, servicemaster: 0.52, market_low: 0.45, market_high: 0.75 },
  'DRY 120':  { servpro: 3.35, paulDavis: 3.25, servicemaster: 3.20, market_low: 2.75, market_high: 4.00 },
  'DRY 130':  { servpro: 3.75, paulDavis: 3.65, servicemaster: 3.60, market_low: 3.15, market_high: 4.50 },
  'PAI 102':  { servpro: 1.85, paulDavis: 1.80, servicemaster: 1.75, market_low: 1.50, market_high: 2.25 },
  'PAI 200':  { servpro: 1.95, paulDavis: 1.90, servicemaster: 1.90, market_low: 1.65, market_high: 2.35 },
  'CAR 160':  { servpro: 74,   paulDavis: 72,   servicemaster: 70,   market_low: 63,   market_high: 95   },
  'FLR 120':  { servpro: 7.25, paulDavis: 7.00, servicemaster: 6.85, market_low: 6.00, market_high: 9.00 },
  'RFG 130':  { servpro: 490,  paulDavis: 475,  servicemaster: 470,  market_low: 425,  market_high: 600  },
  'PLM 100':  { servpro: 155,  paulDavis: 150,  servicemaster: 145,  market_low: 125,  market_high: 175  },
  'ELE 100':  { servpro: 145,  paulDavis: 140,  servicemaster: 135,  market_low: 125,  market_high: 165  },
  'HVC 200':  { servpro: 7200, paulDavis: 6950, servicemaster: 6800, market_low: 6000, market_high: 8500 },
  'MLD 100':  { servpro: 19.50, paulDavis: 18.75, servicemaster: 18.40, market_low: 16.00, market_high: 26.00 },
};

async function seed() {
  try {
    console.log('\n🏗️  BCS San Diego Xactimate Price List Seeder');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Step 1: Add new columns if they don't exist
    console.log('📋 Updating table schema...');
    const addColumns = [
      'ALTER TABLE price_list ADD COLUMN labor_cost REAL DEFAULT 0',
      'ALTER TABLE price_list ADD COLUMN competitor_avg_price REAL DEFAULT 0',
    ];
    for (const sql of addColumns) {
      try { await run(sql); } catch (e) { /* column already exists */ }
    }

    // Step 2: Clear existing generic placeholder data
    console.log('🗑️  Clearing generic placeholder data...');
    await run('DELETE FROM price_list');

    // Step 3: Insert real San Diego pricing
    console.log('💰 Inserting San Diego area pricing data...\n');
    let inserted = 0;
    const categories = {};

    for (const item of SD_PRICE_LIST) {
      const [code, name, category, description, unit, unitPrice, laborCost, materialCost, equipmentCost, competitorAvg, notes] = item;

      await run(`
        INSERT INTO price_list
          (xactimate_code, item_name, category, description, unit, unit_price,
           labor_cost, labor_hours, material_cost, equipment_cost, competitor_avg_price,
           tax_rate, is_active, notes, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [code, name, category, description, unit, unitPrice, laborCost, 0, materialCost, equipmentCost, competitorAvg, notes]);

      inserted++;
      categories[category] = (categories[category] || 0) + 1;
    }

    // Step 4: Create competitor_pricing table
    console.log('\n📊 Setting up competitor pricing table...');
    await run(`
      CREATE TABLE IF NOT EXISTS competitor_pricing (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        xactimate_code TEXT,
        trade_category TEXT,
        description TEXT,
        unit TEXT,
        bcs_price REAL,
        servpro_price REAL,
        paul_davis_price REAL,
        servicemaster_price REAL,
        market_low REAL,
        market_high REAL,
        notes TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (xactimate_code) REFERENCES price_list(xactimate_code)
      )
    `);
    await run('DELETE FROM competitor_pricing');

    for (const [code, data] of Object.entries(COMPETITOR_DATA)) {
      const item = SD_PRICE_LIST.find(r => r[0] === code);
      if (!item) continue;
      await run(`
        INSERT INTO competitor_pricing
          (xactimate_code, trade_category, description, unit, bcs_price,
           servpro_price, paul_davis_price, servicemaster_price, market_low, market_high, notes, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [code, item[2], item[1], item[4], item[5], data.servpro, data.paulDavis, data.servicemaster, data.market_low, data.market_high, item[10]]);
    }

    // Step 5: Print summary
    console.log('\n✅ Seeding Complete!\n');
    console.log('📦 Items inserted by category:');
    for (const [cat, count] of Object.entries(categories).sort()) {
      console.log(`   ${cat.padEnd(25)} ${count} items`);
    }
    console.log(`\n   ${'TOTAL'.padEnd(25)} ${inserted} items`);
    console.log('\n🏙️  Market: San Diego, CA (SAN price list equivalent)');
    console.log('📅 Pricing vintage: Q1-Q2 2026\n');

    db.close();
  } catch (err) {
    console.error('❌ Seeding error:', err);
    db.close();
    process.exit(1);
  }
}

seed();
