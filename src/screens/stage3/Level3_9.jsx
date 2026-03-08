// src/screens/stage3/Level3_9.jsx
// Error & Loading States — Debug mode
// Bugs: missing error boundary, loading not reset on error, no empty state

import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage3Shell from './Stage3Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import DebugEditor from '../stage2/DebugEditor';
import './Level3_9.css';

const SUPPORT = {
  intro: {
    concept: "Error & Loading States — Never Leave Users Guessing",
    tagline: "A blank screen while loading and a crashed UI on error are the two most unprofessional things in frontend development.",
    whatYouWillDo: "Find and fix 4 bugs in a component that handles loading and error states incorrectly. The component hangs, crashes on errors, and shows nothing when the list is empty.",
    whyItMatters: "Real networks fail. APIs return errors. Data is sometimes empty. A production app must handle all three gracefully. Senior developers notice immediately when junior devs skip error handling — it's a code quality signal.",
  },
  hints: [
    "Bug 1: loading is never set to false when an error occurs. The finally block should always set setLoading(false) — whether fetch succeeds or fails.",
    "Bug 2: the error is caught but setError is never called. The catch block catches the error but discards it silently. Call setError(err.message) in the catch block.",
    "Bug 3 & 4: missing empty state check (patients.length === 0 case) and the error message is rendered inside the main layout instead of returning early — which means the broken layout shows alongside the error.",
  ],
  reveal: {
    concept: "Robust Async State Management",
    whatYouLearned: "Always use finally to reset loading state — it runs whether fetch succeeded or failed. Always call setError in catch. Return early for loading, error, and empty states before the main render. This 'guard clause' pattern keeps the happy path clean.",
    realWorldUse: "In production: a network blip causes a 500 error. Without proper error handling the component crashes and shows nothing — or worse, shows stale data as if it's current. With proper handling: a clear error message with a retry button. Users know what happened and what to do.",
    developerSays: "I review a lot of junior developer code and missing error handling is the most consistent gap. They test the happy path and it works, so they ship it. Then a server goes down in production and the entire dashboard goes blank with no explanation. Always handle failure.",
  },
};

const BUGGY_CODE = `import { useState, useEffect } from 'react';

function VitalSignsList({ patientId }) {
  const [vitals,   setVitals]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    async function fetchVitals() {
      setLoading(true);
      try {
        const res = await fetch(\`/api/patients/\${patientId}/vitals\`);
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        const data = await res.json();
        setVitals(data);
        setLoading(false); // BUG 1: loading only reset on success, not on error
      } catch (err) {
        // BUG 2: error is caught but setError is never called — silently swallowed
        console.log('fetch failed');
        // loading stays true forever when this catch runs
      }
    }
    fetchVitals();
  }, [patientId]);

  // BUG 3: error check is inside the layout div — shows broken partial UI alongside error
  return (
    <div className="vitals-list">
      <h3>Vital Signs</h3>
      {error && <p className="error-msg">{error}</p>}

      {loading && <div className="spinner">Loading...</div>}

      {/* BUG 4: no empty state — if vitals is [], renders nothing with no message */}
      {vitals.map(v => (
        <div key={v.id} className="vital-row">
          <span>{v.type}</span>
          <span>{v.value} {v.unit}</span>
          <span>{v.timestamp}</span>
        </div>
      ))}
    </div>
  );
}

export default VitalSignsList;`;

const FIXED_CODE = `import { useState, useEffect } from 'react';

function VitalSignsList({ patientId }) {
  const [vitals,   setVitals]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    async function fetchVitals() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(\`/api/patients/\${patientId}/vitals\`);
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        const data = await res.json();
        setVitals(data);
      } catch (err) {
        setError(err.message); // FIX 2: actually call setError
      } finally {
        setLoading(false); // FIX 1: always reset loading
      }
    }
    fetchVitals();
  }, [patientId]);

  // FIX 3: return early for loading and error — clean guard clauses
  if (loading) return <div className="spinner">Loading vital signs...</div>;
  if (error)   return <div className="error-msg">Error: {error}</div>;

  // FIX 4: handle empty state
  if (vitals.length === 0) {
    return <p className="empty-state">No vital signs recorded yet.</p>;
  }

  return (
    <div className="vitals-list">
      <h3>Vital Signs ({vitals.length})</h3>
      {vitals.map(v => (
        <div key={v.id} className="vital-row">
          <span>{v.type}</span>
          <span>{v.value} {v.unit}</span>
          <span>{v.timestamp}</span>
        </div>
      ))}
    </div>
  );
}

export default VitalSignsList;`;

const BUGS = [
  {
    id: 'finally',
    line: 14,
    description: 'setLoading(false) inside try — never runs when fetch fails',
    fix: 'Move setLoading(false) to a finally block so it always runs',
    check: c => c.includes('finally') && c.includes('setLoading(false)'),
  },
  {
    id: 'seterror',
    line: 18,
    description: 'catch block swallows error without calling setError',
    fix: 'Add setError(err.message) inside the catch block',
    check: c => c.includes('setError(') && c.includes('catch'),
  },
  {
    id: 'early',
    line: 27,
    description: 'Error shown inside the layout — broken UI renders alongside it',
    fix: 'Return early: if (error) return <div>Error: {error}</div>',
    check: c => /if\s*\(\s*error\s*\)/.test(c) && c.includes('return'),
  },
  {
    id: 'empty',
    line: 31,
    description: 'No empty state — renders nothing when vitals array is empty',
    fix: 'Add: if (vitals.length === 0) return <p>No vitals recorded</p>',
    check: c => c.includes('vitals.length') && c.includes('return'),
  },
];

export default function Level3_9() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage3Shell levelId={9} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l39-container">
          <div className="l39-brief">
            <div className="l39-tag">// Debug Brief</div>
            <h2>Fix the broken <span style={{ color: selectedDomain?.color }}>VitalSignsList</span>.</h2>
            <p>4 bugs. The component hangs forever on errors, swallows exceptions silently, and shows nothing when data is empty.</p>
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