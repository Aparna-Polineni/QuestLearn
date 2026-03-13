// LevelJS_12.jsx — Promises
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2_5Shell from './Stage2_5Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import JsEditor from './JsEditor';
import './LevelJS_12.css';

const SUPPORT = {
  intro:{concept:'Promises',tagline:"A Promise is a placeholder for a future value. .then() handles success, .catch() handles failure.",whatYouWillDo:"Create promises, chain .then() calls, and handle errors with .catch().",whyItMatters:"fetch() returns a Promise. Every API call is a Promise. Before async/await (the next level), you need to understand what Promises ARE — async/await is just syntax sugar on top of Promises."},
  hints:["new Promise((resolve, reject) => { resolve(value) or reject(error) }). resolve triggers .then(), reject triggers .catch().","Chain: fetchPatient().then(p => p.name).then(name => console.log(name)). Each .then() returns a new Promise. The value returned from one .then() is passed to the next.",".catch() at the end handles any rejection in the chain — you do not need a .catch() on every .then(). .finally() runs after either resolution or rejection."],
  reveal:{concept:'Promises & .then() Chaining',whatYouLearned:"new Promise((resolve, reject)) — resolve for success, reject for failure. .then(val => ...) runs on success. .catch(err => ...) runs on failure. .finally(() => ...) always runs. Promise.all([...]) waits for all. Promise.race([...]) takes the first. Chaining: each .then() return value is passed to the next.",realWorldUse:"fetch('/api/patients') returns a Promise. fetch().then(r => r.json()) — .json() also returns a Promise. In React with async/await this becomes: const data = await fetch(url).then(r => r.json()). Understanding chaining explains why .then().then() works.",developerSays:"Once you understand Promises, async/await feels obvious — it is just Promises with cleaner syntax. Every time you see await, mentally replace it with .then() and it makes sense."},
};

const INITIAL = `// Promises run asynchronously in browsers, but in this
// environment we simulate them synchronously for output testing.

function fetchPatient(id) {
  return new Promise((resolve, reject) => {
    if (id === "P999") {
      reject(new Error("Patient not found: " + id));
    } else {
      resolve({ id: id, name: "Alice Smith", ward: "Cardiology" });
    }
  });
}

// ── TASK 1: .then() chain ────────────────────────────────────
// Call fetchPatient("P001")
// .then(): print "Loaded: " + patient.name
// .catch(): print "Failed: " + err.message
// .finally(): print "Request complete"

// TODO

// ── TASK 2: Chained .then() ───────────────────────────────────
// Call fetchPatient("P002")
// First .then(): return just the patient name
// Second .then(): print "Name is: " + name

// TODO

// ── TASK 3: .catch() for rejection ───────────────────────────
// Call fetchPatient("P999") — this will reject
// .then(): print "Should not reach here"
// .catch(): print "Caught: " + err.message

// TODO`;

const EXPECTED = `Loaded: Alice Smith\nRequest complete\nName is: Alice Smith\nCaught: Patient not found: P999`;

export default function LevelJS_12() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);
  return (
    <Stage2_5Shell levelId={12} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div className="ljs12-container">
          <div className="ljs12-brief">
            <div className="ljs12-brief-tag">// Build Mission</div>
            <h2>Handle async patient data with Promises for your <span style={{color:selectedDomain?.color}}>{selectedDomain?.name||'system'}</span>.</h2>
            <p>Three tasks. The fetchPatient function is locked. Write only in the <code>// TODO</code> lines.</p>
            <div className="ljs12-expected-box">
              <div className="ljs12-expected-label">Expected output</div>
              <pre className="ljs12-expected-output">{EXPECTED}</pre>
            </div>
          </div>

          <div className="ljs12-anatomy">
            <div className="ljs12-anat-header">// Promise states and flow</div>
            <div className="ljs12-states">
              {[
                {state:'PENDING',   col:'#94a3b8', desc:'Initial state — operation in progress. fetch() is pending while the network request is running.'},
                {state:'FULFILLED', col:'#4ade80', desc:'resolve(value) was called. .then(val => ...) runs with the value.'},
                {state:'REJECTED',  col:'#f87171', desc:'reject(error) was called. .catch(err => ...) runs with the error.'},
              ].map(s => (
                <div key={s.state} className="ljs12-state" style={{borderTopColor:s.col}}>
                  <div className="ljs12-state-name" style={{color:s.col}}>{s.state}</div>
                  <div className="ljs12-state-desc">{s.desc}</div>
                </div>
              ))}
            </div>

            <div className="ljs12-anat-header" style={{marginTop:18}}>// Promise chain anatomy</div>
            <pre className="ljs12-code-block">{`fetchPatient("P001")          // returns Promise<patient>
  .then(patient => {           // runs on resolve
    return patient.name;       // pass value to next .then
  })
  .then(name => {              // receives "Alice Smith"
    console.log("Name: " + name);
  })
  .catch(err => {              // catches ANY rejection in the chain
    console.log("Error: " + err.message);
  })
  .finally(() => {             // always runs
    console.log("Done");
  });`}</pre>

            <div className="ljs12-anat-header" style={{marginTop:18}}>// Promise utility methods</div>
            <div className="ljs12-method-grid">
              {[
                {sig:'Promise.resolve(value)',         note:'creates an already-resolved Promise — useful for testing'},
                {sig:'Promise.reject(error)',           note:'creates an already-rejected Promise'},
                {sig:'Promise.all([p1, p2, p3])',      note:'waits for ALL — resolves when all resolve, rejects if any rejects'},
                {sig:'Promise.allSettled([p1, p2])',   note:'waits for ALL — resolves regardless of failures, gives each result status'},
                {sig:'Promise.race([p1, p2])',          note:'resolves/rejects with the FIRST promise to settle'},
              ].map(r => (
                <div key={r.sig} className="ljs12-method-row">
                  <code className="ljs12-msig">{r.sig}</code>
                  <span className="ljs12-mnote">{r.note}</span>
                </div>
              ))}
            </div>
          </div>

          <JsEditor initialCode={INITIAL} expectedOutput={EXPECTED} onOutputChange={(_,c)=>setOk(c)} height={290} />
        </div>
      </LevelSupportWrapper>
    </Stage2_5Shell>
  );
}