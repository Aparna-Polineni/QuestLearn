// src/screens/stage1/Stage1Shell.jsx
// Now accepts undoControls prop and renders UndoBar in action bar automatically

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { ConceptReveal } from '../../components/LevelSupport';
import UndoBar from '../../components/UndoBar';
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

function Stage1Shell({ children, levelId, canProceed, conceptReveal, undoControls }) {
  const navigate = useNavigate();
  const { selectedDomain, completeLevel, isLevelComplete } = useGame();
  const [showCelebration, setShowCelebration] = useState(false);

  function handleComplete() {
    if (!canProceed) return;
    completeLevel(`1-${levelId}`, {});
    setShowCelebration(true);
  }

  function goNext() {
    setShowCelebration(false);
    if (levelId < 8) {
      navigate(`/stage/1/level/${levelId + 1}`);
    } else {
      navigate('/stage/2/intro');
    }
  }

  const progress = ((levelId - 1) / 8) * 100;

  return (
    <div className="s1-shell">

      {/* HUD */}
      <div className="s1-hud">
        <div className="s1-hud-left">
          <span className="s1-logo">◈ QuestLearn</span>
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
        <div className="s1-hud-right">Level {levelId} of 8</div>
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
            className={`s1-level-dot
              ${l.id === levelId ? 'active' : ''}
              ${isLevelComplete(`1-${l.id}`) ? 'done' : ''}`}
            onClick={() =>
              (isLevelComplete(`1-${l.id}`) || l.id <= levelId)
                ? navigate(`/stage/1/level/${l.id}`)
                : null
            }
            title={`${l.icon} ${l.title}`}
          >
            {isLevelComplete(`1-${l.id}`) ? '✓' : l.id}
          </button>
        ))}
      </div>

      {/* Level header */}
      <div className="s1-level-header">
        <div className="s1-level-number">Level 1.{levelId}</div>
        <div className="s1-level-title">
          {LEVELS[levelId - 1].icon} {LEVELS[levelId - 1].title}
        </div>
      </div>

      {/* Main content */}
      <div className="s1-content">{children}</div>

      {/* Action bar */}
      <div className="s1-action-bar">

        {/* Left — back + undo controls */}
        <div className="s1-action-left">
          <button
            className="s1-back-btn"
            onClick={() =>
              levelId > 1
                ? navigate(`/stage/1/level/${levelId - 1}`)
                : navigate('/domain-select')
            }
          >
            ← Back
          </button>

          {/* Undo bar — only shown if level passes undoControls */}
          {undoControls && (
            <UndoBar
              canUndo={undoControls.canUndo}
              canRedo={undoControls.canRedo}
              onUndo={undoControls.undo}
              onRedo={undoControls.redo}
              onReset={undoControls.reset}
              historySize={undoControls.historySize}
            />
          )}
        </div>

        {/* Centre — status */}
        <div className="s1-action-center">
          {canProceed
            ? <span className="s1-ready">✓ Ready to continue</span>
            : <span className="s1-not-ready">Complete the task above to continue</span>
          }
        </div>

        {/* Right — complete button */}
        <button
          className={`s1-next-btn ${canProceed ? 'enabled' : 'disabled'}`}
          onClick={handleComplete}
          disabled={!canProceed}
        >
          {isLevelComplete(`1-${levelId}`) ? 'Next Level →' : 'Complete Level →'}
        </button>

      </div>

      {/* Celebration modal */}
      {showCelebration && (
        <div className="s1-celebration">
          <div className="s1-celebrate-box">
            <div className="s1-celebrate-emoji">🎉</div>
            <h2 className="s1-celebrate-title">Level 1.{levelId} Complete!</h2>
            <p className="s1-celebrate-sub">
              {LEVELS[levelId - 1].icon} {LEVELS[levelId - 1].title}
            </p>
            {conceptReveal && (
              <ConceptReveal
                concept={conceptReveal.concept}
                whatYouLearned={conceptReveal.whatYouLearned}
                realWorldUse={conceptReveal.realWorldUse}
                developerSays={conceptReveal.developerSays}
              />
            )}
            <button className="s1-next-level-btn" onClick={goNext}>
              {levelId < 8
                ? `Next → Level 1.${levelId + 1}`
                : '🚀 Start Stage 2 — Java Core'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Stage1Shell;