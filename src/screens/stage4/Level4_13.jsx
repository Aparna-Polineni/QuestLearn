// src/screens/stage4/Level4_13.jsx — JWT Authentication (BUILD)
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage4Shell from './Stage4Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import CodeEditor from '../stage2/CodeEditor';
import './Level4_13.css';

const SUPPORT = {
  intro: {
    concept: 'JWT Authentication',
    tagline: 'The frontend sends a token. The backend verifies it. No session, no state.',
    whatYouWillDo: 'Build the JWT authentication flow: a login endpoint that returns a token, and a filter that validates the token on every subsequent request.',
    whyItMatters: 'JWT is how modern APIs handle authentication. No server-side sessions — the token itself contains the proof of identity. Your React frontend stores it and sends it with every request in the Authorization header.',
  },
  hints: [
    'The login endpoint receives username/password, authenticates with AuthenticationManager, and returns a JWT token string. The token is signed with a secret key — only your server can create valid tokens.',
    'JwtFilter extends OncePerRequestFilter. It reads the Authorization header, extracts the token (after "Bearer "), verifies it, and sets the SecurityContext so Spring knows the user is authenticated.',
    'Jwts.builder().setSubject(username).setExpiration(date).signWith(key).compact() creates a JWT. Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token) verifies one.',
  ],
  reveal: {
    concept: 'JWT Authentication Flow',
    whatYouLearned: 'Login: user sends credentials → server verifies → server returns JWT token. Subsequent requests: client sends token in header → JwtFilter intercepts → verifies token → sets authentication in SecurityContext → request proceeds. Stateless: the server stores nothing. The token is the proof.',
    realWorldUse: 'Your React app calls POST /api/auth/login, gets a token, stores it in localStorage. Every fetch call adds Authorization: Bearer <token>. The backend JwtFilter runs before every controller — if the token is valid, the request proceeds. If not, Spring Security returns 401.',
    developerSays: 'JWT is not a session. It is a signed certificate. The server issues it and can verify it — but cannot revoke it until it expires. For production, use short expiry (15min access token) + refresh tokens. For learning, a 24h token is fine.',
  },
};

const STARTER = `import io.jsonwebtoken.*;
import org.springframework.security.core.Authentication;

// TODO: Build the JwtService class with two methods:
// 1. generateToken(String username) — creates a JWT valid for 24 hours
//    Use Jwts.builder(), set subject to username, set expiration,
//    sign with HS256 + a secret key, and return .compact()
// 2. validateToken(String token) — returns the username if token is valid
//    Use Jwts.parserBuilder(), set signing key, parseClaimsJws(token),
//    return getBody().getSubject()
//    Wrap in try/catch — return null if invalid

// TODO: Build the AuthController with POST /api/auth/login:
// Accepts LoginRequest(username, password)
// Uses AuthenticationManager to authenticate
// If successful: returns a Map with "token" key and the JWT value
// If failed: returns 401 Unauthorized

// Note: In a real app these would be separate files.
// Write them here as inner classes for this exercise.`;

const CHECKS = [
  { id: 'jwt_builder',   label: 'Jwts.builder() used to create token',      test: c => c.includes('Jwts.builder()') },
  { id: 'subject',       label: 'setSubject sets the username in token',     test: c => c.includes('setSubject') || c.includes('subject') },
  { id: 'sign_with',     label: 'Token signed with a key',                  test: c => c.includes('signWith') },
  { id: 'expiration',    label: 'Token has an expiration',                   test: c => c.includes('setExpiration') || c.includes('expiration') },
  { id: 'validate',      label: 'parseClaimsJws validates the token',        test: c => c.includes('parseClaimsJws') },
  { id: 'auth_endpoint', label: 'POST /api/auth/login endpoint exists',      test: c => c.includes('/api/auth/login') || c.includes('auth/login') },
  { id: 'returns_token', label: 'Login returns token in response',           test: c => c.includes('token') && c.includes('return') },
];

export default function Level4_13() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage4Shell levelId={13} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l413-container">
          <div className="l413-brief">
            <div className="l413-brief-tag">// Build Mission — JWT Auth</div>
            <h2>Build the authentication layer for the <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'hospital'}</span> API.</h2>
            <p>Create the JwtService (generate + validate tokens) and the login endpoint that issues them.</p>
          </div>

          <div className="l413-jwt-flow">
            <div className="l413-flow-title">// JWT Authentication Flow</div>
            <div className="l413-flow-steps">
              {[
                { step: '1', label: 'React sends', code: 'POST /api/auth/login  { username, password }' },
                { step: '2', label: 'Server verifies credentials, returns', code: '{ "token": "eyJ..." }' },
                { step: '3', label: 'React stores token, sends with every request', code: 'Authorization: Bearer eyJ...' },
                { step: '4', label: 'JwtFilter verifies token, sets user in', code: 'SecurityContextHolder' },
                { step: '5', label: 'Controller runs with authenticated user', code: '@AuthenticationPrincipal' },
              ].map(s => (
                <div key={s.step} className="l413-flow-step">
                  <span className="l413-flow-num">{s.step}</span>
                  <span className="l413-flow-label">{s.label}</span>
                  <code className="l413-flow-code">{s.code}</code>
                </div>
              ))}
            </div>
          </div>

          <CodeEditor
            initialCode={STARTER}
            writableMarker="// TODO"
            onOutputChange={(_, ok) => {
              if (ok) setIsCorrect(true);
            }}
            hints={SUPPORT.hints}
            height={340}
            language="java"
          />
        </div>
      </LevelSupportWrapper>
    </Stage4Shell>
  );
}