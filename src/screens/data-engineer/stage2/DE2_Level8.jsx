// src/screens/data-engineer/stage2/DE2_Level8.jsx — Indexes & Query Optimisation (FILL)
import { useState } from 'react';
import DE2Shell from './DE2Shell';

const BLANKS = [
  { id:'B1', answer:'CREATE INDEX', hint:'Add an index to speed up queries on a column' },
  { id:'B2', answer:'EXPLAIN', hint:'Show the query execution plan before running' },
  { id:'B3', answer:'Seq Scan', hint:'Reading every row — slow on large tables' },
  { id:'B4', answer:'Index Scan', hint:'Using the index to jump straight to matches' },
  { id:'B5', answer:'UNIQUE', hint:'Index that also enforces no duplicate values' },
  { id:'B6', answer:'composite', hint:'Index on multiple columns together' },
];

const LINES = [
  '-- Add index on frequently filtered column',
  '[B1] idx_patients_ward ON patients(ward_id);',
  '',
  '-- See the query plan',
  '[B2] SELECT * FROM patients WHERE ward_id = 3;',
  '-- Without index: [B3] reads all rows',
  '-- With index:    [B4] jumps to matching rows',
  '',
  '-- Unique index also enforces a constraint',
  '[B1] [B5] idx_patients_email ON patients(email);',
  '',
  '-- [B6] index for multi-column filters',
  '[B1] idx_appt ON appointments(patient_id, date);',
  '-- Speeds up: WHERE patient_id = ? AND date > ?',
];

export default function DE2_Level8() {
  const [vals, setVals] = useState({});
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState({});

  function check() {
    const r = {};
    BLANKS.forEach(b => {
      r[b.id] = (vals[b.id] || '').trim().toUpperCase() === b.answer.toUpperCase();
    });
    setCorrect(r);
    setChecked(true);
  }
  const allCorrect = checked && BLANKS.every(b => correct[b.id]);

  function renderLine(line, lineIdx) {
    if (line.startsWith('--')) {
      return <div key={lineIdx} style={{color:'#475569',fontStyle:'italic',padding:'1px 0'}}>{line}</div>;
    }
    if (!line.trim()) return <div key={lineIdx} style={{height:8}}/>;
    const parts = line.split(/(\[B\d\])/g);
    return (
      <div key={lineIdx} style={{padding:'1px 0',color:'#cbd5e1',whiteSpace:'pre-wrap'}}>
        {parts.map((p, pIdx) => {
          const m = p.match(/^\[B(\d)\]$/);
          if (!m) return <span key={pIdx}>{p}</span>;
          const bid = 'B' + m[1];
          const bl = BLANKS.find(b => b.id === bid);
          const st = !checked ? '' : correct[bid] ? 'correct' : 'incorrect';
          return (
            <input
              key={pIdx}
              className={`de2-blank ${st}`}
              value={vals[bid] || ''}
              onChange={e => setVals(v => ({ ...v, [bid]: e.target.value }))}
              placeholder={bl?.hint}
              style={{minWidth: 110, whiteSpace: 'normal'}}
            />
          );
        })}
      </div>
    );
  }

  return (
    <DE2Shell levelId={8} canProceed={allCorrect}
      conceptReveal={[
        { label: 'When to Index', detail: 'Index columns in WHERE, JOIN ON, and ORDER BY. Do not index every column — indexes slow INSERT/UPDATE/DELETE. Index foreign keys and high-cardinality filter columns. Avoid indexing boolean columns.' },
        { label: 'EXPLAIN is Your Best Friend', detail: 'EXPLAIN shows the execution plan. Look for: Seq Scan on large tables (bad — add an index), very high row estimates (stale statistics — run ANALYZE).' },
      ]}
    >
      <div className="de2-intro">
        <h1>Indexes & Query Optimisation</h1>
        <p className="de2-tagline">⚡ An index turns a 10-second query into 10 milliseconds.</p>
        <p className="de2-why">Unindexed queries on tables with millions of rows time out in production. Understanding EXPLAIN and index design separates senior from junior data engineers.</p>
      </div>
      <div className="de2-panel">
        <div className="de2-panel-hdr">🗄️ SQL — fill the blanks</div>
        <div className="de2-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="de2-check-btn" onClick={check}>Check Answers</button>
      {checked && (
        <div className={`de2-feedback ${allCorrect ? 'success' : 'error'}`}>
          {allCorrect ? '✅ Correct!' : '❌ Check your answers.'}
        </div>
      )}
    </DE2Shell>
  );
}
