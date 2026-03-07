// src/screens/stage3/Level3_3.jsx
// State — Making it Interactive — Fill mode
// Student fills: useState import, state declaration, setter call, controlled input

import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage3Shell from './Stage3Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from '../stage2/FillEditor';
import './Level3_3.css';

const SUPPORT = {
  intro: {
    concept: "useState — React's Memory",
    tagline: "State is data that changes. When state changes, React re-renders. That's the entire model.",
    whatYouWillDo: "Fill in 5 blanks: importing useState, declaring state, reading state, calling the setter to update it, and wiring it to a controlled input.",
    whyItMatters: "Without state, your UI is static — it just displays data and never changes. State is what makes React apps interactive. Every toggle, counter, form field, modal, filter, and tab is powered by state.",
  },
  hints: [
    "useState is imported from React: import { useState } from 'react'. It returns an array of two things: [currentValue, setterFunction]. Destructure them: const [count, setCount] = useState(0). The argument to useState() is the initial value.",
    "Reading state: just use the variable name — {count} in JSX. Writing state: call the setter — setCount(newValue). Never mutate state directly (count = count + 1 does NOT work). Always use the setter.",
    "Controlled inputs: the input's value is tied to state ({value={inputValue}}), and onChange updates state (onChange={e => setInputValue(e.target.value)}). This makes React the single source of truth for the input's content.",
  ],
  reveal: {
    concept: "useState Hook — Interactive Components",
    whatYouLearned: "useState returns [value, setter]. The initial value is passed as the argument. Read state with the variable. Update state with the setter — never direct assignment. Calling the setter triggers a re-render with the new value. Controlled inputs tie value to state and update via onChange. State is local to the component — each instance has its own.",
    realWorldUse: "In a hospital system: isMonitoringActive state controls whether vital signs are updating. selectedPatientId state tracks which patient is selected. searchQuery state filters the patient list in real time. Every piece of dynamic UI comes back to state.",
    developerSays: "New React developers often try 'let count = 0; count++' and wonder why nothing re-renders. React doesn't know about regular variables — only state changes trigger re-renders. State is how you tell React: 'this data matters, watch it, re-render when it changes'.",
  },
};

const TEMPLATE = `// useState must be imported from React before use
___IMPORT___ { useState } from 'react';

function PatientMonitor({ patientId }) {

    // useState returns [currentValue, setterFunction]
    // Initial value = false — monitoring starts paused
    const [___IS_ACTIVE___, setIsActive] = ___USE_STATE___(false);

    // Second piece of state — a number starting at 0
    const [heartRate, setHeartRate] = useState(0);

    // Third piece of state — a string starting empty
    const [notes, setNotes] = useState('');

    function toggleMonitoring() {
        // Call the setter with the NEW value
        // Do NOT do: isActive = true (direct mutation never triggers re-render)
        ___SET_ACTIVE___(!isActive);
    }

    function handleHeartRateChange(e) {
        // e.target.value is always a string — parse to number
        setHeartRate(Number(e.target.value));
    }

    return (
        <div className="monitor">

            {/* Read state directly in JSX with curly braces */}
            <p>Monitoring: {isActive ? 'ACTIVE' : 'PAUSED'}</p>
            <p>Heart Rate: {heartRate} bpm</p>

            <button onClick={toggleMonitoring}>
                {isActive ? 'Pause' : 'Start'} Monitoring
            </button>

            {/* Controlled input: value tied to state, onChange updates state */}
            {/* This makes React the single source of truth for the input */}
            <input
                type="number"
                value={heartRate}
                onChange={___HEART_RATE_CHANGE___}
                placeholder="Enter heart rate"
            />

            <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Clinical notes..."
            />
        </div>
    );
}`;

const BLANKS = [
  { id: 'IMPORT',           answer: 'import',                  placeholder: 'keyword',   hint: 'ES6 keyword to bring in code from another module.' },
  { id: 'IS_ACTIVE',        answer: 'isActive',                placeholder: 'variable',  hint: 'The state variable name — boolean that tracks whether monitoring is on.' },
  { id: 'USE_STATE',        answer: 'useState',                placeholder: 'hook',      hint: 'The React hook that creates a piece of state. Starts with "use".' },
  { id: 'SET_ACTIVE',       answer: 'setIsActive',             placeholder: 'setter',    hint: 'The setter function from the useState destructuring above. Calling it triggers a re-render.' },
  { id: 'HEART_RATE_CHANGE',answer: 'handleHeartRateChange',   placeholder: 'handler',   hint: 'The function defined above that parses the input value and calls setHeartRate.' },
];

export default function Level3_3() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage3Shell levelId={3} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l33-container">

          <div className="l33-brief">
            <div className="l33-tag">// Mission Brief</div>
            <h2>Add state to a <span style={{ color: selectedDomain?.color }}>PatientMonitor</span>.</h2>
            <p>Fill in 5 blanks. You'll import useState, declare 3 pieces of state, call a setter, and wire a controlled input.</p>
            <div className="l33-model">
              <div className="l33-model-row">
                <span className="l33-arrow">const [value, setValue] = useState(initial)</span>
              </div>
              <div className="l33-model-sub">
                <span>value → read in JSX as {'{value}'}</span>
                <span>setValue(newValue) → triggers re-render</span>
                <span>initial → starting value on first render</span>
              </div>
            </div>
          </div>

          <FillEditor
            template={TEMPLATE}
            blanks={BLANKS}
            onAllCorrect={() => setIsCorrect(true)}
            expectedOutput="PatientMonitor renders with toggle button and controlled number input"
          />

        </div>
      </LevelSupportWrapper>
    </Stage3Shell>
  );
}