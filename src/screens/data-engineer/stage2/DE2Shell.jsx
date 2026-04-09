// src/screens/data-engineer/stage2/DE2Shell.jsx
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../../context/GameContext';
import { ConceptReveal } from '../../../components/LevelSupport';
import './DE2Shell.css';
import '../../../styles/level-identity.css';

const LEVEL_TITLES = {
  0:'SQL & Databases — Overview', 1:'SELECT, WHERE, ORDER BY',
  2:'Aggregates & GROUP BY', 3:'JOINs', 4:'Subqueries & CTEs',
  5:'Window Functions', 6:'SQL Bug Hunt', 7:'Data Types & NULLs',
  8:'Indexes & Query Optimisation', 9:'Database Design & Normalisation',
  10:'Transactions & ACID', 11:'NoSQL — When & Why',
  12:'Analytical Query Suite', 13:'Data Warehouse Capstone',
};
const LEVEL_MODES = {
  0:'CONCEPTS', 1:'FILL', 2:'FILL', 3:'FILL', 4:'FILL', 5:'FILL',
  6:'DEBUG', 7:'FILL', 8:'FILL', 9:'FILL', 10:'FILL', 11:'FILL',
  12:'BUILD', 13:'BUILD',
};
const STAGE_COLOR = '#818cf8';

export default function DE2Shell({ levelId, canProceed, conceptReveal, children , prevLevelContext, cumulativeSkills }) {
  const navigate = useNavigate();
  const { completeLevel } = useGame();
  const mode  = LEVEL_MODES[levelId] || 'FILL';
  const title = LEVEL_TITLES[levelId] || `Level 2.${levelId}`;

  function handleComplete() {
    completeLevel(`de-2-${levelId}`);
    if (levelId < 13) navigate(`/path/data-engineer/stage/2/level/${levelId + 1}`);
    else navigate('/roadmap');
  }

  return (
    <div className="de2-shell" style={{ '--path-color': STAGE_COLOR }}>
      <div className="de2-topbar">
        <button className="de2-back" onClick={() => navigate('/roadmap')}>← Roadmap</button>
        <div className="de2-breadcrumb">
          <span style={{ color: STAGE_COLOR, fontWeight:700, fontSize:15 }}>Data Engineer</span>
          <span className="de2-sep">›</span>
          <span style={{ color:'#94a3b8' }}>Stage 2</span>
          <span className="de2-sep">›</span>
          <span style={{ color:'#e2e8f0', fontWeight:500 }}>{title}</span>
        </div>
        <div className={`de2-mode mode-${mode.toLowerCase()}`}>{mode}</div>
      </div>
      {prevLevelContext && (
        <div className="level-thread">
          <span className="level-thread-icon">↩</span>
          <span>{prevLevelContext}</span>
        </div>
      )}
      <div className="de2-content">{children}</div>
      {conceptReveal && <ConceptReveal items={conceptReveal} stageColor={STAGE_COLOR} cumulativeSkills={cumulativeSkills} />}
      <div className="de2-footer">
        <button className="de2-btn" style={{ background: canProceed ? STAGE_COLOR : '#334155', color: canProceed ? '#0f172a' : '#64748b' }}
          disabled={!canProceed} onClick={handleComplete}>
          {levelId < 13 ? `Continue to 2.${levelId + 1} →` : '🎓 Stage 2 Complete!'}
        </button>
      </div>
    </div>
  );
}
