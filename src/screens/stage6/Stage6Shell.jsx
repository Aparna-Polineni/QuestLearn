// src/screens/stage6/Stage6Shell.jsx
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { ConceptReveal } from '../../components/LevelSupport';
import './Stage6Shell.css';

const LEVEL_TITLES = {
  0:  'Full Stack Architecture',
  1:  'CORS Configuration',
  2:  'Axios Setup & Interceptors',
  3:  'Auth Flow End-to-End',
  4:  'Auth Bug Hunt',
  5:  'Global Error Handling',
  6:  'Protected Routes',
  7:  'File Upload',
  8:  'Full CRUD Integration',
  9:  'Pagination & Sorting',
  10: 'Integration Bug Hunt',
  11: 'WebSockets',
  12: 'Real-Time Notifications',
  13: 'Full Stack Capstone',
};

const LEVEL_MODES = {
  0:  'CONCEPTS',
  1:  'FILL', 2:  'FILL', 3:  'FILL', 4:  'DEBUG',
  5:  'FILL', 6:  'BUILD', 7:  'FILL', 8:  'BUILD',
  9:  'FILL', 10: 'DEBUG', 11: 'FILL', 12: 'BUILD',
  13: 'BUILD',
};

const STAGE_COLOR = '#fbbf24';

export default function Stage6Shell({ levelId, canProceed, conceptReveal, children }) {
  const navigate = useNavigate();
  const { completeLevel } = useGame();

  const mode  = LEVEL_MODES[levelId] || 'FILL';
  const title = LEVEL_TITLES[levelId] || `Level 6.${levelId}`;

  function handleComplete() {
    completeLevel(`6-${levelId}`);
    if (levelId < 13) navigate(`/stage/6/level/${levelId + 1}`);
    else navigate('/roadmap');
  }

  return (
    <div className="s6-shell">
      <div className="s6-topbar">
        <button className="s6-back" onClick={() => navigate('/roadmap')}>← Roadmap</button>
        <div className="s6-breadcrumb">
          <span className="s6-stage" style={{ color: STAGE_COLOR }}>Stage 6</span>
          <span className="s6-sep">›</span>
          <span className="s6-level">Level 6.{levelId}</span>
          <span className="s6-sep">›</span>
          <span className="s6-title">{title}</span>
        </div>
        <div className={`s6-mode-badge mode-${mode.toLowerCase()}`}>{mode}</div>
      </div>

      <div className="s6-content">{children}</div>

      {conceptReveal && (
        <ConceptReveal items={conceptReveal} stageColor={STAGE_COLOR} />
      )}

      <div className="s6-footer">
        <button
          className="s6-proceed-btn"
          style={{ background: canProceed ? STAGE_COLOR : '#334155', color: canProceed ? '#0f172a' : '#64748b' }}
          disabled={!canProceed}
          onClick={handleComplete}
        >
          {levelId < 13 ? `Continue to 6.${levelId + 1} →` : '🎓 Stage Complete!'}
        </button>
      </div>
    </div>
  );
}
