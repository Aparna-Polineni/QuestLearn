// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Mock auth using localStorage — no Supabase needed
// When user adds Supabase keys to .env it switches automatically
let supabase = null;
function getSupabase() {
  if (supabase) return supabase;
  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_ANON_KEY;
  if (url && key && !url.includes('your-project')) {
    try {
      const { createClient } = require('@supabase/supabase-js');
      supabase = createClient(url, key);
    } catch {}
  }
  return supabase;
}

const MOCK_KEY = 'ql_auth_v2';

function mockSignUp(email, password, name) {
  const db = JSON.parse(localStorage.getItem('ql_mock_users') || '{}');
  if (db[email]) return { error: { message: 'Email already registered. Please sign in.' } };
  const user = { id: `u_${Date.now()}`, email, name, createdAt: new Date().toISOString() };
  db[email] = { ...user, password };
  localStorage.setItem('ql_mock_users', JSON.stringify(db));
  localStorage.setItem(MOCK_KEY, JSON.stringify(user));
  return { data: { user }, error: null };
}

function mockSignIn(email, password) {
  const db = JSON.parse(localStorage.getItem('ql_mock_users') || '{}');
  const stored = db[email];
  if (!stored) return { error: { message: 'No account found. Please sign up.' } };
  if (stored.password !== password) return { error: { message: 'Incorrect password.' } };
  const user = { id: stored.id, email: stored.email, name: stored.name };
  localStorage.setItem(MOCK_KEY, JSON.stringify(user));
  return { data: { user }, error: null };
}

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(undefined); // undefined = loading
  const sb = getSupabase();

  useEffect(() => {
    if (sb) {
      sb.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      });
      const { data: { subscription } } = sb.auth.onAuthStateChange((_, session) => {
        setUser(session?.user ?? null);
      });
      return () => subscription.unsubscribe();
    } else {
      // Restore mock session
      try {
        const saved = localStorage.getItem(MOCK_KEY);
        setUser(saved ? JSON.parse(saved) : null);
      } catch {
        setUser(null);
      }
    }
  }, []);

  async function signUp(email, password, name) {
    if (sb) {
      const { data, error } = await sb.auth.signUp({ email, password, options: { data: { name } } });
      if (data?.user) setUser(data.user);
      return { data, error };
    }
    const result = mockSignUp(email, password, name);
    if (result.data?.user) setUser(result.data.user);
    return result;
  }

  async function signIn(email, password) {
    if (sb) {
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (data?.user) setUser(data.user);
      return { data, error };
    }
    const result = mockSignIn(email, password);
    if (result.data?.user) setUser(result.data.user);
    return result;
  }

  async function signOut() {
    if (sb) await sb.auth.signOut();
    else localStorage.removeItem(MOCK_KEY);
    setUser(null);
  }

  const loading = user === undefined;

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}