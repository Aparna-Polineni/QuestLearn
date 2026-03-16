// src/screens/stage7/Stage7Shell.jsx
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { ConceptReveal } from '../../components/LevelSupport';
import './Stage7Shell.css';

const LEVEL_TITLES = {
  0:  'DevOps Concepts',
  1:  'Dockerise Spring Boot',
  2:  'Dockerise React',
  3:  'Docker Compose',
  4:  'Docker Bug Hunt',
  5:  'GitHub Actions — CI',
  6:  'GitHub Actions — CD',
  7:  'AWS EC2',
  8:  'AWS RDS',
  9:  'Environment Variables',
  10: 'Production Bug Hunt',
  11: 'Deployment Capstone',
};

const LEVEL_MODES = {
  0:  'CONCEPTS',
  1:  'FILL', 2:  'FILL', 3:  'FILL', 4:  'DEBUG',
  5:  'FILL', 6:  'FILL', 7:  'FILL', 8:  'FILL',
  9:  'FILL', 10: 'DEBUG', 11: 'BUILD',
};

const STAGE_COLOR = '#ef4444';

export default function Stage7Shell({ levelId, canProceed, conceptReveal, children }) {
  const navigate = useNavigate();
  const { completeLevel } = useGame();

  const mode  = LEVEL_MODES[levelId] || 'FILL';
  const title = LEVEL_TITLES[levelId] || `Level 7.${levelId}`;

  function handleComplete() {
    completeLevel(`7-${levelId}`);
    if (levelId < 11) navigate(`/stage/7/level/${levelId + 1}`);
    else navigate('/roadmap');
  }

  return (
    <div className="s7-shell">
      <div className="s7-topbar">
        <button className="s7-back" onClick={() => navigate('/roadmap')}>← Roadmap</button>
        <div className="s7-breadcrumb">
          <span className="s7-stage" style={{ color: STAGE_COLOR }}>Stage 7</span>
          <span className="s7-sep">›</span>
          <span className="s7-level">Level 7.{levelId}</span>
          <span className="s7-sep">›</span>
          <span className="s7-title">{title}</span>
        </div>
        <div className={`s7-mode-badge mode-${mode.toLowerCase()}`}>{mode}</div>
      </div>

      <div className="s7-content">{children}</div>

      {conceptReveal && (
        <ConceptReveal items={conceptReveal} stageColor={STAGE_COLOR} />
      )}

      <div className="s7-footer">
        <button
          className="s7-proceed-btn"
          style={{ background: canProceed ? STAGE_COLOR : '#334155' }}
          disabled={!canProceed}
          onClick={handleComplete}
        >
          {levelId < 11 ? `Continue to 7.${levelId + 1} →` : '🎓 Stage Complete!'}
        </button>
      </div>
    </div>
  );
}
