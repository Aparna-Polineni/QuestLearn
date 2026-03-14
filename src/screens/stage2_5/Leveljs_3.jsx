// src/screens/stage2_5/LevelJS_3.jsx — Arrow Functions
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2_5Shell from './Stage2_5Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import JsEditor from './JsEditor';
import './LevelJS_3.css';

const SUPPORT = {
  intro:{concept:'Arrow Functions',tagline:"Arrow functions are shorter syntax for functions. React uses them everywhere.",whatYouWillDo:"Convert regular functions to arrow functions and use implicit return for one-liners.",whyItMatters:"Every React event handler, every .map() callback, every useEffect callback is an arrow function. You must be able to read and write them instantly."},
  hints:["Arrow function: const greet = (name) => { return 'Hello ' + name; }. For single-expression bodies, drop the braces and return: const greet = (name) => 'Hello ' + name;","For a single parameter, you can drop the parentheses: name => name.toUpperCase(). For zero or multiple params, parentheses are required: () => 42 or (a,b) => a+b.","Arrow functions capture the surrounding 'this' — unlike regular functions which create their own 'this'. This makes them safe for event handlers in React components."],
  reveal:{concept:'Arrow Functions & Implicit Return',whatYouLearned:"const fn = (params) => expression — implicit return, no braces needed. const fn = (params) => { statements; return value; } — explicit return needed when body has multiple lines. Single param: no parens needed. No params: () => required. Arrows do not have their own 'this' — they inherit from enclosing scope.",realWorldUse:"React component: const PatientCard = ({ name }) => <div>{name}</div>. Event handler: const handleClick = () => setCount(c => c + 1). Array method: patients.map(p => p.name). You will write these dozens of times per day.",developerSays:"I use arrow functions for everything except when I need 'this' to refer to the function itself — which is almost never in React. The implicit return is the biggest win: patients.map(p => p.name) vs patients.map(function(p) { return p.name; })."},
};

const INITIAL = `// ── TASK 1: Convert to arrow function ───────────────────────
// Rewrite the function below as an arrow function
// using IMPLICIT RETURN (no braces, no return keyword)
// const formatWard = ...
// Should still print: "Ward: Cardiology"

// Original (for reference — do not use this):
// function formatWard(ward) { return "Ward: " + ward; }

// TODO: const formatWard = ...
// TODO: console.log(formatWard("Cardiology"))

// ── TASK 2: Arrow with two params ────────────────────────────
// Write an arrow function called 'fullName'
// Takes: first, last
// Returns: first + " " + last (implicit return)
// Print: fullName("Alice", "Smith")

// TODO: const fullName = ...
// TODO: console.log(fullName("Alice", "Smith"))

// ── TASK 3: No-param arrow ───────────────────────────────────
// Write an arrow called 'getTimestamp'
// Returns the string "2024-01-15" (hardcoded is fine)
// Print its result

// TODO: const getTimestamp = () => ...
// TODO: console.log(getTimestamp())`;

const EXPECTED = `Ward: Cardiology\nAlice Smith\n2024-01-15`;

export default function LevelJS_3() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);
  return (
    <Stage2_5Shell levelId={3} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div className="ljs3-container">
          <div className="ljs3-brief">
            <div className="ljs3-brief-tag">// Build Mission</div>
            <h2>Rewrite with arrow functions for your <span style={{color:selectedDomain?.color}}>{selectedDomain?.name||'system'}</span>.</h2>
            <p>Three tasks. Write only in the <code>// TODO</code> lines.</p>
            <div className="ljs3-expected-box">
              <div className="ljs3-expected-label">Expected output</div>
              <pre className="ljs3-expected-output">{EXPECTED}</pre>
            </div>
          </div>

          <div className="ljs3-anatomy">
            <div className="ljs3-anat-header">// Arrow function — all four forms</div>
            <div className="ljs3-method-grid">
              {[
                {sig:'const fn = (a, b) => { return a + b; }',  note:'multi-line body — explicit return required'},
                {sig:'const fn = (a, b) => a + b',              note:'single expression — implicit return, no braces'},
                {sig:'const fn = name => name.toUpperCase()',    note:'single param — parentheses optional'},
                {sig:'const fn = () => "hello"',                note:'no params — empty parentheses required'},
                {sig:'const fn = () => ({ id: 1, name: "x" })', note:'returning an object — wrap in parentheses!'},
              ].map(r => (
                <div key={r.sig} className="ljs3-method-row">
                  <code className="ljs3-msig">{r.sig}</code>
                  <span className="ljs3-mnote">{r.note}</span>
                </div>
              ))}
            </div>

            <div className="ljs3-anat-header" style={{marginTop:18}}>// Regular function vs Arrow function</div>
            <div className="ljs3-compare">
              <div className="ljs3-col reg-col">
                <div className="ljs3-col-title">Regular function</div>
                <pre className="ljs3-code-block">{`function formatWard(ward) {
  return "Ward: " + ward;
}`}</pre>
                <div className="ljs3-col-note">Hoisted — can be called before it's declared in the file</div>
              </div>
              <div className="ljs3-col arrow-col">
                <div className="ljs3-col-title">Arrow function (implicit return)</div>
                <pre className="ljs3-code-block">{`const formatWard = ward =>
  "Ward: " + ward;`}</pre>
                <div className="ljs3-col-note">Not hoisted — must be declared before use. Preferred in React.</div>
              </div>
            </div>

            <div className="ljs3-mistake">
              <div className="ljs3-mistake-label">⚠ Returning an object — must wrap in parentheses</div>
              <div className="ljs3-mrows">
                <div className="ljs3-mrow bad"><span className="ljs3-mtag bad-tag">✗</span><code>{'const p = id => { id: id }'}</code><span className="ljs3-mnote">JS treats {} as a code block, not an object — returns undefined</span></div>
                <div className="ljs3-mrow good"><span className="ljs3-mtag good-tag">✓</span><code>{'const p = id => ({ id: id })'}</code><span className="ljs3-mnote">extra () tells JS this is an object expression</span></div>
              </div>
            </div>
          </div>

          <JsEditor initialCode={INITIAL} expectedOutput={EXPECTED} onOutputChange={(_,c)=>setOk(c)} height={280} />
        </div>
      </LevelSupportWrapper>
    </Stage2_5Shell>
  );
}
