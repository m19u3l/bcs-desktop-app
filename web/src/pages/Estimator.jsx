import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const fmt  = n => `$${(parseFloat(n)||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const fmtn = n => (parseFloat(n)||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});

const CAT_ICONS = {
  WTR:'💧',DRY:'🧱',PAI:'🎨',CAR:'🪑',FLR:'🏠',CTM:'🪟',
  RFG:'🏚️',PLM:'🔧',ELE:'⚡',HVC:'❄️',CAB:'🚪',INS:'🧊',
  FRM:'🪵',MLD:'☣️',CLN:'🧹',WDW:'🪟',CNC:'🧱',DEM:'🔨',STR:'🏗️',
};
const CAT_NAMES = {
  WTR:'Water Mitigation',DRY:'Drywall',PAI:'Painting',CAR:'Carpet',FLR:'Flooring',
  CTM:'Countertops & Tile',RFG:'Roofing',PLM:'Plumbing',ELE:'Electrical',HVC:'HVAC',
  CAB:'Cabinets',INS:'Insulation',FRM:'Framing',MLD:'Mold Remediation',CLN:'Cleaning',
  WDW:'Windows & Doors',CNC:'Concrete',DEM:'Demolition',STR:'Structural',
};

export default function Estimator() {
  const { authFetch } = useAuth();

  // Price list
  const [priceItems, setPriceItems]   = useState([]);
  const [categories, setCategories]   = useState([]);
  const [selCat, setSelCat]           = useState('');
  const [search, setSearch]           = useState('');
  const [listLoading, setListLoading] = useState(true);

  // Estimate line items
  const [lines, setLines]     = useState([]);
  const [opPct, setOpPct]     = useState(20);
  const [taxPct, setTaxPct]   = useState(0);
  const [deprPct, setDeprPct] = useState(10);
  const [deductible, setDeductible] = useState(1000);

  // Estimate metadata
  const [meta, setMeta] = useState({ title:'', client:'', claim_number:'', insurance_company:'', adjuster_name:'', date_of_loss:'', policy_number:'' });
  const [saving, setSaving]   = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Panel state
  const [panel, setPanel] = useState('items'); // 'items' | 'claim' | 'notes'

  useEffect(() => {
    authFetch('/api/price-list/categories').then(r => r.json()).then(d => setCategories(Array.isArray(d) ? d : [])).catch(()=>{});
    loadPrices();
  }, []);

  useEffect(() => { loadPrices(); }, [selCat, search]);

  const loadPrices = () => {
    setListLoading(true);
    const p = new URLSearchParams();
    if (selCat)  p.set('category', selCat);
    if (search)  p.set('search', search);
    authFetch(`/api/price-list?${p}`)
      .then(r => r.json())
      .then(d => setPriceItems(Array.isArray(d) ? d : []))
      .catch(() => setPriceItems([]))
      .finally(() => setListLoading(false));
  };

  const addLine = (item) => {
    const normalized = { ...item, description: item.description || item.item_name || '' };
    setLines(prev => {
      const existing = prev.find(l => l.id === item.id);
      if (existing) return prev.map(l => l.id === item.id ? { ...l, qty: l.qty + 1 } : l);
      return [...prev, { ...normalized, qty: 1 }];
    });
  };

  const removeLine = id => setLines(prev => prev.filter(l => l.id !== id));

  const updateQty = (id, val) => {
    const q = parseFloat(val);
    if (isNaN(q) || q <= 0) return removeLine(id);
    setLines(prev => prev.map(l => l.id === id ? { ...l, qty: q } : l));
  };

  // Totals
  const subtotal  = lines.reduce((s, l) => s + (parseFloat(l.unit_price)||0) * l.qty, 0);
  const opAmt     = subtotal * (opPct / 100);
  const taxAmt    = (subtotal + opAmt) * (taxPct / 100);
  const rcv       = subtotal + opAmt + taxAmt;
  const depreciation = rcv * (deprPct / 100);
  const acv       = rcv - depreciation;
  const netClaim  = Math.max(0, acv - parseFloat(deductible)||0);

  const saveEstimate = async () => {
    if (!meta.title) { setSaveMsg('Please enter a project title.'); return; }
    if (lines.length === 0) { setSaveMsg('Add at least one line item.'); return; }
    setSaving(true); setSaveMsg('');
    try {
      const body = {
        ...meta,
        line_items: lines.map(l => ({ price_list_id: l.id, description: l.description, unit: l.unit, unit_price: l.unit_price, quantity: l.qty, subtotal: l.unit_price * l.qty })),
        subtotal, op_percentage: opPct, op_amount: opAmt,
        tax_percentage: taxPct, tax_amount: taxAmt,
        total_amount: rcv, rcv, acv, deductible: parseFloat(deductible)||0, net_claim: netClaim,
      };
      const res = await authFetch('/api/estimates', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
      if (!res.ok) throw new Error('Save failed');
      setSaveMsg('Estimate saved!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (e) {
      setSaveMsg(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex overflow-hidden bg-gray-50">

      {/* Left — estimate builder */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-5 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">SD Xactimate Estimator</h1>
              <p className="text-blue-200 text-sm mt-0.5">San Diego area pricing · O&P auto-calculated · RCV/ACV/Net Claim</p>
            </div>
            <div className="flex gap-2 items-center">
              {saveMsg && <span className={`text-xs px-3 py-1.5 rounded ${saveMsg.includes('saved') ? 'bg-green-500' : 'bg-red-500'}`}>{saveMsg}</span>}
              <button onClick={saveEstimate} disabled={saving} className="px-4 py-2 bg-white text-blue-700 rounded-lg text-sm font-bold hover:bg-blue-50 transition">
                {saving ? 'Saving…' : '💾 Save'}
              </button>
            </div>
          </div>
        </div>

        {/* Sub-nav */}
        <div className="bg-white border-b border-gray-200 px-4 flex gap-1 shrink-0">
          {[['items','Line Items'],['claim','Claim Info'],['summary','Summary']].map(([k,v]) => (
            <button key={k} onClick={() => setPanel(k)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition ${panel===k ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{v}</button>
          ))}
        </div>

        {/* Panel content */}
        <div className="flex-1 overflow-auto p-4">

          {panel === 'items' && (
            <>
              {lines.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <p className="text-4xl mb-3">📋</p>
                  <p className="font-medium">No line items yet.</p>
                  <p className="text-sm mt-1">Browse the price list on the right and click items to add them.</p>
                </div>
              ) : (
                <table className="w-full text-sm mb-4">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr className="text-xs text-gray-500 font-semibold">
                      <th className="text-left px-3 py-2">Description</th>
                      <th className="text-center px-2 py-2 w-16">Unit</th>
                      <th className="text-right px-2 py-2 w-24">Unit Price</th>
                      <th className="text-center px-2 py-2 w-20">Qty</th>
                      <th className="text-right px-3 py-2 w-28">Total</th>
                      <th className="w-8"/>
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map(l => (
                      <tr key={l.id} className="border-b border-gray-100 hover:bg-blue-50 transition">
                        <td className="px-3 py-2.5">
                          <p className="font-medium text-gray-800">{l.description}</p>
                          <p className="text-xs text-gray-400 font-mono">{l.xactimate_code || l.category}</p>
                        </td>
                        <td className="px-2 py-2.5 text-center text-xs text-gray-500">{l.unit}</td>
                        <td className="px-2 py-2.5 text-right text-gray-600">{fmt(l.unit_price)}</td>
                        <td className="px-2 py-2.5 text-center">
                          <input type="number" min="0.01" step="0.01" value={l.qty}
                            onChange={e => updateQty(l.id, e.target.value)}
                            className="w-16 text-center border border-gray-300 rounded px-1 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
                        </td>
                        <td className="px-3 py-2.5 text-right font-semibold text-blue-700">{fmt(l.unit_price * l.qty)}</td>
                        <td className="py-2.5 pr-2">
                          <button onClick={() => removeLine(l.id)} className="text-gray-300 hover:text-red-500 transition text-lg leading-none">×</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* O&P controls */}
              {lines.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-4 mt-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="text-xs text-gray-500 font-medium block mb-1">O&P %</label>
                      <input type="number" min="0" max="100" value={opPct} onChange={e => setOpPct(+e.target.value)}
                        className="input text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium block mb-1">Tax %</label>
                      <input type="number" min="0" max="20" step="0.1" value={taxPct} onChange={e => setTaxPct(+e.target.value)}
                        className="input text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium block mb-1">Depreciation %</label>
                      <input type="number" min="0" max="100" value={deprPct} onChange={e => setDeprPct(+e.target.value)}
                        className="input text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium block mb-1">Deductible $</label>
                      <input type="number" min="0" value={deductible} onChange={e => setDeductible(e.target.value)}
                        className="input text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    {[['Subtotal',fmt(subtotal),'text-gray-700'],['O&P ('+opPct+'%)',fmt(opAmt),'text-gray-700'],['RCV',fmt(rcv),'text-blue-700 font-bold'],['Net Claim',fmt(netClaim),'text-green-700 font-bold']].map(([l,v,cls]) => (
                      <div key={l} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-0.5">{l}</p>
                        <p className={`text-base ${cls}`}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {panel === 'claim' && (
            <div className="max-w-lg space-y-4">
              <div>
                <label className="label">Project Title *</label>
                <input className="input" placeholder="123 Main St — Water Damage" value={meta.title} onChange={e => setMeta(p=>({...p,title:e.target.value}))} />
              </div>
              <div>
                <label className="label">Client Name</label>
                <input className="input" placeholder="John Smith" value={meta.client} onChange={e => setMeta(p=>({...p,client:e.target.value}))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Claim Number</label>
                  <input className="input" placeholder="CLM-2026-001" value={meta.claim_number} onChange={e => setMeta(p=>({...p,claim_number:e.target.value}))} />
                </div>
                <div>
                  <label className="label">Date of Loss</label>
                  <input className="input" type="date" value={meta.date_of_loss} onChange={e => setMeta(p=>({...p,date_of_loss:e.target.value}))} />
                </div>
              </div>
              <div>
                <label className="label">Insurance Company</label>
                <input className="input" placeholder="State Farm" value={meta.insurance_company} onChange={e => setMeta(p=>({...p,insurance_company:e.target.value}))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Adjuster Name</label>
                  <input className="input" placeholder="Jane Doe" value={meta.adjuster_name} onChange={e => setMeta(p=>({...p,adjuster_name:e.target.value}))} />
                </div>
                <div>
                  <label className="label">Policy Number</label>
                  <input className="input" placeholder="POL-123456" value={meta.policy_number} onChange={e => setMeta(p=>({...p,policy_number:e.target.value}))} />
                </div>
              </div>
            </div>
          )}

          {panel === 'summary' && (
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-blue-700 text-white px-6 py-4">
                  <h2 className="font-bold text-lg">{meta.title || 'Untitled Estimate'}</h2>
                  {meta.client && <p className="text-blue-200 text-sm">{meta.client}</p>}
                </div>
                <div className="p-6 space-y-3">
                  {[
                    ['Subtotal',      fmt(subtotal)],
                    [`O&P (${opPct}%)`, fmt(opAmt)],
                    taxPct > 0 && [`Tax (${taxPct}%)`, fmt(taxAmt)],
                    null,
                    ['RCV (Replacement Cost Value)', fmt(rcv), 'font-bold text-blue-700'],
                    [`Depreciation (${deprPct}%)`,  `-${fmt(depreciation)}`, 'text-orange-600'],
                    ['ACV (Actual Cash Value)',      fmt(acv), 'font-semibold'],
                    [`Deductible`,                  `-${fmt(parseFloat(deductible)||0)}`, 'text-red-600'],
                    null,
                    ['Net Claim',                   fmt(netClaim), 'font-extrabold text-green-700 text-lg'],
                  ].filter(Boolean).map((row, i) => row === null ? (
                    <hr key={i} className="border-gray-100" />
                  ) : (
                    <div key={row[0]} className="flex justify-between">
                      <span className="text-sm text-gray-600">{row[0]}</span>
                      <span className={`text-sm ${row[2]||'text-gray-800'}`}>{row[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={saveEstimate} disabled={saving || !meta.title} className="btn-primary w-full mt-4">
                {saving ? 'Saving…' : '💾 Save Estimate'}
              </button>
              {saveMsg && <p className={`text-sm text-center mt-2 ${saveMsg.includes('saved') ? 'text-green-600' : 'text-red-600'}`}>{saveMsg}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Right — price list picker */}
      <div className="w-80 shrink-0 border-l border-gray-200 bg-white flex flex-col overflow-hidden">
        <div className="px-3 py-3 border-b border-gray-100 shrink-0">
          <p className="text-xs font-bold text-gray-500 uppercase mb-2">Price List</p>
          <input type="text" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
            className="input text-sm w-full mb-2" />
          <select value={selCat} onChange={e => setSelCat(e.target.value)} className="input text-sm w-full">
            <option value="">All Categories</option>
            {categories.map(c => {
              const key = typeof c === 'string' ? c : c.category;
              return <option key={key} value={key}>{CAT_ICONS[key]||'📦'} {CAT_NAMES[key]||key}</option>;
            })}
          </select>
        </div>
        <div className="flex-1 overflow-auto">
          {listLoading ? (
            <div className="flex items-center justify-center h-20"><div className="animate-spin text-2xl">⏳</div></div>
          ) : priceItems.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No items found.</p>
          ) : (
            <div>
              {priceItems.map(item => (
                <button key={item.id} onClick={() => addLine(item)}
                  className="w-full text-left px-3 py-2.5 border-b border-gray-50 hover:bg-blue-50 transition group">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-blue-600 truncate">{item.xactimate_code || item.category}</p>
                      <p className="text-xs text-gray-700 truncate font-medium">{item.description || item.item_name}</p>
                      <p className="text-xs text-gray-400">{item.unit}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-gray-800">{fmt(item.unit_price)}</p>
                      <p className="text-xs text-blue-500 opacity-0 group-hover:opacity-100">+ Add</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
