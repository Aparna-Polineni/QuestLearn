// src/screens/stage3/Level3_14.jsx
// Auth — Protected Routes — Build mode

import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage3Shell from './Stage3Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import CodeEditor from '../stage2/CodeEditor';
import './Level3_14.css';

const SUPPORT = {
  intro: {
    concept: "Protected Routes — Authentication in React",
    tagline: "Not every page should be accessible to everyone. Protected routes redirect unauthenticated users to login.",
    whatYouWillDo: "Build a ProtectedRoute component, a login flow that stores a JWT token, and an auth-aware navigation that shows/hides links based on login state.",
    whyItMatters: "Every real application has protected pages. Patient records, admin dashboards, staff portals — all require authentication. This is the standard React pattern used in virtually every production app.",
  },
  hints: [
    "ProtectedRoute is a wrapper component: if the user is logged in, render the children (the protected page). If not, redirect to /login using React Router's <Navigate to='/login' replace />.",
    "Store the JWT token in localStorage after login. Check for it to determine if the user is authenticated. On logout, remove it and navigate to /login.",
    "The auth state (user object or null) lives in AuthContext so every component can check it. ProtectedRoute reads from AuthContext and decides whether to render or redirect.",
  ],
  reveal: {
    concept: "JWT Authentication + Protected Routes",
    whatYouLearned: "ProtectedRoute checks auth state and redirects to login if not authenticated. JWT token stored in localStorage persists across page refreshes. AuthContext shares auth state everywhere. Login calls the backend, stores the token, updates context. Logout clears storage and context.",
    realWorldUse: "Hospital staff log in with credentials. The JWT token is checked on every protected route. Token expiry (24h) forces re-login. Admin-only routes check role as well as auth. This is the same auth model used by the QuestLearn backend you built in Spring Boot.",
    developerSays: "localStorage is fine for JWT in most apps but has XSS risks. HttpOnly cookies are more secure but require more backend coordination. For a hospital system handling patient data, HttpOnly cookies are the better choice — but localStorage is fine for learning and most non-medical apps.",
  },
};

const STARTER = `import { createContext, useContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

// TODO: Build AuthProvider that:
// - Reads token from localStorage on init
// - Has state: user (null or object with email/token)
// - Provides: user, login(email, password), logout()
// - login() calls POST /api/auth/login, stores token, sets user
// - logout() clears localStorage and sets user to null

// TODO: Build useAuth() custom hook

// TODO: Build ProtectedRoute({ children }) component that:
// - Gets user from useAuth()
// - If user exists: renders children
// - If no user: returns <Navigate to="/login" replace />

// ── Pages ──────────────────────────────────────────────────────────────────

function LoginPage() {
  // TODO: Form with email + password
  // On submit: call auth.login(email, password)
  // If success: navigate to /dashboard
  // If error: show error message
  return <div>Login page</div>;
}

function Dashboard() {
  // TODO: Get user from useAuth()
  // Show welcome message with user's email
  // Add logout button that calls auth.logout() then navigate to /login
  return <div>Dashboard — protected page</div>;
}

function App() {
  return (
    // TODO: Wrap in AuthProvider + BrowserRouter
    // TODO: Define routes:
    //   /login → LoginPage (public)
    //   /dashboard → ProtectedRoute wrapping Dashboard
    //   / → Navigate to /dashboard
    <div>App here</div>
  );
}

export default App;`;

const SOLUTION = `import { createContext, useContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('ql_token');
    const email = localStorage.getItem('ql_email');
    return token ? { token, email } : null;
  });

  async function login(email, password) {
    const res = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Invalid credentials');
    const data = await res.json();
    localStorage.setItem('ql_token', data.token);
    localStorage.setItem('ql_email', data.email);
    setUser({ token: data.token, email: data.email });
  }

  function logout() {
    localStorage.removeItem('ql_token');
    localStorage.removeItem('ql_email');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Staff Login</h1>
      {error && <p style={{color:'red'}}>{error}</p>}
      <input value={email}    onChange={e => setEmail(e.target.value)}    placeholder="Email" type="email" />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
      <button type="submit">Login</button>
    </form>
  );
}

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div>
      <h1>Hospital Dashboard</h1>
      <p>Welcome, {user?.email}</p>
      <button onClick={() => { logout(); navigate('/login'); }}>Logout</button>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;`;

const CHECKS = [
  { id: 'auth',       label: 'AuthProvider with login() and logout()',          test: c => c.includes('function AuthProvider') && c.includes('login') && c.includes('logout') },
  { id: 'token',      label: 'JWT token stored in localStorage',                test: c => c.includes('localStorage.setItem') && c.includes('token') },
  { id: 'restore',    label: 'Auth state restored from localStorage on init',   test: c => c.includes('localStorage.getItem') },
  { id: 'protected',  label: 'ProtectedRoute redirects to /login if no user',   test: c => c.includes('Navigate') && c.includes('/login') },
  { id: 'usehook',    label: 'useAuth custom hook created',                     test: c => c.includes('function useAuth') },
  { id: 'loginpost',  label: 'login() calls POST /api/auth/login',              test: c => c.includes('/api/auth/login') && c.includes('POST') },
  { id: 'wrap',       label: 'Dashboard wrapped in ProtectedRoute',             test: c => c.includes('<ProtectedRoute>') },
];

export default function Level3_14() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage3Shell levelId={14} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l314-container">
          <div className="l314-brief">
            <div className="l314-tag">// Mission Brief</div>
            <h2>Add authentication and <span style={{ color: selectedDomain?.color }}>protected routes</span>.</h2>
            <p>Build AuthProvider, ProtectedRoute, and the login flow. Connect to your Spring Boot backend's /api/auth/login endpoint.</p>
          </div>
          <CodeEditor
            starterCode={STARTER}
            solutionCode={SOLUTION}
            checks={CHECKS}
            onAllPassed={() => setIsCorrect(true)}
            language="jsx"
          />
        </div>
      </LevelSupportWrapper>
    </Stage3Shell>
  );
}