import React, { useState, useEffect } from 'react';
import { assembliesAPI } from '../api-client';
import { Plus, Trash2, ChevronDown, ChevronRight, Edit2, Save, X, Package, Copy } from 'lucide-react';

const UNITS = ['SF','LF','CF','EA','HR','Day','LS','Ton','CY','LB'];

const DEFAULT_ASSEMBLY = {
  name: '',
  category: 'Water Mitigation',
  description: '',
  items: [],
};

const DEFAULT_ITEM = {
  description: '',
  unit: 'SF',
  unit_price: '',
  qty_formula: 'area',
  category: '',
};

const CATEGORIES = [
  'Water Mitigation','Mold Remediation','Fire Restoration','Smoke Restoration',
  'Drywall','Flooring','Carpentry','Equipment','Contents','General',
];

const FORMULA_HINTS = [
  { label: 'Fixed qty',     value: '1' },
  { label: 'Floor area',    value: 'area' },
  { label: 'Perimeter',     value: 'perimeter' },
  { label: 'Volume (CF)',   value: 'volume' },
  { label: '4\' wall demo', value: 'perimeter * 4' },
  { label: 'Per 150 SF',    value: 'Math.ceil(area / 150)' },
];

const fmt = n => `$${parseFloat(n || 0).toFixed(2)}`;

export default function AssembliesView() {
  const [assemblies,   setAssemblies]   = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [expanded,     setExpanded]     = useState({});
  const [editing,      setEditing]      = useState(null);  // assembly obj being edited
  const [isNew,        setIsNew]        = useState(false);
  const [saving,       setSaving]       = useState(false);

  // Preview explode
  const [previewId,    setPreviewId]    = useState(null);
  const [previewCtx,   setPreviewCtx]   = useState({ room_area: 200, room_perimeter: 60, room_volume: 1600 });
  const [previewResult,setPreviewResult]= useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try { setAssemblies(await assembliesAPI.getAll()); } catch (_) {}
    setLoading(false);
  };

  const toggle = id => setExpanded(e => ({ ...e, [id]: !e[id] }));

  const startNew = () => {
    setEditing({ ...DEFAULT_ASSEMBLY, items: [] });
    setIsNew(true);
  };

  const startEdit = (a) => {
    setEditing(JSON.parse(JSON.stringify(a)));
    setIsNew(false);
  };

  const cancelEdit = () => { setEditing(null); setIsNew(false); };

  const addItem = () => setEditing(e => ({ ...e, items: [...e.items, { ...DEFAULT_ITEM }] }));

  const removeItem = i => setEditing(e => ({ ...e, items: e.items.filter((_, idx) => idx !== i) }));

  const updateItem = (i, field, val) => setEditing(e => ({
    ...e,
    items: e.items.map((it, idx) => idx === i ? { ...it, [field]: val } : it),
  }));

  const save = async () => {
    if (!editing.name.trim()) return;
    setSaving(true);
    try {
      if (isNew) {
        await assembliesAPI.create(editing);
      } else {
        await assembliesAPI.update(editing.id, editing);
      }
      await load();
      setEditing(null);
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const del = async (id) => {
    if (!window.confirm('Delete this assembly?')) return;
    await assembliesAPI.delete(id);
    setAssemblies(a => a.filter(x => x.id !== id));
  };

  const duplicate = async (a) => {
    const copy = { ...a, name: a.name + ' (copy)', items: a.items };
    const created = await assembliesAPI.create(copy);
    setAssemblies(prev => [...prev, created]);
  };

  const runPreview = async () => {
    try {
      const r = await assembliesAPI.explode(previewId, previewCtx);
      setPreviewResult(r);
    } catch (_) {}
  };

  // Group by category
  const groups = assemblies.reduce((acc, a) => {
    const cat = a.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(a);
    return acc;
  }, {});

  return (
    <div className="p-4 space-y-4 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
        <div className="flex items-center gap-3">
          <Package size={16} className="text-blue-600" />
          <h1 className="text-base font-bold text-gray-800">Assemblies</h1>
          <span className="text-xs text-gray-400">{assemblies.length} packages</span>
        </div>
        <button
          onClick={startNew}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={13} /> New Assembly
        </button>
      </div>

      {/* Edit / Create form */}
      {editing && (
        <div className="bg-white border border-blue-200 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">{isNew ? 'New Assembly' : `Edit: ${editing.name}`}</h2>
            <button onClick={cancelEdit}><X size={18} className="text-gray-400 hover:text-gray-600" /></button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Assembly Name *</label>
              <input
                value={editing.name}
                onChange={e => setEditing(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Water Damage Room Package"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Category</label>
              <select
                value={editing.category}
                onChange={e => setEditing(p => ({ ...p, category: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Line items */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-600">Line Items</label>
              <button
                onClick={addItem}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold"
              >
                <Plus size={12} /> Add Item
              </button>
            </div>

            {editing.items.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">
                No items yet — click "Add Item" to start
              </p>
            )}

            <div className="space-y-2">
              {editing.items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-start bg-gray-50 rounded-lg p-3">
                  {/* Description */}
                  <div className="col-span-4">
                    {i === 0 && <label className="text-[10px] text-gray-400 mb-1 block">Description</label>}
                    <input
                      value={item.description}
                      onChange={e => updateItem(i, 'description', e.target.value)}
                      placeholder="Item description"
                      className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  {/* Unit */}
                  <div className="col-span-1">
                    {i === 0 && <label className="text-[10px] text-gray-400 mb-1 block">Unit</label>}
                    <select
                      value={item.unit}
                      onChange={e => updateItem(i, 'unit', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {UNITS.map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                  {/* Unit Price */}
                  <div className="col-span-2">
                    {i === 0 && <label className="text-[10px] text-gray-400 mb-1 block">Unit Price</label>}
                    <input
                      type="number"
                      value={item.unit_price}
                      onChange={e => updateItem(i, 'unit_price', e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  {/* Qty Formula */}
                  <div className="col-span-4">
                    {i === 0 && <label className="text-[10px] text-gray-400 mb-1 block">Qty Formula (area / perimeter / volume / fixed #)</label>}
                    <div className="flex gap-1">
                      <input
                        value={item.qty_formula}
                        onChange={e => updateItem(i, 'qty_formula', e.target.value)}
                        placeholder="area"
                        className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      />
                      <select
                        onChange={e => { if (e.target.value) updateItem(i, 'qty_formula', e.target.value); e.target.value = ''; }}
                        className="px-1 py-1.5 text-xs border border-gray-300 rounded focus:outline-none"
                        defaultValue=""
                      >
                        <option value="">hints</option>
                        {FORMULA_HINTS.map(h => <option key={h.value} value={h.value}>{h.label}</option>)}
                      </select>
                    </div>
                  </div>
                  {/* Delete */}
                  <div className="col-span-1 flex items-end justify-center">
                    {i === 0 && <div className="mb-1 h-3" />}
                    <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600 py-1.5">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button onClick={cancelEdit} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button
              onClick={save}
              disabled={saving || !editing.name.trim()}
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save size={14} /> {saving ? 'Saving…' : 'Save Assembly'}
            </button>
          </div>
        </div>
      )}

      {/* Preview explode */}
      {previewId && (
        <div className="bg-white border border-green-200 rounded-xl p-5 shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 text-sm">Preview — Explode into Line Items</h3>
            <button onClick={() => { setPreviewId(null); setPreviewResult(null); }}><X size={16} className="text-gray-400" /></button>
          </div>
          <div className="flex gap-3 mb-3">
            {[['Room Area (SF)', 'room_area'], ['Perimeter (LF)', 'room_perimeter'], ['Volume (CF)', 'room_volume']].map(([label, key]) => (
              <div key={key}>
                <label className="text-xs text-gray-500 block mb-1">{label}</label>
                <input
                  type="number"
                  value={previewCtx[key]}
                  onChange={e => setPreviewCtx(c => ({ ...c, [key]: e.target.value }))}
                  className="w-24 px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            ))}
            <div className="flex items-end">
              <button
                onClick={runPreview}
                className="px-3 py-1.5 text-xs bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
              >
                Calculate
              </button>
            </div>
          </div>
          {previewResult && (
            <table className="w-full text-xs">
              <thead><tr className="bg-gray-100">
                <th className="text-left px-3 py-1.5 text-gray-500">Description</th>
                <th className="text-right px-3 py-1.5 text-gray-500">Qty</th>
                <th className="text-right px-3 py-1.5 text-gray-500">Unit</th>
                <th className="text-right px-3 py-1.5 text-gray-500">Unit Price</th>
                <th className="text-right px-3 py-1.5 text-gray-500">Subtotal</th>
              </tr></thead>
              <tbody>
                {previewResult.items.map((it, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="px-3 py-1.5 text-gray-800">{it.description}</td>
                    <td className="px-3 py-1.5 text-right">{it.qty}</td>
                    <td className="px-3 py-1.5 text-right text-gray-500">{it.unit}</td>
                    <td className="px-3 py-1.5 text-right">{fmt(it.unit_price)}</td>
                    <td className="px-3 py-1.5 text-right font-semibold text-gray-800">{fmt(it.subtotal)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-gray-300 bg-gray-50">
                  <td colSpan={4} className="px-3 py-2 font-bold text-gray-700 text-right">TOTAL</td>
                  <td className="px-3 py-2 font-bold text-blue-700 text-right">
                    {fmt(previewResult.items.reduce((s, i) => s + i.subtotal, 0))}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Assembly list grouped by category */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading assemblies…</div>
      ) : assemblies.length === 0 ? (
        <div className="text-center py-12">
          <Package size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No assemblies yet</p>
          <p className="text-sm text-gray-400 mt-1">Create packages of line items to quickly add to estimates</p>
          <button onClick={startNew} className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">
            Create First Assembly
          </button>
        </div>
      ) : (
        Object.entries(groups).map(([cat, list]) => (
          <div key={cat} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">{cat}</span>
              <span className="text-xs text-gray-400">({list.length})</span>
            </div>
            <div className="divide-y divide-gray-100">
              {list.map(a => (
                <div key={a.id}>
                  {/* Assembly row */}
                  <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                    <button onClick={() => toggle(a.id)} className="text-gray-400 hover:text-gray-600">
                      {expanded[a.id] ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{a.name}</p>
                      {a.description && <p className="text-xs text-gray-400 truncate">{a.description}</p>}
                    </div>
                    <span className="text-xs text-gray-400">{a.items.length} items</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => { setPreviewId(a.id); setPreviewResult(null); }}
                        title="Preview"
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-xs font-semibold"
                      >
                        Preview
                      </button>
                      <button onClick={() => duplicate(a)} title="Duplicate" className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Copy size={14} />
                      </button>
                      <button onClick={() => startEdit(a)} title="Edit" className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => del(a.id)} title="Delete" className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded item list */}
                  {expanded[a.id] && (
                    <div className="bg-gray-50 border-t border-gray-100 px-4 py-3">
                      <table className="w-full text-xs">
                        <thead><tr>
                          <th className="text-left text-gray-500 pb-1 font-semibold">Description</th>
                          <th className="text-right text-gray-500 pb-1 font-semibold w-16">Unit</th>
                          <th className="text-right text-gray-500 pb-1 font-semibold w-24">Unit Price</th>
                          <th className="text-right text-gray-500 pb-1 font-semibold w-32">Qty Formula</th>
                        </tr></thead>
                        <tbody className="divide-y divide-gray-100">
                          {a.items.map((it, i) => (
                            <tr key={i}>
                              <td className="py-1.5 text-gray-700">{it.description}</td>
                              <td className="py-1.5 text-right text-gray-500">{it.unit}</td>
                              <td className="py-1.5 text-right text-gray-700">{fmt(it.unit_price)}</td>
                              <td className="py-1.5 text-right font-mono text-blue-600">{it.qty_formula}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
