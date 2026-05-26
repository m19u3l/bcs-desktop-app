import { useEffect, useState } from 'react';
import { dashboardAPI, notesAPI, clientsAPI, messagingAPI, emailAPI } from '../api-client';
import { useAPI } from '../hooks/useAPI';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// ── BCS Pre-built Marketing Templates ──────────────────────────────────────
const MARKETING_TEMPLATES = [
  {
    id: 'free-inspection',
    category: 'Promotion',
    name: 'Free Inspection Offer',
    type: 'sms',
    icon: '🔍',
    body: `Hi {name}, this is Building Care Solutions. We're offering FREE water damage inspections this month in San Diego County. No cost, no obligation. Call (866) 982-4796 or reply SCHEDULE. -BCS`,
  },
  {
    id: 'emergency-247',
    category: 'Emergency',
    name: '24/7 Emergency Response',
    type: 'sms',
    icon: '🚨',
    body: `Hi {name}, reminder: BCS is available 24/7 for emergency water damage response in San Diego County. IICRC certified, licensed & insured. Save our number: (866) 982-4796. -Building Care Solutions`,
  },
  {
    id: 'post-job-followup',
    category: 'Follow-Up',
    name: 'Post-Job Follow-Up',
    type: 'sms',
    icon: '🤝',
    body: `Hi {name}, thank you for choosing Building Care Solutions! We hope your restoration went smoothly. If you have any questions or concerns, please reply or call (866) 982-4796. We appreciate your trust. -BCS`,
  },
  {
    id: 'review-request',
    category: 'Follow-Up',
    name: '5-Star Review Request',
    type: 'sms',
    icon: '⭐',
    body: `Hi {name}! It was a pleasure working with you. If you're happy with BCS's work, would you mind leaving us a quick Google review? It takes 30 seconds and helps us serve more San Diego families. Thank you! — (866) 982-4796`,
  },
  {
    id: 'storm-season',
    category: 'Seasonal',
    name: 'Storm Season Alert',
    type: 'sms',
    icon: '⛈️',
    body: `Hi {name}, storm season is here! BCS offers FREE pre-storm property inspections in San Diego County. Don't wait for damage — call (866) 982-4796 today. IICRC certified water damage experts. -BCS`,
  },
  {
    id: 'insurance-claims',
    category: 'Insurance',
    name: 'Insurance Claim Help',
    type: 'sms',
    icon: '📋',
    body: `Hi {name}, navigating insurance claims after property damage is stressful. BCS works directly with your adjuster and manages the entire claims process. Call (866) 982-4796 — we handle it for you. -Building Care Solutions`,
  },
  {
    id: 'payment-reminder',
    category: 'Billing',
    name: 'Payment Reminder',
    type: 'sms',
    icon: '💳',
    body: `Hi {name}, this is Building Care Solutions. You have a balance on your account. Please call (866) 982-4796 or reply to this message to arrange payment. Thank you for your business.`,
  },
  {
    id: 'estimate-followup',
    category: 'Sales',
    name: 'Estimate Follow-Up',
    type: 'sms',
    icon: '📄',
    body: `Hi {name}, this is BCS following up on the estimate we prepared for you. Do you have any questions? We'd love to review it together. Call (866) 982-4796 or reply here. Ready to start when you are!`,
  },
  {
    id: 'winter-prep',
    category: 'Seasonal',
    name: 'Winter Property Prep',
    type: 'sms',
    icon: '🌧️',
    body: `Hi {name}, before the rainy season hits San Diego, make sure your property is protected. BCS offers FREE inspections for potential water intrusion points. Call (866) 982-4796. -Building Care Solutions`,
  },
  {
    id: 'referral-program',
    category: 'Promotion',
    name: 'Referral Program',
    type: 'sms',
    icon: '🎁',
    body: `Hi {name}! Know someone who needs water damage or mold services in San Diego? Refer them to BCS and we'll take care of them like family. Call (866) 982-4796. Licensed, IICRC certified. -BCS`,
  },
  {
    id: 'mold-awareness',
    category: 'Education',
    name: 'Mold Awareness Email',
    type: 'email',
    icon: '🔬',
    subject: 'Is Hidden Mold Affecting Your San Diego Home? — Building Care Solutions',
    body: `Dear {name},

Hidden mold is one of the most overlooked threats to San Diego properties — especially after any water intrusion event. Mold can begin growing within 24–48 hours of moisture exposure.

Signs you may have a problem:
• Musty odor in any room
• Visible discoloration on walls or ceilings
• Recent water damage, flooding, or plumbing leak
• Allergy symptoms that worsen when you're home

Building Care Solutions offers FREE mold assessments for San Diego County homeowners. Our IICRC-certified team will inspect your property and provide a detailed written report at no cost to you.

Call us at (866) 982-4796 or reply to this email to schedule your free assessment.

Sincerely,
Building Care Solutions
(866) 982-4796 | sd-bcs.com
Licensed California Contractor · IICRC Certified · $2M Liability Insurance`,
  },
  {
    id: 'seasonal-promo-email',
    category: 'Promotion',
    name: 'Seasonal Promotion Email',
    type: 'email',
    icon: '🎯',
    subject: 'Exclusive Offer for San Diego Property Owners — Building Care Solutions',
    body: `Dear {name},

As a valued client of Building Care Solutions, we want to extend a special offer just for you.

This month only:
✅ FREE water damage inspection (a $250 value)
✅ Priority scheduling for all restoration services
✅ 10% discount on mold remediation

BCS has proudly served San Diego County with IICRC-certified water damage restoration, mold remediation, and full reconstruction services. We carry $2 million in liability insurance and work directly with your insurance adjuster.

Don't let small damage become a big problem. Call (866) 982-4796 today or visit sd-bcs.com.

Best regards,
The Building Care Solutions Team
(866) 982-4796 | mig.buildingcaresolutions@gmail.com`,
  },
  {
    id: 'reactivation-email',
    category: 'Follow-Up',
    name: 'Past Client Reactivation',
    type: 'email',
    icon: '🔄',
    subject: 'We Miss You — Building Care Solutions Has New Services Available',
    body: `Dear {name},

It's been a while since we last worked together, and we wanted to reach out to let you know about some exciting updates at Building Care Solutions.

What's new at BCS:
• Expanded reconstruction services for post-restoration finishing
• Same-day moisture assessments
• Sketch & floor plan documentation for insurance claims
• Digital invoicing and real-time job tracking

Whether you have current damage or want a free preventive inspection, we're here to help.

Call (866) 982-4796 or reply to this email — we'd love to hear from you.

Warmly,
Building Care Solutions
San Diego County · Licensed · IICRC Certified`,
  },
];

// ──────────────────────────────────────────────────────────────────────────

export default function ImprovedDashboardView({ onNavigate }) {
  const { data: stats, loading, execute: fetchStats } = useAPI(dashboardAPI.getStats, true);

  const [workOrders, setWorkOrders]           = useState([]);
  const [estimates, setEstimates]             = useState([]);
  const [invoices, setInvoices]               = useState([]);
  const [jobs, setJobs]                       = useState([]);
  const [clients, setClients]                 = useState([]);
  const [recentActivity, setRecentActivity]   = useState([]);
  const [recentPayments, setRecentPayments]   = useState([]);
  const [pastDueInvoices, setPastDueInvoices] = useState([]);
  const [notes, setNotes]                     = useState([]);

  const [activeTab, setActiveTab]     = useState('projects');
  const [selectedRow, setSelectedRow] = useState(null);
  const [filterText, setFilterText]   = useState('');
  const [refreshing, setRefreshing]   = useState(false);
  const [newNote, setNewNote]         = useState('');

  // Messages state
  const [msgMode, setMsgMode]                         = useState('quicksms');
  const [smsTo, setSmsTo]                             = useState('');
  const [smsMessage, setSmsMessage]                   = useState('');
  const [bulkMessage, setBulkMessage]                 = useState('');
  const [bulkSelectedClients, setBulkSelectedClients] = useState([]);
  const [emailTo, setEmailTo]                         = useState('');
  const [emailSubject, setEmailSubject]               = useState('');
  const [emailBody, setEmailBody]                     = useState('');
  const [templateFilter, setTemplateFilter]           = useState('All');
  const [sending, setSending]                         = useState(false);
  const [sendResult, setSendResult]                   = useState(null);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const [wo, est, inv, j, cl, activity, payments, pastDue, notesList] = await Promise.all([
        fetch(`${API_BASE}/work-orders`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/estimates`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/invoices`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/job-tracking`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/clients`).then(r => r.json()).catch(() => []),
        dashboardAPI.getRecentActivity().catch(() => []),
        dashboardAPI.getRecentPayments().catch(() => []),
        dashboardAPI.getPastDueInvoices().catch(() => []),
        notesAPI.getAll().catch(() => []),
      ]);
      setWorkOrders(Array.isArray(wo)       ? wo       : []);
      setEstimates(Array.isArray(est)       ? est      : []);
      setInvoices(Array.isArray(inv)        ? inv      : []);
      setJobs(Array.isArray(j)              ? j        : []);
      setClients(Array.isArray(cl)          ? cl       : []);
      setRecentActivity(Array.isArray(activity) ? activity : []);
      setRecentPayments(Array.isArray(payments) ? payments : []);
      setPastDueInvoices(Array.isArray(pastDue) ? pastDue  : []);
      setNotes(Array.isArray(notesList)     ? notesList : []);
    } catch (err) {
      console.error('Dashboard load error:', err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setSelectedRow(null);
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

  // ── Send handlers ──────────────────────────────────────────────────────

  const handleQuickSMS = async () => {
    if (!smsTo.trim() || !smsMessage.trim()) return;
    setSending(true); setSendResult(null);
    try {
      const res = await fetch(`${API_BASE}/sms/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: smsTo, message: smsMessage }),
      });
      const data = await res.json();
      setSendResult(data.success ? { ok: true, msg: 'SMS sent!' } : { ok: false, msg: data.error || 'Failed to send' });
      if (data.success) { setSmsTo(''); setSmsMessage(''); }
    } catch {
      setSendResult({ ok: false, msg: 'Network error' });
    }
    setSending(false);
  };

  const handleBulkSMS = async () => {
    if (!bulkMessage.trim() || bulkSelectedClients.length === 0) return;
    setSending(true); setSendResult(null);
    try {
      const phones = bulkSelectedClients
        .map(id => clients.find(c => c.id === id))
        .map(c => c?.phone || c?.phone_number || '')
        .filter(Boolean);
      await messagingAPI.sendBulkSMS({ phones, message: bulkMessage });
      setSendResult({ ok: true, msg: `Sent to ${phones.length} recipient${phones.length !== 1 ? 's' : ''}` });
      setBulkSelectedClients([]); setBulkMessage('');
    } catch {
      setSendResult({ ok: false, msg: 'Failed to send bulk SMS' });
    }
    setSending(false);
  };

  const handleEmail = async () => {
    if (!emailTo.trim() || !emailSubject.trim() || !emailBody.trim()) return;
    setSending(true); setSendResult(null);
    try {
      await emailAPI.sendEmail({ to: emailTo, subject: emailSubject, html: emailBody.replace(/\n/g, '<br>') });
      setSendResult({ ok: true, msg: 'Email sent!' });
      setEmailTo(''); setEmailSubject(''); setEmailBody('');
    } catch {
      setSendResult({ ok: false, msg: 'Failed to send email' });
    }
    setSending(false);
  };

  const applyTemplate = (t) => {
    if (t.type === 'sms') {
      setMsgMode('quicksms');
      setSmsMessage(t.body.replace(/{name}/g, ''));
    } else {
      setMsgMode('email');
      setEmailSubject(t.subject || '');
      setEmailBody(t.body.replace(/{name}/g, ''));
    }
    setSendResult(null);
  };

  // ── Computed values ────────────────────────────────────────────────────

  const fmt$ = v => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v || 0);
  const fmtDate = d => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  const d = stats || {};
  const activeJobs  = d.active_jobs       ?? workOrders.filter(w => w.status === 'in_progress').length;
  const pendingEst  = d.pending_estimates ?? estimates.filter(e => e.status === 'pending').length;
  const invoicesDue = d.pending_invoices  ?? pastDueInvoices.length;
  const openClaims  = d.open_claims       ?? workOrders.filter(w => w.status !== 'completed').length;

  const tabs = [
    { id: 'projects',  label: 'Projects',   count: workOrders.length },
    { id: 'estimates', label: 'Estimates',  count: estimates.length  },
    { id: 'invoices',  label: 'Invoices',   count: invoices.length   },
    { id: 'jobs',      label: 'Jobs',       count: jobs.length       },
    { id: 'messages',  label: '📨 Messages', count: null              },
  ];

  const statCards = [
    { label: 'Active Jobs',       value: activeJobs,  color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100',   nav: 'jobtracking' },
    { label: 'Pending Estimates', value: pendingEst,  color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-100',  nav: 'estimates'   },
    { label: 'Invoices Due',      value: invoicesDue, color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-100',    nav: 'invoices'    },
    { label: 'Open Work Orders',  value: openClaims,  color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', nav: 'workorders'  },
  ];

  // Tab-specific table config
  const tabData = {
    projects: {
      rows: workOrders.filter(wo =>
        !filterText ||
        wo.work_order_number?.toLowerCase().includes(filterText.toLowerCase()) ||
        wo.client_name?.toLowerCase().includes(filterText.toLowerCase()) ||
        wo.title?.toLowerCase().includes(filterText.toLowerCase())
      ),
      cols: ['Project ID', 'Client', 'Title', 'Type', 'Status', 'Created'],
      renderRow: (r) => [
        <span className="font-mono text-xs font-semibold text-blue-700">{r.work_order_number || `WO-${r.id}`}</span>,
        <span className="text-zinc-800">{r.client_name || '—'}</span>,
        <span className="text-zinc-600 truncate max-w-[180px] block">{r.title || r.description || '—'}</span>,
        <span className="text-zinc-500 text-xs">{r.type || 'General'}</span>,
        <StatusBadge s={r.status} />,
        <span className="text-zinc-400 text-xs">{fmtDate(r.created_at)}</span>,
      ],
    },
    estimates: {
      rows: estimates.filter(e =>
        !filterText ||
        e.estimate_number?.toLowerCase().includes(filterText.toLowerCase()) ||
        e.client_name?.toLowerCase().includes(filterText.toLowerCase())
      ),
      cols: ['Estimate #', 'Client', 'Description', 'Amount', 'Status', 'Date'],
      renderRow: (r) => [
        <span className="font-mono text-xs font-semibold text-blue-700">{r.estimate_number || `EST-${r.id}`}</span>,
        <span className="text-zinc-800">{r.client_name || '—'}</span>,
        <span className="text-zinc-600 truncate max-w-[180px] block">{r.description || r.title || '—'}</span>,
        <span className="font-semibold text-zinc-800">{fmt$(r.total || r.amount)}</span>,
        <StatusBadge s={r.status} />,
        <span className="text-zinc-400 text-xs">{fmtDate(r.created_at)}</span>,
      ],
    },
    invoices: {
      rows: invoices.filter(inv =>
        !filterText ||
        inv.invoice_number?.toLowerCase().includes(filterText.toLowerCase()) ||
        inv.client_name?.toLowerCase().includes(filterText.toLowerCase())
      ),
      cols: ['Invoice #', 'Client', 'Amount', 'Due Date', 'Status', 'Created'],
      renderRow: (r) => [
        <span className="font-mono text-xs font-semibold text-blue-700">{r.invoice_number || `INV-${r.id}`}</span>,
        <span className="text-zinc-800">{r.client_name || '—'}</span>,
        <span className="font-semibold text-zinc-800">{fmt$(r.total || r.amount)}</span>,
        <span className="text-zinc-500 text-xs">{fmtDate(r.due_date)}</span>,
        <StatusBadge s={r.status} />,
        <span className="text-zinc-400 text-xs">{fmtDate(r.created_at)}</span>,
      ],
    },
    jobs: {
      rows: jobs.filter(j =>
        !filterText ||
        j.job_number?.toLowerCase().includes(filterText.toLowerCase()) ||
        j.client_name?.toLowerCase().includes(filterText.toLowerCase())
      ),
      cols: ['Job #', 'Client', 'Type', 'Assigned To', 'Status', 'Started'],
      renderRow: (r) => [
        <span className="font-mono text-xs font-semibold text-blue-700">{r.job_number || `JOB-${r.id}`}</span>,
        <span className="text-zinc-800">{r.client_name || '—'}</span>,
        <span className="text-zinc-500 text-xs">{r.job_type || r.type || 'General'}</span>,
        <span className="text-zinc-600">{r.assigned_to || r.employee_name || '—'}</span>,
        <StatusBadge s={r.status} />,
        <span className="text-zinc-400 text-xs">{fmtDate(r.start_date || r.created_at)}</span>,
      ],
    },
  };

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

  const currentData = tabData[activeTab];
  const templateCategories = ['All', ...new Set(MARKETING_TEMPLATES.map(t => t.category))];

  return (
    <div className="h-full flex flex-col bg-zinc-50 overflow-hidden">

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-4 gap-3 px-4 pt-3 shrink-0">
        {statCards.map(card => (
          <button
            key={card.label}
            onClick={() => onNavigate?.(card.nav)}
            className={`${card.bg} border ${card.border} rounded-xl p-3.5 text-left hover:shadow-md transition-shadow`}
          >
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">{card.label}</p>
            <p className={`text-3xl font-bold mt-0.5 ${card.color}`}>{card.value}</p>
          </button>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center border-b border-zinc-200 bg-white px-4 mt-3 shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSelectedRow(null); setFilterText(''); setSendResult(null); }}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-700'
            }`}
          >
            {tab.label}
            {tab.count !== null && (
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-zinc-100 text-zinc-500'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
        {activeTab !== 'messages' && (
          <div className="ml-auto flex items-center gap-2 pb-1">
            <input
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
              placeholder="Filter…"
              className="border border-zinc-300 rounded px-3 py-1 text-xs outline-none focus:ring-2 focus:ring-blue-500 w-44"
            />
            <button
              onClick={handleRefresh}
              className="text-xs text-zinc-500 hover:text-zinc-800 border border-zinc-200 rounded px-2 py-1 hover:bg-zinc-50"
            >
              {refreshing ? '…' : '↻'}
            </button>
          </div>
        )}
      </div>

      {/* ── Workspace ── */}
      <div className="flex-1 flex overflow-hidden px-4 pb-3 pt-3 gap-3 min-h-0">

        {activeTab === 'messages' ? (
          <MessagesPanel
            msgMode={msgMode} setMsgMode={setMsgMode}
            clients={clients}
            smsTo={smsTo} setSmsTo={setSmsTo}
            smsMessage={smsMessage} setSmsMessage={setSmsMessage}
            bulkMessage={bulkMessage} setBulkMessage={setBulkMessage}
            bulkSelectedClients={bulkSelectedClients} setBulkSelectedClients={setBulkSelectedClients}
            emailTo={emailTo} setEmailTo={setEmailTo}
            emailSubject={emailSubject} setEmailSubject={setEmailSubject}
            emailBody={emailBody} setEmailBody={setEmailBody}
            templateFilter={templateFilter} setTemplateFilter={setTemplateFilter}
            templateCategories={templateCategories}
            onQuickSMS={handleQuickSMS}
            onBulkSMS={handleBulkSMS}
            onEmail={handleEmail}
            onApplyTemplate={applyTemplate}
            sending={sending}
            sendResult={sendResult}
            setSendResult={setSendResult}
          />
        ) : (
          <>
            {/* ── Data Grid ── */}
            <div className="flex-1 bg-white rounded-xl border border-zinc-200 flex flex-col overflow-hidden shadow-sm">
              <div className="overflow-auto flex-1">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-50 border-b border-zinc-200 sticky top-0">
                    <tr className="text-left text-xs text-zinc-500 font-semibold uppercase tracking-wide">
                      {currentData.cols.map(col => (
                        <th key={col} className="px-4 py-2.5 whitespace-nowrap">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.rows.length === 0 ? (
                      <tr>
                        <td colSpan={currentData.cols.length} className="px-4 py-10 text-center text-zinc-400 text-sm">
                          No records found
                        </td>
                      </tr>
                    ) : currentData.rows.map(row => (
                      <tr
                        key={row.id}
                        onClick={() => setSelectedRow(row)}
                        className={`border-b border-zinc-100 cursor-pointer transition-colors ${
                          selectedRow?.id === row.id ? 'bg-blue-50' : 'hover:bg-zinc-50'
                        }`}
                      >
                        {currentData.renderRow(row).map((cell, i) => (
                          <td key={i} className="px-4 py-2.5">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Inspector + Activity + Notes ── */}
            <div className="w-80 flex flex-col gap-3 overflow-y-auto shrink-0">

              {/* Inspector */}
              <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm shrink-0">
                <h3 className="font-semibold text-zinc-800 text-sm mb-3">
                  {selectedRow ? 'Inspector' : 'Select a record'}
                </h3>
                {selectedRow ? (
                  <InspectorContent
                    row={selectedRow} tab={activeTab}
                    fmt$={fmt$} fmtDate={fmtDate}
                    onNavigate={onNavigate}
                  />
                ) : (
                  <p className="text-xs text-zinc-400">Click any row to inspect its details here.</p>
                )}
              </div>

              {/* Activity Feed */}
              <div className="flex-1 bg-white rounded-xl border border-zinc-200 flex flex-col overflow-hidden shadow-sm min-h-0" style={{ minHeight: 160 }}>
                <div className="border-b border-zinc-200 px-4 py-2.5 shrink-0">
                  <h3 className="font-semibold text-zinc-800 text-sm">Activity Feed</h3>
                </div>
                <div className="flex-1 overflow-auto p-3 space-y-2">
                  {recentActivity.length > 0 ? recentActivity.slice(0, 10).map((a, i) => (
                    <div key={i} className="border border-zinc-100 rounded-lg p-2.5 hover:bg-zinc-50">
                      <p className="text-xs font-medium text-zinc-700 leading-snug">{a.description || a.action || 'Activity'}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">{a.entity_type || ''} · {fmtDate(a.created_at)}</p>
                    </div>
                  )) : (
                    [
                      { text: 'No recent activity yet', sub: 'Actions will appear here' },
                      ...recentPayments.slice(0, 2).map(p => ({ text: `Payment: ${fmt$(p.amount)}`, sub: p.client_name || '' })),
                      ...pastDueInvoices.slice(0, 2).map(inv => ({ text: `Past due: ${inv.invoice_number}`, sub: `${inv.client_name} · ${fmt$(inv.amount)}` })),
                    ].map((item, i) => (
                      <div key={i} className="border border-zinc-100 rounded-lg p-2.5">
                        <p className="text-xs font-medium text-zinc-700">{item.text}</p>
                        {item.sub && <p className="text-xs text-zinc-400 mt-0.5">{item.sub}</p>}
                      </div>
                    ))
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
                <div className="space-y-1 max-h-24 overflow-auto">
                  {notes.slice(0, 5).map(n => (
                    <div key={n.id} className="text-xs text-zinc-600 bg-zinc-50 rounded px-2 py-1.5">
                      <span className="truncate block">{n.title || n.content}</span>
                    </div>
                  ))}
                  {notes.length === 0 && <p className="text-xs text-zinc-400">No notes yet</p>}
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Inspector panel content, tab-aware ────────────────────────────────────
function InspectorContent({ row, tab, fmt$, fmtDate, onNavigate }) {
  const navMap = { projects: 'workorders', estimates: 'estimates', invoices: 'invoices', jobs: 'jobtracking' };

  const fieldSets = {
    projects: [
      { label: 'Project ID', value: row.work_order_number || `WO-${row.id}`, mono: true },
      { label: 'Client',     value: row.client_name || '—' },
      { label: 'Type',       value: row.type || 'General' },
      { label: 'Status',     value: <StatusBadge s={row.status} /> },
      { label: 'Address',    value: row.address || '—' },
      { label: 'Created',    value: fmtDate(row.created_at) },
      row.amount > 0 ? { label: 'Amount', value: fmt$(row.amount) } : null,
    ].filter(Boolean),
    estimates: [
      { label: 'Estimate #', value: row.estimate_number || `EST-${row.id}`, mono: true },
      { label: 'Client',     value: row.client_name || '—' },
      { label: 'Status',     value: <StatusBadge s={row.status} /> },
      { label: 'Total',      value: fmt$(row.total || row.amount) },
      { label: 'Created',    value: fmtDate(row.created_at) },
      { label: 'Valid Until',value: fmtDate(row.expiry_date || row.valid_until) },
    ],
    invoices: [
      { label: 'Invoice #',  value: row.invoice_number || `INV-${row.id}`, mono: true },
      { label: 'Client',     value: row.client_name || '—' },
      { label: 'Status',     value: <StatusBadge s={row.status} /> },
      { label: 'Amount',     value: fmt$(row.total || row.amount) },
      { label: 'Due Date',   value: fmtDate(row.due_date) },
      { label: 'Created',    value: fmtDate(row.created_at) },
    ],
    jobs: [
      { label: 'Job #',      value: row.job_number || `JOB-${row.id}`, mono: true },
      { label: 'Client',     value: row.client_name || '—' },
      { label: 'Type',       value: row.job_type || row.type || 'General' },
      { label: 'Assigned',   value: row.assigned_to || row.employee_name || '—' },
      { label: 'Status',     value: <StatusBadge s={row.status} /> },
      { label: 'Started',    value: fmtDate(row.start_date || row.created_at) },
    ],
  };

  const fields = fieldSets[tab] || [];
  const navId  = navMap[tab];

  return (
    <div className="space-y-2.5 text-sm">
      {fields.map(f => (
        <div key={f.label}>
          <p className="text-xs text-zinc-400">{f.label}</p>
          <p className={`text-sm font-medium text-zinc-800 ${f.mono ? 'font-mono' : ''}`}>{f.value}</p>
        </div>
      ))}
      <div className="pt-2 flex gap-2">
        <button
          onClick={() => onNavigate?.(navId)}
          className="flex-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded py-1.5 font-medium transition-colors"
        >
          Open
        </button>
        {tab === 'projects' && (
          <button
            onClick={() => onNavigate?.('invoices')}
            className="flex-1 text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded py-1.5 font-medium transition-colors"
          >
            Invoice
          </button>
        )}
        {tab === 'estimates' && (
          <button
            onClick={() => onNavigate?.('workorders')}
            className="flex-1 text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded py-1.5 font-medium transition-colors"
          >
            → Work Order
          </button>
        )}
        {tab === 'invoices' && (
          <button
            onClick={() => onNavigate?.('payments')}
            className="flex-1 text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded py-1.5 font-medium transition-colors"
          >
            Record Payment
          </button>
        )}
      </div>
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────
function StatusBadge({ s }) {
  const map = {
    completed:   'bg-emerald-100 text-emerald-700',
    in_progress: 'bg-blue-100 text-blue-700',
    active:      'bg-blue-100 text-blue-700',
    pending:     'bg-yellow-100 text-yellow-700',
    approved:    'bg-emerald-100 text-emerald-700',
    sent:        'bg-purple-100 text-purple-700',
    paid:        'bg-emerald-100 text-emerald-700',
    overdue:     'bg-red-100 text-red-700',
    cancelled:   'bg-zinc-100 text-zinc-500',
    draft:       'bg-zinc-100 text-zinc-600',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${map[s] || 'bg-zinc-100 text-zinc-600'}`}>
      {s?.replace(/_/g, ' ') || 'pending'}
    </span>
  );
}

// ── Messages Panel ────────────────────────────────────────────────────────
function MessagesPanel({
  msgMode, setMsgMode,
  clients,
  smsTo, setSmsTo, smsMessage, setSmsMessage,
  bulkMessage, setBulkMessage, bulkSelectedClients, setBulkSelectedClients,
  emailTo, setEmailTo, emailSubject, setEmailSubject, emailBody, setEmailBody,
  templateFilter, setTemplateFilter, templateCategories,
  onQuickSMS, onBulkSMS, onEmail, onApplyTemplate,
  sending, sendResult, setSendResult,
}) {
  const filteredTemplates = templateFilter === 'All'
    ? MARKETING_TEMPLATES
    : MARKETING_TEMPLATES.filter(t => t.category === templateFilter);

  const toggleClient = (id) =>
    setBulkSelectedClients(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const modes = [
    { id: 'quicksms',  label: 'Quick SMS',  icon: '💬', desc: 'One number, one message' },
    { id: 'bulksms',   label: 'Bulk SMS',   icon: '📲', desc: 'Blast to multiple clients' },
    { id: 'email',     label: 'Email',      icon: '✉️',  desc: 'Single email send' },
    { id: 'marketing', label: 'Marketing',  icon: '📣', desc: 'Branded BCS templates' },
  ];

  return (
    <div className="flex-1 flex gap-3 overflow-hidden">

      {/* Mode selector */}
      <div className="w-44 flex flex-col gap-2 shrink-0">
        {modes.map(m => (
          <button
            key={m.id}
            onClick={() => { setMsgMode(m.id); setSendResult(null); }}
            className={`text-left p-3 rounded-xl border transition-all ${
              msgMode === m.id
                ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
            }`}
          >
            <div className="text-xl mb-1">{m.icon}</div>
            <div className="text-xs font-semibold leading-tight">{m.label}</div>
            <div className={`text-xs mt-0.5 leading-tight ${msgMode === m.id ? 'text-blue-100' : 'text-zinc-400'}`}>{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Compose area */}
      <div className="flex-1 bg-white rounded-xl border border-zinc-200 shadow-sm flex flex-col overflow-hidden">

        {/* Header */}
        <div className="border-b border-zinc-200 px-5 py-3 flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-semibold text-zinc-800 text-sm">
              {msgMode === 'quicksms'  && '💬 Quick SMS'}
              {msgMode === 'bulksms'   && '📲 Bulk SMS Blast'}
              {msgMode === 'email'     && '✉️ Send Email'}
              {msgMode === 'marketing' && '📣 Marketing & Promotions'}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Building Care Solutions · (866) 982-4796 · mig.buildingcaresolutions@gmail.com
            </p>
          </div>
          {sendResult && (
            <div className={`text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 ${
              sendResult.ok ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            }`}>
              {sendResult.ok ? '✓' : '✗'} {sendResult.msg}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-5">

          {/* ── Quick SMS ── */}
          {msgMode === 'quicksms' && (
            <div className="space-y-4 max-w-lg">
              <div>
                <label className="text-xs font-semibold text-zinc-600 block mb-1">Recipient Phone Number</label>
                <input
                  value={smsTo} onChange={e => setSmsTo(e.target.value)}
                  placeholder="+1 (619) 555-0100"
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-600 block mb-1">
                  Message <span className="text-zinc-400 font-normal">({smsMessage.length}/160 chars)</span>
                </label>
                <textarea
                  value={smsMessage} onChange={e => setSmsMessage(e.target.value)} rows={5}
                  placeholder="Type your message here…"
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="flex gap-2 items-center">
                <button
                  onClick={onQuickSMS}
                  disabled={sending || !smsTo.trim() || !smsMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
                >
                  {sending ? 'Sending…' : 'Send SMS'}
                </button>
                <button onClick={() => { setSmsTo(''); setSmsMessage(''); }} className="text-sm text-zinc-400 hover:text-zinc-700 px-3 py-2">
                  Clear
                </button>
              </div>

              {/* Quick template chips */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3">
                <p className="text-xs font-semibold text-zinc-500 mb-2">Quick Templates</p>
                <div className="flex flex-wrap gap-2">
                  {MARKETING_TEMPLATES.filter(t => t.type === 'sms').slice(0, 5).map(t => (
                    <button
                      key={t.id}
                      onClick={() => setSmsMessage(t.body.replace(/{name}/g, ''))}
                      className="text-xs bg-white hover:bg-blue-50 hover:text-blue-700 text-zinc-600 rounded-lg px-2.5 py-1.5 border border-zinc-200 transition-colors"
                    >
                      {t.icon} {t.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Bulk SMS ── */}
          {msgMode === 'bulksms' && (
            <div className="flex gap-4 h-full max-h-full">
              <div className="flex-1 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-600 block mb-1">
                    Message <span className="text-zinc-400 font-normal">({bulkMessage.length}/160 chars)</span>
                  </label>
                  <textarea
                    value={bulkMessage} onChange={e => setBulkMessage(e.target.value)} rows={7}
                    placeholder="Write your bulk message. Use {name} as a placeholder for the client's name."
                    className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={onBulkSMS}
                    disabled={sending || !bulkMessage.trim() || bulkSelectedClients.length === 0}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
                  >
                    {sending ? 'Sending…' : `Send to ${bulkSelectedClients.length} Client${bulkSelectedClients.length !== 1 ? 's' : ''}`}
                  </button>
                  <button onClick={() => setBulkSelectedClients(clients.map(c => c.id))} className="text-xs text-blue-600 hover:underline">
                    Select all
                  </button>
                  <button onClick={() => setBulkSelectedClients([])} className="text-xs text-zinc-400 hover:text-zinc-700">
                    Clear selection
                  </button>
                </div>
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3">
                  <p className="text-xs font-semibold text-zinc-500 mb-2">Load Template</p>
                  <div className="flex flex-wrap gap-2">
                    {MARKETING_TEMPLATES.filter(t => t.type === 'sms').map(t => (
                      <button
                        key={t.id}
                        onClick={() => setBulkMessage(t.body.replace(/{name}/g, ''))}
                        className="text-xs bg-white hover:bg-blue-50 hover:text-blue-700 text-zinc-600 rounded-lg px-2.5 py-1.5 border border-zinc-200 transition-colors"
                      >
                        {t.icon} {t.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Client checklist */}
              <div className="w-56 border border-zinc-200 rounded-xl overflow-hidden shrink-0 flex flex-col">
                <div className="bg-zinc-50 px-3 py-2.5 border-b border-zinc-200 text-xs font-semibold text-zinc-600">
                  Clients ({clients.length}) · {bulkSelectedClients.length} selected
                </div>
                <div className="flex-1 overflow-auto">
                  {clients.length === 0 ? (
                    <p className="text-xs text-zinc-400 p-3">No clients loaded</p>
                  ) : clients.map(c => (
                    <label key={c.id} className="flex items-center gap-2.5 px-3 py-2 hover:bg-zinc-50 cursor-pointer border-b border-zinc-100 last:border-0">
                      <input
                        type="checkbox"
                        checked={bulkSelectedClients.includes(c.id)}
                        onChange={() => toggleClient(c.id)}
                        className="rounded accent-blue-600 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-zinc-800 truncate">{c.name || c.company_name || '—'}</p>
                        <p className="text-xs text-zinc-400">{c.phone || c.phone_number || 'no phone'}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Email ── */}
          {msgMode === 'email' && (
            <div className="space-y-4 max-w-lg">
              <div>
                <label className="text-xs font-semibold text-zinc-600 block mb-1">To</label>
                <input
                  value={emailTo} onChange={e => setEmailTo(e.target.value)}
                  placeholder="client@example.com"
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-600 block mb-1">Subject</label>
                <input
                  value={emailSubject} onChange={e => setEmailSubject(e.target.value)}
                  placeholder="Email subject…"
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-600 block mb-1">Body</label>
                <textarea
                  value={emailBody} onChange={e => setEmailBody(e.target.value)} rows={9}
                  placeholder="Write your email…"
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="flex gap-2 items-center">
                <button
                  onClick={onEmail}
                  disabled={sending || !emailTo.trim() || !emailSubject.trim() || !emailBody.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
                >
                  {sending ? 'Sending…' : 'Send Email'}
                </button>
                <button
                  onClick={() => { setEmailTo(''); setEmailSubject(''); setEmailBody(''); }}
                  className="text-sm text-zinc-400 hover:text-zinc-700 px-3 py-2"
                >
                  Clear
                </button>
              </div>
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3">
                <p className="text-xs font-semibold text-zinc-500 mb-2">Email Templates</p>
                <div className="flex flex-wrap gap-2">
                  {MARKETING_TEMPLATES.filter(t => t.type === 'email').map(t => (
                    <button
                      key={t.id}
                      onClick={() => { setEmailSubject(t.subject || ''); setEmailBody(t.body.replace(/{name}/g, '')); }}
                      className="text-xs bg-white hover:bg-purple-50 hover:text-purple-700 text-zinc-600 rounded-lg px-2.5 py-1.5 border border-zinc-200 transition-colors"
                    >
                      {t.icon} {t.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Marketing Templates Library ── */}
          {msgMode === 'marketing' && (
            <div className="space-y-4">
              {/* Category filter */}
              <div className="flex gap-2 flex-wrap">
                {templateCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setTemplateFilter(cat)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                      templateFilter === cat
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Template grid */}
              <div className="grid grid-cols-2 gap-3">
                {filteredTemplates.map(t => (
                  <div
                    key={t.id}
                    className="bg-white border border-zinc-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{t.icon}</span>
                        <div>
                          <p className="text-xs font-semibold text-zinc-800 leading-tight">{t.name}</p>
                          <p className="text-xs text-zinc-400">{t.category}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                        t.type === 'sms' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {t.type === 'sms' ? 'SMS' : 'Email'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-3 line-clamp-3">
                      {t.type === 'email' ? t.subject : t.body}
                    </p>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onApplyTemplate(t)}
                        className="flex-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-1.5 font-semibold transition-colors"
                      >
                        Use Template
                      </button>
                      {t.type === 'sms' && (
                        <button
                          onClick={() => { setBulkMessage(t.body.replace(/{name}/g, '')); setMsgMode('bulksms'); }}
                          className="flex-1 text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg py-1.5 font-semibold transition-colors"
                        >
                          Bulk Send
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
