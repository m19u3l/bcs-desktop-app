/**
 * Scope Rule Engine v2
 * Room geometry + damage flags → Xactimate-style line items with labor costs.
 * San Diego 2025 market rates; overrideable per estimate.
 */
import { calculateRoom } from '../lib/geometry';

// SD 2025 loaded labor rates ($/hr) and default crew size per trade
const RATES = {
  'Water Mitigation':  { rate: 65, crew: 2 },
  'Mold Remediation':  { rate: 75, crew: 2 },
  'Fire Restoration':  { rate: 70, crew: 2 },
  'Smoke Restoration': { rate: 65, crew: 2 },
  'Drywall':           { rate: 55, crew: 2 },
  'Flooring':          { rate: 60, crew: 2 },
  'Carpentry':         { rate: 65, crew: 1 },
  'Equipment':         { rate: 0,  crew: 0 },
  'Contents':          { rate: 55, crew: 2 },
  'General':           { rate: 45, crew: 1 },
};

// hrs_per_unit = labor hours per 1 unit of measurement at crew size
const RULES = {
  water: (room, c) => [
    { description: 'Water Extraction',                    unit: 'SF',  qty: c.area,               unit_price: 0.85, hrs_per_unit: 0.004, category: 'Water Mitigation' },
    { description: 'Structural Drying – Equipment Setup', unit: 'CF',  qty: c.volume,             unit_price: 0.12, hrs_per_unit: 0.001, category: 'Water Mitigation' },
    { description: 'Antimicrobial Treatment',             unit: 'SF',  qty: c.area + c.wallArea,  unit_price: 0.28, hrs_per_unit: 0.003, category: 'Water Mitigation' },
    { description: 'Floor Covering – Remove & Dispose',   unit: 'SF',  qty: c.area,               unit_price: 1.20, hrs_per_unit: 0.012, category: 'Flooring'         },
    { description: 'Baseboard – Remove & Dispose',        unit: 'LF',  qty: c.perimeter,          unit_price: 0.55, hrs_per_unit: 0.025, category: 'Carpentry'        },
    { description: "Drywall – Remove (wet, lower 4')",   unit: 'SF',  qty: c.perimeter * 4,      unit_price: 0.82, hrs_per_unit: 0.020, category: 'Drywall'          },
    { description: 'Dehumidifier – Rental (per day)',     unit: 'Day', qty: Math.ceil(c.area / 150), unit_price: 45, hrs_per_unit: 0,   category: 'Equipment'       },
    { description: 'Air Mover – Rental (per day)',        unit: 'Day', qty: Math.ceil(c.perimeter / 10), unit_price: 25, hrs_per_unit: 0, category: 'Equipment'     },
  ],

  mold: (room, c) => [
    { description: 'Mold Containment – Polyethylene Barrier', unit: 'LF',  qty: c.perimeter,         unit_price: 6.50, hrs_per_unit: 0.05,  category: 'Mold Remediation' },
    { description: 'Mold Remediation – Surface Treatment',    unit: 'SF',  qty: c.area + c.wallArea, unit_price: 2.15, hrs_per_unit: 0.015, category: 'Mold Remediation' },
    { description: 'HEPA Vacuuming',                          unit: 'SF',  qty: c.area + c.wallArea, unit_price: 0.75, hrs_per_unit: 0.008, category: 'Mold Remediation' },
    { description: 'Antimicrobial Application',               unit: 'SF',  qty: c.area + c.wallArea, unit_price: 0.28, hrs_per_unit: 0.003, category: 'Mold Remediation' },
    { description: 'Air Scrubber – Setup & Operation',        unit: 'Day', qty: 3,                   unit_price: 95,   hrs_per_unit: 0.5,   category: 'Equipment'       },
    { description: 'Negative Air Machine – Operation',        unit: 'Day', qty: 3,                   unit_price: 65,   hrs_per_unit: 0,     category: 'Equipment'       },
  ],

  fire: (room, c) => [
    { description: 'Debris Removal – Fire Damaged Materials', unit: 'SF',  qty: c.area,               unit_price: 3.50, hrs_per_unit: 0.030, category: 'Fire Restoration' },
    { description: 'Drywall – Remove (fire damaged)',         unit: 'SF',  qty: c.wallArea,           unit_price: 1.20, hrs_per_unit: 0.020, category: 'Drywall'          },
    { description: 'Structural Cleaning – Char & Soot',       unit: 'SF',  qty: c.area + c.wallArea,  unit_price: 1.85, hrs_per_unit: 0.018, category: 'Fire Restoration' },
    { description: 'Content Pack-Out & Inventory',            unit: 'HR',  qty: Math.ceil(c.area / 80), unit_price: 65, hrs_per_unit: 1,    category: 'Contents'        },
    { description: 'Deodorization – Thermal Fogging',         unit: 'CF',  qty: c.volume,             unit_price: 0.08, hrs_per_unit: 0.001, category: 'Smoke Restoration'},
  ],

  smoke: (room, c) => [
    { description: 'Smoke & Soot Cleaning – Walls',   unit: 'SF',  qty: c.wallArea,           unit_price: 0.95, hrs_per_unit: 0.010, category: 'Smoke Restoration' },
    { description: 'Smoke & Soot Cleaning – Ceiling', unit: 'SF',  qty: c.area,               unit_price: 0.95, hrs_per_unit: 0.010, category: 'Smoke Restoration' },
    { description: 'Odor Counteractant – Apply',       unit: 'SF',  qty: c.area + c.wallArea,  unit_price: 0.35, hrs_per_unit: 0.004, category: 'Smoke Restoration' },
    { description: 'Deodorization – Thermal Fogging', unit: 'CF',  qty: c.volume,             unit_price: 0.08, hrs_per_unit: 0.001, category: 'Smoke Restoration' },
    { description: 'Ozone Treatment – Setup & Run',   unit: 'Day', qty: 2,                    unit_price: 85,   hrs_per_unit: 0.5,   category: 'Equipment'        },
  ],
};

/**
 * @param {Array} rooms  Rooms with damage flags
 * @returns {Array}      Line items with material_cost, labor_hours, labor_cost, subtotal
 */
export function generateLineItems(rooms) {
  const items = [];
  for (const room of rooms) {
    if (!room.damages || room.damages.length === 0) continue;
    const c = calculateRoom(room);
    for (const damage of room.damages) {
      const fn = RULES[damage];
      if (!fn) continue;
      fn(room, c).forEach(item => {
        const qty          = Math.max(1, Math.ceil(item.qty));
        const { rate, crew } = RATES[item.category] ?? { rate: 0, crew: 0 };
        const material_cost = Math.round(qty * item.unit_price * 100) / 100;
        const labor_hours   = Math.round(qty * (item.hrs_per_unit ?? 0) * 100) / 100;
        const labor_cost    = Math.round(labor_hours * rate * 100) / 100;
        items.push({
          ...item,
          room_name:    room.name,
          qty,
          material_cost,
          labor_hours,
          labor_cost,
          crew_size:    crew,
          subtotal:     Math.round((material_cost + labor_cost) * 100) / 100,
        });
      });
    }
  }
  return items;
}

/**
 * Aggregates line items into a full cost summary.
 * @param {Array} lineItems  Output of generateLineItems()
 * @returns {Object}         Summary with totals, overhead, profit, tax, duration, crew
 */
export function generateSummary(lineItems) {
  const material_total = lineItems.reduce((s, i) => s + i.material_cost, 0);
  const labor_total    = lineItems.reduce((s, i) => s + i.labor_cost,    0);
  const total_labor_hrs = lineItems.reduce((s, i) => s + i.labor_hours,  0);
  const peak_crew      = lineItems.reduce((s, i) => Math.max(s, i.crew_size ?? 0), 0) || 2;

  const subtotal  = material_total + labor_total;
  const overhead  = subtotal * 0.10;
  const profit    = subtotal * 0.12;
  const tax       = (subtotal + overhead + profit) * 0.0875;
  const total     = subtotal + overhead + profit + tax;

  // Working days = labor hours ÷ crew ÷ 8-hr shift, then calendar days (+weekends ≈ ×1.4)
  const working_days  = total_labor_hrs / peak_crew / 8;
  const duration_days = Math.max(1, Math.ceil(working_days * 1.4));

  const round2 = n => Math.round(n * 100) / 100;
  return {
    material_total:  round2(material_total),
    labor_total:     round2(labor_total),
    subtotal:        round2(subtotal),
    overhead:        round2(overhead),
    profit:          round2(profit),
    tax:             round2(tax),
    total:           round2(total),
    total_labor_hrs: round2(total_labor_hrs),
    duration_days,
    peak_crew,
  };
}

export const DAMAGE_META = [
  { key: 'water', label: 'Water Damage', color: '#3b82f6' },
  { key: 'mold',  label: 'Mold',         color: '#22c55e' },
  { key: 'fire',  label: 'Fire Damage',  color: '#f97316' },
  { key: 'smoke', label: 'Smoke / Soot', color: '#f59e0b' },
];
