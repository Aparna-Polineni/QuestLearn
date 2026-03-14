// src/screens/stage5/Level5_9.jsx — Common SQL Mistakes (DEBUG)
import { useState } from 'react';
import Stage5Shell from './Stage5Shell';
import './Level5_9.css';

const SUPPORT = {
  reveal: {
    concept: 'SQL Pitfalls',
    whatYouLearned: 'NULL requires IS NULL not = NULL. DELETE and UPDATE without WHERE affect every row. Comparing strings case-sensitively in some DBs. These mistakes are silent — no error, just wrong data.',
    realWorldUse: 'Every developer has run a DELETE without WHERE at least once. After this level, you never will. NULL traps cause NullPointerExceptions in Java when you retrieve data and don\'t expect nulls.',
    developerSays: 'Run EXPLAIN before any complex query in production. And always SELECT before you DELETE.',
  },
};

const BUGS = [
  {
    id: 'null',
    label: 'NULL Comparison',
    bad:  'SELECT * FROM patients WHERE notes = NULL;',
    good: 'SELECT * FROM patients WHERE notes IS NULL;',
    explanation: '= NULL always returns false. NULL is the absence of a value — you must use IS NULL or IS NOT NULL.',
  },
  {
    id: 'delete',
    label: 'DELETE Without WHERE',
    bad:  'DELETE FROM patients;',
    good: 'DELETE FROM patients WHERE id = 42;',
    explanation: 'No WHERE = delete every row. Always specify which rows to delete.',
  },
  {
    id: 'update',
    label: 'UPDATE Without WHERE',
    bad:  "UPDATE patients SET ward = 'ICU';",
    good: "UPDATE patients SET ward = 'ICU' WHERE id = 5;",
    explanation: 'Without WHERE, every patient moves to ICU. Target exactly the row you want.',
  },
  {
    id: 'like',
    label: 'LIKE Without Wildcard',
    bad:  "SELECT * FROM patients WHERE name LIKE 'Ali';",
    good: "SELECT * FROM patients WHERE name LIKE '%Ali%';",
    explanation: 'LIKE without % is the same as =. The % wildcard means "any characters here".',
  },
  {
    id: 'in_null',
    label: 'NOT IN With NULL Values',
    bad:  'SELECT * FROM patients WHERE ward_id NOT IN (SELECT id FROM wards WHERE active = false);',
    good: 'SELECT * FROM patients WHERE ward_id NOT IN (SELECT id FROM wards WHERE active = false AND id IS NOT NULL);',
    explanation: 'If the subquery returns any NULL, NOT IN returns no rows at all. Always filter NULLs from NOT IN subqueries.',
  },
];

export default function Level5_9() {
  const [fixed, setFixed] = useState(new Set());

  function toggle(id) {
    setFixed(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const allFixed = BUGS.every(b => fixed.has(b.id));

  return (
    <Stage5Shell levelId={9} canProceed={allFixed} conceptReveal={SUPPORT.reveal}>
      <div className="l59-container">
        <div className="l59-brief">
          <div className="l59-brief-tag">🐘 Stage 5 · Level 5.9 · DEBUG</div>
          <h2>Common SQL Mistakes — Silent Data Disasters</h2>
          <p>These bugs don't throw errors — they silently return wrong results or destroy data. Study each bug, understand why it's wrong, and click "Understood" when you've got it.</p>
        </div>

        {BUGS.map(bug => (
          <div key={bug.id} className={`l59-bug ${fixed.has(bug.id) ? 'l59-bug--fixed' : ''}`}>
            <div className="l59-bug-label">{bug.label}</div>
            <div className="l59-code-pair">
              <div className="l59-code-block l59-bad">
                <div className="l59-code-tag bad-tag">✗ BUGGY</div>
                <code>{bug.bad}</code>
              </div>
              <div className="l59-code-block l59-good">
                <div className="l59-code-tag good-tag">✓ FIXED</div>
                <code>{bug.good}</code>
              </div>
            </div>
            <div className="l59-explanation">{bug.explanation}</div>
            <button className={`l59-got-it ${fixed.has(bug.id) ? 'l59-got-it--done' : ''}`} onClick={() => toggle(bug.id)}>
              {fixed.has(bug.id) ? '✓ Understood' : 'Mark as Understood'}
            </button>
          </div>
        ))}

        {!allFixed && <p className="l59-prompt">Mark all {BUGS.length} bugs as understood to continue →</p>}
      </div>
    </Stage5Shell>
  );
}
