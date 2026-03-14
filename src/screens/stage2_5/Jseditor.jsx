// src/screens/stage2_5/JsEditor.jsx
// Runs user's JavaScript in the browser via Function() — safe sandbox for exercises
// Supports optional lockedCode prop — shown as read-only above the editable textarea
import { useState } from 'react';
import './JsEditor.css';

export default function JsEditor({
  initialCode,
  expectedOutput,
  onOutputChange,
  height = 320,
  lockedCode = '',          // read-only code shown above the editor (e.g. given data)
}) {
  const [code, setCode]       = useState(initialCode);
  const [output, setOutput]   = useState('');
  const [correct, setCorrect] = useState(false);
  const [ran, setRan]         = useState(false);
  const [err, setErr]         = useState('');

  function runCode() {
    setErr('');
    const lines = [];
    try {
      const capturedLog = (...args) => {
        lines.push(
          args.map(a => {
            if (Array.isArray(a)) return '[' + a.join(', ') + ']';
            if (a === null) return 'null';
            if (a === undefined) return 'undefined';
            return String(a);
          }).join(' ')
        );
      };
      // Combine locked code + user code so locked data is available at runtime
      const fullCode = (lockedCode ? lockedCode + '\n' : '') + code;
      // eslint-disable-next-line no-new-func
      const fn = new Function('console', fullCode);
      fn({ log: capturedLog, error: capturedLog, warn: capturedLog });
      const result = lines.join('\n');
      setOutput(result);
      const isCorrect = result.trim() === expectedOutput.trim();
      setCorrect(isCorrect);
      setRan(true);
      onOutputChange && onOutputChange(result, isCorrect);
    } catch (e) {
      setErr(e.message);
      setOutput('');
      setCorrect(false);
      setRan(true);
      onOutputChange && onOutputChange('', false);
    }
  }

  function resetCode() {
    setCode(initialCode);
    setOutput('');
    setCorrect(false);
    setRan(false);
    setErr('');
    onOutputChange && onOutputChange('', false);
  }

  return (
    <div className="jse-container">
      <div className="jse-header">
        <span className="jse-lang-badge">JavaScript</span>
        <div className="jse-controls">
          <button className="jse-reset-btn" onClick={resetCode}>↺ Reset</button>
          <button className="jse-run-btn" onClick={runCode}>▶ Run</button>
        </div>
      </div>

      {/* Locked read-only section */}
      {lockedCode && (
        <div className="jse-locked-header">
          <span className="jse-locked-badge">🔒 given — read only</span>
        </div>
      )}
      {lockedCode && (
        <pre className="jse-locked">{lockedCode}</pre>
      )}

      {/* Editable section */}
      {lockedCode && (
        <div className="jse-editable-header">
          <span className="jse-editable-badge">✏️ your code</span>
        </div>
      )}
      <textarea
        className="jse-editor"
        style={{ height }}
        value={code}
        onChange={e => { setCode(e.target.value); setRan(false); setCorrect(false); }}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />

      {/* Output panel */}
      {ran && (
        <div className={`jse-output ${correct ? 'jse-correct' : 'jse-wrong'}`}>
          <div className="jse-output-header">
            <span className="jse-output-label">
              {correct ? '✓ Output — Correct!' : err ? '✗ Error' : '✗ Output — Not quite'}
            </span>
          </div>
          <pre className="jse-output-text">{err || output || '(no output)'}</pre>
          {!correct && !err && (
            <div className="jse-expected">
              <span className="jse-expected-label">Expected:</span>
              <pre className="jse-expected-text">{expectedOutput}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
