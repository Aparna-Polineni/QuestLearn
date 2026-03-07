// src/screens/stage3/Level3_13.jsx
// Performance — memo & useMemo — Debug mode

import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage3Shell from './Stage3Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import DebugEditor from '../stage2/DebugEditor';
import './Level3_13.css';

const SUPPORT = {
  intro: {
    concept: "React Performance — memo, useMemo, useCallback",
    tagline: "React re-renders by default. memo, useMemo, and useCallback are your tools to stop unnecessary re-renders.",
    whatYouWillDo: "Find and fix 4 performance bugs: a component that re-renders on every parent render, an expensive calculation running every render, and a callback that breaks memoisation.",
    whyItMatters: "A patient dashboard re-rendering 200 patient cards every time the search input changes is noticeably slow. Performance optimisation is a real, measurable skill — senior developers are expected to understand when and why components re-render.",
  },
  hints: [
    "Bug 1: PatientCard re-renders every time the parent renders even if its props haven't changed. Wrap it with React.memo() to skip re-renders when props are unchanged.",
    "Bug 2: criticalPatients is calculated by filtering 1000 patients on every render — including renders caused by unrelated state changes. Wrap it in useMemo([patients]) so it only recalculates when patients changes.",
    "Bug 3: handleSelectPatient is a new function reference on every render, which breaks React.memo on PatientCard (it sees a new prop every time). Wrap it in useCallback with the right dependency array.",
  ],
  reveal: {
    concept: "React.memo, useMemo, useCallback",
    whatYouLearned: "React.memo() wraps a component — skips re-render if props are the same. useMemo(() => calculation, [deps]) caches a value. useCallback(() => fn, [deps]) caches a function reference. All three rely on referential equality — objects and functions are new references on every render unless memoised.",
    realWorldUse: "In a patient list with 500 rows: memo on PatientCard prevents re-rendering all 500 when one filter changes. useMemo on the filtered+sorted list prevents recalculating on every keystroke. These two changes can take a sluggish dashboard to buttery smooth.",
    developerSays: "Don't memoise everything by default — it adds complexity and has overhead. Profile first, optimise second. The React DevTools Profiler shows which components are rendering and how often. Identify the bottleneck, then apply memo/useMemo/useCallback surgically.",
  },
};

const BUGGY_CODE = `import { useState, useMemo, useCallback, memo } from 'react';

// BUG 1: PatientCard re-renders every time Dashboard renders
// even when this patient's data hasn't changed
// Fix: wrap with React.memo()
function PatientCard({ patient, onSelect }) {
  console.log('PatientCard rendered:', patient.name);
  return (
    <div className="patient-card" onClick={() => onSelect(patient)}>
      <strong>{patient.name}</strong>
      <span>Ward {patient.ward}</span>
      <span>{patient.priority}</span>
    </div>
  );
}

function Dashboard({ patients }) {
  const [searchQuery,      setSearchQuery]      = useState('');
  const [selectedPatient,  setSelectedPatient]  = useState(null);

  // BUG 2: This expensive filter runs on EVERY render
  // — including every keystroke in the search input
  // Fix: wrap in useMemo with [patients] as dependency
  const criticalPatients = patients.filter(p => p.priority === 'CRITICAL');

  // BUG 3: New function reference on every render
  // This breaks memo on PatientCard — it always sees a "new" onSelect prop
  // Fix: wrap in useCallback with [] dependency (setSelectedPatient is stable)
  function handleSelectPatient(patient) {
    setSelectedPatient(patient);
  }

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <p>Critical patients: {criticalPatients.length}</p>
      <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
      {filteredPatients.map(p => (
        <PatientCard key={p.id} patient={p} onSelect={handleSelectPatient} />
      ))}
      {selectedPatient && <p>Selected: {selectedPatient.name}</p>}
    </div>
  );
}`;

const FIXED_CODE = `import { useState, useMemo, useCallback, memo } from 'react';

// FIX 1: memo() wraps the component — skips re-render if props unchanged
const PatientCard = memo(function PatientCard({ patient, onSelect }) {
  console.log('PatientCard rendered:', patient.name);
  return (
    <div className="patient-card" onClick={() => onSelect(patient)}>
      <strong>{patient.name}</strong>
      <span>Ward {patient.ward}</span>
      <span>{patient.priority}</span>
    </div>
  );
});

function Dashboard({ patients }) {
  const [searchQuery,      setSearchQuery]      = useState('');
  const [selectedPatient,  setSelectedPatient]  = useState(null);

  // FIX 2: useMemo caches result — only recalculates when patients changes
  const criticalPatients = useMemo(
    () => patients.filter(p => p.priority === 'CRITICAL'),
    [patients]
  );

  // FIX 3: useCallback caches function reference — stable across renders
  const handleSelectPatient = useCallback((patient) => {
    setSelectedPatient(patient);
  }, []);

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <p>Critical patients: {criticalPatients.length}</p>
      <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
      {filteredPatients.map(p => (
        <PatientCard key={p.id} patient={p} onSelect={handleSelectPatient} />
      ))}
      {selectedPatient && <p>Selected: {selectedPatient.name}</p>}
    </div>
  );
}`;

const BUGS = [
  { id: 'memo',        line: 6,  description: 'PatientCard re-renders on every parent render even with unchanged props', fix: 'Wrap PatientCard with memo()' },
  { id: 'usememo',     line: 19, description: 'Expensive filter runs on every render including unrelated state changes', fix: 'Wrap in useMemo with [patients] dependency' },
  { id: 'usecallback', line: 25, description: 'New function reference every render breaks memo on PatientCard',          fix: 'Wrap in useCallback with [] dependency' },
];

export default function Level3_13() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage3Shell levelId={13} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l313-container">
          <div className="l313-brief">
            <div className="l313-tag">// Debug Brief</div>
            <h2>Fix performance bugs in <span style={{ color: selectedDomain?.color }}>PatientDashboard</span>.</h2>
            <p>3 bugs cause unnecessary re-renders and wasted calculations. Apply memo, useMemo, and useCallback.</p>
          </div>
          <DebugEditor
            buggyCode={BUGGY_CODE}
            fixedCode={FIXED_CODE}
            bugs={BUGS}
            onAllFixed={() => setIsCorrect(true)}
          />
        </div>
      </LevelSupportWrapper>
    </Stage3Shell>
  );
}