/**
 * BCS Complete Service Categories - Seed Script
 * Run with: node scripts/seed-services.js
 */

import db from '../db.js';

const services = [
  // WATER DAMAGE RESTORATION & INSURANCE WORK
  // 1. Water Mitigation (WTR)
  { name: 'Emergency Water Extraction', description: 'Immediate water removal using truck-mounted and portable extractors', category: 'WTR - Water Mitigation', base_price: 350.00 },
  { name: 'Structural Drying & Dehumidification', description: 'Industrial dehumidifiers and air movers for complete drying', category: 'WTR - Water Mitigation', base_price: 450.00 },
  { name: 'Moisture Monitoring & Documentation', description: 'Daily readings with thermal imaging and moisture meters', category: 'WTR - Water Mitigation', base_price: 125.00 },
  { name: 'Antimicrobial Treatment', description: 'Application of EPA-registered antimicrobial agents', category: 'WTR - Water Mitigation', base_price: 275.00 },
  { name: 'Air Filtration & Odor Control', description: 'HEPA air scrubbers and hydroxyl generators', category: 'WTR - Water Mitigation', base_price: 200.00 },

  // 2. Mold Remediation (MLD)
  { name: 'Containment Setup', description: 'Negative air pressure containment barriers', category: 'MLD - Mold Remediation', base_price: 500.00 },
  { name: 'HEPA Filtration', description: 'Continuous HEPA air filtration during remediation', category: 'MLD - Mold Remediation', base_price: 175.00 },
  { name: 'Mold Removal & Cleaning', description: 'Physical removal and HEPA vacuuming of mold growth', category: 'MLD - Mold Remediation', base_price: 750.00 },
  { name: 'Post-Remediation Clearance Testing', description: 'Third-party air quality testing after remediation', category: 'MLD - Mold Remediation', base_price: 350.00 },
  { name: 'Certificate of Mold Clearance', description: 'Documentation for insurance and property records', category: 'MLD - Mold Remediation', base_price: 150.00 },

  // 3. Cleaning (CLN)
  { name: 'Content Cleaning & Deodorization', description: 'Cleaning and deodorizing personal belongings', category: 'CLN - Cleaning', base_price: 225.00 },
  { name: 'Carpet & Upholstery Cleaning', description: 'Hot water extraction and sanitization', category: 'CLN - Cleaning', base_price: 185.00 },
  { name: 'Air Duct Cleaning', description: 'Complete HVAC duct system cleaning', category: 'CLN - Cleaning', base_price: 450.00 },
  { name: 'Specialized Cleaning Services', description: 'Electronics, documents, and specialty items', category: 'CLN - Cleaning', base_price: 300.00 },
  { name: 'Smoke & Fire Damage Cleaning', description: 'Soot removal and smoke odor elimination', category: 'CLN - Cleaning', base_price: 425.00 },

  // 4. Contents Manipulation (CNT)
  { name: 'Pack-Out Services', description: 'Careful packing and removal of contents', category: 'CNT - Contents', base_price: 500.00 },
  { name: 'Inventory Documentation', description: 'Detailed photo inventory with descriptions', category: 'CNT - Contents', base_price: 250.00 },
  { name: 'Climate-Controlled Storage', description: 'Secure storage during restoration (per month)', category: 'CNT - Contents', base_price: 350.00 },
  { name: 'Content Protection', description: 'Covering and protecting items during work', category: 'CNT - Contents', base_price: 175.00 },
  { name: 'Move-Back & Restoration', description: 'Returning and placing contents after completion', category: 'CNT - Contents', base_price: 400.00 },

  // DEMOLITION & STRUCTURAL WORK
  // 5. Demolition (DEM)
  { name: 'Drywall Removal', description: 'Controlled removal to flood cuts or full demo', category: 'DEM - Demolition', base_price: 3.50 },
  { name: 'Flooring Removal', description: 'Carpet, tile, hardwood, or vinyl removal', category: 'DEM - Demolition', base_price: 2.75 },
  { name: 'Cabinet & Fixture Removal', description: 'Careful removal of cabinets and built-ins', category: 'DEM - Demolition', base_price: 150.00 },
  { name: 'Structural Material Removal', description: 'Removal of damaged framing and sheathing', category: 'DEM - Demolition', base_price: 450.00 },
  { name: 'Debris Hauling & Disposal', description: 'Complete removal and proper disposal', category: 'DEM - Demolition', base_price: 350.00 },

  // 6. Rough Carpentry (RCP)
  { name: 'Floor Joist Repair/Replacement', description: 'Structural joist repair or sistering', category: 'RCP - Rough Carpentry', base_price: 85.00 },
  { name: 'Wall Framing & Studs', description: 'New stud wall framing installation', category: 'RCP - Rough Carpentry', base_price: 8.50 },
  { name: 'Roof Framing & Sheathing', description: 'Rafter and sheathing repair/replacement', category: 'RCP - Rough Carpentry', base_price: 12.00 },
  { name: 'Subfloor Installation', description: 'New plywood or OSB subfloor', category: 'RCP - Rough Carpentry', base_price: 4.50 },
  { name: 'Structural Beam Work', description: 'Header and beam installation', category: 'RCP - Rough Carpentry', base_price: 650.00 },

  // 7. Masonry (MAS)
  { name: 'Concrete Work & Repair', description: 'Concrete patching and repair', category: 'MAS - Masonry', base_price: 450.00 },
  { name: 'Brick & Stone Repair', description: 'Tuckpointing and masonry repair', category: 'MAS - Masonry', base_price: 75.00 },
  { name: 'Foundation Work', description: 'Minor foundation repairs', category: 'MAS - Masonry', base_price: 850.00 },
  { name: 'Retaining Walls', description: 'Block or concrete retaining wall construction', category: 'MAS - Masonry', base_price: 95.00 },
  { name: 'Stucco Structural Repairs', description: 'Structural stucco crack repair', category: 'MAS - Masonry', base_price: 65.00 },

  // INTERIOR FINISHES
  // 8. Drywall (DRY)
  { name: 'Drywall Hanging', description: 'Installation of new drywall sheets', category: 'DRY - Drywall', base_price: 2.25 },
  { name: 'Taping & Mudding', description: 'Joint compound and tape application', category: 'DRY - Drywall', base_price: 1.75 },
  { name: 'Texture Matching', description: 'Match existing texture (orange peel, knockdown, etc.)', category: 'DRY - Drywall', base_price: 2.50 },
  { name: 'Finishing & Sanding', description: 'Smooth finish ready for paint', category: 'DRY - Drywall', base_price: 1.25 },
  { name: 'Moisture-Resistant Drywall', description: 'Green board or purple board installation', category: 'DRY - Drywall', base_price: 3.00 },

  // 9. Painting & Wall Covering (PNT)
  { name: 'Interior Painting - Walls', description: 'Two-coat paint application on walls', category: 'PNT - Painting', base_price: 2.75 },
  { name: 'Interior Painting - Ceilings', description: 'Ceiling paint application', category: 'PNT - Painting', base_price: 3.25 },
  { name: 'Interior Painting - Trim', description: 'Baseboard, door, and window trim painting', category: 'PNT - Painting', base_price: 2.50 },
  { name: 'Exterior Painting', description: 'Exterior surface preparation and painting', category: 'PNT - Painting', base_price: 4.50 },
  { name: 'Primers & Sealers', description: 'Stain-blocking and sealing primers', category: 'PNT - Painting', base_price: 1.50 },
  { name: 'Wallpaper Installation/Removal', description: 'Wallpaper hanging or removal', category: 'PNT - Painting', base_price: 5.00 },

  // 10. Finish Carpentry (CRP)
  { name: 'Baseboard Installation', description: 'New baseboard molding installation', category: 'CRP - Finish Carpentry', base_price: 4.50 },
  { name: 'Crown Molding', description: 'Crown molding installation', category: 'CRP - Finish Carpentry', base_price: 8.50 },
  { name: 'Door & Window Trim', description: 'Casing and trim installation', category: 'CRP - Finish Carpentry', base_price: 125.00 },
  { name: 'Chair Rail & Wainscoting', description: 'Decorative wall trim installation', category: 'CRP - Finish Carpentry', base_price: 12.00 },
  { name: 'Stairs & Railings', description: 'Stair tread and railing installation', category: 'CRP - Finish Carpentry', base_price: 450.00 },
  { name: 'Custom Millwork', description: 'Custom trim and architectural details', category: 'CRP - Finish Carpentry', base_price: 85.00 },

  // 11. Floor Covering (FLR)
  { name: 'Carpet Installation', description: 'Carpet and pad installation', category: 'FLR - Flooring', base_price: 6.50 },
  { name: 'Hardwood Flooring', description: 'Solid or engineered hardwood installation', category: 'FLR - Flooring', base_price: 9.50 },
  { name: 'Tile Flooring', description: 'Ceramic or porcelain tile installation', category: 'FLR - Flooring', base_price: 12.00 },
  { name: 'Vinyl & Laminate', description: 'LVP, LVT, or laminate installation', category: 'FLR - Flooring', base_price: 5.50 },
  { name: 'Floor Refinishing', description: 'Sand and refinish hardwood floors', category: 'FLR - Flooring', base_price: 4.50 },

  // 12. Tile & Stone (TIL)
  { name: 'Bathroom Tile Work', description: 'Floor and wall tile in bathrooms', category: 'TIL - Tile & Stone', base_price: 14.00 },
  { name: 'Kitchen Backsplash', description: 'Tile backsplash installation', category: 'TIL - Tile & Stone', base_price: 18.00 },
  { name: 'Shower Surrounds', description: 'Complete shower tile installation', category: 'TIL - Tile & Stone', base_price: 1200.00 },
  { name: 'Natural Stone Installation', description: 'Marble, travertine, slate installation', category: 'TIL - Tile & Stone', base_price: 22.00 },
  { name: 'Grout & Caulk Work', description: 'Grouting and caulking services', category: 'TIL - Tile & Stone', base_price: 3.50 },

  // CABINETS, COUNTERTOPS & FIXTURES
  // 13. Cabinets (CAB)
  { name: 'Kitchen Cabinet Installation', description: 'Upper and lower cabinet installation', category: 'CAB - Cabinets', base_price: 150.00 },
  { name: 'Bathroom Vanity Installation', description: 'Vanity cabinet installation', category: 'CAB - Cabinets', base_price: 275.00 },
  { name: 'Custom Cabinetry', description: 'Custom cabinet fabrication and install', category: 'CAB - Cabinets', base_price: 450.00 },
  { name: 'Cabinet Refacing/Refinishing', description: 'Reface or refinish existing cabinets', category: 'CAB - Cabinets', base_price: 85.00 },
  { name: 'Cabinet Hardware Installation', description: 'Knobs, pulls, and hinges', category: 'CAB - Cabinets', base_price: 8.50 },

  // 14. Countertops (TOP)
  { name: 'Granite Countertops', description: 'Granite countertop fabrication and install', category: 'TOP - Countertops', base_price: 75.00 },
  { name: 'Quartz Surfaces', description: 'Engineered quartz installation', category: 'TOP - Countertops', base_price: 85.00 },
  { name: 'Laminate Countertops', description: 'Post-form laminate installation', category: 'TOP - Countertops', base_price: 35.00 },
  { name: 'Solid Surface Materials', description: 'Corian and solid surface installation', category: 'TOP - Countertops', base_price: 65.00 },
  { name: 'Backsplash Coordination', description: 'Backsplash with countertop material', category: 'TOP - Countertops', base_price: 45.00 },

  // 15. Mirrors & Shower Doors (MIR)
  { name: 'Bathroom Mirror Installation', description: 'Framed or frameless mirror mounting', category: 'MIR - Mirrors & Glass', base_price: 175.00 },
  { name: 'Medicine Cabinet', description: 'Recessed or surface mount medicine cabinet', category: 'MIR - Mirrors & Glass', base_price: 225.00 },
  { name: 'Shower Door Installation', description: 'Frameless or framed shower door', category: 'MIR - Mirrors & Glass', base_price: 650.00 },
  { name: 'Glass Enclosures', description: 'Custom glass enclosure installation', category: 'MIR - Mirrors & Glass', base_price: 850.00 },
  { name: 'Hardware & Sealing', description: 'Glass hardware and silicone sealing', category: 'MIR - Mirrors & Glass', base_price: 125.00 },

  // 16. Appliances (APL)
  { name: 'Built-In Appliance Installation', description: 'Install built-in refrigerator, oven, etc.', category: 'APL - Appliances', base_price: 275.00 },
  { name: 'Dishwasher Installation', description: 'Dishwasher hookup and installation', category: 'APL - Appliances', base_price: 175.00 },
  { name: 'Range/Oven Installation', description: 'Gas or electric range installation', category: 'APL - Appliances', base_price: 225.00 },
  { name: 'Microwave Mounting', description: 'Over-range microwave installation', category: 'APL - Appliances', base_price: 150.00 },
  { name: 'Appliance Coordination', description: 'Delivery coordination and setup', category: 'APL - Appliances', base_price: 125.00 },

  // MECHANICAL SYSTEMS - INTERIOR
  // 17. Plumbing (PLM)
  { name: 'Toilet Installation', description: 'Remove and replace toilet', category: 'PLM - Plumbing', base_price: 225.00 },
  { name: 'Sink Installation', description: 'Kitchen or bathroom sink installation', category: 'PLM - Plumbing', base_price: 275.00 },
  { name: 'Bathtub/Shower Installation', description: 'Tub or shower unit installation', category: 'PLM - Plumbing', base_price: 650.00 },
  { name: 'Pipe Repair & Replacement', description: 'Copper, PEX, or PVC pipe work', category: 'PLM - Plumbing', base_price: 125.00 },
  { name: 'Water Heater Installation', description: 'Tank or tankless water heater', category: 'PLM - Plumbing', base_price: 450.00 },
  { name: 'Drain Cleaning & Repair', description: 'Drain clearing and repair', category: 'PLM - Plumbing', base_price: 175.00 },
  { name: 'Emergency Leak Repairs', description: 'Emergency plumbing response', category: 'PLM - Plumbing', base_price: 350.00 },

  // 18. HVAC (HVA)
  { name: 'Ductwork Repair/Replacement', description: 'Flex duct or sheet metal ductwork', category: 'HVA - HVAC', base_price: 45.00 },
  { name: 'HVAC System Repair', description: 'AC and heating system repairs', category: 'HVA - HVAC', base_price: 350.00 },
  { name: 'Air Handler Replacement', description: 'New air handler installation', category: 'HVA - HVAC', base_price: 1500.00 },
  { name: 'Thermostat Installation', description: 'Digital or smart thermostat', category: 'HVA - HVAC', base_price: 175.00 },
  { name: 'Duct Cleaning Post-Water Damage', description: 'Complete HVAC cleaning after water loss', category: 'HVA - HVAC', base_price: 550.00 },

  // 19. Electrical (ELE)
  { name: 'Outlet & Switch Replacement', description: 'Electrical outlet or switch', category: 'ELE - Electrical', base_price: 85.00 },
  { name: 'Lighting Fixture Installation', description: 'Ceiling light or fan installation', category: 'ELE - Electrical', base_price: 125.00 },
  { name: 'Panel Upgrades', description: 'Electrical panel upgrade or replacement', category: 'ELE - Electrical', base_price: 1800.00 },
  { name: 'GFCI Installation', description: 'GFCI outlet installation', category: 'ELE - Electrical', base_price: 125.00 },
  { name: 'Emergency Electrical Repairs', description: 'Emergency electrical response', category: 'ELE - Electrical', base_price: 275.00 },

  // 20. Air Quality & Ventilation (AQV)
  { name: 'Bathroom Exhaust Fan', description: 'Exhaust fan installation or replacement', category: 'AQV - Air Quality', base_price: 275.00 },
  { name: 'Range Hood Installation', description: 'Kitchen range hood installation', category: 'AQV - Air Quality', base_price: 350.00 },
  { name: 'Whole-House Fan', description: 'Attic whole-house fan installation', category: 'AQV - Air Quality', base_price: 650.00 },
  { name: 'Air Purification System', description: 'Whole-home air purifier installation', category: 'AQV - Air Quality', base_price: 850.00 },
  { name: 'ERV/HRV System', description: 'Energy/heat recovery ventilator', category: 'AQV - Air Quality', base_price: 1500.00 },
  { name: 'Attic Ventilation', description: 'Ridge vents and soffit vents', category: 'AQV - Air Quality', base_price: 450.00 },

  // INTERIOR SPECIALTY SYSTEMS
  // 21. Interior Specialty Systems (ISS)
  { name: 'Built-In Entertainment Center', description: 'Custom entertainment unit installation', category: 'ISS - Specialty Systems', base_price: 1200.00 },
  { name: 'Home Office Built-Ins', description: 'Custom desk and shelving', category: 'ISS - Specialty Systems', base_price: 850.00 },
  { name: 'Closet Systems & Organizers', description: 'Custom closet organization', category: 'ISS - Specialty Systems', base_price: 650.00 },
  { name: 'Pantry Systems', description: 'Kitchen pantry organization', category: 'ISS - Specialty Systems', base_price: 450.00 },
  { name: 'Laundry Room Organization', description: 'Shelving and storage systems', category: 'ISS - Specialty Systems', base_price: 375.00 },
  { name: 'Murphy Bed Installation', description: 'Wall bed system installation', category: 'ISS - Specialty Systems', base_price: 1800.00 },

  // 22. Smart Home Integration (SMT)
  { name: 'Smart Thermostat', description: 'Nest, Ecobee, or similar installation', category: 'SMT - Smart Home', base_price: 225.00 },
  { name: 'Smart Lighting System', description: 'Smart switches and bulbs', category: 'SMT - Smart Home', base_price: 350.00 },
  { name: 'Security System - Interior', description: 'Sensors and alarm panel', category: 'SMT - Smart Home', base_price: 650.00 },
  { name: 'Video Doorbell', description: 'Ring or similar installation', category: 'SMT - Smart Home', base_price: 175.00 },
  { name: 'Smart Lock Installation', description: 'Electronic deadbolt installation', category: 'SMT - Smart Home', base_price: 225.00 },
  { name: 'Home Automation Hub', description: 'Central smart home controller', category: 'SMT - Smart Home', base_price: 275.00 },

  // 23. Accessibility Modifications (ADA)
  { name: 'Grab Bar Installation', description: 'Safety grab bars in bathroom', category: 'ADA - Accessibility', base_price: 125.00 },
  { name: 'Interior Wheelchair Ramp', description: 'ADA compliant interior ramp', category: 'ADA - Accessibility', base_price: 450.00 },
  { name: 'Walk-In Tub Installation', description: 'Accessible bathtub installation', category: 'ADA - Accessibility', base_price: 3500.00 },
  { name: 'Accessible Shower', description: 'Zero-threshold shower installation', category: 'ADA - Accessibility', base_price: 2800.00 },
  { name: 'Widened Doorways', description: 'Door frame widening for accessibility', category: 'ADA - Accessibility', base_price: 650.00 },
  { name: 'Lever-Style Door Handles', description: 'ADA compliant lever handles', category: 'ADA - Accessibility', base_price: 85.00 },

  // ROOFING & EXTERIOR ENVELOPE
  // 24. Roofing (RFG)
  { name: 'Roof Leak Repair', description: 'Locate and repair roof leaks', category: 'RFG - Roofing', base_price: 450.00 },
  { name: 'Shingle Replacement', description: 'Asphalt shingle replacement', category: 'RFG - Roofing', base_price: 8.50 },
  { name: 'Tile Roof Repair', description: 'Clay or concrete tile repair', category: 'RFG - Roofing', base_price: 85.00 },
  { name: 'Flashing Repair', description: 'Roof flashing repair/replacement', category: 'RFG - Roofing', base_price: 275.00 },
  { name: 'Emergency Tarping', description: 'Emergency roof tarp installation', category: 'RFG - Roofing', base_price: 350.00 },
  { name: 'Roof Coating & Sealing', description: 'Roof sealant application', category: 'RFG - Roofing', base_price: 3.50 },

  // 25. Gutters & Downspouts (GTR)
  { name: 'Gutter Installation - Aluminum', description: 'Seamless aluminum gutters', category: 'GTR - Gutters', base_price: 12.00 },
  { name: 'Gutter Installation - Copper', description: 'Copper gutter installation', category: 'GTR - Gutters', base_price: 45.00 },
  { name: 'Gutter Guards & Screens', description: 'Leaf guard installation', category: 'GTR - Gutters', base_price: 8.50 },
  { name: 'Downspout Installation', description: 'Downspout and extensions', category: 'GTR - Gutters', base_price: 75.00 },
  { name: 'Rain Chain Installation', description: 'Decorative rain chain', category: 'GTR - Gutters', base_price: 125.00 },
  { name: 'Gutter Cleaning/Maintenance', description: 'Complete gutter cleaning', category: 'GTR - Gutters', base_price: 175.00 },
  { name: 'Fascia Board Repair', description: 'Wood fascia repair/replacement', category: 'GTR - Gutters', base_price: 18.00 },

  // 26. Siding & Exterior Trim (SID)
  { name: 'Stucco Repair', description: 'Patch and texture match stucco', category: 'SID - Siding', base_price: 65.00 },
  { name: 'Stucco Remediation', description: 'Full stucco removal and replacement', category: 'SID - Siding', base_price: 18.00 },
  { name: 'Vinyl Siding', description: 'Vinyl siding installation', category: 'SID - Siding', base_price: 7.50 },
  { name: 'Fiber Cement Installation', description: 'HardiePlank or similar installation', category: 'SID - Siding', base_price: 12.00 },
  { name: 'Soffit & Fascia Repair', description: 'Soffit and fascia replacement', category: 'SID - Siding', base_price: 14.00 },
  { name: 'Exterior Trim Work', description: 'Exterior trim and molding', category: 'SID - Siding', base_price: 8.50 },

  // 27. Insulation (INS)
  { name: 'Attic Insulation', description: 'Blown-in or batt attic insulation', category: 'INS - Insulation', base_price: 1.75 },
  { name: 'Wall Insulation', description: 'Wall cavity insulation', category: 'INS - Insulation', base_price: 2.25 },
  { name: 'Crawl Space Insulation', description: 'Floor and crawl space insulation', category: 'INS - Insulation', base_price: 2.50 },
  { name: 'Moisture Barrier Installation', description: 'Vapor barrier installation', category: 'INS - Insulation', base_price: 1.25 },
  { name: 'Energy Efficiency Upgrades', description: 'Comprehensive insulation upgrade', category: 'INS - Insulation', base_price: 2500.00 },

  // EXTERIOR OPENINGS & ACCESS
  // 28. Windows & Glass (WDO)
  { name: 'Window Replacement', description: 'New window installation', category: 'WDO - Windows', base_price: 450.00 },
  { name: 'Glass Repair', description: 'Single or dual pane glass replacement', category: 'WDO - Windows', base_price: 175.00 },
  { name: 'Screen Repair/Replacement', description: 'Window screen repair', category: 'WDO - Windows', base_price: 45.00 },
  { name: 'Weatherstripping', description: 'Window weatherstrip replacement', category: 'WDO - Windows', base_price: 35.00 },
  { name: 'Energy-Efficient Window Upgrade', description: 'Low-E or double-pane upgrade', category: 'WDO - Windows', base_price: 650.00 },

  // 29. Doors & Hardware (DOR)
  { name: 'Entry Door Installation', description: 'Exterior entry door replacement', category: 'DOR - Doors', base_price: 650.00 },
  { name: 'Interior Door Installation', description: 'Interior door and jamb', category: 'DOR - Doors', base_price: 275.00 },
  { name: 'Garage Door Repair/Replacement', description: 'Garage door service', category: 'DOR - Doors', base_price: 450.00 },
  { name: 'Sliding Glass Door', description: 'Patio slider installation', category: 'DOR - Doors', base_price: 850.00 },
  { name: 'Door Hardware & Locksets', description: 'Knobs, levers, and deadbolts', category: 'DOR - Doors', base_price: 125.00 },
  { name: 'Security Door Upgrades', description: 'High-security lock installation', category: 'DOR - Doors', base_price: 275.00 },

  // 30. Garage (GAR)
  { name: 'Garage Door System', description: 'Complete garage door replacement', category: 'GAR - Garage', base_price: 1200.00 },
  { name: 'Opener Installation/Repair', description: 'Garage door opener service', category: 'GAR - Garage', base_price: 375.00 },
  { name: 'Garage Epoxy Flooring', description: 'Epoxy floor coating', category: 'GAR - Garage', base_price: 6.50 },
  { name: 'Garage Storage Systems', description: 'Shelving and organization', category: 'GAR - Garage', base_price: 450.00 },
  { name: 'Garage Drywall & Paint', description: 'Finish garage walls and ceiling', category: 'GAR - Garage', base_price: 4.50 },

  // EXTERIOR CONCRETE & HARDSCAPING
  // 31. Exterior Concrete & Flatwork (CNF)
  { name: 'Driveway Installation', description: 'Concrete driveway pour', category: 'CNF - Concrete', base_price: 8.50 },
  { name: 'Sidewalk & Walkway', description: 'Concrete walkway installation', category: 'CNF - Concrete', base_price: 9.50 },
  { name: 'Concrete Patio', description: 'Patio slab installation', category: 'CNF - Concrete', base_price: 8.00 },
  { name: 'Concrete Repair', description: 'Crack repair and patching', category: 'CNF - Concrete', base_price: 350.00 },
  { name: 'Stamped/Decorative Concrete', description: 'Decorative concrete finish', category: 'CNF - Concrete', base_price: 14.00 },
  { name: 'Driveway Sealing', description: 'Concrete or asphalt sealing', category: 'CNF - Concrete', base_price: 1.25 },

  // 32. Exterior Improvements (EXT)
  { name: 'Deck Construction', description: 'Wood or composite deck building', category: 'EXT - Exterior', base_price: 35.00 },
  { name: 'Deck Repair', description: 'Deck board and railing repair', category: 'EXT - Exterior', base_price: 18.00 },
  { name: 'Patio Installation - Pavers', description: 'Paver patio installation', category: 'EXT - Exterior', base_price: 16.00 },
  { name: 'Fencing Installation', description: 'Wood, vinyl, or metal fencing', category: 'EXT - Exterior', base_price: 35.00 },
  { name: 'Retaining Wall - Exterior', description: 'Decorative retaining wall', category: 'EXT - Exterior', base_price: 45.00 },

  // 33. Exterior Structures (STR)
  { name: 'Pergola Installation', description: 'Wood or aluminum pergola', category: 'STR - Structures', base_price: 3500.00 },
  { name: 'Gazebo Construction', description: 'Outdoor gazebo building', category: 'STR - Structures', base_price: 5500.00 },
  { name: 'Carport & Awning', description: 'Carport or shade structure', category: 'STR - Structures', base_price: 2800.00 },
  { name: 'Patio Cover', description: 'Solid or lattice patio cover', category: 'STR - Structures', base_price: 4500.00 },
  { name: 'Trellis Installation', description: 'Garden trellis construction', category: 'STR - Structures', base_price: 650.00 },
  { name: 'Outdoor Storage Shed', description: 'Prefab or custom shed', category: 'STR - Structures', base_price: 2200.00 },

  // 34. Outdoor Living Spaces (OLS)
  { name: 'Outdoor Kitchen', description: 'Built-in outdoor kitchen', category: 'OLS - Outdoor Living', base_price: 8500.00 },
  { name: 'BBQ Island', description: 'Custom BBQ island construction', category: 'OLS - Outdoor Living', base_price: 4500.00 },
  { name: 'Fire Pit', description: 'Gas or wood fire pit', category: 'OLS - Outdoor Living', base_price: 1800.00 },
  { name: 'Outdoor Fireplace', description: 'Masonry outdoor fireplace', category: 'OLS - Outdoor Living', base_price: 6500.00 },
  { name: 'Outdoor Bar', description: 'Built-in outdoor bar', category: 'OLS - Outdoor Living', base_price: 3500.00 },
  { name: 'Pizza Oven', description: 'Wood-fired pizza oven', category: 'OLS - Outdoor Living', base_price: 4200.00 },
  { name: 'Built-In Seating', description: 'Masonry or wood bench seating', category: 'OLS - Outdoor Living', base_price: 2200.00 },

  // EXTERIOR WATER MANAGEMENT
  // 35. Exterior Drainage & Grading (DRN)
  { name: 'French Drain Installation', description: 'Perforated pipe drainage system', category: 'DRN - Drainage', base_price: 35.00 },
  { name: 'Surface Drainage System', description: 'Channel drain installation', category: 'DRN - Drainage', base_price: 45.00 },
  { name: 'Grading & Slope Correction', description: 'Site grading for drainage', category: 'DRN - Drainage', base_price: 1200.00 },
  { name: 'Downspout Extensions', description: 'Underground downspout drainage', category: 'DRN - Drainage', base_price: 175.00 },
  { name: 'Catch Basin Installation', description: 'Catch basin and grate', category: 'DRN - Drainage', base_price: 450.00 },
  { name: 'Erosion Control', description: 'Erosion prevention measures', category: 'DRN - Drainage', base_price: 650.00 },

  // 36. Exterior Waterproofing (WPF)
  { name: 'Foundation Waterproofing', description: 'Exterior foundation sealing', category: 'WPF - Waterproofing', base_price: 85.00 },
  { name: 'Below-Grade Waterproofing', description: 'Basement wall waterproofing', category: 'WPF - Waterproofing', base_price: 95.00 },
  { name: 'Exterior Membrane Systems', description: 'Waterproof membrane application', category: 'WPF - Waterproofing', base_price: 12.00 },
  { name: 'Deck Waterproofing', description: 'Waterproof deck coating', category: 'WPF - Waterproofing', base_price: 8.50 },
  { name: 'Balcony Waterproofing', description: 'Balcony membrane system', category: 'WPF - Waterproofing', base_price: 14.00 },
  { name: 'Crystalline Waterproofing', description: 'Penetrating concrete waterproofing', category: 'WPF - Waterproofing', base_price: 6.50 },

  // LANDSCAPING & IRRIGATION
  // 37. Landscaping (LAN)
  { name: 'Post-Construction Restoration', description: 'Yard restoration after construction', category: 'LAN - Landscaping', base_price: 1500.00 },
  { name: 'Sprinkler System Repair', description: 'Irrigation system repair', category: 'LAN - Landscaping', base_price: 175.00 },
  { name: 'Landscape Drainage Solutions', description: 'Yard drainage installation', category: 'LAN - Landscaping', base_price: 850.00 },
  { name: 'Hardscape Coordination', description: 'Coordinate with hardscape work', category: 'LAN - Landscaping', base_price: 450.00 },
  { name: 'Tree & Shrub Planting', description: 'Plant installation and mulching', category: 'LAN - Landscaping', base_price: 125.00 },

  // 38. Xeriscaping & Water Conservation (XER)
  { name: 'Drought-Tolerant Landscaping', description: 'Low-water landscape design', category: 'XER - Xeriscaping', base_price: 2500.00 },
  { name: 'Drip Irrigation System', description: 'Water-efficient drip system', category: 'XER - Xeriscaping', base_price: 1.50 },
  { name: 'Smart Irrigation Controller', description: 'WiFi irrigation controller', category: 'XER - Xeriscaping', base_price: 275.00 },
  { name: 'Artificial Turf Installation', description: 'Synthetic grass installation', category: 'XER - Xeriscaping', base_price: 12.00 },
  { name: 'Gravel/Rock Landscaping', description: 'Decorative rock installation', category: 'XER - Xeriscaping', base_price: 6.50 },
  { name: 'Native Plant Installation', description: 'California native plants', category: 'XER - Xeriscaping', base_price: 85.00 },

  // 39. Pool & Spa (POL)
  { name: 'Pool Equipment Repair', description: 'Pump, filter, heater repair', category: 'POL - Pool & Spa', base_price: 350.00 },
  { name: 'Pool Resurfacing', description: 'Plaster or pebble resurface', category: 'POL - Pool & Spa', base_price: 8500.00 },
  { name: 'Pool Deck Work', description: 'Pool deck repair/coating', category: 'POL - Pool & Spa', base_price: 8.50 },
  { name: 'Pool Leak Detection', description: 'Locate and repair pool leaks', category: 'POL - Pool & Spa', base_price: 450.00 },
  { name: 'Pool Maintenance Coordination', description: 'Ongoing maintenance setup', category: 'POL - Pool & Spa', base_price: 175.00 },

  // EXTERIOR UTILITIES & SYSTEMS
  // 40. Exterior Lighting & Power (ELP)
  { name: 'Landscape Lighting', description: 'Path and accent lighting', category: 'ELP - Exterior Power', base_price: 125.00 },
  { name: 'Security Lighting', description: 'Motion-activated flood lights', category: 'ELP - Exterior Power', base_price: 175.00 },
  { name: 'Exterior GFCI Outlets', description: 'Weatherproof outlet installation', category: 'ELP - Exterior Power', base_price: 175.00 },
  { name: 'Low-Voltage Lighting System', description: 'Complete landscape light system', category: 'ELP - Exterior Power', base_price: 1500.00 },
  { name: 'Solar Lighting', description: 'Solar-powered path lights', category: 'ELP - Exterior Power', base_price: 65.00 },
  { name: 'Timer & Photocell Controls', description: 'Automatic lighting controls', category: 'ELP - Exterior Power', base_price: 125.00 },

  // 41. Security & Access (SEC)
  { name: 'Gate & Gate Operator', description: 'Automatic gate installation', category: 'SEC - Security', base_price: 2500.00 },
  { name: 'Fence Gate Installation', description: 'Pedestrian or vehicle gate', category: 'SEC - Security', base_price: 450.00 },
  { name: 'Security Cameras - Exterior', description: 'Outdoor camera installation', category: 'SEC - Security', base_price: 275.00 },
  { name: 'Motion Sensor Lights', description: 'Motion-activated security lights', category: 'SEC - Security', base_price: 175.00 },
  { name: 'Keypad Entry System', description: 'Electronic keypad access', category: 'SEC - Security', base_price: 450.00 },
  { name: 'Intercom System', description: 'Gate or door intercom', category: 'SEC - Security', base_price: 650.00 },

  // 42. Exterior Signs & Addresses (SGN)
  { name: 'Address Numbers/Plaques', description: 'House number installation', category: 'SGN - Signs', base_price: 125.00 },
  { name: 'Property Signs', description: 'Custom property signage', category: 'SGN - Signs', base_price: 275.00 },
  { name: 'Mailbox Installation', description: 'Mailbox mounting and post', category: 'SGN - Signs', base_price: 225.00 },
  { name: 'Post Lights', description: 'Decorative post lamp', category: 'SGN - Signs', base_price: 350.00 },
  { name: 'Name Plates', description: 'Custom name plate installation', category: 'SGN - Signs', base_price: 125.00 },

  // EXTERIOR MAINTENANCE & PROTECTION
  // 43. Exterior Cleaning & Sealing (ECS)
  { name: 'Pressure Washing', description: 'High-pressure surface cleaning', category: 'ECS - Cleaning', base_price: 0.35 },
  { name: 'Deck Staining & Sealing', description: 'Wood deck treatment', category: 'ECS - Cleaning', base_price: 3.50 },
  { name: 'Concrete Sealing', description: 'Protective concrete sealer', category: 'ECS - Cleaning', base_price: 1.50 },
  { name: 'Fence Staining', description: 'Wood fence treatment', category: 'ECS - Cleaning', base_price: 2.75 },
  { name: 'Exterior Wood Treatment', description: 'Wood preservative application', category: 'ECS - Cleaning', base_price: 3.25 },
  { name: 'Graffiti Removal', description: 'Graffiti cleaning and sealing', category: 'ECS - Cleaning', base_price: 275.00 },

  // 44. Outdoor Shade Solutions (SHD)
  { name: 'Retractable Awning', description: 'Motorized retractable awning', category: 'SHD - Shade', base_price: 2500.00 },
  { name: 'Shade Sails', description: 'Fabric shade sail installation', category: 'SHD - Shade', base_price: 850.00 },
  { name: 'Permanent Patio Umbrellas', description: 'Fixed umbrella mounting', category: 'SHD - Shade', base_price: 450.00 },
  { name: 'Pergola Shade System', description: 'Retractable pergola cover', category: 'SHD - Shade', base_price: 1800.00 },
  { name: 'Window Awnings', description: 'Fixed window awnings', category: 'SHD - Shade', base_price: 375.00 },
  { name: 'Sun Screens', description: 'Exterior sun screen fabric', category: 'SHD - Shade', base_price: 225.00 },
];

async function seedServices() {
  console.log('Starting BCS Services seed...');

  try {
    // Clear existing services
    await db.run('DELETE FROM services');
    console.log('Cleared existing services');

    // Insert all services
    const insertStmt = 'INSERT INTO services (name, description, category, unit_price) VALUES (?, ?, ?, ?)';

    for (const service of services) {
      await db.run(insertStmt, [service.name, service.description, service.category, service.base_price]);
    }

    console.log(`Successfully seeded ${services.length} services!`);

    // Show category summary
    const categories = [...new Set(services.map(s => s.category))];
    console.log(`\nCategories (${categories.length} total):`);
    categories.forEach(cat => {
      const count = services.filter(s => s.category === cat).length;
      console.log(`  - ${cat}: ${count} services`);
    });

  } catch (error) {
    console.error('Error seeding services:', error);
  }
}

seedServices();
