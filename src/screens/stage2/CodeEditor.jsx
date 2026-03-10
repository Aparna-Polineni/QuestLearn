// src/screens/stage2/CodeEditor.jsx  (v4)
//
// KEY CHANGE: TODO slots are now clearly visible write-here zones
//
//  BEFORE: TODO lines looked like comments and disappeared when you typed
//  NOW:
//    - TODO lines become a glowing highlighted INPUT BLOCK
//    - The task description stays visible ABOVE the input (never disappears)
//    - The input box has a blinking cursor, placeholder, and green border
//    - Locked code is dimmed; writable zones glow so it is obvious where to write
//    - Multi-line TODO: a TODO comment creates ONE expandable textarea below it

import { useState } from 'react';
import './CodeEditor.css';

// ── Java simulator — line-by-line interpreter ──────────────────────────────
// Handles: primitives, Strings, String arrays, ArrayLists, for-each loops,
// .add() .remove() .size() .get() .contains() .length, string concatenation,
// arithmetic, System.out.println / print
function simulateJava(src) {
  // ── Strip comments and normalise whitespace ────────────────────────────
  const stripped = src
    .replace(/\/\/[^\n]*/g, '')          // remove line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')    // remove block comments
    .trim();

  // ── State ──────────────────────────────────────────────────────────────
  const vars   = {};   // varName → primitive value (string|number|boolean)
  const arrays = {};   // varName → JS array of values
  const lists  = {};   // varName → JS array (ArrayList)
  let   output = '';

  // ── Helpers ────────────────────────────────────────────────────────────

  function evalExpr(expr) {
    expr = expr.trim();
    if (!expr) return '';

    // String literal
    if (/^"[^"]*"$/.test(expr)) return expr.slice(1, -1);

    // Char literal
    if (/^'[^']'$/.test(expr)) return expr.slice(1, -1);

    // Boolean
    if (expr === 'true')  return true;
    if (expr === 'false') return false;
    if (expr === 'null')  return null;

    // list.size()
    const sizeM = expr.match(/^(\w+)\.size\(\)$/);
    if (sizeM && lists[sizeM[1]] !== undefined) return lists[sizeM[1]].length;

    // array.length
    const lenM = expr.match(/^(\w+)\.length$/);
    if (lenM && arrays[lenM[1]] !== undefined) return arrays[lenM[1]].length;

    // list.get(i)
    const getM = expr.match(/^(\w+)\.get\((\d+)\)$/);
    if (getM && lists[getM[1]]) return lists[getM[1]][parseInt(getM[2])] ?? '';

    // list.contains(x)
    const contM = expr.match(/^(\w+)\.contains\((.+)\)$/);
    if (contM && lists[contM[1]]) {
      const val = evalExpr(contM[2]);
      return lists[contM[1]].includes(val);
    }

    // array[i]  or  list.get(i)
    const idxM = expr.match(/^(\w+)\[(\d+)\]$/);
    if (idxM) {
      if (arrays[idxM[1]]) return arrays[idxM[1]][parseInt(idxM[2])] ?? '';
      if (lists[idxM[1]])  return lists[idxM[1]][parseInt(idxM[2])] ?? '';
    }

    // Variable lookup
    if (/^\w+$/.test(expr)) {
      if (vars[expr]   !== undefined) return vars[expr];
      if (arrays[expr] !== undefined) return '[' + arrays[expr].join(', ') + ']';
      if (lists[expr]  !== undefined) return '[' + lists[expr].join(', ') + ']';
      return expr; // unknown — return as-is
    }

    // String / value concatenation with +
    // Split on + but NOT inside quotes
    const parts = splitOnPlus(expr);
    if (parts.length > 1) {
      return parts.map(p => String(evalExpr(p.trim()))).join('');
    }

    // Arithmetic (numbers only)
    try {
      const resolved = expr.replace(/\b([a-zA-Z_]\w*)\b/g, m => {
        if (vars[m] !== undefined) return vars[m];
        if (lists[m] !== undefined) return lists[m].length; // e.g. queue.size() fallback
        return m;
      });
      if (/^[\d\s\+\-\*\/%\(\)\.]+$/.test(resolved))
        return String(Function('"use strict"; return (' + resolved + ')')());
    } catch {}

    return expr.replace(/"/g, '');
  }

  // Split "a + b + c" on top-level + (not inside quotes)
  function splitOnPlus(expr) {
    const parts = [];
    let depth = 0, inStr = false, cur = '';
    for (let i = 0; i < expr.length; i++) {
      const ch = expr[i];
      if (ch === '"' && expr[i-1] !== '\\') { inStr = !inStr; cur += ch; continue; }
      if (inStr) { cur += ch; continue; }
      if (ch === '(' || ch === '[') { depth++; cur += ch; continue; }
      if (ch === ')' || ch === ']') { depth--; cur += ch; continue; }
      if (ch === '+' && depth === 0) { parts.push(cur); cur = ''; continue; }
      cur += ch;
    }
    parts.push(cur);
    return parts;
  }

  // Parse a { "a", "b", "c" } or {"a","b","c"} array literal → JS array
  function parseArrayLiteral(lit) {
    const inner = lit.trim().replace(/^\{/, '').replace(/\}$/, '').trim();
    if (!inner) return [];
    // Split on commas not inside quotes
    const items = []; let cur = '', inQ = false;
    for (const ch of inner) {
      if (ch === '"') { inQ = !inQ; cur += ch; }
      else if (ch === ',' && !inQ) { items.push(evalExpr(cur.trim())); cur = ''; }
      else cur += ch;
    }
    if (cur.trim()) items.push(evalExpr(cur.trim()));
    return items;
  }

  // Tokenise source into logical statements (handles multi-line for blocks)
  function tokeniseStatements(code) {
    // Flatten to single-spaced, split on ; and { } carefully
    return code;
  }

  // ── Execute a block of code (recursive for loops) ─────────────────────
  function execBlock(code) {
    // Remove outer braces if present
    const trimmed = code.trim();
    const inner = trimmed.startsWith('{') && trimmed.endsWith('}')
      ? trimmed.slice(1, -1)
      : trimmed;
    execStatements(inner);
  }

  function execStatements(code) {
    // Split into statements — handle for/if blocks carefully
    const stmts = splitStatements(code);
    stmts.forEach(stmt => execStatement(stmt.trim()));
  }

  // Split code into top-level statements (respects braces)
  function splitStatements(code) {
    const stmts = []; let cur = '', depth = 0, inStr = false;
    for (let i = 0; i < code.length; i++) {
      const ch = code[i];
      if (ch === '"' && code[i-1] !== '\\') { inStr = !inStr; cur += ch; continue; }
      if (inStr) { cur += ch; continue; }
      if (ch === '{') { depth++; cur += ch; continue; }
      if (ch === '}') {
        depth--;
        cur += ch;
        if (depth === 0) { stmts.push(cur.trim()); cur = ''; }
        continue;
      }
      if (ch === ';' && depth === 0) { stmts.push(cur.trim()); cur = ''; continue; }
      cur += ch;
    }
    if (cur.trim()) stmts.push(cur.trim());
    return stmts.filter(s => s.length > 0);
  }

  function execStatement(stmt) {
    if (!stmt || stmt.startsWith('//')) return;

    // ── String[] name = {"a","b","c"};
    const arrDecl = stmt.match(/^(?:String|int|double|float)\s*\[\s*\]\s*(\w+)\s*=\s*(\{[^}]*\})/);
    if (arrDecl) { arrays[arrDecl[1]] = parseArrayLiteral(arrDecl[2]); return; }

    // ── ArrayList<T> name = new ArrayList<>();
    const listDecl = stmt.match(/^(?:ArrayList|List)<\w+>\s+(\w+)\s*=\s*new\s+ArrayList\s*<[^>]*>\s*\(\s*\)/);
    if (listDecl) { lists[listDecl[1]] = []; return; }

    // ── name.add(value)
    const addM = stmt.match(/^(\w+)\.add\((.+)\)$/);
    if (addM && lists[addM[1]] !== undefined) {
      lists[addM[1]].push(evalExpr(addM[2])); return;
    }

    // ── name.remove(value)  — removes first matching element by value
    const remM = stmt.match(/^(\w+)\.remove\((.+)\)$/);
    if (remM && lists[remM[1]] !== undefined) {
      const val = evalExpr(remM[2]);
      const idx = lists[remM[1]].indexOf(val);
      if (idx !== -1) lists[remM[1]].splice(idx, 1);
      return;
    }

    // ── Primitive / String variable declaration:  Type name = expr
    const varDecl = stmt.match(/^(?:int|long|double|float|boolean|String|char|var)\s+(\w+)\s*=\s*(.+)$/);
    if (varDecl) { vars[varDecl[1]] = evalExpr(varDecl[2]); return; }

    // ── Assignment: name = expr
    const assign = stmt.match(/^(\w+)\s*=\s*(.+)$/);
    if (assign && (vars[assign[1]] !== undefined || lists[assign[1]] !== undefined)) {
      vars[assign[1]] = evalExpr(assign[2]); return;
    }

    // ── for-each: for (Type varName : collection) { body }
    const forEach = stmt.match(/^for\s*\(\s*(?:\w+)\s+(\w+)\s*:\s*(\w+)\s*\)\s*(\{[\s\S]*\})$/);
    if (forEach) {
      const [, loopVar, collName, body] = forEach;
      const collection = arrays[collName] || lists[collName] || [];
      collection.forEach(item => {
        vars[loopVar] = item;
        execBlock(body);
      });
      delete vars[loopVar];
      return;
    }

    // ── for (init; condition; update) { body }
    const forLoop = stmt.match(/^for\s*\((.+?);(.+?);(.+?)\)\s*(\{[\s\S]*\})$/);
    if (forLoop) {
      // Basic numeric for loop — limited support
      execStatement(forLoop[1].trim());
      let safety = 0;
      while (safety++ < 1000) {
        const cond = forLoop[2].trim();
        const condVal = evalCondition(cond);
        if (!condVal) break;
        execBlock(forLoop[4]);
        execStatement(forLoop[3].trim() + ';');
      }
      return;
    }

    // ── System.out.println(expr)
    const printlnM = stmt.match(/^System\.out\.println\s*\((.+)\)$/s);
    if (printlnM) { output += String(evalExpr(printlnM[1].trim())) + '\n'; return; }

    // ── System.out.println()  — empty
    if (stmt === 'System.out.println()') { output += '\n'; return; }

    // ── System.out.print(expr)
    const printM = stmt.match(/^System\.out\.print\s*\((.+)\)$/s);
    if (printM) { output += String(evalExpr(printM[1].trim())); return; }

    // ── i++ / i-- / i += n
    const incM = stmt.match(/^(\w+)\s*(\+\+|--)$/);
    if (incM) {
      const v = Number(vars[incM[1]] || 0);
      vars[incM[1]] = incM[2] === '++' ? v + 1 : v - 1;
      return;
    }
    const compAssign = stmt.match(/^(\w+)\s*(\+=|-=|\*=|\/=)\s*(.+)$/);
    if (compAssign) {
      const v = Number(vars[compAssign[1]] || 0);
      const n = Number(evalExpr(compAssign[3]));
      const op = compAssign[2];
      vars[compAssign[1]] = op === '+=' ? v+n : op === '-=' ? v-n : op === '*=' ? v*n : v/n;
      return;
    }
  }

  function evalCondition(cond) {
    cond = cond.trim();
    const ltM = cond.match(/^(.+?)\s*(<)\s*(.+)$/);
    const gtM = cond.match(/^(.+?)\s*(>)\s*(.+)$/);
    const leM = cond.match(/^(.+?)\s*(<=)\s*(.+)$/);
    const geM = cond.match(/^(.+?)\s*(>=)\s*(.+)$/);
    if (leM) return Number(evalExpr(leM[1])) <= Number(evalExpr(leM[3]));
    if (geM) return Number(evalExpr(geM[1])) >= Number(evalExpr(geM[3]));
    if (ltM) return Number(evalExpr(ltM[1])) <  Number(evalExpr(ltM[3]));
    if (gtM) return Number(evalExpr(gtM[1])) >  Number(evalExpr(gtM[3]));
    return Boolean(evalExpr(cond));
  }

  // ── Run ────────────────────────────────────────────────────────────────
  // Extract everything inside main() body
  const mainMatch = stripped.match(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{([\s\S]*)\}/);
  const body = mainMatch ? mainMatch[1] : stripped;
  execStatements(body);

  return output.trimEnd();
}

// ── Syntax token colouring (inline, no dangerouslySetInnerHTML) ────────────
const KW  = new Set(['public','private','static','void','class','new','return','if','else',
  'for','while','import','extends','implements','abstract','try','catch','finally',
  'throw','throws','this','super','null','true','false','interface','abstract']);
const TY  = new Set(['int','long','double','float','boolean','char','byte','short',
  'String','var','ArrayList','List','Map','Set','Optional']);

function tokenise(line) {
  const ci = line.indexOf('//');
  const code = ci >= 0 ? line.slice(0, ci) : line;
  const comment = ci >= 0 ? line.slice(ci) : null;
  const parts = code.split(/(\b\w+\b|"[^"]*"|@\w+|\d+\.?\d*)/g);
  const tokens = parts.map(p => {
    if (!p) return null;
    if (p.startsWith('"')) return <span className="tok-string">{p}</span>;
    if (p.startsWith('@'))  return <span className="tok-annotation">{p}</span>;
    if (/^\d/.test(p))     return <span className="tok-number">{p}</span>;
    if (KW.has(p))         return <span className="tok-keyword">{p}</span>;
    if (TY.has(p))         return <span className="tok-type">{p}</span>;
    return p;
  }).filter(Boolean);
  return [...tokens, comment ? <span className="tok-comment">{comment}</span> : null].filter(Boolean);
}

function CodeLine({ text }) {
  return <>{tokenise(text).map((t, i) => <span key={i}>{t}</span>)}</>;
}

// ── Parse code into segments: locked lines + writable slots ───────────────
// A TODO comment "// TODO: description" creates a writable slot.
// Its task label stays permanently visible above the textarea.
function parseSegments(code, writableMarker) {
  const lines = code.split('\n');
  const segments = []; // { type: 'locked', lines: [...] } | { type: 'slot', label, indent, id }
  let lockedBuffer = [];
  let slotId = 0;

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    const isTodo = trimmed.toLowerCase().includes(writableMarker.toLowerCase());

    if (isTodo) {
      // Flush locked buffer
      if (lockedBuffer.length) {
        segments.push({ type: 'locked', lines: [...lockedBuffer] });
        lockedBuffer = [];
      }
      // Extract the task description after "// TODO:"
      const label = trimmed
        .replace(/^\/\/\s*TODO\s*:?\s*/i, '')
        .trim() || 'Write your code here';
      const indent = line.match(/^(\s*)/)[1];
      segments.push({ type: 'slot', label, indent, id: slotId++ });
    } else {
      lockedBuffer.push(line);
    }
  });

  if (lockedBuffer.length) {
    segments.push({ type: 'locked', lines: lockedBuffer });
  }

  return segments;
}

// ── Writable slot component ────────────────────────────────────────────────
function WritableSlot({ segment, value, onChange, slotNumber, totalSlots }) {
  const lineCount = (value.match(/\n/g) || []).length + 1;
  const rows = Math.max(2, lineCount + 1); // always at least 2 rows

  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.target;
      const s = ta.selectionStart;
      const next = value.substring(0, s) + '    ' + value.substring(ta.selectionEnd);
      onChange(next);
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + 4; }, 0);
    }
  }

  return (
    <div className="writable-slot">
      {/* Task label — always visible, never disappears */}
      <div className="writable-slot-header">
        <span className="writable-slot-badge">Task {slotNumber}/{totalSlots}</span>
        <span className="writable-slot-label">{segment.label}</span>
      </div>
      {/* Indent hint + textarea */}
      <div className="writable-slot-input-row">
        {segment.indent && (
          <span className="writable-slot-indent" aria-hidden="true">
            {segment.indent}
          </span>
        )}
        <textarea
          className="writable-slot-textarea"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={'// write your code here…'}
          rows={rows}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          autoComplete="off"
        />
      </div>
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
  writableMarker = '// TODO',
}) {
  const segments   = parseSegments(initialCode, writableMarker);
  const slotCount  = segments.filter(s => s.type === 'slot').length;
  const initValues = segments.reduce((acc, seg) => {
    if (seg.type === 'slot') acc[seg.id] = '';
    return acc;
  }, {});

  const [slotValues, setSlotValues] = useState(initValues);
  const [output,     setOutput]     = useState('');
  const [isRunning,  setIsRunning]  = useState(false);
  const [isCorrect,  setIsCorrect]  = useState(false);
  const [runCount,   setRunCount]   = useState(0);
  const [hintIndex,  setHintIndex]  = useState(-1);

  function buildFullCode() {
    return segments.map(seg => {
      if (seg.type === 'locked') return seg.lines.join('\n');
      return slotValues[seg.id] || '';
    }).join('\n');
  }

  function handleRun() {
    setIsRunning(true);
    setRunCount(p => p + 1);
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
    setSlotValues(initValues);
    setOutput('');
    setIsCorrect(false);
    setRunCount(0);
    setHintIndex(-1);
  }

  // Count visible locked lines across all locked segments for line numbers
  function getTotalLineCount() {
    return segments.reduce((n, seg) => {
      if (seg.type === 'locked') return n + seg.lines.length;
      return n + 1; // slot counts as ~1 line for numbering purposes
    }, 0);
  }

  let slotCounter = 0;

  return (
    <div className="code-editor">

      {/* ── Toolbar ──────────────────────────────────────────────────── */}
      <div className="editor-toolbar">
        <div className="editor-toolbar-left">
          <span className="editor-lang-tag">{language.toUpperCase()}</span>
          <span className="editor-file-name">Main.java</span>
          <span className="editor-slots-badge">
            {slotCount} write-here zone{slotCount !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="editor-toolbar-right">
          {hints.length > 0 && (
            <button
              className="editor-hint-btn"
              onClick={() => setHintIndex(i => Math.min(i + 1, hints.length - 1))}
            >
              💡 {hintIndex >= 0 ? `Hint ${hintIndex + 1}/${hints.length}` : 'Hint'}
            </button>
          )}
          <button className="editor-reset-btn" onClick={handleReset}>↺ Reset</button>
          <button
            className={`editor-run-btn ${isCorrect ? 'run-correct' : ''}`}
            onClick={handleRun}
            disabled={isRunning}
          >
            {isRunning ? '⟳ Running…' : '▶ Run  Ctrl+↵'}
          </button>
        </div>
      </div>

      {/* ── Hint panel ───────────────────────────────────────────────── */}
      {hintIndex >= 0 && hints[hintIndex] && (
        <div className="editor-hint-panel">
          <span className="hint-icon">💡</span>
          <span className="hint-text">{hints[hintIndex]}</span>
          {hintIndex < hints.length - 1 && (
            <button
              className="hint-next"
              onClick={() => setHintIndex(i => i + 1)}
            >Next hint →</button>
          )}
        </div>
      )}

      {/* ── Editor body ──────────────────────────────────────────────── */}
      <div className="editor-body" style={{ minHeight: height }}>
        {segments.map((seg, si) => {
          if (seg.type === 'locked') {
            return (
              <div key={si} className="locked-segment">
                {seg.lines.map((line, li) => {
                  const isComment  = line.trim().startsWith('//');
                  const isEmpty    = line.trim() === '';
                  return (
                    <div
                      key={li}
                      className={`editor-line locked-line ${
                        isComment ? 'locked-comment' : isEmpty ? 'locked-empty' : 'locked-code'
                      }`}
                    >
                      {isEmpty ? '\u00A0' : <CodeLine text={line} />}
                    </div>
                  );
                })}
              </div>
            );
          } else {
            slotCounter++;
            return (
              <WritableSlot
                key={si}
                segment={seg}
                value={slotValues[seg.id]}
                onChange={v => setSlotValues(prev => ({ ...prev, [seg.id]: v }))}
                slotNumber={slotCounter}
                totalSlots={slotCount}
              />
            );
          }
        })}
      </div>

      {/* ── Output panel ─────────────────────────────────────────────── */}
      <div className={`editor-output ${
        runCount > 0 ? isCorrect ? 'output-correct' : 'output-wrong' : ''
      }`}>
        <div className="output-header">
          <span className="output-label">
            {runCount === 0 ? 'Output'
              : isCorrect ? '✓ Correct — all output matches'
              : '✗ Not quite — check your output'}
          </span>
        </div>

        {/* Line-by-line diff when wrong */}
        {runCount > 0 && !isCorrect && expectedOutput && output ? (
          <div className="output-diff">
            {(() => {
              const actualLines   = output.split('\n');
              const expectedLines = expectedOutput.split('\n');
              const maxLen = Math.max(actualLines.length, expectedLines.length);
              return Array.from({ length: maxLen }, (_, i) => {
                const actual = actualLines[i];
                const exp    = expectedLines[i];
                const match  = actual === exp;
                return (
                  <div key={i} className={`diff-row ${match ? 'diff-ok' : 'diff-bad'}`}>
                    <span className="diff-marker">{match ? '✓' : '✗'}</span>
                    <span className="diff-actual">{actual ?? '(missing)'}</span>
                    {!match && (
                      <span className="diff-expected">expected: {exp ?? '(nothing)'}</span>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        ) : (
          <pre className="output-content">
            {output || (runCount === 0 ? 'Press ▶ Run to execute…' : '(no output)')}
          </pre>
        )}
      </div>

    </div>
  );
}

export default CodeEditor;