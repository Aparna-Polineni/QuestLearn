// src/screens/stage3/Level3_5.jsx
// Forms — Getting User Input — Fill mode
// Student fills: onChange handler, controlled value, onSubmit, preventDefault

import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage3Shell from './Stage3Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from '../stage2/FillEditor';
import './Level3_5.css';

const SUPPORT = {
  intro: {
    concept: "Controlled Forms — React Owns the Input",
    tagline: "In React, every form input's value lives in state. React is the single source of truth.",
    whatYouWillDo: "Fill in 5 blanks to build a patient admission form: controlled inputs with onChange, form submission with preventDefault, and basic validation before submitting.",
    whyItMatters: "Every form in every app — login, registration, data entry, search — follows this exact pattern. Understanding controlled inputs is non-negotiable for any React developer.",
  },
  hints: [
    "Controlled input: value={state} + onChange={handler}. The onChange fires every keystroke. The handler updates state. React re-renders with the new value. The input always shows exactly what's in state.",
    "Form submission: <form onSubmit={handleSubmit}>. The handler receives a form event. Call e.preventDefault() to stop the browser from refreshing the page — the default form behaviour you almost never want in React.",
    "Validation before submit: check your state values and set an error state if invalid. Display the error in the UI. Only call your save function if validation passes.",
  ],
  reveal: {
    concept: "Controlled Inputs and Form Submission",
    whatYouLearned: "Controlled inputs tie value to state and update via onChange. e.preventDefault() stops browser page refresh on submit. Validation runs before processing. Error state shows validation messages. onSubmit on the form element handles submission (better than onClick on a button — catches Enter key presses too).",
    realWorldUse: "A patient admission form collects name, DOB, ward, and GP details. Every field is controlled. On submit, validate required fields, check date formats, confirm ward exists — then POST to your Spring Boot backend. The form data travels from React state → validation → API call → database.",
    developerSays: "Always use e.preventDefault() on form submit in React. Forgetting it causes a full page reload, wiping all your state. It's one of those things that trips up every developer exactly once.",
  },
};

const TEMPLATE = `import { useState } from 'react';

function AdmissionForm({ onSubmit }) {

    // Controlled state for each form field
    const [name,     setName]     = useState('');
    const [ward,     setWard]     = useState('');
    const [priority, setPriority] = useState('NORMAL');
    const [error,    setError]    = useState('');

    function handleSubmit(e) {
        // Stop the browser from refreshing the page
        // Without this, the form POST causes a full page reload
        e.___PREVENT_DEFAULT___();

        // Validation before submitting
        if (!name.trim() || !ward.trim()) {
            setError('Name and ward are required');
            return; // Stop here — don't submit invalid data
        }

        setError(''); // Clear any previous error
        onSubmit({ name, ward, priority }); // Pass data to parent
    }

    return (
        // onSubmit on the form catches both button clicks AND Enter key presses
        <form ___ON_SUBMIT___={handleSubmit} className="admission-form">
            <h3>Patient Admission</h3>

            {error && <p className="form-error">{error}</p>}

            {/* Controlled text input — value tied to state, onChange updates state */}
            <label>
                Patient Name
                <input
                    type="text"
                    ___VALUE___={name}
                    ___ON_CHANGE___={e => setName(e.target.value)}
                    placeholder="Full name"
                />
            </label>

            <label>
                Ward Number
                <input
                    type="text"
                    value={ward}
                    onChange={e => setWard(e.target.value)}
                    placeholder="e.g. 3"
                />
            </label>

            {/* Controlled select — same pattern as input */}
            <label>
                Priority
                <select value={priority} onChange={e => setPriority(e.target.value)}>
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                </select>
            </label>

            <button type="submit">Admit Patient</button>
        </form>
    );
}`;

const BLANKS = [
  { id: 'PREVENT_DEFAULT', answer: 'preventDefault', placeholder: 'method',      hint: 'Called on the form event to stop the browser from reloading the page.' },
  { id: 'ON_SUBMIT',       answer: 'onSubmit',       placeholder: 'event prop',   hint: 'JSX event handler for form submission. Fires on submit button click or Enter key.' },
  { id: 'VALUE',           answer: 'value',          placeholder: 'JSX attr',     hint: 'Ties the input display to the state variable. Without this the input is uncontrolled.' },
  { id: 'ON_CHANGE',       answer: 'onChange',       placeholder: 'event prop',   hint: 'Fires on every keystroke. The handler updates state, React re-renders, input shows new value.' },
];

export default function Level3_5() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage3Shell levelId={5} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l35-container">

          <div className="l35-brief">
            <div className="l35-tag">// Mission Brief</div>
            <h2>Build a controlled <span style={{ color: selectedDomain?.color }}>AdmissionForm</span>.</h2>
            <p>Fill in 4 blanks to complete the form: prevent default, wire onSubmit, add value, add onChange.</p>
            <div className="l35-controlled">
              <div className="l35-flow">
                <span>User types</span>
                <span className="l35-arrow">→</span>
                <span>onChange fires</span>
                <span className="l35-arrow">→</span>
                <span>setState()</span>
                <span className="l35-arrow">→</span>
                <span>re-render</span>
                <span className="l35-arrow">→</span>
                <span>input shows new value</span>
              </div>
            </div>
          </div>

          <FillEditor
            template={TEMPLATE}
            blanks={BLANKS}
            onAllCorrect={() => setIsCorrect(true)}
            expectedOutput="Form renders with controlled inputs, validates on submit, calls onSubmit with form data"
          />

        </div>
      </LevelSupportWrapper>
    </Stage3Shell>
  );
}