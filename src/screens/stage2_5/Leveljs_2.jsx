// src/screens/stage2_5/LevelJS_2.jsx — Functions
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2_5Shell from './Stage2_5Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import JsEditor from './JsEditor';
import './LevelJS_2.css';

const SUPPORT = {
  intro: {
    concept:'Functions',
    tagline:"Functions are reusable blocks of logic. In JS, functions are first-class — you can pass them around like values.",
    whatYouWillDo:"Write two functions — one that formats a patient name and one that calculates a risk score.",
    whyItMatters:"Every React component IS a function. Every event handler is a function. Every API call wrapper is a function. JavaScript functions are the foundation of all React code.",
  },
  hints:[
    "function greet(name) { return 'Hello ' + name; } — parameters inside (), body inside {}, use return to send back a value. Call it: greet('Alice').",
    "Functions can have multiple parameters: function add(a, b) { return a + b; }. If you forget return, the function returns undefined.",
    "You can store a function in a variable: const greet = function(name) { return 'Hello ' + name; }. This is a function expression — works the same as a function declaration but is not hoisted.",
  ],
  reveal:{
    concept:'Functions & First-Class Functions',
    whatYouLearned:"function keyword creates a named function. Parameters are inputs, return sends output. Forgetting return gives undefined. Functions are first-class — storable in variables, passable as arguments. This enables callbacks, event handlers, and React's entire component model.",
    realWorldUse:"Every React component: function PatientCard({ name }) { return <div>{name}</div>; }. Every handler: function handleClick() { setCount(c => c+1); }. Every utility: function formatDate(date) { return new Date(date).toLocaleDateString(); }.",
    developerSays:"Always give functions verb names — formatPatient(), fetchRecords(), handleSubmit(). A function name should tell you exactly what it does. If you cannot name it in one verb phrase, it is doing too many things — split it.",
  },
};

const INITIAL = `// ── TASK 1: Format a patient name ──────────────────────────
// Write a function called 'formatPatient'
// It takes two params: firstName, lastName
// Returns the string: "LastName, FirstName"
// Then call it with "Alice", "Smith" and print the result

// TODO: function formatPatient(firstName, lastName) { ... }
// TODO: console.log(formatPatient("Alice", "Smith"))

// ── TASK 2: Risk score ───────────────────────────────────────
// Write a function called 'riskScore'
// It takes: age (number), hasDiabetes (boolean)
// Returns age + (hasDiabetes ? 20 : 0)
// Print riskScore(45, true) and riskScore(30, false)

// TODO: function riskScore(age, hasDiabetes) { ... }
// TODO: console.log(riskScore(45, true))
// TODO: console.log(riskScore(30, false))`;

const EXPECTED = `Smith, Alice\n65\n30`;

export default function LevelJS_2() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);
  return (
    <Stage2_5Shell levelId={2} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div className="ljs2-container">
          <div className="ljs2-brief">
            <div className="ljs2-brief-tag">// Build Mission</div>
            <h2>Write utility functions for your <span style={{color:selectedDomain?.color}}>{selectedDomain?.name||'system'}</span>.</h2>
            <p>Two tasks. Write only in the <code>// TODO</code> lines.</p>
            <div className="ljs2-expected-box">
              <div className="ljs2-expected-label">Expected output</div>
              <pre className="ljs2-expected-output">{EXPECTED}</pre>
            </div>
          </div>

          <div className="ljs2-anatomy">
            <div className="ljs2-anat-header">// Function anatomy</div>
            <div className="ljs2-anatomy-diagram">
              <div className="ljs2-diag-row">
                <span className="ljs2-tok-kw">function </span>
                <span className="ljs2-tok-name">formatPatient</span>
                <span className="ljs2-tok-plain">(</span>
                <span className="ljs2-tok-param">firstName</span>
                <span className="ljs2-tok-plain">, </span>
                <span className="ljs2-tok-param">lastName</span>
                <span className="ljs2-tok-plain">) {'{'}</span>
              </div>
              <div className="ljs2-diag-row ljs2-indent">
                <span className="ljs2-tok-kw">return </span>
                <span className="ljs2-tok-string">`$&#123;lastName&#125;, $&#123;firstName&#125;`</span>
                <span className="ljs2-tok-plain">;</span>
                <span className="ljs2-tok-comment">  // ← return sends value back to caller</span>
              </div>
              <div className="ljs2-diag-row">{'}'}</div>
              <div className="ljs2-diag-labels">
                <span className="ljs2-dlabel kw-label">keyword</span>
                <span className="ljs2-dlabel name-label">name</span>
                <span className="ljs2-dlabel param-label">parameters (inputs)</span>
                <span className="ljs2-dlabel body-label">body + return</span>
              </div>
            </div>

            <div className="ljs2-anat-header" style={{marginTop:18}}>// Ternary operator — compact if/else in one line</div>
            <div className="ljs2-method-grid">
              {[
                {sig:'condition ? valueIfTrue : valueIfFalse', note:'same as: if(condition) { return trueVal } else { return falseVal }'},
                {sig:'hasDiabetes ? 20 : 0',                  note:'if hasDiabetes is true → 20, otherwise → 0'},
                {sig:'age >= 18 ? "adult" : "minor"',          note:'returns "adult" or "minor" depending on age'},
              ].map(r => (
                <div key={r.sig} className="ljs2-method-row">
                  <code className="ljs2-msig">{r.sig}</code>
                  <span className="ljs2-mnote">{r.note}</span>
                </div>
              ))}
            </div>

            <div className="ljs2-mistake">
              <div className="ljs2-mistake-label">⚠ Forgetting return gives undefined</div>
              <div className="ljs2-mrows">
                <div className="ljs2-mrow bad"><span className="ljs2-mtag bad-tag">✗</span><code>{'function add(a,b) { a + b; }'}</code><span className="ljs2-mnote">no return — function returns undefined</span></div>
                <div className="ljs2-mrow good"><span className="ljs2-mtag good-tag">✓</span><code>{'function add(a,b) { return a + b; }'}</code><span className="ljs2-mnote">returns the sum</span></div>
              </div>
            </div>
          </div>

          <JsEditor initialCode={INITIAL} expectedOutput={EXPECTED} onOutputChange={(_,c)=>setOk(c)} height={270} />
        </div>
      </LevelSupportWrapper>
    </Stage2_5Shell>
  );
}