// src/screens/stage3/Level3_4.jsx
// Lists — Rendering Many Things — Fill mode
// Student fills: .map(), key prop, conditional class, filter before map

import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage3Shell from './Stage3Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from '../stage2/FillEditor';
import './Level3_4.css';

const SUPPORT = {
  intro: {
    concept: "Rendering Lists — .map() and the key Prop",
    tagline: "Every list in React is an array transformed with .map(). Every item in that list needs a key.",
    whatYouWillDo: "Fill in 5 blanks: using .map() to render a list, adding the key prop, filtering before mapping, and using the index to build conditional styles.",
    whyItMatters: "Patient lists, appointment schedules, medication tables, test results — every list in any real app is a .map() over an array. This is one of the most used patterns in all of React.",
  },
  hints: [
    ".map() transforms each item in an array into a JSX element: patients.map(patient => <PatientRow patient={patient} />). The arrow function runs once per item and returns JSX.",
    "The key prop is required on the outermost element inside .map(). It must be unique and stable — use the item's id if it has one. Don't use the array index as a key unless the list never reorders.",
    "Filter before map: patients.filter(p => p.ward === 3).map(p => <Row p={p} />). Filter returns a new array containing only items that pass the test. The result is then mapped.",
  ],
  reveal: {
    concept: "List Rendering — .map() and Keys",
    whatYouLearned: ".map() renders arrays into JSX. Each item needs a unique key prop on the outermost element. React uses keys to track which items changed, were added, or removed. Filter before map to show only relevant items. Conditional className applies different styles based on item data.",
    realWorldUse: "In a real patient dashboard: patients.filter(p => p.priority === 'CRITICAL').map(p => <PatientCard key={p.id} {...p} />) renders only critical patients. Add sort before map to order by heart rate. This three-step pattern (filter → sort → map) handles 90% of real list rendering.",
    developerSays: "The missing key warning is the most common React warning. React needs keys to efficiently update lists — without them it re-renders everything. Always use a stable, unique id. If your data doesn't have ids, that's a problem worth fixing at the data layer.",
  },
};

const TEMPLATE = `function PatientList({ patients }) {

    // Filter: show only patients in the current ward
    // .filter() returns a NEW array — it doesn't modify the original
    const wardPatients = patients.___FILTER___(p => p.ward === 3);

    // If no patients match, show a message instead
    if (wardPatients.length === 0) {
        return <p className="empty-message">No patients in Ward 3</p>;
    }

    return (
        <div className="patient-list">
            <h2>Ward 3 — {wardPatients.length} patients</h2>

            {/* .map() transforms each patient object into a JSX element */}
            {/* The callback runs once per patient */}
            {wardPatients.___MAP___(patient => (

                {/* key prop: required on every root element inside .map() */}
                {/* Use patient.id — unique and stable */}
                <div
                    ___KEY___={patient.id}
                    className={\`patient-row \${patient.priority === 'CRITICAL' ? 'row-critical' : ''}\`}
                >
                    <span className="patient-name">{patient.name}</span>
                    <span className="patient-hr">{patient.heartRate} bpm</span>

                    {/* Conditional rendering: only show badge for critical patients */}
                    {patient.priority === 'CRITICAL' ___AND___ (
                        <span className="critical-badge">⚠ CRITICAL</span>
                    )}
                </div>
            ))}
        </div>
    );
}`;

const BLANKS = [
  { id: 'FILTER', answer: 'filter', placeholder: 'array method', hint: 'Array method that returns only items where the callback returns true.' },
  { id: 'MAP',    answer: 'map',    placeholder: 'array method', hint: 'Array method that transforms each item into JSX. Called on the filtered array.' },
  { id: 'KEY',    answer: 'key',    placeholder: 'JSX prop',     hint: 'Special React prop required on every element inside .map(). Must be unique.' },
  { id: 'AND',    answer: '&&',     placeholder: 'operator',     hint: 'Logical AND. In JSX: {condition && <Element />} renders Element only when condition is true.' },
];

export default function Level3_4() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage3Shell levelId={4} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l34-container">

          <div className="l34-brief">
            <div className="l34-tag">// Mission Brief</div>
            <h2>Render a <span style={{ color: selectedDomain?.color }}>PatientList</span> from an array.</h2>
            <p>Fill in 4 blanks. You'll filter, map, key, and conditionally render — the complete list rendering pattern.</p>
            <div className="l34-pattern">
              <span className="l34-step">1. filter()</span>
              <span className="l34-arrow">→</span>
              <span className="l34-step">2. map()</span>
              <span className="l34-arrow">→</span>
              <span className="l34-step">3. key on root</span>
              <span className="l34-arrow">→</span>
              <span className="l34-step">4. JSX per item</span>
            </div>
          </div>

          <FillEditor
            template={TEMPLATE}
            blanks={BLANKS}
            onAllCorrect={() => setIsCorrect(true)}
            expectedOutput="Renders filtered patient rows, each with a unique key, critical badge on priority patients"
          />

        </div>
      </LevelSupportWrapper>
    </Stage3Shell>
  );
}