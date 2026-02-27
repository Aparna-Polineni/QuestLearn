// src/screens/stage1/Level1_5.jsx
// Player matches API endpoints to HTTP methods and entities
// First exposure to REST API design before building one

import { useState, useEffect } from 'react';
import {
  DndContext, DragOverlay,
  PointerSensor, useSensor, useSensors,
  useDroppable, useDraggable
} from '@dnd-kit/core';
import { useGame } from '../../context/GameContext';
import Stage1Shell from './Stage1Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import './Level1_5.css';
import useUndo from '../../hooks/useUndo';

// ── Support content ────────────────────────────────────────────────────────
const SUPPORT = {
  intro: {
    concept: "API-First Design",
    tagline: "Define what your backend does before you build it.",
    whatYouWillDo:
      "You will be given a set of API endpoints for your system. Your job is to drag each endpoint into the correct HTTP method column — GET, POST, PUT, or DELETE. Then match each endpoint to the entity it operates on.",
    whyItMatters:
      "An API contract defined before coding means your frontend and backend teams can work in parallel. It also forces you to think about every operation your system needs before you write a single controller. Professional teams call this API-first design.",
  },
  hints: [
    "GET is for reading data — fetching a list or a single record. POST is for creating something new. PUT or PATCH is for updating an existing record. DELETE is for removing one. Read each endpoint path and ask: is this reading, creating, updating, or removing?",
    "Look at the endpoint path carefully. /patients with GET means get all patients. /patients/{id} with GET means get one specific patient. /patients with POST means create a new patient. The path and method together tell the whole story.",
    "Match entities by the noun in the path. /patients operates on the Patient entity. /appointments operates on the Appointment entity. /doctors operates on the Doctor entity. The plural noun in the path is always the entity name.",
  ],
  reveal: {
    concept: "API-First Design",
    whatYouLearned:
      "You just designed a REST API contract — the complete list of operations your backend must support. Every endpoint you matched becomes a method in a Spring Boot @RestController in Stage 5. GET /patients becomes a getAll() method. POST /patients becomes a create() method.",
    realWorldUse:
      "In real teams this document is called an API specification and is often written in OpenAPI format. Frontend developers use it to start building UI components before the backend exists. This is why companies like Stripe and Twilio publish their API docs before releasing features — the contract comes first.",
    developerSays:
      "Define your API endpoints before writing any controller code. Once your frontend team starts building against an API, changing it costs twice as much. Get the contract right first.",
  },
};

// ── HTTP methods ───────────────────────────────────────────────────────────
const HTTP_METHODS = [
  { id: 'GET',    label: 'GET',    color: '#4ade80', desc: 'Read data'         },
  { id: 'POST',   label: 'POST',   color: '#38bdf8', desc: 'Create new record' },
  { id: 'PUT',    label: 'PUT',    color: '#f97316', desc: 'Update existing'   },
  { id: 'DELETE', label: 'DELETE', color: '#ef4444', desc: 'Remove a record'   },
];

// ── Generate endpoints per domain ─────────────────────────────────────────
function getEndpointsForDomain(domain) {
  if (!domain) return [];

  const entityEndpoints = domain.entities.flatMap(entity => {
    const base = entity.label.toLowerCase() + 's';
    return [
      { id: `get-all-${entity.id}`,    path: `GET /${base}`,         method: 'GET',    entityId: entity.id, label: entity.label },
      { id: `get-one-${entity.id}`,    path: `GET /${base}/{id}`,    method: 'GET',    entityId: entity.id, label: entity.label },
      { id: `create-${entity.id}`,     path: `POST /${base}`,        method: 'POST',   entityId: entity.id, label: entity.label },
      { id: `update-${entity.id}`,     path: `PUT /${base}/{id}`,    method: 'PUT',    entityId: entity.id, label: entity.label },
      { id: `delete-${entity.id}`,     path: `DELETE /${base}/{id}`, method: 'DELETE', entityId: entity.id, label: entity.label },
    ];
  });

  // Return a selection — not all 20 at once, just enough to be meaningful
  const selected = [];
  domain.entities.forEach(entity => {
    const base = entity.label.toLowerCase() + 's';
    selected.push(
      { id: `get-all-${entity.id}`,  path: `/${base}`,         correctMethod: 'GET',    entityId: entity.id, label: entity.label },
      { id: `create-${entity.id}`,   path: `/${base}`,         correctMethod: 'POST',   entityId: entity.id, label: entity.label },
      { id: `update-${entity.id}`,   path: `/${base}/{id}`,    correctMethod: 'PUT',    entityId: entity.id, label: entity.label },
      { id: `delete-${entity.id}`,   path: `/${base}/{id}`,    correctMethod: 'DELETE', entityId: entity.id, label: entity.label },
    );
  });

  // Limit to first 3 entities worth of endpoints for manageability
  return selected.slice(0, 12);
}

// ── Draggable endpoint card ────────────────────────────────────────────────
function EndpointCard({ endpoint, isPlaced }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: endpoint.id,
    data: { endpoint },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`endpoint-card ${isPlaced ? 'endpoint-placed' : ''}`}
      style={{
        opacity: isDragging ? 0.4 : 1,
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
        zIndex: isDragging ? 999 : 'auto',
        position: 'relative',
      }}
    >
      <span className="endpoint-path">{endpoint.path}</span>
      <span className="endpoint-entity-tag">→ {endpoint.label}</span>
    </div>
  );
}

// ── HTTP method drop column ────────────────────────────────────────────────
function MethodColumn({ method, endpoints, allEndpoints }) {
  const { setNodeRef, isOver } = useDroppable({ id: method.id });

  return (
    <div
      className={`method-column ${isOver ? 'column-over' : ''}`}
      style={{ '--method-color': method.color }}
    >
      <div className="method-header">
        <span className="method-badge" style={{ background: method.color }}>
          {method.label}
        </span>
        <span className="method-desc">{method.desc}</span>
      </div>

      <div ref={setNodeRef} className="method-dropzone">
        {endpoints.length === 0 ? (
          <div className="method-empty">Drop endpoints here</div>
        ) : (
          endpoints.map(ep => {
            const isCorrect = ep.correctMethod === method.id;
            return (
              <div
                key={ep.id}
                className={`placed-endpoint ${isCorrect ? 'correct' : 'incorrect'}`}
              >
                <span className="placed-indicator">{isCorrect ? '✓' : '✗'}</span>
                <span className="placed-path">{ep.path}</span>
                <span className="placed-entity">{ep.label}</span>
              </div>
            );
          })
        )}
      </div>

      <div className="method-count">
        {endpoints.length} endpoint{endpoints.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

// ── Main Level ─────────────────────────────────────────────────────────────
function Level1_5() {
  const { selectedDomain } = useGame();
  const [activeId,    setActiveId]    = useState(null);
  const [placements, setPlacements, undoControls] = useUndo({});
  // placements: { endpointId: methodId }

  const endpoints = getEndpointsForDomain(selectedDomain);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // Group endpoints by where they've been placed
  const unplaced = endpoints.filter(ep => !placements[ep.id]);
  const placedByMethod = {};
  HTTP_METHODS.forEach(m => {
    placedByMethod[m.id] = endpoints.filter(ep => placements[ep.id] === m.id);
  });

  // Count correct placements
  const correctCount = endpoints.filter(
    ep => placements[ep.id] === ep.correctMethod
  ).length;

  const allPlaced   = unplaced.length === 0;
  const allCorrect  = allPlaced && correctCount === endpoints.length;

  // Can proceed when at least 80% correct (allows for minor mistakes)
  const canProceed  = allPlaced && correctCount >= Math.ceil(endpoints.length * 0.8);

  const activeEndpoint = endpoints.find(ep => ep.id === activeId);

  function handleDragStart({ active }) {
    setActiveId(active.id);
  }

  function handleDragEnd({ active, over }) {
    setActiveId(null);
    if (!over) return;
    const methodId = over.id;
    if (!HTTP_METHODS.find(m => m.id === methodId)) return;

    setPlacements(prev => ({ ...prev, [active.id]: methodId }));
  }

  function resetEndpoint(endpointId) {
    setPlacements(prev => {
      const next = { ...prev };
      delete next[endpointId];
      return next;
    });
  }

  return (
    <Stage1Shell levelId={5} canProceed={canProceed} conceptReveal={SUPPORT.reveal} undoControls={undoControls}>
      <LevelSupportWrapper
        conceptIntro={SUPPORT.intro}
        hints={SUPPORT.hints}
        levelComplete={canProceed}
      >
        <div className="l15-container">

          {/* Brief */}
          <div className="l15-brief">
            <div className="l15-brief-tag">// Mission Brief</div>
            <h2 className="l15-brief-title">
              Define the API for your{' '}
              <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name}</span>.
            </h2>
            <p className="l15-brief-text">
              Each card below is an API endpoint. Drag it into the correct HTTP method column.
              Wrong placements show <span className="wrong-indicator">✗</span> — drag them back to fix.
            </p>

            {/* Score */}
            <div className="l15-score-row">
              <div className="l15-score">
                <span className="l15-score-num" style={{ color: allCorrect ? '#4ade80' : '#38bdf8' }}>
                  {correctCount}
                </span>
                <span className="l15-score-total">/ {endpoints.length} correct</span>
              </div>
              {allPlaced && !allCorrect && (
                <span className="l15-score-hint">
                  Some are wrong — drag them to fix
                </span>
              )}
              {allCorrect && (
                <span className="l15-score-perfect">✓ Perfect API design</span>
              )}
            </div>
          </div>

          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {/* Unplaced endpoints pool */}
            {unplaced.length > 0 && (
              <div className="l15-pool">
                <div className="l15-pool-label">
                  📋 Endpoints to place — drag each into the correct HTTP method column
                </div>
                <div className="l15-pool-cards">
                  {unplaced.map(ep => (
                    <EndpointCard key={ep.id} endpoint={ep} isPlaced={false} />
                  ))}
                </div>
              </div>
            )}

            {/* HTTP method columns */}
            <div className="l15-columns">
              {HTTP_METHODS.map(method => (
                <MethodColumn
                  key={method.id}
                  method={method}
                  endpoints={placedByMethod[method.id] || []}
                  allEndpoints={endpoints}
                />
              ))}
            </div>

            {/* Drag overlay */}
            <DragOverlay>
              {activeEndpoint && (
                <div className="endpoint-card endpoint-overlay">
                  <span className="endpoint-path">{activeEndpoint.path}</span>
                  <span className="endpoint-entity-tag">→ {activeEndpoint.label}</span>
                </div>
              )}
            </DragOverlay>

          </DndContext>

          {/* REST reference guide */}
          <div className="l15-reference">
            <div className="l15-reference-label">📖 REST Quick Reference</div>
            <div className="l15-reference-grid">
              {HTTP_METHODS.map(m => (
                <div key={m.id} className="l15-ref-item" style={{ '--m-color': m.color }}>
                  <span className="ref-method" style={{ color: m.color }}>{m.label}</span>
                  <span className="ref-desc">{m.desc}</span>
                  <span className="ref-example">
                    {m.id === 'GET'    && 'GET /patients — fetch list'}
                    {m.id === 'POST'   && 'POST /patients — create new'}
                    {m.id === 'PUT'    && 'PUT /patients/1 — update id 1'}
                    {m.id === 'DELETE' && 'DELETE /patients/1 — remove id 1'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Incorrect summary if all placed but some wrong */}
          {allPlaced && !canProceed && (
            <div className="l15-error">
              ⚠️ {endpoints.length - correctCount} endpoint{endpoints.length - correctCount !== 1 ? 's' : ''} in the wrong column.
              Drag them back and place correctly to continue.
            </div>
          )}

          {canProceed && (
            <div className="l15-success">
              ✓ API contract defined. {correctCount} of {endpoints.length} endpoints correctly mapped.
              Your Spring Boot controllers are already planned.
            </div>
          )}

        </div>
      </LevelSupportWrapper>
    </Stage1Shell>
  );
}

export default Level1_5;