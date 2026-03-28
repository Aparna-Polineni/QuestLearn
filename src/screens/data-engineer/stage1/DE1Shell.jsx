// src/screens/data-engineer/stage1/DE1Shell.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../../context/GameContext';
import { useAuth } from '../../../context/AuthContext';
import { ConceptReveal } from '../../../components/LevelSupport';
import SaveProgressModal from '../../../components/SaveProgressModal';
import StageCelebration from '../../../components/StageCelebration';
import './DE1Shell.css';

const LEVEL_TITLES = {
  0: 'What is Data Engineering?',
  1: 'Data Quality Disasters',
  2: 'Anatomy of a Pipeline',
  3: 'Schema Design',
  4: 'Batch vs Streaming',
  5: 'Data Formats',
  6: 'The Data Stack',
  7: 'Capstone — Design a Pipeline',
};
const LEVEL_MODES  = { 0:'CONCEPTS', 1:'DEBUG', 2:'FILL', 3:'FILL', 4:'FILL', 5:'FILL', 6:'CONCEPTS', 7:'BUILD' };
const STAGE_COLOR  = '#06b6d4';
const PATH_ID      = 'data-engineer';

export default function DE1Shell({ levelId, canProceed, conceptReveal, children }) {
  const navigate = useNavigate();
  const { completeLevel } = useGame();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const nextUrl = levelId < 7
    ? `/path/${PATH_ID}/stage/1/level/${levelId + 1}`
    : '/roadmap';

  function handleComplete() {
    completeLevel(`de-1-${levelId}`);

    // Level 0 guest — show save progress modal instead of navigating
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
    <div className="de1-shell">
      <div className="de1-topbar">
        <button className="de1-back" onClick={() => navigate(user ? '/roadmap' : '/')}>
          {user ? '← Roadmap' : '← Back'}
        </button>
        <div className="de1-breadcrumb">
          <span className="de1-path" style={{ color: STAGE_COLOR }}>Data Engineer</span>
          <span className="de1-sep">›</span>
          <span className="de1-stage">Stage 1</span>
          <span className="de1-sep">›</span>
          <span className="de1-title">{title}</span>
        </div>
        <div className={`de1-mode mode-${mode.toLowerCase()}`}>{mode}</div>
      </div>

      <div className="de1-content">{children}</div>
      {conceptReveal && <ConceptReveal items={conceptReveal} stageColor={STAGE_COLOR} />}

      <div className="de1-footer">
        <button
          className="de1-btn"
          style={{ background: canProceed ? STAGE_COLOR : '#334155', color: canProceed ? '#0f172a' : '#64748b' }}
          disabled={!canProceed}
          onClick={handleComplete}
        >
          {levelId < 7 ? `Continue to 1.${levelId + 1} →` : '🎓 Stage 1 Complete!'}
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
          pathId={PATH_ID}
          pathName="Data Engineer"
          stageId="1"
          stageTitle="The Data Problem"
          stageEmoji="🛢️"
          stageColor={STAGE_COLOR}
          onContinue={() => { setShowCelebration(false); navigate(nextUrl); }}
        />
      )}
    </div>
  );
}
