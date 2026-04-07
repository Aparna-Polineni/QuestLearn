// src/screens/data-engineer/stage2/DE2_Level4.jsx — Subqueries & CTEs (FILL)
import { useState } from 'react';
import DE2Shell from './DE2Shell';

const BLANKS = [
  { id:'B1', answer:'WITH',      hint:'Start a CTE — Common Table Expression' },
  { id:'B2', answer:'AS',        hint:'Name the CTE result set' },
  { id:'B3', answer:'IN',        hint:'Value must be in the subquery result list' },
  { id:'B4', answer:'EXISTS',    hint:'True if the subquery returns at least one row' },
  { id:'B5', answer:'NOT IN',    hint:'Value must NOT be in the subquery results' },
  { id:'B6', answer:'RECURSIVE', hint:'CTE that references itself — for hierarchical data' },
];

const LINES = [
  '-- Subquery: patients in wards on floor 2',
  'SELECT name FROM patients',
  'WHERE ward_id [B3] (',
  '  SELECT id FROM wards WHERE floor = 2',
  ');',
  '',
  '-- EXISTS: wards that have at least one patient',
  'SELECT name FROM wards w',
  'WHERE [B4] (SELECT 1 FROM patients p WHERE p.ward_id = w.id);',
  '',
  '-- NOT IN: patients with no appointment ever',
  'SELECT name FROM patients',
  'WHERE id [B5] (SELECT patient_id FROM appointments);',
  '',
  '-- CTE: cleaner than nested subqueries',
  '[B1] high_revenue_doctors [B2] (',
  '  SELECT doctor_id, SUM(fee) AS total',
  '  FROM appointments',
  '  GROUP BY doctor_id',
  '  HAVING SUM(fee) > 10000',
  '),',
  'doctor_names AS (',
  '  SELECT d.id, d.name FROM doctors d',
  '  JOIN high_revenue_doctors h ON d.id = h.doctor_id',
  ')',
  'SELECT * FROM doctor_names;',
];

export default function DE2_Level4() {
  const [vals, setVals] = useState({});
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState({});

  function check() {
    const r = {};
    BLANKS.forEach(b => { r[b.id]=(vals[b.id]||'').trim().toUpperCase()===b.answer.toUpperCase(); });
    setCorrect(r); setChecked(true);
  }
  const allCorrect = checked && BLANKS.every(b => correct[b.id]);

  function renderLine(line, idx) {
    if (line.startsWith('--')) return <div key={idx} style={{color:'#475569',fontStyle:'italic',padding:'1px 0'}}>{line}</div>;
    if (!line.trim()) return <div key={idx} style={{height:8}}/>;
    const parts = line.split(/(\[B\d\])/g);
    return (
      <div key={idx} style={{padding:'1px 0',color:'#cbd5e1',whiteSpace:'pre-wrap'}}>
        {parts.map((p,i)=>{
          const m=p.match(/^\[B(\d)\]$/); if(!m) return <span key={i}>{p}</span>;
          const bid='B'+m[1]; const bl=BLANKS.find(b=>b.id===bid);
          const st=!checked?'':correct[bid]?'correct':'incorrect';
          return <input key={i} className={`de2-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:bid==='B6'?100:70,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <DE2Shell levelId={4} canProceed={allCorrect}
      conceptReveal={[
        { label:'CTE vs Subquery', detail:'A CTE (WITH clause) names a subquery result and lets you reference it multiple times. It\'s not faster — the database executes it the same way — but it\'s dramatically more readable. Complex multi-step transformations are unreadable as nested subqueries but clear as a chain of CTEs.' },
        { label:'EXISTS vs IN', detail:'EXISTS stops as soon as it finds one matching row — faster for large tables. IN evaluates the entire subquery. For correlated subqueries (WHERE EXISTS(SELECT 1 FROM ... WHERE outer.id = inner.id)), EXISTS is almost always faster. For simple lists, both are fine.' },
      ]}
      prevLevelContext="In the last level you joined tables. Now you\'ll handle the value that breaks every join silently — NULL — and write queries that return correct results even when data is missing."
      cumulativeSkills={[
        "Set up the hospital analytics database and ran first SELECT queries",
        "Written SELECT, FROM, WHERE, ORDER BY, LIMIT, DISTINCT, and LIKE queries",
        "Aggregated patient data with GROUP BY, COUNT, SUM, AVG, and HAVING",
        "Connected patients, wards, appointments, and doctors with INNER and LEFT JOINs",
        "Handled NULL correctly: IS NULL, COALESCE, NULLIF, and NOT EXISTS patterns",
      ]}
    >
      <div className="de2-intro">
        <h1>Subqueries & CTEs</h1>
        <p className="de2-tagline">🏗️ Break complex queries into readable steps.</p>
        <p className="de2-why">Real analytical queries have multiple steps. CTEs let you write each step clearly, name it, and build on it — instead of nesting subqueries 5 levels deep.</p>
      </div>
      <div className="de2-panel">
        <div className="de2-panel-hdr">🏗️ Subqueries & CTEs — fill the blanks</div>
        <div className="de2-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="de2-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`de2-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ CTEs and subqueries mastered.':'❌ Check your answers.'}</div>}
    </DE2Shell>
  );
}
