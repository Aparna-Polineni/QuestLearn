// src/screens/stage2/SimpleCodeEditor.jsx
import { useState } from 'react';
import './SimpleCodeEditor.css';

export default function SimpleCodeEditor({
  initialCode = '',
  expectedOutput = '',
  onOutputChange,
  steps = [],
  height = 380,
}) {
  const [code,      setCode]      = useState(initialCode);
  const [output,    setOutput]    = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [hasRun,    setHasRun]    = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep,setActiveStep]= useState(0);

  function evalExpr(expr, vars = {}) {
    expr = expr.trim();
    if (!expr) return '';
    if (expr.startsWith('"') && expr.endsWith('"')) return expr.slice(1, -1);
    if (expr.startsWith("'") && expr.endsWith("'")) return expr.slice(1, -1);
    if (expr === 'true') return 'true';
    if (expr === 'false') return 'false';
    if (expr.includes('+')) {
      return expr.split(/\+(?=(?:[^"]*"[^"]*")*[^"]*$)/)
        .map(p => evalExpr(p.trim(), vars)).join('');
    }
    if (/^[\d\s\+\-\*\/\(\)\.]+$/.test(expr)) {
      try { return String(Function('"use strict"; return (' + expr + ')')()) } catch {}
    }
    if (vars[expr] !== undefined) return String(vars[expr]);
    return expr.replace(/"/g, '');
  }

  function runCode(src) {
    const vars = {};
    const varRe = /(?:int|long|double|float|boolean|String|char|var)\s+(\w+)\s*=\s*([^;]+)\s*;/g;
    for (const m of src.matchAll(varRe)) {
      vars[m[1]] = evalExpr(m[2].trim(), vars);
    }
    const allPrints = [];
    for (const m of src.matchAll(/System\.out\.println\s*\(([^)]*)\)\s*;/g))
      allPrints.push({ index: m.index, expr: m[1].trim(), newline: true });
    for (const m of src.matchAll(/System\.out\.print\s*\(([^)]*)\)\s*;/g))
      allPrints.push({ index: m.index, expr: m[1].trim(), newline: false });
    allPrints.sort((a, b) => a.index - b.index);
    return allPrints.map(p => {
      const resolved = p.expr.replace(/\b([a-zA-Z_]\w*)\b/g, x => vars[x] !== undefined ? '"' + vars[x] + '"' : x);
      const val = evalExpr(resolved, vars);
      return p.newline ? val + '\n' : val;
    }).join('').trimEnd();
  }

  function handleRun() {
    setIsRunning(true);
    setTimeout(() => {
      try {
        const result = runCode(code);
        const out = result || '(no output — did you write System.out.println?)';
        setOutput(out);
        const correct = expectedOutput ? result.trim() === expectedOutput.trim() : result.length > 0;
        setIsCorrect(correct);
        setHasRun(true);
        if (onOutputChange) onOutputChange(result, correct);
      } catch (err) {
        setOutput('Something went wrong: ' + err.message);
        setIsCorrect(false);
        setHasRun(true);
      }
      setIsRunning(false);
    }, 600);
  }

  function handleReset() {
    setCode(initialCode);
    setOutput('');
    setIsCorrect(false);
    setHasRun(false);
    setActiveStep(0);
  }

  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const s = e.target.selectionStart;
      const newCode = code.substring(0, s) + '    ' + code.substring(e.target.selectionEnd);
      setCode(newCode);
      setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = s + 4; }, 0);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleRun();
  }

  const lines = code.split('\n');

  return (
    <div className="sce-root">

      {steps.length > 0 && (
        <div className="sce-steps">
          <div className="sce-steps-label">📋 Follow these steps in order</div>
          <div className="sce-steps-list">
            {steps.map((step, i) => (
              <button key={i}
                className={'sce-step' + (i === activeStep ? ' sce-step-active' : '') + (i < activeStep ? ' sce-step-done' : '')}
                onClick={() => setActiveStep(i)}>
                <span className="sce-step-num">{i < activeStep ? '✓' : i + 1}</span>
                <div className="sce-step-body">
                  <div className="sce-step-text">{step.instruction}</div>
                  {step.lineHint && i === activeStep && (
                    <div className="sce-step-hint">→ {step.lineHint}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="sce-editor-wrap">
        <div className="sce-toolbar">
          <div className="sce-toolbar-left">
            <span className="sce-file-badge">📄 Main.java</span>
            <span className="sce-line-count">{lines.length} lines</span>
          </div>
          <button className="sce-reset-btn" onClick={handleReset}>↺ Start Over</button>
        </div>

        <div className="sce-editor-body" style={{ minHeight: height }}>
          <div className="sce-line-nums" aria-hidden="true">
            {lines.map((_, i) => <div key={i} className="sce-line-num">{i + 1}</div>)}
          </div>
          <textarea
            className="sce-textarea"
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            autoComplete="off"
            placeholder="// Type your Java code here..."
          />
        </div>

        <div className="sce-run-row">
          <div className="sce-run-tip">
            {isCorrect ? '✓ Output matches — level complete!'
              : hasRun ? '✗ Not quite — compare your output with expected below'
              : 'Press Run when ready  (or Ctrl + Enter)'}
          </div>
          <button
            className={'sce-run-btn' + (isRunning ? ' sce-running' : '') + (isCorrect ? ' sce-correct' : '')}
            onClick={handleRun}
            disabled={isRunning}>
            {isRunning ? '⟳  Running...' : isCorrect ? '✓  Correct!' : '▶  Run Code'}
          </button>
        </div>
      </div>

      {hasRun && (
        <div className={'sce-output ' + (isCorrect ? 'sce-output-ok' : 'sce-output-err')}>
          <div className="sce-output-header">
            <span className="sce-output-title">{isCorrect ? '✅ Your output' : '📺 Your output'}</span>
            {expectedOutput && !isCorrect && (
              <span className="sce-output-vs">expected: <code>{expectedOutput}</code></span>
            )}
          </div>
          <div className={'sce-output-body ' + (isCorrect ? 'sce-output-single' : 'sce-output-compare')}>
            <div className="sce-output-box">
              <div className="sce-output-box-label">Your output</div>
              <pre className="sce-output-text">{output}</pre>
            </div>
            {expectedOutput && !isCorrect && (
              <div className="sce-output-box sce-output-box-expected">
                <div className="sce-output-box-label">Expected output</div>
                <pre className="sce-output-text">{expectedOutput}</pre>
              </div>
            )}
          </div>
          {hasRun && !isCorrect && expectedOutput && output && (
            <div className="sce-diff-hint">
              <span>🔍</span>
              <span>Compare your output character by character. Common issues: wrong capitalisation, missing punctuation, extra spaces.</span>
            </div>
          )}
        </div>
      )}

    </div>
  );
}