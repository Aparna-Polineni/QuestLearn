// src/components/LevelSupport.jsx
// Three-layer support system for every level:
// Layer 1 — Concept intro (before they start)
// Layer 2 — Progressive hints (while stuck)
// Layer 3 — Concept reveal (after completion)

import { useState } from 'react';
import './LevelSupport.css';

// ── LAYER 1 — Concept Intro Modal ─────────────────────────────────────────
// Shows automatically when the level loads for the first time
export function ConceptIntro({ concept, tagline, whatYouWillDo, whyItMatters, onStart }) {
  return (
    <div className="support-overlay">
      <div className="support-box intro-box">

        <div className="intro-tag">// Level Brief</div>

        <div className="intro-concept-badge">
          <span className="intro-concept-label">Concept</span>
          <span className="intro-concept-name">{concept}</span>
        </div>

        <p className="intro-tagline">{tagline}</p>

        <div className="intro-section">
          <div className="intro-section-label">🎯 What you will do</div>
          <p className="intro-section-text">{whatYouWillDo}</p>
        </div>

        <div className="intro-section">
          <div className="intro-section-label">💡 Why this matters</div>
          <p className="intro-section-text">{whyItMatters}</p>
        </div>

        <button className="intro-start-btn" onClick={onStart}>
          Got it — Start Level →
        </button>

      </div>
    </div>
  );
}

// ── LAYER 2 — Progressive Hints Panel ─────────────────────────────────────
// Player requests hints one by one — each one more direct than the last
export function HintsPanel({ hints, isVisible, onToggle, levelComplete }) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [showPanel, setShowPanel] = useState(false);

  function togglePanel() {
    setShowPanel(prev => !prev);
    if (!showPanel && revealedCount === 0) {
      // Auto-reveal first hint when panel opens first time
      setRevealedCount(1);
    }
  }

  function revealNext() {
    if (revealedCount < hints.length) {
      setRevealedCount(prev => prev + 1);
    }
  }

  if (levelComplete) return null;

  return (
    <div className="hints-container">
      <button className="hints-toggle" onClick={togglePanel}>
        {showPanel ? '▼ Hide Hints' : '💡 I need a hint'}
        {revealedCount > 0 && !showPanel && (
          <span className="hints-badge">{revealedCount}</span>
        )}
      </button>

      {showPanel && (
        <div className="hints-panel">
          <div className="hints-header">
            <span className="hints-title">Progressive Hints</span>
            <span className="hints-sub">{revealedCount} of {hints.length} revealed</span>
          </div>

          <div className="hints-list">
            {hints.slice(0, revealedCount).map((hint, i) => (
              <div
                key={i}
                className={`hint-item hint-level-${i + 1}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="hint-number">
                  {i === 0 ? '💭' : i === 1 ? '🔍' : '✅'}
                </div>
                <div className="hint-content">
                  <div className="hint-label">
                    {i === 0 ? 'Gentle nudge' : i === 1 ? 'More direction' : 'Direct guidance'}
                  </div>
                  <p className="hint-text">{hint}</p>
                </div>
              </div>
            ))}
          </div>

          {revealedCount < hints.length && (
            <button className="hint-reveal-btn" onClick={revealNext}>
              {revealedCount === 0
                ? 'Show me a hint'
                : revealedCount === hints.length - 1
                ? 'Show me exactly what to do'
                : 'Show another hint'}
            </button>
          )}

          {revealedCount === hints.length && (
            <div className="hints-exhausted">
              You have all the hints. You can do this — try again.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── LAYER 3 — Concept Reveal (inside celebration modal) ───────────────────
// Shows after level complete — the full "aha" moment
export function ConceptReveal({ concept, whatYouLearned, realWorldUse, developerSays }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="reveal-box">

      <div className="reveal-header">
        <div className="reveal-tag">💡 Concept Unlocked</div>
        <div className="reveal-concept">{concept}</div>
      </div>

      <p className="reveal-learned">{whatYouLearned}</p>

      <button
        className="reveal-expand-btn"
        onClick={() => setExpanded(prev => !prev)}
      >
        {expanded ? '▲ Less detail' : '▼ How this works in the real world'}
      </button>

      {expanded && (
        <div className="reveal-expanded">
          <div className="reveal-section">
            <div className="reveal-section-label">🏗️ In real projects</div>
            <p className="reveal-section-text">{realWorldUse}</p>
          </div>
          {developerSays && (
            <div className="reveal-quote">
              <div className="reveal-quote-label">👨‍💻 What a senior developer would say</div>
              <blockquote className="reveal-quote-text">"{developerSays}"</blockquote>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

// ── COMBINED: Level Support Wrapper ───────────────────────────────────────
// Drop this into any level to get all three layers automatically
export function LevelSupportWrapper({
  // Layer 1
  conceptIntro,
  // Layer 2
  hints,
  levelComplete,
  // Layer 3 — passed to celebration in Stage1Shell via props
  children,
}) {
  const [introSeen, setIntroSeen] = useState(false);

  // Show intro on first load
  if (!introSeen && conceptIntro) {
    return (
      <ConceptIntro
        {...conceptIntro}
        onStart={() => setIntroSeen(true)}
      />
    );
  }

  return (
    <>
      {children}
      {hints && (
        <HintsPanel
          hints={hints}
          levelComplete={levelComplete}
        />
      )}
    </>
  );
}

export default LevelSupportWrapper;