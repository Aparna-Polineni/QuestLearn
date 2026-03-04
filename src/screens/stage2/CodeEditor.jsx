// src/screens/stage2/CodeEditor.jsx
//
// CHANGES IN THIS VERSION (v3):
// ─────────────────────────────────────────────────────────────────────────
// ADDED: Protected lines — comments and existing code cannot be edited
//
//   HOW IT WORKS:
//   The editor no longer uses a single textarea for everything.
//   Instead, the code is split line-by-line into two types:
//
//     LOCKED lines  — shown as styled read-only divs (greyed, no cursor)
//                     These are: comments (// ...) and pre-written code
//                     The student CAN read them but CANNOT click into them
//
//     WRITABLE lines — shown as individual <textarea> elements (one per line)
//                     These are: blank lines, or lines containing // TODO
//                     The student types their answer here
//
//   The level file marks writable lines using a special marker:
//     "// TODO: write your println here"   → becomes an editable slot
//     ""  (empty line inside a method)     → becomes an editable slot
//
//   Everything else — comments, class declaration, method signature,
//   closing braces — is locked and dimmed.
//
// ADDED: Inline hint per writable line
//   Each writable slot shows a soft grey hint text (like a placeholder)
//   that says WHAT to write (e.g. "hint: use System.out.println(...)") 
//   but NOT the answer. The hint disappears when the user starts typing.
//   This replaces the concept of "hints button" for beginner levels.
//
// KEPT: Everything else from v2
//   - Same simulateJava() function (unchanged)
//   - Same Run / Reset / Hints toolbar
//   - Same output panel with correct/wrong states
//   - Same Ctrl+Enter shortcut
//   - Same props API — existing levels still work
//     (if no TODO markers exist, all lines become writable as before)
//
// NEW PROP: writableMarker (optional, default "// TODO")
//   Lines containing this string become editable slots.
//   Example in level file:
//     const INITIAL_CODE = `public class Main {
//         public static void main(String[] args) {
//             // TODO: print your greeting here
//         }
//     }`;
//
// ─────────────────────────────────────────────────────────────────────────

import { useState, useRef, useCallback } from 'react';
import './CodeEditor.css';

// ── Determine if a line should be locked ──────────────────────────────────
// A line is LOCKED (read-only) if it is:
//   - A comment line starting with // (but NOT a TODO marker)
//   - A non-empty, non-TODO code line (class declaration, braces, etc.)
// A line is WRITABLE if it is:
//   - Empty (blank line inside a method body)
//   - Contains the writableMarker (e.g. "// TODO")
function isLineLocked(line, writableMarker) {
  const trimmed = line.trim();

  // Empty lines are writable — student fills them in
  if (trimmed === '') return false;

  // Lines with the TODO marker are writable slots
  if (trimmed.includes(writableMarker)) return false;

  // Everything else is locked: comments, code, braces
  return true;
}

// ── Java simulator (unchanged from v2) ────────────────────────────────────
function simulateJava(src) {
  const vars = {};
  const varMatches = [...src.matchAll(
    /(?:int|long|double|float|boolean|String|char|var)\s+(\w+)\s*=\s*([^;]+)\s*;/g
  )];
  varMatches.forEach(m => { vars[m[1]] = evalExpr(m[2]); });

  function evalExpr(expr) {
    expr = expr.trim();
    if (expr.startsWith('"') && expr.endsWith('"')) return expr.slice(1, -1);
    if (expr.includes('+')) return expr.split('+').map(e => evalExpr(e.trim())).join('');
    try {
      if (/^[\d\s\+\-\*\/\(\)\.]+$/.test(expr))
        return String(Function('"use strict"; return (' + expr + ')')());
    } catch {}
    return expr.replace(/"/g, '');
  }

  function resolveVars(expr) {
    return expr.replace(/\b([a-zA-Z_]\w*)\b/g, m => vars[m] !== undefined ? vars[m] : m);
  }

  const allPrints = [
    ...[...src.matchAll(/System\.out\.println\s*\((.*?)\)\s*;/g)].map(m => ({ match: m, newline: true  })),
    ...[...src.matchAll(/System\.out\.print\s*\((.*?)\)\s*;(?!\s*ln)/g)].map(m => ({ match: m, newline: false })),
  ].sort((a, b) => a.match.index - b.match.index);

  let output = '';
  allPrints.forEach(({ match, newline }) => {
    const val = evalExpr(resolveVars(match[1].trim()));
    output += newline ? val + '\n' : val;
  });
  return output.trimEnd();
}

// ── Line numbers ───────────────────────────────────────────────────────────
function LineNumbers({ count }) {
  return (
    <div className="line-numbers">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="line-number">{i + 1}</div>
      ))}
    </div>
  );
}

// ── Main CodeEditor ────────────────────────────────────────────────────────
function CodeEditor({
  initialCode    = '',
  expectedOutput = '',
  onOutputChange,
  hints          = [],
  language       = 'java',
  height         = 320,
  writableMarker = '// TODO', // ADDED: lines with this text become editable slots
}) {
  const originalLines = initialCode.split('\n');

  // Build initial state: for each line, store its current value
  // Locked lines stay as-is forever; writable lines start as empty string
  const initialLineValues = originalLines.map(line =>
    isLineLocked(line, writableMarker) ? line : ''
  );

  const [lineValues, setLineValues] = useState(initialLineValues);
  const [output,     setOutput]     = useState('');
  const [isRunning,  setIsRunning]  = useState(false);
  const [isCorrect,  setIsCorrect]  = useState(false);
  const [runCount,   setRunCount]   = useState(0);
  const [showHint,   setShowHint]   = useState(false);
  const [hintIndex,  setHintIndex]  = useState(0);

  // Build the full code string for the simulator by merging locked + typed lines
  function buildFullCode() {
    return lineValues.join('\n');
  }

  // Update a single writable line when user types in it
  function handleLineChange(lineIndex, newValue) {
    setLineValues(prev => {
      const next = [...prev];
      next[lineIndex] = newValue;
      return next;
    });
  }

  // Tab in a writable textarea inserts 4 spaces
  function handleLineKeyDown(e, lineIndex) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta    = e.target;
      const start = ta.selectionStart;
      const val   = lineValues[lineIndex];
      const next  = val.substring(0, start) + '    ' + val.substring(ta.selectionEnd);
      handleLineChange(lineIndex, next);
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 4; }, 0);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleRun();
  }

  function handleRun() {
    setIsRunning(true);
    setRunCount(prev => prev + 1);
    setTimeout(() => {
      try {
        const src     = buildFullCode();
        const result  = simulateJava(src);
        const correct = expectedOutput
          ? result.trim() === expectedOutput.trim()
          : result.length > 0;
        setOutput(result);
        setIsCorrect(correct);
        if (onOutputChange) onOutputChange(result, correct);
      } catch (err) {
        setOutput('Error: ' + err.message);
        setIsCorrect(false);
      }
      setIsRunning(false);
    }, 400);
  }

  function handleReset() {
    setLineValues(initialLineValues);
    setOutput('');
    setIsCorrect(false);
    setRunCount(0);
    setShowHint(false);
    setHintIndex(0);
  }

  function revealNextHint() {
    if (hintIndex < hints.length - 1) setHintIndex(p => p + 1);
    setShowHint(true);
  }

  // Extract the placeholder hint from a TODO line
  // "// TODO: print your greeting here" → "hint: print your greeting here"
  function getSlotHint(originalLine) {
    const trimmed = originalLine.trim();
    if (trimmed.startsWith('//')) {
      // Strip the // and "TODO:" prefix to get just the hint text
      return trimmed
        .replace(/^\/\/\s*TODO\s*:?\s*/i, '')
        .trim() || 'type your code here';
    }
    return 'type your code here';
  }

  // Get the indentation of a line so writable slots match indentation
  function getIndent(line) {
    const match = line.match(/^(\s*)/);
    return match ? match[1] : '';
  }

  return (
    <div className="code-editor">

      {/* ── Toolbar ────────────────────────────────────────────────── */}
      <div className="editor-toolbar">
        <div className="editor-toolbar-left">
          <span className="editor-lang-tag">{language.toUpperCase()}</span>
          <span className="editor-file-name">Main.java</span>
        </div>
        <div className="editor-toolbar-right">
          {hints.length > 0 && (
            <button className="editor-hint-btn" onClick={revealNextHint}>
              💡 {showHint ? `Hint ${hintIndex + 1}/${hints.length}` : 'Hint'}
            </button>
          )}
          <button className="editor-reset-btn" onClick={handleReset}>↺ Reset</button>
          <button
            className={`editor-run-btn ${isRunning ? 'running' : ''}`}
            onClick={handleRun}
            disabled={isRunning}
          >
            {isRunning ? '⟳ Running...' : '▶ Run  Ctrl+Enter'}
          </button>
        </div>
      </div>

      {/* ── Hint panel ─────────────────────────────────────────────── */}
      {showHint && hints[hintIndex] && (
        <div className="editor-hint-panel">
          <span className="hint-icon">💡</span>
          <span className="hint-text">{hints[hintIndex]}</span>
          {hintIndex < hints.length - 1 && (
            <button className="hint-next" onClick={revealNextHint}>Next hint →</button>
          )}
        </div>
      )}

      {/* ── Editor body ────────────────────────────────────────────── */}
      {/*                                                               */}
      {/* CHANGED: No longer a single textarea for all lines.           */}
      {/* Now renders each line individually as either:                 */}
      {/*   - A <div class="locked-line"> for read-only lines           */}
      {/*   - A <textarea class="writable-line"> for editable slots     */}
      {/*                                                               */}
      <div className="editor-body" style={{ minHeight: height }}>
        <LineNumbers count={originalLines.length} />

        <div className="editor-lines">
          {originalLines.map((originalLine, i) => {
            const locked = isLineLocked(originalLine, writableMarker);
            const indent = getIndent(originalLine);

            if (locked) {
              // ── Locked line: read-only, dimmed ──────────────────
              // Comments show in comment colour, code in normal colour
              const isComment = originalLine.trim().startsWith('//');
              return (
                <div
                  key={i}
                  className={`editor-line locked-line ${isComment ? 'locked-comment' : 'locked-code'}`}
                  // No onClick, no contentEditable — truly uneditable
                >
                  {originalLine}
                </div>
              );
            } else {
              // ── Writable slot: inline textarea ──────────────────
              const slotHint = getSlotHint(originalLine);
              return (
                <div key={i} className="editor-line writable-line-wrap">
                  {/* Show indent as non-editable prefix so cursor starts in right place */}
                  {indent && <span className="writable-indent">{indent}</span>}
                  <textarea
                    className="writable-line"
                    value={lineValues[i]}
                    onChange={e => handleLineChange(i, e.target.value)}
                    onKeyDown={e => handleLineKeyDown(e, i)}
                    placeholder={slotHint}
                    rows={1}
                    spellCheck={false}
                    autoCorrect="off"
                    autoCapitalize="off"
                    autoComplete="off"
                  />
                </div>
              );
            }
          })}
        </div>
      </div>

      {/* ── Output panel (unchanged from v2) ───────────────────────── */}
      <div className={`editor-output ${
        output ? isCorrect ? 'output-correct' : runCount > 0 ? 'output-wrong' : '' : ''
      }`}>
        <div className="output-header">
          <span className="output-label">
            {output
              ? isCorrect ? '✓ Output — correct'
                : runCount > 0 ? '✗ Output — does not match expected' : 'Output'
              : 'Output'}
          </span>
          {expectedOutput && (
            <span className="output-expected-label">
              Expected: <code>{expectedOutput}</code>
            </span>
          )}
        </div>
        <pre className="output-content">
          {output || (runCount === 0 ? 'Press Run or Ctrl+Enter to execute...' : '(no output)')}
        </pre>
      </div>

    </div>
  );
}

export default CodeEditor;