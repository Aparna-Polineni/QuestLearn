// src/components/JsTestRunner.jsx
// Test-driven BUILD validation for JavaScript levels.
// Runs user's function against an array of test cases — per-test green/red results.
// This is how real coding assessments work (Codility, HackerRank).
// 
// Usage:
//   import JsTestRunner from '../../../components/JsTestRunner';
//
//   const TESTS = [
//     { description: 'handles empty array', input: [[]], expected: 0 },
//     { description: 'sums positive numbers', input: [[1,2,3]], expected: 6 },
//     { description: 'handles negatives', input: [[-1, 5]], expected: 4, hint: 'Check your accumulator initial value' },
//   ];
//
//   <JsTestRunner
//     functionName="sumArray"
//     initialCode="function sumArray(nums) {\n  // your code\n}"
//     tests={TESTS}
//     onAllPassed={() => setCanProceed(true)}
//   />

import { useState } from 'react';
import './JsTestRunner.css';

// ── Serialise any JS value to a readable string ───────────────────────────
function serialize(val) {
  if (val === null)            return 'null';
  if (val === undefined)       return 'undefined';
  if (typeof val === 'string') return JSON.stringify(val);
  if (Array.isArray(val))      return '[' + val.map(serialize).join(', ') + ']';
  if (typeof val === 'object') {
    const pairs = Object.entries(val).map(([k, v]) => `${k}: ${serialize(v)}`);
    return '{ ' + pairs.join(', ') + ' }';
  }
  return String(val);
}

// ── Deep equality with float tolerance ───────────────────────────────────
function deepEqual(a, b) {
  if (a === b) return true;
  if (a === null || b === null) return a === b;
  if (typeof a !== typeof b)    return false;
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) < 0.0001;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => deepEqual(v, b[i]));
  }
  if (typeof a === 'object') {
    const ka = Object.keys(a).sort();
    const kb = Object.keys(b).sort();
    if (!deepEqual(ka, kb)) return false;
    return ka.every(k => deepEqual(a[k], b[k]));
  }
  return false;
}

// ── Run one test case ─────────────────────────────────────────────────────
function runTest(userCode, functionName, testCase, setupCode) {
  try {
    const args = Array.isArray(testCase.input)
      ? testCase.input.map(serialize).join(', ')
      : serialize(testCase.input);

    const fullCode = `
      "use strict";
      ${setupCode || ''}
      ${userCode}
      return ${functionName}(${args});
    `;

    // eslint-disable-next-line no-new-func
    const result = new Function(fullCode)();
    return {
      passed: deepEqual(result, testCase.expected),
      result,
      error:  null,
    };
  } catch (e) {
    return { passed: false, result: undefined, error: e.message };
  }
}

// ── Main component ────────────────────────────────────────────────────────
export default function JsTestRunner({
  functionName,    // name of function user must define
  initialCode,     // starter code shown in editor
  tests,           // [{ description, input, expected, hint? }]
  setupCode,       // code that runs before user code (data defs, helpers)
  lockedCode,      // read-only code shown above editor
  onAllPassed,     // callback when all tests pass
  height = 280,
  language = 'JavaScript',
}) {
  const [code,    setCode]    = useState(initialCode || '');
  const [results, setResults] = useState([]);
  const [ran,     setRan]     = useState(false);
  const [error,   setError]   = useState('');

  const allPassed   = ran && results.length > 0 && results.every(r => r.passed);
  const passCount   = results.filter(r => r.passed).length;

  function runTests() {
    setError('');

    // Syntax check first
    try {
      // eslint-disable-next-line no-new-func
      new Function(`"use strict"; ${setupCode || ''}\n${code}\nreturn typeof ${functionName};`)();
    } catch (e) {
      setError(`Syntax error: ${e.message}`);
      setRan(true);
      setResults([]);
      return;
    }

    const res = tests.map(tc => ({
      ...tc,
      ...runTest(code, functionName, tc, setupCode),
    }));

    setResults(res);
    setRan(true);
    if (res.every(r => r.passed) && onAllPassed) onAllPassed();
  }

  function reset() {
    setCode(initialCode || '');
    setResults([]);
    setRan(false);
    setError('');
  }

  return (
    <div className="jtr-container">

      {/* Header */}
      <div className="jtr-header">
        <span className="jtr-lang-badge">{language}</span>
        <span className="jtr-fn-badge">function {functionName}()</span>
        <div className="jtr-controls">
          <button className="jtr-reset-btn" onClick={reset}>↺ Reset</button>
          <button className="jtr-run-btn"   onClick={runTests}>▶ Run Tests</button>
        </div>
      </div>

      {/* Locked setup code — shown read-only above editor */}
      {lockedCode && (
        <>
          <div className="jtr-section-label">🔒 Given — read only</div>
          <pre className="jtr-locked">{lockedCode}</pre>
          <div className="jtr-section-label">✏️ Your code</div>
        </>
      )}

      {/* Editor */}
      <textarea
        className="jtr-editor"
        style={{ height }}
        value={code}
        onChange={e => { setCode(e.target.value); setRan(false); }}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        placeholder={`// Write your ${functionName}() function here`}
      />

      {/* Test preview — shown before first run */}
      {!ran && (
        <div className="jtr-preview">
          <div className="jtr-preview-label">
            {tests.length} test case{tests.length !== 1 ? 's' : ''} — click ▶ Run Tests to check your code
          </div>
          <div className="jtr-preview-cases">
            {tests.map((t, i) => (
              <div key={i} className="jtr-preview-case">
                <span className="jtr-preview-num">{i + 1}</span>
                <span className="jtr-preview-desc">{t.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Syntax error */}
      {ran && error && (
        <div className="jtr-syntax-error">
          <div className="jtr-err-label">✗ Syntax Error — fix this before your logic can be tested</div>
          <pre className="jtr-err-msg">{error}</pre>
        </div>
      )}

      {/* Test results */}
      {ran && !error && results.length > 0 && (
        <div className="jtr-results">
          <div className="jtr-results-header">
            <span className={`jtr-score ${allPassed ? 'score-all' : passCount > 0 ? 'score-partial' : 'score-none'}`}>
              {passCount} / {results.length} tests passing
            </span>
            {allPassed && <span className="jtr-all-pass">✓ All tests pass — you're done</span>}
          </div>

          <div className="jtr-test-list">
            {results.map((r, i) => (
              <div key={i} className={`jtr-test-item ${r.passed ? 'test-pass' : 'test-fail'}`}>
                <div className="jtr-test-header">
                  <span className="jtr-test-icon">{r.passed ? '✓' : '✗'}</span>
                  <span className="jtr-test-num">Test {i + 1}</span>
                  <span className="jtr-test-desc">{r.description}</span>
                </div>

                {!r.passed && (
                  <div className="jtr-test-detail">
                    <div className="jtr-test-row">
                      <span className="jtr-test-key">Input</span>
                      <code className="jtr-test-val">
                        {Array.isArray(r.input)
                          ? r.input.map(serialize).join(', ')
                          : serialize(r.input)}
                      </code>
                    </div>
                    <div className="jtr-test-row">
                      <span className="jtr-test-key">Expected</span>
                      <code className="jtr-test-val jtr-val-expected">{serialize(r.expected)}</code>
                    </div>
                    <div className="jtr-test-row">
                      <span className="jtr-test-key">Got</span>
                      <code className="jtr-test-val jtr-val-got">
                        {r.error ? `Error: ${r.error}` : serialize(r.result)}
                      </code>
                    </div>
                    {r.hint && <div className="jtr-test-hint">💡 {r.hint}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
