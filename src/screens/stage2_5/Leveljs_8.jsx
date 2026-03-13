// src/screens/stage2_5/LevelJS_8.jsx — Array Methods (BUILD)
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2_5Shell from './Stage2_5Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import JsEditor from './JsEditor';
import './LevelJS_8.css';

const SUPPORT = {
  intro:{concept:'Array Methods — map, filter, reduce, find',tagline:".map transforms. .filter keeps. .reduce accumulates. .find searches. These four replace most for-loops.",whatYouWillDo:"Use .map() to transform patient names, .filter() to find active patients, .reduce() to sum ages, and .find() to locate a specific record.",whyItMatters:"React renders lists with .map(). Filtering search results uses .filter(). Totals use .reduce(). Finding a record by ID uses .find(). Together they cover 90% of data manipulation in React apps."},
  hints:[".map(fn) returns a NEW array of the same length, each element transformed: patients.map(p => p.name) gives an array of just the names.",".filter(fn) returns a NEW array with only items where fn returns true: patients.filter(p => p.isActive) keeps only active patients.",".reduce((acc, curr) => acc + curr.age, 0) — acc starts at 0, adds each patient's age. Returns a single value. The 0 is the initial accumulator.",".find(fn) returns the FIRST matching element (not an array): patients.find(p => p.id === 'P002') returns the patient object or undefined."],
  reveal:{concept:'map, filter, reduce, find',whatYouLearned:".map(fn): new array, same length, each item transformed. .filter(fn): new array, only items where fn returns true. .reduce((acc,curr) => ..., init): single value accumulated. .find(fn): first matching item or undefined. .findIndex(fn): index of first match. .some(fn): true if any match. .every(fn): true if all match.",realWorldUse:"React list render: {patients.map(p => <Card key={p.id} {...p} />)}. Search filter: setFiltered(patients.filter(p => p.name.includes(query))). Stats: const avgAge = ages.reduce((sum, a) => sum + a, 0) / ages.length. Look up by ID: const found = patients.find(p => p.id === selectedId);",developerSays:"These four methods replaced 80% of my for-loops. The key insight: they all take a callback function — the function describes what to do with each item. Once you think in callbacks, streams and React hooks click immediately."},
};

// ── Locked data — injected at runtime but NOT editable ───────
const LOCKED = `const patients = [
  { id: "P001", name: "Alice Smith",  age: 34, isActive: true,  ward: "Cardiology" },
  { id: "P002", name: "Bob Jones",    age: 52, isActive: false, ward: "Oncology"   },
  { id: "P003", name: "Carol White",  age: 41, isActive: true,  ward: "Neurology"  },
  { id: "P004", name: "David Brown",  age: 67, isActive: true,  ward: "Cardiology" },
];`;

// ── Editable starter — only the TODO sections ────────────────
const INITIAL = `// ── TASK 1: .map() ──────────────────────────────────────────
// Use .map() to get an array of just the names
// Print: "Names: Alice Smith,Bob Jones,Carol White,David Brown"
// (join with comma — use .join(","))

// TODO

// ── TASK 2: .filter() ────────────────────────────────────────
// Use .filter() to get only active patients
// Print: "Active count: 3"

// TODO

// ── TASK 3: .reduce() ────────────────────────────────────────
// Use .reduce() to sum all ages
// Print: "Total age: 194"

// TODO

// ── TASK 4: .find() ──────────────────────────────────────────
// Use .find() to locate patient with id "P003"
// Print: "Found: Carol White"

// TODO`;

const EXPECTED = `Names: Alice Smith,Bob Jones,Carol White,David Brown
Active count: 3
Total age: 194
Found: Carol White`;

export default function LevelJS_8() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);
  return (
    <Stage2_5Shell levelId={8} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div className="ljs8-container">
          <div className="ljs8-brief">
            <div className="ljs8-brief-tag">// Build Mission — Array Methods</div>
            <h2>Transform patient data with array methods for your <span style={{color:selectedDomain?.color}}>{selectedDomain?.name||'system'}</span>.</h2>
            <p>Four tasks. The patients array is <strong>locked</strong> — write only in the editable section.</p>
            <div className="ljs8-expected-box">
              <div className="ljs8-expected-label">Expected output</div>
              <pre className="ljs8-expected-output">{EXPECTED}</pre>
            </div>
          </div>

          <div className="ljs8-anatomy">
            <div className="ljs8-anat-header">// The four essential array methods</div>
            <div className="ljs8-methods-panel">
              {[
                {name:'.map()',    col:'#38bdf8', ret:'new array (same length)',  sig:'patients.map(p => p.name)',                   note:'transforms each item — returns a NEW array'},
                {name:'.filter()', col:'#4ade80', ret:'new array (shorter)',      sig:'patients.filter(p => p.isActive)',             note:'keeps items where callback returns true'},
                {name:'.reduce()', col:'#f59e0b', ret:'single value',            sig:'patients.reduce((sum,p) => sum + p.age, 0)',   note:'accumulates into one result — initial value is 2nd arg'},
                {name:'.find()',   col:'#a78bfa', ret:'first match or undefined', sig:'patients.find(p => p.id === "P003")',          note:'returns the item itself, not an array'},
              ].map(m => (
                <div key={m.name} className="ljs8-method-card" style={{borderTopColor:m.col}}>
                  <div className="ljs8-method-title" style={{color:m.col}}>{m.name}</div>
                  <div className="ljs8-method-ret">returns: <code>{m.ret}</code></div>
                  <pre className="ljs8-method-sig">{m.sig}</pre>
                  <div className="ljs8-method-note">{m.note}</div>
                </div>
              ))}
            </div>

            <div className="ljs8-anat-header" style={{marginTop:18}}>// Bonus methods — also non-mutating</div>
            <div className="ljs8-method-grid">
              {[
                {sig:'.join(",")',     note:'joins array elements into a string — useful for printing arrays'},
                {sig:'.some(fn)',      note:'returns true if AT LEAST ONE item passes the test'},
                {sig:'.every(fn)',     note:'returns true if ALL items pass the test'},
                {sig:'.findIndex(fn)', note:'like find() but returns the index, not the item'},
              ].map(r => (
                <div key={r.sig} className="ljs8-ref-row">
                  <code className="ljs8-rsig">{r.sig}</code>
                  <span className="ljs8-rnote">{r.note}</span>
                </div>
              ))}
            </div>

            <div className="ljs8-mistake">
              <div className="ljs8-mistake-label">⚠ .find() returns the item, not an array — check for undefined</div>
              <div className="ljs8-mrows">
                <div className="ljs8-mrow bad"><span className="ljs8-mtag bad-tag">✗</span><code>{'const p = patients.find(p => p.id === "X999"); console.log(p.name)'}</code><span className="ljs8-mnote">TypeError — p is undefined if not found</span></div>
                <div className="ljs8-mrow good"><span className="ljs8-mtag good-tag">✓</span><code>{'const p = patients.find(p => p.id === "X999"); console.log(p?.name ?? "Not found")'}</code><span className="ljs8-mnote">safe with optional chaining + nullish default</span></div>
              </div>
            </div>
          </div>

          <JsEditor
            lockedCode={LOCKED}
            initialCode={INITIAL}
            expectedOutput={EXPECTED}
            onOutputChange={(_, c) => setOk(c)}
            height={300}
          />
        </div>
      </LevelSupportWrapper>
    </Stage2_5Shell>
  );
}