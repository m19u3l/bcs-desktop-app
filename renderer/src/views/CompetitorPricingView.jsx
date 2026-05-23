import React, { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const fmt = (n) => n != null ? `$${(parseFloat(n)||0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—';
const pct = (a, b) => b ? (((a - b) / b) * 100).toFixed(1) : null;

export default function CompetitorPricingView() {
  const [items, setItems]       = useState([]);
  const [summary, setSummary]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [catFilter, setCatFilter]   = useState('');
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(true);
  const [view, setView]         = useState('detail'); // 'detail' | 'summary'
  const [sortBy, setSortBy]     = useState('code');
  const [showOnlyBelow, setShowOnlyBelow] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [itemsRes, sumRes, catsRes] = await Promise.all([
        fetch(`${API}/competitor-pricing`),
        fetch(`${API}/competitor-pricing/summary`),
        fetch(`${API}/competitor-pricing/categories`),
      ]);
      const [itemsData, sumData, catsData] = await Promise.all([
        itemsRes.json(), sumRes.json(), catsRes.json(),
      ]);
      setItems(Array.isArray(itemsData) ? itemsData : []);
      setSummary(Array.isArray(sumData) ? sumData : []);
      setCategories(Array.isArray(catsData) ? catsData : []);
    } catch (e) {
      console.error('Competitor pricing load error:', e);
    } finally {
      setLoading(false);
    }
  };

  // Combine competitor table with full price list for display
  const [priceList, setPriceList] = useState([]);
  useEffect(() => {
    fetch(`${API}/price-list`).then(r => r.json()).then(d => setPriceList(Array.isArray(d) ? d : [])).catch(()=>{});
  }, []);

  // Build display rows — merge price_list with competitor_pricing
  const buildRows = () => {
    // For items in competitor table
    const competitorMap = {};
    items.forEach(i => { competitorMap[i.xactimate_code] = i; });

    // Annotate price list items that have competitor data
    const rows = priceList
      .filter(p => {
        const hasComp = !!competitorMap[p.xactimate_code];
        const matchCat = !catFilter || p.category === catFilter;
        const matchSearch = !search ||
          p.item_name.toLowerCase().includes(search.toLowerCase()) ||
          (p.xactimate_code||'').toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch && (hasComp || view === 'detail');
      })
      .map(p => {
        const comp = competitorMap[p.xactimate_code] || {};
        return {
          ...p,
          servpro: comp.servpro_price,
          paulDavis: comp.paul_davis_price,
          servicemaster: comp.servicemaster_price,
          marketLow: comp.market_low,
          marketHigh: comp.market_high,
          hasComp: !!comp.servpro_price,
        };
      });

    if (showOnlyBelow) {
      return rows.filter(r => r.hasComp && r.unit_price < r.marketHigh);
    }

    return rows.sort((a, b) => {
      if (sortBy === 'code') return (a.xactimate_code||'').localeCompare(b.xactimate_code||'');
      if (sortBy === 'savings') {
        const sa = r => r.servpro ? r.servpro - r.unit_price : 0;
        return sa(b) - sa(a);
      }
      if (sortBy === 'price') return a.unit_price - b.unit_price;
      return 0;
    });
  };

  const rows = buildRows();

  const getBadge = (bcs, competitor) => {
    if (!competitor) return null;
    const diff = pct(bcs, competitor);
    if (diff === null) return null;
    const d = parseFloat(diff);
    if (d < -5)  return { label: `${Math.abs(d)}% below SERVPRO`, cls: 'bg-green-100 text-green-800' };
    if (d < 0)   return { label: `${Math.abs(d)}% below`, cls: 'bg-emerald-50 text-emerald-700' };
    if (d < 5)   return { label: 'Competitive', cls: 'bg-yellow-50 text-yellow-700' };
    return { label: `${d}% above SERVPRO`, cls: 'bg-red-50 text-red-700' };
  };

  if (loading) return (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-4xl mb-3 animate-spin">⏳</div>
        <p className="text-gray-600">Loading competitor pricing...</p>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-800 px-6 py-5 text-white shrink-0">
        <h1 className="text-2xl font-bold">Competitor Pricing Comparison</h1>
        <p className="text-indigo-200 text-sm mt-0.5">
          San Diego Market · BCS vs SERVPRO, Paul Davis, ServiceMaster
        </p>
      </div>

      {/* Summary cards */}
      {summary.length > 0 && (
        <div className="bg-white border-b border-gray-200 px-6 py-4 shrink-0">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-3 tracking-wide">Category Overview — Avg BCS Price vs SERVPRO</p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {summary.map(cat => {
              const diff = parseFloat(cat.savings_vs_servpro_pct);
              const isBelow = diff < 0;
              return (
                <div key={cat.trade_category}
                  onClick={() => { setCatFilter(cat.trade_category); setView('detail'); }}
                  className={`cursor-pointer shrink-0 px-4 py-3 rounded-lg border transition hover:shadow
                    ${catFilter === cat.trade_category ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 bg-gray-50'}`}>
                  <p className="text-xs font-semibold text-gray-700 whitespace-nowrap">{cat.trade_category}</p>
                  <p className="text-sm font-bold mt-0.5">{fmt(cat.avg_bcs_price)} <span className="text-xs font-normal text-gray-400">avg/unit</span></p>
                  <p className={`text-xs mt-0.5 font-medium ${isBelow ? 'text-green-600' : 'text-red-500'}`}>
                    {isBelow ? '↓' : '↑'} {Math.abs(diff)}% vs SERVPRO
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 shrink-0 flex-wrap">
        <input type="text" placeholder="Search items or code..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg w-56 focus:ring-2 focus:ring-indigo-400"/>

        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400">
          <option value="">All Categories ({priceList.length} items)</option>
          {[...new Set(priceList.map(p => p.category))].sort().map(c =>
            <option key={c}>{c}</option>)}
        </select>

        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400">
          <option value="code">Sort: By Code</option>
          <option value="savings">Sort: Most Savings</option>
          <option value="price">Sort: By Price</option>
        </select>

        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" checked={showOnlyBelow} onChange={e => setShowOnlyBelow(e.target.checked)}
            className="rounded text-indigo-600"/>
          Show only items below market
        </label>

        {catFilter && (
          <button onClick={() => { setCatFilter(''); setSearch(''); }}
            className="text-xs text-indigo-600 hover:underline">Clear filter ×</button>
        )}

        <span className="ml-auto text-xs text-gray-400">{rows.length} items shown</span>
      </div>

      {/* Main table */}
      <div className="flex-1 overflow-auto">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-500">No items match your filter.</p>
            <p className="text-gray-400 text-sm mt-1">
              {items.length === 0
                ? 'Run the seed script first: cd backend && node scripts/seedSanDiegoPricing.mjs'
                : 'Try clearing the category filter or search.'}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr className="text-xs text-gray-600 font-semibold">
                <th className="text-left px-4 py-3 w-28">Code</th>
                <th className="text-left px-3 py-3">Item Description</th>
                <th className="text-center px-2 py-3 w-14">Unit</th>
                <th className="text-right px-3 py-3 w-24 bg-blue-50 text-blue-800">BCS Price</th>
                <th className="text-right px-3 py-3 w-24">SERVPRO</th>
                <th className="text-right px-3 py-3 w-24">Paul Davis</th>
                <th className="text-right px-3 py-3 w-24">ServiceMaster</th>
                <th className="text-right px-3 py-3 w-28 text-gray-500">Market Range</th>
                <th className="text-center px-3 py-3 w-36">BCS vs Market</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                const badge = getBadge(row.unit_price, row.servpro);
                const savingsVsServpro = row.servpro ? row.servpro - row.unit_price : null;
                return (
                  <tr key={row.id || idx}
                    className={`border-b border-gray-100 hover:bg-indigo-50 transition ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs text-indigo-700 font-semibold">{row.xactimate_code || '—'}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <p className="font-medium text-gray-800">{row.item_name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{row.category}</p>
                    </td>
                    <td className="px-2 py-2.5 text-center text-gray-500">{row.unit}</td>

                    {/* BCS price */}
                    <td className="px-3 py-2.5 text-right bg-blue-50 font-bold text-blue-800">
                      {fmt(row.unit_price)}
                    </td>

                    {/* Competitors */}
                    <td className="px-3 py-2.5 text-right text-gray-600">
                      {row.servpro ? (
                        <div>
                          <p>{fmt(row.servpro)}</p>
                          {savingsVsServpro !== null && savingsVsServpro > 0 && (
                            <p className="text-xs text-green-600 font-medium">save {fmt(savingsVsServpro)}</p>
                          )}
                        </div>
                      ) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-3 py-2.5 text-right text-gray-600">
                      {row.paulDavis ? fmt(row.paulDavis) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-3 py-2.5 text-right text-gray-600">
                      {row.servicemaster ? fmt(row.servicemaster) : <span className="text-gray-300">—</span>}
                    </td>

                    {/* Market range */}
                    <td className="px-3 py-2.5 text-right text-xs text-gray-400">
                      {row.marketLow && row.marketHigh
                        ? `${fmt(row.marketLow)} – ${fmt(row.marketHigh)}`
                        : <span className="text-gray-300">—</span>}
                    </td>

                    {/* Badge */}
                    <td className="px-3 py-2.5 text-center">
                      {badge ? (
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${badge.cls}`}>
                          {badge.label}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">All trades listed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer note */}
      <div className="bg-white border-t border-gray-100 px-6 py-2 shrink-0">
        <p className="text-xs text-gray-400">
          San Diego market pricing sourced from HomeAdvisor, Handoff.ai, CountBricks, ProMatcher, local contractor surveys — Q1-Q2 2026.
          SERVPRO, Paul Davis, and ServiceMaster rates are franchise market averages based on industry research; they use Xactimate/Symbility and do not publish public rate sheets.
          Standard insurance O&P: 10% overhead + 10% profit (20% combined).
        </p>
      </div>
    </div>
  );
}
