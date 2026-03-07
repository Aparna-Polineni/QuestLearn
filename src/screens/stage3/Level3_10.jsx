// src/screens/stage3/Level3_10.jsx
// Context — Global State — Build mode

import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage3Shell from './Stage3Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import CodeEditor from '../stage2/CodeEditor';
import './Level3_10.css';

const SUPPORT = {
  intro: {
    concept: "React Context — Sharing State Without Prop Drilling",
    tagline: "When you need the same data in 10 different components, don't pass props through 5 layers. Use Context.",
    whatYouWillDo: "Build a HospitalContext that shares the selected patient and current user across the entire app — without passing props through every component in between.",
    whyItMatters: "In a real hospital dashboard, the selected patient is needed by the sidebar, the vitals chart, the medication list, the notes panel, and the action buttons — all at different levels of the component tree. Context solves this cleanly.",
  },
  hints: [
    "Three steps: createContext() to create it, a Provider component to wrap your app and provide the value, useContext(YourContext) in any component to read the value.",
    "The Provider's value prop is what all consumers receive: <HospitalProvider value={{ selectedPatient, setSelectedPatient }}>. Wrap this around the parts of your app that need the data.",
    "useContext(HospitalContext) returns whatever you put in the Provider's value prop. Destructure it: const { selectedPatient, setSelectedPatient } = useContext(HospitalContext).",
  ],
  reveal: {
    concept: "React Context API",
    whatYouLearned: "createContext() creates the context object. Provider wraps components that need the data. useContext() reads the value from the nearest Provider above in the tree. Context re-renders all consumers when the value changes. Good for: auth user, theme, selected item, app-wide settings. Not ideal for: frequently changing data like form inputs.",
    realWorldUse: "QuestLearn itself uses this pattern — GameContext shares selectedCareerPath, completedLevels, and XP across every component. AuthContext shares the logged-in user. You built these in previous sessions — now you understand exactly how they work.",
    developerSays: "Context is not a replacement for all state. Local state (useState) is still right for component-specific data like a form field or a toggle. Context is for data that truly needs to be global: who is logged in, what theme is selected, what entity is selected.",
  },
};

const STARTER = `import { createContext, useContext, useState } from 'react';

// TODO: Create HospitalContext using createContext()
// Give it a default value of null

// TODO: Build HospitalProvider component that:
// - Accepts children as a prop
// - Has state: selectedPatient (null initially), currentUser (null initially)
// - Returns HospitalContext.Provider with value containing selectedPatient,
//   setSelectedPatient, currentUser, setCurrentUser
// - Renders {children} inside the Provider

// TODO: Build useHospital custom hook that:
// - Calls useContext(HospitalContext)
// - Throws an error if used outside HospitalProvider
// - Returns the context value

// ── Consumer components (these use the context) ───────────────────────────

function PatientSelector() {
  // TODO: use useHospital() to get setSelectedPatient
  const patients = [
    { id: 1, name: 'Alice Chen', ward: 3 },
    { id: 2, name: 'Bob Smith', ward: 1 },
  ];

  return (
    <div>
      <h3>Select Patient</h3>
      {/* TODO: map over patients, clicking one calls setSelectedPatient(patient) */}
    </div>
  );
}

function PatientInfo() {
  // TODO: use useHospital() to get selectedPatient
  // If no patient selected, show "No patient selected"
  // Otherwise show the patient's name and ward
  return <div>Patient info here</div>;
}

// ── App ───────────────────────────────────────────────────────────────────
function App() {
  // TODO: Wrap PatientSelector and PatientInfo in HospitalProvider
  return (
    <div>
      <PatientSelector />
      <PatientInfo />
    </div>
  );
}

export default App;`;

const SOLUTION = `import { createContext, useContext, useState } from 'react';

const HospitalContext = createContext(null);

function HospitalProvider({ children }) {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <HospitalContext.Provider value={{ selectedPatient, setSelectedPatient, currentUser, setCurrentUser }}>
      {children}
    </HospitalContext.Provider>
  );
}

function useHospital() {
  const ctx = useContext(HospitalContext);
  if (!ctx) throw new Error('useHospital must be used inside HospitalProvider');
  return ctx;
}

function PatientSelector() {
  const { setSelectedPatient } = useHospital();
  const patients = [
    { id: 1, name: 'Alice Chen', ward: 3 },
    { id: 2, name: 'Bob Smith', ward: 1 },
  ];

  return (
    <div>
      <h3>Select Patient</h3>
      {patients.map(p => (
        <button key={p.id} onClick={() => setSelectedPatient(p)}>
          {p.name}
        </button>
      ))}
    </div>
  );
}

function PatientInfo() {
  const { selectedPatient } = useHospital();
  if (!selectedPatient) return <p>No patient selected</p>;
  return (
    <div>
      <h3>{selectedPatient.name}</h3>
      <p>Ward: {selectedPatient.ward}</p>
    </div>
  );
}

function App() {
  return (
    <HospitalProvider>
      <PatientSelector />
      <PatientInfo />
    </HospitalProvider>
  );
}

export default App;`;

const CHECKS = [
  { id: 'create',    label: 'createContext() called to make HospitalContext',       test: c => c.includes('createContext') },
  { id: 'provider',  label: 'HospitalProvider component wraps children',            test: c => c.includes('HospitalProvider') && c.includes('children') },
  { id: 'value',     label: 'Provider value contains selectedPatient + setter',     test: c => c.includes('selectedPatient') && c.includes('setSelectedPatient') },
  { id: 'hook',      label: 'useHospital custom hook created',                      test: c => c.includes('useHospital') && c.includes('useContext') },
  { id: 'error',     label: 'useHospital throws if used outside Provider',          test: c => c.includes('throw') },
  { id: 'consume',   label: 'PatientInfo reads selectedPatient from context',       test: c => c.includes('selectedPatient') && c.includes('PatientInfo') },
  { id: 'wrap',      label: 'App wraps components in HospitalProvider',             test: c => c.includes('<HospitalProvider>') },
];

export default function Level3_10() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage3Shell levelId={10} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l310-container">
          <div className="l310-brief">
            <div className="l310-tag">// Mission Brief</div>
            <h2>Build <span style={{ color: selectedDomain?.color }}>HospitalContext</span> for global state.</h2>
            <p>Create context, build a Provider, write a custom hook, and wire two consumer components — all without prop drilling.</p>
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