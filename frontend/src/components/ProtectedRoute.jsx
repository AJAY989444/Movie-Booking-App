import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        fontFamily: 'var(--font-display)',
        fontSize: '1.2rem',
        color: 'var(--text-muted)'
      }}>
        Loading secure area...
      </div>
    );
  }

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Logged in but role not allowed
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
