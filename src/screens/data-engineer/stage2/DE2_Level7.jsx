// src/screens/data-engineer/stage2/DE2_Level7.jsx — Data Types & NULLs (FILL)
import { useState } from 'react';
import DE2Shell from './DE2Shell';

const BLANKS = [
  { id:'B1', answer:'CAST', hint:'Convert a value to a different data type' },
  { id:'B2', answer:'COALESCE', hint:'Return first non-NULL value from a list' },
  { id:'B3', answer:'NULLIF', hint:'Return NULL if two values are equal' },
  { id:'B4', answer:'VARCHAR', hint:'Variable-length text — use for names, emails' },
  { id:'B5', answer:'TIMESTAMP', hint:'Date and time — always store in UTC' },
  { id:'B6', answer:'DECIMAL', hint:'Exact decimal — use for money, never FLOAT' },
];

const LINES = [
  '-- Data type conversions',
  'SELECT [B1](admitted_at AS DATE) AS admit_date;',
  "SELECT [B1]('42.50' AS [B6]) AS price;",
  '',
  '-- Handle NULLs elegantly',
  'SELECT [B2](ward_id, 0) AS ward_or_default FROM patients;',
  '-- Returns 0 if ward_id is NULL',
  '',
  'SELECT [B3](fee, 0) AS fee_or_null FROM appointments;',
  '-- Returns NULL if fee equals 0',
  '',
  '-- Choose the right type:',
  '-- Names, email:    [B4](255)',
  '-- Dates with time: [B5]  always UTC',
  '-- Money:           [B6](10,2)  never FLOAT',
];

export default function DE2_Level7() {
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
    <DE2Shell levelId={7} canProceed={allCorrect}
      conceptReveal={[
        { label: 'NULL is Unknown Not Zero', detail: 'NULL means no value — not zero, not empty string. NULL = NULL is UNKNOWN in SQL. Always use IS NULL or IS NOT NULL. COALESCE(ward_id, 0) safely replaces NULL with a default.' },
        { label: 'Never Use FLOAT for Money', detail: 'FLOAT stores approximations: 0.1 + 0.2 = 0.30000000000000004. Always use DECIMAL(10,2) for currency — it stores exact values. A rounding error of 0.01 on 10 million transactions is 100,000 in accounting discrepancy.' },
      ]}
      prevLevelContext="In the last level you fixed queries that lied quietly. Now you'll make them fast — reading EXPLAIN output, understanding index usage, and rewriting a query that scans a million rows unnecessarily."
      cumulativeSkills={[
        "Set up the hospital analytics database and ran first SELECT queries",
        "Written SELECT, FROM, WHERE, ORDER BY, LIMIT, DISTINCT, and LIKE queries",
        "Aggregated patient data with GROUP BY, COUNT, SUM, AVG, and HAVING",
        "Connected patients, wards, appointments, and doctors with INNER and LEFT JOINs",
        "Handled NULL correctly: IS NULL, COALESCE, NULLIF, and NOT EXISTS patterns",
        "Structured complex queries as CTEs: readable, testable, and reusable blocks",
        "Diagnosed four SQL bugs: GROUP BY violation, NULL =, wrong JOIN, integer division",
        "Optimised slow queries using EXPLAIN, index analysis, and query restructuring",
      ]}
    >
      <div className="de2-intro">
        <h1>Data Types & NULLs</h1>
        <p className="de2-tagline">🔢 Wrong types cause silent bugs. Right types prevent them.</p>
        <p className="de2-why">Data engineers spend half their time on type mismatches and NULLs from source systems. CAST, COALESCE, and NULLIF are essential for robust ETL.</p>
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
