import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { movieAPI } from '../api';
import { Search, Star, Calendar, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Sort state
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('asc');

  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, [sortBy, sortDir]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      // Fetching active movies (status = false is default in backend to mean active/not deleted)
      const res = await movieAPI.getAll(false, sortBy, sortDir);
      if (res.data && res.data.data) {
        setMovies(res.data.data.movies || []);
      }
    } catch (err) {
      console.error('Error fetching movies', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = movies.filter(movie => 
    movie.name.toLowerCase().includes(search.toLowerCase()) ||
    movie.cast.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Hero Banner Section */}
      <div style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 8%',
        boxShadow: 'var(--shadow-dark)'
      }}>
        {/* Background Image with overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `linear-gradient(to right, #0b0f19 20%, rgba(11, 15, 25, 0.4) 60%, rgba(11, 15, 25, 0.8) 100%), url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1
        }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '1rem' }}>Featured Experience</span>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', lineHeight: '1.1' }}>
            Book Your Next <span className="brand-text">Cinematic Adventure</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            Browse showtimes, pick your favorite screen, select premium seats, and secure your tickets in seconds.
          </p>
        </div>
      </div>

      {/* Query Bar */}
      <div className="glass-panel" style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1.5rem',
        padding: '1.25rem 2rem',
        borderRadius: 'var(--radius-md)',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
          <Search size={18} style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-dark)'
          }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search movies by name, cast..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SlidersHorizontal size={16} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sort By:</span>
            <select
              className="form-input"
              style={{ padding: '0.4rem 2rem 0.4rem 1rem', width: 'auto', fontSize: '0.85rem' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="id">Latest Added</option>
              <option value="name">Title</option>
              <option value="rating">Rating</option>
              <option value="releaseDate">Release Date</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowUpDown size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              className="form-input"
              style={{ padding: '0.4rem 2rem 0.4rem 1rem', width: 'auto', fontSize: '0.85rem' }}
              value={sortDir}
              onChange={(e) => setSortDir(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Movie Grid */}
      <div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Now Showing
          <span style={{
            fontSize: '0.9rem',
            color: 'var(--primary)',
            background: 'var(--primary-glow)',
            padding: '0.1rem 0.6rem',
            borderRadius: 'var(--radius-sm)'
          }}>
            {filteredMovies.length}
          </span>
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            Loading movies...
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
            No movies found matching your search.
          </div>
        ) : (
          <div className="grid-cols-4">
            {filteredMovies.map((movie) => (
              <div
                key={movie.id}
                className="glass-card animate-fade-in"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  cursor: 'pointer'
                }}
                onClick={() => navigate(`/movies/${movie.id}`)}
              >
                {/* Poster Wrapper */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '140%', /* 5:7 Aspect Ratio */
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  marginBottom: '1rem',
                  backgroundColor: 'var(--bg-secondary)'
                }}>
                  <img
                    src={movie.posterImageUrl || 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=400&q=80'}
                    alt={movie.name}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  {movie.rating && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(0, 0, 0, 0.75)',
                      backdropFilter: 'blur(4px)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      color: '#eab308',
                      border: '1px solid rgba(234, 179, 8, 0.3)'
                    }}>
                      <Star size={12} fill="#eab308" />
                      {movie.rating.toFixed(1)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {movie.name}
                  </h3>
                  
                  <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <Calendar size={12} />
                    Released: {movie.releaseDate}
                  </p>

                  <p style={{
                    color: 'var(--text-dark)',
                    fontSize: '0.8rem',
                    marginBottom: '1.5rem',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    height: '2.4rem',
                    lineHeight: '1.2'
                  }}>
                    Cast: {movie.cast}
                  </p>

                  <button
                    className="btn btn-primary"
                    style={{ marginTop: 'auto', width: '100%', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/movies/${movie.id}`);
                    }}
                  >
                    Book Tickets
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
