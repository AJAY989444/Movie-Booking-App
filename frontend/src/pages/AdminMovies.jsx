import React, { useState, useEffect } from 'react';
import { movieAPI } from '../api';
import { Plus, Trash2, Edit, X, Save, Film } from 'lucide-react';

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [rating, setRating] = useState('8.0');
  const [trailer, setTrailer] = useState('');
  const [cast, setCast] = useState('');
  const [posterImage, setPosterImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await movieAPI.getAll(false); // statusInDBOfMovie = false (active)
      if (res.data && res.data.data) {
        setMovies(res.data.data.movies || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (movie) => {
    setEditingId(movie.id);
    setName(movie.name || '');
    setDescription(movie.description || '');
    setReleaseDate(movie.releaseDate || '');
    setRating(String(movie.rating || 8.0));
    setTrailer(movie.trailer || '');
    setCast(movie.cast || '');
    setPosterImage(null);
    setBannerImage(null);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setReleaseDate('');
    setRating('8.0');
    setTrailer('');
    setCast('');
    setPosterImage(null);
    setBannerImage(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    try {
      await movieAPI.delete(id);
      fetchMovies();
    } catch (err) {
      console.error(err);
      alert('Failed to delete movie.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('releaseDate', releaseDate);
    formData.append('rating', Number(rating));
    formData.append('trailer', trailer);
    formData.append('cast', cast);

    if (posterImage) {
      formData.append('posterImage', posterImage);
    }
    if (bannerImage) {
      formData.append('bannerImage', bannerImage);
    }

    try {
      if (editingId) {
        await movieAPI.update(editingId, formData);
      } else {
        await movieAPI.create(formData);
      }
      setShowForm(false);
      fetchMovies();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error processing movie. Verify parameters.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem' }}>Movies Management</h2>
        {!showForm && (
          <button onClick={handleAddClick} className="btn btn-primary" style={{ display: 'flex', gap: '0.4rem', padding: '0.5rem 1rem' }}>
            <Plus size={16} /> Add Movie
          </button>
        )}
      </div>

      {showForm && (
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem' }}>{editingId ? 'Edit Movie' : 'Add New Movie'}</h3>
            <button onClick={() => setShowForm(false)} className="btn-secondary" style={{ padding: '0.3rem 0.6rem', display: 'flex', alignItems: 'center', borderRadius: 'var(--radius-sm)' }}>
              <X size={14} /> Close
            </button>
          </div>

          {error && <div className="badge-danger" style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.8rem', textTransform: 'none' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Movie Title</label>
                <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Release Date</label>
                <input type="date" className="form-input" value={releaseDate} onChange={e => setReleaseDate(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Rating (e.g. 8.5)</label>
                <input type="number" step="0.1" max="10" min="0" className="form-input" value={rating} onChange={e => setRating(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Trailer Link (YouTube embed URL, e.g. https://www.youtube.com/embed/...) </label>
                <input type="url" className="form-input" placeholder="https://www.youtube.com/embed/..." value={trailer} onChange={e => setTrailer(e.target.value)} required />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Cast</label>
                <input type="text" className="form-input" placeholder="Separated by commas" value={cast} onChange={e => setCast(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea rows="4" className="form-input" value={description} onChange={e => setDescription(e.target.value)} required style={{ resize: 'vertical' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Poster File</label>
                  <input type="file" accept="image/*" onChange={e => setPosterImage(e.target.files[0])} />
                </div>
                <div className="form-group">
                  <label className="form-label">Banner File</label>
                  <input type="file" accept="image/*" onChange={e => setBannerImage(e.target.files[0])} />
                </div>
              </div>
            </div>

            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting} style={{ display: 'flex', gap: '0.4rem' }}>
                <Save size={16} /> {submitting ? 'Saving...' : 'Save Movie'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading movies database...</p>
      ) : movies.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No movies seeded in database yet.</p>
      ) : (
        <div className="glass-panel" style={{ overflowX: 'auto', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Poster</th>
                <th style={{ padding: '0.75rem 1rem' }}>Title</th>
                <th style={{ padding: '0.75rem 1rem' }}>Rating</th>
                <th style={{ padding: '0.75rem 1rem' }}>Release Date</th>
                <th style={{ padding: '0.75rem 1rem' }}>Cast</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map(movie => (
                <tr key={movie.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                  <td style={{ padding: '0.5rem 1rem' }}>
                    <div style={{ width: '40px', height: '55px', borderRadius: '4px', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)' }}>
                      <img src={movie.posterImageUrl || 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=100&q=80'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{movie.name}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#eab308' }}>★ {movie.rating?.toFixed(1)}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{movie.releaseDate}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{movie.cast}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button onClick={() => handleEditClick(movie)} className="btn-secondary" style={{ padding: '0.3rem 0.5rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center' }} title="Edit Movie">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDelete(movie.id)} className="btn-danger" style={{ padding: '0.3rem 0.5rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', border: 'none', cursor: 'pointer' }} title="Delete Movie">
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

export default AdminMovies;
