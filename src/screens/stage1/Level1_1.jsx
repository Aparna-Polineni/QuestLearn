// src/screens/stage1/Level1_1.jsx
import { useState } from 'react';
import {
  DndContext, DragOverlay, closestCenter,
  PointerSensor, useSensor, useSensors
} from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { useGame } from '../../context/GameContext';
import Stage1Shell from './Stage1Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import './Level1_1.css';
import useUndo from '../../hooks/useUndo';


// ── Support content for this level ────────────────────────────────────────
const SUPPORT = {
  intro: {
    concept: "Problem Decomposition",
    tagline: "Before you write code, understand what you're building.",
    whatYouWillDo: "You'll receive a set of user stories — descriptions of what different people need the system to do. Your job is to prioritise them by dragging each one into Must Have, Should Have, or Could Have.",
    whyItMatters: "Every real software project starts with requirements. Developers who skip this step build the wrong thing — perfectly. Prioritising before building is how professional teams define their MVP and avoid running out of time.",
  },
  hints: [
    "A Must Have is something the system literally cannot function without. Ask yourself: if this feature is missing on day one, does the whole system fail? If yes — it's a Must Have.",
    "Try to keep Must Have to your 3 most critical stories. Think about what the first version of this system absolutely needs to work — just the core flow, nothing extra.",
    "Start by placing the most obvious Must Have — usually the one about the core user creating or accessing their main data. Then place the least important ones in Could Have. Everything in between goes to Should Have.",
  ],
  reveal: {
    concept: "Problem Decomposition",
    whatYouLearned: "You just broke a project brief down into prioritised requirements — exactly what happens in the first meeting of every real software project. The Must Haves you identified are your MVP — the smallest version of the system that actually works.",
    realWorldUse: "In real teams this process is called Requirements Gathering and Sprint Planning. Product managers write user stories. Developers estimate effort. The team votes on what goes into the first sprint. Without this step, teams spend 3 months building features nobody needed and run out of budget before the core system works.",
    developerSays: "I've seen projects fail not because the developers were bad — but because nobody agreed on what Must Have meant before they started building. Always define your MVP in writing before opening your IDE.",
  },
};

// ── Draggable story card ───────────────────────────────────────────────────
function StoryCard({ story, isDragging }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: story.id });
  const style = transform ? {
    transform: `translate(${transform.x}px, ${transform.y}px)`,
    zIndex: 999,
    opacity: isDragging ? 0.4 : 1,
  } : {};
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}
      className={`story-card ${isDragging ? 'story-dragging' : ''}`}>
      <div className="story-icon">📌</div>
      <p className="story-text">{story.text}</p>
      <div className="story-drag-hint">drag to prioritise</div>
    </div>
  );
}

// ── Drop column ────────────────────────────────────────────────────────────
function PriorityColumn({ id, label, emoji, color, stories, description }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef}
      className={`priority-column ${isOver ? 'column-over' : ''}`}
      style={{ '--col-color': color }}>
      <div className="column-header">
        <span className="column-emoji">{emoji}</span>
        <div>
          <div className="column-label" style={{ color }}>{label}</div>
          <div className="column-desc">{description}</div>
        </div>
      </div>
      <div className="column-body">
        {stories.length === 0 && (
          <div className="column-empty">Drop user stories here</div>
        )}
        {stories.map(s => (
          <StoryCard key={s.id} story={s} isDragging={false} />
        ))}
      </div>
      <div className="column-count">
        {stories.length} {stories.length === 1 ? 'story' : 'stories'}
      </div>
    </div>
  );
}

// ── Main Level ─────────────────────────────────────────────────────────────
function Level1_1() {
  const { selectedDomain } = useGame();
  const [activeId, setActiveId] = useState(null);
  const [placement, setPlacement, undoControls] = useUndo((() => {
  const init = {};
  selectedDomain?.userStories.forEach(s => { init[s.id] = 'unplaced'; });
  return init;
})());

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: { distance: 8 }
  }));

  const stories = selectedDomain?.userStories || [];
  const grouped = {
    unplaced: stories.filter(s => placement[s.id] === 'unplaced'),
    must:     stories.filter(s => placement[s.id] === 'must'),
    should:   stories.filter(s => placement[s.id] === 'should'),
    could:    stories.filter(s => placement[s.id] === 'could'),
  };

  const activeStory   = stories.find(s => s.id === activeId);
  const mustCount     = grouped.must.length;
  const allPlaced     = grouped.unplaced.length === 0;
  const mustWarning   = mustCount > 3;
  const canProceed    = allPlaced && mustCount >= 1 && mustCount <= 3;

  function handleDragStart(event) { setActiveId(event.active.id); }
  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    if (['unplaced','must','should','could'].includes(over.id)) {
      setPlacement(prev => ({ ...prev, [active.id]: over.id }));
    }
  }

  return (
    <Stage1Shell
      levelId={1}
      canProceed={canProceed}
      conceptReveal={SUPPORT.reveal}
      undoControls={undoControls}
    >
      <LevelSupportWrapper
        conceptIntro={SUPPORT.intro}
        hints={SUPPORT.hints}
        levelComplete={canProceed}
      >
        <div className="l11-container">

          {/* Brief */}
          <div className="l11-brief">
            <div className="l11-brief-tag">// Mission Brief</div>
            <h2 className="l11-brief-title">
              You've been hired to build a{' '}
              <span style={{ color: selectedDomain?.color }}>
                {selectedDomain?.name}
              </span>.
            </h2>
            <p className="l11-brief-text">
              Your client gave you <strong>{stories.length} user stories</strong>.
              Prioritise them by dragging each one into the right column.
              Be honest — not everything can be Must Have.
            </p>
            <div className="l11-rules">
              <div className="l11-rule"><span className="rule-dot must-dot" /><span><strong>Must Have</strong> — system fails without this. Maximum 3.</span></div>
              <div className="l11-rule"><span className="rule-dot should-dot" /><span><strong>Should Have</strong> — important but not day-one critical.</span></div>
              <div className="l11-rule"><span className="rule-dot could-dot" /><span><strong>Could Have</strong> — nice to have, build later.</span></div>
            </div>
            {allPlaced && mustWarning && (
              <div className="l11-warning">
                ⚠️ Too many Must Haves ({mustCount}). Real projects get killed by trying to do everything at once. Limit Must Have to 3 maximum.
              </div>
            )}
            {canProceed && (
              <div className="l11-success">
                ✓ Good prioritisation. {mustCount} Must Have{mustCount !== 1 ? 's' : ''} defined. Your MVP is clear.
              </div>
            )}
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {grouped.unplaced.length > 0 && (
              <div className="l11-unplaced-section">
                <div className="l11-unplaced-label">
                  📋 Unplaced Stories — drag each one into a priority column below
                </div>
                <div className="l11-unplaced-pool">
                  {grouped.unplaced.map(s => (
                    <StoryCard key={s.id} story={s} isDragging={s.id === activeId} />
                  ))}
                </div>
              </div>
            )}

            <div className="l11-columns">
              <PriorityColumn id="must"   label="Must Have"   emoji="🔴" color="#ef4444" description="Core MVP — ship without this and the system fails"           stories={grouped.must}   />
              <PriorityColumn id="should" label="Should Have" emoji="🟡" color="#f59e0b" description="Important — deliver in the next sprint after launch"         stories={grouped.should} />
              <PriorityColumn id="could"  label="Could Have"  emoji="🟢" color="#22c55e" description="Nice to have — build only when everything else is done"       stories={grouped.could}  />
            </div>

            <DragOverlay>
              {activeStory && (
                <div className="story-card story-overlay">
                  <div className="story-icon">📌</div>
                  <p className="story-text">{activeStory.text}</p>
                </div>
              )}
            </DragOverlay>
          </DndContext>

          <div className="l11-insight">
            <div className="l11-insight-label">💡 Why developers do this</div>
            <p>
              The <strong>MoSCoW method</strong> (Must, Should, Could, Won't) is used by professional teams
              to scope every sprint. Without it, teams try to build everything at once, run out of time,
              and deliver nothing. Your Must Haves become your <strong>Minimum Viable Product (MVP)</strong>.
            </p>
          </div>

        </div>
      </LevelSupportWrapper>
    </Stage1Shell>
  );
}

export default Level1_1;