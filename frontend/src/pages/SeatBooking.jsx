import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showtimeAPI, seatAPI, ticketAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { Armchair, ShoppingCart, Film, Calendar, Clock, ScreenShare, ShieldAlert } from 'lucide-react';

const SeatBooking = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showtime, setShowtime] = useState(null);
  const [seats, setSeats] = useState([]);
  const [bookedSeatIds, setBookedSeatIds] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const TICKET_PRICE = 90000; // 90,000 VND constant from backend mapper

  useEffect(() => {
    fetchBookingData();
  }, [showtimeId]);

  const fetchBookingData = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Get Showtime details
      const showtimeRes = await showtimeAPI.getById(showtimeId);
      const stData = showtimeRes.data;
      setShowtime(stData);

      // 2. Get Seats in the Hall
      const seatsRes = await seatAPI.getByHall(stData.hall.id);
      // Sort seats by seat number (e.g. A1, A2, B1...)
      const sortedSeats = (seatsRes.data?.data || []).sort((a, b) => 
        a.seatNumber.localeCompare(b.seatNumber, undefined, { numeric: true, sensitivity: 'base' })
      );
      setSeats(sortedSeats);

      // 3. Get Booked Seats for this Showtime
      const ticketsRes = await ticketAPI.getAll();
      const allTickets = ticketsRes.data || [];
      const activeBookedIds = allTickets
        .filter(t => t.showtime.id === Number(showtimeId) && t.status !== 'CANCELED')
        .map(t => t.seat.id);
      setBookedSeatIds(activeBookedIds);

    } catch (err) {
      console.error(err);
      setError('Failed to load seats and showtimes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seatId) => {
    if (bookedSeatIds.includes(seatId)) return; // Can't select already booked seats

    if (selectedSeatIds.includes(seatId)) {
      setSelectedSeatIds(selectedSeatIds.filter(id => id !== seatId));
    } else {
      setSelectedSeatIds([...selectedSeatIds, seatId]);
    }
  };

  const handleBookTickets = async () => {
    if (!user) {
      // Redirect to login
      navigate('/login');
      return;
    }

    if (selectedSeatIds.length === 0) {
      setError('Please select at least one seat.');
      return;
    }

    setBooking(true);
    setError('');
    try {
      // Book all seats in parallel
      const movieId = showtime.movie.id;
      const userId = user.id;
      
      const bookingPromises = selectedSeatIds.map(seatId => 
        ticketAPI.create(movieId, userId, seatId, Number(showtimeId))
      );
      
      await Promise.all(bookingPromises);
      setSuccess(true);
      setSelectedSeatIds([]);
      
      // Refresh booked seats
      setTimeout(() => {
        navigate('/profile');
      }, 2000);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to book tickets. A seat might have just been taken.');
      // Refresh data
      fetchBookingData();
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
        Loading seat layouts...
      </div>
    );
  }

  if (error && !showtime) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
        <p style={{ color: 'var(--danger)', marginBottom: '1.5rem' }}>{error}</p>
        <button onClick={() => navigate('/')} className="btn btn-secondary">Back to Home</button>
      </div>
    );
  }

  const selectedSeatsDetails = seats.filter(s => selectedSeatIds.includes(s.id));
  const totalPrice = selectedSeatIds.length * TICKET_PRICE;

  return (
    <div className="animate-fade-in" style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(300px, 3fr) minmax(280px, 1.5fr)',
      gap: '2.5rem',
      alignItems: 'start'
    }}>
      {/* Left side: Seat Matrix Grid */}
      <div className="glass-panel" style={{
        padding: '2.5rem 2rem',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', width: '100%' }}>
          Choose Seats
        </h2>

        {/* Screen Indicator */}
        <div style={{
          width: '80%',
          textAlign: 'center',
          marginBottom: '3.5rem',
          position: 'relative'
        }}>
          <div style={{
            height: '6px',
            background: 'linear-gradient(to right, transparent, var(--primary), var(--accent-cyan), var(--primary), transparent)',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.5)'
          }} />
          <p style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em'
          }}>
            SCREEN THIS WAY
          </p>
        </div>

        {/* Seat Grid Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(10, minmax(28px, 40px))',
          gap: '0.75rem 0.5rem',
          justifyContent: 'center',
          marginBottom: '3rem'
        }}>
          {seats.map((seat) => {
            const isBooked = bookedSeatIds.includes(seat.id);
            const isSelected = selectedSeatIds.includes(seat.id);
            
            let seatColor = 'rgba(255, 255, 255, 0.1)';
            let seatBorder = '1px solid var(--glass-border)';
            let cursor = 'pointer';

            if (isBooked) {
              seatColor = 'rgba(239, 68, 68, 0.2)';
              seatBorder = '1px solid rgba(239, 68, 68, 0.4)';
              cursor = 'not-allowed';
            } else if (isSelected) {
              seatColor = 'var(--primary)';
              seatBorder = '1px solid var(--primary)';
            }

            return (
              <div
                key={seat.id}
                onClick={() => handleSeatClick(seat.id)}
                title={`Seat ${seat.seatNumber}`}
                style={{
                  aspectRatio: '1',
                  background: seatColor,
                  border: seatBorder,
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  color: isSelected ? 'white' : (isBooked ? 'var(--danger)' : 'var(--text-muted)'),
                  cursor: cursor,
                  transition: 'var(--transition-fast)',
                  userSelect: 'none'
                }}
              >
                {seat.seatNumber}
              </div>
            );
          })}
        </div>

        {/* Seat Legend */}
        <div style={{
          display: 'flex',
          gap: '2rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          borderTop: '1px solid var(--glass-border)',
          width: '100%',
          paddingTop: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid var(--glass-border)' }} />
            <span>Available</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: 'var(--primary)' }} />
            <span>Selected</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)' }} />
            <span>Booked</span>
          </div>
        </div>
      </div>

      {/* Right Side: Booking Panel & Cart */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Film summary */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ width: '60px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
              <img
                src={showtime.movie.posterImageUrl || 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=400&q=80'}
                alt={showtime.movie.name}
                style={{ width: '100%', display: 'block' }}
              />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{showtime.movie.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{showtime.hall ? showtime.hall.name : 'Screen'}</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Date:</span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{showtime.showtimeDate}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Start Time:</span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{showtime.startTime.substring(0, 5)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Price per seat:</span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{TICKET_PRICE.toLocaleString()} VND</span>
            </div>
          </div>
        </div>

        {/* Selected Summary / Cart */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingCart size={16} />
            Summary
          </h3>

          {error && (
            <div className="badge-danger" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1rem',
              fontSize: '0.75rem',
              textTransform: 'none'
            }}>
              <ShieldAlert size={14} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="badge-success" style={{
              width: '100%',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'center',
              fontSize: '0.9rem',
              textTransform: 'none'
            }}>
              Booking successful! Checking your profile...
            </div>
          ) : (
            <>
              {selectedSeatIds.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1.5rem 0' }}>
                  No seats selected yet.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedSeatsDetails.map(s => (
                      <span key={s.id} className="badge badge-primary" style={{ fontSize: '0.8rem' }}>
                        Seat {s.seatNumber}
                      </span>
                    ))}
                  </div>

                  <div style={{
                    borderTop: '1px solid var(--glass-border)',
                    paddingTop: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline'
                  }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total Cost:</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                      {totalPrice.toLocaleString()} VND
                    </span>
                  </div>

                  <button
                    onClick={handleBookTickets}
                    className="btn btn-primary"
                    disabled={booking}
                    style={{ width: '100%', padding: '0.75rem' }}
                  >
                    {booking ? 'Reserving...' : (user ? 'Confirm Booking' : 'Login to Book')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatBooking;
