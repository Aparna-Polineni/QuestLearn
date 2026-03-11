// src/screens/stage4/Stage4Shell.jsx
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { ConceptReveal } from '../../components/LevelSupport';
import './Stage4Shell.css';

const LEVEL_TITLES = {
  0:  'Backend Concepts',
  1:  'Your First Endpoint',
  2:  'Request Params & Path Variables',
  3:  'The Patient Model',
  4:  'The Repository',
  5:  'The Service Layer',
  6:  'POST — Creating Records',
  7:  'Validation',
  8:  'Exception Handling',
  9:  'DELETE & PUT',
  10: 'Filtering & Queries',
  11: 'Relationships',
  12: 'Spring Security Basics',
  13: 'JWT Authentication',
  14: 'Testing with MockMvc',
  15: 'Full Backend Capstone',
};

const LEVEL_MODES = {
  0: 'CONCEPTS', 1: 'FILL',  2: 'FILL',  3: 'FILL',  4: 'FILL',
  5: 'FILL',     6: 'FILL',  7: 'FILL',  8: 'DEBUG', 9: 'FILL',
  10: 'FILL',    11: 'FILL', 12: 'DEBUG',13: 'BUILD', 14: 'FILL',
  15: 'BUILD',
};

export default function Stage4Shell({ levelId, canProceed, conceptReveal, children }) {
  const navigate = useNavigate();
  const { completeLevel, selectedDomain } = useGame();

  const color = selectedDomain?.color || '#f97316';
  const mode  = LEVEL_MODES[levelId] || 'BUILD';
  const title = LEVEL_TITLES[levelId] || `Level 4.${levelId}`;

  function handleComplete() {
    completeLevel(`4-${levelId}`);
    if (levelId < 15) navigate(`/stage/4/level/${levelId + 1}`);
    else navigate('/roadmap');
  }

  return (
    <div className="s4-shell">
      <div className="s4-topbar">
        <button className="s4-back" onClick={() => navigate('/roadmap')}>← Roadmap</button>
        <div className="s4-breadcrumb">
          <span className="s4-stage" style={{ color }}>Stage 4</span>
          <span className="s4-sep">›</span>
          <span className="s4-level">Level 4.{levelId}</span>
          <span className="s4-sep">›</span>
          <span className="s4-title">{title}</span>
        </div>
        <div className={`s4-mode-badge mode-${mode.toLowerCase()}`}>{mode}</div>
      </div>

      <div className="s4-content">{children}</div>

      <div className="s4-footer">
        {canProceed ? (
          <div className="s4-footer-complete">
            {conceptReveal && (
              <ConceptReveal
                concept={conceptReveal.concept}
                whatYouLearned={conceptReveal.whatYouLearned}
                realWorldUse={conceptReveal.realWorldUse}
                developerSays={conceptReveal.developerSays}
              />
            )}
            <button className="s4-proceed-btn" style={{ background: color }} onClick={handleComplete}>
              {levelId < 15 ? `Level Complete → 4.${levelId + 1}` : 'Stage 4 Complete → Stage 5 ✓'}
            </button>
          </div>
        ) : (
          <p className="s4-footer-hint">Complete the level above to proceed</p>
        )}
      </div>
    </div>
  );
}