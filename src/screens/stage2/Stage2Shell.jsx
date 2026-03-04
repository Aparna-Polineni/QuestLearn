// src/screens/stage2/Stage2Shell.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { ConceptReveal } from '../../components/LevelSupport';
import UndoBar from '../../components/UndoBar';
import RoadmapSidebar from '../../components/RoadmapSidebar';
import './Stage2Shell.css';

const LEVELS = [
  // Part A — Absolute Basics
  { id: 0,  title: "Java Concepts",             icon: "🧠", part: "A" },
  { id: 1,  title: "Hello World",              icon: "👋", part: "A" },
  { id: 2,  title: "Variables & Types",        icon: "📦", part: "A" },
  { id: 3,  title: "Operators & Arithmetic",   icon: "➕", part: "A" },
  { id: 4,  title: "Conditionals",             icon: "🔀", part: "A" },
  { id: 5,  title: "Loops",                    icon: "🔁", part: "A" },
  { id: 6,  title: "Methods",                  icon: "🔧", part: "A" },
  // Part B — Object Oriented Programming
  { id: 7,  title: "Classes & Objects",        icon: "🏗️", part: "B" },
  { id: 8,  title: "Constructors",             icon: "🔨", part: "B" },
  { id: 9,  title: "Encapsulation",            icon: "🔒", part: "B" },
  { id: 10, title: "Inheritance",              icon: "🧬", part: "B" },
  { id: 11, title: "Polymorphism",             icon: "🎭", part: "B" },
  { id: 12, title: "Abstract Classes",         icon: "👻", part: "B" },
  { id: 13, title: "Interfaces",               icon: "🔌", part: "B" },
  { id: 14, title: "Static vs Instance",       icon: "⚡", part: "B" },
  // Part C — Working with Data
  { id: 15, title: "Arrays & ArrayLists",      icon: "📋", part: "C" },
  { id: 16, title: "HashMap & HashSet",        icon: "🗺️", part: "C" },
  { id: 17, title: "Exception Handling",       icon: "🚨", part: "C" },
  { id: 18, title: "File I/O",                 icon: "📁", part: "C" },
  { id: 19, title: "String Manipulation",      icon: "✂️", part: "C" },
  { id: 20, title: "Java 8 Lambdas",           icon: "λ",  part: "C" },
];

const PARTS = {
  A: { label: "Part A — Absolute Basics",          color: "#38bdf8" },
  B: { label: "Part B — Object Oriented",          color: "#f97316" },
  C: { label: "Part C — Working with Data",        color: "#4ade80" },
};

function Stage2Shell({ children, levelId, canProceed, conceptReveal, undoControls, output }) {
  const navigate = useNavigate();
  const { selectedDomain, completeLevel, isLevelComplete } = useGame();
  const [showCelebration, setShowCelebration] = useState(false);
  const [roadmapOpen,     setRoadmapOpen]     = useState(false);

  const level    = LEVELS[levelId - 1];
  const part     = PARTS[level?.part];
  const progress = ((levelId - 1) / 20) * 100;

  function handleComplete() {
    if (!canProceed) return;
    completeLevel(`2-${levelId}`, {});
    setShowCelebration(true);
  }

  function goNext() {
    setShowCelebration(false);
    if (levelId < 20) {
      navigate(`/stage/2/level/${levelId + 1}`);
    } else {
      navigate('/stage/3/intro');
    }
  }

  return (
    <div className="s2-shell">

      {/* HUD */}
      <div className="s2-hud">
        <div className="s2-hud-left">
          <span className="s2-logo" style={{cursor:'pointer'}} onClick={() => navigate('/home')}>◈ QuestLearn</span>
          <span className="s2-sep">·</span>
          <span className="s2-stage">☕ Stage 2 — Java Core</span>
        </div>
        <div className="s2-hud-center">
          {selectedDomain && (
            <span className="s2-domain-tag">
              {selectedDomain.emoji} {selectedDomain.name}
            </span>
          )}
        </div>
        <div className="s2-hud-right">
          Level {levelId} of 20
          <button className="s2-roadmap-btn" onClick={() => setRoadmapOpen(true)}>🗺️ Map</button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="s2-progress-bar">
        <div className="s2-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Part label */}
      <div className="s2-part-bar" style={{ '--part-color': part?.color }}>
        <span className="s2-part-label">{part?.label}</span>
        <div className="s2-level-dots">
          {LEVELS.filter(l => l.part === level?.part).map(l => (
            <button
              key={l.id}
              className={`s2-dot ${l.id === levelId ? 'dot-active' : ''} ${isLevelComplete(`2-${l.id}`) ? 'dot-done' : ''}`}
              onClick={() => (isLevelComplete(`2-${l.id}`) || l.id <= levelId) ? navigate(`/stage/2/level/${l.id}`) : null}
              title={`${l.icon} ${l.title}`}
            >
              {isLevelComplete(`2-${l.id}`) ? '✓' : l.id}
            </button>
          ))}
        </div>
      </div>

      {/* Level header */}
      <div className="s2-level-header">
        <div className="s2-level-number" style={{ color: part?.color }}>
          Level 2.{levelId}
        </div>
        <div className="s2-level-title">
          {level?.icon} {level?.title}
        </div>
      </div>

      {/* Content */}
      <div className="s2-content">{children}</div>

      {/* Action bar */}
      <div className="s2-action-bar">
        <div className="s2-action-left">
          <button
            className="s2-back-btn"
            onClick={() => levelId > 0
              ? navigate(`/stage/2/level/${levelId - 1}`)
              : navigate('/stage/1/level/8')
            }
          >
            ← Back
          </button>
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

        <div className="s2-action-center">
          {canProceed
            ? <span className="s2-ready">✓ Output correct — ready to continue</span>
            : <span className="s2-not-ready">Write code and run it to continue</span>
          }
        </div>

        <button
          className={`s2-next-btn ${canProceed ? 'enabled' : 'disabled'}`}
          onClick={handleComplete}
          disabled={!canProceed}
        >
          {isLevelComplete(`2-${levelId}`) ? 'Next Level →' : 'Complete Level →'}
        </button>
      </div>

      {/* Celebration modal */}
      {showCelebration && (
        <div className="s2-celebration">
          <div className="s2-celebrate-box">
            <div className="s2-celebrate-emoji">🎉</div>
            <h2 className="s2-celebrate-title">Level 2.{levelId} Complete!</h2>
            <p className="s2-celebrate-sub">{level?.icon} {level?.title}</p>
            {conceptReveal && (
              <ConceptReveal
                concept={conceptReveal.concept}
                whatYouLearned={conceptReveal.whatYouLearned}
                realWorldUse={conceptReveal.realWorldUse}
                developerSays={conceptReveal.developerSays}
              />
            )}
            <button className="s2-next-level-btn" onClick={goNext}>
              {levelId < 20
                ? `Next → Level 2.${levelId + 1}: ${LEVELS[levelId]?.title}`
                : '🚀 Start Stage 3 — Java Advanced'}
            </button>
          </div>
        </div>
      )}

      {/* Roadmap Sidebar */}
      <RoadmapSidebar
        isOpen={roadmapOpen}
        onClose={() => setRoadmapOpen(false)}
        currentStageId={2}
        currentLevelId={levelId}
      />

    </div>
  );
}

export default Stage2Shell;