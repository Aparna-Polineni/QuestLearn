// src/screens/stage1/Level1_6.jsx
// Player builds their technology stack by dragging choices into slots
// Each placement reveals why that technology was chosen

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
import './Level1_6.css';

// ── Support content ────────────────────────────────────────────────────────
const SUPPORT = {
  intro: {
    concept: "Stack Decision Making",
    tagline: "Every technology choice is a trade-off. Know yours.",
    whatYouWillDo:
      "You will build your technology stack by dragging one technology into each of the 5 slots — Language, Frontend, Backend, Database, and Cloud. When you place a technology, you will see exactly why that choice was made for your project.",
    whyItMatters:
      "Walking into a job interview and saying 'we used Spring Boot because it has auto-configuration that reduces boilerplate and integrates seamlessly with JPA and Spring Security' is completely different from saying 'we used it because the tutorial used it'. Stack decisions have reasons. Know them.",
  },
  hints: [
    "This path teaches Java Full Stack — so Java is the language and Spring Boot is the backend. Some slots have only one correct answer. Others let you choose between valid options.",
    "Match each technology to its slot category. Java goes in Language. React goes in Frontend. Spring Boot goes in Backend. PostgreSQL goes in Database. AWS goes in Cloud. The slot label tells you exactly what belongs there.",
    "If a technology does not fit the slot you are dropping it into, it will bounce back. Read the slot name and match it to the technology type shown on each card.",
  ],
  reveal: {
    concept: "Stack Decision Making",
    whatYouLearned:
      "You just defined the technology stack you will use for the next 111 levels. Every choice has a reason — Java for type safety and enterprise adoption, Spring Boot for production-grade backend with minimal configuration, React for component-based UI, PostgreSQL for relational data integrity, AWS for industry-standard cloud deployment.",
    realWorldUse:
      "In real projects, stack decisions are made in architecture meetings and documented in Architecture Decision Records — ADRs. These documents explain not just what was chosen but why, and what alternatives were considered. Senior engineers are expected to defend every technology choice with business and technical reasoning.",
    developerSays:
      "The worst answer in a technical interview is 'I just used what was popular'. The best answer explains the trade-off you made and why it was right for your specific project constraints.",
  },
};

// ── Technology options ─────────────────────────────────────────────────────
const TECH_OPTIONS = [
  // Language
  {
    id: 'java', label: 'Java', emoji: '☕', category: 'language',
    color: '#f97316',
    why: 'Statically typed, catches bugs at compile time not runtime. Most in-demand backend language in enterprise. Strong ecosystem — everything integrates with Java.',
    tradeoff: 'More verbose than Python or JavaScript. Steeper learning curve. Worth it for the type safety and enterprise tooling.',
  },
  {
    id: 'python', label: 'Python', emoji: '🐍', category: 'language',
    color: '#4ade80',
    why: 'Simpler syntax, faster to prototype. Dominant in data science and ML.',
    tradeoff: 'Dynamic typing means more runtime errors. Slower performance. Less common in large enterprise backends.',
    wrong: true,
    wrongReason: 'This path teaches Java Full Stack. Python is a valid language but not the one we are building.',
  },

  // Frontend
  {
    id: 'react', label: 'React', emoji: '⚛️', category: 'frontend',
    color: '#38bdf8',
    why: 'Component-based — build once, reuse everywhere. Largest ecosystem of any frontend framework. Virtual DOM for performant updates. Most in-demand frontend skill globally.',
    tradeoff: 'Needs additional libraries for routing and state. Not a full framework — you assemble the pieces yourself.',
  },
  {
    id: 'angular', label: 'Angular', emoji: '🔺', category: 'frontend',
    color: '#ef4444',
    why: 'Full opinionated framework — everything included. Strong in enterprise Java shops because it pairs well with Java-style thinking.',
    tradeoff: 'Steeper learning curve. More boilerplate. Smaller job market than React.',
    wrong: true,
    wrongReason: 'Valid choice for enterprise but React has a larger job market and ecosystem. This path uses React.',
  },

  // Backend
  {
    id: 'springboot', label: 'Spring Boot', emoji: '🍃', category: 'backend',
    color: '#4ade80',
    why: 'Auto-configuration eliminates 90% of Spring XML boilerplate. Production-ready from day one — embedded server, health checks, metrics built in. Integrates seamlessly with JPA, Security, and every Java library.',
    tradeoff: 'Startup time is slower than Node.js. Memory footprint is larger. For a system at scale these are worth the trade-off.',
  },
  {
    id: 'nodejs', label: 'Node.js', emoji: '🟢', category: 'backend',
    color: '#86efac',
    why: 'Non-blocking I/O — excellent for high-concurrency real-time apps. Same language as frontend.',
    tradeoff: 'JavaScript — dynamic typing means more runtime errors. Not the Java path.',
    wrong: true,
    wrongReason: 'This is the Java Full Stack path. Node.js is a valid backend but not what we are building.',
  },

  // Database
  {
    id: 'postgresql', label: 'PostgreSQL', emoji: '🐘', category: 'database',
    color: '#818cf8',
    why: 'Most feature-complete open source relational database. ACID compliant — your transactions are safe. Advanced types, JSON support, full-text search. Industry standard for production Java applications.',
    tradeoff: 'Relational model requires upfront schema design. Less flexible than MongoDB for unstructured data. For most business applications, this structure is a feature not a bug.',
  },
  {
    id: 'mongodb', label: 'MongoDB', emoji: '🍃', category: 'database',
    color: '#4ade80',
    why: 'Schema-flexible document storage. Fast prototyping when data shape is uncertain.',
    tradeoff: 'No joins — complex queries get complicated fast. Consistency is weaker. Less suited to the relational data we are building.',
    wrong: true,
    wrongReason: 'Our system has clear relationships — patients have appointments, doctors belong to departments. A relational database fits this perfectly.',
  },

  // Cloud
  {
    id: 'aws', label: 'AWS', emoji: '☁️', category: 'cloud',
    color: '#f97316',
    why: 'Largest cloud provider — 33% market share. EC2, RDS, S3, CloudWatch all integrate seamlessly. Most job postings that require cloud experience specify AWS. Industry standard for Java enterprise deployments.',
    tradeoff: 'More complex than Heroku or Railway for beginners. Cost management requires attention. Worth learning because it is what most employers use.',
  },
  {
    id: 'gcp', label: 'Google Cloud', emoji: '🌐', category: 'cloud',
    color: '#38bdf8',
    why: 'Strong Kubernetes and data analytics tools. Competitive with AWS.',
    tradeoff: 'Smaller market share than AWS. Fewer enterprise Java integrations in the ecosystem.',
    wrong: true,
    wrongReason: 'Valid cloud choice but AWS has greater market share and more Java enterprise tooling. This path uses AWS.',
  },
];

const STACK_SLOTS = [
  { id: 'language', label: 'Language',  emoji: '💻', desc: 'What you write code in',         color: '#f97316' },
  { id: 'frontend', label: 'Frontend',  emoji: '🖥️', desc: 'What the user sees',             color: '#38bdf8' },
  { id: 'backend',  label: 'Backend',   emoji: '⚙️', desc: 'Server and business logic',      color: '#4ade80' },
  { id: 'database', label: 'Database',  emoji: '🗄️', desc: 'Where data is stored',           color: '#818cf8' },
  { id: 'cloud',    label: 'Cloud',     emoji: '☁️', desc: 'Where the app lives in production', color: '#fb923c' },
];

// ── Draggable tech card ────────────────────────────────────────────────────
function TechCard({ tech, compact }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: tech.id,
    data: { tech },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`tech-card ${compact ? 'tech-compact' : ''} ${tech.wrong ? 'tech-wrong-option' : ''}`}
      style={{
        '--tech-color': tech.color,
        opacity: isDragging ? 0.4 : 1,
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
        zIndex: isDragging ? 999 : 'auto',
        position: 'relative',
      }}
    >
      <span className="tech-emoji">{tech.emoji}</span>
      <div className="tech-info">
        <div className="tech-name">{tech.label}</div>
        {!compact && <div className="tech-category">{tech.category}</div>}
      </div>
    </div>
  );
}

// ── Stack slot droppable ───────────────────────────────────────────────────
function StackSlot({ slot, placedTech, onRemove, wrongMessage }) {
  const { setNodeRef, isOver } = useDroppable({ id: slot.id });
  const [showWhy, setShowWhy] = useState(false);

  return (
    <div
      className={`stack-slot ${placedTech ? 'slot-filled' : ''} ${isOver ? 'slot-over' : ''} ${wrongMessage ? 'slot-wrong' : ''}`}
      style={{ '--slot-color': slot.color }}
    >
      {/* Slot label */}
      <div className="slot-header">
        <span className="slot-emoji">{slot.emoji}</span>
        <div>
          <div className="slot-label">{slot.label}</div>
          <div className="slot-desc">{slot.desc}</div>
        </div>
      </div>

      {/* Drop area */}
      <div ref={setNodeRef} className="slot-dropzone">
        {!placedTech ? (
          <div className="slot-empty">
            Drop a {slot.label.toLowerCase()} technology here
          </div>
        ) : (
          <div className="slot-filled-content">
            <div className="slot-tech-header">
              <span className="slot-tech-emoji">{placedTech.emoji}</span>
              <span className="slot-tech-name">{placedTech.label}</span>
              <button className="slot-remove" onClick={onRemove}>×</button>
            </div>

            {/* Why this was chosen */}
            <div className="slot-why">
              <div className="slot-why-label">✓ Why this choice</div>
              <p className="slot-why-text">{placedTech.why}</p>
            </div>

            {/* Trade-off */}
            <button
              className="slot-tradeoff-toggle"
              onClick={() => setShowWhy(p => !p)}
            >
              {showWhy ? '▲ Hide trade-off' : '▼ See trade-off'}
            </button>

            {showWhy && (
              <div className="slot-tradeoff">
                <div className="slot-tradeoff-label">⚖️ Trade-off</div>
                <p className="slot-tradeoff-text">{placedTech.tradeoff}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Wrong placement message */}
      {wrongMessage && (
        <div className="slot-wrong-msg">⚠️ {wrongMessage}</div>
      )}
    </div>
  );
}

// ── Main Level ─────────────────────────────────────────────────────────────
function Level1_6() {
  const { selectedDomain } = useGame();
  const [stack, setStack, undoControls] = useUndo({});
  // stack: { slotId: techId }

  const [wrongMsg, setWrongMsg] = useState({});
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const placedTechIds = Object.values(stack);
  const unplaced = TECH_OPTIONS.filter(t => !placedTechIds.includes(t.id));
  const canProceed = STACK_SLOTS.every(slot => {
    const techId = stack[slot.id];
    if (!techId) return false;
    const tech = TECH_OPTIONS.find(t => t.id === techId);
    return tech && !tech.wrong;
  });

  const activetech = TECH_OPTIONS.find(t => t.id === activeId);

  function handleDragStart({ active }) {
    setActiveId(active.id);
  }

  function handleDragEnd({ active, over }) {
    setActiveId(null);
    if (!over) return;

    const slotId = over.id;
    const slot   = STACK_SLOTS.find(s => s.id === slotId);
    if (!slot) return;

    const tech = TECH_OPTIONS.find(t => t.id === active.id);
    if (!tech) return;

    // Check category match
    if (tech.category !== slot.id) {
      setWrongMsg(prev => ({
        ...prev,
        [slotId]: `${tech.label} is a ${tech.category} technology, not a ${slot.label.toLowerCase()}.`,
      }));
      setTimeout(() => setWrongMsg(prev => ({ ...prev, [slotId]: null })), 3000);
      return;
    }

    setWrongMsg(prev => ({ ...prev, [slotId]: null }));
    setStack(prev => ({ ...prev, [slotId]: tech.id }));
  }

  function removeFromSlot(slotId) {
    setStack(prev => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
  }

  return (
    <Stage1Shell levelId={6} canProceed={canProceed} conceptReveal={SUPPORT.reveal} undoControls={undoControls}>
      <LevelSupportWrapper
        conceptIntro={SUPPORT.intro}
        hints={SUPPORT.hints}
        levelComplete={canProceed}
      >
        <div className="l16-container">

          {/* Brief */}
          <div className="l16-brief">
            <div className="l16-brief-tag">// Mission Brief</div>
            <h2 className="l16-brief-title">
              Choose the tech stack for your{' '}
              <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name}</span>.
            </h2>
            <p className="l16-brief-text">
              Drag each technology into the correct slot. Wrong category placements are rejected.
              When placed correctly you will see exactly why that technology was chosen.
            </p>
            <div className="l16-progress">
              <span className="l16-progress-label">
                {Object.values(stack).filter(id => {
                  const t = TECH_OPTIONS.find(x => x.id === id);
                  return t && !t.wrong;
                }).length} of {STACK_SLOTS.length} slots filled correctly
              </span>
            </div>
          </div>

          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="l16-workspace">

              {/* Stack slots */}
              <div className="l16-slots">
                {STACK_SLOTS.map(slot => {
                  const techId    = stack[slot.id];
                  const placedTech = TECH_OPTIONS.find(t => t.id === techId);
                  return (
                    <StackSlot
                      key={slot.id}
                      slot={slot}
                      placedTech={placedTech}
                      onRemove={() => removeFromSlot(slot.id)}
                      wrongMessage={wrongMsg[slot.id]}
                    />
                  );
                })}
              </div>

              {/* Tech options panel */}
              {unplaced.length > 0 && (
                <div className="l16-panel">
                  <div className="l16-panel-label">Available Technologies</div>
                  <div className="l16-panel-sub">Drag into the matching slot</div>
                  <div className="l16-panel-list">
                    {unplaced.map(tech => (
                      <TechCard key={tech.id} tech={tech} />
                    ))}
                  </div>
                </div>
              )}

            </div>

            <DragOverlay>
              {activetech && (
                <div
                  className="tech-card tech-overlay"
                  style={{ '--tech-color': activetech.color }}
                >
                  <span className="tech-emoji">{activetech.emoji}</span>
                  <div className="tech-info">
                    <div className="tech-name">{activetech.label}</div>
                    <div className="tech-category">{activetech.category}</div>
                  </div>
                </div>
              )}
            </DragOverlay>

          </DndContext>

          {canProceed && (
            <div className="l16-success">
              ✓ Stack defined. Java · React · Spring Boot · PostgreSQL · AWS.
              Every choice has a reason. You can defend all of them.
            </div>
          )}

        </div>
      </LevelSupportWrapper>
    </Stage1Shell>
  );
}

export default Level1_6;