import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const STATUS_COLORS = {
  new:        'bg-blue-100 text-blue-800 border-blue-200',
  contacted:  'bg-yellow-100 text-yellow-800 border-yellow-200',
  scheduled:  'bg-purple-100 text-purple-800 border-purple-200',
  completed:  'bg-green-100 text-green-800 border-green-200',
  cancelled:  'bg-red-100 text-red-800 border-red-200',
};

const SERVICE_ICONS = {
  'Water Damage Remediation':      '💧',
  'Mold Inspection & Removal':     '🔬',
  'Full Reconstruction':           '🏗️',
  'Emergency Water Extraction':    '🚨',
  'Dryout & Dehumidification':     '💨',
  'Flood Cleanup':                 '🌊',
  'Fire & Smoke Damage':           '🔥',
  'Insurance Estimate / Xactimate':'📋',
  'General Contracting':           '🔨',
  'Free Inspection / Assessment':  '🔍',
};

function fmt(date) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function fmtTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hour = parseInt(h);
  return `${hour > 12 ? hour - 12 : hour || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
}

export default function ServiceRequestsView() {
  const [requests, setRequests]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(null);
  const [filter, setFilter]       = useState('all');
  const [search, setSearch]       = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/service-requests`);
      setRequests(await r.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function updateStatus(id, status) {
    await fetch(`${API_BASE}/service-requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    load();
    if (selected?.id === id) setSelected(s => ({ ...s, status }));
  }

  async function deleteRequest(id) {
    if (!confirm('Delete this service request?')) return;
    await fetch(`${API_BASE}/service-requests/${id}`, { method: 'DELETE' });
    load();
    if (selected?.id === id) setSelected(null);
  }

  const filtered = requests.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return [r.name, r.phone, r.email, r.service_type, r.address].some(f => f?.toLowerCase().includes(q));
    }
    return true;
  });

  const counts = {
    all: requests.length,
    new: requests.filter(r => r.status === 'new').length,
    contacted: requests.filter(r => r.status === 'contacted').length,
    scheduled: requests.filter(r => r.status === 'scheduled').length,
    completed: requests.filter(r => r.status === 'completed').length,
  };

  return (
    <div className="flex h-full bg-gray-50" style={{ minHeight: 'calc(100vh - 56px)' }}>

      {/* ── Left panel: list ──────────────────────────────────────────────── */}
      <div className="flex flex-col w-full max-w-xl border-r border-gray-200 bg-white">

        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Service Requests</h1>
              <p className="text-xs text-gray-400">Incoming requests from the website</p>
            </div>
            <button
              onClick={load}
              className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 font-medium"
            >
              Refresh
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 text-xs font-medium">
            {Object.entries(counts).map(([key, n]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-2.5 py-1 rounded-full border transition-colors ${
                  filter === key
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'text-gray-500 border-gray-200 hover:border-gray-300'
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)} {n > 0 && `(${n})`}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-2.5 border-b border-gray-100">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, phone, service..."
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <div className="text-3xl mb-2">📭</div>
              <p className="text-sm">No requests found</p>
            </div>
          ) : (
            filtered.map(req => (
              <button
                key={req.id}
                onClick={() => setSelected(req)}
                className={`w-full text-left px-4 py-3.5 border-b border-gray-100 hover:bg-blue-50 transition-colors ${selected?.id === req.id ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-sm text-gray-900 truncate">{req.name}</span>
                      {req.status === 'new' && (
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500" title="New" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mb-1">
                      {SERVICE_ICONS[req.service_type] || '🔧'} {req.service_type}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{req.phone}</span>
                      {req.preferred_date && <span>📅 {fmt(req.preferred_date)}</span>}
                    </div>
                  </div>
                  <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[req.status] || STATUS_COLORS.new}`}>
                    {req.status}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Embed tip */}
        <div className="px-4 py-3 bg-blue-50 border-t border-blue-100">
          <p className="text-xs text-blue-700 font-medium mb-1">Website Embed Code</p>
          <code className="text-xs text-blue-600 break-all">
            {'<iframe src="http://localhost:3000/service-request" width="100%" height="700" frameborder="0"></iframe>'}
          </code>
        </div>
      </div>

      {/* ── Right panel: detail ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {!selected ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
            <div className="text-5xl">📋</div>
            <p className="text-sm">Select a request to view details</p>
          </div>
        ) : (
          <div className="p-6 max-w-2xl">

            {/* Top bar */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selected.name}</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {SERVICE_ICONS[selected.service_type] || '🔧'} {selected.service_type}
                </p>
              </div>
              <span className={`text-sm px-3 py-1 rounded-full border font-semibold ${STATUS_COLORS[selected.status] || STATUS_COLORS.new}`}>
                {selected.status}
              </span>
            </div>

            {/* Contact card */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 font-medium mb-0.5">Phone</p>
                <a href={`tel:${selected.phone}`} className="text-sm font-semibold text-blue-600 hover:underline">
                  {selected.phone}
                </a>
              </div>
              {selected.email && (
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-0.5">Email</p>
                  <a href={`mailto:${selected.email}`} className="text-sm font-semibold text-blue-600 hover:underline truncate block">
                    {selected.email}
                  </a>
                </div>
              )}
              {selected.address && (
                <div className="col-span-2">
                  <p className="text-xs text-gray-400 font-medium mb-0.5">Property Address</p>
                  <p className="text-sm text-gray-800">{selected.address}</p>
                </div>
              )}
              {selected.preferred_date && (
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-0.5">Preferred Date</p>
                  <p className="text-sm font-medium text-gray-800">
                    {fmt(selected.preferred_date)}
                    {selected.preferred_time && <span className="text-gray-500"> at {fmtTime(selected.preferred_time)}</span>}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-400 font-medium mb-0.5">Submitted</p>
                <p className="text-sm text-gray-600">{fmt(selected.created_at)}</p>
              </div>
              {selected.work_order_number && (
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-0.5">Work Order</p>
                  <p className="text-sm font-semibold text-emerald-700">{selected.work_order_number}</p>
                </div>
              )}
            </div>

            {/* Description */}
            {selected.description && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
                <p className="text-xs text-gray-400 font-medium mb-1">Client Notes</p>
                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{selected.description}</p>
              </div>
            )}

            {/* Status actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
              <p className="text-xs text-gray-400 font-medium mb-3">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {['new', 'contacted', 'scheduled', 'completed', 'cancelled'].map(s => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selected.id, s)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                      selected.status === s
                        ? STATUS_COLORS[s] + ' opacity-100'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex gap-3">
              <a
                href={`tel:${selected.phone}`}
                className="flex-1 text-center py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Call Client
              </a>
              {selected.email && (
                <a
                  href={`mailto:${selected.email}?subject=Your Service Request — Building Care Solutions`}
                  className="flex-1 text-center py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  Email Client
                </a>
              )}
              <button
                onClick={() => deleteRequest(selected.id)}
                className="px-4 py-2.5 bg-red-50 text-red-700 text-sm font-semibold rounded-xl border border-red-200 hover:bg-red-100 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
