// src/screens/stage2/FillEditor.jsx
// Shows Java code with blanks that the player fills in
// Blanks are marked with ___BLANK_ID___ in the template

import { useState, useEffect } from 'react';
import './FillEditor.css';

// Parse template into segments: {type: 'code'|'blank', content, id, answer, hint}
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

// NOTE: Syntax highlighting removed from FillEditor.
// The previous highlight() function injected <span class="tok-*"> HTML tags via
// dangerouslySetInnerHTML. Because React renders <pre> children as plain text,
// those tags appeared LITERALLY on screen: <span class="tok-keyword">public</span>
// Fix: code segments are now plain text. No HTML injection.

// ── Single blank input ─────────────────────────────────────────────────────
function BlankInput({ blank, value, onChange, isCorrect, isWrong, showAnswer }) {
  const width = Math.max(
    (blank.answer?.length || 6) * 9 + 16,
    80
  );

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
  template,        // string with ___BLANK_ID___ markers
  blanks,          // [{ id, answer, placeholder, hint }]
  onAllCorrect,    // callback when all blanks are filled correctly
  showRunButton = true,
  expectedOutput = '',
  simulateOutput,  // fn(answers) => string | null
}) {
  const segments = parseTemplate(template);
  const [values,      setValues]      = useState({});
  const [checked,     setChecked]     = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [output,      setOutput]      = useState('');
  const [revealed,    setRevealed]    = useState(0); // hint reveal index

  const blankMap = Object.fromEntries(blanks.map(b => [b.id, b]));

  const correctMap = {};
  blanks.forEach(b => {
    const val = (values[b.id] || '').trim();
    correctMap[b.id] = val === b.answer.trim();
  });

  const allCorrect = blanks.every(b => correctMap[b.id]);
  const anyFilled  = Object.values(values).some(v => v.trim().length > 0);

  useEffect(() => {
    if (allCorrect && blanks.length > 0) {
      onAllCorrect && onAllCorrect(true);
    }
  }, [allCorrect]);

  function handleChange(id, val) {
    setValues(prev => ({ ...prev, [id]: val }));
    setChecked(false);
  }

  function handleCheck() {
    setChecked(true);
    if (simulateOutput) {
      const out = simulateOutput(values);
      setOutput(out || '');
    }
  }

  function handleRevealNext() {
    setRevealed(prev => Math.min(prev + 1, blanks.length));
    setShowAnswers(true);
  }

  // Render template with blanks
  function renderTemplate() {
    return segments.map((seg, i) => {
      if (seg.type === 'code') {
        // Render as plain text — no HTML injection, no span tags bleeding through
        // Colour is applied via CSS on the parent .fill-code-content
        return (
          <span key={i} className="fill-code">
            {seg.content}
          </span>
        );
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

      {/* Hint for currently revealed blank */}
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
              <span className="fill-expected">
                Expected: <code>{expectedOutput}</code>
              </span>
            )}
          </div>
          <pre className="fill-output-content">{output || '(no output)'}</pre>
        </div>
      )}

      {/* All correct celebration */}
      {allCorrect && (
        <div className="fill-all-correct">
          ✓ All {blanks.length} blanks filled correctly. Code is complete and valid.
        </div>
      )}

    </div>
  );
}

export default FillEditor;