// src/screens/stage6/Level6_13.jsx — Full Stack Capstone (BUILD)
import { useState } from 'react';
import Stage6Shell from './Stage6Shell';

const TABS = ['Auth', 'CORS & Errors', 'CRUD', 'WebSocket'];

const REQUIREMENTS = {
  Auth: [
    { id: 'a1', label: 'AuthContext with login/logout/loading' },
    { id: 'a2', label: 'PrivateRoute and PublicRoute components' },
    { id: 'a3', label: 'Axios api instance with request + response interceptors' },
    { id: 'a4', label: 'Token stored in localStorage, verified on startup with /api/auth/me' },
  ],
  'CORS & Errors': [
    { id: 'c1', label: 'Spring CorsConfigurationSource bean with all methods + OPTIONS' },
    { id: 'c2', label: '@RestControllerAdvice with 404, 400, and 500 handlers' },
    { id: 'c3', label: 'Consistent JSON error shape: { error: "..." } or { errors: {...} }' },
    { id: 'c4', label: 'React displays error messages from error.response.data.error' },
  ],
  CRUD: [
    { id: 'cr1', label: 'PatientList fetches on mount with pagination (page, totalPages)' },
    { id: 'cr2', label: 'Create form POSTs and appends to list' },
    { id: 'cr3', label: 'Edit inline, PUT updates the patient in list' },
    { id: 'cr4', label: 'Delete removes from list, shows confirmation' },
    { id: 'cr5', label: 'File upload endpoint + React input with FormData' },
  ],
  WebSocket: [
    { id: 'w1', label: 'Spring @EnableWebSocketMessageBroker config' },
    { id: 'w2', label: 'AdmissionService broadcasts via SimpMessagingTemplate' },
    { id: 'w3', label: 'React STOMP client subscribes to /topic/admissions' },
    { id: 'w4', label: 'Notification bell updates in real time, cleanup on unmount' },
  ],
};

const CHECK = {
  a1: c => c.includes('USEAUTH') && c.includes('LOGIN') && c.includes('LOADING'),
  a2: c => c.includes('PRIVATEROUTE') && c.includes('PUBLICROUTE'),
  a3: c => c.includes('INTERCEPTORS') && c.includes('BEARER'),
  a4: c => c.includes('LOCALSTORAGE') && c.includes('/API/AUTH/ME'),
  c1: c => c.includes('CORSCONFIG') && c.includes('OPTIONS'),
  c2: c => c.includes('@RESTCONTROLLERADVICE') && c.includes('NOTFOUND') && c.includes('EXCEPTION'),
  c3: c => c.includes('"ERROR"') || c.includes("'ERROR'") || c.includes('MAP.OF("ERROR"') || c.includes('FIELDERRORS'),
  c4: c => c.includes('ERROR.RESPONSE') || c.includes('RESPONSE.DATA'),
  cr1: c => c.includes('USEEFFECT') && c.includes('PAGE') && c.includes('TOTALPAGES'),
  cr2: c => c.includes('API.POST') && c.includes('SETPATIENTS'),
  cr3: c => c.includes('API.PUT') && c.includes('.MAP('),
  cr4: c => c.includes('API.DELETE') && c.includes('.FILTER('),
  cr5: c => c.includes('FORMDATA') && c.includes('MULTIPARTFILE'),
  w1: c => c.includes('ENABLEWEBSOCKET') || c.includes('WEBSOCKETCONFIG'),
  w2: c => c.includes('SIMPMES') || c.includes('CONVERTANDSEND'),
  w3: c => c.includes('SUBSCRIBE') && c.includes('/TOPIC/'),
  w4: c => c.includes('DEACTIVATE') && c.includes('NOTIFICATION'),
};

export default function Level6_13() {
  const [tab, setTab] = useState('Auth');
  const [code, setCode] = useState({ Auth:'', 'CORS & Errors':'', CRUD:'', WebSocket:'' });
  const [results, setResults] = useState({});
  const [checked, setChecked] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  function check() {
    const allCode = Object.values(code).join('\n').toUpperCase();
    const r = {};
    Object.entries(CHECK).forEach(([id, fn]) => { r[id] = fn(allCode); });
    setResults(r); setChecked(true);
  }

  const allReqs = Object.values(REQUIREMENTS).flat();
  const passCount = allReqs.filter(r => results[r.id]).length;
  const allPass = checked && passCount === allReqs.length;

  return (
    <Stage6Shell levelId={13} canProceed={allPass}
      conceptReveal={[
        { label: 'Stage 6 Complete', detail: 'You now have the complete integration stack: CORS, Axios interceptors, JWT auth flow, protected routes, global error handling, full CRUD with pagination, file upload, WebSockets with real-time notifications. This is a production-grade full stack application.' },
        { label: 'What Stage 7 Covers', detail: 'Deployment & DevOps — containerising the app with Docker, setting up CI/CD with GitHub Actions, deploying to AWS (EC2 + RDS), and monitoring with CloudWatch. The app you\'ve built across Stages 1–6 goes live.' },
      ]}
    >
      <div className="s6-intro">
        <h1>Full Stack Capstone</h1>
        <p className="s6-tagline">🏆 The complete patient dashboard — auth, CRUD, uploads, real-time updates.</p>
        <p className="s6-why">Write the full integration layer across four tabs. Every concept from Stage 6 in one working application.</p>
      </div>

      {checked && (
        <div style={{ background:'#1e293b', borderRadius:8, padding:'12px 16px', marginBottom:16, display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ flex:1 }}>
            <div style={{ height:6, background:'#334155', borderRadius:3, overflow:'hidden' }}>
              <div style={{ height:'100%', background:'#fbbf24', borderRadius:3, width:`${(passCount/allReqs.length)*100}%`, transition:'width .4s' }} />
            </div>
          </div>
          <span style={{ color:'#fbbf24', fontWeight:700, fontSize:14, whiteSpace:'nowrap' }}>{passCount}/{allReqs.length} requirements</span>
        </div>
      )}

      <div style={{ display:'flex', gap:4, marginBottom:14, flexWrap:'wrap' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding:'8px 16px', borderRadius:6, border:'none', cursor:'pointer',
            fontSize:13, fontWeight:600, transition:'all .15s',
            background: tab===t ? '#fbbf24' : '#1e293b',
            color: tab===t ? '#0f172a' : '#64748b',
          }}>{t}</button>
        ))}
      </div>

      <div style={{ marginBottom:12 }}>
        {(REQUIREMENTS[tab] || []).map(r => (
          <div className="s6-req" key={r.id}>
            <span className="s6-req-icon" style={{ color: !checked ? '#475569' : results[r.id] ? '#4ade80' : '#f87171' }}>
              {!checked ? '○' : results[r.id] ? '✓' : '✗'}
            </span>
            <span className="s6-req-text">{r.label}</span>
          </div>
        ))}
      </div>

      <div className="s6-panel">
        <div className="s6-panel-header">✏️ {tab}</div>
        <textarea className="s6-editor" value={code[tab]} onChange={e => setCode(c => ({...c, [tab]:e.target.value}))}
          placeholder={`// Write your ${tab} integration code here...`}
          style={{ border:'none', borderRadius:0, minHeight:260 }} />
      </div>

      <div style={{ display:'flex', gap:10, marginTop:12, flexWrap:'wrap' }}>
        <button className="s6-btn" onClick={check}>Check All Tabs</button>
        <button className="s6-btn secondary" onClick={() => setShowSolution(s => !s)}>
          {showSolution ? 'Hide' : 'Show'} Hints
        </button>
      </div>

      {showSolution && (
        <div className="s6-info" style={{ marginTop:12 }}>
          <p><strong style={{color:'#fbbf24'}}>Auth tab:</strong> AuthContext with login/logout/loading, PrivateRoute + PublicRoute, Axios api.js with interceptors.</p>
          <p style={{marginTop:8}}><strong style={{color:'#fbbf24'}}>CORS & Errors tab:</strong> SecurityConfig CorsConfigurationSource, @RestControllerAdvice with 3 handlers, React error display.</p>
          <p style={{marginTop:8}}><strong style={{color:'#fbbf24'}}>CRUD tab:</strong> PatientManager with useEffect, paginated GET, create/update/delete with optimistic updates, file upload with FormData.</p>
          <p style={{marginTop:8}}><strong style={{color:'#fbbf24'}}>WebSocket tab:</strong> WebSocketConfig, AdmissionService with SimpMessagingTemplate, React STOMP client with cleanup.</p>
        </div>
      )}

      {checked && (
        <div className={`s6-feedback ${allPass ? 'success' : 'error'}`} style={{ marginTop:12 }}>
          {allPass
            ? '🎓 Stage 6 Complete! You have built a production-ready full stack application.'
            : `❌ ${passCount}/${allReqs.length} requirements met. Check all four tabs.`}
        </div>
      )}
    </Stage6Shell>
  );
}
