// src/screens/stage1/Level1_4.jsx
// Player drags entities onto canvas and connects relationships between them

import { useState, useRef, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import Stage1Shell from './Stage1Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import './Level1_4.css';

// ── Support content ────────────────────────────────────────────────────────
const SUPPORT = {
  intro: {
    concept: "Data Modelling",
    tagline: "Before you build a database, decide what it needs to remember.",
    whatYouWillDo:
      "You will drag your system's entities onto a canvas — the things your application needs to store, like Patient, Doctor, Appointment. Then you will connect them with relationships and label each connection as One-to-Many or Many-to-Many.",
    whyItMatters:
      "A badly designed data model cannot be fixed without rewriting everything. Getting this right before writing a single SQL query or JPA entity saves weeks of painful migration work later. Every table in your database starts as an entity in this diagram.",
  },
  hints: [
    "An entity is any 'thing' your system needs to remember. Ask yourself: what are the nouns in my system? Patients, Doctors, Appointments, Departments — each one is an entity.",
    "To find relationships, ask: does one X have many Ys? A Doctor has many Appointments — that is One-to-Many. Can an X have many Ys AND a Y have many Xs? A Student has many Classes AND a Class has many Students — that is Many-to-Many.",
    "Start by connecting the two most obvious entities first — usually the main user entity and the core action entity. For a Hospital that would be Patient and Appointment. Then connect outward from there.",
  ],
  reveal: {
    concept: "Data Modelling",
    whatYouLearned:
      "You just designed an Entity Relationship Diagram — the blueprint that every database is built from. Each entity becomes a table in PostgreSQL. Each relationship becomes a foreign key or a join table. The fields you saw in each entity become columns.",
    realWorldUse:
      "In real projects this diagram is called an ERD — Entity Relationship Diagram. Database administrators design it before any SQL is written. In Spring Boot, each entity becomes a Java class annotated with @Entity, and each relationship becomes @OneToMany or @ManyToMany. The design decisions you made here will affect your entire application.",
    developerSays:
      "A bad schema is forever. I have seen projects where the data model was wrong from day one — three years later the team was still working around it. Design the data first. Always.",
  },
};

// ── Relationship types ─────────────────────────────────────────────────────
const REL_TYPES = [
  { id: 'oneToMany',   label: '1 → Many',      desc: 'One record relates to many',  color: '#38bdf8' },
  { id: 'manyToMany',  label: 'Many ↔ Many',   desc: 'Both sides relate to many',   color: '#f472b6' },
  { id: 'oneToOne',    label: '1 → 1',          desc: 'Exactly one on each side',    color: '#4ade80' },
];

// ── Entity card ────────────────────────────────────────────────────────────
function EntityNode({ entity, position, isPlaced, isDragging, onMouseDown, isSelected, isConnecting }) {
  return (
    <div
      className={`entity-node ${isSelected ? 'node-selected' : ''} ${isConnecting ? 'node-connecting' : ''} ${isDragging ? 'node-dragging' : ''}`}
      style={isPlaced ? { left: position.x, top: position.y, position: 'absolute' } : {}}
      onMouseDown={onMouseDown}
    >
      <div className="entity-header">
        <span className="entity-emoji">{entity.emoji}</span>
        <span className="entity-name">{entity.label}</span>
      </div>
      <div className="entity-fields">
        {entity.fields.map(f => (
          <div key={f} className="entity-field">
            <span className="field-dot" />
            {f}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Relationship line between two nodes ───────────────────────────────────
function RelLine({ from, to, relType, onRemove }) {
  const fx = from.x + 90;
  const fy = from.y + 50;
  const tx = to.x + 90;
  const ty = to.y + 50;
  const mx = (fx + tx) / 2;
  const my = (fy + ty) / 2;
  const rel = REL_TYPES.find(r => r.id === relType);

  return (
    <g className="rel-line-group">
      <line
        x1={fx} y1={fy} x2={tx} y2={ty}
        stroke={rel?.color || '#38bdf8'}
        strokeWidth="2"
        strokeDasharray="6 3"
      />
      {/* Label background */}
      <rect
        x={mx - 34} y={my - 11}
        width={68} height={22}
        rx={11}
        fill="#0d1117"
        stroke={rel?.color || '#38bdf8'}
        strokeWidth="1"
        style={{ cursor: 'pointer' }}
        onClick={onRemove}
      />
      <text
        x={mx} y={my + 4}
        textAnchor="middle"
        fill={rel?.color || '#38bdf8'}
        fontSize="10"
        fontFamily="DM Mono, monospace"
        style={{ cursor: 'pointer', userSelect: 'none' }}
        onClick={onRemove}
      >
        {rel?.label}
      </text>
    </g>
  );
}

// ── Main Level ─────────────────────────────────────────────────────────────
function Level1_4() {
  const { selectedDomain } = useGame();
  const canvasRef  = useRef(null);
  const entities   = selectedDomain?.entities || [];

  const [positions,    setPositions]    = useState({});
  const [connections,  setConnections]  = useState([]);
  const [dragging,     setDragging]     = useState(null);
  const [dragOffset,   setDragOffset]   = useState({ x: 0, y: 0 });
  const [connectFrom,  setConnectFrom]  = useState(null);
  const [selectedRel,  setSelectedRel]  = useState('oneToMany');
  const [error,        setError]        = useState('');
  const [connectMode,  setConnectMode]  = useState(false);

  const placedIds    = Object.keys(positions);
  const unplaced     = entities.filter(e => !placedIds.includes(e.id));
  const placed       = entities.filter(e =>  placedIds.includes(e.id));

  const allPlaced    = unplaced.length === 0;
  const enoughConns  = connections.length >= entities.length - 1;
  const canProceed   = allPlaced && enoughConns;

  // ── Drop entity from panel onto canvas ──────────────────────────────────
  function handlePanelDragStart(e, entity) {
    e.dataTransfer.setData('entityId', entity.id);
  }

  function handleCanvasDragOver(e) { e.preventDefault(); }

  function handleCanvasDrop(e) {
    e.preventDefault();
    const entityId = e.dataTransfer.getData('entityId');
    if (!entityId) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x    = Math.max(0, Math.min(e.clientX - rect.left - 90,  rect.width  - 200));
    const y    = Math.max(0, Math.min(e.clientY - rect.top  - 50,  rect.height - 120));
    setPositions(prev => ({ ...prev, [entityId]: { x, y } }));
  }

  // ── Drag placed node to reposition ──────────────────────────────────────
  function handleNodeMouseDown(e, entityId) {
    if (connectMode) {
      handleConnectClick(entityId);
      return;
    }
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const pos  = positions[entityId];
    setDragging(entityId);
    setDragOffset({
      x: e.clientX - rect.left - pos.x,
      y: e.clientY - rect.top  - pos.y,
    });
  }

  function handleCanvasMouseMove(e) {
    if (!dragging) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setPositions(prev => ({
      ...prev,
      [dragging]: {
        x: Math.max(0, Math.min(e.clientX - rect.left - dragOffset.x, rect.width  - 200)),
        y: Math.max(0, Math.min(e.clientY - rect.top  - dragOffset.y, rect.height - 120)),
      }
    }));
  }

  function handleCanvasMouseUp() { setDragging(null); }

  // ── Connect mode ─────────────────────────────────────────────────────────
  function handleConnectClick(entityId) {
    setError('');

    if (!connectFrom) {
      setConnectFrom(entityId);
      return;
    }

    if (connectFrom === entityId) {
      setConnectFrom(null);
      return;
    }

    const alreadyConnected = connections.some(
      c => (c.from === connectFrom && c.to === entityId) ||
           (c.from === entityId    && c.to === connectFrom)
    );

    if (alreadyConnected) {
      setError('These entities are already connected. Click the label on the line to remove it.');
      setConnectFrom(null);
      return;
    }

    setConnections(prev => [...prev, { from: connectFrom, to: entityId, relType: selectedRel }]);
    setConnectFrom(null);
  }

  function toggleConnectMode() {
    setConnectMode(prev => !prev);
    setConnectFrom(null);
    setError('');
  }

  function removeConnection(index) {
    setConnections(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <Stage1Shell levelId={4} canProceed={canProceed} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper
        conceptIntro={SUPPORT.intro}
        hints={SUPPORT.hints}
        levelComplete={canProceed}
      >
        <div className="l14-container">

          {/* Brief */}
          <div className="l14-brief">
            <div className="l14-brief-tag">// Mission Brief</div>
            <h2 className="l14-brief-title">
              Design the data model for your{' '}
              <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name}</span>.
            </h2>
            <p className="l14-brief-text">
              Drag entities onto the canvas. Then use Connect Mode to draw relationships between them.
              Choose the relationship type before connecting.
            </p>

            {/* Checklist */}
            <div className="l14-checklist">
              <div className={`l14-check ${allPlaced ? 'done' : ''}`}>
                {allPlaced ? '✓' : '○'} All {entities.length} entities placed
              </div>
              <div className={`l14-check ${enoughConns ? 'done' : ''}`}>
                {enoughConns ? '✓' : '○'} At least {entities.length - 1} relationships drawn ({connections.length} so far)
              </div>
            </div>
          </div>

          <div className="l14-workspace">

            {/* Left panel */}
            <div className="l14-left">

              {/* Unplaced entities */}
              {unplaced.length > 0 && (
                <div className="l14-panel">
                  <div className="l14-panel-label">Drag onto canvas →</div>
                  {unplaced.map(entity => (
                    <div
                      key={entity.id}
                      className="l14-panel-entity"
                      draggable
                      onDragStart={e => handlePanelDragStart(e, entity)}
                    >
                      <span className="l14-panel-emoji">{entity.emoji}</span>
                      <div>
                        <div className="l14-panel-name">{entity.label}</div>
                        <div className="l14-panel-fields">
                          {entity.fields.slice(0, 3).join(', ')}{entity.fields.length > 3 ? '...' : ''}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Relationship type selector */}
              {allPlaced && (
                <div className="l14-rel-selector">
                  <div className="l14-panel-label">Relationship type</div>
                  {REL_TYPES.map(rel => (
                    <button
                      key={rel.id}
                      className={`l14-rel-btn ${selectedRel === rel.id ? 'rel-selected' : ''}`}
                      style={{ '--rel-color': rel.color }}
                      onClick={() => setSelectedRel(rel.id)}
                    >
                      <span className="rel-btn-label">{rel.label}</span>
                      <span className="rel-btn-desc">{rel.desc}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Connect mode toggle */}
              {allPlaced && (
                <button
                  className={`l14-connect-toggle ${connectMode ? 'connect-active' : ''}`}
                  onClick={toggleConnectMode}
                >
                  {connectMode ? '🔗 Connecting — click to cancel' : '🔗 Enter Connect Mode'}
                </button>
              )}

            </div>

            {/* Canvas */}
            <div
              ref={canvasRef}
              className={`l14-canvas ${connectMode ? 'canvas-connect-mode' : ''}`}
              onDragOver={handleCanvasDragOver}
              onDrop={handleCanvasDrop}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
            >
              {placed.length === 0 && (
                <div className="l14-canvas-empty">
                  <div className="l14-canvas-empty-icon">🗄️</div>
                  <div className="l14-canvas-empty-text">
                    Drag entities here to start building your data model
                  </div>
                </div>
              )}

              {/* SVG relationship lines */}
              <svg className="l14-svg-layer">
                {connections.map((conn, i) => {
                  const fp = positions[conn.from];
                  const tp = positions[conn.to];
                  if (!fp || !tp) return null;
                  return (
                    <RelLine
                      key={i}
                      from={fp}
                      to={tp}
                      relType={conn.relType}
                      onRemove={() => removeConnection(i)}
                    />
                  );
                })}
              </svg>

              {/* Entity nodes */}
              {placed.map(entity => (
                <EntityNode
                  key={entity.id}
                  entity={entity}
                  position={positions[entity.id]}
                  isPlaced={true}
                  isDragging={dragging === entity.id}
                  isSelected={connectFrom === entity.id}
                  isConnecting={connectMode && connectFrom && connectFrom !== entity.id}
                  onMouseDown={e => handleNodeMouseDown(e, entity.id)}
                />
              ))}

              {/* Connect mode banner */}
              {connectMode && (
                <div className="l14-connect-banner">
                  {connectFrom
                    ? <>Connecting from <strong>{entities.find(e => e.id === connectFrom)?.label}</strong> — click another entity</>
                    : <>Connect Mode ON — click any entity to start a {REL_TYPES.find(r => r.id === selectedRel)?.label} relationship</>
                  }
                </div>
              )}

            </div>
          </div>

          {/* Error */}
          {error && <div className="l14-error">⚠️ {error}</div>}

          {/* Connections summary */}
          {connections.length > 0 && (
            <div className="l14-connections">
              <div className="l14-connections-label">
                Relationships defined ({connections.length}) — click any label on the canvas to remove
              </div>
              <div className="l14-conn-list">
                {connections.map((conn, i) => {
                  const from = entities.find(e => e.id === conn.from);
                  const to   = entities.find(e => e.id === conn.to);
                  const rel  = REL_TYPES.find(r => r.id === conn.relType);
                  return (
                    <div key={i} className="l14-conn-tag" style={{ '--rel-color': rel?.color }}>
                      <span>{from?.emoji} {from?.label}</span>
                      <span className="conn-rel-label">{rel?.label}</span>
                      <span>{to?.emoji} {to?.label}</span>
                      <button className="conn-remove" onClick={() => removeConnection(i)}>×</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Insight */}
          <div className="l14-insight">
            <div className="l14-insight-label">💡 Entity to Java class</div>
            <p>
              Each entity you placed becomes a <strong>Java class</strong> in Stage 5 annotated with <code>@Entity</code>.
              Each relationship becomes <code>@OneToMany</code> or <code>@ManyToMany</code>.
              Each field becomes a column in your PostgreSQL table.
              You are designing your entire database schema right now.
            </p>
          </div>

          {canProceed && (
            <div className="l14-success">
              ✓ Data model complete. {entities.length} entities, {connections.length} relationships defined.
            </div>
          )}

        </div>
      </LevelSupportWrapper>
    </Stage1Shell>
  );
}

export default Level1_4;