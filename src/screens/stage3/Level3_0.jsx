// src/screens/stage3/Level3_0.jsx
// Stage 3 concept intro — what is React and why does it exist
// No code editor — pure concept cards with visual explanation

import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage3Shell from './Stage3Shell';
import './Level3_0.css';

const CONCEPTS = [
  {
    id: 'why',
    icon: '🤔',
    title: 'Why React Exists',
    body: 'Before React, every time data changed on a page, developers had to manually find the right DOM element and update it. With complex apps this became a nightmare — things got out of sync constantly. React solves this: you describe WHAT the UI should look like for a given state, and React figures out HOW to update the DOM efficiently.',
    example: null,
  },
  {
    id: 'component',
    icon: '🧱',
    title: 'Everything is a Component',
    body: 'A React app is a tree of components. Each component is a function that takes data (props) and returns JSX — a description of what should appear on screen. Components are reusable: build a PatientCard once, use it 200 times with different data.',
    example: `// A component is just a function
function PatientCard({ name, status }) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <span>{status}</span>
    </div>
  );
}`,
  },
  {
    id: 'state',
    icon: '🔄',
    title: 'State — React\'s Memory',
    body: 'State is data that can change over time. When state changes, React automatically re-renders the component with the new data. You never manually update the DOM — React handles it. useState() is the hook that gives a component its own memory.',
    example: `const [count, setCount] = useState(0);
// count = current value
// setCount = function to update it
// Calling setCount triggers a re-render`,
  },
  {
    id: 'props',
    icon: '📦',
    title: 'Props — Passing Data Down',
    body: 'Props are how a parent component passes data to a child. They flow in one direction: parent → child. Think of props like function parameters — the child receives them and uses them to render. Props are read-only: a child never modifies its own props.',
    example: `// Parent passes data
<PatientCard name="Alice" status="CRITICAL" />

// Child receives it
function PatientCard({ name, status }) {
  // name = "Alice", status = "CRITICAL"
}`,
  },
  {
    id: 'jsx',
    icon: '✍️',
    title: 'JSX — HTML in JavaScript',
    body: 'JSX looks like HTML but it\'s actually JavaScript. You can embed any JS expression inside {} braces. It gets compiled to React.createElement() calls before running in the browser — you never write those directly.',
    example: `const patient = { name: "Bob", ward: 3 };

// JSX with embedded expressions
return (
  <div>
    <h2>{patient.name}</h2>
    <p>Ward: {patient.ward}</p>
    <p>Status: {isUrgent ? "URGENT" : "STABLE"}</p>
  </div>
);`,
  },
  {
    id: 'hooks',
    icon: '🪝',
    title: 'Hooks — Special React Functions',
    body: 'Hooks are functions that start with "use". They let functional components tap into React features. useState gives you state. useEffect lets you run code when data changes. useContext lets you read global state. You\'ll learn all of these in Stage 3.',
    example: `// The hooks you'll use most
useState()     // Component memory
useEffect()    // Run code on data change
useContext()   // Read global state
useRef()       // Reference a DOM element
useMemo()      // Cache expensive calculations`,
  },
];

export default function Level3_0() {
  const { selectedDomain } = useGame();
  const [active, setActive] = useState(0);
  const concept = CONCEPTS[active];
  const color = selectedDomain?.color || '#60a5fa';

  return (
    <Stage3Shell levelId={0} canProceed={true} conceptReveal={null}>
      <div className="l30-container">

        <div className="l30-header">
          <div className="l30-tag" style={{ color }}>// Stage 3 — Frontend</div>
          <h1>Building What Users See</h1>
          <p className="l30-sub">
            Stage 2 taught you Java — the logic engine. Stage 3 teaches React — the face.
            Every concept you'll use is here. Read each card before your first level.
          </p>
        </div>

        {/* Nav pills */}
        <div className="l30-nav">
          {CONCEPTS.map((c, i) => (
            <button
              key={c.id}
              className={`l30-pill ${i === active ? 'active' : ''}`}
              style={i === active ? { borderColor: color, color } : {}}
              onClick={() => setActive(i)}
            >
              {c.icon} {c.title}
            </button>
          ))}
        </div>

        {/* Concept card */}
        <div className="l30-card" style={{ borderColor: color }}>
          <div className="l30-card-icon">{concept.icon}</div>
          <h2 className="l30-card-title" style={{ color }}>{concept.title}</h2>
          <p className="l30-card-body">{concept.body}</p>
          {concept.example && (
            <pre className="l30-example">{concept.example}</pre>
          )}
        </div>

        {/* Progress dots */}
        <div className="l30-dots">
          {CONCEPTS.map((_, i) => (
            <button
              key={i}
              className={`l30-dot ${i === active ? 'active' : ''}`}
              style={i === active ? { background: color } : {}}
              onClick={() => setActive(i)}
            />
          ))}
        </div>

        <div className="l30-proceed">
          <p>Read all {CONCEPTS.length} concepts, then proceed to Level 3.1 →</p>
        </div>

      </div>
    </Stage3Shell>
  );
}