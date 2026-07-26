import React, { useState } from 'react';
import AdminMovies from './AdminMovies';
import AdminHalls from './AdminHalls';
import AdminShowtimes from './AdminShowtimes';
import AdminSeats from './AdminSeats';
import { Film, Landmark, Calendar, Armchair, Shield, Ticket } from 'lucide-react';
import { ticketAPI } from '../api';

// Simple Bookings table list inside dashboard for ease of use
const BookingsList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await ticketAPI.getAll();
      setTickets(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-md)' }}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Ticket size={20} />
        All Customer Bookings
      </h3>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading bookings...</p>
      ) : tickets.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No bookings currently registered.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', color: 'var(--text-main)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                <th style={{ padding: '0.75rem 1rem' }}>Customer</th>
                <th style={{ padding: '0.75rem 1rem' }}>Movie</th>
                <th style={{ padding: '0.75rem 1rem' }}>Screen</th>
                <th style={{ padding: '0.75rem 1rem' }}>Seat</th>
                <th style={{ padding: '0.75rem 1rem' }}>Showtime</th>
                <th style={{ padding: '0.75rem 1rem' }}>Price</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold' }}>#{t.id}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{t.user?.name || `ID: ${t.user?.id || 'N/A'}`}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{t.showtime?.movie?.name || 'N/A'}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{t.showtime?.hall?.name || 'N/A'}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--accent-cyan)' }}>{t.seat?.seatNumber || 'N/A'}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{t.showtime ? `${t.showtime.showtimeDate} ${t.showtime.startTime.substring(0,5)}` : 'N/A'}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold' }}>₹{t.price?.toLocaleString()}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span className={t.status === 'CANCELED' ? 'badge badge-danger' : 'badge badge-success'} style={{ fontSize: '0.75rem' }}>
                      {t.status}
                    </span>
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

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('movies');

  const tabs = [
    { id: 'movies', label: 'Movies', icon: <Film size={16} /> },
    { id: 'showtimes', label: 'Showtimes', icon: <Calendar size={16} /> },
    { id: 'halls', label: 'Halls', icon: <Landmark size={16} /> },
    { id: 'seats', label: 'Seats', icon: <Armchair size={16} /> },
    { id: 'bookings', label: 'Bookings', icon: <Ticket size={16} /> },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Shield size={28} className="primary" style={{ color: 'var(--primary)' }} />
        <h1 style={{ fontSize: '2rem' }}>
          Admin <span className="brand-text">Control Center</span>
        </h1>
      </div>

      {/* Tabs navigation */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        borderBottom: '1px solid var(--glass-border)',
        paddingBottom: '1rem',
        overflowX: 'auto'
      }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="btn"
              style={{
                background: isActive ? 'var(--primary-glow)' : 'transparent',
                color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                border: `1px solid ${isActive ? 'var(--primary)' : 'transparent'}`,
                padding: '0.5rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div style={{ marginTop: '1rem' }}>
        {activeTab === 'movies' && <AdminMovies />}
        {activeTab === 'showtimes' && <AdminShowtimes />}
        {activeTab === 'halls' && <AdminHalls />}
        {activeTab === 'seats' && <AdminSeats />}
        {activeTab === 'bookings' && <BookingsList />}
      </div>
    </div>
  );
};

export default AdminDashboard;
