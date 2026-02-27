// src/screens/stage1/Level1_2.jsx
// Player drags system components onto architecture canvas
// then connects them with arrows to show data flow

import { useState, useRef, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import Stage1Shell from './Stage1Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import './Level1_2.css';

// ── Support content ────────────────────────────────────────────────────────
const SUPPORT = {
  intro: {
    concept: "System Architecture",
    tagline: "Every system is just boxes and arrows. Learn to draw yours.",
    whatYouWillDo:
      "You will drag the components of your system onto a canvas — browser, frontend, backend, database, cloud, and external services. Then you will connect them with arrows to show how data flows between each layer.",
    whyItMatters:
      "Before any developer writes a line of code on a real project, someone draws this diagram. It answers the question: what are the moving parts and how do they talk to each other? A developer who can draw their system architecture can explain their entire project in 30 seconds.",
  },
  hints: [
    "Think about the journey of one piece of data — say, a patient booking an appointment. Where does that request start? Where does it end up? The components are the stops along that journey.",
    "The typical order flows left to right: the user's Browser talks to the Frontend, the Frontend talks to the Backend API, the Backend talks to the Database. Cloud and External Services connect to the Backend.",
    "Draw arrows in the direction data travels. Browser sends a request to Frontend — arrow points right. Database sends data back to Backend — arrow points left. Most connections are two-way, so draw arrows in both directions.",
  ],
  reveal: {
    concept: "System Architecture",
    whatYouLearned:
      "You just designed a three-tier architecture — client, server, and data layers — which is the foundation of almost every web application ever built. The arrows you drew represent HTTP requests, API calls, and database queries.",
    realWorldUse:
      "In real teams this diagram is called a System Architecture Diagram or C4 diagram. It lives in the project wiki, gets reviewed in technical interviews, and is the first thing a new developer looks at when joining a project. Senior engineers spend significant time on this before writing any code.",
    developerSays:
      "If you can't draw your system on a whiteboard in five minutes, you don't understand it well enough to build it. This diagram is your project's north star.",
  },
};

// ── Valid connections between component types ──────────────────────────────
const VALID_CONNECTIONS = [
  ['client', 'frontend'],
  ['frontend', 'backend'],
  ['backend', 'database'],
  ['backend', 'cloud'],
  ['backend', 'external'],
  ['cloud', 'database'],
];

function isValidConnection(typeA, typeB) {
  return VALID_CONNECTIONS.some(
    ([a, b]) => (a === typeA && b === typeB) || (a === typeB && b === typeA)
  );
}

// ── Component node on canvas ───────────────────────────────────────────────
function ArchNode({ comp, position, isPlaced, isConnecting, isSelected, onMouseDown, onConnect }) {
  return (
    <div
      className={`arch-node ${isPlaced ? 'placed' : ''} ${isConnecting ? 'connecting' : ''} ${isSelected ? 'selected' : ''}`}
      style={isPlaced ? { left: position.x, top: position.y } : {}}
      onMouseDown={onMouseDown}
      onClick={isPlaced ? onConnect : undefined}
      title={isPlaced ? `Click to connect to another component` : 'Drag onto canvas'}
    >
      <div className="arch-node-emoji">{comp.emoji}</div>
      <div className="arch-node-label">{comp.label}</div>
      {isPlaced && <div className="arch-node-type">{comp.type}</div>}
    </div>
  );
}

// ── Arrow between two nodes ────────────────────────────────────────────────
function Arrow({ from, to, label }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;

  return (
    <g>
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7"
          refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#38bdf8" />
        </marker>
      </defs>
      <line
        x1={from.x + 60} y1={from.y + 36}
        x2={to.x + 60}   y2={to.y + 36}
        stroke="#38bdf8" strokeWidth="2"
        markerEnd="url(#arrowhead)"
        strokeDasharray="6 3"
        className="arch-arrow-line"
      />
      {label && (
        <text x={mx + 60} y={my + 30} fill="#64748b"
          fontSize="10" textAnchor="middle"
          fontFamily="DM Mono, monospace">
          {label}
        </text>
      )}
    </g>
  );
}

// ── Main Level ─────────────────────────────────────────────────────────────
function Level1_2() {
  const { selectedDomain } = useGame();
  const canvasRef = useRef(null);

  const components = selectedDomain?.systemComponents || [];

  // Which components have been placed on canvas and where
  const [positions, setPositions] = useState({});
  // Connections between component IDs
  const [connections, setConnections] = useState([]);
  // Currently being dragged
  const [dragging, setDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  // Connection mode — waiting for second click
  const [connectFrom, setConnectFrom] = useState(null);
  // Error message
  const [connError, setConnError] = useState('');

  const placedIds    = Object.keys(positions);
  const unplacedComps = components.filter(c => !placedIds.includes(c.id));
  const placedComps   = components.filter(c =>  placedIds.includes(c.id));

  // Validation
  const allPlaced       = unplacedComps.length === 0;
  const enoughConns     = connections.length >= 4;
  const hasClientConn   = connections.some(cn => {
    const a = components.find(c => c.id === cn.from)?.type;
    const b = components.find(c => c.id === cn.to)?.type;
    return a === 'client' || b === 'client';
  });
  const hasDatabaseConn = connections.some(cn => {
    const a = components.find(c => c.id === cn.from)?.type;
    const b = components.find(c => c.id === cn.to)?.type;
    return a === 'database' || b === 'database';
  });
  const canProceed = allPlaced && enoughConns && hasClientConn && hasDatabaseConn;

  // ── Drag from panel onto canvas ──────────────────────────────────────────
  function handlePanelDragStart(e, comp) {
    setDragging({ comp, fromPanel: true });
    setConnectFrom(null);
  }

  function handleCanvasDragOver(e) {
    e.preventDefault();
  }

  function handleCanvasDrop(e) {
    e.preventDefault();
    if (!dragging || !dragging.fromPanel) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 60;
    const y = e.clientY - rect.top  - 36;
    setPositions(prev => ({
      ...prev,
      [dragging.comp.id]: {
        x: Math.max(0, Math.min(x, rect.width  - 140)),
        y: Math.max(0, Math.min(y, rect.height - 80)),
      }
    }));
    setDragging(null);
  }

  // ── Drag placed node to reposition ──────────────────────────────────────
  function handleNodeMouseDown(e, compId) {
    if (connectFrom) return; // in connect mode — clicking connects
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const pos  = positions[compId];
    setDragging({ compId, fromPanel: false });
    setDragOffset({
      x: e.clientX - rect.left - pos.x,
      y: e.clientY - rect.top  - pos.y,
    });
  }

  function handleCanvasMouseMove(e) {
    if (!dragging || dragging.fromPanel) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setPositions(prev => ({
      ...prev,
      [dragging.compId]: {
        x: Math.max(0, Math.min(e.clientX - rect.left - dragOffset.x, rect.width  - 140)),
        y: Math.max(0, Math.min(e.clientY - rect.top  - dragOffset.y, rect.height - 80)),
      }
    }));
  }

  function handleCanvasMouseUp() {
    setDragging(null);
  }

  // ── Connect two nodes ────────────────────────────────────────────────────
  function handleNodeConnect(compId) {
    if (dragging && !dragging.fromPanel) return;

    if (!connectFrom) {
      setConnectFrom(compId);
      setConnError('');
      return;
    }

    if (connectFrom === compId) {
      setConnectFrom(null);
      return;
    }

    // Check if already connected
    const alreadyConnected = connections.some(
      cn => (cn.from === connectFrom && cn.to === compId) ||
            (cn.from === compId && cn.to === connectFrom)
    );

    if (alreadyConnected) {
      setConnError('These components are already connected.');
      setConnectFrom(null);
      return;
    }

    // Check validity
    const typeA = components.find(c => c.id === connectFrom)?.type;
    const typeB = components.find(c => c.id === compId)?.type;

    if (!isValidConnection(typeA, typeB)) {
      setConnError(`A ${typeA} does not connect directly to a ${typeB}. Think about the data flow.`);
      setConnectFrom(null);
      return;
    }

    setConnections(prev => [...prev, { from: connectFrom, to: compId }]);
    setConnectFrom(null);
    setConnError('');
  }

  function removeConnection(index) {
    setConnections(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <Stage1Shell levelId={2} canProceed={canProceed} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper
        conceptIntro={SUPPORT.intro}
        hints={SUPPORT.hints}
        levelComplete={canProceed}
      >
        <div className="l12-container">

          {/* Instructions */}
          <div className="l12-brief">
            <div className="l12-brief-tag">// Mission Brief</div>
            <h2 className="l12-brief-title">
              Map the architecture of your{' '}
              <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name}</span>.
            </h2>
            <p className="l12-brief-text">
              Drag each component onto the canvas. Then click any two placed components to draw a connection between them showing how data flows.
            </p>
            {/* Validation checklist */}
            <div className="l12-checklist">
              <div className={`l12-check ${allPlaced ? 'done' : ''}`}>
                {allPlaced ? '✓' : '○'} All {components.length} components placed on canvas
              </div>
              <div className={`l12-check ${hasClientConn ? 'done' : ''}`}>
                {hasClientConn ? '✓' : '○'} Browser / Client is connected
              </div>
              <div className={`l12-check ${hasDatabaseConn ? 'done' : ''}`}>
                {hasDatabaseConn ? '✓' : '○'} Database is connected
              </div>
              <div className={`l12-check ${enoughConns ? 'done' : ''}`}>
                {enoughConns ? '✓' : '○'} At least 4 connections drawn ({connections.length} so far)
              </div>
            </div>
          </div>

          <div className="l12-workspace">

            {/* Left panel — unplaced components */}
            {unplacedComps.length > 0 && (
              <div className="l12-panel">
                <div className="l12-panel-label">
                  Drag onto canvas →
                </div>
                {unplacedComps.map(comp => (
                  <div
                    key={comp.id}
                    className="l12-panel-node"
                    draggable
                    onDragStart={e => handlePanelDragStart(e, comp)}
                  >
                    <span className="l12-panel-emoji">{comp.emoji}</span>
                    <div>
                      <div className="l12-panel-name">{comp.label}</div>
                      <div className="l12-panel-type">{comp.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Canvas */}
            <div
              ref={canvasRef}
              className={`l12-canvas ${connectFrom ? 'canvas-connecting' : ''}`}
              onDragOver={handleCanvasDragOver}
              onDrop={handleCanvasDrop}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
            >

              {/* Empty state */}
              {placedComps.length === 0 && (
                <div className="l12-canvas-empty">
                  <div className="l12-canvas-empty-icon">🗺️</div>
                  <div className="l12-canvas-empty-text">
                    Drag components here to start building your architecture
                  </div>
                </div>
              )}

              {/* SVG arrows layer */}
              {placedComps.length > 1 && (
                <svg className="l12-arrows-layer">
                  {connections.map((cn, i) => {
                    const fromPos = positions[cn.from];
                    const toPos   = positions[cn.to];
                    if (!fromPos || !toPos) return null;
                    return (
                      <Arrow
                        key={i}
                        from={fromPos}
                        to={toPos}
                      />
                    );
                  })}
                </svg>
              )}

              {/* Placed component nodes */}
              {placedComps.map(comp => (
                <div
                  key={comp.id}
                  className={`arch-node placed ${connectFrom === comp.id ? 'selected' : ''} ${connectFrom && connectFrom !== comp.id ? 'connecting' : ''}`}
                  style={{ left: positions[comp.id].x, top: positions[comp.id].y }}
                  onMouseDown={e => handleNodeMouseDown(e, comp.id)}
                  onClick={() => handleNodeConnect(comp.id)}
                >
                  <div className="arch-node-emoji">{comp.emoji}</div>
                  <div className="arch-node-label">{comp.label}</div>
                  <div className="arch-node-type">{comp.type}</div>
                </div>
              ))}

              {/* Connect mode banner */}
              {connectFrom && (
                <div className="l12-connect-banner">
                  Connecting from <strong>{components.find(c => c.id === connectFrom)?.label}</strong> — click another component to connect. Click same to cancel.
                </div>
              )}

            </div>

          </div>

          {/* Error message */}
          {connError && (
            <div className="l12-conn-error">⚠️ {connError}</div>
          )}

          {/* Connections list */}
          {connections.length > 0 && (
            <div className="l12-connections-list">
              <div className="l12-connections-label">
                🔗 Connections drawn ({connections.length})
              </div>
              <div className="l12-connections">
                {connections.map((cn, i) => {
                  const fromComp = components.find(c => c.id === cn.from);
                  const toComp   = components.find(c => c.id === cn.to);
                  return (
                    <div key={i} className="l12-conn-tag">
                      <span>{fromComp?.emoji} {fromComp?.label}</span>
                      <span className="l12-conn-arrow">→</span>
                      <span>{toComp?.emoji} {toComp?.label}</span>
                      <button
                        className="l12-conn-remove"
                        onClick={() => removeConnection(i)}
                        title="Remove connection"
                      >×</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* How to connect tip */}
          {allPlaced && connections.length === 0 && (
            <div className="l12-tip">
              💡 All components placed. Now click any component on the canvas to start a connection, then click another to complete it.
            </div>
          )}

          {canProceed && (
            <div className="l12-success">
              ✓ Architecture complete. {connections.length} connections showing data flow across all layers.
            </div>
          )}

        </div>
      </LevelSupportWrapper>
    </Stage1Shell>
  );
}

export default Level1_2;