// src/screens/stage6/Level6_3.jsx — Auth Flow End-to-End (FILL)
import { useState } from 'react';
import Stage6Shell from './Stage6Shell';
import FillEditor from '../stage2/FillEditor';

const BLANKS = [
  { id: 'POST',      answer: 'api.post("/api/auth/login", { email, password })', placeholder: 'Axios login call',         hint: 'POST to /api/auth/login with email and password in the body.' },
  { id: 'TOKEN',     answer: 'response.data.token',                               placeholder: 'extract JWT from response', hint: 'Spring returns { token: "eyJ..." } — pull the token out.' },
  { id: 'STORE',     answer: 'localStorage.setItem("token", token)',              placeholder: 'persist token',            hint: 'Store the token so it survives page refresh.' },
  { id: 'SETUSER',   answer: 'setUser(response.data.user)',                       placeholder: 'update auth context',      hint: 'Store the logged-in user in React context.' },
  { id: 'REMOVE',    answer: 'localStorage.removeItem("token")',                  placeholder: 'clear token on logout',    hint: 'Delete the token — user is now unauthenticated.' },
  { id: 'GETTOKEN',  answer: 'localStorage.getItem("token")',                     placeholder: 'read token on startup',    hint: 'Check if a token exists when the app first loads.' },
  { id: 'VERIFY',    answer: 'api.get("/api/auth/me")',                           placeholder: 'verify token still valid', hint: 'Call a protected endpoint to check the token hasn\'t expired.' },
];

const TEMPLATE = `// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // On app startup — restore session if token exists
  useEffect(() => {
    const token = [GETTOKEN];
    if (token) {
      [VERIFY]
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('token')); // token expired
    }
  }, []);

  async function login(email, password) {
    const response = await [POST];
    const token = [TOKEN];
    [STORE];
    [SETUSER];
  }

  function logout() {
    [REMOVE];
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);`;

export default function Level6_3() {
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage6Shell levelId={3} canProceed={isCorrect}
      conceptReveal={[
        { label: 'The Full Auth Loop', detail: 'Login → store token → Axios interceptor attaches it → Spring JwtFilter validates it → user stays logged in. On refresh: read token from localStorage → call /api/auth/me → if valid, restore user state. On logout: remove token → Axios no longer sends it → all future requests get 401.' },
        { label: '/api/auth/me', detail: 'This endpoint returns the logged-in user\'s details from the JWT. Spring\'s @AuthenticationPrincipal injects the user. React calls it on startup to verify the stored token is still valid and hasn\'t expired.' },
        { label: 'Never store tokens in memory only', detail: 'If user refreshes the page, in-memory state is lost. localStorage persists across refreshes. The tradeoff is XSS vulnerability — mitigate with short token expiry and httpOnly cookies in high-security apps.' },
      ]}
    >
      <div className="s6-intro">
        <h1>Auth Flow End-to-End</h1>
        <p className="s6-tagline">🔑 Login → JWT → localStorage → every request authenticated.</p>
        <p className="s6-why">This is the complete auth lifecycle: login, token storage, session restore on refresh, and logout. Understanding this flow means you can debug any auth issue in the full stack.</p>
      </div>

      <div className="s6-flow">
        {[
          ['User submits login form', 'email + password → React state'],
          ['React POSTs to /api/auth/login', 'Spring validates credentials with BCrypt'],
          ['Spring returns JWT', '{ token: "eyJ...", user: { id, name, email } }'],
          ['React stores token', 'localStorage.setItem("token", token)'],
          ['Axios interceptor picks it up', 'Added to every subsequent request automatically'],
          ['Page refresh? Token restored', 'useEffect reads localStorage → /api/auth/me verifies it'],
          ['Logout', 'localStorage.removeItem → user state cleared → redirect to /login'],
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
