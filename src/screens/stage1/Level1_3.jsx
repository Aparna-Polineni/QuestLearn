// src/screens/stage1/Level1_3.jsx
import { useState, useEffect } from 'react';
import {
  DndContext, DragOverlay,
  PointerSensor, useSensor, useSensors,
  useDroppable, useDraggable
} from '@dnd-kit/core';
import { useGame } from '../../context/GameContext';
import Stage1Shell from './Stage1Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import './Level1_3.css';
import useUndo from '../../hooks/useUndo';

// ── Support content ────────────────────────────────────────────────────────
const SUPPORT = {
  intro: {
    concept: "UI/UX Thinking Before Code",
    tagline: "Design what users see before you build what they use.",
    whatYouWillDo:
      "You will wireframe each of your domain's core screens by dragging UI elements — navbars, buttons, forms, tables, cards — onto each screen. Each screen needs at least 3 elements that match its purpose.",
    whyItMatters:
      "Developers who code without wireframing build interfaces that need to be rebuilt. Wireframing forces you to answer: what does the user need on this screen? Answering this before writing HTML saves days of rework.",
  },
  hints: [
    "Start with the most obvious element for each screen. A login screen needs a Form. A data list screen needs a Table. A dashboard needs Charts. Let the screen's purpose guide you.",
    "Every screen needs at least: something to navigate (Navbar), something showing data (Table, Cards, or Chart), and something the user acts on (Button or Form). Three elements minimum.",
    "Read each screen name carefully. A booking screen needs a Form. A list screen needs a Table. A dashboard needs Charts and Cards. Match the element to the purpose of the screen.",
  ],
  reveal: {
    concept: "UI/UX Thinking Before Code",
    whatYouLearned:
      "You just created a wireframe for every core screen of your application — the industry standard way to plan a UI before writing any code. Every element you placed maps directly to a React component you will build in Stage 4.",
    realWorldUse:
      "In real product teams, designers wireframe in Figma before any developer opens their IDE. Every element you placed today — Navbar, Table, Form, Button — becomes a React component with props, state, and API connections in your actual application.",
    developerSays:
      "I once spent three days building a complex form only to find out the client needed a table instead. I never skip wireframing anymore. Thirty minutes of planning saves three days of rebuilding.",
  },
};

// ── UI elements palette ────────────────────────────────────────────────────
const UI_ELEMENTS = [
  { id: 'navbar',  label: 'Navbar',      emoji: '🧭', desc: 'Top navigation',    color: '#38bdf8' },
  { id: 'table',   label: 'Table',       emoji: '📋', desc: 'Rows and columns',  color: '#818cf8' },
  { id: 'form',    label: 'Form',        emoji: '📝', desc: 'Inputs and submit', color: '#f97316' },
  { id: 'card',    label: 'Cards',       emoji: '🃏', desc: 'Grid of cards',     color: '#4ade80' },
  { id: 'button',  label: 'Button',      emoji: '🔘', desc: 'Action trigger',    color: '#fb923c' },
  { id: 'chart',   label: 'Chart',       emoji: '📊', desc: 'Data viz',          color: '#f472b6' },
  { id: 'sidebar', label: 'Sidebar',     emoji: '📑', desc: 'Side navigation',   color: '#a78bfa' },
  { id: 'search',  label: 'Search Bar',  emoji: '🔍', desc: 'Filter and find',   color: '#34d399' },
  { id: 'header',  label: 'Page Header', emoji: '🏷️', desc: 'Title area',       color: '#fbbf24' },
  { id: 'modal',   label: 'Modal',       emoji: '💬', desc: 'Popup dialog',      color: '#60a5fa' },
];

// ── Draggable element in the palette ──────────────────────────────────────
function PaletteElement({ element }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${element.id}`,
    data: { elementId: element.id },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="palette-card"
      style={{
        '--el-color': element.color,
        opacity: isDragging ? 0.4 : 1,
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
        zIndex: isDragging ? 999 : 'auto',
        position: 'relative',
      }}
    >
      <span className="palette-emoji">{element.emoji}</span>
      <div>
        <div className="palette-name">{element.label}</div>
        <div className="palette-desc">{element.desc}</div>
      </div>
    </div>
  );
}

// ── Droppable screen wireframe ─────────────────────────────────────────────
function ScreenWireframe({ screen, placedElements, onRemove, minElements }) {
  const { setNodeRef, isOver } = useDroppable({ id: screen.id });
  const isDone = placedElements.length >= minElements;

  return (
    <div className={`wireframe ${isDone ? 'wireframe-done' : ''}`}>
      <div className="wireframe-titlebar">
        <span className="wireframe-emoji">{screen.emoji}</span>
        <span className="wireframe-name">{screen.label}</span>
        <span className={`wireframe-count ${isDone ? 'count-done' : ''}`}>
          {placedElements.length} / {minElements}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`wireframe-dropzone ${isOver ? 'dropzone-over' : ''}`}
      >
        {placedElements.length === 0 ? (
          <p className="wireframe-empty">Drop elements here</p>
        ) : (
          <div className="wireframe-placed">
            {placedElements.map((el, i) => (
              <div
                key={i}
                className="wireframe-element"
                style={{ '--el-color': el.color }}
              >
                <span>{el.emoji}</span>
                <span>{el.label}</span>
                <button
                  className="wireframe-remove"
                  onClick={() => onRemove(i)}
                >×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {isDone && <div className="wireframe-badge">✓ Done</div>}
    </div>
  );
}

// ── Main Level ─────────────────────────────────────────────────────────────
function Level1_3() {
  const { selectedDomain } = useGame();
  const screens = selectedDomain?.screens || [];
  const MIN = 3;

  const [placed, setPlaced, undoControls] = useUndo({});
  const [activeElementId, setActiveElementId] = useState(null);

  // Initialise placed state once domain screens are available
  useEffect(() => {
    if (screens.length > 0) {
      const init = {};
      screens.forEach(s => { init[s.id] = []; });
      setPlaced(init);
    }
  }, [selectedDomain]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const doneCount  = screens.filter(s => (placed[s.id] || []).length >= MIN).length;
  const canProceed = doneCount === screens.length && screens.length > 0;
  const activeEl   = UI_ELEMENTS.find(e => `palette-${e.id}` === activeElementId);

  function handleDragStart({ active }) {
    setActiveElementId(active.id);
  }

  function handleDragEnd({ active, over }) {
    setActiveElementId(null);
    if (!over) return;

    const screenId  = over.id;
    const elementId = active.data?.current?.elementId;
    if (!screenId || !elementId) return;

    const el = UI_ELEMENTS.find(e => e.id === elementId);
    if (!el) return;
    if (!screens.find(s => s.id === screenId)) return;
    if ((placed[screenId] || []).length >= 6) return;

    setPlaced(prev => ({
      ...prev,
      [screenId]: [...(prev[screenId] || []), el],
    }));
  }

  function removeElement(screenId, index) {
    setPlaced(prev => ({
      ...prev,
      [screenId]: prev[screenId].filter((_, i) => i !== index),
    }));
  }

  return (
    <Stage1Shell levelId={3} canProceed={canProceed} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper
        conceptIntro={SUPPORT.intro}
        hints={SUPPORT.hints}
        levelComplete={canProceed}
      >
        <div className="l13-container">

          {/* Brief */}
          <div className="l13-brief">
            <div className="l13-brief-tag">// Mission Brief</div>
            <h2 className="l13-brief-title">
              Wireframe the screens of your{' '}
              <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name}</span>.
            </h2>
            <p className="l13-brief-text">
              Drag UI elements from the right panel onto each screen.
              Each screen needs at least <strong>{MIN} elements</strong> that match its purpose.
            </p>
            <div className="l13-progress-row">
              <span className="l13-progress-label">
                {doneCount} of {screens.length} screens designed
              </span>
              <div className="l13-progress-track">
                <div
                  className="l13-progress-fill"
                  style={{ width: `${screens.length ? (doneCount / screens.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="l13-workspace">

              {/* Screen wireframes */}
              <div className="l13-screens-grid">
                {screens.map(screen => (
                  <ScreenWireframe
                    key={screen.id}
                    screen={screen}
                    placedElements={placed[screen.id] || []}
                    onRemove={i => removeElement(screen.id, i)}
                    minElements={MIN}
                  />
                ))}
              </div>

              {/* Elements palette */}
              <div className="l13-palette">
                <div className="l13-palette-title">UI Elements</div>
                <div className="l13-palette-sub">Drag onto any screen</div>
                <div className="l13-palette-list">
                  {UI_ELEMENTS.map(el => (
                    <PaletteElement key={el.id} element={el} />
                  ))}
                </div>
              </div>

            </div>

            {/* Drag overlay — follows cursor */}
            <DragOverlay>
              {activeEl && (
                <div
                  className="palette-card palette-overlay"
                  style={{ '--el-color': activeEl.color }}
                >
                  <span className="palette-emoji">{activeEl.emoji}</span>
                  <div>
                    <div className="palette-name">{activeEl.label}</div>
                  </div>
                </div>
              )}
            </DragOverlay>

          </DndContext>

          {/* Insight */}
          <div className="l13-insight">
            <div className="l13-insight-label">💡 Wireframe to component</div>
            <p>
              Every element you drag here becomes a <strong>React component</strong> in Stage 4.
              A Table becomes <code>&lt;PatientTable /&gt;</code>. A Form becomes <code>&lt;BookingForm /&gt;</code>.
              You are not just designing — you are planning your entire component tree.
            </p>
          </div>

          {canProceed && (
            <div className="l13-success">
              ✓ All {screens.length} screens wireframed. Your UI blueprint is complete.
            </div>
          )}

        </div>
      </LevelSupportWrapper>
    </Stage1Shell>
  );
}

export default Level1_3;