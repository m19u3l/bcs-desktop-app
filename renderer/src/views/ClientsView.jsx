import React, { useState, useEffect } from 'react';
import { clientsAPI } from '../api-client';
import { useCRUD } from '../hooks/useAPI';
import { Table, Button, Modal, Input, Card } from '../components';
import AttachmentsPanel from '../components/AttachmentsPanel';

export const ClientsView = () => {
  const { items: clients, loading, error, fetchAll, create, update, remove } = useCRUD(clientsAPI);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingClient, setViewingClient] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingClient) {
        await update(editingClient.id, formData);
      } else {
        await create(formData);
      }

      setIsModalOpen(false);
      resetForm();
      fetchAll();
    } catch (err) {
      console.error('Error saving client:', err);
    }
  };

  // Double-click to view
  const handleView = (client) => {
    setViewingClient(client);
    setIsViewModalOpen(true);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      company: client.company || '',
    });
    setIsModalOpen(true);
  };

  const handleEditFromView = () => {
    setIsViewModalOpen(false);
    handleEdit(viewingClient);
  };

  const handlePrint = () => {
    const printContent = `
      BUILDING CARE SOLUTIONS
      Client Information
      
      Name: ${viewingClient.name}
      Company: ${viewingClient.company || 'N/A'}
      Email: ${viewingClient.email}
      Phone: ${viewingClient.phone}
      Address: ${viewingClient.address || 'N/A'}
      
      Client ID: ${viewingClient.id}
      Created: ${new Date(viewingClient.created_at || Date.now()).toLocaleDateString()}
      
      ---
      Building Care Solutions
      8889 Caminito Plaza Centro, San Diego, CA 92122
      858-573-7849 | m19u3l@sd-bcs.com
    `;
    
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`<pre>${printContent}</pre>`);
    printWindow.document.close();
    printWindow.print();
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Building Care Solutions - Client Information: ${viewingClient.name}`);
    const body = encodeURIComponent(`
Dear ${viewingClient.name},

Thank you for choosing Building Care Solutions!

Your contact information on file:
- Email: ${viewingClient.email}
- Phone: ${viewingClient.phone}
- Address: ${viewingClient.address || 'N/A'}

If you need to update any information, please contact us.

Best regards,
Building Care Solutions
8889 Caminito Plaza Centro, San Diego, CA 92122
858-573-7849 | m19u3l@sd-bcs.com
    `);
    
    window.location.href = `mailto:${viewingClient.email}?subject=${subject}&body=${body}`;
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await remove(id);
        fetchAll();
      } catch (err) {
        console.error('Error deleting client:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      company: '',
    });
    setEditingClient(null);
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Company', accessor: 'company' },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="primary" onClick={() => handleView(row)}>
            👁️ View
          </Button>
          <Button size="sm" variant="secondary" onClick={() => handleEdit(row)}>
            ✏️ Edit
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)}>
            🗑️ Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 space-y-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Prominent Branding Header */}
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-base font-bold text-gray-800">👥 Client Management</h1>
            <p className="text-xs text-gray-400 ml-2">Building Care Solutions - {clients.length} Active Clients</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            ➕ Add New Client
          </button>
        </div>
      </div>

      <Card title="" subtitle="" actions={null}>
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
            Error: {error}
          </div>
        )}

        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          💡 Tip: Double-click any row to view details, or use the View button
        </div>

        <Table
          columns={columns}
          data={clients}
          loading={loading}
          emptyMessage="No clients found. Add your first client to get started."
          onRowDoubleClick={handleView}
        />
      </Card>

      {/* View Client Modal (Read-Only) */}
      {isViewModalOpen && viewingClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                👤 Client Details
              </h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{viewingClient.name}</h3>
                {viewingClient.company && (
                  <p className="text-gray-600 dark:text-gray-400 text-lg">{viewingClient.company}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">📧 Email</label>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{viewingClient.email}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">📞 Phone</label>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{viewingClient.phone}</p>
                </div>

                {viewingClient.address && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">📍 Address</label>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{viewingClient.address}</p>
                  </div>
                )}

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">🆔 Client ID</label>
                  <p className="text-gray-900 dark:text-gray-100 font-mono">{viewingClient.id}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">📅 Created</label>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {new Date(viewingClient.created_at || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 pb-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <AttachmentsPanel entityType="client" entityId={viewingClient.id} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-3">
              <button
                onClick={handlePrint}
                className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                🖨️ Print
              </button>
              <button
                onClick={handleEmail}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                📧 Email
              </button>
              <button
                onClick={handleEditFromView}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingClient ? 'Edit Client' : 'Add New Client'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="John Doe"
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="john@example.com"
          />

          <Input
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            required
            placeholder="(555) 123-4567"
          />

          <Input
            label="Company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            placeholder="ABC Corporation"
          />

          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="123 Main St, City, State"
          />

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingClient ? 'Update' : 'Create'} Client
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ClientsView;
