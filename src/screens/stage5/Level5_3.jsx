// src/screens/stage5/Level5_3.jsx — WHERE Clauses & Filtering (FILL)
import { useState } from 'react';
import Stage5Shell from './Stage5Shell';
import './Level5_3.css';

const SUPPORT = {
  reveal: {
    concept: 'WHERE Clauses',
    whatYouLearned: 'WHERE filters which rows a query affects. Operators: =, !=, >, <, >=, <=, LIKE, IN, IS NULL. Combine with AND / OR. This is the SQL behind every Spring Data derived method.',
    realWorldUse: 'findByWard("ICU") becomes WHERE ward = "ICU". findByPriorityLessThan(3) becomes WHERE priority < 3. Every custom query in your repository is WHERE logic.',
    developerSays: 'Always put WHERE on DELETE and UPDATE. A DELETE without WHERE deletes every row in the table. It happens. It hurts.',
  },
};

const BLANKS = {
  b1: { answer: 'WHERE',     hint: 'The filtering keyword' },
  b2: { answer: 'ward',      hint: 'The column you want to filter on' },
  b3: { answer: '=',         hint: 'Equality operator' },
  b4: { answer: 'AND',       hint: 'Both conditions must be true' },
  b5: { answer: 'LIKE',      hint: 'Pattern matching — use with %' },
  b6: { answer: 'OR',        hint: 'Either condition can be true' },
  b7: { answer: 'IS NULL',   hint: 'Check for missing / empty values' },
};

const OPERATORS = [
  { op:'=',        ex:'ward = \'ICU\'',          note:'Exact match' },
  { op:'!=',       ex:'ward != \'ICU\'',         note:'Not equal' },
  { op:'> / <',    ex:'priority > 2',            note:'Greater/less than' },
  { op:'LIKE',     ex:'name LIKE \'%Ali%\'',     note:'% = wildcard any chars' },
  { op:'IN',       ex:'ward IN (\'ICU\',\'A\')', note:'Match any in list' },
  { op:'IS NULL',  ex:'notes IS NULL',           note:'Column has no value' },
  { op:'AND',      ex:'ward=\'ICU\' AND priority=1', note:'Both must be true' },
  { op:'OR',       ex:'ward=\'ICU\' OR ward=\'A\'',  note:'Either is true' },
];

export default function Level5_3() {
  const [vals, setVals] = useState({ b1:'',b2:'',b3:'',b4:'',b5:'',b6:'',b7:'' });
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
    return <input className={cls} value={vals[key]} placeholder="____" onChange={e => setVals(p=>({...p,[key]:e.target.value}))} spellCheck={false} />;
  };

  return (
    <Stage5Shell levelId={3} canProceed={allCorrect} conceptReveal={SUPPORT.reveal}>
      <div className="l53-container">
        <div className="l53-brief">
          <div className="l53-brief-tag">🐘 Stage 5 · Level 5.3 · FILL</div>
          <h2>WHERE — Filtering Exactly the Rows You Need</h2>
          <p>SQL without WHERE returns everything. WHERE is what makes queries useful. It's the SQL translation of every <code>findBy...</code> method name in your Spring repositories.</p>
        </div>

        <div className="l53-anatomy">
          <div className="l53-anat-header">🔍 WHERE Operators</div>
          <div className="l53-op-grid">
            {OPERATORS.map(o => (
              <div key={o.op} className="l53-op-row">
                <code className="l53-op-op">{o.op}</code>
                <code className="l53-op-ex">{o.ex}</code>
                <span className="l53-op-note">{o.note}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="l53-exercise">
          <div className="l53-ex-header"><span className="l53-ex-label">✏️ Fill in the blanks</span></div>
          <div className="l53-sql-block">
            <span className="cm">{'-- 1) ICU patients only\n'}</span>
            <span className="kw">SELECT </span><span className="op">* </span><span className="kw">FROM </span><span className="tbl">patients</span><span className="op">{'\n  '}</span>
            {B('b1')}<span className="op"> </span>{B('b2')}<span className="op"> </span>{B('b3')}<span className="str"> 'ICU'</span><span className="op">{';\n\n'}</span>

            <span className="cm">{'-- 2) ICU patients with priority 1\n'}</span>
            <span className="kw">SELECT </span><span className="op">* </span><span className="kw">FROM </span><span className="tbl">patients</span>
            <span className="op">{'\n  '}</span><span className="kw">WHERE </span><span className="col">ward</span><span className="op"> = </span><span className="str">'ICU' </span>
            {B('b4')}<span className="col"> priority</span><span className="op"> = </span><span className="num">1</span><span className="op">{';\n\n'}</span>

            <span className="cm">{'-- 3) Search by partial name\n'}</span>
            <span className="kw">SELECT </span><span className="op">* </span><span className="kw">FROM </span><span className="tbl">patients</span>
            <span className="op">{'\n  '}</span><span className="kw">WHERE </span><span className="col">name </span>
            {B('b5')}<span className="str"> '%Ali%'</span><span className="op">{';\n\n'}</span>

            <span className="cm">{'-- 4) ICU or Cardiac ward\n'}</span>
            <span className="kw">SELECT </span><span className="op">* </span><span className="kw">FROM </span><span className="tbl">patients</span>
            <span className="op">{'\n  '}</span><span className="kw">WHERE </span><span className="col">ward</span><span className="op"> = </span><span className="str">'ICU' </span>
            {B('b6')}<span className="col"> ward</span><span className="op"> = </span><span className="str">'Cardiac'</span><span className="op">{';\n\n'}</span>

            <span className="cm">{'-- 5) Patients with no notes\n'}</span>
            <span className="kw">SELECT </span><span className="op">* </span><span className="kw">FROM </span><span className="tbl">patients</span>
            <span className="op">{'\n  '}</span><span className="kw">WHERE </span><span className="col">notes </span>
            {B('b7')}<span className="op">;</span>
          </div>
          {checked && !allCorrect && (
            <div className="l53-hints">
              {Object.keys(BLANKS).filter(k=>!results[k]).map(k=>(
                <div key={k} className="l53-hint">💡 {BLANKS[k].hint}</div>
              ))}
            </div>
          )}
          <button className="l53-check-btn" onClick={check}>{checked ? 'Check Again' : 'Check My Answer'}</button>
        </div>

        <div className="l53-bridge">
          <span>🔗</span>
          <div>
            <div className="l53-bridge-title">Spring Data translation</div>
            <div className="l53-bridge-text"><code>findByWardAndPriority(ward, priority)</code> → <code>WHERE ward = ? AND priority = ?</code>. The method name <em>is</em> the WHERE clause — Spring parses it and generates SQL automatically.</div>
          </div>
        </div>
      </div>
    </Stage5Shell>
  );
}
