import React, { useState, useEffect } from 'react';
import { jobTrackingAPI } from '../api-client';
import { useCRUD } from '../hooks/useAPI';
import { Table, Button, Modal, Input, Select, Card, Textarea } from '../components';

export const JobTrackingView = () => {
  const { items: jobTrackings, loading, error, fetchAll, create, update, remove } = useCRUD(jobTrackingAPI);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTracking, setEditingTracking] = useState(null);
  const [formData, setFormData] = useState({
    work_order_id: '',
    job_name: '',
    status: 'pending',
    assigned_to: '',
    start_date: '',
    end_date: '',
    completion_percentage: '0',
    notes: '',
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
      const trackingData = {
        ...formData,
        work_order_id: formData.work_order_id ? parseInt(formData.work_order_id) : null,
        assigned_to: formData.assigned_to ? parseInt(formData.assigned_to) : null,
        completion_percentage: formData.completion_percentage ? parseInt(formData.completion_percentage) : 0,
      };

      if (editingTracking) {
        await update(editingTracking.id, trackingData);
      } else {
        await create(trackingData);
      }

      setIsModalOpen(false);
      resetForm();
      fetchAll();
    } catch (err) {
      console.error('Error saving job tracking:', err);
    }
  };

  const handleEdit = (tracking) => {
    setEditingTracking(tracking);
    setFormData({
      work_order_id: tracking.work_order_id || '',
      job_name: tracking.job_name || '',
      status: tracking.status || 'pending',
      assigned_to: tracking.assigned_to || '',
      start_date: tracking.start_date || '',
      end_date: tracking.end_date || '',
      completion_percentage: tracking.completion_percentage || '0',
      notes: tracking.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job tracking entry?')) {
      try {
        await remove(id);
        fetchAll();
      } catch (err) {
        console.error('Error deleting job tracking:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      work_order_id: '',
      job_name: '',
      status: 'pending',
      assigned_to: '',
      start_date: '',
      end_date: '',
      completion_percentage: '0',
      notes: '',
    });
    setEditingTracking(null);
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      on_hold: 'bg-orange-100 text-orange-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.pending}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const columns = [
    { header: 'Job Name', accessor: 'job_name' },
    { header: 'WO ID', accessor: 'work_order_id' },
    {
      header: 'Status',
      render: (row) => getStatusBadge(row.status),
    },
    {
      header: 'Progress',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-24 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{width: `${row.completion_percentage || 0}%`}}
            ></div>
          </div>
          <span className="text-xs text-gray-600">{row.completion_percentage || 0}%</span>
        </div>
      )
    },
    {
      header: 'Start Date',
      render: (row) => formatDate(row.start_date),
    },
    {
      header: 'End Date',
      render: (row) => formatDate(row.end_date),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => handleEdit(row)}>
            Edit
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="p-4 space-y-4 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-bold text-gray-800">Job Tracker</h1>
          <span className="text-xs text-gray-400">{jobTrackings.length} jobs</span>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + Add Entry
        </button>
      </div>

      <Card title="" subtitle="" actions={null} className="!p-0">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            Error: {error}
          </div>
        )}

        <Table
          columns={columns}
          data={jobTrackings}
          loading={loading}
          emptyMessage="No job tracking entries found. Add your first tracking entry to get started."
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingTracking ? 'Edit Job Tracker' : 'Add New Job Tracker'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Job Name"
            name="job_name"
            value={formData.job_name}
            onChange={handleInputChange}
            required
            placeholder="e.g., Water Damage Restoration - Main St"
          />

          <Input
            label="Work Order ID"
            name="work_order_id"
            type="number"
            value={formData.work_order_id}
            onChange={handleInputChange}
            placeholder="Associated work order ID"
          />

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            required
            options={statusOptions}
          />

          <Input
            label="Assigned To (Employee ID)"
            name="assigned_to"
            type="number"
            value={formData.assigned_to}
            onChange={handleInputChange}
            placeholder="Employee ID"
          />

          <Input
            label="Start Date"
            name="start_date"
            type="date"
            value={formData.start_date}
            onChange={handleInputChange}
          />

          <Input
            label="End Date"
            name="end_date"
            type="date"
            value={formData.end_date}
            onChange={handleInputChange}
          />

          <Input
            label="Completion Percentage"
            name="completion_percentage"
            type="number"
            min="0"
            max="100"
            value={formData.completion_percentage}
            onChange={handleInputChange}
            placeholder="0-100"
          />

          <Textarea
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Additional notes about the job"
            rows={3}
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
              {editingTracking ? 'Update' : 'Create'} Tracking Entry
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default JobTrackingView;
