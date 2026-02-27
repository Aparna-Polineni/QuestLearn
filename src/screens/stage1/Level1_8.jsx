// src/screens/stage1/Level1_8.jsx
// Player drags milestone cards onto a timeline in the correct order
// Final level of Stage 1 — player sees the full journey ahead

import { useState } from 'react';
import {
  DndContext, DragOverlay,
  PointerSensor, useSensor, useSensors,
  useDroppable, useDraggable
} from '@dnd-kit/core';
import { useGame } from '../../context/GameContext';
import Stage1Shell from './Stage1Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import useUndo from '../../hooks/useUndo';
import './Level1_8.css';

// ── Support content ────────────────────────────────────────────────────────
const SUPPORT = {
  intro: {
    concept: "Project Planning and Scoping",
    tagline: "Know the whole journey before you take the first step.",
    whatYouWillDo:
      "You will build your project roadmap by dragging milestone cards onto a timeline in the correct order. Each milestone represents one stage of the full stack journey you are about to take — from design through deployment.",
    whyItMatters:
      "A developer who cannot explain how long something will take or what order to build it in cannot work in a team. Roadmaps exist so everyone — you, your team, your client — knows what is being built, when, and in what sequence. This is the last thing you do before writing code.",
  },
  hints: [
    "Think about dependencies — what must exist before something else can be built? You cannot build the frontend before you have designed the screens. You cannot deploy before you have something to deploy. Let the dependencies guide the order.",
    "The general order is: Design first, then learn the core language, then build the backend, then build the frontend, then connect them together, then add the database properly, then deploy. Each stage builds on the last.",
    "The correct order is: Design and Thinking → Java Core → Java Advanced → Frontend React → Spring Boot Backend → Database and SQL → Full Stack Integration → Deployment and DevOps → Capstone Project.",
  ],
  reveal: {
    concept: "Project Planning and Scoping",
    whatYouLearned:
      "You just built your complete project roadmap — all 9 stages in the correct dependency order. This is exactly what a technical project plan looks like. Every stage you placed represents weeks of real development work that you are now going to do.",
    realWorldUse:
      "In real projects this is called a project roadmap or sprint plan. It is presented to stakeholders, used to estimate timelines, and reviewed at the start of every sprint. A developer who can look at a new project and immediately explain the build order and dependencies is demonstrating senior-level thinking.",
    developerSays:
      "The number one reason projects fail is starting to code before the plan is clear. You now have a complete picture of what you are building and in what order. That puts you ahead of most junior developers before you have written a single line of code.",
  },
};

// ── Milestone cards ────────────────────────────────────────────────────────
const MILESTONES = [
  {
    id: 'stage1', label: 'Design & Thinking',     emoji: '🎨',
    correctPosition: 1, color: '#38bdf8',
    desc: 'Architecture, wireframes, data model, API contract',
    duration: '1 week',
  },
  {
    id: 'stage2', label: 'Java Core',             emoji: '☕',
    correctPosition: 2, color: '#f97316',
    desc: 'Variables, OOP, collections, exceptions',
    duration: '3 weeks',
  },
  {
    id: 'stage3', label: 'Java Advanced',         emoji: '🔬',
    correctPosition: 3, color: '#818cf8',
    desc: 'Streams, generics, design patterns, concurrency',
    duration: '2 weeks',
  },
  {
    id: 'stage4', label: 'Frontend React',        emoji: '⚛️',
    correctPosition: 4, color: '#38bdf8',
    desc: 'Components, hooks, routing, state management',
    duration: '2 weeks',
  },
  {
    id: 'stage5', label: 'Spring Boot Backend',   emoji: '🍃',
    correctPosition: 5, color: '#4ade80',
    desc: 'REST API, JPA, security, testing',
    duration: '4 weeks',
  },
  {
    id: 'stage6', label: 'Database & SQL',        emoji: '🐘',
    correctPosition: 6, color: '#f472b6',
    desc: 'Schema design, queries, Hibernate, migrations',
    duration: '2 weeks',
  },
  {
    id: 'stage7', label: 'Full Stack Integration',emoji: '🔗',
    correctPosition: 7, color: '#fbbf24',
    desc: 'CORS, error handling, file upload, WebSockets',
    duration: '2 weeks',
  },
  {
    id: 'stage8', label: 'Deployment & DevOps',   emoji: '🚀',
    correctPosition: 8, color: '#ef4444',
    desc: 'Docker, CI/CD, AWS, monitoring',
    duration: '2 weeks',
  },
  {
    id: 'stage9', label: 'Capstone Project',      emoji: '🏆',
    correctPosition: 9, color: '#4ade80',
    desc: 'Build independently from scratch — your portfolio piece',
    duration: '3 weeks',
  },
];

// ── Draggable milestone card ───────────────────────────────────────────────
function MilestoneCard({ milestone, small }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: milestone.id,
    data: { milestone },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`milestone-card ${small ? 'milestone-small' : ''}`}
      style={{
        '--m-color': milestone.color,
        opacity: isDragging ? 0.4 : 1,
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
        zIndex: isDragging ? 999 : 'auto',
        position: 'relative',
      }}
    >
      <span className="milestone-emoji">{milestone.emoji}</span>
      <div className="milestone-info">
        <div className="milestone-label">{milestone.label}</div>
        {!small && <div className="milestone-desc">{milestone.desc}</div>}
        {!small && <div className="milestone-duration">~{milestone.duration}</div>}
      </div>
    </div>
  );
}

// ── Timeline slot ──────────────────────────────────────────────────────────
function TimelineSlot({ position, placedMilestone, onRemove }) {
  const { setNodeRef, isOver } = useDroppable({ id: `slot-${position}` });
  const isCorrect = placedMilestone?.correctPosition === position;

  return (
    <div className="timeline-slot-wrapper">
      <div className="timeline-position">
        <span className="position-number">{position}</span>
        <div className="position-line" />
      </div>

      <div
        ref={setNodeRef}
        className={`timeline-slot ${isOver ? 'slot-over' : ''} ${placedMilestone ? (isCorrect ? 'slot-correct' : 'slot-wrong') : ''}`}
      >
        {!placedMilestone ? (
          <div className="slot-empty-label">Drop milestone here</div>
        ) : (
          <div className="slot-filled" style={{ '--m-color': placedMilestone.color }}>
            <span className="slot-emoji">{placedMilestone.emoji}</span>
            <div className="slot-content">
              <div className="slot-milestone-name">{placedMilestone.label}</div>
              <div className="slot-milestone-desc">{placedMilestone.desc}</div>
              <div className="slot-milestone-duration">~{placedMilestone.duration}</div>
            </div>
            <div className="slot-indicators">
              <span className="slot-status">{isCorrect ? '✓' : '✗'}</span>
              <button className="slot-remove" onClick={onRemove}>×</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Level ─────────────────────────────────────────────────────────────
function Level1_8() {
  const { selectedDomain } = useGame();
  const [timeline, setTimeline, undoControls] = useUndo({});
  // timeline: { 'slot-1': milestoneId, 'slot-2': milestoneId, ... }

  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const placedIds  = Object.values(timeline).filter(Boolean);
  const unplaced   = MILESTONES.filter(m => !placedIds.includes(m.id));

  const correctCount = Object.entries(timeline).filter(([slotKey, milestoneId]) => {
    const position  = parseInt(slotKey.replace('slot-', ''));
    const milestone = MILESTONES.find(m => m.id === milestoneId);
    return milestone?.correctPosition === position;
  }).length;

  const allPlaced  = unplaced.length === 0;
  const canProceed = allPlaced && correctCount === MILESTONES.length;

  const activeMilestone = MILESTONES.find(m => m.id === activeId);

  function handleDragStart({ active }) { setActiveId(active.id); }

  function handleDragEnd({ active, over }) {
    setActiveId(null);
    if (!over) return;

    const slotKey   = over.id; // 'slot-1', 'slot-2', etc.
    const milestone = MILESTONES.find(m => m.id === active.id);
    if (!milestone) return;
    if (!slotKey.startsWith('slot-')) return;

    // Swap if slot already occupied
    const currentInSlot = timeline[slotKey];

    setTimeline(prev => {
      const next = { ...prev };
      // If dragged from another slot, free that slot
      const prevSlot = Object.keys(prev).find(k => prev[k] === milestone.id);
      if (prevSlot) delete next[prevSlot];
      // If target slot has something, put it back to unplaced (delete it)
      if (currentInSlot) delete next[slotKey];
      next[slotKey] = milestone.id;
      return next;
    });
  }

  function removeFromSlot(slotKey) {
    setTimeline(prev => {
      const next = { ...prev };
      delete next[slotKey];
      return next;
    });
  }

  const totalWeeks = MILESTONES.reduce((sum, m) => sum + parseInt(m.duration), 0);

  return (
    <Stage1Shell levelId={8} canProceed={canProceed} conceptReveal={SUPPORT.reveal} undoControls={undoControls}>
      <LevelSupportWrapper
        conceptIntro={SUPPORT.intro}
        hints={SUPPORT.hints}
        levelComplete={canProceed}
      >
        <div className="l18-container">

          {/* Brief */}
          <div className="l18-brief">
            <div className="l18-brief-tag">// Mission Brief</div>
            <h2 className="l18-brief-title">
              Build the roadmap for your{' '}
              <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name}</span>.
            </h2>
            <p className="l18-brief-text">
              Drag each stage onto the timeline in the correct order.
              Think about what each stage depends on — you cannot integrate what you haven't built.
            </p>

            {/* Progress */}
            <div className="l18-stats">
              <div className="l18-stat">
                <span className="l18-stat-num" style={{ color: canProceed ? '#4ade80' : '#38bdf8' }}>
                  {correctCount}
                </span>
                <span className="l18-stat-label">/ {MILESTONES.length} correct</span>
              </div>
              <div className="l18-stat">
                <span className="l18-stat-num" style={{ color: '#f97316' }}>{totalWeeks}</span>
                <span className="l18-stat-label">weeks total</span>
              </div>
              <div className="l18-stat">
                <span className="l18-stat-num" style={{ color: '#818cf8' }}>119</span>
                <span className="l18-stat-label">levels ahead</span>
              </div>
            </div>
          </div>

          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="l18-workspace">

              {/* Timeline */}
              <div className="l18-timeline">
                <div className="l18-timeline-label">Your Roadmap — drag milestones into order</div>
                <div className="l18-slots">
                  {Array.from({ length: 9 }, (_, i) => i + 1).map(pos => {
                    const slotKey         = `slot-${pos}`;
                    const placedId        = timeline[slotKey];
                    const placedMilestone = MILESTONES.find(m => m.id === placedId);
                    return (
                      <TimelineSlot
                        key={pos}
                        position={pos}
                        placedMilestone={placedMilestone}
                        onRemove={() => removeFromSlot(slotKey)}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Unplaced cards */}
              {unplaced.length > 0 && (
                <div className="l18-panel">
                  <div className="l18-panel-label">Stages to Place</div>
                  <div className="l18-panel-sub">Drag onto timeline</div>
                  <div className="l18-panel-list">
                    {unplaced.map(m => (
                      <MilestoneCard key={m.id} milestone={m} small />
                    ))}
                  </div>
                </div>
              )}

            </div>

            <DragOverlay>
              {activeMilestone && (
                <div
                  className="milestone-card milestone-overlay"
                  style={{ '--m-color': activeMilestone.color }}
                >
                  <span className="milestone-emoji">{activeMilestone.emoji}</span>
                  <div className="milestone-info">
                    <div className="milestone-label">{activeMilestone.label}</div>
                  </div>
                </div>
              )}
            </DragOverlay>

          </DndContext>

          {/* Stage 1 complete message */}
          {canProceed && (
            <div className="l18-complete">
              <div className="l18-complete-title">🎓 Stage 1 Complete — Design & Thinking</div>
              <p className="l18-complete-text">
                You have done what most developers skip entirely. You designed your system before building it.
                You have user stories, an architecture diagram, wireframes, a data model, an API contract,
                a tech stack with reasons, a project structure, and a roadmap.
                Now you build it. Stage 2 starts with Java — from zero.
              </p>
              <div className="l18-deliverables">
                <div className="l18-deliverable">📋 User stories prioritised</div>
                <div className="l18-deliverable">🗺️ Architecture diagram</div>
                <div className="l18-deliverable">🖥️ Wireframes for all screens</div>
                <div className="l18-deliverable">🗄️ Entity relationship diagram</div>
                <div className="l18-deliverable">🔌 API contract defined</div>
                <div className="l18-deliverable">⚙️ Stack chosen with reasons</div>
                <div className="l18-deliverable">📁 Project structure ready</div>
                <div className="l18-deliverable">🗓️ Full roadmap planned</div>
              </div>
            </div>
          )}

        </div>
      </LevelSupportWrapper>
    </Stage1Shell>
  );
}

export default Level1_8;