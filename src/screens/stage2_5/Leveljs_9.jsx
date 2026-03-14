// LevelJS_9.jsx — Objects Deep Dive (BUILD)
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2_5Shell from './Stage2_5Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import JsEditor from './JsEditor';
import './LevelJS_9.css';

const SUPPORT = {
  intro:{concept:'Objects Deep Dive',tagline:"Object.keys, entries, assign — and nested objects. API responses are always nested.",whatYouWillDo:"Use Object.keys() and Object.entries() to iterate an object, merge objects with Object.assign(), and navigate nested data.",whyItMatters:"Real API responses are deeply nested objects. Iterating over dynamic keys with Object.entries() is how you build generic UI components that work with any data shape."},
  hints:["Object.keys(obj) returns an array of key names. Object.values(obj) returns values. Object.entries(obj) returns [[key,val], [key,val], ...] — destructure each pair in a for...of.","Object.assign(target, source) copies source properties into target — mutates target! To avoid mutation: const merged = Object.assign({}, obj1, obj2);. Or use spread: const merged = { ...obj1, ...obj2 };","Nested access: patient.address.city — but use optional chaining if the nested object might not exist: patient?.address?.city ?? 'Unknown'."],
  reveal:{concept:'Object.keys, entries, assign & Nesting',whatYouLearned:"Object.keys(obj): array of key strings. Object.values(obj): array of values. Object.entries(obj): array of [key,val] pairs. Object.assign(target, src): mutates target. Spread is preferred for immutable merge. Nested objects: chain dots or bracket notation. hasOwnProperty vs 'in' operator.",realWorldUse:"Building a generic detail panel: Object.entries(record).map(([key, val]) => <Row key={key} label={key} value={val} />). Merging form state: setForm(prev => Object.assign({}, prev, { email })) or setForm(prev => ({ ...prev, email })).",developerSays:"I reach for Object.entries() whenever I have dynamic data from an API and I want to render every field without knowing the keys in advance. It is the escape hatch when you cannot destructure because the shape is unknown."},
};

const LOCKED = `const patient = {
  id: "P001",
  name: "Alice Smith",
  age: 34,
  ward: "Cardiology",
  address: {
    city: "London",
    postcode: "EC1A 1BB"
  }
};`;

const INITIAL = `const patient = {
  id: "P001",
  name: "Alice Smith",
  age: 34,
  ward: "Cardiology",
  address: {
    city: "London",
    postcode: "EC1A 1BB"
  }
};

// ── TASK 1: Object.keys and Object.values ─────────────────────
// Print: "Keys: id,name,age,ward,address"
// Print: "Value count: 5"

// TODO

// ── TASK 2: Object.entries loop ──────────────────────────────
// Loop with Object.entries(patient)
// For keys: id, name, age, ward — print "key: value"
// Skip the 'address' key (use an if to check key !== 'address')

// TODO

// ── TASK 3: Nested access ─────────────────────────────────────
// Print: "City: London"
// Print: "Postcode: EC1A 1BB"

// TODO

// ── TASK 4: Merge two objects ─────────────────────────────────
const updates = { age: 35, ward: "Neurology" };
// Merge patient and updates using spread (patient first, updates second)
// Print: "New ward: Neurology"
// Print: "Original ward: Cardiology"

// TODO`;

const EXPECTED = `Keys: id,name,age,ward,address\nValue count: 5\nid: P001\nname: Alice Smith\nage: 34\nward: Cardiology\nCity: London\nPostcode: EC1A 1BB\nNew ward: Neurology\nOriginal ward: Cardiology`;

export default function LevelJS_9() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);
  return (
    <Stage2_5Shell levelId={9} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div className="ljs9-container">
          <div className="ljs9-brief">
            <div className="ljs9-brief-tag">// Build Mission — Objects Deep Dive</div>
            <h2>Navigate and transform patient records for your <span style={{color:selectedDomain?.color}}>{selectedDomain?.name||'system'}</span>.</h2>
            <p>Four tasks. The patient and updates objects are given. Write only in the <code>// TODO</code> lines.</p>
            <div className="ljs9-expected-box">
              <div className="ljs9-expected-label">Expected output</div>
              <pre className="ljs9-expected-output">{EXPECTED}</pre>
            </div>
          </div>

          <div className="ljs9-anatomy">
            <div className="ljs9-anat-header">// Object static methods reference</div>
            <div className="ljs9-method-grid">
              {[
                {sig:'Object.keys(obj)',    ret:'string[]',    note:'array of key names'},
                {sig:'Object.values(obj)',  ret:'any[]',       note:'array of values'},
                {sig:'Object.entries(obj)', ret:'[key,val][]', note:'array of [key, value] pairs — destructure in for...of'},
                {sig:'Object.assign({}, a, b)', ret:'object', note:'merge b into a copy — later keys win. Prefer spread.'},
                {sig:'Object.freeze(obj)', ret:'obj',          note:'prevents any mutation — useful for constants'},
              ].map(r => (
                <div key={r.sig} className="ljs9-method-row">
                  <code className="ljs9-msig">{r.sig}</code>
                  <span className="ljs9-mret">→ {r.ret}</span>
                  <span className="ljs9-mnote">{r.note}</span>
                </div>
              ))}
            </div>

            <div className="ljs9-anat-header" style={{marginTop:18}}>// Object.entries — the most useful loop pattern</div>
            <pre className="ljs9-code-block">{`// Destructure [key, value] in the loop:
for (const [key, value] of Object.entries(patient)) {
  if (key === 'address') continue; // skip nested
  console.log(\`\${key}: \${value}\`);
}
// id: P001
// name: Alice Smith
// age: 34
// ward: Cardiology`}</pre>

            <div className="ljs9-anat-header" style={{marginTop:18}}>// Nested object access — with and without safety</div>
            <div className="ljs9-compare">
              <div className="ljs9-col unsafe-col">
                <div className="ljs9-col-title" style={{color:'#f87171'}}>✗ Unsafe</div>
                <pre className="ljs9-code-block">{`patient.address.city
// Works now, but throws if
// address is null or undefined`}</pre>
              </div>
              <div className="ljs9-col safe-col">
                <div className="ljs9-col-title" style={{color:'#4ade80'}}>✓ Safe</div>
                <pre className="ljs9-code-block">{`patient?.address?.city ?? "Unknown"
// Returns "Unknown" if address
// is null or undefined — never throws`}</pre>
              </div>
            </div>
          </div>

          <JsEditor lockedCode={LOCKED}
            initialCode={INITIAL} expectedOutput={EXPECTED} onOutputChange={(_,c)=>setOk(c)} height={320} />
        </div>
      </LevelSupportWrapper>
    </Stage2_5Shell>
  );
}
