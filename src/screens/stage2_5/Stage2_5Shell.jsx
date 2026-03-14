// src/screens/stage2_5/Stage2_5Shell.jsx
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { ConceptReveal } from '../../components/LevelSupport';
import './Stage2_5Shell.css';

const LEVEL_TITLES = {
  0:'JavaScript Concepts',     1:'Variables & Types',
  2:'Functions',               3:'Arrow Functions',
  4:'Arrays & Basic Methods',  5:'Objects',
  6:'Destructuring & Spread',  7:'Template Literals & Operators',
  8:'Array Methods',           9:'Objects Deep Dive',
  10:'DOM Manipulation',       11:'Error Handling',
  12:'Promises',               13:'Async / Await',
  14:'ES6+ Modules',           15:'JS Capstone',
  16:'Classes & OOP',          17:'Closures & Scope',
  18:'Sets, Maps & Iteration', 19:'Modern Array & String Methods',
};

const LEVEL_MODES = {
  0:'CONCEPTS',
  1:'FILL',  2:'FILL',  3:'FILL',  4:'FILL',  5:'FILL',
  6:'FILL',  7:'FILL',  8:'BUILD', 9:'BUILD',  10:'BUILD',
  11:'FILL', 12:'FILL', 13:'BUILD',14:'FILL',  15:'BUILD',
  16:'FILL', 17:'BUILD',18:'BUILD',19:'BUILD',
};

const MODE_COLORS = { CONCEPTS:'#a78bfa', FILL:'#38bdf8', BUILD:'#4ade80', DEBUG:'#f87171' };
const TOTAL = 20;

export default function Stage2_5Shell({ levelId, canProceed, conceptReveal, children }) {
  const navigate = useNavigate();
  const { completeLevel } = useGame();

  const color     = '#f59e0b';
  const mode      = LEVEL_MODES[levelId] || 'BUILD';
  const title     = LEVEL_TITLES[levelId] || `Level JS.${levelId}`;
  const modeColor = MODE_COLORS[mode] || '#f59e0b';
  const pct       = Math.round((levelId / TOTAL) * 100);

  function handleComplete() {
    completeLevel(`2.5-${levelId}`);
    if (levelId < TOTAL - 1) navigate(`/stage/2.5/level/${levelId + 1}`);
    else navigate('/roadmap');
  }

  return (
    <div className="s25-shell">
      <div className="s25-topbar">
        <button className="s25-back" onClick={() => navigate('/roadmap')}>← Roadmap</button>
        <div className="s25-breadcrumb">
          <span className="s25-stage-label" style={{ color }}>Stage 2.5 — JavaScript</span>
          <span className="s25-sep">›</span>
          <span className="s25-level-label">JS.{levelId}</span>
          <span className="s25-sep">›</span>
          <span className="s25-title-label">{title}</span>
        </div>
        <div className="s25-mode-badge" style={{ color: modeColor, borderColor: modeColor }}>{mode}</div>
      </div>
      <div className="s25-progress-bar">
        <div className="s25-progress-fill" style={{ width:`${pct}%`, background: color }} />
      </div>
      <div className="s25-content">{children}</div>
      <div className="s25-footer">
        {canProceed ? (
          <div className="s25-footer-inner">
            {conceptReveal && (
              <ConceptReveal
                concept={conceptReveal.concept}
                whatYouLearned={conceptReveal.whatYouLearned}
                realWorldUse={conceptReveal.realWorldUse}
                developerSays={conceptReveal.developerSays}
              />
            )}
            <button className="s25-proceed-btn" style={{ background: color }} onClick={handleComplete}>
              {levelId < TOTAL - 1
                ? `Level Complete → JS.${levelId + 1} ›`
                : '🎉 Stage 2.5 Complete → Stage 3: React ›'}
            </button>
          </div>
        ) : (
          <p className="s25-footer-hint">Complete the exercise above to unlock the next level</p>
        )}
      </div>
    </div>
  );
}