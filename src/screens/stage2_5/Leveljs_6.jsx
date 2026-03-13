// LevelJS_6.jsx — Destructuring & Spread
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2_5Shell from './Stage2_5Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import JsEditor from './JsEditor';
import './LevelJS_6.css';

const SUPPORT = {
  intro:{concept:'Destructuring & Spread',tagline:"Destructuring unpacks values. Spread copies and merges. Both are essential React syntax.",whatYouWillDo:"Destructure an object and array, use rest to collect remaining items, and spread to copy/merge objects.",whyItMatters:"React props are destructured in every component: function Card({ name, ward }) {...}. State updates use spread: setPatient({ ...patient, age: 35 }). You cannot write React without these."},
  hints:["Object destructuring: const { name, ward } = patient; — pulls out name and ward as variables. Rename: const { name: patientName } = patient; — pulls name but calls it patientName.","Array destructuring: const [first, second] = arr; — pulls by position. Skip elements: const [first, , third] = arr; — the gap skips index 1.","Spread: const copy = { ...patient }; — shallow copy. Merge: const updated = { ...patient, age: 35 }; — copies all fields, then overrides age."],
  reveal:{concept:'Destructuring, Spread & Rest',whatYouLearned:"Object destructuring: const { a, b } = obj. Array destructuring: const [x, y] = arr. Default values: const { name = 'Unknown' } = obj. Rest: const { a, ...rest } = obj — rest gets everything except a. Spread: { ...obj } copies, { ...obj, key: val } copies and overrides.",realWorldUse:"Every React component: function Card({ name, ward, age }) { return ... }. Every state update: setForm(prev => ({ ...prev, email: newEmail })). Every API response merge. Destructuring and spread are the #1 ES6 features used in React.",developerSays:"The spread pattern for state updates is critical — never mutate state directly. setPatient({ ...patient, age: 35 }) creates a brand-new object, which React detects as a change. patient.age = 35 mutates in place — React won't re-render."},
};

const INITIAL = `// ── TASK 1: Object destructuring ────────────────────────────
// Given this patient object:
const patient = { name: "Alice Smith", ward: "Cardiology", age: 34, id: "P001" };

// Destructure name, ward, age from patient (one line)
// Print: "Alice Smith — Cardiology — 34"

// TODO: const { ... } = patient;
// TODO: console.log(...)

// ── TASK 2: Array destructuring ──────────────────────────────
const topWards = ["Cardiology", "Oncology", "Neurology", "Paediatrics"];

// Destructure first two wards, collect rest in 'others'
// Print: "Top: Cardiology, Oncology"
// Print: "Others: Neurology,Paediatrics"

// TODO: const [first, second, ...others] = topWards;
// TODO: console.log(...)

// ── TASK 3: Spread to update ─────────────────────────────────
// Create 'updatedPatient' by spreading patient and overriding age to 35
// Print: "Updated age: 35"
// Print: "Original age: 34"  (original must NOT change)

// TODO: const updatedPatient = { ...patient, age: 35 };
// TODO: console.log(...)`;

const EXPECTED = `Alice Smith — Cardiology — 34\nTop: Cardiology, Oncology\nOthers: Neurology,Paediatrics\nUpdated age: 35\nOriginal age: 34`;

export default function LevelJS_6() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);
  return (
    <Stage2_5Shell levelId={6} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div className="ljs6-container">
          <div className="ljs6-brief">
            <div className="ljs6-brief-tag">// Build Mission</div>
            <h2>Destructure and spread patient data for your <span style={{color:selectedDomain?.color}}>{selectedDomain?.name||'system'}</span>.</h2>
            <p>Three tasks. The patient and wards variables are given. Write only in the <code>// TODO</code> lines.</p>
            <div className="ljs6-expected-box">
              <div className="ljs6-expected-label">Expected output</div>
              <pre className="ljs6-expected-output">{EXPECTED}</pre>
            </div>
          </div>

          <div className="ljs6-anatomy">
            <div className="ljs6-anat-header">// Destructuring — object and array</div>
            <div className="ljs6-compare">
              <div className="ljs6-col obj-col">
                <div className="ljs6-col-title">Object destructuring</div>
                <pre className="ljs6-code-block">{`const { name, ward } = patient;
// name = "Alice Smith"
// ward = "Cardiology"

// Rename while destructuring:
const { name: patientName } = patient;

// Default value:
const { status = "active" } = patient;

// Rest — collect the rest:
const { name: n, ...rest } = patient;
// rest = { ward, age, id }`}</pre>
              </div>
              <div className="ljs6-col arr-col">
                <div className="ljs6-col-title">Array destructuring</div>
                <pre className="ljs6-code-block">{`const [first, second] = wards;
// first = "Cardiology"
// second = "Oncology"

// Skip elements:
const [a, , c] = wards;
// a = "Cardiology", c = "Neurology"

// Rest — collect remaining:
const [top, ...others] = wards;
// others = ["Oncology","Neurology","Paediatrics"]`}</pre>
              </div>
            </div>

            <div className="ljs6-anat-header" style={{marginTop:18}}>// Spread — copy and merge</div>
            <div className="ljs6-method-grid">
              {[
                {sig:'const copy = { ...patient }',                note:'shallow copy — new object, same values'},
                {sig:'const updated = { ...patient, age: 35 }',    note:'copy all fields, then override age — original unchanged'},
                {sig:'const merged = { ...defaults, ...override }',note:'later keys win — override overwrites defaults'},
                {sig:'const newArr = [...wards, "Radiology"]',      note:'spread array + add new item at end'},
                {sig:'const combined = [...arr1, ...arr2]',         note:'concatenate two arrays without mutating either'},
              ].map(r => (
                <div key={r.sig} className="ljs6-method-row">
                  <code className="ljs6-msig">{r.sig}</code>
                  <span className="ljs6-mnote">{r.note}</span>
                </div>
              ))}
            </div>

            <div className="ljs6-mistake">
              <div className="ljs6-mistake-label">⚠ Spread is SHALLOW — nested objects are still shared</div>
              <div className="ljs6-mrows">
                <div className="ljs6-mrow bad"><span className="ljs6-mtag bad-tag">⚠ Careful</span><code>{'const copy = { ...patient }; copy.address.city = "London";'}</code><span className="ljs6-mnote">patient.address.city also changes — nested object is the same reference</span></div>
                <div className="ljs6-mrow good"><span className="ljs6-mtag good-tag">✓ Deep copy</span><code>const copy = JSON.parse(JSON.stringify(patient));</code><span className="ljs6-mnote">fully independent copy — use when nesting matters</span></div>
              </div>
            </div>
          </div>

          <JsEditor initialCode={INITIAL} expectedOutput={EXPECTED} onOutputChange={(_,c)=>setOk(c)} height={310} />
        </div>
      </LevelSupportWrapper>
    </Stage2_5Shell>
  );
}