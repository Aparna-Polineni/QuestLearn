// src/screens/data-engineer/stage2/DE2_Level12.jsx — Analytical Query Suite (BUILD)
import { useState } from 'react';
import DE2Shell from './DE2Shell';

const REQS = [
  { id:'r1', label:'Query 1: Top 5 busiest wards by patient count (use GROUP BY + ORDER BY + LIMIT)' },
  { id:'r2', label:'Query 2: Patients with no appointment in the last 90 days (use LEFT JOIN + IS NULL or NOT EXISTS)' },
  { id:'r3', label:'Query 3: Revenue per doctor ranked within each specialty (use window function)' },
  { id:'r4', label:'Query 4: Month-over-month patient admissions (use DATE_TRUNC + LAG)' },
  { id:'r5', label:'Query 5: CTE that finds wards where average stay > 7 days' },
];

const CHECK = {
  r1: c => c.includes('GROUP BY') && c.includes('ORDER BY') && c.includes('LIMIT') && (c.includes('COUNT') || c.includes('WARD')),
  r2: c => (c.includes('LEFT JOIN') || c.includes('NOT EXISTS') || c.includes('NOT IN')) && (c.includes('IS NULL') || c.includes('NOT EXISTS')) && (c.includes('90') || c.includes('INTERVAL')),
  r3: c => c.includes('OVER') && (c.includes('PARTITION BY') || c.includes('RANK') || c.includes('ROW_NUMBER')) && c.includes('SPECIALTY'),
  r4: c => (c.includes('DATE_TRUNC') || c.includes('MONTH') || c.includes('YEAR')) && c.includes('LAG'),
  r5: c => c.includes('WITH') && (c.includes('AVG') || c.includes('AVERAGE')) && (c.includes('7') || c.includes('DAYS') || c.includes('STAY')),
};

const SOLUTION = `-- Schema: patients(id, name, ward_id, admitted_at, discharged_at)
--         wards(id, name, floor, capacity)
--         appointments(id, patient_id, doctor_id, date, fee)
--         doctors(id, name, specialty)

-- Query 1: Top 5 busiest wards
SELECT w.name, COUNT(p.id) AS patient_count
FROM wards w
LEFT JOIN patients p ON p.ward_id = w.id
GROUP BY w.id, w.name
ORDER BY patient_count DESC
LIMIT 5;

-- Query 2: Patients with no appointment in last 90 days
SELECT p.name, p.admitted_at
FROM patients p
LEFT JOIN appointments a
  ON a.patient_id = p.id
  AND a.date >= NOW() - INTERVAL '90 days'
WHERE a.id IS NULL;

-- Query 3: Revenue ranked within each specialty
SELECT
  d.name AS doctor,
  d.specialty,
  SUM(a.fee) AS total_revenue,
  RANK() OVER (PARTITION BY d.specialty ORDER BY SUM(a.fee) DESC) AS rank_in_specialty
FROM doctors d
JOIN appointments a ON a.doctor_id = d.id
GROUP BY d.id, d.name, d.specialty;

-- Query 4: Month-over-month admissions
WITH monthly AS (
  SELECT DATE_TRUNC('month', admitted_at) AS month, COUNT(*) AS admissions
  FROM patients
  GROUP BY 1
)
SELECT month, admissions,
  LAG(admissions, 1) OVER (ORDER BY month) AS prev_month,
  admissions - LAG(admissions, 1) OVER (ORDER BY month) AS change
FROM monthly
ORDER BY month;

-- Query 5: CTE — wards with avg stay > 7 days
WITH avg_stays AS (
  SELECT ward_id,
    AVG(EXTRACT(EPOCH FROM (discharged_at - admitted_at)) / 86400) AS avg_days
  FROM patients
  WHERE discharged_at IS NOT NULL
  GROUP BY ward_id
)
SELECT w.name, ROUND(s.avg_days, 1) AS avg_stay_days
FROM avg_stays s
JOIN wards w ON w.id = s.ward_id
WHERE s.avg_days > 7
ORDER BY avg_days DESC;`;

export default function DE2_Level12() {
  const [code, setCode] = useState('');
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState({});
  const [showSolution, setShowSolution] = useState(false);

  function check() {
    const c = code.toUpperCase();
    const r = {};
    Object.entries(CHECK).forEach(([id, fn]) => { r[id] = fn(c); });
    setResults(r); setChecked(true);
  }

  const passCount = Object.values(results).filter(Boolean).length;
  const allPass = checked && passCount === REQS.length;

  return (
    <DE2Shell levelId={12} canProceed={allPass}>
      <div className="de2-intro">
        <h1>Analytical Query Suite</h1>
        <p className="de2-tagline">⚡ Write 5 production-grade analytical queries from scratch.</p>
        <p className="de2-why">These are real queries analysts request from data engineers. Each one requires combining multiple concepts — GROUP BY, JOINs, window functions, CTEs — in a single query.</p>
      </div>
      <div style={{marginBottom:14}}>
        {REQS.map(r => (
          <div className="de2-req" key={r.id}>
            <span style={{color:!checked?'#475569':results[r.id]?'#4ade80':'#f87171',fontSize:14,width:18}}>{!checked?'○':results[r.id]?'✓':'✗'}</span>
            <span style={{color:'#cbd5e1',fontSize:13}}>{r.label}</span>
          </div>
        ))}
      </div>
      <textarea className="de2-editor" value={code} onChange={e => setCode(e.target.value)}
        placeholder="-- Write all 5 queries here&#10;-- Schema: patients, wards, appointments, doctors" style={{minHeight:320}} />
      <div style={{display:'flex',gap:10,marginTop:10}}>
        <button className="de2-check-btn" onClick={check}>Check Queries</button>
        <button className="de2-check-btn" style={{background:'#334155',color:'#94a3b8'}} onClick={() => setShowSolution(s=>!s)}>
          {showSolution?'Hide':'Show'} Solutions
        </button>
      </div>
      {showSolution && (
        <div className="de2-panel" style={{marginTop:12}}>
          <div className="de2-panel-hdr">✅ Reference Solutions</div>
          <pre className="de2-panel-body" style={{color:'#94a3b8',overflowX:'auto',margin:0,fontSize:12}}>{SOLUTION}</pre>
        </div>
      )}
      {checked && <div className={`de2-feedback ${allPass?'success':'error'}`}>{allPass?'✅ Production SQL skill confirmed.': `❌ ${passCount}/${REQS.length} queries complete.`}</div>}
    </DE2Shell>
  );
}
