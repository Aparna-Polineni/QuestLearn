// src/screens/ux-ui-designer/stage1/UX1Shell.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../../context/GameContext';
import { useAuth } from '../../../context/AuthContext';
import { ConceptReveal } from '../../../components/LevelSupport';
import SaveProgressModal from '../../../components/SaveProgressModal';
import StageCelebration from '../../../components/StageCelebration';
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
const PATH_ID     = 'ux-ui-designer';

export default function UX1Shell({ levelId, canProceed, conceptReveal, children, prevLevelContext, cumulativeSkills }) {
  const navigate = useNavigate();
  const { completeLevel } = useGame();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const maxLevel = Object.keys(LEVEL_TITLES).length - 1;
  const nextUrl  = levelId < maxLevel
    ? `/path/${PATH_ID}/stage/1/level/${levelId + 1}`
    : '/roadmap';

  function handleComplete() {
    completeLevel(`ux-1-${levelId}`);
    if (levelId === 0 && !user) {
      setShowModal(true);
      return;
    }
    // Last level — show stage celebration before navigating
    if (levelId === 7) {
      setShowCelebration(true);
      return;
    }

    navigate(nextUrl);
  }

  const mode  = LEVEL_MODES[levelId] || 'FILL';
  const title = LEVEL_TITLES[levelId] || `Level 1.${levelId}`;

  return (
    <div className="ux1-shell">
      <div className="ux1-topbar">
        <button className="ux1-back" onClick={() => navigate(user ? '/roadmap' : '/')}>
          {user ? '← Roadmap' : '← Back'}
        </button>
        <div className="ux1-breadcrumb">
          <span className="ux1-path" style={{ color: STAGE_COLOR }}>UX / UI Designer</span>
          <span className="ux1-sep">›</span>
          <span className="ux1-stage">Stage 1</span>
          <span className="ux1-sep">›</span>
          <span className="ux1-title">{title}</span>
        </div>
        <div className={`ux1-mode mode-${mode.toLowerCase()}`}>{mode}</div>
      </div>

      {prevLevelContext && (
        <div className="level-thread">
          <span className="level-thread-icon">↩</span>
          <span>{prevLevelContext}</span>
        </div>
      )}
      <div className="ux1-content">{children}</div>
      {conceptReveal && <ConceptReveal items={conceptReveal} stageColor={STAGE_COLOR} cumulativeSkills={cumulativeSkills} />}

      <div className="ux1-footer">
        <button
          className="ux1-btn"
          style={{ background: canProceed ? STAGE_COLOR : '#334155', color: canProceed ? '#0f172a' : '#64748b' }}
          disabled={!canProceed}
          onClick={handleComplete}
        >
          {levelId < maxLevel ? `Continue to 1.${levelId + 1} →` : '🎓 Stage 1 Complete!'}
        </button>
      </div>

      {showModal && (
        <SaveProgressModal
          pathId={PATH_ID}
          stageId={1}
          levelId={0}
          nextUrl={nextUrl}
          onClose={() => { setShowModal(false); navigate(nextUrl); }}
        />
      )}
      {showCelebration && (
        <StageCelebration
          pathId="{ux-ui-designer}"
          pathName="UX / UI Designer"
          stageId="1"
          stageTitle="Design Thinking"
          stageEmoji="🎨"
          stageColor={STAGE_COLOR}
          onContinue={() => { setShowCelebration(false); navigate(nextUrl); }}
        />
      )}
    </div>
  );
}