// src/screens/stage6/Level6_4.jsx — Auth Bug Hunt (DEBUG)
import { useState } from 'react';
import Stage6Shell from './Stage6Shell';

const BUGS = [
  {
    id: 1,
    label: 'Bug 1 — Wrong token format in header',
    bad:  `api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token; // ← missing "Bearer "
  }
  return config;
});`,
    good: `api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`; // ← correct
  }
  return config;
});`,
    why: 'Spring\'s JwtFilter expects "Authorization: Bearer eyJ...". If you send just the raw token without the "Bearer " prefix, the filter doesn\'t recognise it and returns 401 for every request, even with a valid token.',
    hint: 'The Authorization header value must start with "Bearer " (with a space).',
  },
  {
    id: 2,
    label: 'Bug 2 — 401 vs 403 confusion',
    bad:  `// React response interceptor
api.interceptors.response.use(null, error => {
  if (error.response.status === 403) {
    // Redirect to login on forbidden
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});`,
    good: `api.interceptors.response.use(null, error => {
  if (error.response.status === 401) {
    // 401 = Unauthenticated (no/expired token) → redirect to login
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  // 403 = Authenticated but not authorised → show "Access Denied" message, don't logout
  return Promise.reject(error);
});`,
    why: '401 Unauthorized means the request has no valid token — the user needs to log in. 403 Forbidden means the token is valid but the user lacks permission (e.g. non-admin accessing admin route). Redirecting to login on 403 logs out a valid user unnecessarily.',
    hint: '401 = not authenticated. 403 = not authorised. Only redirect to login on 401.',
  },
  {
    id: 3,
    label: 'Bug 3 — Not handling token expiry on startup',
    bad:  `useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    setUser({ loggedIn: true }); // ← assumes token is still valid
  }
}, []);`,
    good: `useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    api.get('/api/auth/me')
      .then(res => setUser(res.data))        // token valid → restore session
      .catch(() => {
        localStorage.removeItem('token');    // token expired → clear it
        // user stays null → PrivateRoute redirects to /login
      });
  }
}, []);`,
    why: 'JWTs expire (typically after 24 hours or 7 days). If you assume the stored token is valid without verifying it, the user appears logged in but every API call returns 401. Always verify with /api/auth/me on startup.',
    hint: 'Always verify the stored token with a backend call on app startup.',
  },
  {
    id: 4,
    label: 'Bug 4 — CORS missing OPTIONS in allowedMethods',
    bad:  `config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
// Missing OPTIONS — preflight requests fail`,
    good: `config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
// OPTIONS required for CORS preflight requests`,
    why: 'Before every cross-origin POST/PUT/DELETE, browsers send a preflight OPTIONS request. If OPTIONS isn\'t in allowedMethods, Spring Security returns 403 for preflight, and the actual request never fires. Symptom: POST works in Postman but fails in browser.',
    hint: 'CORS preflight uses OPTIONS. It must be in allowedMethods.',
  },
];

export default function Level6_4() {
  const [found, setFound] = useState(new Set());
  const allFound = found.size >= BUGS.length;

  return (
    <Stage6Shell levelId={4} canProceed={allFound}
      conceptReveal={[
        { label: '401 vs 403 — Never Confuse Them', detail: '401 Unauthorized = no valid token present. 403 Forbidden = valid token, insufficient permissions. This distinction matters: 401 → redirect to login. 403 → show "Access Denied" and keep the user logged in.' },
        { label: 'Always Verify Stored Tokens', detail: 'localStorage persists across browser restarts. A token from 3 days ago might have expired. Always call /api/auth/me on startup and clear invalid tokens. Never trust a stored token without verification.' },
      ]}
    >
      <div className="s6-intro">
        <h1>Auth Bug Hunt</h1>
        <p className="s6-tagline">🐛 Four auth bugs every full stack developer hits. Find them all.</p>
        <p className="s6-why">These bugs are silent — the app often appears to work until an edge case exposes them. Recognising the pattern means you fix them in minutes instead of hours.</p>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {BUGS.map(bug => (
          <div key={bug.id} style={{
            background:'#1e293b', border:`1px solid ${found.has(bug.id) ? '#4ade8060' : '#334155'}`,
            borderLeft:`3px solid ${found.has(bug.id) ? '#4ade80' : '#f87171'}`,
            borderRadius:10, padding:'16px 20px'
          }}>
            <h3 style={{ color: found.has(bug.id) ? '#4ade80' : '#f87171', margin:'0 0 10px', fontSize:14 }}>{bug.label}</h3>

            <div className="s6-panel" style={{ margin:'0 0 8px' }}>
              <div className="s6-panel-header" style={{ color:'#f87171' }}>❌ Buggy Code</div>
              <pre className="s6-panel-body" style={{ margin:0, overflowX:'auto' }}>{bug.bad}</pre>
            </div>

            <p style={{ color:'#64748b', fontSize:13, margin:'8px 0' }}>💡 Hint: {bug.hint}</p>

            {!found.has(bug.id) ? (
              <button className="s6-btn secondary" style={{ fontSize:13, padding:'7px 16px', marginTop:6 }}
                onClick={() => setFound(p => { const n = new Set(p); n.add(bug.id); return n; })}>
                Reveal Fix
              </button>
            ) : (
              <>
                <div className="s6-panel" style={{ margin:'8px 0 6px' }}>
                  <div className="s6-panel-header" style={{ color:'#4ade80' }}>✅ Fixed Code</div>
                  <pre className="s6-panel-body" style={{ margin:0, color:'#94a3b8', overflowX:'auto' }}>{bug.good}</pre>
                </div>
                <p style={{ color:'#94a3b8', fontSize:13, lineHeight:1.6, margin:'6px 0' }}>{bug.why}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {allFound && <div className="s6-feedback success" style={{ marginTop:20 }}>✅ All 4 auth bugs found. These won't catch you off guard again.</div>}
    </Stage6Shell>
  );
}
