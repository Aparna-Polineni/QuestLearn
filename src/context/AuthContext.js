// src/context/AuthContext.js
// Updated to use Spring Boot backend instead of Supabase/localStorage mock
// API runs on http://localhost:8080

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(undefined); // undefined = still loading

  // ── On app load: check if a JWT exists and restore the session ────────────
  // Calls GET /api/user/me with the stored token
  // If token is valid  → restores user, stays logged in
  // If token is missing or expired → sets user to null, shows login screen
  useEffect(() => {
    if (api.isLoggedIn()) {
      api.getMe()
        .then(data => setUser(data))
        .catch(() => {
          // Token expired or invalid — clear it and show login
          api.logout();
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, []);

  // ── Register ──────────────────────────────────────────────────────────────
  // POST /api/auth/register → { token, userId, email, displayName, ... }
  // Token is stored in localStorage automatically by api.js
  async function signUp(email, password, name) {
    try {
      const data = await api.register(email, name, password);
      setUser(data);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: err.message } };
    }
  }

  // ── Login ─────────────────────────────────────────────────────────────────
  // POST /api/auth/login → { token, userId, email, displayName, ... }
  async function signIn(email, password) {
    try {
      const data = await api.login(email, password);
      setUser(data);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: err.message } };
    }
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  // Clears the JWT from localStorage — no server call needed (stateless JWT)
  async function signOut() {
    api.logout();
    setUser(null);
  }

  // ── Update profile (career path, domain selection) ────────────────────────
  // PUT /api/user/profile → returns fresh token + updated profile
  async function updateProfile(updates) {
    try {
      const data = await api.updateProfile(updates);
      setUser(data);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: err.message } };
    }
  }

  const loading = user === undefined;

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}