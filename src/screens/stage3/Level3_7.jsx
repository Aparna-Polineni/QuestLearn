// src/screens/stage3/Level3_7.jsx
// Routing — Multiple Pages — Build mode
// Student writes React Router setup: BrowserRouter, Routes, Route, Link, useNavigate

import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage3Shell from './Stage3Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import CodeEditor from '../stage2/CodeEditor';
import './Level3_7.css';

const SUPPORT = {
  intro: {
    concept: "React Router — Multiple Pages in a Single-Page App",
    tagline: "React apps don't reload the page when navigating. React Router swaps components in and out based on the URL.",
    whatYouWillDo: "Build a routing setup for a hospital dashboard: wrap the app in BrowserRouter, define Routes with paths, add navigation Links, and use useNavigate to redirect programmatically.",
    whyItMatters: "Every real app has multiple pages. Without routing, everything would be on one screen or you'd lose state on every navigation. React Router is the industry standard — used in virtually every production React app.",
  },
  hints: [
    "BrowserRouter wraps your entire app (usually in index.js or App.js). Inside it, Routes contains Route elements. Each Route has a path and an element: <Route path='/patients' element={<PatientList />} />.",
    "Link replaces <a href>. Using a regular <a> would cause a full page reload and lose all React state. <Link to='/patients'>View Patients</Link> updates the URL without reloading.",
    "useNavigate() returns a navigate function. Call navigate('/path') to redirect programmatically — useful after form submission, login, or any action that should take the user somewhere else.",
  ],
  reveal: {
    concept: "React Router v6 — Client-Side Routing",
    whatYouLearned: "BrowserRouter provides routing context. Routes matches the current URL to a Route. Link navigates without page reload. useNavigate() for programmatic navigation. useParams() to read URL parameters like /patients/:id. Nested routes for layouts shared across pages.",
    realWorldUse: "A hospital dashboard: /dashboard (overview), /patients (list), /patients/:id (detail), /admissions/new (form), /reports (analytics). Each route renders a different component. The sidebar navigation uses Link. After admitting a patient the form uses navigate('/patients') to redirect to the list.",
    developerSays: "The biggest React Router mistake is using window.location.href = '/path' for navigation — that causes a full page reload and destroys your React state. Always use Link or navigate() from useNavigate().",
  },
};

const STARTER = `// Install: npm install react-router-dom
// React Router v6 — the current standard

import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';

// ── Page components ──────────────────────────────────────────────────────
function Dashboard() {
  return (
    <div>
      <h1>Hospital Dashboard</h1>
      <p>Overview of all wards and alerts.</p>
      // TODO: Add a Link to /patients
    </div>
  );
}

function PatientList() {
  const navigate = useNavigate();
  // TODO: use navigate to go to /patients/42 when a patient is clicked

  return (
    <div>
      <h1>All Patients</h1>
      // TODO: Map over a sample list and render each patient with a Link to their detail page
    </div>
  );
}

function PatientDetail() {
  // TODO: Use useParams() to read the :id from the URL
  // Then display "Patient ID: {id}"
  return <div>Patient Detail</div>;
}

function NotFound() {
  return <h2>404 — Page not found</h2>;
}

// ── Navigation ────────────────────────────────────────────────────────────
function NavBar() {
  return (
    <nav className="nav">
      // TODO: Add Link elements for Dashboard (/) and Patients (/patients)
    </nav>
  );
}

// ── App — Route definitions ───────────────────────────────────────────────
function App() {
  return (
    // TODO: Wrap everything in BrowserRouter
    // TODO: Add NavBar above Routes
    // TODO: Define Routes with:
    //   path="/"         → Dashboard
    //   path="/patients" → PatientList
    //   path="/patients/:id" → PatientDetail
    //   path="*"         → NotFound (catch-all for 404)
    <div>Replace this with BrowserRouter + NavBar + Routes</div>
  );
}

export default App;`;

const SOLUTION = `import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';

function Dashboard() {
  return (
    <div>
      <h1>Hospital Dashboard</h1>
      <p>Overview of all wards and alerts.</p>
      <Link to="/patients">View All Patients →</Link>
    </div>
  );
}

function PatientList() {
  const navigate = useNavigate();
  const patients = [
    { id: 1, name: 'Alice Chen' },
    { id: 2, name: 'Bob Smith' },
    { id: 3, name: 'Carol White' },
  ];

  return (
    <div>
      <h1>All Patients</h1>
      {patients.map(p => (
        <div key={p.id} onClick={() => navigate(\`/patients/\${p.id}\`)} className="patient-row">
          {p.name}
        </div>
      ))}
    </div>
  );
}

function PatientDetail() {
  const { id } = useParams();
  return (
    <div>
      <h1>Patient Detail</h1>
      <p>Patient ID: {id}</p>
      <Link to="/patients">← Back to list</Link>
    </div>
  );
}

function NotFound() {
  return <h2>404 — Page not found</h2>;
}

function NavBar() {
  return (
    <nav className="nav">
      <Link to="/">Dashboard</Link>
      <Link to="/patients">Patients</Link>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/patients" element={<PatientList />} />
        <Route path="/patients/:id" element={<PatientDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;`;

const CHECKS = [
  { id: 'router',    label: 'BrowserRouter wraps the app',              test: c => c.includes('BrowserRouter') },
  { id: 'routes',    label: 'Routes + Route elements defined',           test: c => c.includes('<Routes>') && c.includes('<Route') },
  { id: 'param',     label: 'Dynamic route /patients/:id defined',       test: c => c.includes('/patients/:id') },
  { id: 'link',      label: 'Link used for navigation (not <a>)',        test: c => c.includes('<Link') },
  { id: 'navigate',  label: 'useNavigate() used for programmatic nav',   test: c => c.includes('useNavigate') },
  { id: 'params',    label: 'useParams() reads the :id from URL',        test: c => c.includes('useParams') },
  { id: 'notfound',  label: 'Catch-all * route for 404',                 test: c => c.includes('path="*"') || c.includes("path='*'") },
];

export default function Level3_7() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage3Shell levelId={7} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l37-container">
          <div className="l37-brief">
            <div className="l37-tag">// Mission Brief</div>
            <h2>Set up routing for the <span style={{ color: selectedDomain?.color }}>hospital dashboard</span>.</h2>
            <p>Replace the TODO comments with working React Router code. Complete all 7 checks to proceed.</p>
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