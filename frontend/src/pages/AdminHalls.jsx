import React, { useState, useEffect } from 'react';
import { hallAPI } from '../api';
import { Plus, Trash2, Edit, X, Save } from 'lucide-react';

const AdminHalls = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState(30);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    setLoading(true);
    try {
      const res = await hallAPI.getAll(false); // status = false (active)
      if (res.data && res.data.data) {
        setHalls(res.data.data.halls || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (hall) => {
    setEditingId(hall.id);
    setName(hall.name);
    setCapacity(hall.capacity);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setEditingId(null);
    setName('');
    setCapacity(30);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hall?')) return;
    try {
      await hallAPI.delete(id);
      fetchHalls();
    } catch (err) {
      console.error(err);
      alert('Failed to delete hall.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingId) {
        await hallAPI.update(editingId, name, Number(capacity));
      } else {
        await hallAPI.create(name, Number(capacity));
      }
      setShowForm(false);
      fetchHalls();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error processing hall details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem' }}>Halls Management</h2>
        {!showForm && (
          <button onClick={handleAddClick} className="btn btn-primary" style={{ display: 'flex', gap: '0.4rem', padding: '0.5rem 1rem' }}>
            <Plus size={16} /> Add Hall
          </button>
        )}
      </div>

      {showForm && (
        <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: 'var(--radius-md)', maxWidth: '500px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem' }}>{editingId ? 'Edit Hall' : 'Add New Hall'}</h3>
            <button onClick={() => setShowForm(false)} className="btn-secondary" style={{ padding: '0.3rem 0.6rem', display: 'flex', alignItems: 'center', borderRadius: 'var(--radius-sm)' }}>
              <X size={14} /> Close
            </button>
          </div>

          {error && <div className="badge-danger" style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.8rem', textTransform: 'none' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Hall Name</label>
              <input type="text" className="form-input" placeholder="e.g. Screen C" value={name} onChange={e => setName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Capacity (Number of Seats)</label>
              <input type="number" min="1" max="200" className="form-input" value={capacity} onChange={e => setCapacity(e.target.value)} required />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting} style={{ display: 'flex', gap: '0.4rem' }}>
                <Save size={16} /> {submitting ? 'Saving...' : 'Save Hall'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading halls database...</p>
      ) : halls.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No halls found in database.</p>
      ) : (
        <div className="glass-panel" style={{ overflowX: 'auto', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                <th style={{ padding: '0.75rem 1rem' }}>Hall Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Seat Capacity</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {halls.map(hall => (
                <tr key={hall.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold' }}>#{hall.id}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{hall.name}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{hall.capacity} seats</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button onClick={() => handleEditClick(hall)} className="btn-secondary" style={{ padding: '0.3rem 0.5rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center' }} title="Edit Hall">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDelete(hall.id)} className="btn-danger" style={{ padding: '0.3rem 0.5rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', border: 'none', cursor: 'pointer' }} title="Delete Hall">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminHalls;
