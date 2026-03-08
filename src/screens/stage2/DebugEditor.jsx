// src/screens/stage2/DebugEditor.jsx

import { useState, useRef, useEffect } from 'react';
import './DebugEditor.css';

// ── Syntax highlighter ──────────────────────────────────────────────────────
function highlight(rawCode) {
  const KEYWORDS = [
    'public','private','protected','static','final','void','class','new',
    'return','if','else','for','while','do','break','continue','import',
    'package','extends','implements','interface','abstract','try','catch',
    'finally','throw','throws','instanceof','this','super','null','true',
    'false','enum','switch','case','default',
  ];
  const TYPES = [
    'int','long','double','float','boolean','char','byte','short',
    'String','var','List','ArrayList','Map','HashMap','Set','Optional',
  ];

  const escaped = rawCode
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return escaped.split('\n').map(line => {
    const ci       = findCommentStart(line);
    const codePart = ci === -1 ? line : line.slice(0, ci);
    const cmtPart  = ci === -1 ? ''   : line.slice(ci);
    return tokeniseCode(codePart, KEYWORDS, TYPES)
      + (cmtPart ? `<span class="tok-comment">${cmtPart}</span>` : '');
  }).join('\n');
}

function findCommentStart(line) {
  let inStr = false, strCh = '';
  for (let i = 0; i < line.length - 1; i++) {
    const ch = line[i];
    if (inStr) {
      if (ch === '\\') { i++; continue; }
      if (ch === strCh) inStr = false;
    } else {
      if (ch === '"' || ch === "'") { inStr = true; strCh = ch; continue; }
      if (ch === '/' && line[i + 1] === '/') return i;
    }
  }
  return -1;
}

function tokeniseCode(code, keywords, types) {
  if (!code) return '';
  let r = code;
  r = r.replace(/"([^"\\]|\\.)*"/g,   m => `\x00S\x01${m}\x00/S\x01`);
  r = r.replace(/\b(\d+\.?\d*)\b/g,   `\x00N\x01$1\x00/N\x01`);
  types.forEach(t => {
    r = r.replace(new RegExp(`\\b(${t})\\b`, 'g'), `\x00T\x01$1\x00/T\x01`);
  });
  keywords.forEach(k => {
    r = r.replace(new RegExp(`\\b(${k})\\b`, 'g'), `\x00K\x01$1\x00/K\x01`);
  });
  r = r.replace(/\b([a-zA-Z_]\w*)(\s*\()/g, (m, name, paren) => {
    if (name.includes('\x00') || name.includes('\x01')) return m;
    return `\x00M\x01${name}\x00/M\x01${paren}`;
  });
  return r
    .replace(/\x00S\x01([\s\S]*?)\x00\/S\x01/g,  '<span class="tok-string">$1</span>')
    .replace(/\x00N\x01([\s\S]*?)\x00\/N\x01/g,  '<span class="tok-number">$1</span>')
    .replace(/\x00T\x01([\s\S]*?)\x00\/T\x01/g,  '<span class="tok-type">$1</span>')
    .replace(/\x00K\x01([\s\S]*?)\x00\/K\x01/g,  '<span class="tok-keyword">$1</span>')
    .replace(/\x00M\x01([\s\S]*?)\x00\/M\x01/g,  '<span class="tok-method">$1</span>');
}

// ── Build highlighted HTML — wraps bug lines in a special span ─────────────
// bugLines: Set of 1-based line numbers that contain bugs
// fixedLines: Set of 1-based line numbers whose bugs are already fixed
function highlightWithBugLines(rawCode, bugLines, fixedLines) {
  const KEYWORDS = [
    'public','private','protected','static','final','void','class','new',
    'return','if','else','for','while','do','break','continue','import',
    'package','extends','implements','interface','abstract','try','catch',
    'finally','throw','throws','instanceof','this','super','null','true',
    'false','enum','switch','case','default',
  ];
  const TYPES = [
    'int','long','double','float','boolean','char','byte','short',
    'String','var','List','ArrayList','Map','HashMap','Set','Optional',
  ];

  const escaped = rawCode
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return escaped.split('\n').map((line, idx) => {
    const lineNo   = idx + 1;
    const ci       = findCommentStart(line);
    const codePart = ci === -1 ? line : line.slice(0, ci);
    const cmtPart  = ci === -1 ? ''   : line.slice(ci);
    const tokenised = tokeniseCode(codePart, KEYWORDS, TYPES)
      + (cmtPart ? `<span class="tok-comment">${cmtPart}</span>` : '');

    if (fixedLines.has(lineNo)) {
      return `<span class="bug-line bug-line-fixed">${tokenised}</span>`;
    }
    if (bugLines.has(lineNo)) {
      return `<span class="bug-line bug-line-active">${tokenised}</span>`;
    }
    return tokenised;
  }).join('\n');
}

// ── Bug chip ─────────────────────────────────────────────────────────────────
function BugChip({ bug, isFixed }) {
  return (
    <div className={`bug-chip ${isFixed ? 'bug-fixed' : 'bug-active'}`}>
      <span className="bug-chip-icon">{isFixed ? '✓' : '✗'}</span>
      <span className="bug-chip-text">{bug.description}</span>
      {!isFixed && bug.line && (
        <span className="bug-chip-line">line {bug.line}</span>
      )}
    </div>
  );
}

// ── Line numbers with gutter markers for bug lines ──────────────────────────
function LineNumbers({ code, bugLines, fixedLines }) {
  return (
    <div className="debug-line-numbers">
      {code.split('\n').map((_, i) => {
        const lineNo  = i + 1;
        const isBug   = bugLines.has(lineNo);
        const isFixed = fixedLines.has(lineNo);
        return (
          <div
            key={i}
            className={`debug-line-num ${isBug && !isFixed ? 'line-num-bug' : ''} ${isFixed ? 'line-num-fixed' : ''}`}
          >
            {isBug && !isFixed && <span className="bug-gutter-dot" title="Bug here">●</span>}
            {isFixed          && <span className="bug-gutter-dot fixed-gutter-dot" title="Fixed">✓</span>}
            {!isBug           && <span className="gutter-num">{lineNo}</span>}
            {isBug            && <span className="gutter-num">{lineNo}</span>}
          </div>
        );
      })}
    </div>
  );
}

// ── Read-only fixed panel ─────────────────────────────────────────────────────
function FixedPanel({ code }) {
  return (
    <div className="debug-fixed-panel">
      <div className="debug-fixed-header">
        <span className="debug-fixed-badge">✓ ALL BUGS FIXED</span>
        <span className="debug-fixed-sub">Read-only — your corrected code is locked</span>
      </div>
      <div className="debug-editor-body">
        <div className="debug-line-numbers">
          {code.split('\n').map((_, i) => (
            <div key={i} className="debug-line-num">
              <span className="gutter-num">{i + 1}</span>
            </div>
          ))}
        </div>
        <div className="debug-editor-area">
          <div
            className="debug-highlight"
            dangerouslySetInnerHTML={{ __html: highlight(code) + '\n' }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Main DebugEditor ──────────────────────────────────────────────────────────
function DebugEditor({
  buggyCode,
  brokenCode,
  bugs,
  solution,
  expectedOutput,
  simulateOutput,
  onAllFixed,
}) {
  const initialCode = buggyCode || brokenCode || '';
  const [code,        setCode]        = useState(initialCode);
  const [runCount,    setRunCount]    = useState(0);
  const [output,      setOutput]      = useState('');
  const [revealCount, setRevealCount] = useState(0);
  const [locked,      setLocked]      = useState(false);
  const textareaRef = useRef(null);

  const fixedMap   = {};
  bugs.forEach(b => { fixedMap[b.id] = b.check(code); });
  const allFixed   = bugs.every(b => fixedMap[b.id]);
  const fixedCount = bugs.filter(b => fixedMap[b.id]).length;

  // Build sets of bug lines and fixed lines for gutter + line highlighting
  const bugLines   = new Set(bugs.filter(b => b.line).map(b => b.line));
  const fixedLines = new Set(bugs.filter(b => b.line && fixedMap[b.id]).map(b => b.line));

  useEffect(() => {
    if (allFixed && !locked) {
      setLocked(true);
      if (onAllFixed) onAllFixed(true);
    }
  }, [allFixed, locked, onAllFixed]);

  function handleRun() {
    setRunCount(p => p + 1);
    if (simulateOutput) setOutput(simulateOutput(code));
  }

  function handleReset() {
    setCode(initialCode);
    setOutput('');
    setRunCount(0);
    setRevealCount(0);
    setLocked(false);
  }

  function handleKeyDown(e) {
    if (locked) return;
    if (e.key === 'Tab') {
      e.preventDefault();
      const s   = e.target.selectionStart;
      const end = e.target.selectionEnd;
      setCode(code.substring(0, s) + '    ' + code.substring(end));
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = s + 4;
        }
      }, 0);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleRun();
  }

  // ── Locked state ───────────────────────────────────────────────────────
  if (locked) {
    return (
      <div className="debug-editor">
        <div className="debug-toolbar">
          <div className="debug-toolbar-left">
            <span className="debug-lang-tag">JAVA — DEBUG MODE</span>
            <span className="debug-bug-count debug-bug-all-done">
              {bugs.length}/{bugs.length} fixed ✓
            </span>
          </div>
          <div className="debug-toolbar-right">
            <button className="debug-reset-btn" onClick={handleReset}>↺ Reset</button>
          </div>
        </div>
        <div className="debug-bug-chips">
          {bugs.map(bug => <BugChip key={bug.id} bug={bug} isFixed={true} />)}
        </div>
        <FixedPanel code={code} />
      </div>
    );
  }

  // ── Editing state ──────────────────────────────────────────────────────
  const highlightedHtml = highlightWithBugLines(code, bugLines, fixedLines);

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
          {revealCount < bugs.length && (
            <button
              className="debug-solution-btn"
              onClick={() => setRevealCount(p => Math.min(p + 1, bugs.length))}
            >
              💡 {revealCount === 0 ? 'Reveal hint' : 'Next hint'}
            </button>
          )}
          {solution && (
            <button className="debug-solution-btn" onClick={() => setCode(solution)}>
              👁 Show solution
            </button>
          )}
          <button className="debug-reset-btn" onClick={handleReset}>↺ Reset</button>
          <button
            className={`debug-run-btn ${allFixed ? 'run-ready' : ''}`}
            onClick={handleRun}
          >
            ▶ Run &nbsp;Ctrl+↵
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="debug-legend">
        <span className="legend-bug">● Bug line — needs fixing</span>
        <span className="legend-fixed">✓ Fixed line</span>
        <span className="legend-hint">Edit the highlighted lines to fix each bug</span>
      </div>

      {/* Revealed hints */}
      {revealCount > 0 && (
        <div className="debug-hints-bar">
          {bugs.slice(0, revealCount).map((bug, i) => (
            <div key={bug.id} className={`debug-hint-item ${fixedMap[bug.id] ? 'hint-fixed' : ''}`}>
              <span className="debug-hint-label">
                {fixedMap[bug.id] ? '✓ Fixed' : `Bug ${i + 1} — line ${bug.line}`}
              </span>
              <span>{bug.fix}</span>
            </div>
          ))}
        </div>
      )}

      {/* Bug status chips */}
      <div className="debug-bug-chips">
        {bugs.map(bug => (
          <BugChip key={bug.id} bug={bug} isFixed={fixedMap[bug.id]} />
        ))}
      </div>

      {/* Code editor */}
      <div className="debug-editor-body">
        <LineNumbers code={code} bugLines={bugLines} fixedLines={fixedLines} />
        <div className="debug-editor-area">
          <div
            className="debug-highlight"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: highlightedHtml + '\n' }}
          />
          <textarea
            ref={textareaRef}
            className="debug-textarea"
            value={code}
            onChange={e => !locked && setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
          />
        </div>
      </div>

      {/* Output */}
      {runCount > 0 && (
        <div className={`debug-output ${allFixed ? 'output-correct' : 'output-wrong'}`}>
          <div className="debug-output-header">
            <span>
              {allFixed
                ? '✓ All bugs fixed — proceed to the next level'
                : `✗ ${bugs.length - fixedCount} bug(s) still to fix`}
            </span>
          </div>
          <pre className="debug-output-content">
            {output || (allFixed ? '(all checks passed)' : '(fix remaining bugs and run again)')}
          </pre>
        </div>
      )}

    </div>
  );
}

export default DebugEditor;