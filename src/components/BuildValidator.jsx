// src/components/BuildValidator.jsx
// Two validators for BUILD levels:
//
// 1. JsTestRunner  — already in stage2_5/JsTestRunner.jsx (runs code in browser)
//
// 2. RubricValidator — for Java, SQL, Python BUILD levels where we cannot
//    execute code in the browser. Uses keyword/pattern matching against
//    a rubric of required concepts. Honest about what it can and cannot check.

import { useState } from 'react';
import './BuildValidator.css';

// ── RubricValidator ────────────────────────────────────────────────────────
// Each rubric item has:
//   label      — what the user sees ("Uses ArrayList, not array")
//   check(code)— function that returns true/false by scanning the code
//   required   — if true, must pass to proceed (default true)
//   hint       — shown when the check fails

export function RubricValidator({
  language = 'Java',
  rubric,
  onAllPassed,
  solutionCode,
  children,        // the editor (textarea) is passed as children
}) {
  const [results, setResults] = useState([]);
  const [checked, setChecked] = useState(false);
  const [code, setCode]       = useState('');

  // Expose setCode so the editor child can update it
  // We do this via a wrapper div with onInput capture
  function handleEditorChange(e) {
    if (e.target.tagName === 'TEXTAREA') setCode(e.target.value);
  }

  function runRubric() {
    const upper = code.toUpperCase();
    const res = rubric.map(item => ({
      ...item,
      passed: item.check(code, upper),
    }));
    setResults(res);
    setChecked(true);

    const required = res.filter(r => r.required !== false);
    if (required.every(r => r.passed) && onAllPassed) onAllPassed();
  }

  function showSolution() {
    // Signal parent to show solution — or handle here
    setShowSol(true);
  }
  const [showSol, setShowSol] = useState(false);

  const passCount    = results.filter(r => r.passed).length;
  const requiredPass = results.filter(r => r.required !== false && r.passed).length;
  const requiredTotal= results.filter(r => r.required !== false).length;
  const allRequired  = checked && requiredPass === requiredTotal;

  return (
    <div className="rv-container">

      {/* Language badge */}
      <div className="rv-header">
        <span className="rv-lang-badge">{language}</span>
        <span className="rv-mode-badge">BUILD — Rubric Check</span>
        <div className="rv-honest-note">
          ⚠️ We check your logic, not compile it. A future version will run your code server-side.
        </div>
      </div>

      {/* Editor slot — captures textarea changes */}
      <div className="rv-editor-slot" onInput={handleEditorChange}>
        {children}
      </div>

      {/* Rubric preview — always visible */}
      <div className="rv-rubric">
        <div className="rv-rubric-label">
          Your code will be checked against {rubric.length} criteria:
        </div>
        <div className="rv-criteria">
          {rubric.map((item, i) => {
            const result = results[i];
            return (
              <div key={i} className={`rv-criterion ${
                !checked ? '' :
                result?.passed ? 'crit-pass' : 'crit-fail'
              }`}>
                <span className="rv-crit-icon">
                  {!checked ? '○' : result?.passed ? '✓' : '✗'}
                </span>
                <span className="rv-crit-label">{item.label}</span>
                {item.required === false && (
                  <span className="rv-crit-optional">optional</span>
                )}
                {checked && !result?.passed && item.hint && (
                  <div className="rv-crit-hint">💡 {item.hint}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="rv-actions">
        <button className="rv-check-btn" onClick={runRubric}>
          Check My Code
        </button>
        {checked && !allRequired && solutionCode && (
          <button className="rv-sol-btn" onClick={() => setShowSol(s => !s)}>
            {showSol ? 'Hide' : 'Show'} Reference Solution
          </button>
        )}
      </div>

      {/* Score */}
      {checked && (
        <div className={`rv-score ${allRequired ? 'score-pass' : 'score-fail'}`}>
          {allRequired
            ? `✅ All ${requiredTotal} required checks passing — good to go.`
            : `${requiredPass} of ${requiredTotal} required checks passing — keep going.`}
        </div>
      )}

      {/* Reference solution */}
      {showSol && solutionCode && (
        <div className="rv-solution">
          <div className="rv-solution-label">Reference solution</div>
          <pre className="rv-solution-code">{solutionCode}</pre>
          <p className="rv-solution-note">
            Note: your code doesn't have to match this exactly — the rubric
            checks logic, not style. If you pass all criteria, you're correct.
          </p>
        </div>
      )}

    </div>
  );
}

// ── Common rubric helpers — reusable check functions ──────────────────────
export const checks = {
  // Keyword presence
  uses:      (...kws)  => (_, u) => kws.every(kw => u.includes(kw.toUpperCase())),
  usesAny:   (...kws)  => (_, u) => kws.some(kw  => u.includes(kw.toUpperCase())),
  avoids:    (...kws)  => (_, u) => kws.every(kw => !u.includes(kw.toUpperCase())),

  // Method call patterns
  callsMethod: (obj, method) => (c) =>
    new RegExp(`${obj}[\\s\\S]*\\.${method}\\s*\\(`).test(c),

  // Return statement present
  hasReturn: () => (_, u) => u.includes('RETURN'),

  // Minimum lines of logic (rough measure)
  minLines: (n) => (c) => c.split('\n').filter(l => l.trim() && !l.trim().startsWith('//')).length >= n,

  // Pattern match
  matches: (regex) => (c) => regex.test(c),
};

export default RubricValidator;
