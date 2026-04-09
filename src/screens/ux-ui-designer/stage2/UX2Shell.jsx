// src/screens/ux-ui-designer/stage2/UX2Shell.jsx
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../../context/GameContext';
import { ConceptReveal } from '../../../components/LevelSupport';
import './UX2Shell.css';
import '../../../styles/level-identity.css';

const LEVEL_TITLES = {
  0:'Figma Foundations — Overview', 1:'Frames, Groups & Layers',
  2:'Auto-Layout', 3:'Components & Instances',
  4:'Styles — Colours & Text', 5:'Typography',
  6:'Broken Figma File Hunt', 7:'Prototyping & Connections',
  8:'Mobile Login Screen Build', 9:'Patient App Capstone',
};
const LEVEL_MODES = {0:'CONCEPTS',1:'FILL',2:'FILL',3:'FILL',4:'FILL',5:'FILL',6:'DEBUG',7:'FILL',8:'BUILD',9:'BUILD'};
const STAGE_COLOR = '#f97316';

export default function UX2Shell({ levelId, canProceed, conceptReveal, children }) {
  const navigate = useNavigate();
  const { completeLevel } = useGame();
  const mode = LEVEL_MODES[levelId] || 'FILL';
  const title = LEVEL_TITLES[levelId] || `Level 2.${levelId}`;

  function handleComplete() {
    completeLevel(`ux-2-${levelId}`);
    if (levelId < 9) navigate(`/path/ux-ui-designer/stage/2/level/${levelId + 1}`);
    else navigate('/roadmap');
  }

  return (
    <div className="ux2-shell" style={{ '--path-color': STAGE_COLOR }}>
      <div className="ux2-topbar">
        <button className="ux2-back" onClick={() => navigate('/roadmap')}>← Roadmap</button>
        <div className="ux2-breadcrumb">
          <span style={{color:STAGE_COLOR,fontWeight:700,fontSize:15}}>UX/UI Designer</span>
          <span className="ux2-sep">›</span>
          <span style={{color:'#94a3b8'}}>Stage 2</span>
          <span className="ux2-sep">›</span>
          <span style={{color:'#e2e8f0',fontWeight:500}}>{title}</span>
        </div>
        <div className={`ux2-mode mode-${mode.toLowerCase()}`}>{mode}</div>
      </div>
      <div className="ux2-content">{children}</div>
      {conceptReveal && <ConceptReveal items={conceptReveal} stageColor={STAGE_COLOR} />}
      <div className="ux2-footer">
        <button className="ux2-btn" style={{background:canProceed?STAGE_COLOR:'#334155',color:canProceed?'#0f172a':'#64748b'}}
          disabled={!canProceed} onClick={handleComplete}>
          {levelId < 9 ? `Continue to 2.${levelId + 1} →` : '🎓 Stage 2 Complete!'}
        </button>
      </div>
    </div>
  );
}
