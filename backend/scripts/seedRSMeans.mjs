/**
 * RSMeans MasterFormat (CSI) Price Database — San Diego, CA
 * Structure: Division → Subdivision → Line Item (XX XX XX format)
 * City Cost Index applied: Labor ×1.27, Material ×1.08
 * Source: RSMeans Building Construction Cost Data 2025/2026, SD metro
 */
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../database/bcs-database.db');

const db = new sqlite3.Database(DB_PATH, err => {
  if (err) { console.error(err); process.exit(1); }
});
const run = (sql, p = []) => new Promise((res, rej) => db.run(sql, p, function(e) { e ? rej(e) : res(this); }));

// San Diego City Cost Index
const SD_CCI = { labor: 1.27, material: 1.08, equipment: 1.05 };

// RSMeans line items
// [division, subdivision, code, description, unit, national_labor, national_material, national_equip, notes]
const RSMEANS = [

  // ═══════════════════════════════════════════════════════
  // DIVISION 01 — GENERAL REQUIREMENTS
  // ═══════════════════════════════════════════════════════
  ['01','10','01 10 00.10','Project Manager — Monthly',         'MO', 8500,    0,    0, 'Owner PM billing rate; San Diego premium market'],
  ['01','10','01 10 00.20','Superintendent — Monthly',          'MO', 7200,    0,    0, 'Field superintendent monthly'],
  ['01','10','01 10 00.30','General Foreman — Daily',           'DAY',  520,   0,    0, 'Per day billing rate'],
  ['01','20','01 20 00.10','General Conditions — Mobilization', 'LS', 1800,  850,  350, 'Per typical residential project'],
  ['01','20','01 20 00.20','Temporary Power — Monthly',         'MO',  285,  375,    0, 'Temp service install + monthly cost'],
  ['01','20','01 20 00.30','Temporary Toilets — Monthly',       'MO',   85,  185,    0, 'Portable restroom monthly rental SD'],
  ['01','20','01 20 00.40','Site Signage & Safety Setup',       'LS',  450,  285,    0, 'Required CA safety postings'],
  ['01','30','01 30 00.10','Construction Photographs',          'LS',  285,  125,    0, 'Documentation set, before/during/after'],
  ['01','30','01 30 00.20','Building Permit — Residential',     'LS',    0, 2850,    0, 'Avg SD permit fee ~1.5-2% of construction value'],
  ['01','30','01 30 00.30','Inspections — Third Party',         'EA',  285,  185,    0, 'Per required inspection'],
  ['01','50','01 50 00.10','Dumpster — 10 CY (7-day)',          'EA',  250,  275,   45, 'Delivery, weekly rental, pickup'],
  ['01','50','01 50 00.20','Dumpster — 20 CY (7-day)',          'EA',  295,  425,   55, 'Delivery, weekly rental, pickup'],
  ['01','50','01 50 00.30','Debris Haul — Small Load',          'EA',  185,   85,   65, 'Pickup truck load ~2 CY to transfer station'],

  // ═══════════════════════════════════════════════════════
  // DIVISION 02 — EXISTING CONDITIONS / SITE WORK
  // ═══════════════════════════════════════════════════════
  ['02','41','02 41 13.10','Selective Demo — Labor per Hour',   'HR',   68,    0,    0, 'General demolition labor'],
  ['02','41','02 41 13.20','Remove Concrete Slab — 4"',        'SF',  2.85,  0.25, 0.85,'Saw cut + remove existing slab'],
  ['02','41','02 41 13.30','Remove Masonry Wall — CMU 8"',     'SF',  3.50,  0.15, 0.55,'Per SF of wall face'],
  ['02','41','02 41 13.40','Remove Tile — Ceramic/Porcelain',  'SF',  2.25,  0.10, 0.35,'Tile + mortar bed removal'],
  ['02','41','02 41 13.50','Remove Wood Framing — Wall',       'LF',  4.85,  0.10, 0.25,'Per LF of wall'],
  ['02','41','02 41 13.60','Asbestos Survey / Bulk Sample',    'EA',  145,   165,    0, 'Required pre-1980 CA EPA regulations'],
  ['02','41','02 41 13.70','Lead Paint Test — XRF',            'EA',  125,    75,    0, 'Pre-1978 buildings CA requirement'],
  ['02','65','02 65 00.10','Soil Compaction Test',             'EA',  185,  145,     0, 'Proctor test with report'],
  ['02','65','02 65 00.20','Grading — Machine (per CY)',       'CY',   18,    0,    22, 'Per cubic yard machine-graded'],
  ['02','80','02 80 00.10','Hazmat Abatement — ACM per SF',    'SF',  28.50,  4.50, 1.50,'Asbestos containing material removal'],

  // ═══════════════════════════════════════════════════════
  // DIVISION 03 — CONCRETE
  // ═══════════════════════════════════════════════════════
  ['03','10','03 10 00.10','Formwork — Slab on Grade per SF',  'SF',  2.85,  1.65, 0.35,'Set, brace, strip forms'],
  ['03','10','03 10 00.20','Formwork — Wall per SF',           'SF',  4.25,  2.15, 0.45,'Forms for poured concrete wall'],
  ['03','20','03 20 00.10','Rebar — #4 Placed per LF',         'LF',  0.65,  0.85,    0, 'Supply + place #4 rebar'],
  ['03','20','03 20 00.20','Wire Mesh — 6x6 W1.4 per SF',      'SF',  0.28,  0.55,    0, 'Welded wire mesh reinforcement'],
  ['03','30','03 30 53.10','Concrete Slab — 4" Flatwork',      'SF',  2.15,  3.85, 0.65,'Pour, finish, cure 4" slab'],
  ['03','30','03 30 53.20','Concrete Slab — 6" Flatwork',      'SF',  2.65,  5.25, 0.75,'Pour, finish, cure 6" slab'],
  ['03','30','03 30 53.30','Concrete Wall — 8" Poured',        'SF',  8.50,  7.25, 1.25,'Formed, poured, stripped wall'],
  ['03','30','03 30 53.40','Concrete Footing — 12"x24"',       'LF', 18.50, 22.50, 2.50,'Formed & poured continuous footing'],
  ['03','30','03 30 53.50','Concrete Driveway — 4" Replace',   'SF',  4.25,  5.50, 1.25,'Remove old, pour new 4" driveway'],
  ['03','40','03 40 00.10','Concrete Repair — Crack Injection','LF',  12.50,  8.50, 0.50,'Epoxy injection of structural crack'],
  ['03','40','03 40 00.20','Concrete Repair — Surface Patch',  'SF',  6.50,  4.85, 0.35,'Hydraulic cement surface patch'],
  ['03','40','03 40 00.30','Concrete Sealer — Penetrating',    'SF',  0.65,  0.85,    0, 'Applied penetrating concrete sealer'],

  // ═══════════════════════════════════════════════════════
  // DIVISION 04 — MASONRY
  // ═══════════════════════════════════════════════════════
  ['04','20','04 20 00.10','CMU Block — 8" Standard per SF',   'SF', 12.50,  8.50, 0.85,'Supply + lay 8" CMU, mortar, core fill'],
  ['04','20','04 20 00.20','CMU Block — 6" Standard per SF',   'SF', 10.50,  7.25, 0.75,'Supply + lay 6" CMU, mortar'],
  ['04','20','04 20 00.30','CMU Grouting — Solid per SF',      'SF',  2.85,  3.25, 0.25,'Solid grout fill, pumped'],
  ['04','21','04 21 13.10','Brick — Running Bond per SF',      'SF', 14.50, 12.50, 0.95,'Common brick, type S mortar'],
  ['04','21','04 21 13.20','Brick Repair — Repointing per LF', 'LF',  4.85,  1.25, 0.15,'Tuck pointing existing mortar joints'],
  ['04','43','04 43 00.10','Stone Veneer — Dry Stack per SF',  'SF', 16.50, 18.50, 1.25,'Dry stack stone veneer wall'],
  ['04','43','04 43 00.20','Cultured Stone — Install per SF',  'SF', 12.50, 14.50, 0.85,'Cultured stone with mortar bed'],
  ['04','70','04 70 00.10','Stucco — 3-Coat per SF',           'SF',  5.85,  2.85, 0.25,'Scratch, brown, finish coat system'],
  ['04','70','04 70 00.20','Stucco Repair — Match & Patch',   'SF',  8.50,  3.25, 0.25,'Cut out, patch, texture match'],
  ['04','70','04 70 00.30','EIFS System — Install per SF',     'SF', 12.50,  8.50, 0.55,'Exterior insulation finish system'],

  // ═══════════════════════════════════════════════════════
  // DIVISION 05 — METALS / STEEL
  // ═══════════════════════════════════════════════════════
  ['05','10','05 10 00.10','Structural Steel — WF Beam per LF','LF', 28.50, 38.50, 4.50,'Wide-flange beam, erect in place'],
  ['05','10','05 10 00.20','Steel Column — W8 per LF',         'LF', 22.50, 32.50, 3.25,'Steel column erect + base plate'],
  ['05','40','05 40 00.10','Cold-Formed Metal Framing — 20 ga','SF',  6.85,  4.25, 0.45,'Light gauge steel stud wall, 16" OC'],
  ['05','50','05 50 00.10','Miscellaneous Metal — Anchor Bolts','EA', 8.50,  5.50, 0.25,'5/8" anchor bolt, sleeve, epoxy'],
  ['05','50','05 50 00.20','Steel Lintel — 3.5" x 3.5" per LF','LF',  8.50,  12.50, 0.85,'Steel angle lintel for masonry openings'],
  ['05','52','05 52 00.10','Metal Handrail — 1.5" pipe per LF','LF', 38.50, 28.50, 2.50,'Pipe rail, wall brackets, SD code'],
  ['05','52','05 52 00.20','Aluminum Balcony Rail per LF',     'LF', 55.00, 65.00, 2.50,'Aluminum railing w/ tempered glass per SD code'],

  // ═══════════════════════════════════════════════════════
  // DIVISION 06 — WOOD, PLASTICS, COMPOSITES
  // ═══════════════════════════════════════════════════════
  ['06','10','06 10 00.10','Lumber — 2x4 Stud per LF',         'LF',  0.95,  1.25,    0, 'SPF #2 stud, delivered on site'],
  ['06','10','06 10 00.20','Lumber — 2x6 per LF',              'LF',  1.15,  1.85,    0, 'SPF #2 2x6'],
  ['06','10','06 10 00.30','Plywood Sheathing — 1/2" per SF',  'SF',  0.65,  1.25,    0, 'CDX plywood sheathing nailed'],
  ['06','10','06 10 00.40','OSB Sheathing — 7/16" per SF',     'SF',  0.55,  0.95,    0, 'OSB wall or roof sheathing'],
  ['06','11','06 11 00.10','Wall Framing — 2x4 @ 16" OC',      'SF',  2.85,  1.85, 0.15,'Complete wall assembly per SF of wall'],
  ['06','11','06 11 00.20','Wall Framing — 2x6 @ 16" OC',      'SF',  3.25,  2.50, 0.15,'Complete 2x6 wall assembly'],
  ['06','11','06 11 00.30','Roof Framing — Stick Built per SF', 'SF',  5.85,  4.25, 0.45,'Labor + material per SF of roof area'],
  ['06','11','06 11 00.40','Floor Framing — 2x10 @ 16" OC',    'SF',  4.85,  3.85, 0.35,'Floor joist system per SF'],
  ['06','11','06 11 00.50','LVL Beam — 3.5"x11.25" per LF',   'LF', 12.50, 22.50, 1.50,'Install LVL beam + hardware'],
  ['06','11','06 11 00.60','Subfloor — 3/4" T&G OSB',          'SF',  2.50,  2.25, 0.15,'Glued + screwed T&G subfloor'],
  ['06','20','06 20 00.10','Finish Carpentry — Baseboard 3.5"','LF',  3.85,  2.50,    0, 'Install painted base, mitered corners'],
  ['06','20','06 20 00.20','Finish Carpentry — Crown Mold 4"', 'LF',  6.85,  4.50,    0, 'Install crown molding, coped corners'],
  ['06','20','06 20 00.30','Finish Carpentry — Window Casing', 'EA', 85.00, 35.00,    0, 'Window casing, both sides'],
  ['06','20','06 20 00.40','Finish Carpentry — Door Casing',   'EA', 65.00, 28.00,    0, 'Door casing, one side, painted'],
  ['06','20','06 20 00.50','Finish Carpentry — Stair Railing', 'LF', 125.00, 85.00,   0, 'Wood rail, balusters, newel post per LF'],
  ['06','41','06 41 00.10','Cabinets — Kitchen Base per LF',   'LF', 55.00, 285.00,   0, 'Install semi-custom base cabinet per LF'],
  ['06','41','06 41 00.20','Cabinets — Kitchen Upper per LF',  'LF', 48.00, 225.00,   0, 'Install semi-custom upper cabinet per LF'],
  ['06','41','06 41 00.30','Countertop — Quartz per LF',       'LF', 65.00, 165.00,   0, 'Supply + install quartz, eased edge'],
  ['06','41','06 41 00.40','Countertop — Laminate per LF',     'LF', 38.00, 55.00,    0, 'Postform laminate countertop'],

  // ═══════════════════════════════════════════════════════
  // DIVISION 07 — THERMAL & MOISTURE PROTECTION
  // ═══════════════════════════════════════════════════════
  ['07','11','07 11 00.10','Waterproofing — Exterior per SF',  'SF',  2.50,  2.85, 0.25,'Crystalline or membrane waterproofing'],
  ['07','11','07 11 00.20','Vapor Barrier — 6 mil per SF',     'SF',  0.35,  0.28,    0, '6-mil poly under slab or crawl'],
  ['07','19','07 19 00.10','Caulking — Exterior Joint per LF', 'LF',  2.85,  1.25,    0, 'Polyurethane caulk, backer rod'],
  ['07','19','07 19 00.20','Caulking — Interior per LF',       'LF',  1.85,  0.65,    0, 'Paintable latex caulk at trim'],
  ['07','21','07 21 13.10','Batt Insulation — R-13 per SF',    'SF',  0.55,  0.65,    0, 'Fiberglass batt R-13, 2x4 wall'],
  ['07','21','07 21 13.20','Batt Insulation — R-19 per SF',    'SF',  0.65,  0.85,    0, 'Fiberglass batt R-19, 2x6 wall'],
  ['07','21','07 21 13.30','Batt Insulation — R-30 Attic',     'SF',  0.85,  1.15,    0, 'Attic floor batt, CA Title 24'],
  ['07','21','07 21 16.10','Blown Insulation — Cellulose Attic','SF', 0.95,  0.85,    0, 'Blown cellulose attic, R-38'],
  ['07','21','07 21 29.10','Spray Foam — Open Cell 2"',        'SF',  0.85,  1.35,    0, 'Open-cell spray foam R-7'],
  ['07','21','07 21 29.20','Spray Foam — Closed Cell 2"',      'SF',  1.35,  2.85,    0, 'Closed-cell R-13 spray foam'],
  ['07','31','07 31 13.10','Asphalt Shingles — 3-Tab per SQ',  'SQ', 145.00,115.00,  0, 'Per 100 SF, 15-yr shingle'],
  ['07','31','07 31 13.20','Asphalt Shingles — 30-Yr Arch',   'SQ', 185.00,165.00,   0, 'Per 100 SF, architectural laminate'],
  ['07','31','07 31 13.30','Asphalt Shingles — Remove',        'SQ',  55.00, 18.00, 12.00,'Tear-off + dispose per SQ'],
  ['07','31','07 31 63.10','Concrete Roof Tile — Install',     'SQ', 275.00,485.00, 35.00,'Supply + install concrete tile'],
  ['07','31','07 31 63.20','Clay Tile — Install per SQ',       'SQ', 345.00,685.00, 45.00,'Supply + install clay barrel tile'],
  ['07','31','07 31 63.30','Tile Roof — Remove & Reset Repair','SQ', 195.00, 18.00,  0, 'Remove + reset for deck inspection/repair'],
  ['07','41','07 41 13.10','Metal Roofing — Standing Seam',    'SQ', 285.00,385.00, 25.00,'Standing seam Galvalume panel roof'],
  ['07','46','07 46 23.10','Vinyl Siding — Install per SF',    'SF',  2.85,  2.25,    0, 'Double 4" vinyl siding install'],
  ['07','46','07 46 46.10','Fiber Cement Siding — Install',    'SF',  4.25,  3.85,    0, 'HardiePlank lap siding install'],
  ['07','60','07 60 00.10','Sheet Metal Flashing — per LF',    'LF',  6.50,  3.85, 0.25,'Aluminum step or counter flashing'],
  ['07','60','07 60 00.20','Gutters — Alum. 5" K-Style per LF','LF',  8.50,  6.50,    0, 'Seamless aluminum gutters SD'],
  ['07','60','07 60 00.30','Downspout — Alum 3x4" per LF',    'LF',  6.50,  4.85,    0, 'Aluminum downspout with elbows'],
  ['07','90','07 90 00.10','Joint Sealant — Fire Rated per LF','LF',  4.85,  3.25,    0, 'Firestop caulk at penetrations'],

  // ═══════════════════════════════════════════════════════
  // DIVISION 08 — OPENINGS (DOORS, WINDOWS, GLAZING)
  // ═══════════════════════════════════════════════════════
  ['08','11','08 11 13.10','Steel Door — Exterior Prehung',    'EA', 185.00,345.00,   0, '3-0 x 6-8 insulated steel, incl. frame'],
  ['08','11','08 11 13.20','Hollow Core Door — Interior',      'EA', 125.00, 95.00,   0, '3-0 x 6-8 HC door, prehung'],
  ['08','11','08 11 13.30','Solid Core Door — Interior',       'EA', 145.00,185.00,   0, '3-0 x 6-8 SC door, prehung'],
  ['08','11','08 11 13.40','Sliding Glass Door — 6-0 x 6-8',  'EA', 395.00,1050.00,  0, 'Aluminum sliding glass door, low-E'],
  ['08','11','08 11 13.50','Bifold Door — 6-0 w/track',       'EA', 145.00, 225.00,  0, '6-panel bifold door assembly'],
  ['08','14','08 14 00.10','Door Hardware — Entry Lockset',    'EA',  85.00, 125.00,  0, 'Keyed entry lockset, mid-grade'],
  ['08','14','08 14 00.20','Door Hardware — Passage Set',      'EA',  55.00,  55.00,  0, 'Passage lever set, interior'],
  ['08','14','08 14 00.30','Door Hardware — Deadbolt',         'EA',  55.00,  75.00,  0, 'Single cylinder deadbolt'],
  ['08','50','08 50 00.10','Window — Double-Pane Vinyl DH',    'EA', 175.00,350.00,   0, 'Double-hung vinyl window 3-0x4-0 low-E'],
  ['08','50','08 50 00.20','Window — Single-Hung Vinyl',       'EA', 155.00,295.00,   0, 'Single-hung 3-0x4-0, low-E glazing'],
  ['08','50','08 50 00.30','Window — Casement Vinyl',          'EA', 195.00,445.00,   0, 'Casement 2-6x4-0 vinyl, low-E'],
  ['08','50','08 50 00.40','Window — Sliding 6-0 x 4-0',       'EA', 225.00,525.00,   0, 'Sliding window, low-E, vinyl frame'],
  ['08','50','08 50 00.50','Window — Board-Up Emergency',      'EA',  85.00,  35.00,  0, 'Plywood emergency board-up per opening'],
  ['08','80','08 80 00.10','Glass Replacement — Single Pane',  'SF',  15.00,  22.00,  0, 'Single glazing replace per SF'],
  ['08','80','08 80 00.20','Glass Replacement — IGU Dual Pane','SF',  22.00,  45.00,  0, 'Insulated glass unit replace per SF'],
  ['08','80','08 80 00.30','Mirror — Frameless Install per SF','SF',  28.00,  22.00,  0, 'Frameless mirror, clips, adhesive'],

  // ═══════════════════════════════════════════════════════
  // DIVISION 09 — FINISHES
  // ═══════════════════════════════════════════════════════
  // 09 20 — Plaster & Gypsum Board
  ['09','20','09 29 10.10','Drywall 1/2" — Hang, Tape, Finish','SF',  1.75,  1.00,    0, 'Level 4 finish, ready for paint'],
  ['09','20','09 29 10.20','Drywall 5/8" Type X Fire-Rated',   'SF',  1.90,  1.25,    0, 'Fire-rated, garages, ceilings'],
  ['09','20','09 29 10.30','Drywall — Moisture Resistant',     'SF',  1.90,  1.55,    0, 'Green board for wet areas'],
  ['09','20','09 29 10.40','Drywall — Remove Only',            'SF',  0.45,  0.05,    0, 'Demo labor, no disposal'],
  ['09','20','09 29 10.50','Drywall Repair — Small Patch',     'EA', 125.00, 25.00,   0, 'Up to 6"x6" with texture match'],
  ['09','20','09 29 10.60','Drywall Repair — Medium Patch',    'EA', 185.00, 40.00,   0, 'Up to 2x2 ft with texture match'],
  ['09','20','09 29 10.70','Texture — Orange Peel / Knockdown','SF',  0.65,  0.20,    0, 'Spray texture match'],
  ['09','20','09 29 10.80','Texture — Smooth / Level 5',       'SF',  0.85,  0.25,    0, 'Skim coat level 5 finish'],
  // 09 30 — Tile
  ['09','30','09 30 13.10','Ceramic Tile Floor — 12x12',       'SF',  5.00,  4.50,    0, 'Thinset + grout, standard'],
  ['09','30','09 30 13.20','Porcelain Tile Floor — 12x24',     'SF',  5.50,  7.00,    0, 'Rectified porcelain, thinset'],
  ['09','30','09 30 13.30','Large Format Tile — 24x24+',       'SF',  7.00,  8.50,    0, 'Leveling clips required'],
  ['09','30','09 30 23.10','Ceramic Wall Tile — 4x4 Subway',   'SF',  7.00,  6.50,    0, 'Thin-set, grouted'],
  ['09','30','09 30 23.20','Porcelain Wall Tile — 4x12',       'SF',  7.50,  7.50,    0, 'Shower/tub surround tile'],
  ['09','30','09 30 99.10','Tile Remove — Ceramic/Porcelain',  'SF',  2.50,  0.35, 0.35,'Remove + dispose tile + mortar bed'],
  ['09','30','09 30 99.20','Tile Grout — Regrout Only',        'SF',  2.75,  0.50,    0, 'Remove old + apply new grout only'],
  // 09 51 — Acoustical Ceilings
  ['09','51','09 51 13.10','Acoustical Ceiling Tile — 2x2',    'SF',  2.85,  2.25,    0, '5/8" ACT with T-bar grid'],
  ['09','51','09 51 13.20','Acoustical Ceiling Tile — 2x4',    'SF',  2.25,  1.65,    0, 'Standard office ACT system'],
  ['09','51','09 51 13.30','Acoustical Tile — Remove & Reset', 'SF',  1.25,  0.35,    0, 'Careful remove for access, reinstall'],
  // 09 60 — Flooring
  ['09','60','09 65 13.10','LVP Install — Floating Mid-Grade', 'SF',  2.50,  3.50,    0, 'Luxury vinyl plank, 6-8mm'],
  ['09','60','09 65 13.20','LVP Install — Premium Grade',      'SF',  2.75,  5.75,    0, '12mm, 20mil wear layer'],
  ['09','60','09 65 16.10','Sheet Vinyl — Install',            'SF',  2.25,  2.85,    0, 'Rolled vinyl, glue-down'],
  ['09','60','09 65 99.10','Resilient Flooring — Remove',      'SF',  0.85,  0.10, 0.15,'Remove sheet vinyl or VCT'],
  ['09','60','09 68 13.10','Carpet — Mid-Grade Install',       'SY', 18.00, 38.00,   0, 'Install with 8lb rebond pad'],
  ['09','60','09 68 13.20','Carpet — Premium Install',         'SY', 20.00, 65.00,   0, 'Install with 10lb premium pad'],
  ['09','60','09 68 13.30','Carpet — Remove',                  'SY',  4.00,  0.00,   0, 'Remove carpet + pad + tack strip'],
  ['09','60','09 68 16.10','Carpet Pad — 8 lb Rebond',         'SY',  4.50,  8.50,   0, 'Install rebond pad only'],
  ['09','60','09 72 00.10','Hardwood — 3/4" Solid Nail-Down',  'SF',  4.00,  7.00,   0, 'Oak or maple, install only'],
  ['09','60','09 72 00.20','Hardwood — Engineered Float/Glue', 'SF',  3.50,  6.00,   0, 'Engineered hardwood installed'],
  ['09','60','09 72 00.30','Hardwood — Sand & Refinish',       'SF',  2.50,  1.35, 0.65,'Sand, stain, 3-coat poly'],
  ['09','60','09 72 00.40','Hardwood — Remove',                'SF',  1.25,  0.15, 0.15,'Remove & dispose hardwood'],
  // 09 90 — Painting & Coating
  ['09','91','09 91 13.10','Paint Interior Walls — 2 Coats',   'SF',  1.10,  0.40,    0, 'Per SF of wall surface'],
  ['09','91','09 91 13.20','Paint Interior Ceiling — 2 Coats', 'SF',  1.25,  0.40,    0, 'Per SF ceiling area'],
  ['09','91','09 91 13.30','Paint — Prime + 1 Coat Finish',    'SF',  1.20,  0.55,    0, 'New drywall or bare wood'],
  ['09','91','09 91 13.40','Paint Door — Both Sides + Trim',   'EA', 125.00, 25.00,   0, 'Door, jamb, casing both sides'],
  ['09','91','09 91 13.50','Paint Baseboard + Trim per LF',    'LF',  1.50,  0.35,    0, 'Per LF of trim painted'],
  ['09','91','09 91 23.10','Paint Exterior — 2 Coats Stucco',  'SF',  1.75,  0.60,    0, 'Per SF of exterior wall surface'],
  ['09','91','09 91 23.20','Paint Exterior — 1 Coat Repaint',  'SF',  1.20,  0.40,    0, 'Maintenance repaint, 1 coat'],
  ['09','91','09 91 23.30','Epoxy Floor Coating — 2 Coat',     'SF',  2.50,  2.00,    0, 'Garage/commercial floor epoxy'],

  // ═══════════════════════════════════════════════════════
  // DIVISION 22 — PLUMBING
  // ═══════════════════════════════════════════════════════
  ['22','00','22 00 00.10','Plumber — Journeyman per Hour',    'HR', 125.00,  0.00,   0, 'Licensed SD journeyman billing rate'],
  ['22','10','22 11 16.10','Copper Pipe — 3/4" Supply per LF', 'LF',  6.50,  4.85,   0, 'Supply + solder type-L copper'],
  ['22','10','22 11 16.20','Copper Pipe — 1/2" Supply per LF', 'LF',  5.50,  3.50,   0, 'Supply + solder type-L copper'],
  ['22','10','22 11 16.30','PEX Tubing — 3/4" per LF',         'LF',  4.50,  2.25,   0, 'Supply + crimp PEX-A'],
  ['22','10','22 13 16.10','PVC Drain — 3" per LF',             'LF',  5.50,  2.85,   0, 'Supply + glue PVC drain line'],
  ['22','10','22 13 16.20','PVC Drain — 4" per LF',             'LF',  6.50,  4.25,   0, 'Supply + glue PVC main drain'],
  ['22','10','22 13 16.30','ABS Drain — 3" per LF',             'LF',  5.25,  2.65,   0, 'Supply + glue ABS drain CA only'],
  ['22','40','22 40 00.10','Water Closet — Supply + Install',  'EA', 350.00,350.00,   0, 'Elongated, 1.28 GPF, mid-grade'],
  ['22','40','22 40 00.20','Water Closet — Remove & Reset',    'EA', 165.00, 30.00,   0, 'Remove, replace wax ring, reset'],
  ['22','40','22 40 00.30','Lavatory Sink — Supply + Install', 'EA', 350.00,285.00,   0, 'Bath vanity sink + faucet + trap'],
  ['22','40','22 40 00.40','Kitchen Sink — Supply + Install',  'EA', 400.00,425.00,   0, 'Drop-in kitchen sink + faucet'],
  ['22','40','22 40 00.50','Water Heater — 50-Gal Replace',    'EA', 600.00,1200.00,  0, 'Remove old, supply + install, seismic strap'],
  ['22','40','22 40 00.60','Water Heater — Tankless Replace',  'EA', 900.00,2250.00,  0, 'On-demand gas water heater'],
  ['22','40','22 40 00.70','Shower Pan — Fiberglass Replace',  'EA', 485.00,385.00,   0, 'Replace prefab shower pan + drain'],
  ['22','40','22 40 00.80','Bathtub — Supply + Install',       'EA', 550.00,650.00,   0, 'Alcove tub, drain + overflow'],
  ['22','40','22 40 00.90','Drain Cleaning — Hydro-Jet',       'EA', 400.00, 85.00,   0, 'Mainline hydro-jet service'],
  ['22','40','22 40 01.10','Hose Bibb — Install Exterior',     'EA', 200.00, 85.00,   0, 'With anti-siphon shutoff valve'],
  ['22','40','22 40 01.20','Pressure Regulator — Install',     'EA', 285.00,185.00,   0, 'Whole-house PRV, CA code'],

  // ═══════════════════════════════════════════════════════
  // DIVISION 23 — HVAC
  // ═══════════════════════════════════════════════════════
  ['23','00','23 00 00.10','HVAC Technician — per Hour',       'HR', 125.00,  0.00,   0, 'Licensed HVAC tech billing rate SD'],
  ['23','20','23 20 00.10','Air Handling Unit — Residential',  'EA', 800.00,1400.00,  0, 'AHU replacement only, no AC compressor'],
  ['23','20','23 20 00.20','AC Condensing Unit — 3 Ton',       'EA', 850.00,2850.00,  0, 'Compressor only, no AHU or lineset'],
  ['23','20','23 20 00.30','Split System — 3-Ton Complete',    'EA',2200.00,3800.00,  0, 'Full system: AHU + condenser + lineset'],
  ['23','20','23 20 00.40','Split System — 4-Ton Complete',    'EA',2500.00,4700.00,  0, 'Full 4-ton system installed'],
  ['23','20','23 20 00.50','Mini-Split — 1-Ton Single Zone',   'EA',1500.00,1950.00,  0, 'Ductless mini-split, single zone'],
  ['23','20','23 20 00.60','Furnace — 80K BTU Gas Replace',    'EA',1200.00,2000.00,  0, 'Remove old, supply + install'],
  ['23','30','23 31 00.10','Flex Duct — Supply per LF',         'LF',  6.50,  4.25,   0, 'R-6 insulated flex duct run'],
  ['23','30','23 31 00.20','Sheet Metal Duct — per LF',          'LF', 18.50, 12.50,  0, 'Galvanized sheet metal duct'],
  ['23','30','23 31 00.30','Duct Seal / Mastic per Joint',      'EA',  8.50,  2.25,   0, 'Mastic seal at each joint'],
  ['23','30','23 31 00.40','Duct Cleaning — Full System',       'EA', 350.00, 50.00,  0, 'Negative pressure clean up to 10 vents'],
  ['23','30','23 31 00.50','Aeroseal Duct Sealing',             'EA',1000.00,450.00,  0, 'Whole-house aeroseal application'],
  ['23','82','23 82 00.10','Thermostat — Smart WiFi Install',   'EA', 125.00,185.00,  0, 'Ecobee or Nest, app setup included'],
  ['23','82','23 82 00.20','Thermostat — Programmable Install', 'EA',  95.00, 75.00,  0, 'Non-wifi programmable thermostat'],

  // ═══════════════════════════════════════════════════════
  // DIVISION 26 — ELECTRICAL
  // ═══════════════════════════════════════════════════════
  ['26','00','26 00 00.10','Electrician — Journeyman per Hour','HR', 125.00,  0.00,   0, 'Licensed journeyman billing rate SD'],
  ['26','05','26 05 19.10','Wiring — 14/2 NM-B per LF',        'LF',  0.75,  0.55,   0, 'Romex 14/2 wire, rough-in run'],
  ['26','05','26 05 19.20','Wiring — 12/2 NM-B per LF',        'LF',  0.85,  0.75,   0, 'Romex 12/2 wire, rough-in run'],
  ['26','05','26 05 26.10','Conduit — 3/4" EMT per LF',         'LF',  4.25,  1.85,  0, 'EMT conduit with fittings'],
  ['26','05','26 05 33.10','Junction Box — 4" Square Install',  'EA',  25.00, 8.50,   0, 'Nail-on or old-work box'],
  ['26','20','26 24 13.10','Panel — 200A Main Replace',         'EA',1800.00,1200.00, 0, 'Remove old, install 200A panel, permit'],
  ['26','20','26 24 13.20','Panel — 100A Sub Panel',            'EA', 850.00,650.00,  0, 'Sub panel install, fed from main'],
  ['26','20','26 24 13.30','Circuit Breaker — Single Pole',     'EA', 125.00, 55.00,  0, '15A or 20A breaker replace'],
  ['26','20','26 24 13.40','Circuit Breaker — 2-Pole 240V',     'EA', 145.00, 85.00,  0, '30A-60A double pole breaker'],
  ['26','50','26 51 19.10','Duplex Outlet — 120V Install',      'EA',  95.00, 25.00,  0, 'Outlet, box, cover plate'],
  ['26','50','26 51 19.20','GFCI Outlet — Install',             'EA', 110.00, 45.00,  0, 'Required bathrooms/kitchens CA'],
  ['26','50','26 51 19.30','AFCI Outlet — Install',             'EA', 130.00, 55.00,  0, 'Required bedrooms CA 2020'],
  ['26','50','26 51 19.40','USB Combination Outlet',            'EA', 100.00, 45.00,  0, 'USB-A/C combination outlet'],
  ['26','50','26 55 53.10','Light Fixture — Install Standard',  'EA',  95.00, 75.00,  0, 'Install supplied fixture, 8ft ceiling'],
  ['26','50','26 55 53.20','Recessed LED — 6" Install',         'EA', 150.00, 65.00,  0, 'LED wafer, new rough-in, trim'],
  ['26','50','26 55 53.30','Ceiling Fan — Install w/ Brace',    'EA', 175.00,110.00,  0, 'Fan-rated box, brace, mid-grade fan'],
  ['26','50','26 55 53.40','Exterior Light — Install',          'EA', 125.00, 85.00,  0, 'Weatherproof exterior fixture'],
  ['26','90','26 09 23.10','Smoke Detector — Battery',          'EA',  85.00, 35.00,  0, '10-year sealed battery per CA code'],
  ['26','90','26 09 23.20','Smoke Detector — Hardwired',        'EA', 125.00, 55.00,  0, 'Interconnected hardwired + backup'],
  ['26','90','26 09 23.30','CO Detector — Install',             'EA',  95.00, 40.00,  0, 'Required near sleeping areas CA'],
  ['26','90','26 09 23.40','EV Charger — Level 2 Install',      'EA', 485.00,385.00,  0, '240V 50A EVSE outlet + wiring'],
];

// San Diego CCI adjustments
const adjustForSD = (natLabor, natMat, natEquip) => {
  const labor    = Math.round((natLabor    * SD_CCI.labor    * 100)) / 100;
  const material = Math.round((natMat      * SD_CCI.material * 100)) / 100;
  const equipment= Math.round((natEquip    * SD_CCI.equipment* 100)) / 100;
  const total    = Math.round((labor + material + equipment) * 100) / 100;
  return { labor, material, equipment, total };
};

async function seed() {
  console.log('\n📐 RSMeans MasterFormat Pricing Seeder — San Diego, CA');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Create rsmeans table
  await run(`DROP TABLE IF EXISTS rsmeans_pricing`);
  await run(`
    CREATE TABLE rsmeans_pricing (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      csi_division     TEXT NOT NULL,
      csi_subdivision  TEXT NOT NULL,
      csi_code         TEXT UNIQUE NOT NULL,
      description      TEXT NOT NULL,
      unit             TEXT NOT NULL,
      nat_labor        REAL DEFAULT 0,
      nat_material     REAL DEFAULT 0,
      nat_equipment    REAL DEFAULT 0,
      sd_labor         REAL DEFAULT 0,
      sd_material      REAL DEFAULT 0,
      sd_equipment     REAL DEFAULT 0,
      sd_total         REAL DEFAULT 0,
      cci_labor        REAL DEFAULT 1.27,
      cci_material     REAL DEFAULT 1.08,
      cci_equipment    REAL DEFAULT 1.05,
      notes            TEXT,
      is_active        INTEGER DEFAULT 1,
      created_at       DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('💰 Inserting RSMeans items with San Diego City Cost Index...\n');
  let count = 0;
  const divCounts = {};

  for (const item of RSMEANS) {
    const [div, sub, code, desc, unit, natL, natM, natE, notes] = item;
    const sd = adjustForSD(natL, natM, natE);

    await run(`
      INSERT INTO rsmeans_pricing
        (csi_division, csi_subdivision, csi_code, description, unit,
         nat_labor, nat_material, nat_equipment,
         sd_labor, sd_material, sd_equipment, sd_total, notes)
      VALUES (?,?,?,?,?, ?,?,?, ?,?,?,?, ?)
    `, [div, sub, code, desc, unit, natL, natM, natE, sd.labor, sd.material, sd.equipment, sd.total, notes]);

    count++;
    divCounts[`Division ${div}`] = (divCounts[`Division ${div}`] || 0) + 1;
  }

  // Create subscription/tenant tables
  console.log('🏢 Creating SaaS tables (companies, subscriptions)...');

  await run(`
    CREATE TABLE IF NOT EXISTS companies (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      name            TEXT NOT NULL,
      slug            TEXT UNIQUE NOT NULL,
      address         TEXT,
      city            TEXT DEFAULT 'San Diego',
      state           TEXT DEFAULT 'CA',
      zip             TEXT,
      phone           TEXT,
      email           TEXT,
      license_number  TEXT,
      logo_url        TEXT,
      plan            TEXT DEFAULT 'free',
      plan_seats      INTEGER DEFAULT 1,
      is_active       INTEGER DEFAULT 1,
      trial_ends_at   DATETIME,
      created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id      INTEGER NOT NULL,
      plan            TEXT NOT NULL DEFAULT 'free',
      status          TEXT NOT NULL DEFAULT 'active',
      price_monthly   REAL DEFAULT 0,
      billing_cycle   TEXT DEFAULT 'monthly',
      started_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
      ends_at         DATETIME,
      stripe_id       TEXT,
      features        TEXT,
      FOREIGN KEY (company_id) REFERENCES companies(id)
    )
  `);

  // Add company_id to users table
  try {
    await run('ALTER TABLE users ADD COLUMN company_id INTEGER REFERENCES companies(id)');
    console.log('  ✓ Added company_id to users table');
  } catch { /* already exists */ }

  try {
    await run('ALTER TABLE users ADD COLUMN subscription_tier TEXT DEFAULT \'free\'');
    console.log('  ✓ Added subscription_tier to users table');
  } catch { /* already exists */ }

  // Seed demo companies + subscription plans
  await run(`INSERT OR IGNORE INTO companies (id, name, slug, city, state, plan, plan_seats, email)
    VALUES (1, 'Building Care Solutions', 'bcs', 'San Diego', 'CA', 'enterprise', 10, 'mig.buildingcaresolutions@gmail.com')`);

  await run(`INSERT OR IGNORE INTO subscriptions (company_id, plan, status, price_monthly, features)
    VALUES (1, 'enterprise', 'active', 0, '["unlimited_estimates","competitor_pricing","rsmeans","pdf_export","api_access","white_label"]')`);

  console.log('\n✅ RSMeans + SaaS Schema Complete!\n');
  console.log('📐 RSMeans items by division:');
  for (const [div, cnt] of Object.entries(divCounts).sort()) {
    console.log(`   ${div.padEnd(30)} ${cnt} items`);
  }
  console.log(`\n   ${'TOTAL'.padEnd(30)} ${count} items`);
  console.log('\n🏙️  San Diego CCI: Labor ×1.27 | Material ×1.08 | Equipment ×1.05');
  console.log('📅 Based on RSMeans Building Construction Cost Data 2025/2026\n');

  db.close();
}

seed().catch(e => { console.error(e); process.exit(1); });
