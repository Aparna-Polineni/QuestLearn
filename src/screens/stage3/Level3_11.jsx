// src/screens/stage3/Level3_11.jsx
// Custom Hooks — Build mode

import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage3Shell from './Stage3Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import CodeEditor from '../stage2/CodeEditor';
import './Level3_11.css';

const SUPPORT = {
  intro: {
    concept: "Custom Hooks — Reusable Logic Extracted from Components",
    tagline: "When multiple components need the same stateful logic, extract it into a custom hook instead of copy-pasting.",
    whatYouWillDo: "Build two custom hooks: useFetch (reusable data fetching with loading/error states) and useLocalStorage (state that persists to localStorage). Then use them in components.",
    whyItMatters: "Without custom hooks, every component that fetches data duplicates the same useEffect + loading + error pattern. Custom hooks let you write that logic once and share it across 20 components. This is how real codebases stay maintainable.",
  },
  hints: [
    "A custom hook is just a function whose name starts with 'use' and that calls other hooks inside. function useFetch(url) { const [data, setData] = useState(null); useEffect(...); return { data, loading, error }; }",
    "useFetch should accept a URL, fetch it, manage loading/error/data state, and return all three. The component using it becomes much simpler — just const { data, loading, error } = useFetch('/api/patients').",
    "useLocalStorage wraps useState but syncs to localStorage: initialise from localStorage.getItem(), and whenever value changes, call localStorage.setItem(). Return [value, setValue] just like useState.",
  ],
  reveal: {
    concept: "Custom Hooks — Logic Extraction",
    whatYouLearned: "Custom hooks start with 'use'. They can call any other hooks. They return whatever the component needs (values, setters, functions). They extract logic from components without changing the component tree. Any component can use the same hook — each gets its own isolated state.",
    realWorldUse: "In a hospital system: useFetch('/api/patients') is used by PatientList, PatientSearch, and WardSummary. usePatientAlerts() polls for new alerts every 10 seconds. useVitals(patientId) manages WebSocket connection for real-time vitals. Custom hooks are where senior developers put their most valuable reusable logic.",
    developerSays: "The rule of hooks: only call hooks at the top level (not inside loops or conditions), and only call hooks from React function components or custom hooks. Custom hooks follow these same rules. Breaking them causes hard-to-debug rendering bugs.",
  },
};

const STARTER = `import { useState, useEffect } from 'react';

// TODO: Build useFetch(url) custom hook that:
// - Manages state: data (null), loading (true), error (null)
// - useEffect fetches the url, handles response and errors
// - Returns { data, loading, error }
// - Re-fetches when url changes

// TODO: Build useLocalStorage(key, initialValue) custom hook that:
// - Initialises state from localStorage.getItem(key) or initialValue
// - Whenever value changes, writes to localStorage.setItem(key, JSON.stringify(value))
// - Returns [value, setValue] — same API as useState

// ── Components that USE the hooks ─────────────────────────────────────────

function PatientList() {
  // TODO: Use useFetch to fetch '/api/patients'
  // Show loading, error, or the patient list

  return <div>Use useFetch here</div>;
}

function WardPreference() {
  // TODO: Use useLocalStorage('preferred-ward', 'all') 
  // Render a select that saves the preference to localStorage
  // When the page refreshes, it should remember the selection

  return <div>Use useLocalStorage here</div>;
}

export { useFetch, useLocalStorage };`;

const SOLUTION = `import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

function PatientList() {
  const { data: patients, loading, error } = useFetch('/api/patients');
  if (loading) return <div>Loading...</div>;
  if (error)   return <div>Error: {error}</div>;
  return (
    <div>
      {patients?.map(p => <div key={p.id}>{p.name}</div>)}
    </div>
  );
}

function WardPreference() {
  const [ward, setWard] = useLocalStorage('preferred-ward', 'all');
  return (
    <select value={ward} onChange={e => setWard(e.target.value)}>
      <option value="all">All Wards</option>
      <option value="1">Ward 1</option>
      <option value="2">Ward 2</option>
      <option value="3">Ward 3</option>
    </select>
  );
}

export { useFetch, useLocalStorage };`;

const CHECKS = [
  { id: 'usefetch',    label: 'useFetch custom hook defined',                   test: c => c.includes('function useFetch') },
  { id: 'states',      label: 'useFetch manages data, loading, error',          test: c => c.includes('setData') && c.includes('setLoading') && c.includes('setError') },
  { id: 'returns',     label: 'useFetch returns { data, loading, error }',      test: c => c.includes('return { data') },
  { id: 'urldep',      label: 'useFetch re-fetches when url changes',           test: c => c.includes('[url]') },
  { id: 'localstorage',label: 'useLocalStorage custom hook defined',            test: c => c.includes('function useLocalStorage') },
  { id: 'lsinit',      label: 'useLocalStorage reads from localStorage on init',test: c => c.includes('localStorage.getItem') },
  { id: 'lssync',      label: 'useLocalStorage syncs value changes to storage', test: c => c.includes('localStorage.setItem') },
];

export default function Level3_11() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage3Shell levelId={11} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l311-container">
          <div className="l311-brief">
            <div className="l311-tag">// Mission Brief</div>
            <h2>Build <span style={{ color: selectedDomain?.color }}>useFetch</span> and <span style={{ color: selectedDomain?.color }}>useLocalStorage</span>.</h2>
            <p>Extract repeated logic into reusable custom hooks. Then use them in components — each call gets isolated state.</p>
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