// src/screens/stage3/Level3_8.jsx
// API Integration — Build mode
// Student wires useEffect + fetch to the Spring Boot backend

import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage3Shell from './Stage3Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import CodeEditor from '../stage2/CodeEditor';
import './Level3_8.css';

const SUPPORT = {
  intro: {
    concept: "API Integration — Connecting React to Your Backend",
    tagline: "This is the moment frontend meets backend. React fetches real data from your Spring Boot API.",
    whatYouWillDo: "Build a PatientDashboard component that fetches patients from /api/patients, handles loading and error states, and re-fetches when the ward filter changes.",
    whyItMatters: "Static hardcoded data is useless in production. Every real app fetches from a server. This is the complete pattern: useEffect + fetch + loading state + error state + render data. You'll use this pattern in every project for the rest of your career.",
  },
  hints: [
    "Build a base URL constant: const API = 'http://localhost:8080'. Then fetch: fetch(`${API}/api/patients?ward=${ward}`). This makes it easy to switch between dev and prod.",
    "Always handle three states: loading (show spinner), error (show message), data (show content). Users need feedback at every stage. A blank screen while loading is terrible UX.",
    "Re-fetch when filter changes by including ward in the useEffect dependency array: useEffect(() => { fetchPatients(); }, [ward]). Every time ward changes, the effect re-runs and fetches fresh data.",
  ],
  reveal: {
    concept: "Complete API Integration Pattern",
    whatYouLearned: "Three states: loading, error, data. useEffect fetches on mount and when dependencies change. Async/await inside useEffect with try/catch/finally. finally sets loading to false whether success or failure. The dependency array controls when re-fetching happens.",
    realWorldUse: "This exact pattern powers the patient list in a real hospital system. The ward filter re-fetches from the database. The Spring Boot backend queries MySQL, returns JSON, React renders it. Add authentication headers, add pagination, add polling — it all builds on this foundation.",
    developerSays: "In 2024 there are libraries like React Query and SWR that handle this pattern for you with caching, background refetching, and more. But understanding the raw pattern first is essential — those libraries solve the same problem, just with more features.",
  },
};

const STARTER = `import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8080';

function PatientDashboard() {
  const [patients, setPatients] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [ward,     setWard]     = useState('all');

  // TODO: useEffect that:
  // 1. Sets loading to true
  // 2. Fetches from API_BASE + '/api/patients' (with ?ward=X if ward !== 'all')
  // 3. Converts response to JSON
  // 4. Calls setPatients with the data
  // 5. Catches errors and calls setError
  // 6. Sets loading to false in finally
  // 7. Re-runs when 'ward' changes

  // TODO: If loading, return a loading spinner div
  // TODO: If error, return an error message div
  
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Patient Dashboard</h1>
        {/* TODO: Add a ward filter select with options: all, 1, 2, 3, 4 */}
        {/* Changing the select should update the 'ward' state */}
      </div>

      <div className="patient-grid">
        {/* TODO: Map over patients and render a card for each */}
        {/* Each card should show: name, ward, priority, heart rate */}
        {/* Use patient.id as the key */}
      </div>

      <p className="patient-count">{patients.length} patients shown</p>
    </div>
  );
}

export default PatientDashboard;`;

const SOLUTION = `import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8080';

function PatientDashboard() {
  const [patients, setPatients] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [ward,     setWard]     = useState('all');

  useEffect(() => {
    async function fetchPatients() {
      setLoading(true);
      setError(null);
      try {
        const url = ward === 'all'
          ? \`\${API_BASE}/api/patients\`
          : \`\${API_BASE}/api/patients?ward=\${ward}\`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(\`Server error: \${res.status}\`);
        const data = await res.json();
        setPatients(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPatients();
  }, [ward]);

  if (loading) return <div className="loading">Loading patients...</div>;
  if (error)   return <div className="error">Error: {error}</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Patient Dashboard</h1>
        <select value={ward} onChange={e => setWard(e.target.value)}>
          <option value="all">All Wards</option>
          <option value="1">Ward 1</option>
          <option value="2">Ward 2</option>
          <option value="3">Ward 3</option>
          <option value="4">Ward 4</option>
        </select>
      </div>
      <div className="patient-grid">
        {patients.map(p => (
          <div key={p.id} className={\`patient-card priority-\${p.priority?.toLowerCase()}\`}>
            <h3>{p.name}</h3>
            <p>Ward {p.ward}</p>
            <p>Priority: {p.priority}</p>
            <p>HR: {p.heartRate} bpm</p>
          </div>
        ))}
      </div>
      <p className="patient-count">{patients.length} patients shown</p>
    </div>
  );
}

export default PatientDashboard;`;

const CHECKS = [
  { id: 'effect',   label: 'useEffect fetches on mount',              test: c => c.includes('useEffect') },
  { id: 'async',    label: 'Async fetch with await',                  test: c => c.includes('await fetch') },
  { id: 'loading',  label: 'Loading state shown while fetching',      test: c => c.includes('loading') && c.includes('return') },
  { id: 'error',    label: 'Error state shown on failure',            test: c => c.includes('error') && c.includes('catch') },
  { id: 'finally',  label: 'finally block sets loading false',        test: c => c.includes('finally') },
  { id: 'deps',     label: 'ward in dependency array',                test: c => c.includes('[ward]') },
  { id: 'filter',   label: 'Ward filter select with onChange',        test: c => c.includes('onChange') && c.includes('setWard') },
  { id: 'map',      label: 'patients.map() renders cards with key',   test: c => c.includes('patients.map') && c.includes('key=') },
];

export default function Level3_8() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage3Shell levelId={8} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l38-container">
          <div className="l38-brief">
            <div className="l38-tag">// Mission Brief</div>
            <h2>Connect the <span style={{ color: selectedDomain?.color }}>PatientDashboard</span> to the backend.</h2>
            <p>Replace the TODO comments. Fetch patients from your Spring Boot API. Handle loading, errors, ward filtering, and re-fetching.</p>
          </div>
          <CodeEditor
            starterCode={STARTER}
            solutionCode={SOLUTION}
            checks={CHECKS}
            onAllPassed={() => setIsCorrect(true)}
            language="jsx"
          />
        </div>
      </LevelSupportWrapper>
    </Stage3Shell>
  );
}