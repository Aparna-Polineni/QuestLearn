// src/screens/stage1/Stage1Shell.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import RoadmapSidebar from '../../components/RoadmapSidebar';
import SaveProgressModal from '../../components/SaveProgressModal';
import './Stage1Shell.css';

const LEVELS = [
  { id: 1, title: "The Problem Statement", icon: "📋" },
  { id: 2, title: "Map the System",        icon: "🗺️" },
  { id: 3, title: "Design the Screens",    icon: "🖥️" },
  { id: 4, title: "Design the Data",       icon: "🗄️" },
  { id: 5, title: "Define the API",        icon: "🔌" },
  { id: 6, title: "Choose Your Stack",     icon: "⚙️" },
  { id: 7, title: "Set Up the Project",    icon: "📁" },
  { id: 8, title: "The Roadmap",           icon: "🗓️" },
];

function Stage1Shell({ children, levelId, canProceed, onComplete, conceptUnlocked, conceptText, conceptReveal, undoControls }) {
  const navigate = useNavigate();
  const { selectedDomain, completeLevel, isLevelComplete } = useGame();
  const { user } = useAuth();
  const [showCelebration, setShowCelebration] = useState(false);
  const [roadmapOpen,     setRoadmapOpen]     = useState(false);
  const [showModal,       setShowModal]       = useState(false);

  function handleComplete() {
    if (!canProceed) return;
    completeLevel(`1-${levelId}`, {});
    // Guest completing first level — show save progress modal
    if (levelId === 1 && !user) {
      setShowModal(true);
      return;
    }
    setShowCelebration(true);
  }

  function goNext() {
    setShowCelebration(false);
    if (levelId < 8) {
      navigate(`/stage/1/level/${levelId + 1}`);
    } else {
      navigate('/stage/2/level/1');
    }
  }

  const progress = ((levelId - 1) / 8) * 100;

  return (
    <>
    <div className="s1-shell">

      {/* Top HUD */}
      <div className="s1-hud">
        <div className="s1-hud-left">
          <span className="s1-logo" style={{cursor:'pointer'}} onClick={() => navigate('/home')}>◈ QuestLearn</span>
          <span className="s1-sep">·</span>
          <span className="s1-stage">🎨 Stage 1 — Design</span>
        </div>
        <div className="s1-hud-center">
          {selectedDomain && (
            <span className="s1-domain-tag">
              {selectedDomain.emoji} {selectedDomain.name}
            </span>
          )}
        </div>
        <div className="s1-hud-right">
          Level {levelId} of 8
          <button className="s1-roadmap-btn" onClick={() => setRoadmapOpen(true)} title="View Roadmap">
            🗺️ Map
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="s1-progress-bar">
        <div className="s1-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Level nav dots */}
      <div className="s1-level-nav">
        {LEVELS.map(l => (
          <button
            key={l.id}
            className={`s1-level-dot ${l.id === levelId ? 'active' : ''} ${isLevelComplete(`1-${l.id}`) ? 'done' : ''}`}
            onClick={() => isLevelComplete(`1-${l.id}`) || l.id <= levelId ? navigate(`/stage/1/level/${l.id}`) : null}
            title={`${l.icon} ${l.title}`}
          >
            {isLevelComplete(`1-${l.id}`) ? '✓' : l.id}
          </button>
        ))}
      </div>

      {/* Level title */}
      <div className="s1-level-header">
        <div className="s1-level-number">Level 1.{levelId}</div>
        <div className="s1-level-title">
          {LEVELS[levelId - 1].icon} {LEVELS[levelId - 1].title}
        </div>
      </div>

      {/* Content area */}
      <div className="s1-content">
        {children}
      </div>

      {/* Bottom action bar */}
      <div className="s1-action-bar">
        <button
          className="s1-back-btn"
          onClick={() => levelId > 1 ? navigate(`/stage/1/level/${levelId - 1}`) : navigate('/domain-select')}
        >
          ← Back
        </button>
        <div className="s1-action-center">
          {canProceed
            ? <span className="s1-ready">✓ Ready to continue</span>
            : <span className="s1-not-ready">Complete the task above to continue</span>
          }
        </div>
        <button
          className={`s1-next-btn ${canProceed ? 'enabled' : 'disabled'}`}
          onClick={handleComplete}
          disabled={!canProceed}
        >
          {isLevelComplete(`1-${levelId}`) ? 'Next Level →' : 'Complete Level →'}
        </button>
      </div>

      {/* Celebration overlay */}
      {showCelebration && (
        <div className="s1-celebration">
          <div className="s1-celebrate-box">
            <div className="s1-celebrate-emoji">🎉</div>
            <h2>Level 1.{levelId} Complete!</h2>
            <p className="s1-celebrate-sub">
              {LEVELS[levelId - 1].icon} {LEVELS[levelId - 1].title}
            </p>
            {conceptUnlocked && (
              <div className="s1-concept-box">
                <div className="s1-concept-label">💡 Concept Unlocked</div>
                <div className="s1-concept-name">{conceptUnlocked}</div>
                <div className="s1-concept-text">{conceptText}</div>
              </div>
            )}
            <button className="s1-next-level-btn" onClick={goNext}>
              {levelId < 8 ? `Next → Level 1.${levelId + 1}` : '🚀 Start Stage 2 — Java Core'}
            </button>
          </div>
        </div>
      )}

      {/* Roadmap Sidebar */}
      <RoadmapSidebar
        isOpen={roadmapOpen}
        onClose={() => setRoadmapOpen(false)}
        currentStageId={1}
        currentLevelId={levelId}
      />

    </div>
      {showModal && (
        <SaveProgressModal
          pathId="java-fullstack"
          stageId={1}
          levelId={1}
          nextUrl={`/stage/1/level/${levelId + 1}`}
          onClose={() => { setShowModal(false); setShowCelebration(true); }}
        />
      )}
    </>
  );
}

export default Stage1Shell;