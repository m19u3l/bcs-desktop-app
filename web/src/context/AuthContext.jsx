import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('bcs_token');
    const saved = localStorage.getItem('bcs_user');
    if (token && saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const r = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!r.ok) {
      const e = await r.json();
      throw new Error(e.error || 'Login failed');
    }
    const data = await r.json();
    localStorage.setItem('bcs_token', data.token);
    localStorage.setItem('bcs_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (formData) => {
    const r = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (!r.ok) {
      const e = await r.json();
      throw new Error(e.error || 'Registration failed');
    }
    const data = await r.json();
    localStorage.setItem('bcs_token', data.token);
    localStorage.setItem('bcs_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('bcs_token');
    localStorage.removeItem('bcs_user');
    setUser(null);
  };

  const getToken = () => localStorage.getItem('bcs_token');

  const authFetch = (url, opts = {}) => {
    const token = getToken();
    return fetch(url, {
      ...opts,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...opts.headers },
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, authFetch, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
