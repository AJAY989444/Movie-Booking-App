import React, { useState, useEffect } from 'react';
import { seatAPI, hallAPI } from '../api';
import { Plus, Trash2, X, Save, Armchair } from 'lucide-react';

const AdminSeats = () => {
  const [seats, setSeats] = useState([]);
  const [halls, setHalls] = useState([]);
  const [selectedHallId, setSelectedHallId] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [seatNumber, setSeatNumber] = useState('');
  const [formHallId, setFormHallId] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHalls();
  }, []);

  useEffect(() => {
    if (selectedHallId) {
      fetchSeatsForHall(selectedHallId);
    } else {
      setSeats([]);
      setLoading(false);
    }
  }, [selectedHallId]);

  const fetchHalls = async () => {
    try {
      const res = await hallAPI.getAll(false);
      if (res.data && res.data.data) {
        const hlList = res.data.data.halls || [];
        setHalls(hlList);
        if (hlList.length > 0) {
          setSelectedHallId(hlList[0].id);
          setFormHallId(hlList[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSeatsForHall = async (hallId) => {
    setLoading(true);
    try {
      const res = await seatAPI.getByHall(hallId);
      // Sort seats by row and number (e.g. A1, A2, B1...)
      const sortedSeats = (res.data?.data || []).sort((a, b) => 
        a.seatNumber.localeCompare(b.seatNumber, undefined, { numeric: true, sensitivity: 'base' })
      );
      setSeats(sortedSeats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    if (halls.length === 0) {
      alert('You must have at least one Hall in the database first.');
      return;
    }
    setSeatNumber('');
    setFormHallId(selectedHallId || halls[0].id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this seat?')) return;
    try {
      await seatAPI.delete(id);
      fetchSeatsForHall(selectedHallId);
    } catch (err) {
      console.error(err);
      alert('Failed to delete seat.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await seatAPI.create(seatNumber.trim().toUpperCase(), Number(formHallId));
      setShowForm(false);
      // Refresh current filtered hall
      setSelectedHallId(formHallId);
      fetchSeatsForHall(formHallId);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error creating seat. Seat might already exist.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Seats Management</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Hall Filter:</span>
            <select
              className="form-input"
              style={{ width: 'auto', padding: '0.4rem 2rem 0.4rem 1rem', fontSize: '0.85rem' }}
              value={selectedHallId}
              onChange={e => setSelectedHallId(e.target.value)}
            >
              {halls.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </div>
        </div>

        {!showForm && (
          <button onClick={handleAddClick} className="btn btn-primary" style={{ display: 'flex', gap: '0.4rem', padding: '0.5rem 1rem' }}>
            <Plus size={16} /> Add Seat
          </button>
        )}
      </div>

      {showForm && (
        <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: 'var(--radius-md)', maxWidth: '500px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Add New Seat</h3>
            <button onClick={() => setShowForm(false)} className="btn-secondary" style={{ padding: '0.3rem 0.6rem', display: 'flex', alignItems: 'center', borderRadius: 'var(--radius-sm)' }}>
              <X size={14} /> Close
            </button>
          </div>

          {error && <div className="badge-danger" style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.8rem', textTransform: 'none' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Seat Number</label>
              <input type="text" className="form-input" placeholder="e.g. A11, B2" value={seatNumber} onChange={e => setSeatNumber(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Select Hall</label>
              <select className="form-input" value={formHallId} onChange={e => setFormHallId(e.target.value)} required>
                {halls.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting} style={{ display: 'flex', gap: '0.4rem' }}>
                <Save size={16} /> {submitting ? 'Saving...' : 'Save Seat'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading seats...</p>
      ) : seats.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No seats configured for this hall. Click "Add Seat" to create seats.</p>
      ) : (
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
            Configured Seats ({seats.length})
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: '1rem'
          }}>
            {seats.map(seat => (
              <div
                key={seat.id}
                className="glass-card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--glass-border)'
                }}
              >
                <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Armchair size={14} className="primary" style={{ color: 'var(--primary)' }} />
                  {seat.seatNumber}
                </span>

                <button
                  onClick={() => handleDelete(seat.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--danger)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.2rem'
                  }}
                  title="Delete Seat"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSeats;
