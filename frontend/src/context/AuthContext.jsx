import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await userAPI.getProfile();
          setUser(res.data);
        } catch (err) {
          console.error('Error fetching user profile', err);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  // Derive role from user object
  const role = user?.role || null;

  const login = async (email, password, isAdmin = false) => {
    setLoading(true);
    try {
      let res;
      if (isAdmin) {
        res = await authAPI.adminLogin(email, password);
      } else {
        res = await authAPI.userLogin(email, password);
      }

      const jwtToken = res.data.token;
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);

      // Fetch profile – role comes from backend now
      const profileRes = await userAPI.getProfile();
      setUser(profileRes.data);

      const userRole = profileRes.data.role;
      return { success: true, role: userRole };
    } catch (err) {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phoneNumber) => {
    try {
      await userAPI.register(name, email, password, phoneNumber);
      return { success: true };
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, role, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;

