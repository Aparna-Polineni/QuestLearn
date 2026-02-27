// src/screens/stage2/CodeEditor.jsx
// Reusable code editor with syntax highlighting, run button, output panel
// Used across all Stage 2-8 coding levels

import { useState, useRef } from 'react';
import './CodeEditor.css';

// ── Minimal Java syntax highlighter ───────────────────────────────────────
function highlight(code) {
  const keywords = [
    'public','private','protected','static','final','void','class','new',
    'return','if','else','for','while','do','break','continue','import',
    'package','extends','implements','interface','abstract','try','catch',
    'finally','throw','throws','instanceof','this','super','null','true',
    'false','enum','switch','case','default'
  ];
  const types = ['int','long','double','float','boolean','char','byte','short','String','var'];

  // Escape HTML first
  let result = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Strings
  result = result.replace(/"([^"\\]|\\.)*"/g, m => `<span class="tok-string">${m}</span>`);
  // Comments
  result = result.replace(/\/\/[^\n]*/g, m => `<span class="tok-comment">${m}</span>`);
  result = result.replace(/\/\*[\s\S]*?\*\//g, m => `<span class="tok-comment">${m}</span>`);
  // Numbers
  result = result.replace(/\b(\d+\.?\d*[fFdDlL]?)\b/g, `<span class="tok-number">$1</span>`);
  // Types
  types.forEach(t => {
    result = result.replace(
      new RegExp(`\\b(${t})\\b`, 'g'),
      `<span class="tok-type">$1</span>`
    );
  });
  // Keywords
  keywords.forEach(k => {
    result = result.replace(
      new RegExp(`\\b(${k})\\b`, 'g'),
      `<span class="tok-keyword">$1</span>`
    );
  });
  // Method calls
  result = result.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)(\s*\()/g, `<span class="tok-method">$1</span>$2`);
  // Annotations
  result = result.replace(/@[A-Za-z]+/g, m => `<span class="tok-annotation">${m}</span>`);

  return result;
}

// ── Line numbers ───────────────────────────────────────────────────────────
function LineNumbers({ code }) {
  const lines = code.split('\n').length;
  return (
    <div className="line-numbers">
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className="line-number">{i + 1}</div>
      ))}
    </div>
  );
}

// ── Main CodeEditor ────────────────────────────────────────────────────────
function CodeEditor({
  initialCode = '',
  expectedOutput = '',
  onOutputChange,
  readOnlyRanges = [],   // [{start, end}] line ranges player cannot edit
  hints = [],
  language = 'java',
  height = 320,
}) {
  const [code,        setCode]        = useState(initialCode);
  const [output,      setOutput]      = useState('');
  const [isRunning,   setIsRunning]   = useState(false);
  const [isCorrect,   setIsCorrect]   = useState(false);
  const [runCount,    setRunCount]    = useState(0);
  const [showHint,    setShowHint]    = useState(false);
  const [hintIndex,   setHintIndex]   = useState(0);
  const textareaRef = useRef(null);

  // Simulate Java execution via pattern matching
  // Real execution would need a backend — this covers the core learning patterns
  function simulateJava(src) {
    const lines = [];

    // System.out.println / print
    const printlnMatches = [...src.matchAll(/System\.out\.println\s*\((.*?)\)\s*;/g)];
    const printMatches   = [...src.matchAll(/System\.out\.print\s*\((.*?)\)\s*;(?!\s*ln)/g)];

    // Evaluate simple expressions
    function evalExpr(expr) {
      expr = expr.trim();
      // String literal
      if (expr.startsWith('"') && expr.endsWith('"')) return expr.slice(1, -1);
      // String concatenation
      if (expr.includes('+')) {
        return expr.split('+').map(e => evalExpr(e.trim())).join('');
      }
      // Arithmetic
      try {
        // Safe eval for numbers only
        if (/^[\d\s\+\-\*\/\(\)\.]+$/.test(expr)) {
          return String(Function(`"use strict"; return (${expr})`)());
        }
      } catch {}
      // Variable name — return as-is for simple cases
      return expr.replace(/"/g, '');
    }

    // Collect variable assignments for simple substitution
    const vars = {};
    const varMatches = [...src.matchAll(/(?:int|long|double|float|boolean|String|char|var)\s+(\w+)\s*=\s*([^;]+)\s*;/g)];
    varMatches.forEach(m => {
      vars[m[1]] = evalExpr(m[2]);
    });

    function resolveVars(expr) {
      return expr.replace(/\b([a-zA-Z_]\w*)\b/g, (match) => {
        if (vars[match] !== undefined) return vars[match];
        return match;
      });
    }

    // Process printlns in order
    const allPrints = [
      ...printlnMatches.map(m => ({ match: m, newline: true })),
      ...printMatches.map(m => ({ match: m, newline: false })),
    ].sort((a, b) => a.match.index - b.match.index);

    let outputStr = '';
    allPrints.forEach(({ match, newline }) => {
      let expr = match[1].trim();
      expr = resolveVars(expr);
      const val = evalExpr(expr);
      outputStr += newline ? val + '\n' : val;
    });

    return outputStr.trimEnd();
  }

  function handleRun() {
    setIsRunning(true);
    setRunCount(prev => prev + 1);

    setTimeout(() => {
      try {
        const result = simulateJava(code);
        setOutput(result);

        const correct = expectedOutput
          ? result.trim() === expectedOutput.trim()
          : result.length > 0;

        setIsCorrect(correct);
        if (onOutputChange) onOutputChange(result, correct);
      } catch (err) {
        setOutput(`Error: ${err.message}`);
        setIsCorrect(false);
      }
      setIsRunning(false);
    }, 400); // small delay feels like real compilation
  }

  function handleKeyDown(e) {
    // Tab inserts 4 spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end   = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        e.target.selectionStart = start + 4;
        e.target.selectionEnd   = start + 4;
      }, 0);
    }
    // Ctrl+Enter runs
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleRun();
    }
  }

  function handleReset() {
    setCode(initialCode);
    setOutput('');
    setIsCorrect(false);
    setRunCount(0);
  }

  function revealNextHint() {
    if (hintIndex < hints.length - 1) setHintIndex(prev => prev + 1);
    setShowHint(true);
  }

  return (
    <div className="code-editor">

      {/* Editor toolbar */}
      <div className="editor-toolbar">
        <div className="editor-toolbar-left">
          <span className="editor-lang-tag">{language.toUpperCase()}</span>
          <span className="editor-file-name">Main.java</span>
        </div>
        <div className="editor-toolbar-right">
          {hints.length > 0 && (
            <button
              className="editor-hint-btn"
              onClick={revealNextHint}
            >
              💡 {showHint ? `Hint ${hintIndex + 1}/${hints.length}` : 'Hint'}
            </button>
          )}
          <button className="editor-reset-btn" onClick={handleReset}>
            ↺ Reset
          </button>
          <button
            className={`editor-run-btn ${isRunning ? 'running' : ''}`}
            onClick={handleRun}
            disabled={isRunning}
          >
            {isRunning ? '⟳ Running...' : '▶ Run  Ctrl+Enter'}
          </button>
        </div>
      </div>

      {/* Hint panel */}
      {showHint && hints[hintIndex] && (
        <div className="editor-hint-panel">
          <span className="hint-icon">💡</span>
          <span className="hint-text">{hints[hintIndex]}</span>
          {hintIndex < hints.length - 1 && (
            <button className="hint-next" onClick={revealNextHint}>
              Next hint →
            </button>
          )}
        </div>
      )}

      {/* Code area */}
      <div className="editor-body" style={{ height }}>
        <LineNumbers code={code} />

        {/* Syntax highlighted display layer */}
        <div
          className="editor-highlight"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: highlight(code) + '\n' }}
        />

        {/* Actual textarea — transparent, on top */}
        <textarea
          ref={textareaRef}
          className="editor-textarea"
          value={code}
          onChange={e => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          autoComplete="off"
        />
      </div>

      {/* Output panel */}
      <div className={`editor-output ${output ? (isCorrect ? 'output-correct' : runCount > 0 ? 'output-wrong' : '') : ''}`}>
        <div className="output-header">
          <span className="output-label">
            {output
              ? isCorrect
                ? '✓ Output — correct'
                : runCount > 0 ? '✗ Output — check expected below' : 'Output'
              : 'Output'}
          </span>
          {expectedOutput && (
            <span className="output-expected-label">
              Expected: <code>{expectedOutput}</code>
            </span>
          )}
        </div>
        <pre className="output-content">
          {output || (runCount === 0 ? 'Press Run or Ctrl+Enter to execute your code...' : '(no output)')}
        </pre>
      </div>

    </div>
  );
}

export default CodeEditor;