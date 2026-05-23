import express from 'express';
import db from '../db.js';

const router = express.Router();

// Ensure trade/services/notes columns exist
db.run('ALTER TABLE vendors ADD COLUMN trade TEXT').catch(() => {});
db.run('ALTER TABLE vendors ADD COLUMN services TEXT').catch(() => {});
db.run('ALTER TABLE vendors ADD COLUMN notes TEXT').catch(() => {});

const FIELDS = ['name', 'trade', 'contact_person', 'email', 'phone', 'address', 'services', 'notes'];

// GET all vendors
router.get('/', async (req, res, next) => {
  try {
    const items = await db.all('SELECT * FROM vendors ORDER BY trade, name ASC');
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    next(error);
  }
});

// GET single vendor
router.get('/:id', async (req, res, next) => {
  try {
    const item = await db.get('SELECT * FROM vendors WHERE id = ?', [req.params.id]);
    if (!item) return res.status(404).json({ error: 'vendor not found' });
    res.json(item);
  } catch (error) {
    next(error);
  }
});

// CREATE vendor
router.post('/', async (req, res, next) => {
  try {
    const values = FIELDS.map(f => req.body[f] ?? null);
    const result = await db.run(
      `INSERT INTO vendors (${FIELDS.join(', ')}) VALUES (${FIELDS.map(() => '?').join(', ')})`,
      values
    );
    const newItem = await db.get('SELECT * FROM vendors WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    next(error);
  }
});

// UPDATE vendor
router.put('/:id', async (req, res, next) => {
  try {
    const values = [...FIELDS.map(f => req.body[f] ?? null), req.params.id];
    await db.run(
      `UPDATE vendors SET ${FIELDS.map(f => `${f} = ?`).join(', ')} WHERE id = ?`,
      values
    );
    const updated = await db.get('SELECT * FROM vendors WHERE id = ?', [req.params.id]);
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// DELETE vendor
router.delete('/:id', async (req, res, next) => {
  try {
    await db.run('DELETE FROM vendors WHERE id = ?', [req.params.id]);
    res.json({ message: 'vendor deleted successfully', id: req.params.id });
  } catch (error) {
    next(error);
  }
});

// SEED sample San Diego vendors — only runs if fewer than 10 vendors exist
router.post('/seed', async (req, res, next) => {
  try {
    const count = await db.get('SELECT COUNT(*) as n FROM vendors');
    if (count.n >= 10) return res.json({ message: 'Vendors already seeded.', count: count.n });

    const seed = [
      // Water Mitigation / Dryout
      { trade: 'Water Mitigation', name: 'Pacific Dryout Services',      contact_person: 'Mike Torres',     phone: '(619) 555-0101', email: 'mike@pacificdryout.com',      address: '1234 Ocean View Dr, San Diego CA 92101',       services: 'Water extraction, dryout, dehumidification' },
      { trade: 'Water Mitigation', name: 'SD Water Damage Pros',          contact_person: 'Sarah Chen',      phone: '(858) 555-0102', email: 'sarah@sdwaterdamage.com',      address: '5678 Mission Valley Rd, San Diego CA 92108',   services: 'Emergency dryout, mold prevention' },
      { trade: 'Water Mitigation', name: 'Coastal Restoration Group',     contact_person: 'Carlos Rivera',   phone: '(760) 555-0103', email: 'carlos@coastalrestoration.com', address: '890 Harbor Dr, Chula Vista CA 91910',          services: 'Full water mitigation, structural drying' },
      { trade: 'Water Mitigation', name: 'SoCal Emergency Dryout',        contact_person: 'Jennifer Park',   phone: '(619) 555-0104', email: 'jen@socaldrytout.com',         address: '2345 El Cajon Blvd, El Cajon CA 92020',        services: '24/7 emergency response, dryout' },
      { trade: 'Water Mitigation', name: 'Desert & Coast Mitigation',     contact_person: 'David Kim',       phone: '(858) 555-0105', email: 'david@desertcoast.com',        address: '678 Miramar Rd, San Diego CA 92126',           services: 'Water damage assessment and mitigation' },
      // Drywall
      { trade: 'Drywall',          name: 'Precision Drywall SD',          contact_person: 'Tony Morales',    phone: '(619) 555-0201', email: 'tony@precisiondrywall.com',    address: '345 National Ave, San Diego CA 92113',         services: 'Hang, tape, texture, finish' },
      { trade: 'Drywall',          name: 'Master Wall Systems',           contact_person: 'Lisa Johnson',    phone: '(858) 555-0202', email: 'lisa@masterwallsd.com',        address: '1122 Morena Blvd, San Diego CA 92110',         services: 'Commercial and residential drywall' },
      { trade: 'Drywall',          name: 'Pacific Coast Drywall',         contact_person: 'Marco Sanchez',   phone: '(760) 555-0203', email: 'marco@pacificcoastdw.com',    address: '456 Vista Way, Oceanside CA 92054',            services: 'Drywall installation and repair' },
      { trade: 'Drywall',          name: 'Elite Finishing Contractors',   contact_person: 'Amy Wong',        phone: '(619) 555-0204', email: 'amy@elitefinishing.com',       address: '789 Broadway, Chula Vista CA 91910',           services: 'Drywall, texture, paint ready finish' },
      { trade: 'Drywall',          name: 'SoCal Wall Experts',            contact_person: 'Robert Garcia',   phone: '(858) 555-0205', email: 'robert@socalwall.com',         address: '2233 Clairemont Dr, San Diego CA 92117',       services: 'Drywall, insulation, moisture barrier' },
      // Roofing
      { trade: 'Roofing',          name: 'San Diego Roofing Pro',         contact_person: 'Jim Anderson',    phone: '(619) 555-0301', email: 'jim@sdroofingpro.com',         address: '567 Old Town Ave, San Diego CA 92110',         services: 'Shingle, tile, flat roof repair and replace' },
      { trade: 'Roofing',          name: 'Pacific Ridge Roofing',         contact_person: 'Maria Lopez',     phone: '(858) 555-0302', email: 'maria@pacificridge.com',       address: '4567 Convoy St, San Diego CA 92111',           services: 'Insurance roofing, full replacement' },
      { trade: 'Roofing',          name: 'Coastal Shield Roofing',        contact_person: 'Kevin Brown',     phone: '(760) 555-0303', email: 'kevin@coastalshield.com',      address: '234 Mission Ave, Escondido CA 92025',          services: 'Residential roofing and waterproofing' },
      { trade: 'Roofing',          name: 'SunBelt Roofing Solutions',     contact_person: 'Diana Reyes',     phone: '(619) 555-0304', email: 'diana@sunbeltroofing.com',     address: '890 Main St, Chula Vista CA 91911',            services: 'Tile and shingle, TPO flat roofs' },
      { trade: 'Roofing',          name: 'Summit Roofing & Repair',       contact_person: 'Paul Davis',      phone: '(858) 555-0305', email: 'paul@summitroofing.com',       address: '1234 Friars Rd, San Diego CA 92108',           services: 'Emergency tarping, full roof systems' },
      // Plumbing
      { trade: 'Plumbing',         name: 'Coastal Plumbing SD',           contact_person: 'Frank Miller',    phone: '(619) 555-0401', email: 'frank@coastalplumbing.com',    address: '123 India St, San Diego CA 92101',             services: 'Pipe repair, leak detection, repiping' },
      { trade: 'Plumbing',         name: 'All Plumbing Pros',             contact_person: 'Nancy Nguyen',    phone: '(858) 555-0402', email: 'nancy@allplumbingpros.com',    address: '5432 Balboa Ave, San Diego CA 92111',          services: 'Residential and commercial plumbing' },
      { trade: 'Plumbing',         name: 'Pacific Pipe & Drain',          contact_person: 'James Wilson',    phone: '(760) 555-0403', email: 'james@pacificpipe.com',        address: '678 El Norte Pkwy, Escondido CA 92026',        services: 'Drain clearing, sewer, water heater' },
      { trade: 'Plumbing',         name: 'SD Rooter & Plumbing',          contact_person: 'Rosa Martinez',   phone: '(619) 555-0404', email: 'rosa@sdrooter.com',            address: '345 Highland Ave, National City CA 91950',     services: 'Emergency plumbing, rooter service' },
      { trade: 'Plumbing',         name: 'Rapid Plumbing Response',       contact_person: 'Chris Lee',       phone: '(858) 555-0405', email: 'chris@rapidplumbing.com',      address: '2100 Camino Del Rio N, San Diego CA 92108',    services: '24/7 plumbing, water damage plumbing' },
      // Electrical
      { trade: 'Electrical',       name: 'SunCoast Electric',             contact_person: 'Steve Thompson',  phone: '(619) 555-0501', email: 'steve@suncoastelectric.com',   address: '456 Kettner Blvd, San Diego CA 92101',         services: 'Panel upgrades, rewiring, code compliance' },
      { trade: 'Electrical',       name: 'Pacific Power Services',        contact_person: 'Emily Davis',     phone: '(858) 555-0502', email: 'emily@pacificpower.com',       address: '1890 Garnet Ave, San Diego CA 92109',          services: 'Commercial and residential electrical' },
      { trade: 'Electrical',       name: 'SoCal Electrical Pros',         contact_person: 'Miguel Santos',   phone: '(760) 555-0503', email: 'miguel@socalelectrical.com',   address: '789 Mission Ave, Oceanside CA 92054',          services: 'General electrical, surge protection' },
      { trade: 'Electrical',       name: 'Reliable Electric SD',          contact_person: 'Tina Clark',      phone: '(619) 555-0504', email: 'tina@reliableelectricsd.com',  address: '234 E 8th St, National City CA 91950',         services: 'Inspection, repair, installation' },
      { trade: 'Electrical',       name: 'Sharp Electric Solutions',      contact_person: 'Brian White',     phone: '(858) 555-0505', email: 'brian@sharpelectric.com',      address: '3456 Sports Arena Blvd, San Diego CA 92110',   services: 'Smart home, EV chargers, panel work' },
      // Flooring
      { trade: 'Flooring',         name: 'Pacific Floors SD',             contact_person: 'Alex Gomez',      phone: '(619) 555-0601', email: 'alex@pacificfloors.com',       address: '789 Rosecrans St, San Diego CA 92106',         services: 'LVP, tile, hardwood installation' },
      { trade: 'Flooring',         name: 'ProFloor Installation',         contact_person: 'Sandra Kim',      phone: '(858) 555-0602', email: 'sandra@profloor.com',          address: '4321 Genesee Ave, San Diego CA 92117',         services: 'Flooring removal and installation' },
      { trade: 'Flooring',         name: 'Coastal Hardwood & Tile',       contact_person: 'Ray Hernandez',   phone: '(760) 555-0603', email: 'ray@coastalhardwood.com',      address: '567 S Coast Hwy, Oceanside CA 92054',          services: 'Hardwood, tile, laminate, LVP' },
      { trade: 'Flooring',         name: 'SoCal Flooring Experts',        contact_person: 'Patricia Diaz',   phone: '(619) 555-0604', email: 'patricia@socalflooring.com',   address: '1234 E Main St, El Cajon CA 92021',            services: 'Insurance flooring, fast turnaround' },
      { trade: 'Flooring',         name: 'Premium Carpet & Flooring',     contact_person: 'Greg Wilson',     phone: '(858) 555-0605', email: 'greg@premiumcarpet.com',       address: '6789 Linda Vista Rd, San Diego CA 92111',      services: 'Carpet, LVP, tile, subfloor repair' },
    ];

    for (const v of seed) {
      const f = ['name', 'trade', 'contact_person', 'email', 'phone', 'address', 'services'];
      await db.run(
        `INSERT INTO vendors (${f.join(', ')}) VALUES (${f.map(() => '?').join(', ')})`,
        f.map(k => v[k] ?? null)
      );
    }

    res.json({ message: `Seeded ${seed.length} vendors.`, count: seed.length });
  } catch (error) {
    next(error);
  }
});

export default router;
