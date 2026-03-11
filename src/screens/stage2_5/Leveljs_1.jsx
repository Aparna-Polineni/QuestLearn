// src/screens/stage2_5/LevelJS_1.jsx — Variables & Types
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2_5Shell from './Stage2_5Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import JSEditor from './Jseditor';
import './LevelJS_1.css';

const SUPPORT = {
  intro: {
    concept: 'Variables & Types',
    tagline: "JavaScript has 7 primitive types. let and const replaced var — always prefer them.",
    whatYouWillDo: "Declare variables with let and const, use typeof to inspect types, and print their values.",
    whyItMatters: "Every React component holds state as variables. Understanding const vs let prevents accidental reassignment bugs. typeof helps you debug unexpected API responses.",
  },
  hints: [
    "const for values that never reassign: const name = 'Alice'; — trying to reassign const throws a TypeError. let for values that change: let age = 30; age = 31; is fine.",
    "JavaScript types: string ('text'), number (42 or 3.14), boolean (true/false), null (intentional empty), undefined (not yet assigned). typeof returns the type as a lowercase string.",
    "Template literals use backticks: console.log(`Name: ${name}`); — the ${} interpolates any expression. Much cleaner than 'Name: ' + name.",
  ],
  reveal: {
    concept: 'Variables, Types & const vs let',
    whatYouLearned: "const: block-scoped, cannot be reassigned (but object contents can mutate). let: block-scoped, can be reassigned. var: function-scoped, hoisted — avoid it. Primitive types: string, number, boolean, null, undefined, symbol, bigint. typeof null === 'object' is a famous JS bug — don't rely on it.",
    realWorldUse: "In React, component state is const: const [count, setCount] = useState(0). You never reassign count directly — you call setCount. Understanding why count is const (it's the current snapshot) is foundational to understanding React's data model.",
    developerSays: "Rule I follow: always start with const. If the linter complains that it needs reassignment, change to let. Never use var — it has function scope and hoisting that causes subtle bugs. This rule alone prevents a whole class of React bugs.",
  },
};

const INITIAL_CODE = `// ── TASK 1: Variables ───────────────────────────────────────
// Declare a const called 'patientName' with value "Alice Smith"
// Declare a const called 'ward' with value "Cardiology"
// Declare a let called 'age' with value 34
// Print: "Patient: Alice Smith, Ward: Cardiology, Age: 34"
// Use a template literal with backticks!

// TODO: declare patientName, ward, age then console.log

// ── TASK 2: typeof ───────────────────────────────────────────
// Declare a const 'isActive' = true
// Declare a const 'score' = 98.5
// Print: "isActive type: boolean"
// Print: "score type: number"

// TODO: declare isActive, score then print their typeof`;

const EXPECTED = `Patient: Alice Smith, Ward: Cardiology, Age: 34\nisActive type: boolean\nscore type: number`;

export default function LevelJS_1() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);
  return (
    <Stage2_5Shell levelId={1} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div className="ljs1-container">
          <div className="ljs1-brief">
            <div className="ljs1-brief-tag">// Build Mission</div>
            <h2>Declare variables for your <span style={{color:selectedDomain?.color}}>{selectedDomain?.name||'system'}</span>.</h2>
            <p>Two tasks. Write only in the <code>// TODO</code> lines.</p>
            <div className="ljs1-expected-box">
              <div className="ljs1-expected-label">Expected output</div>
              <pre className="ljs1-expected-output">{EXPECTED}</pre>
            </div>
          </div>

          {/* Anatomy */}
          <div className="ljs1-anatomy">
            <div className="ljs1-anat-header">// const vs let vs var — side by side</div>
            <div className="ljs1-compare">
              {[
                { kw:'const', col:'#4ade80', badge:'PREFERRED', facts:['block-scoped','cannot be reassigned','object contents can still mutate','use for everything by default'], bad:'const x = 1; x = 2; // TypeError!'},
                { kw:'let',   col:'#38bdf8', badge:'WHEN NEEDED', facts:['block-scoped','can be reassigned','use when value must change','replaces var for reassignable vars'], bad:''},
                { kw:'var',   col:'#f87171', badge:'AVOID', facts:['function-scoped (not block)','hoisted to top of function','causes subtle bugs in loops','never use in modern JS'], bad:'for (var i=0; i<3; i++) {} // i leaks out of loop!'},
              ].map(c => (
                <div key={c.kw} className="ljs1-compare-col" style={{borderTopColor:c.col}}>
                  <div className="ljs1-compare-title">
                    <span className="ljs1-col-badge" style={{color:c.col,borderColor:c.col+'55',background:c.col+'18'}}>{c.badge}</span>
                    <code style={{color:c.col}}>{c.kw}</code>
                  </div>
                  <ul className="ljs1-facts">
                    {c.facts.map((f,i) => <li key={i}>{f}</li>)}
                  </ul>
                  {c.bad && <div className="ljs1-bad-example"><span className="ljs1-bad-tag">✗</span><code>{c.bad}</code></div>}
                </div>
              ))}
            </div>

            <div className="ljs1-anat-header" style={{marginTop:18}}>// JavaScript primitive types</div>
            <div className="ljs1-type-grid">
              {[
                { type:'string',    eg:'"Alice"',    note:'text — in single, double, or backtick quotes' },
                { type:'number',    eg:'42  3.14',   note:'integers and floats are the same type' },
                { type:'boolean',   eg:'true false', note:'logical true or false' },
                { type:'null',      eg:'null',       note:'intentional empty value — set by you' },
                { type:'undefined', eg:'undefined',  note:'not yet assigned — JS sets this automatically' },
                { type:'object',    eg:'{}  []',     note:'objects and arrays (typeof null === "object" is a famous bug)' },
              ].map(t => (
                <div key={t.type} className="ljs1-type-row">
                  <code className="ljs1-type-name">{t.type}</code>
                  <code className="ljs1-type-eg">{t.eg}</code>
                  <span className="ljs1-type-note">{t.note}</span>
                </div>
              ))}
            </div>

            <div className="ljs1-mistake">
              <div className="ljs1-mistake-label">⚠ Template literals need backticks, not quotes</div>
              <div className="ljs1-mistake-rows">
                <div className="ljs1-mistake-row bad"><span className="ljs1-mtag bad-tag">✗</span><code>"Patient: $&#123;name&#125;"</code><span className="ljs1-mnote">double quotes — prints literally as $&#123;name&#125;</span></div>
                <div className="ljs1-mistake-row good"><span className="ljs1-mtag good-tag">✓</span><code>{"`Patient: ${name}`"}</code><span className="ljs1-mnote">backticks — interpolates the value of name</span></div>
              </div>
            </div>
          </div>

          <JSEditor initialCode={INITIAL_CODE} expectedOutput={EXPECTED} onOutputChange={(_,c)=>setOk(c)} height={240} />
        </div>
      </LevelSupportWrapper>
    </Stage2_5Shell>
  );
}