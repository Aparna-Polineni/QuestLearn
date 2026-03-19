// src/screens/ml-ai-engineer/stage2/ML2Shell.jsx
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../../context/GameContext';
import { ConceptReveal } from '../../../components/LevelSupport';
import './ML2Shell.css';

const LEVEL_TITLES = {
  0:'Python for ML — Overview', 1:'NumPy Arrays & Vectorisation',
  2:'Pandas — DataFrames Basics', 3:'Pandas — Filtering & Groupby',
  4:'Data Cleaning', 5:'Visualisation', 6:'Pandas Bug Hunt',
  7:'Linear Algebra for ML', 8:'Statistics Fundamentals',
  9:'Probability & Bayes', 10:'Gradient Descent',
  11:'Feature Engineering', 12:'Full EDA', 13:'Data Pipeline Capstone',
};
const LEVEL_MODES = {0:'CONCEPTS',1:'FILL',2:'FILL',3:'FILL',4:'FILL',5:'FILL',6:'DEBUG',7:'FILL',8:'FILL',9:'FILL',10:'FILL',11:'FILL',12:'BUILD',13:'BUILD'};
const STAGE_COLOR = '#fbbf24';

export default function ML2Shell({ levelId, canProceed, conceptReveal, children }) {
  const navigate = useNavigate();
  const { completeLevel } = useGame();
  const mode = LEVEL_MODES[levelId] || 'FILL';
  const title = LEVEL_TITLES[levelId] || `Level 2.${levelId}`;

  function handleComplete() {
    completeLevel(`ml-2-${levelId}`);
    if (levelId < 13) navigate(`/path/ml-ai-engineer/stage/2/level/${levelId + 1}`);
    else navigate('/roadmap');
  }

  return (
    <div className="ml2-shell">
      <div className="ml2-topbar">
        <button className="ml2-back" onClick={() => navigate('/roadmap')}>← Roadmap</button>
        <div className="ml2-breadcrumb">
          <span style={{color:STAGE_COLOR,fontWeight:700,fontSize:15}}>ML/AI Engineer</span>
          <span className="ml2-sep">›</span>
          <span style={{color:'#94a3b8'}}>Stage 2</span>
          <span className="ml2-sep">›</span>
          <span style={{color:'#e2e8f0',fontWeight:500}}>{title}</span>
        </div>
        <div className={`ml2-mode mode-${mode.toLowerCase()}`}>{mode}</div>
      </div>
      <div className="ml2-content">{children}</div>
      {conceptReveal && <ConceptReveal items={conceptReveal} stageColor={STAGE_COLOR} />}
      <div className="ml2-footer">
        <button className="ml2-btn" style={{background:canProceed?STAGE_COLOR:'#334155',color:canProceed?'#0f172a':'#64748b'}}
          disabled={!canProceed} onClick={handleComplete}>
          {levelId < 13 ? `Continue to 2.${levelId + 1} →` : '🎓 Stage 2 Complete!'}
        </button>
      </div>
    </div>
  );
}
