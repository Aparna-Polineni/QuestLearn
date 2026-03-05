// src/screens/stage2/FillEditor.jsx
// Syntax highlighting via React tokens — no dangerouslySetInnerHTML
// Each code segment is tokenised into spans with colour classes

import { useState, useEffect } from 'react';
import './FillEditor.css';

// ── Tokeniser ──────────────────────────────────────────────────────────────
// Splits a line of Java code into typed tokens.
// Returns array of: { type: 'keyword'|'type'|'string'|'comment'|'number'|'annotation'|'plain', text }
// This is pure string splitting — no innerHTML, no HTML injection.

const KEYWORDS = new Set([
  'public','private','protected','static','final','void','class','new',
  'return','if','else','for','while','do','break','continue','import',
  'package','extends','implements','interface','abstract','try','catch',
  'finally','throw','throws','instanceof','this','super','null','true',
  'false','enum','switch','case','default'
]);

const TYPES = new Set([
  'int','long','double','float','boolean','char','byte','short','String','var'
]);

function tokeniseLine(line) {
  const tokens = [];

  // Full-line or trailing comment — everything from // onwards is green
  const commentIdx = line.indexOf('//');
  let codePart  = commentIdx >= 0 ? line.slice(0, commentIdx) : line;
  const commentPart = commentIdx >= 0 ? line.slice(commentIdx) : null;

  // Tokenise the code portion word by word
  // Regex splits on word boundaries while keeping delimiters
  const parts = codePart.split(/(\b\w+\b|"[^"]*"|@\w+|\d+\.?\d*)/g);

  parts.forEach(part => {
    if (!part) return;
    if (part.startsWith('"') && part.endsWith('"')) {
      tokens.push({ type: 'string', text: part });
    } else if (part.startsWith('@')) {
      tokens.push({ type: 'annotation', text: part });
    } else if (/^\d+\.?\d*$/.test(part)) {
      tokens.push({ type: 'number', text: part });
    } else if (KEYWORDS.has(part)) {
      tokens.push({ type: 'keyword', text: part });
    } else if (TYPES.has(part)) {
      tokens.push({ type: 'type', text: part });
    } else {
      tokens.push({ type: 'plain', text: part });
    }
  });

  // Append the comment as one green token
  if (commentPart) {
    tokens.push({ type: 'comment', text: commentPart });
  }

  return tokens;
}

// Renders a plain code string with syntax colouring
// Returns an array of <span> React elements — safe, no innerHTML
function HighlightedCode({ text }) {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, li) => (
        <span key={li}>
          {tokeniseLine(line).map((tok, ti) => (
            <span key={ti} className={`tok-${tok.type}`}>{tok.text}</span>
          ))}
          {li < lines.length - 1 ? '\n' : ''}
        </span>
      ))}
    </>
  );
}

// ── Template parser ────────────────────────────────────────────────────────
function parseTemplate(template) {
  const segments = [];
  const regex = /___([A-Z0-9_]+)___/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(template)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'code', content: template.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'blank', id: match[1] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < template.length) {
    segments.push({ type: 'code', content: template.slice(lastIndex) });
  }

  return segments;
}

// ── Single blank input ─────────────────────────────────────────────────────
function BlankInput({ blank, value, onChange, isCorrect, isWrong, showAnswer }) {
  const width = Math.max((blank.answer?.length || 6) * 9 + 16, 80);

  return (
    <span className="blank-wrapper">
      <input
        className={`blank-input ${isCorrect ? 'blank-correct' : ''} ${isWrong ? 'blank-wrong' : ''}`}
        style={{ width }}
        value={value}
        onChange={e => onChange(blank.id, e.target.value)}
        placeholder={blank.placeholder || '?'}
        spellCheck={false}
        autoComplete="off"
      />
      {isCorrect && <span className="blank-tick">✓</span>}
      {isWrong   && <span className="blank-cross">✗</span>}
      {showAnswer && !isCorrect && (
        <span className="blank-reveal">{blank.answer}</span>
      )}
    </span>
  );
}

// ── Main FillEditor ────────────────────────────────────────────────────────
function FillEditor({
  template,
  blanks,
  onAllCorrect,
  showRunButton = true,
  expectedOutput = '',
  simulateOutput,
}) {
  const segments = parseTemplate(template);
  const [values,      setValues]      = useState({});
  const [checked,     setChecked]     = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [output,      setOutput]      = useState('');
  const [revealed,    setRevealed]    = useState(0);

  const blankMap   = Object.fromEntries(blanks.map(b => [b.id, b]));
  const correctMap = {};
  blanks.forEach(b => {
    correctMap[b.id] = (values[b.id] || '').trim() === b.answer.trim();
  });

  const allCorrect = blanks.every(b => correctMap[b.id]);
  const anyFilled  = Object.values(values).some(v => v.trim().length > 0);

  useEffect(() => {
    if (allCorrect && blanks.length > 0) onAllCorrect?.(true);
  }, [allCorrect]);

  function handleChange(id, val) {
    setValues(prev => ({ ...prev, [id]: val }));
    setChecked(false);
  }

  function handleCheck() {
    setChecked(true);
    if (simulateOutput) setOutput(simulateOutput(values) || '');
  }

  function handleRevealNext() {
    setRevealed(prev => Math.min(prev + 1, blanks.length));
    setShowAnswers(true);
  }

  // Render template segments — code gets syntax highlighting, blanks get inputs
  function renderTemplate() {
    return segments.map((seg, i) => {
      if (seg.type === 'code') {
        return <HighlightedCode key={i} text={seg.content} />;
      }
      const blank   = blankMap[seg.id];
      const val     = values[seg.id] || '';
      const correct = checked ? correctMap[seg.id] : false;
      const wrong   = checked && !correctMap[seg.id] && val.trim().length > 0;
      const showAns = showAnswers && blanks.indexOf(blank) < revealed;

      return (
        <BlankInput
          key={i}
          blank={blank}
          value={val}
          onChange={handleChange}
          isCorrect={correct || (allCorrect && val.trim() === blank?.answer?.trim())}
          isWrong={wrong}
          showAnswer={showAns}
        />
      );
    });
  }

  return (
    <div className="fill-editor">

      {/* Toolbar */}
      <div className="fill-toolbar">
        <div className="fill-toolbar-left">
          <span className="fill-lang-tag">JAVA</span>
          <span className="fill-filename">Main.java</span>
          <span className="fill-blanks-count">
            {blanks.length} blank{blanks.length !== 1 ? 's' : ''} to fill
          </span>
        </div>
        <div className="fill-toolbar-right">
          <button
            className="fill-reveal-btn"
            onClick={handleRevealNext}
            disabled={revealed >= blanks.length}
          >
            💡 Reveal hint ({revealed}/{blanks.length})
          </button>
          {showRunButton && (
            <button
              className={`fill-check-btn ${allCorrect ? 'check-correct' : ''}`}
              onClick={handleCheck}
              disabled={!anyFilled}
            >
              {allCorrect ? '✓ All Correct!' : '▶ Check Answers'}
            </button>
          )}
        </div>
      </div>

      {/* Hint bar */}
      {showAnswers && revealed > 0 && blanks[revealed - 1]?.hint && (
        <div className="fill-hint-bar">
          <span className="fill-hint-icon">💡</span>
          <span className="fill-hint-text">
            Blank {revealed}: {blanks[revealed - 1].hint}
          </span>
        </div>
      )}

      {/* Code with blanks */}
      <div className="fill-code-body">
        <div className="fill-line-numbers">
          {template.split('\n').map((_, i) => (
            <div key={i} className="fill-line-num">{i + 1}</div>
          ))}
        </div>
        <pre className="fill-code-content">
          {renderTemplate()}
        </pre>
      </div>

      {/* Output */}
      {checked && simulateOutput && (
        <div className={`fill-output ${allCorrect ? 'output-correct' : 'output-wrong'}`}>
          <div className="fill-output-header">
            <span>{allCorrect ? '✓ Output — correct' : '✗ Output — not quite'}</span>
            {expectedOutput && (
              <span className="fill-expected">Expected: <code>{expectedOutput}</code></span>
            )}
          </div>
          <pre className="fill-output-content">{output || '(no output)'}</pre>
        </div>
      )}

      {/* All correct */}
      {allCorrect && (
        <div className="fill-all-correct">
          ✓ All {blanks.length} blanks filled correctly. Code is complete and valid.
        </div>
      )}

    </div>
  );
}

export default FillEditor;