// src/screens/stage3/Level3_15.jsx
// The Complete Frontend — Build mode (capstone)

import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage3Shell from './Stage3Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import CodeEditor from '../stage2/CodeEditor';
import './Level3_15.css';

const SUPPORT = {
  intro: {
    concept: "Stage 3 Capstone — The Complete Hospital Frontend",
    tagline: "Everything from Stage 3 in one component. This is what a real feature looks like.",
    whatYouWillDo: "Build a complete PatientManagement feature: authentication check, data fetching with filters, a create form, and error/loading states — all wired together using every concept from Stage 3.",
    whyItMatters: "This is your Stage 3 portfolio piece. It demonstrates: components, props, state, useEffect, forms, context, custom hooks, and routing — all working together as a real feature a developer would build at a job.",
  },
  hints: [
    "Start with the data: useEffect fetches patients, filtering by ward if set. State: patients array, loading bool, error string, ward filter, showForm bool.",
    "The form is a controlled component with name, ward, priority. On submit: POST to /api/patients, then re-fetch the list (or add the new patient to state directly).",
    "Wire auth: check if the user is logged in using your useAuth hook — if not, redirect to /login. Show the current user's name in the header.",
  ],
  reveal: {
    concept: "Stage 3 Complete — React Frontend Mastery",
    whatYouLearned: "You've built the complete React layer: components, props, state, useEffect, forms, context, custom hooks, routing, auth, performance. This is the frontend foundation of every web application. Stage 4 builds the backend. Stage 5 adds the database. Stage 6 connects them all.",
    realWorldUse: "This PatientManagement feature is one screen of a real hospital system. A complete hospital dashboard has 20-30 screens like this. Each one is the same patterns: fetch data, display it, forms to create/edit, auth to protect it. You now have the foundation to build all of them.",
    developerSays: "Stage 3 is the hardest stage for most people. Not because the concepts are complex — but because there are many of them and they interact. You've now seen all of them together. Re-read any level that felt unclear before moving to Stage 4. The backend is much simpler once React clicks.",
  },
};

const STARTER = `import { useState, useEffect, useCallback } from 'react';
// Assume useAuth() hook is available from AuthContext

const API = 'http://localhost:8080';

function PatientManagement() {
  // TODO: Get user from useAuth() — if no user, the ProtectedRoute handles redirect

  // TODO: State:
  // patients (array), loading (bool), error (string|null)
  // wardFilter ('all' or '1'-'4'), showForm (bool)

  // TODO: useCallback fetchPatients that:
  // - Sets loading true, clears error
  // - Fetches /api/patients with ?ward=X if wardFilter !== 'all'
  // - Sets patients from response
  // - Handles errors
  // - Sets loading false in finally
  // Dependency: [wardFilter]

  // TODO: useEffect that calls fetchPatients when wardFilter changes

  // TODO: handleAdmit(formData) that:
  // - POSTs to /api/patients with Authorization header
  // - On success: calls fetchPatients() to refresh the list
  // - Sets showForm(false)

  return (
    <div className="patient-management">
      {/* TODO: Header with title and current user email */}
      {/* TODO: Ward filter select + "Admit Patient" button that toggles showForm */}
      {/* TODO: If showForm: render AdmissionForm passing handleAdmit as onSubmit */}
      {/* TODO: If loading: spinner */}
      {/* TODO: If error: error message with retry button */}
      {/* TODO: Patient grid — map patients to cards */}
      {/* TODO: Footer showing count */}
    </div>
  );
}

// TODO: Build AdmissionForm({ onSubmit }) — controlled form with:
// name (text), ward (select 1-4), priority (select NORMAL/HIGH/CRITICAL)
// Validation: name required
// On submit: calls onSubmit({ name, ward, priority })

export default PatientManagement;`;

const SOLUTION = `import { useState, useEffect, useCallback } from 'react';

const API = 'http://localhost:8080';

function AdmissionForm({ onSubmit }) {
  const [name,     setName]     = useState('');
  const [ward,     setWard]     = useState('1');
  const [priority, setPriority] = useState('NORMAL');
  const [error,    setError]    = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) { setError('Name is required'); return; }
    setError('');
    onSubmit({ name, ward, priority });
  }

  return (
    <form onSubmit={handleSubmit} className="admission-form">
      <h3>Admit Patient</h3>
      {error && <p className="form-error">{error}</p>}
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Patient name" />
      <select value={ward} onChange={e => setWard(e.target.value)}>
        {['1','2','3','4'].map(w => <option key={w} value={w}>Ward {w}</option>)}
      </select>
      <select value={priority} onChange={e => setPriority(e.target.value)}>
        <option value="NORMAL">Normal</option>
        <option value="HIGH">High</option>
        <option value="CRITICAL">Critical</option>
      </select>
      <button type="submit">Admit</button>
    </form>
  );
}

function PatientManagement() {
  const token = localStorage.getItem('ql_token');
  const email = localStorage.getItem('ql_email');

  const [patients,    setPatients]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [wardFilter,  setWardFilter]  = useState('all');
  const [showForm,    setShowForm]    = useState(false);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = wardFilter === 'all' ? \`\${API}/api/patients\` : \`\${API}/api/patients?ward=\${wardFilter}\`;
      const res = await fetch(url, { headers: { Authorization: \`Bearer \${token}\` } });
      if (!res.ok) throw new Error(\`Server error \${res.status}\`);
      setPatients(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [wardFilter, token]);

  useEffect(() => { fetchPatients(); }, [fetchPatients]);

  async function handleAdmit(formData) {
    try {
      const res = await fetch(\`\${API}/api/patients\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: \`Bearer \${token}\` },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to admit patient');
      setShowForm(false);
      fetchPatients();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="patient-management">
      <div className="pm-header">
        <h1>Patient Management</h1>
        <span>Logged in as: {email}</span>
      </div>
      <div className="pm-toolbar">
        <select value={wardFilter} onChange={e => setWardFilter(e.target.value)}>
          <option value="all">All Wards</option>
          {['1','2','3','4'].map(w => <option key={w} value={w}>Ward {w}</option>)}
        </select>
        <button onClick={() => setShowForm(f => !f)}>
          {showForm ? 'Cancel' : '+ Admit Patient'}
        </button>
      </div>
      {showForm && <AdmissionForm onSubmit={handleAdmit} />}
      {loading && <div className="spinner">Loading patients...</div>}
      {error   && <div className="error">{error} <button onClick={fetchPatients}>Retry</button></div>}
      {!loading && !error && (
        <div className="patient-grid">
          {patients.map(p => (
            <div key={p.id} className={\`patient-card priority-\${p.priority?.toLowerCase()}\`}>
              <strong>{p.name}</strong>
              <span>Ward {p.ward}</span>
              <span>{p.priority}</span>
            </div>
          ))}
        </div>
      )}
      <p className="pm-footer">{patients.length} patients</p>
    </div>
  );
}

export default PatientManagement;`;

const CHECKS = [
  { id: 'fetch',      label: 'useEffect fetches patients on mount',          test: c => c.includes('useEffect') && c.includes('fetch') },
  { id: 'callback',   label: 'fetchPatients wrapped in useCallback',         test: c => c.includes('useCallback') },
  { id: 'ward',       label: 'Ward filter changes re-trigger fetch',         test: c => c.includes('wardFilter') && c.includes('[') },
  { id: 'loading',    label: 'Loading state shown while fetching',           test: c => c.includes('loading') },
  { id: 'error',      label: 'Error handled with retry option',              test: c => c.includes('error') && c.includes('Retry') },
  { id: 'form',       label: 'AdmissionForm component built',                test: c => c.includes('AdmissionForm') && c.includes('onSubmit') },
  { id: 'post',       label: 'handleAdmit POSTs to /api/patients',           test: c => c.includes('POST') && c.includes('/api/patients') },
  { id: 'auth',       label: 'Authorization header sent with requests',      test: c => c.includes('Authorization') && c.includes('Bearer') },
  { id: 'map',        label: 'Patients rendered as cards with keys',         test: c => c.includes('patients.map') && c.includes('key=') },
];

export default function Level3_15() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage3Shell levelId={15} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l315-container">
          <div className="l315-brief">
            <div className="l315-tag">// Stage 3 Capstone</div>
            <h2>Build the complete <span style={{ color: selectedDomain?.color }}>PatientManagement</span> feature.</h2>
            <p>Every concept from Stage 3 in one real feature. Fetch, filter, form, auth header, error states, and a working UI.</p>
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