// LevelJS_5.jsx — Objects
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2_5Shell from './Stage2_5Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import JsEditor from './JsEditor';
import './LevelJS_5.css';

const SUPPORT = {
  intro:{concept:'Objects',tagline:"Objects are key-value pairs. They model real-world entities — patients, users, records.",whatYouWillDo:"Create a patient object, access its properties with dot notation, add new properties, and call a method defined on the object.",whyItMatters:"Every React component receives props as an object. Every API response is a JSON object. Every piece of state is usually an object. Objects are the primary data structure in JavaScript."},
  hints:["Create: const patient = { name: 'Alice', ward: 'Cardiology', age: 34 }; — curly braces, key: value pairs, comma-separated.","Dot notation: patient.name gives 'Alice'. Bracket notation: patient['ward'] gives 'Cardiology'. Use dot normally, bracket when the key is a variable.","Add a property: patient.isActive = true; — works even though patient is const (const prevents reassigning the variable, not mutating the object). Add a method: patient.greet = function() { return 'Hi, I am ' + this.name; };"],
  reveal:{concept:'Objects, Dot Notation & Methods',whatYouLearned:"Objects: { key: value }. Dot notation: obj.key. Bracket notation: obj['key'] or obj[varName]. Add/update: obj.newKey = value. Delete: delete obj.key. Check existence: 'key' in obj. this inside a method refers to the object. Object.keys() returns array of keys.",realWorldUse:"Every React prop is an object property: <Card name={patient.name} ward={patient.ward} />. Every API response: const data = await response.json(); data.patients[0].name. Every useState with multiple fields: const [form, setForm] = useState({ name: '', ward: '' });",developerSays:"Prefer dot notation over bracket notation unless you have a dynamic key. And never use 'var obj = new Object()' — always use the literal {}."},
};

const INITIAL = `// ── TASK 1: Create and access an object ─────────────────────
// Create a const 'patient' with: name, ward, age, isActive
// name: "Alice Smith", ward: "Cardiology", age: 34, isActive: true
// Print: "Name: Alice Smith"
// Print: "Ward: Cardiology"
// Print: "Active: true"

// TODO

// ── TASK 2: Add a method and call it ─────────────────────────
// Add a method called 'summary' to the patient object
// It returns: "Alice Smith (34) — Cardiology"
// Print the result of calling patient.summary()

// TODO

// ── TASK 3: Object with bracket notation ─────────────────────
// Create array 'keys' = ["name", "ward", "age"]
// Loop with for...of, use bracket notation to print each value
// Expected: "name: Alice Smith"  "ward: Cardiology"  "age: 34"

// TODO`;

const EXPECTED = `Name: Alice Smith\nWard: Cardiology\nActive: true\nAlice Smith (34) — Cardiology\nname: Alice Smith\nward: Cardiology\nage: 34`;

export default function LevelJS_5() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);
  return (
    <Stage2_5Shell levelId={5} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div className="ljs5-container">
          <div className="ljs5-brief">
            <div className="ljs5-brief-tag">// Build Mission</div>
            <h2>Model a patient record as an object for your <span style={{color:selectedDomain?.color}}>{selectedDomain?.name||'system'}</span>.</h2>
            <p>Three tasks. Write only in the <code>// TODO</code> lines.</p>
            <div className="ljs5-expected-box">
              <div className="ljs5-expected-label">Expected output</div>
              <pre className="ljs5-expected-output">{EXPECTED}</pre>
            </div>
          </div>

          <div className="ljs5-anatomy">
            <div className="ljs5-anat-header">// Object anatomy</div>
            <div className="ljs5-obj-diagram">
              <div className="ljs5-obj-line"><span className="ljs5-tok-kw">const </span><span className="ljs5-tok-name">patient</span><span className="ljs5-tok-plain"> = {'{'}</span></div>
              {[
                {k:'name',     v:'"Alice Smith"', c:'// string property'},
                {k:'ward',     v:'"Cardiology"',  c:'// string property'},
                {k:'age',      v:'34',            c:'// number property'},
                {k:'isActive', v:'true',          c:'// boolean property'},
                {k:'summary',  v:'function() { return this.name; }', c:'// method — uses this'},
              ].map(r => (
                <div key={r.k} className="ljs5-obj-prop">
                  <span className="ljs5-tok-key">{r.k}</span>
                  <span className="ljs5-tok-plain">: </span>
                  <span className="ljs5-tok-val">{r.v}</span>
                  <span className="ljs5-tok-plain">,</span>
                  <span className="ljs5-tok-comment"> {r.c}</span>
                </div>
              ))}
              <div className="ljs5-obj-line">{'};'}</div>
            </div>

            <div className="ljs5-anat-header" style={{marginTop:18}}>// Dot vs bracket notation</div>
            <div className="ljs5-method-grid">
              {[
                {sig:'patient.name',       ret:'"Alice Smith"', note:'dot notation — use for known key names'},
                {sig:'patient["ward"]',    ret:'"Cardiology"',  note:'bracket notation with string — same result'},
                {sig:'const k = "age"; patient[k]', ret:'34', note:'bracket with variable — only way to use dynamic keys'},
                {sig:'"name" in patient',  ret:'true',          note:'check if key exists — more reliable than patient.name !== undefined'},
                {sig:'Object.keys(patient)',ret:'["name","ward",...]', note:'array of all key names'},
              ].map(r => (
                <div key={r.sig} className="ljs5-method-row">
                  <code className="ljs5-msig">{r.sig}</code>
                  <span className="ljs5-mret">→ {r.ret}</span>
                  <span className="ljs5-mnote">{r.note}</span>
                </div>
              ))}
            </div>

            <div className="ljs5-mistake">
              <div className="ljs5-mistake-label">⚠ const does NOT prevent mutation — only reassignment</div>
              <div className="ljs5-mrows">
                <div className="ljs5-mrow bad"><span className="ljs5-mtag bad-tag">✗ Wrong idea</span><code>const patient = {'{}'}; patient = {'{ name:"Bob" }'};</code><span className="ljs5-mnote">TypeError — cannot reassign a const</span></div>
                <div className="ljs5-mrow good"><span className="ljs5-mtag good-tag">✓ This IS legal</span><code>const patient = {'{}'}; patient.name = "Bob";</code><span className="ljs5-mnote">mutating the object is fine — const only locks the variable binding</span></div>
              </div>
            </div>
          </div>

          <JsEditor initialCode={INITIAL} expectedOutput={EXPECTED} onOutputChange={(_,c)=>setOk(c)} height={290} />
        </div>
      </LevelSupportWrapper>
    </Stage2_5Shell>
  );
}