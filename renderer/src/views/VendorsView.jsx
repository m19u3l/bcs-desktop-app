import React, { useState, useEffect, useMemo } from 'react';
import { vendorsAPI } from '../api-client';
import { Button, Modal, Input, Textarea, Card } from '../components';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const TRADE_COLORS = {
  'Water Mitigation': 'bg-blue-100 text-blue-800 border-blue-200',
  'Drywall':          'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Roofing':          'bg-orange-100 text-orange-800 border-orange-200',
  'Plumbing':         'bg-cyan-100 text-cyan-800 border-cyan-200',
  'Electrical':       'bg-purple-100 text-purple-800 border-purple-200',
  'Flooring':         'bg-green-100 text-green-800 border-green-200',
};

const tradeBadge = (trade) => {
  const cls = TRADE_COLORS[trade] || 'bg-gray-100 text-gray-700 border-gray-200';
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>{trade || 'General'}</span>;
};

export const VendorsView = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [filterTrade, setFilterTrade] = useState('');
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    name: '', trade: '', contact_person: '', email: '', phone: '', address: '', services: '', notes: '',
  });

  const loadVendors = async () => {
    setLoading(true);
    try {
      const data = await vendorsAPI.getAll();
      setVendors(data || []);
    } catch (err) {
      console.error('Error loading vendors:', err);
    }
    setLoading(false);
  };

  useEffect(() => { loadVendors(); }, []);

  const trades = useMemo(() => [...new Set(vendors.map(v => v.trade).filter(Boolean))].sort(), [vendors]);

  const filtered = useMemo(() => vendors.filter(v => {
    const q = search.toLowerCase();
    return (!filterTrade || v.trade === filterTrade)
      && (!q || v.name?.toLowerCase().includes(q) || v.contact_person?.toLowerCase().includes(q) || v.services?.toLowerCase().includes(q));
  }), [vendors, filterTrade, search]);

  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach(v => {
      const key = v.trade || 'General';
      if (!groups[key]) groups[key] = [];
      groups[key].push(v);
    });
    return groups;
  }, [filtered]);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch(`${API_BASE}/vendors/seed`, { method: 'POST' });
      const data = await res.json();
      alert(data.message);
      await loadVendors();
    } catch (err) {
      alert('Seed failed: ' + err.message);
    }
    setSeeding(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVendor) {
        await vendorsAPI.update(editingVendor.id, formData);
      } else {
        await vendorsAPI.create(formData);
      }
      setIsModalOpen(false);
      resetForm();
      await loadVendors();
    } catch (err) {
      console.error('Error saving vendor:', err);
    }
  };

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name || '',
      trade: vendor.trade || '',
      contact_person: vendor.contact_person || '',
      email: vendor.email || '',
      phone: vendor.phone || '',
      address: vendor.address || '',
      services: vendor.services || '',
      notes: vendor.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vendor?')) return;
    try {
      await vendorsAPI.delete(id);
      await loadVendors();
    } catch (err) {
      console.error('Error deleting vendor:', err);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', trade: '', contact_person: '', email: '', phone: '', address: '', services: '', notes: '' });
    setEditingVendor(null);
  };

  const TRADE_OPTIONS = ['Water Mitigation', 'Drywall', 'Roofing', 'Plumbing', 'Electrical', 'Flooring', 'Painting', 'Concrete', 'HVAC', 'General'];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-2xl shadow-xl p-8 text-white mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">🏢 Vendor Directory</h1>
            <p className="text-slate-300">{vendors.length} vendors across {trades.length} trades</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {vendors.length < 10 && (
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="px-5 py-2.5 bg-green-500 hover:bg-green-600 disabled:bg-green-800 text-white rounded-lg font-semibold transition-colors text-sm"
              >
                {seeding ? 'Seeding...' : '⚡ Load Sample Vendors'}
              </button>
            )}
            <button
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="px-5 py-2.5 bg-white text-slate-800 hover:bg-slate-100 rounded-lg font-semibold transition-colors text-sm"
            >
              ➕ Add Vendor
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search vendors..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-48 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <select
          value={filterTrade}
          onChange={e => setFilterTrade(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="">All Trades</option>
          {trades.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading vendors...</div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-2">No vendors yet.</p>
          <p className="text-sm">Click "Load Sample Vendors" to populate with 30 San Diego-area subcontractors.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([trade, list]) => (
          <div key={trade} className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200">{trade}</h2>
              <span className="text-sm text-gray-400">{list.length} vendor{list.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {list.map(vendor => (
                <div key={vendor.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base truncate">{vendor.name}</h3>
                      {vendor.contact_person && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{vendor.contact_person}</p>
                      )}
                    </div>
                    {tradeBadge(vendor.trade)}
                  </div>

                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {vendor.phone && (
                      <p><span className="font-medium">📞</span> {vendor.phone}</p>
                    )}
                    {vendor.email && (
                      <p className="truncate"><span className="font-medium">✉️</span> {vendor.email}</p>
                    )}
                    {vendor.address && (
                      <p className="truncate"><span className="font-medium">📍</span> {vendor.address}</p>
                    )}
                    {vendor.services && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 italic mt-2 line-clamp-2">{vendor.services}</p>
                    )}
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => handleEdit(vendor)}
                      className="flex-1 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(vendor.id)}
                      className="flex-1 py-1.5 text-xs font-medium bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title={editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-x-4">
            <div className="col-span-2">
              <Input label="Company Name" name="name" value={formData.name} onChange={handleInputChange} required placeholder="ABC Supply Co." />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trade</label>
              <select
                name="trade"
                value={formData.trade}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              >
                <option value="">— Select Trade —</option>
                {TRADE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <Input label="Contact Person" name="contact_person" value={formData.contact_person} onChange={handleInputChange} placeholder="John Smith" />
            <Input label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="(619) 555-0100" />
            <Input label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="contact@vendor.com" />
            <Input label="Address" name="address" value={formData.address} onChange={handleInputChange} placeholder="123 Industrial Blvd, SD CA" />
            <div className="col-span-2">
              <Input label="Services Provided" name="services" value={formData.services} onChange={handleInputChange} placeholder="Plumbing, leak repair, repiping..." />
            </div>
            <div className="col-span-2">
              <Textarea label="Notes" name="notes" value={formData.notes} onChange={handleInputChange} rows={2} placeholder="Preferred rates, lead times, notes..." />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="secondary" onClick={() => { setIsModalOpen(false); resetForm(); }}>Cancel</Button>
            <Button type="submit">{editingVendor ? 'Update' : 'Add'} Vendor</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VendorsView;
