// src/screens/stage2_5/LevelJS_19.jsx — Modern Array & String Methods (BUILD)
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2_5Shell from './Stage2_5Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import JsEditor from './JsEditor';
import './LevelJS_19.css';

const SUPPORT = {
  intro: {
    concept: 'Modern Array & String Methods',
    tagline: "ES2019–2023 added powerful methods that replace verbose workarounds. Real codebases use these constantly.",
    whatYouWillDo: "Use .flat(), .flatMap(), .at(), Array.from(), .padStart(), and .replaceAll() to process patient data in concise one-liners.",
    whyItMatters: "These methods appear in every modern React codebase. .flatMap() replaces a .map() followed by .flat(). .at(-1) replaces arr[arr.length-1]. Knowing them makes you read and write modern JS fluently — and impresses in code reviews.",
  },
  hints: [
    ".flat(depth) flattens nested arrays: [[1,2],[3,4]].flat() → [1,2,3,4]. .flatMap(fn) maps then flattens one level: arr.flatMap(x => [x, x*2]) is map then flat combined.",
    ".at(index) supports negative indices: arr.at(-1) is the last element, arr.at(-2) is second-to-last. Much cleaner than arr[arr.length-1].",
    "Array.from(str) converts a string (or any iterable) to an array. 'abc'.split('') does the same but Array.from is more explicit. String: str.padStart(5,'0') pads to width 5 with zeros. str.replaceAll('x','y') replaces every occurrence.",
  ],
  reveal: {
    concept: 'Modern ES2019–2023 Array & String Methods',
    whatYouLearned: ".flat(n): flattens n levels of nesting. .flatMap(fn): map then flat(1) — for when each item maps to an array. .at(i): negative index support. Array.from(iterable): converts strings, Sets, Maps, NodeLists to arrays. .padStart(len,char)/.padEnd(): string padding. .replaceAll(): global replace without regex. Object.fromEntries(): array of [k,v] pairs → object.",
    realWorldUse: "Flattening API responses: const allTags = posts.flatMap(p => p.tags). Getting last item without math: notifications.at(-1). Converting NodeList to array: Array.from(document.querySelectorAll('.card')). Formatting IDs: id.padStart(6, '0') → '000042'. These patterns are in production codebases daily.",
    developerSays: "I used to write arr[arr.length-1] a hundred times. Then .at(-1) landed and I never went back. .flatMap() replaced a pattern I used constantly — filter-then-map where each item expands to multiple items. These additions made the language noticeably nicer to write.",
  },
};

const LOCKED = `const wardGroups = [
  ["Alice", "Bob"],
  ["Carol"],
  ["David", "Eve", "Frank"]
];

const queue = ["Alice", "Bob", "Carol", "David", "Eve"];
const ids = [1, 42, 500, 3001];
const rawCode = "pat-001-cardiology-2024";`;

const INITIAL = `// ── TASK 1: .flat() and .flatMap() ──────────────────────────
const wardGroups = [
  ["Alice", "Bob"],
  ["Carol"],
  ["David", "Eve", "Frank"]
];

// Use .flat() to get all patients in one array
// Print: "All patients: Alice,Bob,Carol,David,Eve,Frank"

// TODO

// Use .flatMap() on wardGroups:
// For each group, return each name + " (group " + index + ")"
// where index is the position in wardGroups (0, 1, 2)
// Print: "Tagged: Alice (group 0),Bob (group 0),Carol (group 1),..."

// TODO

// ── TASK 2: .at() ─────────────────────────────────────────────
const queue = ["Alice", "Bob", "Carol", "David", "Eve"];

// Print: "First: " + queue.at(0)
// Print: "Last: " + queue.at(-1)
// Print: "Second to last: " + queue.at(-2)

// TODO

// ── TASK 3: Padding & replaceAll ─────────────────────────────
// Format patient ID numbers with zero-padding
// Use .padStart(6, "0") to pad each number
const ids = [1, 42, 500, 3001];
// Print each as: "ID: 000001", "ID: 000042" etc.

// TODO

// Replace all dashes in this code string:
const rawCode = "pat-001-cardiology-2024";
// Replace all "-" with "_"
// Print: "Code: pat_001_cardiology_2024"

// TODO`;

const EXPECTED = `All patients: Alice,Bob,Carol,David,Eve,Frank\nTagged: Alice (group 0),Bob (group 0),Carol (group 1),David (group 2),Eve (group 2),Frank (group 2)\nFirst: Alice\nLast: Eve\nSecond to last: David\nID: 000001\nID: 000042\nID: 000500\nID: 003001\nCode: pat_001_cardiology_2024`;

export default function LevelJS_19() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);
  return (
    <Stage2_5Shell levelId={19} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div className="ljs19-container">
          <div className="ljs19-brief">
            <div className="ljs19-brief-tag">// Build Mission — Modern Methods</div>
            <h2>Process patient data with modern JS for your <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'system'}</span>.</h2>
            <p>Three tasks. The data arrays are given. Write only in the <code>// TODO</code> lines.</p>
            <div className="ljs19-expected-box">
              <div className="ljs19-expected-label">Expected output</div>
              <pre className="ljs19-expected-output">{EXPECTED}</pre>
            </div>
          </div>

          <div className="ljs19-anatomy">
            <div className="ljs19-anat-header">// Modern methods — what they replace</div>
            <div className="ljs19-method-grid">
              {[
                { sig: 'arr.flat()',                         old: '[].concat(...arr)',               note: 'flattens one level of nesting' },
                { sig: 'arr.flat(2)',                        old: 'nested flat() calls',             note: 'flattens 2 levels deep — Infinity flattens all' },
                { sig: 'arr.flatMap(fn)',                    old: 'arr.map(fn).flat()',               note: 'map then flat(1) combined — more efficient' },
                { sig: 'arr.at(-1)',                         old: 'arr[arr.length - 1]',             note: 'last element — negative index from end' },
                { sig: 'arr.at(-2)',                         old: 'arr[arr.length - 2]',             note: 'second from end' },
                { sig: 'str.padStart(6, "0")',               old: 'while loop adding zeros',         note: 'pad string on left to target length' },
                { sig: 'str.padEnd(10, " ")',                old: 'str + " ".repeat(n)',             note: 'pad string on right to target length' },
                { sig: 'str.replaceAll("-", "_")',           old: 'str.replace(/-/g, "_")',          note: 'replace all occurrences — no regex needed' },
                { sig: 'Array.from("abc")',                  old: '"abc".split("")',                 note: 'iterable/array-like to array — works on NodeList, Set, Map' },
                { sig: 'Object.fromEntries(entries)',        old: 'reduce to build object',          note: 'array of [key,val] pairs → object (inverse of Object.entries)' },
              ].map(r => (
                <div key={r.sig} className="ljs19-method-row">
                  <code className="ljs19-msig">{r.sig}</code>
                  <span className="ljs19-mold">was: <code>{r.old}</code></span>
                  <span className="ljs19-mnote">{r.note}</span>
                </div>
              ))}
            </div>

            <div className="ljs19-anat-header" style={{ marginTop: 18 }}>// .flatMap() — the most useful of the new methods</div>
            <div className="ljs19-flatmap-demo">
              <pre className="ljs19-code-block">{`// Without flatMap — verbose:
const tagged = wardGroups
  .map((group, i) => group.map(name => name + " (group " + i + ")"))
  .flat();  // ← two steps

// With flatMap — one step:
const tagged = wardGroups
  .flatMap((group, i) => group.map(name => name + " (group " + i + ")"));
//  ↑ flatMap receives (item, index, array) — same as .map()`}</pre>
              <div className="ljs19-flatmap-note">flatMap is map + flat(1) combined. Use it whenever each item maps to an array and you want the result flattened.</div>
            </div>

            <div className="ljs19-mistake">
              <div className="ljs19-mistake-label">⚠ .padStart() pads the STRING — convert number first</div>
              <div className="ljs19-mrows">
                <div className="ljs19-mrow bad"><span className="ljs19-mtag bad-tag">✗</span><code>(42).padStart(6, "0")</code><span className="ljs19-mnote">TypeError — padStart is a String method, not a Number method</span></div>
                <div className="ljs19-mrow good"><span className="ljs19-mtag good-tag">✓</span><code>String(42).padStart(6, "0")</code><span className="ljs19-mnote">or (42).toString().padStart(6, "0") — convert first, then pad</span></div>
              </div>
            </div>
          </div>

          <JsEditor lockedCode={LOCKED}
            initialCode={INITIAL} expectedOutput={EXPECTED} onOutputChange={(_, c) => setOk(c)} height={350} />
        </div>
      </LevelSupportWrapper>
    </Stage2_5Shell>
  );
}
