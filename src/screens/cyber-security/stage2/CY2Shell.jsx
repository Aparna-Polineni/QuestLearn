// src/screens/cyber-security/stage2/CY2Shell.jsx
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../../context/GameContext';
import { ConceptReveal } from '../../../components/LevelSupport';
import './CY2Shell.css';
import '../../../styles/level-identity.css';

const LEVEL_TITLES = {
  0:'Linux & Networking — Overview', 1:'Navigation & File System',
  2:'File Permissions', 3:'Process Management',
  4:'Networking Basics', 5:'Network Tools',
  6:'Server Misconfiguration Hunt', 7:'nmap Scanning',
  8:'Packet Analysis', 9:'Firewalls & iptables',
  10:'SSH Hardening', 11:'Log Analysis',
  12:'Intrusion Investigation', 13:'Server Hardening Capstone',
};
const LEVEL_MODES = {0:'CONCEPTS',1:'FILL',2:'FILL',3:'FILL',4:'FILL',5:'FILL',6:'DEBUG',7:'FILL',8:'FILL',9:'FILL',10:'FILL',11:'FILL',12:'BUILD',13:'BUILD'};
const STAGE_COLOR = '#06b6d4';

export default function CY2Shell({ levelId, canProceed, conceptReveal, children }) {
  const navigate = useNavigate();
  const { completeLevel } = useGame();
  const mode = LEVEL_MODES[levelId] || 'FILL';
  const title = LEVEL_TITLES[levelId] || `Level 2.${levelId}`;

  function handleComplete() {
    completeLevel(`cy-2-${levelId}`);
    if (levelId < 13) navigate(`/path/cyber-security/stage/2/level/${levelId + 1}`);
    else navigate('/roadmap');
  }

  return (
    <div className="cy2-shell" style={{ '--path-color': STAGE_COLOR }}>
      <div className="cy2-topbar">
        <button className="cy2-back" onClick={() => navigate('/roadmap')}>← Roadmap</button>
        <div className="cy2-breadcrumb">
          <span style={{color:STAGE_COLOR,fontWeight:700,fontSize:15}}>Cyber Security</span>
          <span className="cy2-sep">›</span>
          <span style={{color:'#94a3b8'}}>Stage 2</span>
          <span className="cy2-sep">›</span>
          <span style={{color:'#e2e8f0',fontWeight:500}}>{title}</span>
        </div>
        <div className={`cy2-mode mode-${mode.toLowerCase()}`}>{mode}</div>
      </div>
      <div className="cy2-content">{children}</div>
      {conceptReveal && <ConceptReveal items={conceptReveal} stageColor={STAGE_COLOR} />}
      <div className="cy2-footer">
        <button className="cy2-btn" style={{background:canProceed?STAGE_COLOR:'#334155',color:canProceed?'#0f172a':'#64748b'}}
          disabled={!canProceed} onClick={handleComplete}>
          {levelId < 13 ? `Continue to 2.${levelId + 1} →` : '🎓 Stage 2 Complete!'}
        </button>
      </div>
    </div>
  );
}
