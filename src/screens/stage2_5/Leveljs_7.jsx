// LevelJS_7.jsx — Template Literals & Operators
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2_5Shell from './Stage2_5Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import JsEditor from './JsEditor';
import './LevelJS_7.css';

const SUPPORT = {
  intro:{concept:'Template Literals & Operators',tagline:"Template literals clean up string building. Modern operators handle null safely.",whatYouWillDo:"Build strings with template literals, use the nullish coalescing operator ??, and safely chain with optional chaining ?.",whyItMatters:"React renders strings constantly. Null checks with ?? and ?. prevent 'Cannot read property of undefined' — the most common React runtime error."},
  hints:["Template literal: use backticks. const msg = `Patient: ${patient.name}, Ward: ${patient.ward}`; — ${} accepts any expression: `Total: ${a + b}`, `Active: ${isActive ? 'yes' : 'no'}`.","Nullish coalescing: value ?? 'default' — returns 'default' only if value is null or undefined. Different from || which also triggers on 0, '', false.","Optional chaining: patient?.address?.city — returns undefined if any step is null/undefined instead of throwing. Safe for deeply nested API data."],
  reveal:{concept:'Template Literals, ??, and ?.',whatYouLearned:"Template literals: `text ${expr} text`. Multi-line without \\n: just press enter inside backticks. ?? vs ||: ?? is safer — only triggers on null/undefined, not falsy values like 0 or ''. ?. optional chaining: obj?.prop?.nested — returns undefined instead of throwing.",realWorldUse:"React render: return <div>{`${patient.name} — ${patient.ward}`}</div>. Safe access: const city = patient?.address?.city ?? 'Unknown'. Every time you render API data that might be null, you need ?? and ?..",developerSays:"?? replaced a lot of verbose null checks. Before: const name = patient && patient.name ? patient.name : 'Unknown'. After: const name = patient?.name ?? 'Unknown'. One line, perfectly safe."},
};

const INITIAL = `const patient = { name: "Alice Smith", ward: "Cardiology", age: 34 };
const address = null; // no address on file

// ── TASK 1: Template literal ──────────────────────────────────
// Print: "Patient: Alice Smith | Ward: Cardiology | Age: 34"
// Use ONE template literal (backticks)

// TODO

// ── TASK 2: Nullish coalescing (??) ──────────────────────────
// patient.phone is undefined — use ?? to default to "No phone"
// Print: "Phone: No phone"
// patient.age is 0 in a new record — use ?? to show 0, not "Unknown"
// const newAge = 0;  newAge ?? "Unknown"  should give 0, not "Unknown"
// Print: "New age: 0"

// TODO

// ── TASK 3: Optional chaining (?.) ───────────────────────────
// address is null — safely access address?.city
// Use ?? to default to "No address"
// Print: "City: No address"
// Access patient?.name — this IS defined
// Print: "Name: Alice Smith"

// TODO`;

const EXPECTED = `Patient: Alice Smith | Ward: Cardiology | Age: 34\nPhone: No phone\nNew age: 0\nCity: No address\nName: Alice Smith`;

export default function LevelJS_7() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);
  return (
    <Stage2_5Shell levelId={7} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div className="ljs7-container">
          <div className="ljs7-brief">
            <div className="ljs7-brief-tag">// Build Mission</div>
            <h2>Safe strings and null handling for your <span style={{color:selectedDomain?.color}}>{selectedDomain?.name||'system'}</span>.</h2>
            <p>Three tasks. The patient and address variables are given. Write only in the <code>// TODO</code> lines.</p>
            <div className="ljs7-expected-box">
              <div className="ljs7-expected-label">Expected output</div>
              <pre className="ljs7-expected-output">{EXPECTED}</pre>
            </div>
          </div>

          <div className="ljs7-anatomy">
            <div className="ljs7-anat-header">// ?? (nullish coalescing) vs || (logical OR)</div>
            <div className="ljs7-compare">
              <div className="ljs7-col nn-col">
                <div className="ljs7-col-title" style={{color:'#4ade80'}}>?? — nullish coalescing (use this)</div>
                <pre className="ljs7-code-block">{`null     ?? "default"  // → "default"
undefined ?? "default"  // → "default"
0         ?? "default"  // → 0       ← keeps 0!
""        ?? "default"  // → ""      ← keeps empty string!
false     ?? "default"  // → false   ← keeps false!`}</pre>
                <div className="ljs7-col-note">Only triggers on null or undefined — safe for numeric and boolean fields</div>
              </div>
              <div className="ljs7-col or-col">
                <div className="ljs7-col-title" style={{color:'#f87171'}}>|| — logical OR (be careful)</div>
                <pre className="ljs7-code-block">{`null     || "default"  // → "default"
undefined || "default"  // → "default"
0         || "default"  // → "default" ← BUG for numbers!
""        || "default"  // → "default" ← BUG for strings!
false     || "default"  // → "default" ← BUG for booleans!`}</pre>
                <div className="ljs7-col-note">Triggers on ANY falsy value — causes bugs with age=0, count=0, empty strings</div>
              </div>
            </div>

            <div className="ljs7-anat-header" style={{marginTop:18}}>// Optional chaining (?.) — safe nested access</div>
            <div className="ljs7-method-grid">
              {[
                {sig:'patient?.name',              note:'undefined if patient is null/undefined, else patient.name'},
                {sig:'patient?.address?.city',      note:'chain multiple — stops at first null/undefined'},
                {sig:'patients?.[0]?.name',         note:'array access — safe even if patients is null'},
                {sig:'patient?.getName?.()',        note:'method call — only calls if getName exists'},
                {sig:'patient?.address?.city ?? "Unknown"', note:'combine ?. and ?? for safe default'},
              ].map(r => (
                <div key={r.sig} className="ljs7-method-row">
                  <code className="ljs7-msig">{r.sig}</code>
                  <span className="ljs7-mnote">{r.note}</span>
                </div>
              ))}
            </div>

            <div className="ljs7-mistake">
              <div className="ljs7-mistake-label">⚠ The most common React crash — and how to prevent it</div>
              <div className="ljs7-mrows">
                <div className="ljs7-mrow bad"><span className="ljs7-mtag bad-tag">✗ Crash</span><code>console.log(patient.address.city)</code><span className="ljs7-mnote">TypeError: Cannot read properties of null — address is null</span></div>
                <div className="ljs7-mrow good"><span className="ljs7-mtag good-tag">✓ Safe</span><code>console.log(patient?.address?.city ?? "No address")</code><span className="ljs7-mnote">returns "No address" — never throws</span></div>
              </div>
            </div>
          </div>

          <JsEditor initialCode={INITIAL} expectedOutput={EXPECTED} onOutputChange={(_,c)=>setOk(c)} height={280} />
        </div>
      </LevelSupportWrapper>
    </Stage2_5Shell>
  );
}
