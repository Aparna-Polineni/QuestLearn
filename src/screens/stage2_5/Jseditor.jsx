// src/screens/stage2_5/JSEditor.jsx
// Runs user's JavaScript in the browser via Function() — safe sandbox for exercises
import { useState, useRef } from 'react';
import './JSEditor.css';

export default function JSEditor({ initialCode, expectedOutput, onOutputChange, height = 320, writableMarker = '// TODO' }) {
  const [code, setCode]     = useState(initialCode);
  const [output, setOutput] = useState('');
  const [correct, setCorrect] = useState(false);
  const [ran, setRan]       = useState(false);
  const [err, setErr]       = useState('');

  function runCode() {
    setErr('');
    const lines = [];
    try {
      // Override console.log to capture output
      const origLog = console.log;
      const capturedLog = (...args) => {
        lines.push(args.map(a => {
          if (Array.isArray(a)) return JSON.stringify(a).replace(/"/g,'').replace('[','[').replace(']',']');
          if (a === null) return 'null';
          if (a === undefined) return 'undefined';
          return String(a);
        }).join(' '));
        origLog(...args);
      };
      // eslint-disable-next-line no-new-func
      const fn = new Function('console', code);
      fn({ log: capturedLog, error: capturedLog, warn: capturedLog });
      const result = lines.join('\n');
      setOutput(result);
      const isCorrect = result.trim() === expectedOutput.trim();
      setCorrect(isCorrect);
      setRan(true);
      onOutputChange && onOutputChange(result, isCorrect);
    } catch(e) {
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

  // Highlight writableMarker lines
  const lines = code.split('\n');

  return (
    <div className="jse-container">
      <div className="jse-header">
        <span className="jse-lang-badge">JavaScript</span>
        <div className="jse-controls">
          <button className="jse-reset-btn" onClick={resetCode}>↺ Reset</button>
          <button className="jse-run-btn" onClick={runCode}>▶ Run</button>
        </div>
      </div>
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
      {ran && (
        <div className={`jse-output ${correct ? 'jse-correct' : 'jse-wrong'}`}>
          <div className="jse-output-header">
            <span className="jse-output-label">{correct ? '✓ Output — Correct!' : err ? '✗ Error' : '✗ Output — Not quite'}</span>
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