// LevelJS_13.jsx — Async/Await (BUILD)
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2_5Shell from './Stage2_5Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import JsEditor from './JsEditor';
import './LevelJS_13.css';

const SUPPORT = {
  intro:{concept:'Async / Await',tagline:"async/await makes Promise code look synchronous. It is the same Promises — just cleaner syntax.",whatYouWillDo:"Write async functions, await Promises, and handle errors with try/catch inside async functions.",whyItMatters:"Every useEffect data fetch in React uses async/await. Every API call in a Next.js route handler is async/await. It is the dominant pattern for all async JavaScript today."},
  hints:["Add async before function: async function loadPatient() {}. Inside, await pauses execution until the Promise resolves: const patient = await fetchPatient('P001');","Wrap in try/catch: try { const p = await fetchPatient('P001'); } catch(err) { console.log(err.message); }. The catch block receives the rejection reason.","await only works inside async functions. You can await any Promise — including fetch(), your own Promises, Promise.all([...])."],
  reveal:{concept:'async/await — Promises with clean syntax',whatYouLearned:"async function always returns a Promise. await pauses the function until the Promise resolves — other code keeps running. try/catch replaces .catch(). Top-level await works in ES modules. await Promise.all([a, b]) awaits multiple in parallel.",realWorldUse:"React useEffect: useEffect(() => { const load = async () => { try { const data = await fetch('/api/patients').then(r=>r.json()); setPatients(data); } catch(err) { setError(err.message); } finally { setLoading(false); } }; load(); }, []); This exact pattern is in every React data-fetching component.",developerSays:"The inner async function inside useEffect is a gotcha — you cannot make useEffect's callback async directly. Always create an inner async function and call it. Forgetting this is one of the most common React beginner mistakes."},
};

const INITIAL = `// Simulate fetch (returns a Promise, like real fetch)
function mockFetch(url) {
  return new Promise((resolve, reject) => {
    if (url.includes("bad")) {
      reject(new Error("Network error: bad URL"));
    } else {
      resolve({
        json: () => Promise.resolve([
          { id: "P001", name: "Alice Smith",  ward: "Cardiology", isActive: true  },
          { id: "P002", name: "Bob Jones",    ward: "Oncology",   isActive: false },
          { id: "P003", name: "Carol White",  ward: "Neurology",  isActive: true  },
        ])
      });
    }
  });
}

// ── TASK 1: Basic async/await ────────────────────────────────
// Write async function 'loadPatients'
// await mockFetch("/api/patients"), then await .json()
// Print: "Loaded: 3 patients"
// Call it and use .then(() => runTask2())

async function loadPatients() {
  // TODO: const response = await mockFetch(...)
  // TODO: const patients = await response.json()
  // TODO: console.log(...)
}

// ── TASK 2: async with try/catch ─────────────────────────────
// Write async function 'safeLoad'
// try: await mockFetch("/bad-url"), log the result
// catch: print "Failed: " + err.message
// finally: print "Load attempt done"

async function safeLoad() {
  // TODO
}

// ── TASK 3: Parallel with Promise.all ────────────────────────
// Write async function 'loadAll'
// Use Promise.all to await BOTH mockFetch("/api/patients").then(r=>r.json())
// and mockFetch("/api/patients").then(r=>r.json()) simultaneously
// Print: "Total records: 6"  (3 + 3 from two calls)

async function loadAll() {
  // TODO
}

loadPatients().then(() => safeLoad()).then(() => loadAll());`;

const EXPECTED = `Loaded: 3 patients\nFailed: Network error: bad URL\nLoad attempt done\nTotal records: 6`;

export default function LevelJS_13() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);
  return (
    <Stage2_5Shell levelId={13} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div className="ljs13-container">
          <div className="ljs13-brief">
            <div className="ljs13-brief-tag">// Build Mission — Async / Await</div>
            <h2>Fetch patient data asynchronously for your <span style={{color:selectedDomain?.color}}>{selectedDomain?.name||'system'}</span>.</h2>
            <p>Three tasks. The mockFetch simulator and function signatures are given. Fill in the function bodies.</p>
            <div className="ljs13-expected-box">
              <div className="ljs13-expected-label">Expected output</div>
              <pre className="ljs13-expected-output">{EXPECTED}</pre>
            </div>
          </div>

          <div className="ljs13-anatomy">
            <div className="ljs13-anat-header">// async/await — the complete pattern</div>
            <pre className="ljs13-code-block">{`async function loadPatients() {
  try {
    const response = await fetch('/api/patients');
    //    ↑ await pauses here until fetch resolves
    const patients = await response.json();
    //    ↑ .json() also returns a Promise — await it too
    console.log(\`Loaded: \${patients.length} patients\`);
  } catch (err) {
    // catches any rejection in the try block
    console.log("Failed: " + err.message);
  } finally {
    // always runs — clear loading spinner here
    setLoading(false);
  }
}`}</pre>

            <div className="ljs13-anat-header" style={{marginTop:18}}>// Parallel vs Sequential — key performance difference</div>
            <div className="ljs13-compare">
              <div className="ljs13-col seq-col">
                <div className="ljs13-col-title" style={{color:'#f87171'}}>Sequential (slow)</div>
                <pre className="ljs13-code-block">{`const a = await fetchA(); // waits 1s
const b = await fetchB(); // waits 1s after A
// total: 2 seconds`}</pre>
                <div className="ljs13-col-note">A must finish before B starts</div>
              </div>
              <div className="ljs13-col par-col">
                <div className="ljs13-col-title" style={{color:'#4ade80'}}>Parallel (fast)</div>
                <pre className="ljs13-code-block">{`const [a, b] = await Promise.all([
  fetchA(), fetchB()
]);
// total: 1 second — both run at once`}</pre>
                <div className="ljs13-col-note">Both start simultaneously</div>
              </div>
            </div>

            <div className="ljs13-mistake">
              <div className="ljs13-mistake-label">⚠ useEffect cannot be async directly — use an inner function</div>
              <div className="ljs13-mrows">
                <div className="ljs13-mrow bad"><span className="ljs13-mtag bad-tag">✗</span><code>{'useEffect(async () => { const d = await fetch(...); }, [])'}</code><span className="ljs13-mnote">async useEffect returns a Promise — React expects nothing or a cleanup function</span></div>
                <div className="ljs13-mrow good"><span className="ljs13-mtag good-tag">✓</span><code>{'useEffect(() => { const load = async () => { ... }; load(); }, [])'}</code><span className="ljs13-mnote">inner async function — the outer callback remains synchronous</span></div>
              </div>
            </div>
          </div>

          <JsEditor initialCode={INITIAL} expectedOutput={EXPECTED} onOutputChange={(_,c)=>setOk(c)} height={370} />
        </div>
      </LevelSupportWrapper>
    </Stage2_5Shell>
  );
}