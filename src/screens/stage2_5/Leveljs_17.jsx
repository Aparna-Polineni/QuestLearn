// src/screens/stage2_5/LevelJS_17.jsx — Closures & Scope
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2_5Shell from './Stage2_5Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import JsEditor from './JsEditor';
import './LevelJS_17.css';

const SUPPORT = {
  intro: {
    concept: 'Closures & Scope',
    tagline: "A closure is a function that remembers the variables from where it was created — even after that scope is gone.",
    whatYouWillDo: "Write functions that return functions (closures), observe how variables are captured, and see the classic var-in-loop bug that closures fix.",
    whyItMatters: "React hooks ARE closures. useState, useEffect, useCallback all rely on closures to remember state across renders. The infamous stale closure bug in React makes no sense until you understand closures fundamentally.",
  },
  hints: [
    "A closure: function makeCounter() { let count = 0; return function() { count++; return count; }; }. The returned function 'closes over' count — it remembers it even after makeCounter() has finished.",
    "The classic var bug: for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); } — prints 3,3,3 not 0,1,2. var is function-scoped so all callbacks share the SAME i. Fix: use let (block-scoped — each iteration gets its own i).",
    "Practical closure: function makeGreeter(prefix) { return (name) => prefix + ' ' + name; }. const greetDoctor = makeGreeter('Dr.'); greetDoctor('Smith') returns 'Dr. Smith'.",
  ],
  reveal: {
    concept: 'Closures, Lexical Scope & the var Bug',
    whatYouLearned: "Closure: inner function retains access to outer function's variables even after outer function returns. Lexical scope: a function's scope is determined where it's DEFINED, not where it's called. var is function-scoped (shared in loops). let/const are block-scoped (new binding per iteration). Closures power React hooks, event handlers, and module patterns.",
    realWorldUse: "React useState: const [count, setCount] = useState(0). The setCount callback closes over the current render's count. Stale closure bug: useEffect with empty [] captures the initial state — you need the dependency array. Every time you write () => doSomething(id), you've written a closure.",
    developerSays: "The var loop bug caught everyone before let existed. I still test it in interviews — not to trick people, but because 'I know about closures and block scope' is easy to say, but var/let/setTimeout reveals whether you truly understand it.",
  },
};

const INITIAL = `// ── TASK 1: Basic closure ────────────────────────────────────
// Write function makeCounter()
// Inside: let count = 0
// Return a function that increments count and returns it
// const counter = makeCounter()
// Print: counter()  → 1
// Print: counter()  → 2
// Print: counter()  → 3

// TODO

// ── TASK 2: Closure with parameter ───────────────────────────
// Write function makeGreeter(prefix)
// Returns an arrow function: (name) => prefix + ". " + name
// const greetDoctor = makeGreeter("Dr")
// const greetNurse  = makeGreeter("Nurse")
// Print: greetDoctor("Smith")   → "Dr. Smith"
// Print: greetNurse("Johnson")  → "Nurse. Johnson"

// TODO

// ── TASK 3: let fixes the var loop bug ───────────────────────
// Use let in a for loop (i = 0 to 2)
// Inside: store an arrow function in an array: () => i
// After loop: call each function and print its value
// Expected: 0  then 1  then 2
// (if you accidentally use var, all three will print 3)

const funcs = [];
// TODO: for loop with LET, push () => i to funcs
// TODO: funcs.forEach(f => console.log(f()))`;

const EXPECTED = `1\n2\n3\nDr. Smith\nNurse. Johnson\n0\n1\n2`;

export default function LevelJS_17() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);
  return (
    <Stage2_5Shell levelId={17} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div className="ljs17-container">
          <div className="ljs17-brief">
            <div className="ljs17-brief-tag">// Build Mission</div>
            <h2>Master closures for your <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'system'}</span>.</h2>
            <p>Three tasks. Write only in the <code>// TODO</code> lines.</p>
            <div className="ljs17-expected-box">
              <div className="ljs17-expected-label">Expected output</div>
              <pre className="ljs17-expected-output">{EXPECTED}</pre>
            </div>
          </div>

          <div className="ljs17-anatomy">
            <div className="ljs17-anat-header">// What a closure is — visualised</div>
            <div className="ljs17-closure-visual">
              <pre className="ljs17-code-block">{`function makeCounter() {       // ← outer function
  let count = 0;               // ← this variable is "captured"

  return function() {          // ← inner function (the closure)
    count++;                   //   remembers 'count' from outer scope
    return count;              //   even after makeCounter() has returned
  };
}

const counter = makeCounter(); // makeCounter() is done — count still lives!
console.log(counter());        // → 1  (count = 1)
console.log(counter());        // → 2  (count = 2, same count variable)`}</pre>
              <div className="ljs17-visual-note">
                <span className="ljs17-capture-label">🔒 Captured</span>
                The inner function holds a reference to <code>count</code> — not a copy of its value. Every call mutates the same variable.
              </div>
            </div>

            <div className="ljs17-anat-header" style={{ marginTop: 18 }}>// var vs let in loops — the classic bug</div>
            <div className="ljs17-compare">
              <div className="ljs17-col var-col">
                <div className="ljs17-col-title" style={{ color: '#f87171' }}>✗ var — shared, broken</div>
                <pre className="ljs17-code-block">{`const funcs = [];
for (var i = 0; i < 3; i++) {
  funcs.push(() => i);
  // ALL closures share the SAME 'i'
}
// After loop: i === 3
funcs.forEach(f => console.log(f()));
// → 3, 3, 3  (not 0, 1, 2!)`}</pre>
                <div className="ljs17-col-note">var is function-scoped — one i for all iterations</div>
              </div>
              <div className="ljs17-col let-col">
                <div className="ljs17-col-title" style={{ color: '#4ade80' }}>✓ let — per-iteration binding</div>
                <pre className="ljs17-code-block">{`const funcs = [];
for (let i = 0; i < 3; i++) {
  funcs.push(() => i);
  // Each iteration gets its OWN 'i'
}
// Each closure captured a different i
funcs.forEach(f => console.log(f()));
// → 0, 1, 2  ✓`}</pre>
                <div className="ljs17-col-note">let is block-scoped — new binding each loop</div>
              </div>
            </div>

            <div className="ljs17-anat-header" style={{ marginTop: 18 }}>// Where you see closures every day in React</div>
            <div className="ljs17-method-grid">
              {[
                { sig: 'onClick={() => handleDelete(id)}',            note: 'arrow function closes over id from the current render' },
                { sig: 'useEffect(() => { fetch(url); }, [url])',     note: 'effect closes over url — dependency array tells React when to re-capture' },
                { sig: 'const [count, setCount] = useState(0)',       note: 'setCount callback closes over the current state snapshot' },
                { sig: 'patients.map(p => <Card key={p.id} name={p.name} />)', note: 'each arrow function closes over its specific p variable' },
              ].map(r => (
                <div key={r.sig} className="ljs17-method-row">
                  <code className="ljs17-msig">{r.sig}</code>
                  <span className="ljs17-mnote">{r.note}</span>
                </div>
              ))}
            </div>
          </div>

          <JsEditor initialCode={INITIAL} expectedOutput={EXPECTED} onOutputChange={(_, c) => setOk(c)} height={300} />
        </div>
      </LevelSupportWrapper>
    </Stage2_5Shell>
  );
}
