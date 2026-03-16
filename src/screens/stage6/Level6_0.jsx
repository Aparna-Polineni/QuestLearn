// src/screens/stage6/Level6_0.jsx — Full Stack Architecture (CONCEPTS)
import { useState } from 'react';
import Stage6Shell from './Stage6Shell';
import './Level6_0.css';

const CONCEPTS = [
  {
    id: 'overview',
    title: 'The Full Stack Picture',
    body: 'Your React app (port 3000) talks to your Spring Boot API (port 8080) over HTTP. Spring Boot talks to MySQL. In production all three run on the same server, but during development they run separately — which is why CORS is needed.',
  },
  {
    id: 'cors',
    title: 'Why CORS Exists',
    body: 'Browsers block JavaScript from calling APIs on different origins (different port = different origin). CORS (Cross-Origin Resource Sharing) is the Spring Boot header that tells the browser "this React app is allowed to call me". Without it, every API call fails in the browser — but works fine in Postman.',
  },
  {
    id: 'axios',
    title: 'Axios — The HTTP Client',
    body: 'Axios is the library React uses to call your Spring Boot API. It wraps fetch() with better defaults: automatic JSON parsing, interceptors for adding the Authorization header to every request, and cleaner error handling.',
  },
  {
    id: 'auth',
    title: 'JWT Auth Flow',
    body: 'User logs in → React POSTs to /api/auth/login → Spring validates credentials → returns JWT token → React stores token in localStorage → every subsequent API call sends "Authorization: Bearer <token>" in the header → Spring\'s JwtFilter validates it.',
  },
  {
    id: 'errors',
    title: 'Error Handling Across the Stack',
    body: 'Spring\'s @ControllerAdvice catches backend errors and returns consistent JSON error bodies. React\'s Axios interceptors catch 401/403/500 responses globally and show toast notifications or redirect to login — without every component needing its own error handling.',
  },
  {
    id: 'websockets',
    title: 'WebSockets — Real-Time',
    body: 'HTTP is request-response — the client always initiates. WebSockets are persistent two-way connections. Spring Boot + STOMP lets the server push updates to React in real time: "new patient admitted", "ward capacity changed". No polling needed.',
  },
];

export default function Level6_0() {
  const [seen, setSeen] = useState(new Set());

  function toggle(id) {
    setSeen(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  const allSeen = seen.size >= CONCEPTS.length;

  return (
    <Stage6Shell levelId={0} canProceed={allSeen}>
      <div className="s6-intro">
        <h1>Full Stack Architecture</h1>
        <p className="s6-tagline">🔗 Stages 3–5 built the parts. Stage 6 connects them.</p>
        <p className="s6-why">You have a React frontend, a Spring Boot API, and a MySQL database. This stage is about making them work together reliably — with auth, error handling, file upload, and real-time updates.</p>
      </div>

      <div className="s6-diagram">
        <div className="s6-box react">
          <div className="s6-box-label">Stage 3</div>
          <div className="s6-box-name">⚛️ React</div>
        </div>
        <div className="s6-arrow">→ Axios →</div>
        <div className="s6-box jwt">
          <div className="s6-box-label">Stage 6</div>
          <div className="s6-box-name">🔑 JWT</div>
        </div>
        <div className="s6-arrow">→ CORS →</div>
        <div className="s6-box spring">
          <div className="s6-box-label">Stage 4</div>
          <div className="s6-box-name">🍃 Spring</div>
        </div>
        <div className="s6-arrow">→ JPA →</div>
        <div className="s6-box db">
          <div className="s6-box-label">Stage 5</div>
          <div className="s6-box-name">🐘 MySQL</div>
        </div>
      </div>

      <div className="s6-cards">
        {CONCEPTS.map(c => (
          <div key={c.id} className={`s6-card ${seen.has(c.id) ? 'seen' : ''}`} onClick={() => toggle(c.id)}>
            <div className="s6-card-top">
              <span className="s6-card-title">{c.title}</span>
              <span className="s6-chevron">{seen.has(c.id) ? '▲' : '▼'}</span>
            </div>
            {seen.has(c.id) && <p className="s6-card-body">{c.body}</p>}
          </div>
        ))}
      </div>

      {!allSeen && <p style={{ textAlign:'center', color:'#475569', fontSize:13, marginTop:16 }}>Open all {CONCEPTS.length} cards to continue →</p>}
      {allSeen && <div className="s6-feedback success">✅ You have the full picture. Let's wire it all together.</div>}
    </Stage6Shell>
  );
}
