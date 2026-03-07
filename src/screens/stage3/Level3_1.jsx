// src/screens/stage3/Level3_1.jsx
// Your First Component — Fill mode
// Student fills in: function keyword, return keyword, JSX tags, className

import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage3Shell from './Stage3Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from '../stage2/FillEditor';
import './Level3_1.css';

const SUPPORT = {
  intro: {
    concept: "React Components — Your First Function Component",
    tagline: "A component is just a function that returns JSX. That's all React is.",
    whatYouWillDo: "Fill in the 5 blanks to complete your first React component. The component displays one patient card. Comments explain each piece and why it matters.",
    whyItMatters: "Every React app — from a single button to a 500-screen enterprise dashboard — is built from components. Understanding what a component IS (a function that returns UI) is the foundation of everything in Stage 3.",
  },
  hints: [
    "A React component is a JavaScript function. It starts with the 'function' keyword followed by the component name. Component names MUST start with a capital letter — React uses this to distinguish components from HTML tags.",
    "Every component must return JSX. Use the 'return' keyword just like any other function. The JSX is wrapped in parentheses when it spans multiple lines.",
    "JSX looks like HTML but it's JavaScript. Use className instead of class (class is a reserved JS keyword). Curly braces {} embed any JavaScript expression inside JSX.",
  ],
  reveal: {
    concept: "React Function Components",
    whatYouLearned: "A component is a JavaScript function that returns JSX. The function name must be capitalised. JSX uses className instead of class. Curly braces {} embed JS expressions. The component receives data via props (the function parameter). React calls your function every time it needs to re-render the component.",
    realWorldUse: "Every UI element in your hospital system is a component: PatientCard, AlertBanner, VitalSignsChart, NurseSchedule. You build them once and reuse them everywhere with different props. A real hospital dashboard might have 200+ components, all following this exact same pattern.",
    developerSays: "The most common beginner mistake is forgetting to capitalise the component name. <patientcard /> tells React to create an HTML element called 'patientcard' — which doesn't exist. <PatientCard /> tells React to call your function. The capital letter is the entire difference.",
  },
};

const TEMPLATE = `// A React component is a JavaScript function
// The name MUST start with a capital letter
___FUNCTION___ PatientCard({ name, ward, status }) {

    // Every component must return JSX
    // Parentheses let us write JSX across multiple lines
    ___RETURN___ (

        // The outer wrapper — one root element required
        // Use className (not class) — class is a reserved JS keyword
        <___DIV___ ___CLASSNAME___="patient-card">

            {/* Curly braces embed JavaScript expressions in JSX */}
            {/* name, ward, status come from the props parameter above */}
            <h3 className="patient-name">{___NAME___}</h3>
            <p className="patient-ward">Ward: {ward}</p>
            <span className="patient-status">{status}</span>

        </div>
    );
}`;

const BLANKS = [
  { id: 'FUNCTION',  answer: 'function',  placeholder: 'keyword',    hint: 'Declares a JavaScript function. Same keyword you used in Stage 2.' },
  { id: 'RETURN',    answer: 'return',    placeholder: 'keyword',    hint: 'Sends the JSX back to React. Without this, the component renders nothing.' },
  { id: 'DIV',       answer: 'div',       placeholder: 'html tag',   hint: 'A block-level container. The most common wrapper in React components.' },
  { id: 'CLASSNAME', answer: 'className', placeholder: 'JSX attr',   hint: "Not 'class' — that's a reserved JS keyword. React uses className instead." },
  { id: 'NAME',      answer: 'name',      placeholder: 'prop',       hint: 'One of the three props passed in: { name, ward, status }. Renders the patient name.' },
];

export default function Level3_1() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage3Shell levelId={1} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l31-container">

          <div className="l31-brief">
            <div className="l31-tag">// Mission Brief</div>
            <h2>Build a <span style={{ color: selectedDomain?.color }}>PatientCard</span> component.</h2>
            <p>
              Fill in the 5 blanks. Each blank is one piece of React component anatomy.
              Read the comments — they trace exactly what each line does and why.
            </p>
            <div className="l31-anatomy">
              <div className="l31-anatomy-row"><span className="l31-part">function</span><span>declares the component</span></div>
              <div className="l31-anatomy-row"><span className="l31-part">Capital name</span><span>tells React it's a component, not an HTML tag</span></div>
              <div className="l31-anatomy-row"><span className="l31-part">props param</span><span>receives data from the parent</span></div>
              <div className="l31-anatomy-row"><span className="l31-part">return (JSX)</span><span>describes what appears on screen</span></div>
            </div>
          </div>

          <FillEditor
            template={TEMPLATE}
            blanks={BLANKS}
            onAllCorrect={() => setIsCorrect(true)}
            expectedOutput="<div class='patient-card'><h3>Alice</h3><p>Ward: 3</p><span>STABLE</span></div>"
          />

        </div>
      </LevelSupportWrapper>
    </Stage3Shell>
  );
}