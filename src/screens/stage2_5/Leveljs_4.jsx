// LevelJS_4.jsx — Arrays & Basic Methods
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2_5Shell from './Stage2_5Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import JsEditor from './JsEditor';
import './LevelJS_4.css';

const SUPPORT = {
  intro:{concept:'Arrays & Basic Methods',tagline:"Arrays are ordered lists. JS arrays are dynamic — they grow and shrink freely.",whatYouWillDo:"Create an array, push and pop items, loop with for...of, and access elements by index.",whyItMatters:"API responses are almost always arrays. Patient lists, search results, notifications — all arrays. Every React list render is an array transformed by .map(). Understanding arrays is mandatory."},
  hints:["Create: const wards = ['Cardiology', 'Oncology']; — square brackets. Push to end: wards.push('Neurology'). Remove from end: wards.pop(). Length: wards.length.","Access by index: wards[0] gives first element. wards[wards.length-1] gives last. Indices start at 0.","Loop with for...of: for (const ward of wards) { console.log(ward); } — cleaner than a for loop with index."],
  reveal:{concept:'Arrays & Iteration',whatYouLearned:"Arrays: [], .push(), .pop(), .shift(), .unshift(), .length, [index]. for...of iterates values cleanly. JS arrays can hold mixed types (numbers, strings, objects). Arrays are objects — typeof [] === 'object'. Check with Array.isArray().",realWorldUse:"React: {patients.map(p => <PatientCard key={p.id} name={p.name} />)} — .map() transforms every array element into a JSX element. The entire React list rendering model is built on arrays.",developerSays:"Never use for...in on arrays — it iterates keys (indices as strings) not values. Use for...of or .forEach() or .map(). And always include a key prop when rendering arrays in React — missing keys cause performance bugs."},
};

const INITIAL = `// ── TASK 1: Build an array ──────────────────────────────────
// Create a const array called 'patients' with: "Alice", "Bob"
// Push "Carol" to the end
// Print: "Patients: 3"  (the count after pushing)
// Print the first patient: "First: Alice"
// Print the last patient: "Last: Carol"

// TODO

// ── TASK 2: Loop with for...of ───────────────────────────────
// Create array 'wards' = ["Cardiology", "Oncology", "Neurology"]
// Use for...of to print each ward on its own line
// Then pop() the last ward and print: "Removed: Neurology"
// Print: "Remaining: 2"

// TODO`;

const EXPECTED = `Patients: 3\nFirst: Alice\nLast: Carol\nCardiology\nOncology\nNeurology\nRemoved: Neurology\nRemaining: 2`;

export default function LevelJS_4() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);
  return (
    <Stage2_5Shell levelId={4} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div className="ljs4-container">
          <div className="ljs4-brief">
            <div className="ljs4-brief-tag">// Build Mission</div>
            <h2>Build and loop patient arrays for your <span style={{color:selectedDomain?.color}}>{selectedDomain?.name||'system'}</span>.</h2>
            <p>Two tasks. Write only in the <code>// TODO</code> lines.</p>
            <div className="ljs4-expected-box">
              <div className="ljs4-expected-label">Expected output</div>
              <pre className="ljs4-expected-output">{EXPECTED}</pre>
            </div>
          </div>

          <div className="ljs4-anatomy">
            <div className="ljs4-anat-header">// Array method reference</div>
            <div className="ljs4-method-grid">
              {[
                {sig:'arr.push("item")',     ret:'number', note:'adds to END — returns new length'},
                {sig:'arr.pop()',             ret:'value',  note:'removes from END — returns removed item'},
                {sig:'arr.unshift("item")',   ret:'number', note:'adds to FRONT — returns new length'},
                {sig:'arr.shift()',           ret:'value',  note:'removes from FRONT — returns removed item'},
                {sig:'arr.length',            ret:'number', note:'number of elements — no parentheses (it is a property)'},
                {sig:'arr[0]',                ret:'value',  note:'first element — indices start at 0'},
                {sig:'arr[arr.length - 1]',   ret:'value',  note:'last element'},
                {sig:'arr.includes("Alice")', ret:'boolean',note:'true if value is in array'},
                {sig:'arr.indexOf("Bob")',     ret:'number', note:'index of first match, or -1 if not found'},
              ].map(r => (
                <div key={r.sig} className="ljs4-method-row">
                  <code className="ljs4-msig">{r.sig}</code>
                  <span className="ljs4-mret">→ {r.ret}</span>
                  <span className="ljs4-mnote">{r.note}</span>
                </div>
              ))}
            </div>

            <div className="ljs4-anat-header" style={{marginTop:18}}>// Loop options — for...of vs forEach vs classic for</div>
            <div className="ljs4-compare">
              {[
                {title:'for...of (preferred)',  col:'#4ade80', code:"for (const w of wards) {\n  console.log(w);\n}", note:'Clean, readable — use this for simple iteration'},
                {title:'forEach',               col:'#38bdf8', code:"wards.forEach(w => {\n  console.log(w);\n});",  note:'Arrow function per item — no break/continue'},
                {title:'classic for',           col:'#94a3b8', code:"for (let i=0; i<wards.length; i++) {\n  console.log(wards[i]);\n}", note:'Use when you need the index'},
              ].map(c => (
                <div key={c.title} className="ljs4-loop-col" style={{borderTopColor:c.col}}>
                  <div className="ljs4-loop-title" style={{color:c.col}}>{c.title}</div>
                  <pre className="ljs4-loop-code">{c.code}</pre>
                  <div className="ljs4-loop-note">{c.note}</div>
                </div>
              ))}
            </div>

            <div className="ljs4-mistake">
              <div className="ljs4-mistake-label">⚠ pop() returns the removed item — capture it!</div>
              <div className="ljs4-mrows">
                <div className="ljs4-mrow bad"><span className="ljs4-mtag bad-tag">✗</span><code>wards.pop(); console.log("Removed: " + wards[-1]);</code><span className="ljs4-mnote">wards[-1] is undefined — item already gone</span></div>
                <div className="ljs4-mrow good"><span className="ljs4-mtag good-tag">✓</span><code>const removed = wards.pop(); console.log("Removed: " + removed);</code><span className="ljs4-mnote">capture the return value of pop()</span></div>
              </div>
            </div>
          </div>

          <JsEditor initialCode={INITIAL} expectedOutput={EXPECTED} onOutputChange={(_,c)=>setOk(c)} height={250} />
        </div>
      </LevelSupportWrapper>
    </Stage2_5Shell>
  );
}
