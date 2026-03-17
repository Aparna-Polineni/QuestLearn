// src/screens/CareerPathSelect.jsx
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import careerPaths from '../data/careerPaths';
import './CareerPathSelect.css';

export default function CareerPathSelect() {
  const navigate = useNavigate();
  const { setSelectedCareerPath, selectedCareerPath } = useGame();
  const { user, signOut } = useAuth();

  // Paths that need domain selection before starting
  const DOMAIN_SELECT_PATHS = new Set(['java-fullstack', 'frontend-react', 'python-backend']);

  // Paths that use legacy /stage/ URL format
  const LEGACY_PATHS = new Set(['java-fullstack', 'frontend-react', 'math-student']);

  function getStartUrl(path) {
    if (path.id === 'math-student') return '/stage/math/level/1';
    if (LEGACY_PATHS.has(path.id)) return '/stage/1/level/0';
    // New paths use /path/{id}/stage/1/level/0
    return `/path/${path.id}/stage/1/level/0`;
  }

  function choosePath(path) {
    if (path.status === 'coming-soon') return;
    setSelectedCareerPath(path);
    if (DOMAIN_SELECT_PATHS.has(path.id)) {
      navigate('/domain-select');
    } else {
      navigate(getStartUrl(path));
    }
  }

  return (
    <div className="cps-screen">
      <div className="cps-bg-orb orb-1" />
      <div className="cps-bg-orb orb-2" />
      <div className="cps-bg-orb orb-3" />

      {/* Header */}
      <div className="cps-header">
        <div className="cps-logo">◈ QuestLearn</div>
        <div className="cps-header-right">
          {user && (
            <>
              <span className="cps-user-name">
                👋 {user.name || user.user_metadata?.name || user.email?.split('@')[0]}
              </span>
              <button className="cps-signout" onClick={() => { signOut(); navigate('/'); }}>
                Sign out
              </button>
            </>
          )}
        </div>
      </div>

      <div className="cps-content">
        <div className="cps-hero">
          <div className="cps-hero-tag">Choose your path</div>
          <h1 className="cps-headline">
            What do you want<br />
            <span className="cps-gradient">to become?</span>
          </h1>
          <p className="cps-sub">
            Every path is a complete curriculum — from zero to job ready.
            Pick the one that matches your goal.
          </p>
        </div>

        {/* Career path grid */}
        <div className="cps-grid">
          {careerPaths.map((path, i) => (
            <div
              key={path.id}
              className={`cps-card ${path.status === 'coming-soon' ? 'card-locked' : 'card-available'} ${selectedCareerPath?.id === path.id ? 'card-active' : ''}`}
              style={{ '--path-color': path.color, animationDelay: `${i * 0.06}s` }}
              onClick={() => choosePath(path)}
            >
              {/* Badge */}
              <div className="cps-badge">{path.badge}</div>

              {/* Header */}
              <div className="cps-card-header">
                <span className="cps-emoji">{path.emoji}</span>
                <div>
                  <h2 className="cps-card-title">{path.title}</h2>
                  <p className="cps-card-subtitle">{path.subtitle}</p>
                </div>
              </div>

              {/* Meta */}
              <div className="cps-meta">
                <span className="cps-meta-item">⏱ {path.duration}</span>
                <span className="cps-meta-item">📚 {path.totalLevels} levels</span>
                <span className="cps-meta-item">🎯 {path.level}</span>
              </div>

              {/* Skills */}
              <div className="cps-skills">
                {path.skills.map(s => (
                  <span key={s} className="cps-skill">{s}</span>
                ))}
              </div>

              {/* Stages */}
              <div className="cps-stages">
                {path.stages.slice(0, 4).map(stage => (
                  <div key={stage.id} className="cps-stage-dot" style={{ background: stage.color }} title={stage.title} />
                ))}
                {path.stages.length > 4 && (
                  <span className="cps-more-stages">+{path.stages.length - 4} more</span>
                )}
              </div>

              {/* Outcome */}
              <div className="cps-outcome">
                <span className="cps-outcome-label">🏆 Goal</span>
                <span className="cps-outcome-text">{path.outcome}</span>
              </div>

              {/* CTA */}
              <button
                className={`cps-btn ${path.status === 'coming-soon' ? 'btn-locked' : 'btn-start'}`}
                style={path.status !== 'coming-soon' ? { background: path.gradient } : {}}
              >
                {path.status === 'coming-soon' ? '🔒 Coming Soon' : `Start ${path.title} →`}
              </button>
            </div>
          ))}
        </div>

        <p className="cps-note">
          Progress is saved automatically. You can explore any path — your completion follows you.
        </p>
      </div>
    </div>
  );
}