import React, { useState, useEffect, useMemo } from 'react';
import { clientsAPI, estimatesAPI } from '../api-client';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const PriceListView = () => {
  const [priceList, setPriceList] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    fetchPriceList();
    clientsAPI.getAll().then(setClients).catch(() => {});
  }, [searchTerm, selectedCategory]);

  const fetchPriceList = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/price-list?active=true`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      if (selectedCategory) url += `&category=${encodeURIComponent(selectedCategory)}`;
      const res = await fetch(url);
      const data = await res.json();
      setPriceList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching price list:', err);
    }
    setLoading(false);
  };

  const categories = useMemo(() => {
    const cats = [...new Set(priceList.map(i => i.category).filter(Boolean))];
    return cats.sort();
  }, [priceList]);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQty = (id, qty) => {
    const n = parseFloat(qty) || 0;
    if (n <= 0) {
      setCart(prev => prev.filter(c => c.id !== id));
    } else {
      setCart(prev => prev.map(c => c.id === id ? { ...c, quantity: n } : c));
    }
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(c => c.id !== id));

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, c) => sum + (parseFloat(c.unit_price) || 0) * c.quantity, 0);
    const overhead = subtotal * 0.10;
    const profit = (subtotal + overhead) * 0.12;
    const grand = subtotal + overhead + profit;
    const tax = grand * 0.0875;
    return { subtotal, overhead, profit, grand, total: grand + tax };
  }, [cart]);

  const handleSaveQuote = async () => {
    if (!selectedClientId) { alert('Select a client first.'); return; }
    if (cart.length === 0) { alert('Add items to the cart first.'); return; }
    setSaving(true);
    try {
      const estimate = await estimatesAPI.create({
        client_id: selectedClientId,
        title: 'Quote from Price List',
        status: 'draft',
        subtotal: totals.subtotal,
        total_amount: totals.total,
        tax_rate: 8.75,
        tax_amount: totals.total - totals.grand,
      });
      setSaveMessage(`Quote #${estimate.estimate_number} saved.`);
      setCart([]);
      setTimeout(() => setSaveMessage(''), 4000);
    } catch (err) {
      console.error('Error saving quote:', err);
      alert('Failed to save quote.');
    }
    setSaving(false);
  };

  const filtered = priceList.filter(item => {
    const q = searchTerm.toLowerCase();
    return (!q || item.item_name?.toLowerCase().includes(q) || item.xactimate_code?.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q))
      && (!selectedCategory || item.category === selectedCategory);
  });

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900">
      {/* LEFT — Catalog browser */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">Price Catalog</h2>
          <p className="text-sm text-gray-500">Click any row to add it to your quote builder.</p>
        </div>

        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by code, name, or description..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-gray-400">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-400">No items found.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Code</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Item</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Unit</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Unit Price</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr
                    key={item.id}
                    onClick={() => addToCart(item)}
                    className="border-t border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">{item.xactimate_code || '—'}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{item.item_name}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{item.category || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{item.unit}</td>
                    <td className="px-4 py-3 text-right font-semibold text-green-700 dark:text-green-400">
                      ${parseFloat(item.unit_price || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* RIGHT — Cart / Quote builder */}
      <div className="w-96 flex flex-col border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 overflow-hidden">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">Quote Builder</h3>
        <p className="text-xs text-gray-400 mb-4">{cart.length} item{cart.length !== 1 ? 's' : ''} selected</p>

        {/* Client selector */}
        <select
          value={selectedClientId}
          onChange={e => setSelectedClientId(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">— Select Client —</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              <div className="text-4xl mb-2">🛒</div>
              Click items on the left to add them here.
            </div>
          ) : cart.map(item => (
            <div key={item.id} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 dark:text-gray-100 text-sm truncate">{item.item_name}</p>
                <p className="text-xs text-gray-400">${parseFloat(item.unit_price || 0).toFixed(2)} / {item.unit}</p>
              </div>
              <input
                type="number"
                min="0"
                step="0.5"
                value={item.quantity}
                onChange={e => updateQty(item.id, e.target.value)}
                className="w-16 text-center px-1 py-1 text-sm border border-gray-300 dark:border-gray-500 rounded bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100"
              />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 w-16 text-right">
                ${(parseFloat(item.unit_price || 0) * item.quantity).toFixed(2)}
              </p>
              <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 text-lg leading-none ml-1">×</button>
            </div>
          ))}
        </div>

        {/* Totals */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-1 text-sm mb-4">
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${totals.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Overhead (10%)</span><span>${totals.overhead.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Profit (12%)</span><span>${totals.profit.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Tax (8.75%)</span><span>${(totals.total - totals.grand).toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-gray-800 dark:text-gray-100 text-base border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
              <span>Total</span>
              <span className="text-green-600 dark:text-green-400">${totals.total.toFixed(2)}</span>
            </div>
          </div>
        )}

        {saveMessage && (
          <div className="mb-3 px-3 py-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm">{saveMessage}</div>
        )}

        <button
          onClick={handleSaveQuote}
          disabled={saving || cart.length === 0}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
        >
          {saving ? 'Saving...' : '💾 Save as Quote'}
        </button>
        {cart.length > 0 && (
          <button
            onClick={() => setCart([])}
            className="w-full mt-2 py-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Clear cart
          </button>
        )}
      </div>
    </div>
  );
};

export default PriceListView;
