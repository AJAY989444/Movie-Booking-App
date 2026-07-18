import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { movieAPI, showtimeAPI } from '../api';
import { Star, Calendar, Clock, Film, Users, Play } from 'lucide-react';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const movieRes = await movieAPI.getById(id);
      if (movieRes.data && movieRes.data.data) {
        setMovie(movieRes.data.data);
      } else {
        setError('Movie not found.');
      }

      // Fetch showtimes
      const showtimeRes = await showtimeAPI.getByMovieId(id);
      if (showtimeRes.data) {
        setShowtimes(showtimeRes.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load movie details.');
    } finally {
      setLoading(false);
    }
  };

  // Group showtimes by date
  const groupedShowtimes = showtimes.reduce((groups, showtime) => {
    const date = showtime.showtimeDate;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(showtime);
    return groups;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(groupedShowtimes).sort();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
        Loading movie details...
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
        <p style={{ color: 'var(--danger)', marginBottom: '1.5rem' }}>{error || 'Movie not found.'}</p>
        <button onClick={() => navigate('/')} className="btn btn-secondary">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* Banner & Cover details */}
      <div style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        minHeight: '350px',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '2.5rem',
        boxShadow: 'var(--shadow-dark)'
      }}>
        {/* Banner image with dark overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `linear-gradient(to top, #0b0f19 5%, rgba(11, 15, 25, 0.4) 60%, rgba(11, 15, 25, 0.8) 100%), url('${movie.bannerImageUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1
        }} />

        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          gap: '2.5rem',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          width: '100%'
        }}>
          {/* Poster */}
          <div style={{
            width: '180px',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-dark)',
            border: '1px solid var(--glass-border)',
            flexShrink: 0,
            backgroundColor: 'var(--bg-secondary)'
          }}>
            <img
              src={movie.posterImageUrl || 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=400&q=80'}
              alt={movie.name}
              style={{ width: '100%', display: 'block', objectFit: 'cover' }}
            />
          </div>

          {/* Core Info */}
          <div style={{ flex: '1', minWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <span className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Star size={12} fill="currentColor" /> {movie.rating?.toFixed(1) || 'N/A'} Rating
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Calendar size={14} /> {movie.releaseDate}
              </span>
            </div>

            <h1 style={{ fontSize: '2.75rem', fontWeight: 800, marginBottom: '1rem', lineHeight: '1.2' }}>
              {movie.name}
            </h1>

            <p style={{
              color: 'var(--text-muted)',
              fontSize: '1rem',
              maxWidth: '800px',
              lineHeight: '1.6',
              marginBottom: '1rem'
            }}>
              {movie.description}
            </p>

            <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Users size={16} />
                <strong>Cast:</strong> {movie.cast}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details and Booking sections */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 3fr) minmax(280px, 2fr)',
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        {/* Left Side: Showtimes */}
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} className="primary" style={{ color: 'var(--primary)' }} />
            Select Showtime & Theatre
          </h2>

          {sortedDates.length === 0 ? (
            <div style={{
              padding: '2.5rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              border: '1px dashed var(--glass-border)',
              borderRadius: 'var(--radius-md)'
            }}>
              No showtimes are currently scheduled for this movie. Check back later!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {sortedDates.map((date) => (
                <div key={date} style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-cyan)', marginBottom: '1rem' }}>
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </h3>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    {groupedShowtimes[date].map((showtime) => (
                      <button
                        key={showtime.id}
                        className="glass-card"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          padding: '0.75rem 1.25rem',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          textAlign: 'center',
                          border: '1px solid var(--glass-border)',
                          background: 'rgba(255, 255, 255, 0.02)',
                          minWidth: '120px'
                        }}
                        onClick={() => navigate(`/book/${showtime.id}`)}
                      >
                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                          {showtime.startTime.substring(0, 5)}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          {showtime.hall ? showtime.hall.name : 'Screen'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Trailer Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {movie.trailer && (
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Film size={18} className="primary" style={{ color: 'var(--primary)' }} />
                Official Trailer
              </h2>

              <div style={{
                position: 'relative',
                width: '100%',
                paddingTop: '56.25%', /* 16:9 aspect ratio */
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                backgroundColor: 'black'
              }}>
                <iframe
                  title={`${movie.name} Trailer`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 0
                  }}
                  src={movie.trailer}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
