import React, { useState, useEffect } from 'react';
import { showtimeAPI, movieAPI, hallAPI } from '../api';
import { Plus, Trash2, X, Save, Calendar } from 'lucide-react';

const AdminShowtimes = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [movieId, setMovieId] = useState('');
  const [hallId, setHallId] = useState('');
  const [showtimeDate, setShowtimeDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(120);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchShowtimesData();
    fetchMoviesAndHalls();
  }, []);

  const fetchShowtimesData = async () => {
    setLoading(true);
    try {
      const res = await showtimeAPI.getAll();
      setShowtimes(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoviesAndHalls = async () => {
    try {
      const moviesRes = await movieAPI.getAll(false);
      if (moviesRes.data && moviesRes.data.data) {
        const mvList = moviesRes.data.data.movies || [];
        setMovies(mvList);
        if (mvList.length > 0) setMovieId(mvList[0].id);
      }

      const hallsRes = await hallAPI.getAll(false);
      if (hallsRes.data && hallsRes.data.data) {
        const hlList = hallsRes.data.data.halls || [];
        setHalls(hlList);
        if (hlList.length > 0) setHallId(hlList[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddClick = () => {
    if (movies.length === 0 || halls.length === 0) {
      alert('You must have at least one Movie and one Hall in the database first.');
      return;
    }
    setMovieId(movies[0].id);
    setHallId(halls[0].id);
    setShowtimeDate('');
    setStartTime('');
    setDuration(120);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this showtime schedule?')) return;
    try {
      await showtimeAPI.delete(id);
      fetchShowtimesData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete showtime.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Format start time to HH:MM:SS format expected by LocalTime in backend
    const formattedStartTime = startTime.length === 5 ? `${startTime}:00` : startTime;

    try {
      await showtimeAPI.create(
        Number(movieId),
        showtimeDate,
        formattedStartTime,
        Number(duration),
        Number(hallId)
      );
      setShowForm(false);
      fetchShowtimesData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error scheduling showtime. Check for overlapping timings.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem' }}>Showtimes Scheduling</h2>
        {!showForm && (
          <button onClick={handleAddClick} className="btn btn-primary" style={{ display: 'flex', gap: '0.4rem', padding: '0.5rem 1rem' }}>
            <Plus size={16} /> Add Showtime
          </button>
        )}
      </div>

      {showForm && (
        <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: 'var(--radius-md)', maxWidth: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Schedule Showtime</h3>
            <button onClick={() => setShowForm(false)} className="btn-secondary" style={{ padding: '0.3rem 0.6rem', display: 'flex', alignItems: 'center', borderRadius: 'var(--radius-sm)' }}>
              <X size={14} /> Close
            </button>
          </div>

          {error && <div className="badge-danger" style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.8rem', textTransform: 'none' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Select Movie</label>
              <select className="form-input" value={movieId} onChange={e => setMovieId(e.target.value)} required>
                {movies.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Select Hall/Screen</label>
              <select className="form-input" value={hallId} onChange={e => setHallId(e.target.value)} required>
                {halls.map(h => <option key={h.id} value={h.id}>{h.name} ({h.capacity} seats)</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Showtime Date</label>
                <input type="date" className="form-input" value={showtimeDate} onChange={e => setShowtimeDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Start Time (HH:MM)</label>
                <input type="time" className="form-input" value={startTime} onChange={e => setStartTime(e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Duration (Minutes)</label>
              <input type="number" min="1" className="form-input" value={duration} onChange={e => setDuration(e.target.value)} required />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting} style={{ display: 'flex', gap: '0.4rem' }}>
                <Save size={16} /> {submitting ? 'Scheduling...' : 'Save Showtime'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading showtimes schedule...</p>
      ) : showtimes.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No showtimes scheduled.</p>
      ) : (
        <div className="glass-panel" style={{ overflowX: 'auto', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                <th style={{ padding: '0.75rem 1rem' }}>Movie</th>
                <th style={{ padding: '0.75rem 1rem' }}>Hall / Screen</th>
                <th style={{ padding: '0.75rem 1rem' }}>Date</th>
                <th style={{ padding: '0.75rem 1rem' }}>Start Time</th>
                <th style={{ padding: '0.75rem 1rem' }}>Duration</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {showtimes.map(st => (
                <tr key={st.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold' }}>#{st.id}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{st.movie ? st.movie.name : 'N/A'}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--accent-cyan)' }}>{st.hall ? st.hall.name : 'N/A'}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{st.showtimeDate}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{st.startTime.substring(0, 5)}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{st.duration} mins</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleDelete(st.id)} className="btn-danger" style={{ padding: '0.3rem 0.5rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', border: 'none', cursor: 'pointer' }} title="Delete Showtime">
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

export default AdminShowtimes;
