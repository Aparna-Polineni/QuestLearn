// src/screens/stage5/Level5_4.jsx — UPDATE & DELETE (FILL)
import { useState } from 'react';
import Stage5Shell from './Stage5Shell';
import './Level5_4.css';

const SUPPORT = {
  reveal: {
    concept: 'UPDATE & DELETE',
    whatYouLearned: 'UPDATE changes existing rows. DELETE removes them. Both MUST have a WHERE clause — without it you affect every row in the table. This is one of the most common production disasters.',
    realWorldUse: 'patientRepository.save(existing) runs UPDATE. patientRepository.delete(patient) runs DELETE WHERE id = ?. JPA always includes the ID in WHERE — protecting you automatically.',
    developerSays: 'Before running UPDATE or DELETE in production, run the same WHERE with a SELECT first. If SELECT returns the right rows, then run the change. This habit will save your career.',
  },
};

const BLANKS = {
  b1: { answer: 'UPDATE',     hint: 'The command to modify existing rows' },
  b2: { answer: 'SET',        hint: 'Comes after the table name in UPDATE' },
  b3: { answer: 'WHERE',      hint: 'Without this, ALL rows get updated!' },
  b4: { answer: 'DELETE FROM',hint: 'Two words to remove rows from a table' },
  b5: { answer: 'WHERE',      hint: 'Always required before deleting' },
  b6: { answer: 'id = 3',     hint: 'Target the specific row by its primary key' },
};

export default function Level5_4() {
  const [vals, setVals] = useState({ b1:'',b2:'',b3:'',b4:'',b5:'',b6:'' });
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState({});

  function check() {
    const r = {};
    Object.keys(BLANKS).forEach(k => { r[k] = vals[k].trim().toUpperCase() === BLANKS[k].answer.toUpperCase(); });
    setResults(r); setChecked(true);
  }
  const allCorrect = checked && Object.keys(BLANKS).every(k => results[k]);
  const B = (key) => {
    const cls = !checked ? 'blank' : results[key] ? 'blank blank--ok' : 'blank blank--err';
    return <input className={cls} value={vals[key]} placeholder="____" onChange={e=>setVals(p=>({...p,[key]:e.target.value}))} spellCheck={false}/>;
  };

  return (
    <Stage5Shell levelId={4} canProceed={allCorrect} conceptReveal={SUPPORT.reveal}>
      <div className="l54-container">
        <div className="l54-brief">
          <div className="l54-brief-tag">🐘 Stage 5 · Level 5.4 · FILL</div>
          <h2>UPDATE & DELETE — Changing and Removing Data Safely</h2>
          <p>Power comes with responsibility. UPDATE and DELETE without a WHERE clause affect <em>every row</em> in the table. Always target specifically — always use WHERE.</p>
        </div>

        <div className="l54-warning">
          <div className="l54-warning-icon">⚠️</div>
          <div>
            <div className="l54-warning-title">The #1 Production Disaster</div>
            <div className="l54-warning-text">
              <code>DELETE FROM patients;</code> — deletes every patient, no warning, instant.<br/>
              <code>UPDATE patients SET active = false;</code> — disables every patient at once.<br/>
              Always test your WHERE with a SELECT first.
            </div>
          </div>
        </div>

        <div className="l54-exercise">
          <div className="l54-ex-header"><span className="l54-ex-label">✏️ Fill in the blanks</span></div>
          <div className="l54-sql-block">
            <span className="cm">{'-- 1) Change Alice\'s ward to Cardiac\n'}</span>
            {B('b1')}<span className="tbl"> patients</span><span className="op">{'\n  '}</span>
            {B('b2')}<span className="col"> ward </span><span className="op">= </span><span className="str">'Cardiac'</span><span className="op">{'\n  '}</span>
            {B('b3')}<span className="col"> id </span><span className="op">= </span><span className="num">1</span><span className="op">{';\n\n'}</span>

            <span className="cm">{'-- 2) Bump priority for ICU patients\n'}</span>
            <span className="kw">UPDATE </span><span className="tbl">patients</span>
            <span className="op">{'\n  '}</span><span className="kw">SET </span><span className="col">priority </span><span className="op">= </span><span className="col">priority </span><span className="op">+ </span><span className="num">1</span>
            <span className="op">{'\n  '}</span><span className="kw">WHERE </span><span className="col">ward </span><span className="op">= </span><span className="str">'ICU'</span><span className="op">{';\n\n'}</span>

            <span className="cm">{'-- 3) Remove patient with id 3\n'}</span>
            {B('b4')}<span className="tbl"> patients</span><span className="op">{'\n  '}</span>
            {B('b5')}<span className="op"> </span>{B('b6')}<span className="op">;</span>
          </div>
          {checked && !allCorrect && (
            <div className="l54-hints">
              {Object.keys(BLANKS).filter(k=>!results[k]).map(k=>(
                <div key={k} className="l54-hint">💡 {BLANKS[k].hint}</div>
              ))}
            </div>
          )}
          <button className="l54-check-btn" onClick={check}>{checked ? 'Check Again' : 'Check My Answer'}</button>
        </div>

        <div className="l54-ref-grid">
          <div className="l54-ref-head">UPDATE vs DELETE vs TRUNCATE</div>
          {[
            ['UPDATE … SET … WHERE', 'Change specific column values in matching rows'],
            ['DELETE FROM … WHERE',  'Remove matching rows (can be rolled back)'],
            ['TRUNCATE TABLE',       'Delete ALL rows — faster but cannot be rolled back'],
            ['DROP TABLE',           'Delete the table itself — structure and all data gone'],
          ].map(([sig,note]) => (
            <div key={sig} className="l54-ref-row">
              <code className="l54-sig">{sig}</code>
              <span className="l54-note">{note}</span>
            </div>
          ))}
        </div>
      </div>
    </Stage5Shell>
  );
}
