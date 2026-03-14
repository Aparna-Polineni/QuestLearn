// src/screens/stage5/Stage5Shell.jsx
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { ConceptReveal } from '../../components/LevelSupport';
import './Stage5Shell.css';

const LEVEL_TITLES = {
  0:  'Database Concepts',
  1:  'CREATE TABLE & Data Types',
  2:  'INSERT & SELECT',
  3:  'WHERE & Filtering',
  4:  'UPDATE & DELETE',
  5:  'Primary Keys',
  6:  'Foreign Keys & Relationships',
  7:  'JOINs',
  8:  'Aggregate Functions',
  9:  'Common SQL Mistakes',
  10: 'Subqueries',
  11: 'Indexes',
  12: '@Entity — Java to Table',
  13: '@Column, @Id, @GeneratedValue',
  14: 'JpaRepository',
  15: 'Derived Query Methods',
  16: '@Query with JPQL',
  17: '@ManyToOne & @OneToMany',
  18: '@ManyToMany',
  19: 'N+1 & LAZY vs EAGER',
  20: 'Flyway Migrations',
  21: 'Stage 5 Capstone',
};

const LEVEL_MODES = {
  0:  'CONCEPTS',
  1:  'FILL',  2:  'FILL',  3:  'FILL',  4:  'FILL',
  5:  'BUILD', 6:  'FILL',  7:  'FILL',  8:  'BUILD',
  9:  'DEBUG', 10: 'FILL',  11: 'FILL',
  12: 'FILL',  13: 'FILL',  14: 'FILL',  15: 'FILL',
  16: 'BUILD', 17: 'FILL',  18: 'FILL',
  19: 'DEBUG', 20: 'FILL',  21: 'BUILD',
};

const STAGE_COLOR = '#818cf8';

export default function Stage5Shell({ levelId, canProceed, conceptReveal, children }) {
  const navigate = useNavigate();
  const { completeLevel } = useGame();

  const mode  = LEVEL_MODES[levelId] || 'FILL';
  const title = LEVEL_TITLES[levelId] || `Level 5.${levelId}`;

  function handleComplete() {
    completeLevel(`5-${levelId}`);
    if (levelId < 21) navigate(`/stage/5/level/${levelId + 1}`);
    else navigate('/roadmap');
  }

  return (
    <div className="s5-shell">
      <div className="s5-topbar">
        <button className="s5-back" onClick={() => navigate('/roadmap')}>← Roadmap</button>
        <div className="s5-breadcrumb">
          <span className="s5-stage" style={{ color: STAGE_COLOR }}>Stage 5</span>
          <span className="s5-sep">›</span>
          <span className="s5-level">Level 5.{levelId}</span>
          <span className="s5-sep">›</span>
          <span className="s5-title">{title}</span>
        </div>
        <div className={`s5-mode-badge mode-${mode.toLowerCase()}`}>{mode}</div>
      </div>

      <div className="s5-content">{children}</div>

      <div className="s5-footer">
        {canProceed ? (
          <div className="s5-footer-complete">
            {conceptReveal && (
              <ConceptReveal
                concept={conceptReveal.concept}
                whatYouLearned={conceptReveal.whatYouLearned}
                realWorldUse={conceptReveal.realWorldUse}
                developerSays={conceptReveal.developerSays}
              />
            )}
            <button className="s5-proceed-btn" onClick={handleComplete}>
              {levelId < 21 ? `Level Complete → 5.${levelId + 1}` : 'Stage 5 Complete → Stage 6 ✓'}
            </button>
          </div>
        ) : (
          <p className="s5-footer-hint">Complete the level above to proceed</p>
        )}
      </div>
    </div>
  );
}
