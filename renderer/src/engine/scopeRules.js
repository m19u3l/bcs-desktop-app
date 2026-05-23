/**
 * Scope Rule Engine
 * Converts room geometry + damage flags → Xactimate-style line items.
 * All prices are San Diego market defaults; overrideable per estimate.
 */
import { calculateRoom } from '../lib/geometry';

const RULES = {
  water: (room, c) => [
    { description: 'Water Extraction',                    unit: 'SF', qty: c.area,               unit_price: 0.85, category: 'Water Mitigation' },
    { description: 'Structural Drying – Equipment Setup', unit: 'CF', qty: c.volume,             unit_price: 0.12, category: 'Water Mitigation' },
    { description: 'Antimicrobial Treatment',             unit: 'SF', qty: c.area + c.wallArea,  unit_price: 0.28, category: 'Water Mitigation' },
    { description: 'Floor Covering – Remove & Dispose',   unit: 'SF', qty: c.area,               unit_price: 1.20, category: 'Flooring'         },
    { description: 'Baseboard – Remove & Dispose',        unit: 'LF', qty: c.perimeter,          unit_price: 0.55, category: 'Carpentry'        },
    { description: 'Drywall – Remove (wet, lower 4\')',   unit: 'SF', qty: c.perimeter * 4,      unit_price: 0.82, category: 'Drywall'          },
  ],

  mold: (room, c) => [
    { description: 'Mold Containment – Polyethylene Barrier', unit: 'LF', qty: c.perimeter,         unit_price: 6.50, category: 'Mold Remediation' },
    { description: 'Mold Remediation – Surface Treatment',    unit: 'SF', qty: c.area + c.wallArea, unit_price: 2.15, category: 'Mold Remediation' },
    { description: 'HEPA Vacuuming',                          unit: 'SF', qty: c.area + c.wallArea, unit_price: 0.75, category: 'Mold Remediation' },
    { description: 'Antimicrobial Application',               unit: 'SF', qty: c.area + c.wallArea, unit_price: 0.28, category: 'Mold Remediation' },
    { description: 'Air Scrubber – Setup & Operation',        unit: 'Day', qty: 3,                  unit_price: 95,   category: 'Equipment'       },
  ],

  fire: (room, c) => [
    { description: 'Debris Removal – Fire Damaged Materials', unit: 'SF', qty: c.area,    unit_price: 3.50, category: 'Fire Restoration' },
    { description: 'Drywall – Remove (fire damaged)',         unit: 'SF', qty: c.wallArea, unit_price: 1.20, category: 'Drywall'          },
    { description: 'Structural Cleaning – Char & Soot',       unit: 'SF', qty: c.area + c.wallArea, unit_price: 1.85, category: 'Fire Restoration' },
    { description: 'Content Pack-Out & Inventory',            unit: 'HR', qty: Math.ceil(c.area / 80), unit_price: 65, category: 'Contents'     },
    { description: 'Deodorization – Thermal Fogging',         unit: 'CF', qty: c.volume,  unit_price: 0.08, category: 'Smoke Restoration' },
  ],

  smoke: (room, c) => [
    { description: 'Smoke & Soot Cleaning – Walls',   unit: 'SF', qty: c.wallArea, unit_price: 0.95, category: 'Smoke Restoration' },
    { description: 'Smoke & Soot Cleaning – Ceiling', unit: 'SF', qty: c.area,     unit_price: 0.95, category: 'Smoke Restoration' },
    { description: 'Odor Counteractant – Apply',       unit: 'SF', qty: c.area + c.wallArea, unit_price: 0.35, category: 'Smoke Restoration' },
    { description: 'Deodorization – Thermal Fogging', unit: 'CF', qty: c.volume,   unit_price: 0.08, category: 'Smoke Restoration' },
  ],
};

/**
 * @param {Array} rooms  Array of room objects with damage flags
 * @returns {Array}      Flat array of line item objects ready to price
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
        const qty = Math.max(1, Math.ceil(item.qty));
        items.push({
          ...item,
          room_name:  room.name,
          qty,
          subtotal:   Math.round(qty * item.unit_price * 100) / 100,
        });
      });
    }
  }
  return items;
}

export const DAMAGE_META = [
  { key: 'water', label: 'Water Damage', color: '#3b82f6' },
  { key: 'mold',  label: 'Mold',         color: '#22c55e' },
  { key: 'fire',  label: 'Fire Damage',  color: '#f97316' },
  { key: 'smoke', label: 'Smoke / Soot', color: '#f59e0b' },
];
