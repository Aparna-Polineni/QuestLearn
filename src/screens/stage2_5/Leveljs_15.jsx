// LevelJS_15.jsx — JS Capstone (BUILD)
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2_5Shell from './Stage2_5Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import JsEditor from './JsEditor';
import './LevelJS_15.css';

const SUPPORT = {
  intro:{concept:'JavaScript Capstone',tagline:"Bring it all together: async fetch → filter → transform → render to DOM.",whatYouWillDo:"Write a complete async pipeline that fetches patient data, filters active patients, formats their names, and renders a summary — exactly what a React component does under the hood.",whyItMatters:"This is what React does automatically. Every time you render a list in React, it is: fetch data → filter/map → create DOM elements. After this level, the React mental model will make perfect sense."},
  hints:["Step 1: async function loadDashboard() — await the mock fetch and .json(). Step 2: filter only isActive patients. Step 3: map each to a formatted string. Step 4: print the summary.","The formatted name should use a template literal. The summary line uses .length on the filtered array. The rendered list uses .forEach() or .join().","Use try/catch around the whole pipeline. In finally: print the dashboard footer."],
  reveal:{concept:'Full Async Pipeline — the React foundation',whatYouLearned:"You just built the JS equivalent of a React data-fetching component: async fetch → setState → filter/map → render. Every React component with useEffect + fetch is this exact pattern, wrapped in React's state management and JSX rendering.",realWorldUse:"In React this becomes: useEffect(() => { loadDashboard(); }, []). The filter becomes: const activePatients = patients.filter(p => p.isActive). The map becomes: activePatients.map(p => <PatientRow key={p.id} {...p} />). You now know what React is abstracting.",developerSays:"After teaching hundreds of developers, the ones who understand this vanilla JS pipeline learn React in days. The ones who skip straight to React take weeks to understand why things work. You just did it the right way."},
};

const LOCKED = `// Mock fetch — simulates a real API call
function mockFetch(url) {
  return new Promise(resolve => {
    resolve({
      json: () => Promise.resolve([
        { id:"P001", name:"Alice Smith",  ward:"Cardiology", age:34, isActive:true  },
        { id:"P002", name:"Bob Jones",    ward:"Oncology",   age:52, isActive:false },
        { id:"P003", name:"Carol White",  ward:"Neurology",  age:41, isActive:true  },
        { id:"P004", name:"David Brown",  ward:"Cardiology", age:67, isActive:true  },
        { id:"P005", name:"Eve Davis",    ward:"Oncology",   age:29, isActive:false },
      ])
    });
  });
}`;

const INITIAL = `// Mock fetch — simulates a real API call
function mockFetch(url) {
  return new Promise(resolve => {
    resolve({
      json: () => Promise.resolve([
        { id:"P001", name:"Alice Smith",  ward:"Cardiology", age:34, isActive:true  },
        { id:"P002", name:"Bob Jones",    ward:"Oncology",   age:52, isActive:false },
        { id:"P003", name:"Carol White",  ward:"Neurology",  age:41, isActive:true  },
        { id:"P004", name:"David Brown",  ward:"Cardiology", age:67, isActive:true  },
        { id:"P005", name:"Eve Davis",    ward:"Oncology",   age:29, isActive:false },
      ])
    });
  });
}

// ── CAPSTONE: Build the full async dashboard pipeline ─────────
// Write async function 'loadDashboard':
//
// 1. await mockFetch("/api/patients") then await .json()
// 2. filter for isActive === true patients only
// 3. map each active patient to: "  • NAME (WARD)"
//    e.g. "  • Alice Smith (Cardiology)"
// 4. Print: "=== Patient Dashboard ==="
// 5. Print each formatted line
// 6. Print: "Active: X / Y total"
//    (X = active count, Y = total count)
//
// Wrap in try/catch/finally
// finally: print "Dashboard loaded."
//
// Then call loadDashboard()

// TODO: async function loadDashboard() { ... }
// TODO: loadDashboard();`;

const EXPECTED = `=== Patient Dashboard ===\n  • Alice Smith (Cardiology)\n  • Carol White (Neurology)\n  • David Brown (Cardiology)\nActive: 3 / 5 total\nDashboard loaded.`;

export default function LevelJS_15() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);
  return (
    <Stage2_5Shell levelId={15} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div className="ljs15-container">
          <div className="ljs15-brief">
            <div className="ljs15-brief-tag">// Stage 2.5 Capstone — JavaScript</div>
            <h2>Build the complete async patient dashboard for your <span style={{color:selectedDomain?.color}}>{selectedDomain?.name||'system'}</span>.</h2>
            <p>The mock API and data are locked. Write the complete <code>loadDashboard</code> function and call it.</p>
            <div className="ljs15-expected-box">
              <div className="ljs15-expected-label">Expected output</div>
              <pre className="ljs15-expected-output">{EXPECTED}</pre>
            </div>
          </div>

          <div className="ljs15-anatomy">
            <div className="ljs15-anat-header">// The complete pipeline — all Stage 2.5 concepts in one</div>
            <div className="ljs15-pipeline">
              {[
                {n:1, title:'async/await fetch',  col:'#f59e0b', code:"const res = await mockFetch('/api/patients');\nconst patients = await res.json();",    note:'Levels 12–13: Promises + async/await'},
                {n:2, title:'.filter()',           col:'#4ade80', code:"const active = patients.filter(p => p.isActive);",                                      note:'Level 8: array methods'},
                {n:3, title:'.map() + template',  col:'#38bdf8', code:"const lines = active.map(p => `  • ${p.name} (${p.ward})`);",                           note:'Levels 3, 7, 8: arrow + template + map'},
                {n:4, title:'print + count',      col:'#a78bfa', code:"lines.forEach(l => console.log(l));\nconsole.log(`Active: ${active.length} / ${patients.length} total`);", note:'Level 4: array methods, Level 1: template literals'},
              ].map(s => (
                <div key={s.n} className="ljs15-pipe-step" style={{borderLeftColor:s.col}}>
                  <div className="ljs15-pipe-header">
                    <span className="ljs15-pipe-num" style={{color:s.col, borderColor:s.col+'55', background:s.col+'15'}}>{s.n}</span>
                    <span className="ljs15-pipe-title">{s.title}</span>
                    <span className="ljs15-pipe-from">{s.note}</span>
                  </div>
                  <pre className="ljs15-pipe-code">{s.code}</pre>
                </div>
              ))}
            </div>

            <div className="ljs15-anat-header" style={{marginTop:18}}>// This is exactly what React does</div>
            <div className="ljs15-compare">
              <div className="ljs15-col vanilla-col">
                <div className="ljs15-col-title">What you're building (vanilla JS)</div>
                <pre className="ljs15-code-block">{`async function loadDashboard() {
  const patients = await fetch(url).then(r=>r.json());
  const active = patients.filter(p => p.isActive);
  active.forEach(p => console.log(p.name));
}`}</pre>
              </div>
              <div className="ljs15-col react-col">
                <div className="ljs15-col-title">The React equivalent</div>
                <pre className="ljs15-code-block">{`function Dashboard() {
  const [patients, setPatients] = useState([]);
  useEffect(() => {
    fetch(url).then(r=>r.json()).then(setPatients);
  }, []);
  return patients
    .filter(p => p.isActive)
    .map(p => <Row key={p.id} {...p} />);
}`}</pre>
              </div>
            </div>
            <div className="ljs15-bridge-note">Same logic. React just wraps state, re-rendering, and DOM patching around it. You are ready for Stage 3.</div>
          </div>

          <JsEditor lockedCode={LOCKED}
            initialCode={INITIAL} expectedOutput={EXPECTED} onOutputChange={(_,c)=>setOk(c)} height={320} />
        </div>
      </LevelSupportWrapper>
    </Stage2_5Shell>
  );
}
