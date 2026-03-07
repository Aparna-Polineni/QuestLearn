// src/screens/stage3/Level3_2.jsx
// Props — Passing Data Down — Fill mode
// Student fills in: prop destructuring, default prop, conditional JSX, prop spreading

import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage3Shell from './Stage3Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from '../stage2/FillEditor';
import './Level3_2.css';

const SUPPORT = {
  intro: {
    concept: "Props — How Components Receive Data",
    tagline: "Props are like function parameters. Parent passes them in. Child reads them. One direction only.",
    whatYouWillDo: "Fill in 5 blanks about props: destructuring, default values, conditional rendering with props, and passing props from parent to child.",
    whyItMatters: "Props are how every React app passes data around. A hospital dashboard passes patient data as props to chart components, status components, and alert components. Without understanding props you can't build anything reusable.",
  },
  hints: [
    "Props are destructured in the function signature: function Card({ name, status, priority }) — this pulls name, status, and priority out of the props object. You can also set defaults: { priority = 'NORMAL' } means priority defaults to 'NORMAL' if not passed.",
    "Conditional rendering: use a ternary or && operator inside JSX. {isUrgent ? 'RED' : 'GREEN'} renders different text based on a condition. {isUrgent && <Alert />} only renders Alert when isUrgent is true.",
    "A parent passes props by adding attributes to the component: <PatientCard name='Alice' status='CRITICAL' />. The child receives them as its first argument. Props flow DOWN — child cannot pass props back up.",
  ],
  reveal: {
    concept: "React Props — One-Way Data Flow",
    whatYouLearned: "Props are passed from parent to child as JSX attributes. The child destructures them from its first argument. Default values use = in the destructuring. Conditional rendering uses ternary (? :) or logical AND (&&). Props are read-only — a child never modifies its own props. This one-way data flow makes React apps predictable.",
    realWorldUse: "In a real hospital system: <VitalChart patientId={patient.id} showHistory={true} maxReadings={50} /> — three props control what the chart shows. The chart component doesn't know or care where those values came from. That separation of concerns is why React apps scale.",
    developerSays: "The most common prop mistake is mutating props: doing props.name = 'new value'. This silently breaks React's rendering model. If you need to change data, it must live in state — not props.",
  },
};

const TEMPLATE = `// Props let a parent pass data into a child component
// Destructure props in the function signature for cleaner code
function AlertBanner({ message, ___SEVERITY___ = 'INFO', onDismiss }) {
    //                  ↑ message is required    ↑ severity has a default value of 'INFO'
    //                                                         ↑ onDismiss is a function prop (callback)

    // Conditional className based on a prop
    // severity prop controls which CSS class is applied
    const bannerClass = \`alert-banner alert-\${___SEVERITY_LOWER___}\`;
    //                                                ↑ use the prop to build the class name

    return (
        <div className={bannerClass}>
            {/* Render the message prop */}
            <span className="alert-message">{___MESSAGE___}</span>

            {/* Conditional rendering — only show button if onDismiss was passed */}
            {/* The && operator: if left side is true, render right side */}
            {___ONDISMISS___ && (
                <button onClick={onDismiss} className="alert-dismiss">✕</button>
            )}
        </div>
    );
}

// Parent component passes props as JSX attributes
function Dashboard() {
    return (
        <div>
            {/* Pass all three props */}
            <AlertBanner
                message="Patient in Room 4 needs immediate attention"
                ___SEVERITY_ATTR___="CRITICAL"
                onDismiss={() => console.log('dismissed')}
            />
            {/* Only pass message — severity defaults to 'INFO' */}
            <AlertBanner message="Shift handover in 30 minutes" />
        </div>
    );
}`;

const BLANKS = [
  { id: 'SEVERITY',       answer: 'severity',  placeholder: 'prop name',  hint: 'The second prop after message. Has a default value of INFO.' },
  { id: 'SEVERITY_LOWER', answer: 'severity',  placeholder: 'variable',   hint: 'Use the severity prop variable to build the CSS class name.' },
  { id: 'MESSAGE',        answer: 'message',   placeholder: 'prop',       hint: 'The first destructured prop — the text to display.' },
  { id: 'ONDISMISS',      answer: 'onDismiss', placeholder: 'prop',       hint: 'The function prop. If it was passed, && renders the button. If not passed, nothing renders.' },
  { id: 'SEVERITY_ATTR',  answer: 'severity',  placeholder: 'attribute',  hint: 'JSX attribute name matching the prop the component expects.' },
];

export default function Level3_2() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage3Shell levelId={2} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l32-container">

          <div className="l32-brief">
            <div className="l32-tag">// Mission Brief</div>
            <h2>Build an <span style={{ color: selectedDomain?.color }}>AlertBanner</span> that accepts props.</h2>
            <p>Fill in 5 blanks about props: receiving them, defaulting them, rendering conditionally, and passing them from parent.</p>
            <div className="l32-rules">
              <div className="l32-rule"><span className="l32-rule-key">Props flow</span><span>Parent → Child only. Never the other way.</span></div>
              <div className="l32-rule"><span className="l32-rule-key">Default value</span><span>{'{ propName = \'default\' } in destructuring'}</span></div>
              <div className="l32-rule"><span className="l32-rule-key">Conditional</span><span>{'{ prop && <Element /> } renders only when prop is truthy'}</span></div>
              <div className="l32-rule"><span className="l32-rule-key">Read-only</span><span>Never assign to a prop — mutating props breaks React</span></div>
            </div>
          </div>

          <FillEditor
            template={TEMPLATE}
            blanks={BLANKS}
            onAllCorrect={() => setIsCorrect(true)}
            expectedOutput="AlertBanner renders with severity class + dismiss button when onDismiss is passed"
          />

        </div>
      </LevelSupportWrapper>
    </Stage3Shell>
  );
}