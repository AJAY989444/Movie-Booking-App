import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, User, LogOut, Shield, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '1rem 5%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: '0 0 1px 0',
      borderRadius: 0,
    }}>
      <Link to="/" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        textDecoration: 'none',
        fontSize: '1.5rem',
        fontWeight: 800,
        color: 'inherit'
      }}>
        <Film className="primary" style={{ color: 'var(--primary)' }} />
        <span className="brand-text">CinePass</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/" className="btn-secondary" style={{
          padding: '0.5rem 1rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.9rem',
          textDecoration: 'none'
        }}>
          Movies
        </Link>

        {user ? (
          <>
            {role === 'ROLE_ADMIN' && (
              <Link to="/admin" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--accent-cyan)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}>
                <Shield size={16} />
                Admin Panel
              </Link>
            )}

            <Link to="/profile" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--text-main)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}>
              <User size={16} />
              {user.name}
            </Link>

            <button onClick={handleLogout} className="btn-secondary" style={{
              padding: '0.4rem 0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem',
              borderRadius: 'var(--radius-sm)'
            }}>
              <LogOut size={14} />
              Logout
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/login" className="btn-secondary" style={{
              padding: '0.4rem 1rem',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none'
            }}>
              <LogIn size={14} />
              Login
            </Link>
            <Link to="/register" className="btn-primary" style={{
              padding: '0.4rem 1rem',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              boxShadow: 'none'
            }}>
              <UserPlus size={14} />
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
