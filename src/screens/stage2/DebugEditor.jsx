// src/screens/stage2/DebugEditor.jsx
// Shows broken Java code with deliberate errors
// Player identifies and fixes them by editing directly

import { useState } from 'react';
import './DebugEditor.css';

function highlight(code) {
  const keywords = ['public','private','protected','static','final','void','class','new',
    'return','if','else','for','while','do','break','continue','import','package',
    'extends','implements','interface','abstract','try','catch','finally','throw',
    'throws','instanceof','this','super','null','true','false','enum','switch','case','default'];
  const types = ['int','long','double','float','boolean','char','byte','short','String','var'];

  let result = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  result = result.replace(/"([^"\\]|\\.)*"/g, m => `<span class="tok-string">${m}</span>`);
  result = result.replace(/\/\/[^\n]*/g, m => `<span class="tok-comment">${m}</span>`);
  result = result.replace(/\b(\d+\.?\d*)\b/g, `<span class="tok-number">$1</span>`);
  types.forEach(t => {
    result = result.replace(new RegExp(`\\b(${t})\\b`, 'g'), `<span class="tok-type">$1</span>`);
  });
  keywords.forEach(k => {
    result = result.replace(new RegExp(`\\b(${k})\\b`, 'g'), `<span class="tok-keyword">$1</span>`);
  });
  result = result.replace(/\b([a-zA-Z_]\w*)(\s*\()/g, `<span class="tok-method">$1</span>$2`);
  return result;
}

// ── Bug indicator chip ─────────────────────────────────────────────────────
function BugChip({ bug, isFixed }) {
  return (
    <div className={`bug-chip ${isFixed ? 'bug-fixed' : 'bug-active'}`}>
      <span className="bug-chip-icon">{isFixed ? '✓' : '✗'}</span>
      <span className="bug-chip-text">{bug.description}</span>
    </div>
  );
}

// ── Main DebugEditor ───────────────────────────────────────────────────────
function DebugEditor({
  brokenCode,      // initial broken code string
  bugs,            // [{ id, description, check: fn(code) => bool }]
  solution,        // correct final code string (for "show solution")
  expectedOutput,
  simulateOutput,  // fn(code) => string
  onAllFixed,      // callback when all bugs fixed
}) {
  const [code,         setCode]        = useState(brokenCode);
  const [runCount,     setRunCount]    = useState(0);
  const [output,       setOutput]      = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [revealCount,  setRevealCount]  = useState(0);

  // Check which bugs are fixed
  const fixedMap = {};
  bugs.forEach(b => { fixedMap[b.id] = b.check(code); });
  const allFixed   = bugs.every(b => fixedMap[b.id]);
  const fixedCount = bugs.filter(b => fixedMap[b.id]).length;

  function handleRun() {
    setRunCount(p => p + 1);
    if (simulateOutput) {
      setOutput(simulateOutput(code));
    }
    if (allFixed && onAllFixed) onAllFixed(true);
  }

  function handleReset() {
    setCode(brokenCode);
    setOutput('');
    setRunCount(0);
    setShowSolution(false);
  }

  function handleShowSolution() {
    setShowSolution(true);
    setCode(solution);
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

  const isOutputCorrect = expectedOutput
    ? output.trim() === expectedOutput.trim()
    : allFixed && runCount > 0;

  return (
    <div className="debug-editor">

      {/* Toolbar */}
      <div className="debug-toolbar">
        <div className="debug-toolbar-left">
          <span className="debug-lang-tag">JAVA — DEBUG MODE</span>
          <span className="debug-bug-count">
            {fixedCount}/{bugs.length} bugs fixed
          </span>
        </div>
        <div className="debug-toolbar-right">
          {!showSolution && (
            <button
              className="debug-solution-btn"
              onClick={() => setRevealCount(p => Math.min(p + 1, bugs.length))}
            >
              💡 Reveal bug {revealCount + 1}
            </button>
          )}
          <button className="debug-reset-btn" onClick={handleReset}>↺ Reset</button>
          <button
            className={`debug-run-btn ${allFixed ? 'run-ready' : ''}`}
            onClick={handleRun}
          >
            ▶ Run  Ctrl+Enter
          </button>
        </div>
      </div>

      {/* Bug reveal hints */}
      {revealCount > 0 && (
        <div className="debug-hints-bar">
          {bugs.slice(0, revealCount).map((bug, i) => (
            <div key={bug.id} className={`debug-hint-item ${fixedMap[bug.id] ? 'hint-fixed' : ''}`}>
              <span>{fixedMap[bug.id] ? '✓' : `Bug ${i + 1}:`}</span>
              <span>{bug.hint}</span>
            </div>
          ))}
        </div>
      )}

      {/* Bug chips */}
      <div className="debug-bug-chips">
        {bugs.map(bug => (
          <BugChip key={bug.id} bug={bug} isFixed={fixedMap[bug.id]} />
        ))}
      </div>

      {/* Editor */}
      <div className="debug-editor-body">
        <div className="debug-line-numbers">
          {code.split('\n').map((_, i) => (
            <div key={i} className="debug-line-num">{i + 1}</div>
          ))}
        </div>
        <div className="debug-editor-area">
          <div
            className="debug-highlight"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: highlight(code) + '\n' }}
          />
          <textarea
            className="debug-textarea"
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
          />
        </div>
      </div>

      {/* Output */}
      {runCount > 0 && (
        <div className={`debug-output ${isOutputCorrect ? 'output-correct' : 'output-wrong'}`}>
          <div className="debug-output-header">
            <span>{isOutputCorrect ? '✓ Output — correct' : allFixed ? '✓ Bugs fixed — run again' : '✗ Still has bugs'}</span>
            {expectedOutput && (
              <span className="debug-expected">Expected: <code>{expectedOutput}</code></span>
            )}
          </div>
          <pre className="debug-output-content">{output || '(no output)'}</pre>
        </div>
      )}

      {allFixed && (
        <div className="debug-all-fixed">
          ✓ All {bugs.length} bugs fixed. Code is correct.
        </div>
      )}

    </div>
  );
}

export default DebugEditor;