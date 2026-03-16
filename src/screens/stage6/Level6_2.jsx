// src/screens/stage6/Level6_2.jsx — Axios Setup & Interceptors (FILL)
import { useState } from 'react';
import Stage6Shell from './Stage6Shell';
import FillEditor from '../stage2/FillEditor';

const BLANKS = [
  { id: 'BASE',      answer: 'baseURL: "http://localhost:8080"',         placeholder: 'baseURL config',          hint: 'Spring Boot runs on port 8080 — all requests prepend this.' },
  { id: 'TIMEOUT',   answer: 'timeout: 10000',                           placeholder: 'timeout in ms',           hint: '10 seconds — fail fast if the backend is down.' },
  { id: 'REQUSE',    answer: 'request.headers.Authorization',            placeholder: 'header to set',           hint: 'The header Spring Security checks for JWT.' },
  { id: 'TOKEN',     answer: '`Bearer ${token}`',                        placeholder: 'header value',            hint: 'JWT must be prefixed with "Bearer " — note the space.' },
  { id: 'STATUS',    answer: 'error.response.status',                    placeholder: 'check response status',   hint: 'The HTTP status code from the error response.' },
  { id: 'REDIRECT',  answer: 'window.location.href = "/login"',          placeholder: 'redirect on 401',         hint: 'Force the user back to login when the token expires.' },
];

const TEMPLATE = `// src/services/api.js
import axios from 'axios';

const api = axios.create({
  [BASE],
  [TIMEOUT],
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor — attach JWT to every request ──────────────────────
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.[REQUSE] = [TOKEN];
  }
  return config;
});

// ── Response interceptor — handle errors globally ──────────────────────────
api.interceptors.response.use(
  response => response,          // pass through successful responses
  error => {
    if ([STATUS] === 401) {
      localStorage.removeItem('token');
      [REDIRECT];
    }
    return Promise.reject(error); // re-throw for component-level handling
  }
);

export default api;`;

export default function Level6_2() {
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage6Shell levelId={2} canProceed={isCorrect}
      conceptReveal={[
        { label: 'Interceptors = Middleware', detail: 'The request interceptor runs before every Axios call — perfect for injecting the JWT. The response interceptor runs after every response — perfect for handling 401 (expired token) globally so no individual component needs to.' },
        { label: 'Bearer Token Format', detail: 'Spring\'s JwtFilter expects "Authorization: Bearer eyJhbGci...". The space after "Bearer" is mandatory. Without it, the filter won\'t parse the token and every request returns 401.' },
        { label: 'Using api vs fetch', detail: 'Import this api instance everywhere instead of using fetch() directly. Every component automatically gets the JWT header, timeout, and global error handling for free.' },
      ]}
    >
      <div className="s6-intro">
        <h1>Axios Setup & Interceptors</h1>
        <p className="s6-tagline">⚡ One config file — JWT on every request, 401 handled everywhere.</p>
        <p className="s6-why">Without interceptors, every component would need to manually add the Authorization header and handle token expiry. Interceptors centralise this — write once, works everywhere.</p>
      </div>

      <div className="s6-flow">
        {[
          ['React component calls api.get("/api/patients")', 'Component code — no token logic needed'],
          ['Request interceptor runs', 'Reads token from localStorage, adds Authorization: Bearer ... header'],
          ['Spring JwtFilter validates token', 'Extracts user, sets SecurityContext'],
          ['Controller handles request', 'Returns 200 with patient data'],
          ['Response interceptor runs', 'Passes response through — or handles 401 by redirecting to /login'],
        ].map(([title, desc], i) => (
          <div className="s6-step" key={i}>
            <div className="s6-step-num">{i + 1}</div>
            <div className="s6-step-body">
              <div className="s6-step-title">{title}</div>
              <div className="s6-step-desc">{desc}</div>
            </div>
          </div>
        ))}
      </div>

      <FillEditor template={TEMPLATE} blanks={BLANKS} onAllCorrect={() => setIsCorrect(true)} />
    </Stage6Shell>
  );
}
