import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ticketAPI, userAPI } from '../api';
import { User, Ticket, Key, Phone, Mail, Clock, AlertCircle, ShieldCheck } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [error, setError] = useState('');

  // Password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [passSubmitting, setPassSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserTickets();
    }
  }, [user]);

  const fetchUserTickets = async () => {
    setTicketsLoading(true);
    try {
      const res = await ticketAPI.getByUserId(user.id);
      setTickets(res.data || []);
    } catch (err) {
      console.error('Error fetching tickets', err);
      setError('Could not retrieve booking history.');
    } finally {
      setTicketsLoading(false);
    }
  };

  const handleCancelTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to cancel this ticket booking?')) return;

    try {
      await ticketAPI.delete(ticketId);
      // Refresh tickets list
      fetchUserTickets();
    } catch (err) {
      console.error('Error canceling ticket', err);
      alert(err.response?.data?.message || 'Failed to cancel ticket.');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match.');
      return;
    }

    const passwordRegex = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}/;
    if (!passwordRegex.test(newPassword)) {
      setPassError('New password does not meet complexity requirements (8+ chars, 1 uppercase, 1 lowercase, 1 digit, 1 special).');
      return;
    }

    setPassSubmitting(true);
    try {
      await userAPI.updatePassword(oldPassword, newPassword);
      setPassSuccess('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setPassError(err.response?.data?.message || 'Password update failed. Make sure your current password is correct.');
    } finally {
      setPassSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="animate-fade-in" style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 2fr)',
      gap: '2.5rem',
      alignItems: 'start'
    }}>
      {/* Left side: Account Profile & Password updater */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Profile Card */}
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem', textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--primary-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--primary)',
              marginBottom: '1rem'
            }}>
              <User size={36} className="primary" style={{ color: 'var(--primary)' }} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{user.name}</h2>
            <span className="badge badge-primary" style={{ marginTop: '0.5rem' }}>
              {user.role === 'ROLE_ADMIN' ? 'Administrator' : 'Customer'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Mail size={16} />
              <div>
                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Email</p>
                <p style={{ color: 'var(--text-main)', fontWeight: 600 }}>{user.email}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Phone size={16} />
              <div>
                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Phone Number</p>
                <p style={{ color: 'var(--text-main)', fontWeight: 600 }}>{user.phoneNumber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Password Reset Form */}
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={18} />
            Update Password
          </h3>

          {passError && (
            <div className="badge-danger" style={{
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1rem',
              fontSize: '0.75rem',
              textTransform: 'none'
            }}>
              {passError}
            </div>
          )}

          {passSuccess && (
            <div className="badge-success" style={{
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1rem',
              fontSize: '0.75rem',
              textTransform: 'none',
              width: '100%',
              textAlign: 'center'
            }}>
              {passSuccess}
            </div>
          )}

          <form onSubmit={handlePasswordUpdate}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-secondary" disabled={passSubmitting} style={{ width: '100%' }}>
              {passSubmitting ? 'Updating...' : 'Save Password'}
            </button>
          </form>
        </div>
      </div>

      {/* Right side: Booking History */}
      <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Ticket size={22} className="primary" style={{ color: 'var(--primary)' }} />
          Booking History
        </h2>

        {ticketsLoading ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>
            Loading bookings...
          </p>
        ) : error ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', padding: '2rem 0' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        ) : tickets.length === 0 ? (
          <div style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            color: 'var(--text-muted)',
            border: '1px dashed var(--glass-border)',
            borderRadius: 'var(--radius-md)'
          }}>
            No bookings found. Head to the homepage to grab tickets!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {tickets.map((ticket) => {
              const isCanceled = ticket.status === 'CANCELED';
              return (
                <div
                  key={ticket.id}
                  className="glass-card"
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.25rem 1.5rem',
                    gap: '1.5rem',
                    border: '1px solid var(--glass-border)',
                    background: isCanceled ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{
                      width: '45px',
                      height: '45px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary)'
                    }}>
                      <Ticket size={20} />
                    </div>

                    <div>
                      <h4 style={{
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        color: isCanceled ? 'var(--text-dark)' : 'var(--text-main)',
                        textDecoration: isCanceled ? 'line-through' : 'none'
                      }}>
                        {ticket.showtime ? ticket.showtime.movie?.name : 'Movie Ticket'}
                      </h4>
                      
                      <div style={{
                        display: 'flex',
                        gap: '1rem',
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        marginTop: '0.25rem',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={12} />
                          {ticket.showtime ? `${ticket.showtime.showtimeDate} @ ${ticket.showtime.startTime.substring(0, 5)}` : ''}
                        </span>
                        <span>
                          Hall: <strong>{ticket.showtime?.hall ? ticket.showtime.hall.name : 'N/A'}</strong>
                        </span>
                        <span>
                          Seat: <strong>{ticket.seat ? ticket.seat.seatNumber : 'N/A'}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        color: isCanceled ? 'var(--text-dark)' : 'var(--text-main)'
                      }}>
                        ₹{ticket.price?.toLocaleString()}
                      </p>
                      
                      <div style={{ marginTop: '0.25rem' }}>
                        {isCanceled ? (
                          <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>Canceled</span>
                        ) : (
                          <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Booked</span>
                        )}
                      </div>
                    </div>

                    {!isCanceled && (
                      <button
                        onClick={() => handleCancelTicket(ticket.id)}
                        className="btn btn-danger"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
