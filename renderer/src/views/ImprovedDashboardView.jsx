import { useEffect, useState } from 'react';
import { dashboardAPI, notesAPI, companySettingsAPI } from '../api-client';
import { useAPI } from '../hooks/useAPI';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export default function ImprovedDashboardView({ onNavigate }) {
  const { data: stats, loading, execute: fetchStats } = useAPI(dashboardAPI.getStats, true);

  const [workOrders, setWorkOrders]       = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [pastDueInvoices, setPastDueInvoices] = useState([]);
  const [notes, setNotes]                 = useState([]);
  const [companySettings, setCompanySettings] = useState({});
  const [selectedRow, setSelectedRow]     = useState(null);
  const [filterText, setFilterText]       = useState('');
  const [newNote, setNewNote]             = useState('');
  const [refreshing, setRefreshing]       = useState(false);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const [wo, activity, payments, pastDue, notesList, settings] = await Promise.all([
        fetch(`${API_BASE}/work-orders`).then(r => r.json()).catch(() => []),
        dashboardAPI.getRecentActivity().catch(() => []),
        dashboardAPI.getRecentPayments().catch(() => []),
        dashboardAPI.getPastDueInvoices().catch(() => []),
        notesAPI.getAll().catch(() => []),
        companySettingsAPI.get().catch(() => ({})),
      ]);
      setWorkOrders(Array.isArray(wo) ? wo : []);
      setRecentActivity(Array.isArray(activity) ? activity : []);
      setRecentPayments(Array.isArray(payments) ? payments : []);
      setPastDueInvoices(Array.isArray(pastDue) ? pastDue : []);
      setNotes(Array.isArray(notesList) ? notesList : []);
      setCompanySettings(settings || {});
    } catch (err) {
      console.error('Dashboard load error:', err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchStats(), loadAll()]);
    setRefreshing(false);
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      const created = await notesAPI.create({ title: newNote, content: '', category: 'general', priority: 'normal' });
      setNotes([created, ...notes]);
      setNewNote('');
    } catch {}
  };

  const fmt$ = v => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v || 0);
  const fmtDate = d => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  const d = stats || {};
  const activeJobs     = d.active_jobs      ?? workOrders.filter(w => w.status === 'in_progress').length;
  const pendingEst     = d.pending_estimates ?? 0;
  const invoicesDue    = d.pending_invoices  ?? pastDueInvoices.length;
  const openClaims     = d.open_claims       ?? workOrders.filter(w => w.status !== 'completed').length;

  const filtered = workOrders.filter(wo =>
    !filterText ||
    wo.work_order_number?.toLowerCase().includes(filterText.toLowerCase()) ||
    wo.client_name?.toLowerCase().includes(filterText.toLowerCase()) ||
    wo.title?.toLowerCase().includes(filterText.toLowerCase()) ||
    wo.description?.toLowerCase().includes(filterText.toLowerCase())
  );

  const statusBadge = (s) => {
    const map = {
      completed:   'bg-emerald-100 text-emerald-700',
      in_progress: 'bg-blue-100 text-blue-700',
      pending:     'bg-yellow-100 text-yellow-700',
      cancelled:   'bg-zinc-100 text-zinc-500',
    };
    return map[s] || 'bg-zinc-100 text-zinc-600';
  };

  const statCards = [
    { label: 'Active Jobs',        value: activeJobs,   color: 'text-blue-600',    bg: 'bg-blue-50',    nav: 'jobtracking' },
    { label: 'Pending Estimates',  value: pendingEst,   color: 'text-amber-600',   bg: 'bg-amber-50',   nav: 'estimates'   },
    { label: 'Invoices Due',       value: invoicesDue,  color: 'text-red-600',     bg: 'bg-red-50',     nav: 'invoices'    },
    { label: 'Open Work Orders',   value: openClaims,   color: 'text-purple-600',  bg: 'bg-purple-50',  nav: 'workorders'  },
  ];

  if (loading && !stats) {
    return (
      <div className="h-full flex items-center justify-center bg-zinc-50">
        <div className="text-center text-zinc-400">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-zinc-50 overflow-hidden">

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-4 gap-4 p-4 shrink-0">
        {statCards.map(card => (
          <button
            key={card.label}
            onClick={() => onNavigate?.(card.nav)}
            className={`${card.bg} rounded-xl border border-zinc-200 p-4 text-left hover:shadow-md transition-shadow`}
          >
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">{card.label}</p>
            <p className={`text-4xl font-bold mt-1 ${card.color}`}>{card.value}</p>
          </button>
        ))}
      </div>

      {/* ── Main Split: Table + Right Panel ── */}
      <div className="flex-1 flex overflow-hidden px-4 pb-4 gap-4 min-h-0">

        {/* Project Table */}
        <div className="flex-1 bg-white rounded-xl border border-zinc-200 flex flex-col overflow-hidden shadow-sm">
          <div className="border-b border-zinc-200 px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <h2 className="font-semibold text-zinc-800">Active Projects</h2>
              <span className="text-xs bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full">{workOrders.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
                placeholder="Filter projects…"
                className="border border-zinc-300 rounded px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500 w-48"
              />
              <button
                onClick={handleRefresh}
                className="text-xs text-zinc-500 hover:text-zinc-800 border border-zinc-200 rounded px-2 py-1.5 hover:bg-zinc-50 transition-colors"
              >
                {refreshing ? '…' : '↻'}
              </button>
            </div>
          </div>

          <div className="overflow-auto flex-1">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 border-b border-zinc-200 sticky top-0">
                <tr className="text-left text-xs text-zinc-500 font-medium uppercase tracking-wide">
                  <th className="px-4 py-2.5">Project ID</th>
                  <th className="px-4 py-2.5">Client</th>
                  <th className="px-4 py-2.5">Title</th>
                  <th className="px-4 py-2.5">Type</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5">Created</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-zinc-400 text-sm">No projects found</td></tr>
                ) : filtered.map(wo => (
                  <tr
                    key={wo.id}
                    onClick={() => setSelectedRow(wo)}
                    className={`border-b border-zinc-100 cursor-pointer transition-colors ${selectedRow?.id === wo.id ? 'bg-blue-50' : 'hover:bg-zinc-50'}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs font-medium text-blue-700">{wo.work_order_number || `WO-${wo.id}`}</td>
                    <td className="px-4 py-3 text-zinc-700">{wo.client_name || '—'}</td>
                    <td className="px-4 py-3 text-zinc-600 max-w-xs truncate">{wo.title || wo.description || '—'}</td>
                    <td className="px-4 py-3 text-zinc-500 text-xs">{wo.type || 'General'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusBadge(wo.status)}`}>
                        {wo.status?.replace('_', ' ') || 'pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-400 text-xs">{fmtDate(wo.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="w-80 flex flex-col gap-3 overflow-hidden shrink-0">

          {/* Project Details */}
          <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm shrink-0">
            <h3 className="font-semibold text-zinc-800 text-sm mb-3">
              {selectedRow ? 'Project Details' : 'Select a project'}
            </h3>
            {selectedRow ? (
              <div className="space-y-2.5 text-sm">
                <Row label="Project ID"   value={selectedRow.work_order_number || `WO-${selectedRow.id}`} mono />
                <Row label="Client"       value={selectedRow.client_name || '—'} />
                <Row label="Status"       value={<span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusBadge(selectedRow.status)}`}>{selectedRow.status?.replace('_', ' ') || '—'}</span>} />
                <Row label="Type"         value={selectedRow.type || 'General'} />
                <Row label="Address"      value={selectedRow.address || '—'} />
                <Row label="Created"      value={fmtDate(selectedRow.created_at)} />
                {selectedRow.amount > 0 && <Row label="Amount" value={fmt$(selectedRow.amount)} />}
                <div className="pt-2 flex gap-2">
                  <button onClick={() => onNavigate?.('workorders')} className="flex-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded py-1.5 font-medium transition-colors">
                    Open
                  </button>
                  <button onClick={() => onNavigate?.('invoices')} className="flex-1 text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded py-1.5 font-medium transition-colors">
                    Invoice
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-zinc-400">Click a row in the project table to see details here.</p>
            )}
          </div>

          {/* Activity Feed */}
          <div className="flex-1 bg-white rounded-xl border border-zinc-200 flex flex-col overflow-hidden shadow-sm min-h-0">
            <div className="border-b border-zinc-200 px-4 py-3 shrink-0">
              <h3 className="font-semibold text-zinc-800 text-sm">Activity Feed</h3>
            </div>
            <div className="flex-1 overflow-auto p-3 space-y-2">
              {recentActivity.length > 0 ? recentActivity.slice(0, 12).map((a, i) => (
                <div key={i} className="border border-zinc-100 rounded-lg p-3 hover:bg-zinc-50 transition-colors">
                  <p className="text-xs font-medium text-zinc-700 leading-snug">{a.description || a.action || 'Activity'}</p>
                  <p className="text-xs text-zinc-400 mt-1">{a.entity_type || ''} · {fmtDate(a.created_at)}</p>
                </div>
              )) : (
                <>
                  {[
                    { text: 'No recent activity yet', sub: 'Actions will appear here' },
                    ...recentPayments.slice(0, 3).map(p => ({ text: `Payment received: ${fmt$(p.amount)}`, sub: p.client_name || '' })),
                    ...pastDueInvoices.slice(0, 2).map(inv => ({ text: `Past due: ${inv.invoice_number}`, sub: `${inv.client_name} · ${fmt$(inv.amount)}` })),
                  ].filter(Boolean).map((item, i) => (
                    <div key={i} className="border border-zinc-100 rounded-lg p-3">
                      <p className="text-xs font-medium text-zinc-700">{item.text}</p>
                      {item.sub && <p className="text-xs text-zinc-400 mt-0.5">{item.sub}</p>}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Quick Notes */}
          <div className="bg-white rounded-xl border border-zinc-200 p-3 shadow-sm shrink-0">
            <h3 className="font-semibold text-zinc-800 text-sm mb-2">Quick Notes</h3>
            <div className="flex gap-2 mb-2">
              <input
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddNote()}
                placeholder="Add a note…"
                className="flex-1 text-xs border border-zinc-200 rounded px-2 py-1.5 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={handleAddNote} className="text-xs bg-blue-600 text-white rounded px-2 py-1.5 hover:bg-blue-700">+</button>
            </div>
            <div className="space-y-1 max-h-28 overflow-auto">
              {notes.slice(0, 5).map(n => (
                <div key={n.id} className="text-xs text-zinc-600 bg-zinc-50 rounded px-2 py-1.5 flex justify-between items-start gap-2">
                  <span className="truncate">{n.title || n.content}</span>
                </div>
              ))}
              {notes.length === 0 && <p className="text-xs text-zinc-400">No notes yet</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono }) {
  return (
    <div>
      <p className="text-xs text-zinc-400">{label}</p>
      <p className={`text-sm font-medium text-zinc-800 ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  );
}
