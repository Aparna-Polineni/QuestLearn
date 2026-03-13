// src/screens/stage2_5/LevelJS_18.jsx — Iterators, Sets & Maps
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2_5Shell from './Stage2_5Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import JsEditor from './JsEditor';
import './LevelJS_18.css';

const SUPPORT = {
  intro: {
    concept: 'Sets, Maps & Iteration',
    tagline: "Set for unique values. Map for key→value with any key type. Both are iterable — for...of works on them.",
    whatYouWillDo: "Use Set to deduplicate a patient list, use Map to count ward populations, and iterate both with for...of and spread.",
    whyItMatters: "Sets and Maps solve real problems that arrays and plain objects cannot. Deduplicating IDs, counting occurrences, using non-string keys — all Map/Set territory. You'll reach for these daily in backend-integrated React apps.",
  },
  hints: [
    "Set: const seen = new Set(); seen.add('P001'); seen.add('P001'); seen.size === 1. Deduplicate array: const unique = [...new Set(arr)]. Spread converts Set to array.",
    "Map: const wardCount = new Map(); wardCount.set('Cardiology', 3); wardCount.get('Cardiology'). Map.has(key) for existence. Map preserves insertion order and allows any key type — including objects.",
    "Both are iterable: for (const val of mySet) {...}. for (const [key, val] of myMap) {...}. Spread: [...mySet], [...myMap.keys()], [...myMap.values()].",
  ],
  reveal: {
    concept: 'Set, Map & the Iteration Protocol',
    whatYouLearned: "Set: unique values, .add(), .has(), .delete(), .size, iterable. Map: key→value with any key type, .set(), .get(), .has(), .delete(), .size, iterable. Both support for...of and spread. [...new Set(arr)] is the one-liner deduplication pattern. Map vs Object: Map allows any key type and has better iteration.",
    realWorldUse: "Tracking seen IDs during data normalisation: const seen = new Set(). Counting category frequencies: categories.reduce((map, c) => map.set(c, (map.get(c) || 0) + 1), new Map()). Caching: const cache = new Map() — O(1) lookup with any key. React's useMemo and useCallback use Maps internally for cache.",
    developerSays: "The [...new Set(arr)] pattern is in my muscle memory. Any time I get a list that might have duplicates — IDs, tags, categories — that one-liner gives me unique values instantly. And Map outperforms plain objects for high-frequency read/write cycles because it's optimised for that use case.",
  },
};

const INITIAL = `// ── TASK 1: Set for deduplication ───────────────────────────
// Given this array with duplicate IDs:
const patientIds = ["P001", "P002", "P001", "P003", "P002", "P004"];

// Use [...new Set(patientIds)] to get unique IDs
// Print: "Unique count: 4"
// Print: "Unique IDs: P001,P002,P003,P004"

// TODO

// ── TASK 2: Map to count wards ────────────────────────────────
const patients = [
  { name: "Alice",  ward: "Cardiology" },
  { name: "Bob",    ward: "Oncology"   },
  { name: "Carol",  ward: "Cardiology" },
  { name: "David",  ward: "Neurology"  },
  { name: "Eve",    ward: "Cardiology" },
];

// Build a Map: ward name → count of patients
// Then iterate with for...of [key, value]
// Print each line as: "Cardiology: 3" etc (alphabetical not required)
// Print: "Total wards: 3"

// TODO

// ── TASK 3: Set operations ────────────────────────────────────
const setA = new Set(["P001", "P002", "P003"]);
const setB = new Set(["P002", "P003", "P004"]);

// Find intersection (items in BOTH sets) using filter + has
// Print: "Intersection: P002,P003"

// TODO`;

const EXPECTED = `Unique count: 4\nUnique IDs: P001,P002,P003,P004\nCardiology: 3\nNeurology: 1\nOncology: 1\nTotal wards: 3\nIntersection: P002,P003`;

export default function LevelJS_18() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);

  // Ward order in output may vary — use flexible check
  function handleOutput(output, _) {
    const lines = output.split('\n');
    const isOk = lines[0] === 'Unique count: 4' &&
                 lines[1] === 'Unique IDs: P001,P002,P003,P004' &&
                 lines.includes('Cardiology: 3') &&
                 lines.includes('Oncology: 1') &&
                 lines.includes('Neurology: 1') &&
                 lines.includes('Total wards: 3') &&
                 lines[lines.length - 1] === 'Intersection: P002,P003';
    setOk(isOk);
  }

  return (
    <Stage2_5Shell levelId={18} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div className="ljs18-container">
          <div className="ljs18-brief">
            <div className="ljs18-brief-tag">// Build Mission</div>
            <h2>Deduplicate and count patient data for your <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'system'}</span>.</h2>
            <p>Three tasks. Arrays and sets are given. Write only in the <code>// TODO</code> lines.</p>
            <div className="ljs18-expected-box">
              <div className="ljs18-expected-label">Expected output</div>
              <pre className="ljs18-expected-output">{EXPECTED}</pre>
            </div>
          </div>

          <div className="ljs18-anatomy">
            <div className="ljs18-anat-header">// Set vs Array vs Map — when to use which</div>
            <div className="ljs18-compare3">
              <div className="ljs18-col arr-col">
                <div className="ljs18-col-title">Array</div>
                <ul className="ljs18-facts">
                  <li>Ordered, indexed</li>
                  <li>Allows duplicates</li>
                  <li>Access by index [0]</li>
                  <li>Rich methods: .map .filter .reduce</li>
                  <li className="ljs18-bad">O(n) for includes()</li>
                </ul>
                <pre className="ljs18-mini-code">const arr = [1, 2, 2, 3];</pre>
              </div>
              <div className="ljs18-col set-col">
                <div className="ljs18-col-title">Set</div>
                <ul className="ljs18-facts">
                  <li>Unique values only</li>
                  <li>Insertion ordered</li>
                  <li>No index access</li>
                  <li className="ljs18-good">O(1) for .has()</li>
                  <li>Spread to get array</li>
                </ul>
                <pre className="ljs18-mini-code">{'const s = new Set([1,2,2,3]);\n// s.size === 3'}</pre>
              </div>
              <div className="ljs18-col map-col">
                <div className="ljs18-col-title">Map</div>
                <ul className="ljs18-facts">
                  <li>Key → Value pairs</li>
                  <li>Any key type (objects!)</li>
                  <li>Insertion ordered</li>
                  <li className="ljs18-good">O(1) get/set</li>
                  <li>Better than plain object for dynamic keys</li>
                </ul>
                <pre className="ljs18-mini-code">{'const m = new Map();\nm.set("k", 42);'}</pre>
              </div>
            </div>

            <div className="ljs18-anat-header" style={{ marginTop: 18 }}>// Method reference</div>
            <div className="ljs18-method-grid">
              {[
                { sig: '[...new Set(arr)]',            note: 'deduplicate array in one expression — most used Set pattern' },
                { sig: 'set.add(val)',                  note: 'adds value — ignored if already present' },
                { sig: 'set.has(val)',                  note: 'O(1) membership test — faster than arr.includes()' },
                { sig: 'map.set(key, val)',             note: 'store a value — any type for key' },
                { sig: 'map.get(key)',                  note: 'retrieve value — undefined if key missing' },
                { sig: 'map.get(k) || 0',              note: 'safe default for counting: map.set(k, (map.get(k) || 0) + 1)' },
                { sig: 'for (const [k,v] of map)',     note: 'destructure key-value pairs in a for...of loop' },
                { sig: '[...setA].filter(v=>setB.has(v))', note: 'intersection: items in both sets' },
              ].map(r => (
                <div key={r.sig} className="ljs18-method-row">
                  <code className="ljs18-msig">{r.sig}</code>
                  <span className="ljs18-mnote">{r.note}</span>
                </div>
              ))}
            </div>

            <div className="ljs18-mistake">
              <div className="ljs18-mistake-label">⚠ Map.get() returns undefined for missing keys — always default</div>
              <div className="ljs18-mrows">
                <div className="ljs18-mrow bad"><span className="ljs18-mtag bad-tag">✗</span><code>map.set(ward, map.get(ward) + 1)</code><span className="ljs18-mnote">undefined + 1 === NaN — first occurrence breaks</span></div>
                <div className="ljs18-mrow good"><span className="ljs18-mtag good-tag">✓</span><code>map.set(ward, (map.get(ward) || 0) + 1)</code><span className="ljs18-mnote">defaults to 0 for first occurrence</span></div>
              </div>
            </div>
          </div>

          <JsEditor initialCode={INITIAL} expectedOutput={EXPECTED} onOutputChange={handleOutput} height={300} />
        </div>
      </LevelSupportWrapper>
    </Stage2_5Shell>
  );
}