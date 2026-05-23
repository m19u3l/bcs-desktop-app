import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const fmt = n => `$${(parseFloat(n)||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}`;

const COMPANIES = [
  { key:'bcs',          label:'BCS',          color:'bg-blue-600 text-white',   badge:'bg-blue-100 text-blue-800' },
  { key:'servpro',      label:'SERVPRO',       color:'bg-orange-500 text-white', badge:'bg-orange-100 text-orange-800' },
  { key:'paul_davis',   label:'Paul Davis',    color:'bg-red-600 text-white',    badge:'bg-red-100 text-red-800' },
  { key:'servicemaster',label:'ServiceMaster', color:'bg-green-600 text-white',  badge:'bg-green-100 text-green-800' },
];

const SAVINGS_COLOR = pct => pct >= 15 ? 'text-green-600 font-bold' : pct >= 8 ? 'text-blue-600' : 'text-gray-500';

export default function Competitor() {
  const { authFetch } = useAuth();
  const [items, setItems]       = useState([]);
  const [summary, setSummary]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [selCat, setSelCat]     = useState('');
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(true);
  const [view, setView]         = useState('table'); // 'table' | 'summary'

  useEffect(() => {
    authFetch('/api/competitor-pricing/categories').then(r => r.json()).then(d => setCategories(Array.isArray(d) ? d : [])).catch(()=>{});
    authFetch('/api/competitor-pricing/summary').then(r => r.json()).then(d => setSummary(Array.isArray(d) ? d : [])).catch(()=>{});
    load();
  }, []);

  useEffect(() => { load(); }, [selCat, search]);

  const load = () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (selCat) p.set('category', selCat);
    if (search) p.set('search', search);
    authFetch(`/api/competitor-pricing?${p}`)
      .then(r => r.json())
      .then(d => setItems(Array.isArray(d) ? d : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  const savingsPct = (bcs, comp) => {
    if (!comp || comp <= 0) return 0;
    return ((comp - bcs) / comp * 100);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-5 text-white shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Competitor Price Comparison</h1>
            <p className="text-indigo-200 text-sm mt-0.5">BCS vs SERVPRO · Paul Davis · ServiceMaster — San Diego Market</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView('table')}   className={`px-3 py-1.5 rounded text-sm font-medium transition ${view==='table'   ? 'bg-white text-indigo-700' : 'bg-indigo-700/50 text-indigo-100 hover:bg-indigo-700'}`}>Detail</button>
            <button onClick={() => setView('summary')} className={`px-3 py-1.5 rounded text-sm font-medium transition ${view==='summary' ? 'bg-white text-indigo-700' : 'bg-indigo-700/50 text-indigo-100 hover:bg-indigo-700'}`}>By Category</button>
          </div>
        </div>
      </div>

      {/* Summary view */}
      {view === 'summary' && (
        <div className="flex-1 overflow-auto p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {summary.map(s => {
              const spSavings = savingsPct(s.avg_bcs_price, s.avg_servpro);
              return (
                <div key={s.trade_category} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition cursor-pointer"
                  onClick={() => { setSelCat(s.trade_category); setView('table'); }}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900">{s.trade_category}</h3>
                    <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">{s.item_count} items</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">BCS</span>
                      <span className="text-sm font-bold text-blue-700">{fmt(s.avg_bcs_price)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded">SERVPRO</span>
                      <span className="text-sm text-orange-700">{fmt(s.avg_servpro)}</span>
                    </div>
                    {s.avg_paul_davis > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded">Paul Davis</span>
                        <span className="text-sm text-red-700">{fmt(s.avg_paul_davis)}</span>
                      </div>
                    )}
                  </div>
                  {spSavings > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100 text-center">
                      <span className={`text-sm ${SAVINGS_COLOR(spSavings)}`}>
                        BCS saves clients {spSavings.toFixed(0)}% vs SERVPRO
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Market overview banner */}
          <div className="mt-6 bg-indigo-700 text-white rounded-xl p-6">
            <h2 className="font-bold text-lg mb-4">San Diego Market Position</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { label:'vs SERVPRO',      val:'13–19% lower',  sub:'avg BCS rate' },
                { label:'vs Paul Davis',   val:'10–16% lower',  sub:'avg BCS rate' },
                { label:'vs ServiceMaster',val:'8–14% lower',   sub:'avg BCS rate' },
                { label:'Market Coverage', val:'19 trades',     sub:'full service' },
              ].map(s => (
                <div key={s.label} className="bg-white/10 rounded-lg p-3">
                  <p className="text-lg font-extrabold">{s.val}</p>
                  <p className="text-xs text-indigo-200">{s.label}</p>
                  <p className="text-xs text-indigo-300">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Table view */}
      {view === 'table' && <>
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex gap-3 shrink-0 flex-wrap items-center">
          <input type="text" placeholder="Search items…" value={search}
            onChange={e => setSearch(e.target.value)} className="input w-56" />
          <select value={selCat} onChange={e => setSelCat(e.target.value)} className="input w-auto">
            <option value="">All Categories</option>
            {categories.map(c => {
              const key = typeof c === 'string' ? c : (c.trade_category || c.category);
              return <option key={key} value={key}>{key}</option>;
            })}
          </select>
          {selCat && <button onClick={() => setSelCat('')} className="text-xs text-indigo-600 hover:underline">Clear ×</button>}
          <span className="ml-auto text-xs text-gray-400">{items.length} items · San Diego Q1-Q2 2026</span>
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
                  <th className="text-left px-4 py-3">Description</th>
                  <th className="text-center px-2 py-3 w-16">Unit</th>
                  <th className="text-right px-3 py-3 w-28 bg-blue-50 text-blue-800">BCS</th>
                  <th className="text-right px-3 py-3 w-28 bg-orange-50 text-orange-800">SERVPRO</th>
                  <th className="text-right px-3 py-3 w-28 bg-red-50 text-red-800">Paul Davis</th>
                  <th className="text-right px-3 py-3 w-28 bg-green-50 text-green-800">ServiceMaster</th>
                  <th className="text-right px-3 py-3 w-28 text-gray-700">Savings vs SP</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  const spSavings = savingsPct(item.bcs_price, item.servpro_price);
                  return (
                    <tr key={item.id} className={`border-b border-gray-100 hover:bg-indigo-50 transition ${idx%2===0?'bg-white':'bg-gray-50'}`}>
                      <td className="px-4 py-2.5">
                        <p className="font-medium text-gray-800">{item.description}</p>
                        <p className="text-xs text-gray-400">{item.trade_category}</p>
                      </td>
                      <td className="px-2 py-2.5 text-center text-xs text-gray-500">{item.unit}</td>
                      <td className="px-3 py-2.5 text-right bg-blue-50 text-blue-700 font-bold">{fmt(item.bcs_price)}</td>
                      <td className="px-3 py-2.5 text-right bg-orange-50 text-orange-700">{item.servpro_price ? fmt(item.servpro_price) : '—'}</td>
                      <td className="px-3 py-2.5 text-right bg-red-50 text-red-700">{item.paul_davis_price ? fmt(item.paul_davis_price) : '—'}</td>
                      <td className="px-3 py-2.5 text-right bg-green-50 text-green-700">{item.servicemaster_price ? fmt(item.servicemaster_price) : '—'}</td>
                      <td className="px-3 py-2.5 text-right">
                        {spSavings > 0
                          ? <span className={`text-xs font-semibold ${SAVINGS_COLOR(spSavings)}`}>−{spSavings.toFixed(0)}%</span>
                          : <span className="text-xs text-gray-300">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </>}
    </div>
  );
}
