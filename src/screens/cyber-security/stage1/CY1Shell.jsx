// src/screens/cyber-security/stage1/CY1Shell.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../../context/GameContext';
import { useAuth } from '../../../context/AuthContext';
import { ConceptReveal } from '../../../components/LevelSupport';
import SaveProgressModal from '../../../components/SaveProgressModal';
import './CY1Shell.css';

const LEVEL_TITLES = {
  0: 'The Security Mindset',
  1: 'CIA Triad',
  2: 'Threat Modelling',
  3: 'Attack Surfaces',
  4: 'Common Attack Types',
  5: 'Defence in Depth',
  6: 'Security Careers',
  7: 'Capstone — Threat Model',
};
const LEVEL_MODES = { 0:'CONCEPTS', 1:'FILL', 2:'FILL', 3:'FILL', 4:'DEBUG', 5:'FILL', 6:'CONCEPTS', 7:'BUILD' };
const STAGE_COLOR = '#10b981';
const PATH_ID     = 'cyber-security';

export default function CY1Shell({ levelId, canProceed, conceptReveal, children }) {
  const navigate = useNavigate();
  const { completeLevel } = useGame();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const maxLevel = Object.keys(LEVEL_TITLES).length - 1;
  const nextUrl  = levelId < maxLevel
    ? `/path/${PATH_ID}/stage/1/level/${levelId + 1}`
    : '/roadmap';

  function handleComplete() {
    completeLevel(`cy-1-${levelId}`);
    if (levelId === 0 && !user) {
      setShowModal(true);
      return;
    }
    navigate(nextUrl);
  }

  const mode  = LEVEL_MODES[levelId] || 'FILL';
  const title = LEVEL_TITLES[levelId] || `Level 1.${levelId}`;

  return (
    <div className="cy1-shell">
      <div className="cy1-topbar">
        <button className="cy1-back" onClick={() => navigate(user ? '/roadmap' : '/')}>
          {user ? '← Roadmap' : '← Back'}
        </button>
        <div className="cy1-breadcrumb">
          <span className="cy1-path" style={{ color: STAGE_COLOR }}>Cyber Security</span>
          <span className="cy1-sep">›</span>
          <span className="cy1-stage">Stage 1</span>
          <span className="cy1-sep">›</span>
          <span className="cy1-title">{title}</span>
        </div>
        <div className={`cy1-mode mode-${mode.toLowerCase()}`}>{mode}</div>
      </div>

      <div className="cy1-content">{children}</div>
      {conceptReveal && <ConceptReveal items={conceptReveal} stageColor={STAGE_COLOR} />}

      <div className="cy1-footer">
        <button
          className="cy1-btn"
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
    </div>
  );
}
