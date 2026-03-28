// src/screens/ml-ai-engineer/stage1/ML1Shell.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../../context/GameContext';
import { useAuth } from '../../../context/AuthContext';
import { ConceptReveal } from '../../../components/LevelSupport';
import SaveProgressModal from '../../../components/SaveProgressModal';
import StageCelebration from '../../../components/StageCelebration';
import './ML1Shell.css';

const LEVEL_TITLES = {
  0: 'What is Machine Learning?',
  1: 'When NOT to Use ML',
  2: 'Types of Learning',
  3: 'The ML Workflow',
  4: 'Data — The Foundation',
  5: 'Evaluation Metrics',
  6: 'ML in Production',
  7: 'Capstone — Frame an ML Problem',
};
const LEVEL_MODES = { 0:'CONCEPTS', 1:'DEBUG', 2:'FILL', 3:'FILL', 4:'FILL', 5:'FILL', 6:'CONCEPTS', 7:'BUILD' };
const STAGE_COLOR = '#8b5cf6';
const PATH_ID     = 'ml-ai-engineer';

export default function ML1Shell({ levelId, canProceed, conceptReveal, children }) {
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
    completeLevel(`ml-1-${levelId}`);
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
    <div className="ml1-shell">
      <div className="ml1-topbar">
        <button className="ml1-back" onClick={() => navigate(user ? '/roadmap' : '/')}>
          {user ? '← Roadmap' : '← Back'}
        </button>
        <div className="ml1-breadcrumb">
          <span className="ml1-path" style={{ color: STAGE_COLOR }}>ML / AI Engineer</span>
          <span className="ml1-sep">›</span>
          <span className="ml1-stage">Stage 1</span>
          <span className="ml1-sep">›</span>
          <span className="ml1-title">{title}</span>
        </div>
        <div className={`ml1-mode mode-${mode.toLowerCase()}`}>{mode}</div>
      </div>

      <div className="ml1-content">{children}</div>
      {conceptReveal && <ConceptReveal items={conceptReveal} stageColor={STAGE_COLOR} />}

      <div className="ml1-footer">
        <button
          className="ml1-btn"
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
          pathId="{ml-ai-engineer}"
          pathName="ML / AI Engineer"
          stageId="1"
          stageTitle="AI Problem Framing"
          stageEmoji="🤖"
          stageColor={STAGE_COLOR}
          onContinue={() => { setShowCelebration(false); navigate(nextUrl); }}
        />
      )}
    </div>
  );
}