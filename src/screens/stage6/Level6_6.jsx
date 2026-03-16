// src/screens/stage6/Level6_6.jsx — Protected Routes (BUILD)
import { useState } from 'react';
import Stage6Shell from './Stage6Shell';

const REQUIREMENTS = [
  { id: 'r1', label: 'PrivateRoute component that reads from AuthContext' },
  { id: 'r2', label: 'Redirects to /login if user is not authenticated' },
  { id: 'r3', label: 'Shows loading state while auth is being restored' },
  { id: 'r4', label: 'Wraps protected routes in App.jsx using PrivateRoute' },
  { id: 'r5', label: 'PublicRoute that redirects logged-in users away from /login' },
];

const SOLUTION = `// src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="auth-loading">Verifying session...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
}

// Prevents logged-in users accessing /login or /register
export function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? <Navigate to="/home" replace /> : children;
}

// ── In App.jsx ──────────────────────────────────────────────────────────────
// <Routes>
//   <Route path="/login"   element={<PublicRoute><Login /></PublicRoute>} />
//   <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
//   <Route path="/home"    element={<PrivateRoute><Home /></PrivateRoute>} />
//   <Route path="/roadmap" element={<PrivateRoute><Roadmap /></PrivateRoute>} />
//   <Route path="/stage/*" element={<PrivateRoute><StageRouter /></PrivateRoute>} />
// </Routes>

// ── AuthContext update — add loading state ──────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until token verified

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/api/auth/me')
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false)); // always stop loading
    } else {
      setLoading(false); // no token — not loading
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}`;

export default function Level6_6() {
  const [code, setCode] = useState('');
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState({});
  const [showSolution, setShowSolution] = useState(false);

  function check() {
    const c = code.toUpperCase();
    setResults({
      r1: c.includes('USEAUTH') && (c.includes('PRIVATEROUTE') || c.includes('PRIVATE ROUTE')),
      r2: c.includes('NAVIGATE') && c.includes('/LOGIN'),
      r3: c.includes('LOADING'),
      r4: c.includes('<PRIVATEROUTE') || c.includes('PRIVATEROUTE>'),
      r5: c.includes('PUBLICROUTE') && c.includes('/HOME'),
    });
    setChecked(true);
  }

  const allPass = checked && Object.values(results).every(Boolean);

  return (
    <Stage6Shell levelId={6} canProceed={allPass}
      conceptReveal={[
        { label: 'The loading State', detail: 'Without a loading state, the app checks user=null on startup (before /api/auth/me returns) and immediately redirects to /login — even for a valid session. The loading flag prevents any redirect until the token has been verified.' },
        { label: 'replace prop on Navigate', detail: '<Navigate to="/login" replace /> replaces the current history entry instead of pushing a new one. Without replace, clicking the back button returns the user to the protected page they can\'t access — causing a redirect loop.' },
        { label: 'PublicRoute', detail: 'Without PublicRoute, a logged-in user visiting /login sees the login form. PublicRoute redirects them to /home automatically. Always add this — it\'s a small touch that makes the app feel polished.' },
      ]}
    >
      <div className="s6-intro">
        <h1>Protected Routes</h1>
        <p className="s6-tagline">🔒 Unauthenticated users see /login. Authenticated users see the app.</p>
        <p className="s6-why">PrivateRoute is the React-side enforcement of authentication. Without it, any user can navigate directly to /home or /roadmap by typing the URL — even without a valid token.</p>
      </div>

      <div className="s6-info">
        <p>The key insight: <strong style={{color:'#fbbf24'}}>PrivateRoute doesn't make requests — it reads auth state</strong>. The Axios interceptor handles the token. PrivateRoute just checks: is there a logged-in user in context? If not, redirect.</p>
      </div>

      <div style={{ marginBottom:12 }}>
        {REQUIREMENTS.map(r => (
          <div className="s6-req" key={r.id}>
            <span className="s6-req-icon" style={{ color: !checked ? '#475569' : results[r.id] ? '#4ade80' : '#f87171' }}>
              {!checked ? '○' : results[r.id] ? '✓' : '✗'}
            </span>
            <span className="s6-req-text">{r.label}</span>
          </div>
        ))}
      </div>

      <textarea className="s6-editor" value={code} onChange={e => setCode(e.target.value)}
        placeholder="// Write PrivateRoute, PublicRoute, and show how they wrap routes in App.jsx..." />

      <div style={{ display:'flex', gap:10, marginTop:10 }}>
        <button className="s6-btn" onClick={check}>Check Requirements</button>
        <button className="s6-btn secondary" onClick={() => setShowSolution(s => !s)}>
          {showSolution ? 'Hide' : 'Show'} Solution
        </button>
      </div>

      {showSolution && (
        <div className="s6-panel" style={{ marginTop:12 }}>
          <div className="s6-panel-header">✅ Reference Solution</div>
          <pre className="s6-panel-body" style={{ color:'#94a3b8', overflowX:'auto', margin:0 }}>{SOLUTION}</pre>
        </div>
      )}

      {checked && (
        <div className={`s6-feedback ${allPass ? 'success' : 'error'}`}>
          {allPass ? '✅ Protected routes complete. Your app is auth-gated.' : `❌ ${Object.values(results).filter(Boolean).length}/${REQUIREMENTS.length} requirements met.`}
        </div>
      )}
    </Stage6Shell>
  );
}
