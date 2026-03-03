// src/screens/Home.jsx
// Central hub — shown after login for returning users
// Shows: all active paths with resume buttons, profile, start new path

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import careerPaths from '../data/careerPaths';
import './Home.css';

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

  function handleStart(path) {
    setActivePath(path);
    // If needs domain selection
    if (['java-fullstack','frontend-react','python-backend'].includes(path.id)) {
      navigate('/domain-select');
    } else {
      navigate('/stage/1/level/1');
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

        {/* Active / started paths */}
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