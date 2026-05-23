import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const fmt = n => `$${(parseFloat(n)||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}`;

export default function Dashboard() {
  const { user, authFetch } = useAuth();
  const [stats, setStats]   = useState(null);
  const [estimates, setEst] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      authFetch('/api/estimates').then(r => r.json()),
      authFetch('/api/price-list').then(r => r.json()),
      authFetch('/api/rsmeans/summary').then(r => r.json()).catch(() => []),
    ]).then(([ests, prices, rsm]) => {
      setEst(Array.isArray(ests) ? ests.slice(0, 6) : []);
      setStats({
        estimateCount: Array.isArray(ests) ? ests.length : 0,
        priceItems:    Array.isArray(prices) ? prices.length : 0,
        rsmeansItems:  Array.isArray(rsm) ? rsm.reduce((s,d) => s + (d.items||0), 0) : 0,
        totalRevenue:  Array.isArray(ests) ? ests.reduce((s,e) => s + (parseFloat(e.total_amount)||0), 0) : 0,
      });
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = stats ? [
    { label:'Total Estimates',    value: stats.estimateCount,           icon:'📋', color:'bg-blue-50 text-blue-700' },
    { label:'Estimate Value',     value: fmt(stats.totalRevenue),       icon:'💰', color:'bg-green-50 text-green-700' },
    { label:'SD Price Items',     value: stats.priceItems,              icon:'📐', color:'bg-purple-50 text-purple-700' },
    { label:'RSMeans Items',      value: stats.rsmeansItems || '150+',  icon:'📖', color:'bg-amber-50 text-amber-700' },
  ] : [];

  const QUICK = [
    { to:'/app/estimator',  icon:'📐', title:'New Estimate',      desc:'Build a Xactimate-style estimate' },
    { to:'/app/rsmeans',    icon:'📋', title:'Browse RSMeans',    desc:'CSI MasterFormat line items' },
    { to:'/app/competitor', icon:'📈', title:'Competitor Prices', desc:'BCS vs SERVPRO & Paul Davis' },
  ];

  const statusColor = s => ({ draft:'bg-gray-100 text-gray-600', sent:'bg-blue-100 text-blue-700', approved:'bg-green-100 text-green-700', rejected:'bg-red-100 text-red-700' }[s] || 'bg-gray-100 text-gray-600');

  return (
    <div className="h-full overflow-auto bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
          {user?.full_name?.split(' ')[0] || user?.username} 👋
        </h1>
        <p className="text-gray-500 mt-1">BCS Estimator · San Diego, CA · {new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? Array(4).fill(0).map((_,i) => (
          <div key={i} className="card p-5 animate-pulse"><div className="h-8 bg-gray-200 rounded mb-2"/><div className="h-4 bg-gray-100 rounded w-2/3"/></div>
        )) : STAT_CARDS.map(s => (
          <div key={s.label} className="card p-5">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-xl mb-3 ${s.color}`}>{s.icon}</div>
            <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {QUICK.map(q => (
              <Link key={q.to} to={q.to}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-transparent transition group">
                <span className="text-2xl">{q.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700">{q.title}</p>
                  <p className="text-xs text-gray-500">{q.desc}</p>
                </div>
                <span className="ml-auto text-gray-300 group-hover:text-blue-400">→</span>
              </Link>
            ))}
          </div>

          {/* Plan badge */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-800 uppercase mb-1">Your Plan</p>
            <p className="text-sm font-bold text-blue-900 capitalize">{user?.subscription_tier || 'Free'}</p>
            {(!user?.subscription_tier || user.subscription_tier === 'free') && (
              <p className="text-xs text-blue-600 mt-1">Upgrade to Pro for RSMeans + unlimited estimates</p>
            )}
          </div>
        </div>

        {/* Recent estimates */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Recent Estimates</h2>
            <Link to="/app/estimator" className="text-xs text-blue-600 hover:underline font-medium">New estimate →</Link>
          </div>
          {loading ? (
            <div className="space-y-3">{Array(4).fill(0).map((_,i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"/>)}</div>
          ) : estimates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-3xl mb-2">📋</p>
              <p className="text-gray-500 text-sm">No estimates yet.</p>
              <Link to="/app/estimator" className="btn-primary text-sm mt-3 inline-block">Create your first estimate</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {estimates.map(e => (
                <div key={e.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{e.title}</p>
                    <p className="text-xs text-gray-400 font-mono">{e.estimate_number}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColor(e.status)}`}>{e.status}</span>
                  <span className="text-sm font-bold text-gray-700 shrink-0">{fmt(e.total_amount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Data sources note */}
      <div className="mt-6 p-4 bg-gray-100 rounded-xl text-xs text-gray-500">
        <span className="font-semibold text-gray-700">📐 Pricing Sources: </span>
        San Diego Xactimate SAN price list equivalent (178 items) · RSMeans Building Construction Cost Data 2025/2026, SD CCI applied (150+ items) ·
        Competitor rates: SERVPRO, Paul Davis, ServiceMaster franchise averages · O&P: 10%+10% insurance standard
      </div>
    </div>
  );
}
