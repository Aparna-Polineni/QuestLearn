// src/screens/DomainSelect.jsx
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import domains from '../data/domains';
import './DomainSelect.css';

function DomainSelect() {
  const navigate = useNavigate();
  const { setSelectedDomain, selectedCareerPath } = useGame();

  function chooseDomain(domain) {
    setSelectedDomain(domain);
    // Navigate to the correct Stage 1 start for the active career path
    const pathId = selectedCareerPath?.id;
    const LEGACY_PATHS = new Set(['java-fullstack', 'frontend-react', 'math-student']);
    if (!pathId || LEGACY_PATHS.has(pathId)) {
      navigate('/stage/1/level/0');
    } else {
      navigate(`/path/${pathId}/stage/1/level/0`);
    }
  }

  return (
    <div className="domain-screen">
      <div className="domain-bg-orb orb-1" />
      <div className="domain-bg-orb orb-2" />

      <div className="domain-content">

        <div className="domain-header">
          <div className="domain-logo">◈ QuestLearn</div>
          <div className="domain-stage-tag">Stage 1 — Design & Thinking</div>
          <h1 className="domain-headline">
            Choose your project.<br />
            <span className="domain-gradient">Everything you build starts here.</span>
          </h1>
          <p className="domain-sub">
            You'll design, wireframe, and architect this system across all 8 levels of Stage 1.
            Pick something that interests you — you'll spend a lot of time with it.
          </p>
        </div>

        <div className="domain-grid">
          {domains.map((domain, i) => (
            <div
              key={domain.id}
              className="domain-card"
              style={{ '--accent': domain.color, '--light': domain.light, animationDelay: `${i * 0.1}s` }}
              onClick={() => chooseDomain(domain)}
            >
              <div className="domain-card-glow" />
              <div className="domain-emoji">{domain.emoji}</div>
              <h2 className="domain-name" style={{ color: domain.color }}>{domain.name}</h2>
              <p className="domain-desc">{domain.description}</p>
              <div className="domain-features">
                <span className="domain-feature">🎮 8 interactive levels</span>
                <span className="domain-feature">🏗️ Real architecture design</span>
                <span className="domain-feature">📊 Visual drag & drop</span>
              </div>
              <button
                className="domain-btn"
                style={{ background: domain.color }}
              >
                Build This System →
              </button>
            </div>
          ))}
        </div>

        <p className="domain-note">
          You can always see other domains after completing Stage 1. Your choice shapes the content of every level.
        </p>
      </div>
    </div>
  );
}

export default DomainSelect;