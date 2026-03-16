// src/screens/ux-ui-designer/stage1/UX1Shell.jsx
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../../context/GameContext';
import { ConceptReveal } from '../../../components/LevelSupport';
import './UX1Shell.css';

const LEVEL_TITLES = {
  0: 'What is Design Thinking?',
  1: 'Empathy — Understanding Users',
  2: 'Define — The Problem Statement',
  3: 'Ideate — Generate Solutions',
  4: 'Prototype — Make it Tangible',
  5: 'Test — Validate with Users',
  6: 'UX vs UI — What\'s the Difference?',
  7: 'Capstone — Design Challenge',
};
const LEVEL_MODES = { 0:'CONCEPTS', 1:'FILL', 2:'FILL', 3:'BUILD', 4:'FILL', 5:'FILL', 6:'CONCEPTS', 7:'BUILD' };
const STAGE_COLOR = '#ec4899';

export default function UX1Shell({ levelId, canProceed, conceptReveal, children }) {
  const navigate = useNavigate();
  const { completeLevel } = useGame();

  function handleComplete() {
    completeLevel(`ux-1-${levelId}`);
    if (levelId < 7) navigate(`/path/ux-ui-designer/stage/1/level/${levelId + 1}`);
    else navigate('/roadmap');
  }

  const mode = LEVEL_MODES[levelId] || 'FILL';
  const title = LEVEL_TITLES[levelId] || `Level 1.${levelId}`;

  return (
    <div className="ux1-shell">
      <div className="ux1-topbar">
        <button className="ux1-back" onClick={() => navigate('/roadmap')}>← Roadmap</button>
        <div className="ux1-breadcrumb">
          <span className="ux1-path" style={{ color: STAGE_COLOR }}>UX/UI Designer</span>
          <span className="ux1-sep">›</span>
          <span className="ux1-stage">Stage 1</span>
          <span className="ux1-sep">›</span>
          <span className="ux1-title">{title}</span>
        </div>
        <div className={`ux1-mode mode-${mode.toLowerCase()}`}>{mode}</div>
      </div>
      <div className="ux1-content">{children}</div>
      {conceptReveal && <ConceptReveal items={conceptReveal} stageColor={STAGE_COLOR} />}
      <div className="ux1-footer">
        <button className="ux1-btn" style={{ background: canProceed ? STAGE_COLOR : '#334155' }}
          disabled={!canProceed} onClick={handleComplete}>
          {levelId < 7 ? `Continue to 1.${levelId + 1} →` : '🎓 Stage 1 Complete!'}
        </button>
      </div>
    </div>
  );
}
