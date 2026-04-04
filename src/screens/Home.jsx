// src/screens/Home.jsx
// Central hub — shown after login for returning users
// Shows: all active paths with resume buttons, profile, start new path

import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import careerPaths from '../data/careerPaths';
import './Home.css';

// ── Level context — "where were you" + "what's next" text ─────────────────
// One sentence per level so the dashboard can show context, not just a URL.
const LEVEL_CONTEXT = {
  'data-engineer': {
    '1-0':  ['What is Data Engineering?',   'Next: debug three real data quality bugs that corrupted live business data.'],
    '1-1':  ['Data Quality Disasters',      'Next: map the Extract → Transform → Load steps of a real pipeline.'],
    '1-2':  ['Anatomy of a Pipeline',       'Next: design a normalised database schema for a hospital system.'],
    '1-3':  ['Schema Design',               'Next: choose between batch and real-time processing for three business scenarios.'],
    '1-4':  ['Batch vs Streaming',          'Next: compare CSV, JSON, Parquet, and Avro — and learn when each one breaks.'],
    '1-5':  ['Data Formats',               'Next: map a complete modern data stack from ingestion to BI tool.'],
    '1-6':  ['The Data Stack',             'Next: design a complete pipeline architecture from scratch.'],
    '2-0':  ['SQL Basics',                  'Next: fill SELECT clauses that retrieve and filter real patient data.'],
    '2-1':  ['SELECT Fundamentals',         'Next: combine WHERE conditions and sort results precisely.'],
    '2-2':  ['Filtering & Sorting',         'Next: use GROUP BY, COUNT, and SUM to produce summary reports.'],
    '2-3':  ['Aggregation',                 'Next: connect patient, ward, and appointment tables with JOINs.'],
    '2-4':  ['JOINs',                       'Next: fix queries that silently return wrong results because of NULL comparisons.'],
    '2-5':  ['NULL Handling',               'Next: find four bugs producing silently wrong data in real hospital queries.'],
    '2-6':  ['SQL Bug Hunt',                'Next: rewrite nested subqueries as readable WITH blocks.'],
    '2-7':  ['Subqueries & CTEs',           'Next: compute running totals and rankings using window functions.'],
    '2-8':  ['Window Functions',            'Next: analyse query plans and add indexes to fix slow queries.'],
    '2-9':  ['Performance',                 'Next: handle concurrent writes without corrupting financial data.'],
    '2-10': ['Transactions & ACID',         'Next: decide when to use a document store instead of a relational database.'],
    '2-11': ['NoSQL Trade-offs',            'Next: write five production-grade queries — window functions, CTEs, and LAG.'],
    '2-12': ['Analytical Query Suite',      'Next: build a complete reporting layer for a hospital analytics database.'],
  },
  'ml-ai-engineer': {
    '1-0': ['What is ML?',                  'Next: map the 8-step ML workflow from problem to deployed model.'],
    '1-1': ['The ML Workflow',              'Next: convert three real business problems into supervised learning tasks.'],
    '1-2': ['Problem Framing',             'Next: identify what data is needed before a model can be trained.'],
    '1-3': ['Data Requirements',           'Next: match business problems to the correct model family.'],
    '1-4': ['Model Types',                 'Next: choose accuracy vs precision vs recall for each scenario.'],
    '1-5': ['Success Metrics',             'Next: diagnose overfitting, underfitting, and data leakage in real outputs.'],
    '1-6': ['ML Failure Modes',            'Next: frame a complete ML project from scratch with full justification.'],
    '2-0': ['Python for ML',               'Next: implement vectorised NumPy operations that power every ML computation.'],
    '2-1': ['NumPy Fundamentals',          'Next: load, inspect, and filter a real patient dataset with Pandas.'],
    '2-2': ['Pandas Basics',               'Next: fix missing values, wrong types, and duplicate rows.'],
    '2-3': ['Data Cleaning',               'Next: create five new features from existing columns.'],
    '2-4': ['Feature Engineering',         'Next: produce a full exploratory analysis with correlation matrix.'],
    '2-5': ['EDA',                         'Next: find three Pandas bugs that produce wrong training data silently.'],
    '2-6': ['Pandas Bug Hunt',             'Next: plot distributions and correlations that reveal model problems early.'],
    '2-7': ['Visualisation',               'Next: calculate mean, variance, and correlation from scratch.'],
    '2-8': ['Statistics for ML',           'Next: implement dot product and matrix operations for neural networks.'],
    '2-9': ['Linear Algebra',              'Next: compute conditional probability and Bayes rule for a medical scenario.'],
    '2-10':['Probability Basics',          'Next: connect cleaning, engineering, and splitting into a Python module.'],
    '2-11':['Data Pipeline',               'Next: implement mean() from scratch — the foundation of every ML metric.'],
    '2-12':['NumPy BUILD',                 'Next: build a complete ML data pipeline with validation assertions.'],
  },
  'cyber-security': {
    '1-0': ['What is Cyber Security?',     'Next: apply STRIDE to find attack vectors in a hospital booking system.'],
    '1-1': ['Threat Modelling',            'Next: map every entry point an attacker could exploit.'],
    '1-2': ['Attack Surfaces',             'Next: identify phishing and pretexting attacks from real email samples.'],
    '1-3': ['Social Engineering',          'Next: design an authentication system that prevents credential stuffing.'],
    '1-4': ['Password & Auth Security',    'Next: choose the right encryption for data at rest vs in transit.'],
    '1-5': ['Encryption Basics',           'Next: think like an attacker — enumerate, scan, exploit, persist.'],
    '1-6': ['Attacker Mindset',            'Next: produce a full threat model for a real application.'],
  },
  'ux-ui-designer': {
    '1-0': ['What is UX Design?',          'Next: apply the five-phase Design Thinking framework to a broken booking form.'],
    '1-1': ['Design Thinking',             'Next: write an empathy interview guide and synthesise findings into a persona.'],
    '1-2': ['User Research',               'Next: sketch three wireframes for a mobile appointment booking flow.'],
    '1-3': ['Wireframing',                 'Next: restructure a confusing navigation so users find what they need in two clicks.'],
    '1-4': ['Information Architecture',   'Next: redesign a cluttered dashboard so the most important data stands out.'],
    '1-5': ['Visual Hierarchy',            'Next: plan a five-user usability test and document actionable findings.'],
    '1-6': ['Usability Testing',           'Next: design a complete user flow from persona to prototype.'],
  },
};

// Derive current-level context from a lastRoute URL
function getLevelContext(pathId, lastRoute) {
  if (!lastRoute || !pathId) return null;
  // Match both /path/{id}/stage/{s}/level/{l} and /stage/{s}/level/{l}
  const m = lastRoute.match(/stage\/(\d+(?:\.\d+)?)\/level\/(\d+)/);
  if (!m) return null;
  const key = `${m[1]}-${m[2]}`;
  return LEVEL_CONTEXT[pathId]?.[key] || null;
}

const STAGE_LEVEL_COUNTS = { 1:8, 2:20, 3:15, 4:18, 5:22, 6:14, 7:12, 8:10 };
const TOTAL_LEVELS = Object.values(STAGE_LEVEL_COUNTS).reduce((a,b) => a+b, 0);

function ProfilePanel({ user, onClose }) {
  const { signOut } = useAuth();
  const { totalXpAllPaths, allPaths } = useGame();
  const navigate = useNavigate();
  const pathsStarted = Object.keys(allPaths).length;

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-panel" onClick={e => e.stopPropagation()}>
        <div className="profile-avatar">
          {(user?.name || user?.email || 'U')[0].toUpperCase()}
        </div>
        <div className="profile-name">{user?.name || user?.user_metadata?.name || 'Learner'}</div>
        <div className="profile-email">{user?.email}</div>

        <div className="profile-stats">
          <div className="profile-stat">
            <span className="pstat-num">{totalXpAllPaths.toLocaleString()}</span>
            <span className="pstat-label">Total XP</span>
          </div>
          <div className="profile-stat">
            <span className="pstat-num">{pathsStarted}</span>
            <span className="pstat-label">Paths Started</span>
          </div>
        </div>

        <div className="profile-actions">
          <button className="profile-roadmap-btn" onClick={() => { navigate('/roadmap'); onClose(); }}>
            🗺️ View Roadmap
          </button>
          <button className="profile-signout-btn" onClick={() => { signOut(); navigate('/auth'); }}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 7-dot activity streak ─────────────────────────────────────────────────
// Shows filled/empty dots for last 7 days. lastActiveDates is an array of
// ISO date strings stored in pathData. Falls back to streak count if no dates.
function StreakDots({ lastActiveDates = [], streak = 0 }) {
  const today = new Date();
  const dots = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const iso = d.toISOString().slice(0, 10);
    return { iso, active: lastActiveDates.includes(iso) };
  });

  // If no date history, just show streak count as filled dots (up to 7)
  const hasDateHistory = lastActiveDates.length > 0;
  const filledFromStreak = hasDateHistory ? 0 : Math.min(streak, 7);

  return (
    <div className="streak-bar">
      <span className="streak-label">This week</span>
      <div className="streak-dots">
        {dots.map((d, i) => (
          <div
            key={i}
            className={`streak-dot ${
              hasDateHistory ? (d.active ? 'dot-active' : 'dot-empty') :
              i >= 7 - filledFromStreak ? 'dot-active' : 'dot-empty'
            }`}
            title={d.iso}
          />
        ))}
      </div>
      <span className="streak-count">
        {streak > 0 ? `${streak} level${streak !== 1 ? 's' : ''} completed` : 'No activity yet'}
      </span>
    </div>
  );
}

// ── Stage progress bar ─────────────────────────────────────────────────────
// Shows "Stage 1 — 5 of 8 levels done" for each stage the user has touched
function StageProgressBar({ stage, completedCount, color }) {
  const total = stage.levels || 8;
  const pct   = Math.round((completedCount / total) * 100);
  return (
    <div className="spb-row">
      <div className="spb-meta">
        <span className="spb-emoji">{stage.emoji}</span>
        <span className="spb-name">Stage {stage.id} — {stage.title}</span>
        <span className="spb-count">{completedCount} / {total}</span>
      </div>
      <div className="spb-track">
        <div className="spb-fill" style={{ width: `${pct}%`, background: color || stage.color }} />
      </div>
    </div>
  );
}

// ── Resume card ────────────────────────────────────────────────────────────
// The top-of-dashboard "where were you" moment
function ResumeCard({ path, pathData, onResume }) {
  const ctx        = getLevelContext(path.id, pathData?.lastRoute);
  const levelLabel = pathData?.lastRoute?.match(/stage\/(\d+(?:\.\d+)?)\/level\/(\d+)/);
  const stageId    = levelLabel?.[1];
  const levelIdx   = levelLabel?.[2];

  // Stage progress bars — only for stages the user has started
  const stageProgress = (path.stages || []).map(stage => {
    const sid = String(stage.id);
    const pfx = { 'data-engineer':'de','ml-ai-engineer':'ml','cyber-security':'cy','ux-ui-designer':'ux' }[path.id];
    const count = Object.keys(pathData?.completedLevels || {}).filter(k => {
      const normalised = pfx ? k.replace(pfx + '-', '') : k;
      return normalised.startsWith(sid + '-');
    }).length;
    return { stage, count };
  }).filter(s => s.count > 0);

  return (
    <div className="resume-card" style={{ '--rc': path.color }}>
      <div className="resume-card-top">
        <div className="resume-path-badge">
          <span>{path.emoji}</span>
          <span>{path.title}</span>
        </div>
        {stageId && levelIdx && (
          <div className="resume-position">
            Stage {stageId} · Level {levelIdx}
          </div>
        )}
      </div>

      {/* Where you were */}
      {ctx ? (
        <div className="resume-context">
          <div className="resume-context-label">You were learning</div>
          <div className="resume-level-name">{ctx[0]}</div>
          <div className="resume-next">{ctx[1]}</div>
        </div>
      ) : (
        <div className="resume-context">
          <div className="resume-level-name">Continue from where you left off</div>
        </div>
      )}

      {/* Stage progress bars */}
      {stageProgress.length > 0 && (
        <div className="resume-stages">
          {stageProgress.map(({ stage, count }) => (
            <StageProgressBar
              key={stage.id}
              stage={stage}
              completedCount={count}
              color={path.color}
            />
          ))}
        </div>
      )}

      {/* Streak + CTA row */}
      <div className="resume-footer">
        <StreakDots
          lastActiveDates={pathData?.lastActiveDates || []}
          streak={pathData?.streak || 0}
        />
        <button
          className="resume-cta"
          style={{ background: path.gradient || path.color }}
          onClick={() => onResume(path)}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

function PathCard({ path, pathData, onResume, onStart, isActive }) {
  const completed = Object.keys(pathData?.completedLevels || {}).length;
  const total     = path.totalLevels;
  const pct       = Math.round((completed / total) * 100);
  const hasStarted = completed > 0 || pathData?.domain;

  return (
    <div className={`home-path-card ${isActive ? 'path-card-active' : ''} ${path.status === 'coming-soon' ? 'path-card-locked' : ''}`}
      style={{ '--pc': path.color }}>
      {isActive && <div className="path-active-badge">▶ Active</div>}
      {path.status === 'coming-soon' && <div className="path-coming-badge">Coming Soon</div>}

      <div className="hpc-header">
        <span className="hpc-emoji">{path.emoji}</span>
        <div>
          <div className="hpc-title">{path.title}</div>
          <div className="hpc-sub">{path.subtitle}</div>
        </div>
      </div>

      {hasStarted && (
        <>
          <div className="hpc-progress-bar">
            <div className="hpc-progress-fill" style={{ width: `${pct}%`, background: path.gradient }} />
          </div>
          <div className="hpc-progress-label">
            {completed} / {total} levels · {pct}% complete
            {pathData?.domain && <span className="hpc-domain"> · {pathData.domain.emoji} {pathData.domain.name}</span>}
          </div>
        </>
      )}

      {path.status !== 'coming-soon' && (
        <button
          className="hpc-btn"
          style={{ background: path.gradient }}
          onClick={() => hasStarted ? onResume(path) : onStart(path)}
        >
          {hasStarted ? `▶ Continue — ${getNextLevelLabel(pathData)}` : `Start ${path.title} →`}
        </button>
      )}
    </div>
  );
}

function getNextLevelLabel(pathData) {
  if (!pathData) return 'Level 1.1';
  const route = pathData.lastRoute || '/stage/1/level/1';
  const match = route.match(/stage\/(\d+)\/level\/(\d+)/);
  if (match) return `Level ${match[1]}.${match[2]}`;
  return 'Next Level';
}

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { allPaths, activePath, setActivePath, setSelectedDomain, getResumeRoute } = useGame();
  const [showProfile, setShowProfile] = useState(false);

  // Record today as an active date whenever the user loads the dashboard
  // This powers the 7-dot streak indicator
  const { updatePathData } = useGame();
  useEffect(() => {
    if (!activePath) return;
    const today = new Date().toISOString().slice(0, 10);
    const pathData = allPaths[activePath.id];
    const existing = pathData?.lastActiveDates || [];
    if (!existing.includes(today)) {
      // Keep last 30 days only
      const updated = [...existing, today].slice(-30);
      if (updatePathData) {
        updatePathData(activePath.id, prev => ({
          ...prev,
          lastActiveDates: updated,
        }));
      }
    }
  }, [activePath?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const firstName = user?.name?.split(' ')[0] || user?.user_metadata?.name?.split(' ')[0] || 'there';

  // Paths the user has started
  const startedPaths  = careerPaths.filter(p => allPaths[p.id]);
  const availablePaths = careerPaths.filter(p => !allPaths[p.id] && p.status === 'available');
  const comingSoon     = careerPaths.filter(p => p.status === 'coming-soon');

  function handleResume(path) {
    setActivePath(path);
    const route = getResumeRoute(path.id);
    navigate(route);
  }

  // Paths that need domain selection before starting
  const DOMAIN_SELECT_PATHS = new Set(['java-fullstack', 'frontend-react', 'python-backend']);
  // Paths that use legacy /stage/ URL format
  const LEGACY_PATHS = new Set(['java-fullstack', 'frontend-react', 'math-student']);

  function getStartUrl(pathId) {
    if (pathId === 'math-student') return '/stage/math/level/1';
    if (LEGACY_PATHS.has(pathId)) return '/stage/1/level/0';
    return `/path/${pathId}/stage/1/level/0`;
  }

  function handleStart(path) {
    setActivePath(path);
    if (DOMAIN_SELECT_PATHS.has(path.id)) {
      // Pass pathId in URL so DomainSelect doesn't depend on async context state
      navigate(`/domain-select?path=${path.id}`);
    } else {
      navigate(getStartUrl(path.id));
    }
  }

  const totalXp = Object.values(allPaths).reduce((sum, p) => sum + (p.xp || 0), 0);

  return (
    <div className="home-screen">
      <div className="home-bg-orb home-orb1" />
      <div className="home-bg-orb home-orb2" />

      {/* Top nav */}
      <div className="home-nav">
        <div className="home-logo">◈ QuestLearn</div>
        <div className="home-nav-right">
          <span className="home-xp">⚡ {totalXp.toLocaleString()} XP</span>
          <button className="home-avatar-btn" onClick={() => setShowProfile(true)}>
            {(user?.name || user?.email || 'U')[0].toUpperCase()}
          </button>
        </div>
      </div>

      <div className="home-content">

        {/* Greeting */}
        <div className="home-greeting">
          <h1 className="home-hello">
            {startedPaths.length > 0 ? `Welcome back, ${firstName}.` : `Hey ${firstName}, let's begin.`}
          </h1>
          <p className="home-hello-sub">
            {startedPaths.length > 0
              ? 'Pick up where you left off or start a new path.'
              : 'Choose your first career path below.'}
          </p>
        </div>

        {/* Resume card — most recently active path, shown when user has started something */}
        {activePath && allPaths[activePath.id] && (
          <ResumeCard
            path={activePath}
            pathData={allPaths[activePath.id]}
            onResume={handleResume}
          />
        )}

        {/* All started paths */}
        {startedPaths.length > 0 && (
          <section className="home-section">
            <div className="home-section-label">// Your Paths</div>
            <div className="home-path-grid">
              {startedPaths.map(path => (
                <PathCard
                  key={path.id}
                  path={path}
                  pathData={allPaths[path.id]}
                  onResume={handleResume}
                  onStart={handleStart}
                  isActive={activePath?.id === path.id}
                />
              ))}
            </div>
          </section>
        )}

        {/* Available new paths */}
        {availablePaths.length > 0 && (
          <section className="home-section">
            <div className="home-section-label">
              {startedPaths.length > 0 ? '// Start Another Path' : '// Choose Your Path'}
            </div>
            <div className="home-path-grid">
              {availablePaths.map(path => (
                <PathCard
                  key={path.id}
                  path={path}
                  pathData={null}
                  onResume={handleResume}
                  onStart={handleStart}
                  isActive={false}
                />
              ))}
            </div>
          </section>
        )}

        {/* Coming soon */}
        {comingSoon.length > 0 && (
          <section className="home-section">
            <div className="home-section-label">// Coming Soon</div>
            <div className="home-path-grid">
              {comingSoon.map(path => (
                <PathCard key={path.id} path={path} pathData={null} onResume={() => {}} onStart={() => {}} isActive={false} />
              ))}
            </div>
          </section>
        )}

      </div>

      {showProfile && <ProfilePanel user={user} onClose={() => setShowProfile(false)} />}
    </div>
  );
}