// src/screens/stage3/Level3_6.jsx
// useEffect — Side Effects — Fill mode
// Student fills: useEffect, dependency array, cleanup function, fetch inside effect

import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage3Shell from './Stage3Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from '../stage2/FillEditor';
import './Level3_6.css';

const SUPPORT = {
  intro: {
    concept: "useEffect — Running Code Outside the Render",
    tagline: "useEffect runs your code AFTER React renders. It's how you fetch data, set up subscriptions, and interact with the browser.",
    whatYouWillDo: "Fill in 5 blanks: importing useEffect, writing the effect function, the dependency array, a cleanup function, and the fetch API call.",
    whyItMatters: "Every time your React app loads data from a server, it uses useEffect. Real-time updates, timers, analytics events, localStorage sync — all side effects. Without useEffect you can't connect React to the outside world.",
  },
  hints: [
    "useEffect(fn, deps). The first argument is the function to run. The second argument is the dependency array — an array of values that, when changed, re-run the effect. An empty array [] means run once on mount.",
    "Fetching data: fetch the URL inside useEffect, convert the response to JSON with .json(), then call setState with the result. Always handle errors with .catch() or try/catch.",
    "Cleanup: return a function from useEffect to clean up — cancel subscriptions, clear timers, abort fetch requests. React calls this before re-running the effect or when the component unmounts.",
  ],
  reveal: {
    concept: "useEffect — The Side Effect Hook",
    whatYouLearned: "useEffect(fn, deps) runs fn after every render where deps changed. Empty array = run once. Omit array = run every render. Return a cleanup function to cancel subscriptions or timers. Fetch data inside useEffect — never at the top level of the component function.",
    realWorldUse: "In a patient monitor: useEffect fetches vitals on mount, then sets up a 5-second polling interval. The cleanup function clears the interval when the component unmounts (patient is deselected). Without cleanup, the interval keeps firing even after the component is gone — a memory leak.",
    developerSays: "The dependency array is the source of most useEffect bugs. Missing a dependency causes stale data. Including too many causes unnecessary re-fetches. React's ESLint plugin warns you about missing deps — always fix those warnings.",
  },
};

const TEMPLATE = `import { useState, ___USE_EFFECT___ } from 'react';

function PatientVitals({ patientId }) {

    const [vitals,  setVitals]  = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);

    // useEffect runs AFTER React renders
    // First arg: the function to run (the effect)
    // Second arg: the dependency array — re-run when these values change
    ___EFFECT___(async () => {
        setLoading(true);
        setError(null);

        try {
            // fetch() makes an HTTP request — this is a browser API, not React
            const response = await ___FETCH___(\`/api/patients/\${patientId}/vitals\`);

            if (!response.ok) {
                throw new Error(\`Server error: \${response.status}\`);
            }

            const data = await response.json();
            setVitals(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }

        // Cleanup function — returned from the effect
        // React calls this when patientId changes (before re-running) or on unmount
        ___RETURN_CLEANUP___() => {
            // In a real app: abort the fetch, cancel subscriptions, clear timers
            console.log('Cleaning up vitals fetch for patient', patientId);
        };

    // Dependency array: re-run this effect whenever patientId changes
    }, [___PATIENT_ID___]);

    if (loading) return <div className="loading">Loading vitals...</div>;
    if (error)   return <div className="error">Error: {error}</div>;
    if (!vitals) return null;

    return (
        <div className="vitals-panel">
            <h3>Vitals — Patient {patientId}</h3>
            <p>Heart Rate: {vitals.heartRate} bpm</p>
            <p>Blood Pressure: {vitals.systolic}/{vitals.diastolic}</p>
            <p>Temperature: {vitals.temperature}°C</p>
        </div>
    );
}`;

const BLANKS = [
  { id: 'USE_EFFECT',      answer: 'useEffect',  placeholder: 'hook name',  hint: 'The React hook for side effects. Import it alongside useState.' },
  { id: 'EFFECT',          answer: 'useEffect',  placeholder: 'hook call',  hint: 'Call the hook with two arguments: the effect function and the dependency array.' },
  { id: 'FETCH',           answer: 'fetch',      placeholder: 'browser API',hint: 'Browser built-in for HTTP requests. Returns a Promise that resolves to a Response object.' },
  { id: 'RETURN_CLEANUP',  answer: 'return (',   placeholder: 'return',     hint: 'Return a function from useEffect for cleanup. React calls it before re-running or unmounting.' },
  { id: 'PATIENT_ID',      answer: 'patientId',  placeholder: 'dependency', hint: 'The prop that the effect depends on. Re-run the effect when this changes.' },
];

export default function Level3_6() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage3Shell levelId={6} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l36-container">

          <div className="l36-brief">
            <div className="l36-tag">// Mission Brief</div>
            <h2>Fetch vitals with <span style={{ color: selectedDomain?.color }}>useEffect</span>.</h2>
            <p>Fill in 5 blanks. Connect a component to your backend by fetching data inside useEffect with proper cleanup.</p>
            <div className="l36-lifecycle">
              <div className="l36-step">Component mounts</div>
              <div className="l36-step-arrow">→</div>
              <div className="l36-step">useEffect runs</div>
              <div className="l36-step-arrow">→</div>
              <div className="l36-step">fetch() called</div>
              <div className="l36-step-arrow">→</div>
              <div className="l36-step">setState(data)</div>
              <div className="l36-step-arrow">→</div>
              <div className="l36-step">re-render with data</div>
            </div>
          </div>

          <FillEditor
            template={TEMPLATE}
            blanks={BLANKS}
            onAllCorrect={() => setIsCorrect(true)}
            expectedOutput="Component fetches vitals on mount and when patientId changes, shows loading/error/data states"
          />

        </div>
      </LevelSupportWrapper>
    </Stage3Shell>
  );
}