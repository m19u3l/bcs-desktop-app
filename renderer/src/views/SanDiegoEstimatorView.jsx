import React, { useState, useEffect, useRef, useCallback } from 'react';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Xactimate category display names & colors
const CATEGORY_CONFIG = {
  'Water Mitigation':   { code: 'WTR', color: 'bg-blue-100 text-blue-800',   icon: '💧' },
  'Drywall':            { code: 'DRY', color: 'bg-orange-100 text-orange-800', icon: '🏗️' },
  'Painting':           { code: 'PAI', color: 'bg-purple-100 text-purple-800', icon: '🎨' },
  'Carpet':             { code: 'CAR', color: 'bg-yellow-100 text-yellow-800', icon: '🏠' },
  'Flooring':           { code: 'FLR', color: 'bg-amber-100 text-amber-800',  icon: '⬛' },
  'Tile & Stone':       { code: 'CTM', color: 'bg-stone-100 text-stone-800',  icon: '🔲' },
  'Roofing':            { code: 'RFG', color: 'bg-red-100 text-red-800',      icon: '🏠' },
  'Plumbing':           { code: 'PLM', color: 'bg-cyan-100 text-cyan-800',    icon: '🔧' },
  'Electrical':         { code: 'ELE', color: 'bg-yellow-100 text-yellow-900', icon: '⚡' },
  'HVAC':               { code: 'HVC', color: 'bg-teal-100 text-teal-800',    icon: '❄️' },
  'Cabinetry':          { code: 'CAB', color: 'bg-lime-100 text-lime-800',    icon: '🚪' },
  'Insulation':         { code: 'INS', color: 'bg-green-100 text-green-800',  icon: '🌿' },
  'Framing':            { code: 'FRM', color: 'bg-brown-100 text-brown-800',  icon: '🪵' },
  'Mold Remediation':   { code: 'MLD', color: 'bg-emerald-100 text-emerald-800', icon: '🦠' },
  'Cleaning':           { code: 'CLN', color: 'bg-sky-100 text-sky-800',      icon: '🧹' },
  'Windows & Doors':    { code: 'WDW', color: 'bg-indigo-100 text-indigo-800', icon: '🪟' },
  'Concrete & Masonry': { code: 'CNC', color: 'bg-gray-100 text-gray-800',    icon: '🧱' },
  'Demolition':         { code: 'DEM', color: 'bg-red-100 text-red-900',      icon: '💥' },
  'Structural':         { code: 'STR', color: 'bg-slate-100 text-slate-800',  icon: '🏛️' },
};

const fmt = (n) => `$${(parseFloat(n) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function SanDiegoEstimatorView() {
  // Estimate meta state
  const [step, setStep]             = useState('list'); // 'list' | 'new' | 'editor'
  const [estimates, setEstimates]   = useState([]);
  const [clients, setClients]       = useState([]);
  const [activeEstimate, setActive] = useState(null);

  // Estimate editor state
  const [lineItems, setLineItems]   = useState([]);
  const [priceList, setPriceList]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [catFilter, setCatFilter]   = useState('');
  const [search, setSearch]         = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [opPercent, setOpPercent]   = useState(20);
  const [taxPercent, setTaxPercent] = useState(0);
  const [claimInfo, setClaimInfo]   = useState({ claim_number:'', insurance_company:'', adjuster_name:'', adjuster_phone:'', date_of_loss:'', policy_number:'', deductible:0, depreciation:0 });
  const [saving, setSaving]         = useState(false);
  const [newForm, setNewForm]       = useState({ client_id:'', title:'', description:'', job_type:'Water Damage' });
  const searchRef = useRef(null);

  // ─── Load ─────────────────────────────────────────────────────────
  useEffect(() => { loadEstimates(); loadClients(); loadPriceList(); }, []);

  const loadEstimates = async () => {
    try {
      const r = await fetch(`${API}/estimates`);
      setEstimates(await r.json());
    } catch {}
  };

  const loadClients = async () => {
    try {
      const r = await fetch(`${API}/clients`);
      setClients(await r.json());
    } catch {}
  };

  const loadPriceList = async () => {
    try {
      const r = await fetch(`${API}/price-list`);
      const data = await r.json();
      setPriceList(data);
      const cats = [...new Set(data.map(i => i.category))].sort();
      setCategories(cats);
    } catch {}
  };

  const loadEstimateDetail = async (id) => {
    try {
      const r = await fetch(`${API}/estimates/${id}`);
      const est = await r.json();
      setActive(est);
      setLineItems(est.line_items || []);
      setTaxPercent(est.tax_rate || 0);
      setOpPercent(est.overhead_profit_pct || 20);
      setClaimInfo({
        claim_number: est.claim_number || '',
        insurance_company: est.insurance_company || '',
        adjuster_name: est.adjuster_name || '',
        adjuster_phone: est.adjuster_phone || '',
        date_of_loss: est.date_of_loss || '',
        policy_number: est.policy_number || '',
        deductible: est.deductible || 0,
        depreciation: est.depreciation || 0,
      });
      setStep('editor');
    } catch (e) {
      console.error(e);
    }
  };

  // ─── Create new estimate ──────────────────────────────────────────
  const createEstimate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const r = await fetch(`${API}/estimates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newForm,
          estimate_number: `EST-${Date.now()}`,
          status: 'draft',
          subtotal: 0, tax_amount: 0, total_amount: 0,
        }),
      });
      const est = await r.json();
      await loadEstimates();
      setNewForm({ client_id:'', title:'', description:'', job_type:'Water Damage' });
      setStep('list');
      loadEstimateDetail(est.id);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  // ─── Line item management ─────────────────────────────────────────
  const addFromPriceList = async (item) => {
    if (!activeEstimate) return;
    const newItem = {
      description: item.item_name,
      xactimate_code: item.xactimate_code,
      category: item.category,
      unit: item.unit,
      quantity: 1,
      unit_price: item.unit_price,
      labor_cost: item.labor_cost || 0,
      material_cost: item.material_cost || 0,
      total_price: item.unit_price,
      line_total: item.unit_price,
    };
    try {
      await fetch(`${API}/estimates/${activeEstimate.id}/line-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      await loadEstimateDetail(activeEstimate.id);
    } catch (e) { console.error(e); }
  };

  const updateQty = async (itemId, qty) => {
    const item = lineItems.find(i => i.id === itemId);
    if (!item) return;
    const q = parseFloat(qty) || 0;
    const line_total = q * item.unit_price;
    try {
      await fetch(`${API}/estimates/${activeEstimate.id}/line-items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, quantity: q, total_price: line_total, line_total }),
      });
      setLineItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity: q, line_total } : i));
    } catch (e) { console.error(e); }
  };

  const removeItem = async (itemId) => {
    try {
      await fetch(`${API}/estimates/${activeEstimate.id}/line-items/${itemId}`, { method: 'DELETE' });
      setLineItems(prev => prev.filter(i => i.id !== itemId));
    } catch (e) { console.error(e); }
  };

  // ─── Calculations ─────────────────────────────────────────────────
  const subtotal     = lineItems.reduce((s, i) => s + (parseFloat(i.line_total) || parseFloat(i.quantity) * parseFloat(i.unit_price) || 0), 0);
  const opAmount     = subtotal * (opPercent / 100);
  const taxBase      = subtotal + opAmount;
  const taxAmount    = taxBase * (taxPercent / 100);
  const rcv          = taxBase + taxAmount;
  const deductible   = parseFloat(claimInfo.deductible) || 0;
  const depreciation = parseFloat(claimInfo.depreciation) || 0;
  const acv          = rcv - depreciation;
  const netClaim     = acv - deductible;

  const totalLabor   = lineItems.reduce((s, i) => s + (parseFloat(i.labor_cost) || 0) * (parseFloat(i.quantity) || 1), 0);
  const totalMat     = lineItems.reduce((s, i) => s + (parseFloat(i.material_cost) || 0) * (parseFloat(i.quantity) || 1), 0);

  // ─── Save estimates totals ────────────────────────────────────────
  const saveEstimate = async () => {
    if (!activeEstimate) return;
    setSaving(true);
    try {
      await fetch(`${API}/estimates/${activeEstimate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...activeEstimate,
          subtotal,
          overhead_profit_pct: opPercent,
          overhead_profit_amount: opAmount,
          tax_rate: taxPercent,
          tax_amount: taxAmount,
          total_amount: rcv,
          rcv_total: rcv,
          acv_total: acv,
          deductible: claimInfo.deductible,
          depreciation: claimInfo.depreciation,
          claim_number: claimInfo.claim_number,
          insurance_company: claimInfo.insurance_company,
          adjuster_name: claimInfo.adjuster_name,
          adjuster_phone: claimInfo.adjuster_phone,
          date_of_loss: claimInfo.date_of_loss,
          policy_number: claimInfo.policy_number,
          status: 'draft',
        }),
      });
      await loadEstimateDetail(activeEstimate.id);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  // ─── PDF Export ───────────────────────────────────────────────────
  const exportPDF = async () => {
    if (!activeEstimate) return;
    await saveEstimate();
    try {
      const r = await fetch(`${API}/print/estimate/${activeEstimate.id}`, { method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ include_op: true, show_breakdown: true }),
      });
      if (r.ok) {
        const blob = await r.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `BCS-Estimate-${activeEstimate.estimate_number}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        alert('PDF export: Check that the backend print service is running. Saving estimate data succeeded.');
      }
    } catch (e) {
      alert('PDF service unavailable. Your estimate data is saved.');
    }
  };

  // ─── Filtered price list ──────────────────────────────────────────
  const filtered = priceList.filter(i => {
    const matchCat = !catFilter || i.category === catFilter;
    const matchSearch = !search || i.item_name.toLowerCase().includes(search.toLowerCase())
      || (i.xactimate_code || '').toLowerCase().includes(search.toLowerCase())
      || (i.description || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const grouped = filtered.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // ─── Group line items by category ────────────────────────────────
  const linesByCategory = lineItems.reduce((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const getStatusBadge = (status) => {
    const map = { draft:'bg-gray-100 text-gray-700', sent:'bg-blue-100 text-blue-700',
      approved:'bg-green-100 text-green-700', rejected:'bg-red-100 text-red-700',
      converted:'bg-purple-100 text-purple-700' };
    return map[status] || 'bg-gray-100 text-gray-700';
  };

  // ─── RENDER: List ─────────────────────────────────────────────────
  if (step === 'list') return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-6 py-5 text-white flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SD Xactimate Estimator</h1>
          <p className="text-blue-200 text-sm mt-0.5">Building Care Solutions — San Diego, CA</p>
        </div>
        <button onClick={() => setStep('new')}
          className="px-5 py-2.5 bg-white text-blue-700 rounded-lg font-semibold hover:bg-blue-50 shadow transition">
          + New Estimate
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {estimates.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <div className="text-5xl mb-3">📋</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Estimates Yet</h2>
            <p className="text-gray-500 mb-5">Create your first Xactimate-style estimate for San Diego jobs.</p>
            <button onClick={() => setStep('new')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Create First Estimate
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {estimates.map(est => (
              <div key={est.id} onClick={() => loadEstimateDetail(est.id)}
                className="bg-white rounded-xl shadow hover:shadow-lg cursor-pointer transition border border-gray-100">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-800">{est.title}</p>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">{est.estimate_number}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(est.status)}`}>
                      {est.status}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-end">
                    <span className="text-xs text-gray-500">{new Date(est.created_at).toLocaleDateString()}</span>
                    <span className="text-xl font-bold text-blue-700">{fmt(est.total_amount)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ─── RENDER: New Estimate Form ────────────────────────────────────
  if (step === 'new') return (
    <div className="h-full flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-6 py-4 rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">New Estimate</h2>
          <p className="text-blue-200 text-sm">San Diego · Xactimate Pricing</p>
        </div>
        <form onSubmit={createEstimate} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
            <select value={newForm.client_id} required
              onChange={e => setNewForm(p => ({...p, client_id: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Select client...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estimate Title *</label>
            <input required value={newForm.title} placeholder="e.g. Water Damage — Kitchen & Living Room"
              onChange={e => setNewForm(p => ({...p, title: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
            <select value={newForm.job_type}
              onChange={e => setNewForm(p => ({...p, job_type: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              {['Water Damage','Fire Damage','Mold Remediation','General Construction','Roofing','Full Restoration'].map(t =>
                <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={2} value={newForm.description} placeholder="Brief description of the loss or scope..."
              onChange={e => setNewForm(p => ({...p, description: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"/>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setStep('list')}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50">
              {saving ? 'Creating...' : 'Create Estimate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // ─── RENDER: Editor ───────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setStep('list')} className="text-blue-600 hover:underline text-sm font-medium">
            ← All Estimates
          </button>
          <span className="text-gray-300">/</span>
          <span className="font-semibold text-gray-800">{activeEstimate?.title}</span>
          <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            {activeEstimate?.estimate_number}
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowPicker(!showPicker)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              showPicker ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}>
            {showPicker ? '✕ Close Picker' : '+ Add Line Items'}
          </button>
          <button onClick={saveEstimate} disabled={saving}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50">
            {saving ? 'Saving...' : '💾 Save'}
          </button>
          <button onClick={exportPDF}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900">
            📄 PDF
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">

        {/* ── Left: Line Items ── */}
        <div className={`flex flex-col overflow-hidden transition-all ${showPicker ? 'w-1/2' : 'flex-1'}`}>

          {/* Claim Info */}
          <div className="bg-blue-50 border-b border-blue-200 px-4 py-3 shrink-0">
            <p className="text-xs font-semibold text-blue-800 mb-2 uppercase tracking-wide">Insurance / Claim Info</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                ['claim_number','Claim #','text'],['insurance_company','Insurance Co.','text'],
                ['adjuster_name','Adjuster','text'],['date_of_loss','Date of Loss','date'],
                ['policy_number','Policy #','text'],['adjuster_phone','Adj. Phone','tel'],
              ].map(([field, label, type]) => (
                <div key={field}>
                  <label className="block text-xs text-blue-700 mb-0.5">{label}</label>
                  <input type={type} value={claimInfo[field]}
                    onChange={e => setClaimInfo(p => ({...p, [field]: e.target.value}))}
                    className="w-full px-2 py-1 text-sm border border-blue-200 rounded bg-white focus:ring-1 focus:ring-blue-400"/>
                </div>
              ))}
            </div>
          </div>

          {/* Line items list */}
          <div className="flex-1 overflow-auto p-4 space-y-2">
            {lineItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-gray-500 font-medium">No line items yet</p>
                <p className="text-gray-400 text-sm mt-1">Click <strong>+ Add Line Items</strong> to browse the San Diego price list</p>
              </div>
            ) : (
              Object.entries(linesByCategory).map(([cat, items]) => {
                const cfg = CATEGORY_CONFIG[cat] || { code:'', color:'bg-gray-100 text-gray-700', icon:'📦' };
                const catTotal = items.reduce((s, i) => s + ((parseFloat(i.quantity)||1) * parseFloat(i.unit_price||0)), 0);
                return (
                  <div key={cat} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className={`flex items-center justify-between px-3 py-2 ${cfg.color}`}>
                      <span className="font-semibold text-sm">{cfg.icon} {cat}
                        <span className="text-xs opacity-70 ml-2">[{cfg.code}]</span>
                      </span>
                      <span className="text-sm font-bold">{fmt(catTotal)}</span>
                    </div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-gray-500 border-b">
                          <th className="text-left px-3 py-1.5 font-medium w-8">#</th>
                          <th className="text-left px-2 py-1.5 font-medium">Description</th>
                          <th className="text-left px-2 py-1.5 font-medium w-12">Unit</th>
                          <th className="text-right px-2 py-1.5 font-medium w-16">Qty</th>
                          <th className="text-right px-2 py-1.5 font-medium w-24">Unit Price</th>
                          <th className="text-right px-2 py-1.5 font-medium w-24">Total</th>
                          <th className="w-8"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, idx) => (
                          <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                            <td className="px-3 py-2 text-xs text-gray-400">{idx+1}</td>
                            <td className="px-2 py-2">
                              <p className="font-medium text-gray-800">{item.description}</p>
                              {item.xactimate_code && (
                                <p className="text-xs text-gray-400 font-mono">{item.xactimate_code}</p>
                              )}
                            </td>
                            <td className="px-2 py-2 text-gray-500">{item.unit}</td>
                            <td className="px-2 py-2 text-right">
                              <input type="number" min="0" step="0.01"
                                defaultValue={item.quantity}
                                onBlur={e => updateQty(item.id, e.target.value)}
                                className="w-16 text-right border border-gray-200 rounded px-1 py-0.5 text-sm focus:ring-1 focus:ring-blue-400"/>
                            </td>
                            <td className="px-2 py-2 text-right text-gray-700">{fmt(item.unit_price)}</td>
                            <td className="px-2 py-2 text-right font-semibold text-gray-800">
                              {fmt((parseFloat(item.quantity)||1) * parseFloat(item.unit_price||0))}
                            </td>
                            <td className="px-2 py-2 text-center">
                              <button onClick={() => removeItem(item.id)}
                                className="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })
            )}
          </div>

          {/* Totals panel */}
          <div className="bg-white border-t border-gray-200 p-4 shrink-0">
            <div className="max-w-sm ml-auto space-y-1.5">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Labor Total</span>
                <span className="font-medium">{fmt(totalLabor)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Material Total</span>
                <span className="font-medium">{fmt(totalMat)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-gray-800 border-t pt-1.5">
                <span>Direct Cost Subtotal</span>
                <span>{fmt(subtotal)}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">O&P</span>
                  <input type="number" min="0" max="50" step="0.5" value={opPercent}
                    onChange={e => setOpPercent(parseFloat(e.target.value)||0)}
                    className="w-14 text-center border border-gray-200 rounded px-1 py-0.5 text-xs"/>
                  <span className="text-gray-500 text-xs">%</span>
                </div>
                <span className="font-medium">{fmt(opAmount)}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Tax</span>
                  <input type="number" min="0" max="15" step="0.25" value={taxPercent}
                    onChange={e => setTaxPercent(parseFloat(e.target.value)||0)}
                    className="w-14 text-center border border-gray-200 rounded px-1 py-0.5 text-xs"/>
                  <span className="text-gray-500 text-xs">%</span>
                </div>
                <span className="font-medium">{fmt(taxAmount)}</span>
              </div>

              <div className="flex justify-between text-base font-bold text-blue-700 border-t border-blue-200 pt-2">
                <span>RCV Total</span>
                <span>{fmt(rcv)}</span>
              </div>

              <div className="mt-2 pt-2 border-t space-y-1">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Less Depreciation</span>
                  <div className="flex items-center gap-1">
                    <span>$</span>
                    <input type="number" min="0" step="0.01" value={claimInfo.depreciation}
                      onChange={e => setClaimInfo(p => ({...p, depreciation: e.target.value}))}
                      className="w-20 text-right border border-gray-200 rounded px-1 py-0.5 text-xs"/>
                  </div>
                </div>
                <div className="flex justify-between text-sm font-semibold text-gray-700">
                  <span>ACV Total</span>
                  <span>{fmt(acv)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Less Deductible</span>
                  <div className="flex items-center gap-1">
                    <span>$</span>
                    <input type="number" min="0" step="0.01" value={claimInfo.deductible}
                      onChange={e => setClaimInfo(p => ({...p, deductible: e.target.value}))}
                      className="w-20 text-right border border-gray-200 rounded px-1 py-0.5 text-xs"/>
                  </div>
                </div>
                <div className="flex justify-between text-base font-bold text-green-700">
                  <span>Net Claim</span>
                  <span>{fmt(netClaim)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Price List Picker ── */}
        {showPicker && (
          <div className="w-1/2 flex flex-col border-l border-gray-200 bg-white overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
              <p className="text-sm font-bold text-gray-700 mb-2">San Diego Price List</p>
              <div className="flex gap-2">
                <input ref={searchRef} type="text" placeholder="Search by name or code..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"/>
                <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setSearch(''); }}
                  className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400">
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">{filtered.length} items — click to add to estimate</p>
            </div>

            <div className="flex-1 overflow-auto">
              {Object.entries(grouped).map(([cat, items]) => {
                const cfg = CATEGORY_CONFIG[cat] || { code:'', color:'bg-gray-100 text-gray-700', icon:'📦' };
                return (
                  <div key={cat}>
                    <div className={`sticky top-0 flex items-center justify-between px-3 py-1.5 text-xs font-bold ${cfg.color} z-10`}>
                      <span>{cfg.icon} {cat} <span className="opacity-60 font-mono">[{cfg.code}]</span></span>
                      <span>{items.length} items</span>
                    </div>
                    {items.map(item => (
                      <button key={item.id} onClick={() => addFromPriceList(item)}
                        className="w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-gray-100 group transition">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0 pr-3">
                            <p className="text-sm font-medium text-gray-800 group-hover:text-blue-700 truncate">
                              {item.item_name}
                            </p>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-xs text-gray-400 font-mono">{item.xactimate_code}</span>
                              <span className="text-xs text-gray-400">{item.unit}</span>
                              {item.labor_cost > 0 && (
                                <span className="text-xs text-gray-400">
                                  L:{fmt(item.labor_cost)} M:{fmt(item.material_cost)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-blue-700">{fmt(item.unit_price)}</p>
                            <p className="text-xs text-gray-400">/{item.unit}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
