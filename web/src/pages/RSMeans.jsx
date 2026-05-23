import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const fmt  = n => `$${(parseFloat(n)||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}`;

const DIV_NAMES = {
  '01':'General Requirements','02':'Existing Conditions / Site',
  '03':'Concrete','04':'Masonry','05':'Metals / Steel',
  '06':'Wood, Plastics & Composites','07':'Thermal & Moisture Protection',
  '08':'Openings','09':'Finishes','22':'Plumbing',
  '23':'HVAC','26':'Electrical',
};
const DIV_ICONS = {
  '01':'📋','02':'🏗️','03':'🧱','04':'🧱','05':'⚙️',
  '06':'🪵','07':'🏠','08':'🪟','09':'🎨','22':'🔧','23':'❄️','26':'⚡',
};

export default function RSMeans() {
  const { authFetch } = useAuth();
  const [items, setItems]       = useState([]);
  const [divs, setDivs]         = useState([]);
  const [selDiv, setSelDiv]     = useState('');
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(true);
  const [summary, setSummary]   = useState([]);
  const [view, setView]         = useState('table'); // 'table' | 'summary'

  useEffect(() => {
    authFetch('/api/rsmeans/divisions').then(r => r.json()).then(d => setDivs(Array.isArray(d) ? d : [])).catch(()=>{});
    authFetch('/api/rsmeans/summary').then(r => r.json()).then(d => setSummary(Array.isArray(d) ? d : [])).catch(()=>{});
    load();
  }, []);

  useEffect(() => { load(); }, [selDiv, search]);

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selDiv)  params.set('division', selDiv);
    if (search)  params.set('search', search);
    authFetch(`/api/rsmeans?${params}`)
      .then(r => r.json())
      .then(d => setItems(Array.isArray(d) ? d : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  const grouped = items.reduce((acc, i) => {
    const key = i.csi_division;
    if (!acc[key]) acc[key] = [];
    acc[key].push(i);
    return acc;
  }, {});

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-700 px-6 py-5 text-white shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">RSMeans MasterFormat Database</h1>
            <p className="text-amber-100 text-sm mt-0.5">CSI Divisions 01–26 · San Diego City Cost Index Applied · 2025/2026</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView('table')}   className={`px-3 py-1.5 rounded text-sm font-medium transition ${view==='table'   ? 'bg-white text-amber-700' : 'bg-amber-700/50 text-amber-100 hover:bg-amber-700'}`}>Table</button>
            <button onClick={() => setView('summary')} className={`px-3 py-1.5 rounded text-sm font-medium transition ${view==='summary' ? 'bg-white text-amber-700' : 'bg-amber-700/50 text-amber-100 hover:bg-amber-700'}`}>Summary</button>
          </div>
        </div>
      </div>

      {/* Summary view */}
      {view === 'summary' && (
        <div className="flex-1 overflow-auto p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {summary.map(d => (
              <div key={d.csi_division} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition cursor-pointer"
                onClick={() => { setSelDiv(d.csi_division); setView('table'); }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-2xl mb-1">{DIV_ICONS[d.csi_division] || '📦'}</p>
                    <p className="font-bold text-gray-900">Div {d.csi_division}</p>
                    <p className="text-xs text-gray-500">{DIV_NAMES[d.csi_division] || `Division ${d.csi_division}`}</p>
                  </div>
                  <span className="text-xs font-bold bg-amber-50 text-amber-700 px-2 py-1 rounded-full">{d.items} items</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center mt-3 pt-3 border-t border-gray-100">
                  <div><p className="text-xs text-gray-400">Min</p><p className="text-sm font-semibold">{fmt(d.min_cost)}</p></div>
                  <div><p className="text-xs text-gray-400">Avg</p><p className="text-sm font-bold text-amber-700">{fmt(d.avg_cost)}</p></div>
                  <div><p className="text-xs text-gray-400">Max</p><p className="text-sm font-semibold">{fmt(d.max_cost)}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table view */}
      {view === 'table' && <>
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex gap-3 shrink-0 flex-wrap items-center">
          <input type="text" placeholder="Search description or CSI code…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="input w-64" />
          <select value={selDiv} onChange={e => setSelDiv(e.target.value)} className="input w-auto">
            <option value="">All Divisions</option>
            {divs.map(d => <option key={d.division} value={d.division}>Div {d.division} — {DIV_NAMES[d.division] || d.name}</option>)}
          </select>
          {selDiv && <button onClick={() => setSelDiv('')} className="text-xs text-amber-600 hover:underline">Clear ×</button>}
          <span className="ml-auto text-xs text-gray-400">{items.length} items · SD CCI: Labor ×1.27, Mat ×1.08</span>
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40"><div className="animate-spin text-3xl">⏳</div></div>
          ) : items.length === 0 ? (
            <div className="text-center py-20"><p className="text-4xl mb-2">🔍</p><p className="text-gray-500">No items found.</p></div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr className="text-xs text-gray-600 font-semibold">
                  <th className="text-left px-4 py-3 w-36">CSI Code</th>
                  <th className="text-left px-3 py-3">Description</th>
                  <th className="text-center px-2 py-3 w-14">Unit</th>
                  <th className="text-right px-3 py-3 w-24">Nat'l Labor</th>
                  <th className="text-right px-3 py-3 w-24">Nat'l Mat</th>
                  <th className="text-right px-3 py-3 w-24 bg-amber-50 text-amber-800">SD Labor</th>
                  <th className="text-right px-3 py-3 w-24 bg-amber-50 text-amber-800">SD Mat</th>
                  <th className="text-right px-3 py-3 w-28 bg-orange-50 text-orange-800 font-bold">SD Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(grouped).map(([div, rows]) => (
                  <React.Fragment key={div}>
                    <tr className="bg-amber-50">
                      <td colSpan={8} className="px-4 py-2 text-xs font-bold text-amber-800">
                        {DIV_ICONS[div]} Division {div} — {DIV_NAMES[div] || `Division ${div}`}
                        <span className="ml-2 font-normal text-amber-600">({rows.length} items)</span>
                      </td>
                    </tr>
                    {rows.map((item, idx) => (
                      <tr key={item.id}
                        className={`border-b border-gray-100 hover:bg-amber-50 transition ${idx%2===0?'bg-white':'bg-gray-50'}`}>
                        <td className="px-4 py-2.5">
                          <span className="font-mono text-xs text-amber-700 font-semibold">{item.csi_code}</span>
                        </td>
                        <td className="px-3 py-2.5">
                          <p className="font-medium text-gray-800">{item.description}</p>
                          {item.notes && <p className="text-xs text-gray-400 mt-0.5">{item.notes}</p>}
                        </td>
                        <td className="px-2 py-2.5 text-center text-gray-500 text-xs">{item.unit}</td>
                        <td className="px-3 py-2.5 text-right text-gray-400 text-xs">{fmt(item.nat_labor)}</td>
                        <td className="px-3 py-2.5 text-right text-gray-400 text-xs">{fmt(item.nat_material)}</td>
                        <td className="px-3 py-2.5 text-right bg-amber-50 text-amber-700 font-medium">{fmt(item.sd_labor)}</td>
                        <td className="px-3 py-2.5 text-right bg-amber-50 text-amber-700 font-medium">{fmt(item.sd_material)}</td>
                        <td className="px-3 py-2.5 text-right bg-orange-50 text-orange-700 font-bold">{fmt(item.sd_total)}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </>}
    </div>
  );
}
