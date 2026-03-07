// src/screens/stage3/Stage3Shell.jsx
// Wrapper for all Stage 3 levels — same structure as Stage2Shell

import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { ConceptReveal } from '../../components/LevelSupport';
import './Stage3Shell.css';

const LEVEL_TITLES = {
  0:  'React Concepts',
  1:  'Your First Component',
  2:  'Props',
  3:  'useState',
  4:  'Lists & .map()',
  5:  'Forms',
  6:  'useEffect',
  7:  'Routing',
  8:  'API Integration',
  9:  'Error & Loading States',
  10: 'Context',
  11: 'Custom Hooks',
  12: 'useReducer',
  13: 'Performance',
  14: 'Auth & Protected Routes',
  15: 'The Complete Frontend',
};

const LEVEL_MODES = {
  0: 'CONCEPTS', 1: 'FILL', 2: 'FILL', 3: 'FILL', 4: 'FILL', 5: 'FILL',
  6: 'FILL', 7: 'BUILD', 8: 'BUILD', 9: 'DEBUG', 10: 'BUILD',
  11: 'BUILD', 12: 'FILL', 13: 'DEBUG', 14: 'BUILD', 15: 'BUILD',
};

export default function Stage3Shell({ levelId, canProceed, conceptReveal, children }) {
  const navigate   = useNavigate();
  const { activePath, completeLevel, selectedDomain } = useGame();

  const color = selectedDomain?.color || '#818cf8';
  const mode  = LEVEL_MODES[levelId] || 'BUILD';
  const title = LEVEL_TITLES[levelId] || `Level 3.${levelId}`;

  function handleComplete() {
    completeLevel(`3-${levelId}`);
    navigate(`/stage/3/level/${levelId + 1}`);
  }

  return (
    <div className="s3-shell">

      {/* Top bar */}
      <div className="s3-topbar">
        <button className="s3-back" onClick={() => navigate('/roadmap')}>← Roadmap</button>
        <div className="s3-breadcrumb">
          <span className="s3-stage" style={{ color }}>Stage 3</span>
          <span className="s3-sep">›</span>
          <span className="s3-level">Level 3.{levelId}</span>
          <span className="s3-sep">›</span>
          <span className="s3-title">{title}</span>
        </div>
        <div className={`s3-mode-badge mode-${mode.toLowerCase()}`}>{mode}</div>
      </div>

      {/* Content */}
      <div className="s3-content">{children}</div>

      {/* Footer */}
      <div className="s3-footer">
        {canProceed ? (
          <div className="s3-footer-complete">
            {conceptReveal && (
              <ConceptReveal
                concept={conceptReveal.concept}
                whatYouLearned={conceptReveal.whatYouLearned}
                realWorldUse={conceptReveal.realWorldUse}
                developerSays={conceptReveal.developerSays}
              />
            )}
            <button className="s3-proceed-btn" style={{ background: color }} onClick={handleComplete}>
              Level Complete → 3.{levelId + 1}
            </button>
          </div>
        ) : (
          <p className="s3-footer-hint">Complete the level above to proceed</p>
        )}
      </div>

    </div>
  );
}