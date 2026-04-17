// src/screens/WelcomeScreen.jsx
// Fires exactly once, immediately after first signup.
// Three things: name, chosen path, what they'll be able to do after Stage 1.
// One button: "Start my first level."
//
// Triggered by: AuthScreen sets localStorage('ql_new_user', '1') after signUp.
// Consumed by:  This screen clears the flag on mount, can never show twice.
// Skipped when: User has a ql_redirect destination (came through Level 0 flow).

import { useEffect, useState } from 'react';
import { useNavigate }         from 'react-router-dom';
import { useAuth }             from '../context/AuthContext';
import { useGame }             from '../context/GameContext';
import careerPaths             from '../data/careerPaths';
import './WelcomeScreen.css';

// ── What you'll be able to do after Stage 1 — per path ───────────────────
const STAGE1_OUTCOME = {
  'java-fullstack':  'design a relational database, model a REST API, and sketch a full-stack architecture before writing a single line of code.',
  'frontend-react':  'build responsive HTML/CSS layouts, understand the box model, and write accessible, semantic markup that developers trust.',
  'data-engineer':   'explain why data pipelines exist, design a normalised schema, and diagnose the three bugs that corrupt most production data.',
  'ml-ai-engineer':  'frame any business problem as a machine learning task, choose the right model family, and define a metric that actually measures success.',
  'cyber-security':  'think like an attacker, build a STRIDE threat model, map an attack surface, and harden an authentication system against brute force.',
  'ux-ui-designer':  'run an empathy interview, synthesise findings into a persona, and design a wireframe that solves a real user problem.',
  'math-student':    'work confidently with fractions, decimals, percentages, and ratios — the foundation every STEM subject builds on.',
  'frontend-react':  'build responsive layouts, understand CSS specificity, and write HTML that works for every user including screen readers.',
  'python-backend':  'design a REST API, write clean Python functions, and understand how HTTP requests move from client to server.',
};

// ── First level URL per path ──────────────────────────────────────────────
function getFirstLevelUrl(pathId) {
  const DOMAIN_SELECT = new Set(['java-fullstack', 'frontend-react', 'python-backend']);
  const LEGACY        = new Set(['java-fullstack', 'frontend-react', 'math-student']);
  if (DOMAIN_SELECT.has(pathId))  return `/domain-select?path=${pathId}`;
  if (pathId === 'math-student')  return '/stage/math/level/1';
  if (LEGACY.has(pathId))         return '/stage/1/level/0';
  return `/path/${pathId}/stage/1/level/0`;
}

// ── Particle dots background (pure CSS, no library) ──────────────────────
function Particles({ color }) {
  const dots = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x:  Math.random() * 100,
    y:  Math.random() * 100,
    s:  2 + Math.random() * 4,
    d:  2 + Math.random() * 6,
  }));
  return (
    <div className="ws-particles" aria-hidden>
      {dots.map(d => (
        <div key={d.id} className="ws-dot"
          style={{
            left:            `${d.x}%`,
            top:             `${d.y}%`,
            width:           d.s,
            height:          d.s,
            background:      color,
            animationDelay:  `${d.d}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function WelcomeScreen() {
  const navigate    = useNavigate();
  const { user }    = useAuth();
  const { activePath, setActivePath } = useGame();
  const [ready, setReady] = useState(false);

  // Resolve which path to show — activePath from context, or first in careerPaths
  const path = activePath
    || careerPaths.find(p => p.status === 'available')
    || careerPaths[0];

  const firstName = user?.name?.split(' ')[0]
    || user?.displayName?.split(' ')[0]
    || user?.email?.split('@')[0]
    || 'there';

  const outcome = STAGE1_OUTCOME[path?.id] || 'start building real skills from day one.';
  const firstUrl = getFirstLevelUrl(path?.id);

  // Animate in after a tick
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  function handleStart() {
    // Ensure activePath is set before navigating
    if (path && !activePath) setActivePath(path);
    navigate(firstUrl, { replace: true });
  }

  if (!path) {
    navigate('/home', { replace: true });
    return null;
  }

  return (
    <div className="ws-screen">
      <Particles color={path.color} />

      <div className={`ws-card ${ready ? 'ws-card--in' : ''}`}>

        {/* Path colour bar */}
        <div className="ws-color-bar" style={{ background: path.gradient || path.color }} />

        {/* Wordmark */}
        <div className="ws-logo">◈ QuestLearn</div>

        {/* Name */}
        <div className="ws-greeting">
          Welcome,{' '}
          <span className="ws-name">{firstName}.</span>
        </div>

        {/* Path card */}
        <div className="ws-path-card" style={{ '--wp': path.color }}>
          <div className="ws-path-emoji">{path.emoji}</div>
          <div className="ws-path-info">
            <div className="ws-path-label">Your path</div>
            <div className="ws-path-title" style={{ color: path.color }}>
              {path.title}
            </div>
            <div className="ws-path-sub">{path.subtitle}</div>
          </div>
        </div>

        {/* Outcome sentence */}
        <div className="ws-outcome">
          <span className="ws-outcome-label">After Stage 1 you'll be able to</span>
          <p className="ws-outcome-text">{outcome}</p>
        </div>

        {/* Stage 1 pill */}
        <div className="ws-stage-pill">
          <span className="ws-stage-dot" style={{ background: path.color }} />
          Stage 1 · 8 levels · about 2 hours
        </div>

        {/* CTA */}
        <button
          className="ws-cta"
          style={{ background: path.gradient || path.color }}
          onClick={handleStart}
        >
          Start my first level →
        </button>

        {/* Escape hatch */}
        <button className="ws-skip" onClick={() => navigate('/home', { replace: true })}>
          Browse all paths instead
        </button>

      </div>
    </div>
  );
}
