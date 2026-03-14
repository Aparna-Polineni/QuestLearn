// src/screens/stage5/Level5_10.jsx — Subqueries (FILL)
import { useState } from 'react';
import Stage5Shell from './Stage5Shell';
import './Level5_10.css';

const SUPPORT = {
  reveal: {
    concept: 'Subqueries',
    whatYouLearned: 'A subquery is a SELECT inside another query. Use IN for "matches any", EXISTS for "at least one exists". Subqueries let you filter by results you haven\'t computed yet.',
    realWorldUse: 'When writing @Query in Spring, complex filtering often uses EXISTS or IN subqueries — especially when you need to check related table data without a JOIN.',
    developerSays: 'JOIN is usually faster than a subquery. But EXISTS is very efficient — it stops as soon as it finds one match. Use EXISTS when you only need to know "does any related row exist?"',
  },
};

const BLANKS = {
  b1: { answer: 'IN',     hint: 'Checks if the value matches any result from the subquery' },
  b2: { answer: 'SELECT', hint: 'Start the inner query' },
  b3: { answer: 'WHERE',  hint: 'Filter the inner query' },
  b4: { answer: 'EXISTS', hint: 'True if the subquery returns at least one row' },
  b5: { answer: 'NOT IN', hint: 'Opposite of IN — rows that do NOT match' },
};

export default function Level5_10() {
  const [vals, setVals] = useState(Object.fromEntries(Object.keys(BLANKS).map(k=>[k,''])));
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState({});

  function check() {
    const r = {};
    Object.keys(BLANKS).forEach(k => { r[k] = vals[k].trim().toUpperCase() === BLANKS[k].answer.toUpperCase(); });
    setResults(r); setChecked(true);
  }
  const allCorrect = checked && Object.keys(BLANKS).every(k=>results[k]);
  const B = (key,w=80) => {
    const cls = !checked ? 'blank' : results[key] ? 'blank blank--ok' : 'blank blank--err';
    return <input style={{minWidth:w}} className={cls} value={vals[key]} placeholder="____" onChange={e=>setVals(p=>({...p,[key]:e.target.value}))} spellCheck={false}/>;
  };

  return (
    <Stage5Shell levelId={10} canProceed={allCorrect} conceptReveal={SUPPORT.reveal}>
      <div className="l510-container">
        <div className="l510-brief">
          <div className="l510-brief-tag">🐘 Stage 5 · Level 5.10 · FILL</div>
          <h2>Subqueries — Queries Inside Queries</h2>
          <p>A subquery runs first, its results feed the outer query. This lets you filter by computed sets without manually writing the set yourself.</p>
        </div>

        <div className="l510-exercise">
          <div className="l510-ex-header"><span className="l510-ex-label">✏️ Fill in the blanks</span></div>
          <div className="l510-sql-block">
            <span className="cm">{'-- 1) Patients in wards on floor 2\n'}</span>
            <span className="kw">SELECT </span><span className="op">* </span><span className="kw">FROM </span><span className="tbl">patients</span><span className="op">{'\n'}</span>
            <span className="kw">WHERE </span><span className="col">ward_id </span>{B('b1',60)}<span className="op"> {'(\n  '}</span>
            {B('b2',70)}<span className="op"> </span><span className="col">id </span><span className="kw">FROM </span><span className="tbl">wards</span><span className="op">{'\n  '}</span>
            {B('b3',70)}<span className="col"> floor </span><span className="op">= </span><span className="num">2</span><span className="op">{'\n);\n\n'}</span>

            <span className="cm">{'-- 2) Patients who HAVE any appointment\n'}</span>
            <span className="kw">SELECT </span><span className="op">* </span><span className="kw">FROM </span><span className="tbl">patients p</span><span className="op">{'\n'}</span>
            <span className="kw">WHERE </span>{B('b4',70)}<span className="op"> {'(\n  SELECT 1 FROM appointments a\n  WHERE a.patient_id = p.id\n);\n\n'}</span>

            <span className="cm">{'-- 3) Patients with NO appointment\n'}</span>
            <span className="kw">SELECT </span><span className="op">* </span><span className="kw">FROM </span><span className="tbl">patients</span><span className="op">{'\n'}</span>
            <span className="kw">WHERE </span><span className="col">id </span>{B('b5',80)}<span className="op"> {'(\n  SELECT patient_id FROM appointments\n);\n'}</span>
          </div>
          {checked && !allCorrect && (
            <div className="l510-hints">
              {Object.keys(BLANKS).filter(k=>!results[k]).map(k=>(
                <div key={k} className="l510-hint">💡 {BLANKS[k].hint}</div>
              ))}
            </div>
          )}
          <button className="l510-check-btn" onClick={check}>{checked?'Check Again':'Check My Answer'}</button>
        </div>

        <div className="l510-compare">
          <div className="l510-ccard">
            <div className="l510-ctitle">IN (subquery)</div>
            <div className="l510-cbody">Returns all rows where the column matches ANY value in the subquery result. Can be slow if subquery returns many rows.</div>
          </div>
          <div className="l510-ccard">
            <div className="l510-ctitle">EXISTS (subquery)</div>
            <div className="l510-cbody">Returns rows where the subquery finds AT LEAST ONE match. Stops searching after first match — often faster than IN.</div>
          </div>
        </div>
      </div>
    </Stage5Shell>
  );
}
