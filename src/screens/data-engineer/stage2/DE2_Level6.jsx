// src/screens/data-engineer/stage2/DE2_Level6.jsx — SQL Bug Hunt (DEBUG)
import { useState } from 'react';
import DE2Shell from './DE2Shell';

const BUGS = [
  {
    id:1, label:'Bug 1 — Aggregating without grouping all non-aggregate columns',
    bad:`SELECT ward_id, name, COUNT(*) AS patients
FROM patients
GROUP BY ward_id;
-- ERROR: column "name" must appear in GROUP BY or be used in aggregate`,
    good:`-- Fix: only select columns in GROUP BY + aggregates
SELECT ward_id, COUNT(*) AS patients
FROM patients
GROUP BY ward_id;

-- Or: aggregate name too
SELECT ward_id, STRING_AGG(name, ', ') AS patient_names, COUNT(*) AS patients
FROM patients
GROUP BY ward_id;`,
    why:'Every column in SELECT must either be in GROUP BY or wrapped in an aggregate function. "name" has many values per ward — SQL doesn\'t know which to pick. Standard SQL enforces this strictly (Postgres, BigQuery). MySQL sometimes allows it — giving unpredictable results silently.',
    hint:'Non-aggregate SELECT columns must be in GROUP BY.',
  },
  {
    id:2, label:'Bug 2 — NULL comparison with = instead of IS NULL',
    bad:`-- Find patients with no ward assigned
SELECT name FROM patients
WHERE ward_id = NULL;   -- Returns 0 rows!
-- NULL = NULL is always UNKNOWN, not TRUE`,
    good:`SELECT name FROM patients
WHERE ward_id IS NULL;   -- Correct

-- Also:
WHERE ward_id IS NOT NULL  -- Non-null rows
COALESCE(ward_id, 0)       -- Replace NULL with 0 in expressions
NULLIF(ward_id, 0)         -- Return NULL if ward_id = 0`,
    why:'NULL represents unknown. NULL = NULL is not true — it\'s UNKNOWN. Any comparison with NULL using = or != returns UNKNOWN, which is treated as false. Always use IS NULL / IS NOT NULL. This is the most common SQL beginner bug and silently returns wrong data.',
    hint:'Never use = NULL. Use IS NULL.',
  },
  {
    id:3, label:'Bug 3 — Wrong JOIN type losing data',
    bad:`-- Report: revenue per doctor including doctors with no appointments
SELECT d.name, SUM(a.fee) AS total_revenue
FROM appointments a
INNER JOIN doctors d ON a.doctor_id = d.id
GROUP BY d.name;
-- Doctors with zero appointments are excluded entirely
-- Report understates how many doctors are in the system`,
    good:`SELECT d.name, COALESCE(SUM(a.fee), 0) AS total_revenue
FROM doctors d
LEFT JOIN appointments a ON a.doctor_id = d.id
GROUP BY d.name
ORDER BY total_revenue DESC;
-- All doctors appear; those with no appointments show 0`,
    why:'INNER JOIN excludes doctors who have never had an appointment. LEFT JOIN from doctors includes all doctors — those without appointments get NULL for fee, which SUM ignores (showing 0 with COALESCE). Always think: which rows must appear even if they have no match?',
    hint:'When you need ALL rows from one table, start there with a LEFT JOIN.',
  },
  {
    id:4, label:'Bug 4 — Division producing integer result',
    bad:`-- Calculate what % of patients are in ward 1
SELECT COUNT(*) / (SELECT COUNT(*) FROM patients) AS pct_in_ward1
FROM patients WHERE ward_id = 1;
-- Returns 0! Integer divided by integer = integer in SQL`,
    good:`SELECT
  COUNT(*) * 100.0 / (SELECT COUNT(*) FROM patients) AS pct_in_ward1
FROM patients WHERE ward_id = 1;

-- Or explicitly cast:
SELECT CAST(COUNT(*) AS DECIMAL) / COUNT(*) OVER () AS pct
FROM patients WHERE ward_id = 1;`,
    why:'In SQL, integer / integer = integer (truncated). 3 / 10 = 0, not 0.3. Multiply by 100.0 (not 100) to force a decimal result, or use CAST(). This is an extremely common analytics bug — percentages silently return 0 or wrong whole numbers.',
    hint:'Integer division truncates. Multiply by 100.0 or CAST to decimal.',
  },
];

export default function DE2_Level6() {
  const [found, setFound] = useState(new Set());

  return (
    <DE2Shell levelId={6} canProceed={found.size >= BUGS.length}
      conceptReveal={[{ label:'4 SQL Bugs That Corrupt Analytics', detail:'GROUP BY missing columns, NULL comparison with =, wrong JOIN losing rows, integer division returning 0. These four account for a huge proportion of "the numbers don\'t add up" complaints analysts raise. Knowing them makes you the person who finds them.' }]}
    >
      <div className="de2-intro">
        <h1>SQL Bug Hunt</h1>
        <p className="de2-tagline">🐛 Four bugs that produce wrong data silently. No error messages.</p>
        <p className="de2-why">The worst SQL bugs don't crash — they return wrong numbers confidently. These are in real dashboards right now causing bad business decisions.</p>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        {BUGS.map(bug => (
          <div key={bug.id} style={{background:'#1e293b',borderRadius:10,padding:'16px 20px',border:`1px solid ${found.has(bug.id)?'#4ade8060':'#334155'}`,borderLeft:`3px solid ${found.has(bug.id)?'#4ade80':'#f87171'}`}}>
            <h3 style={{color:found.has(bug.id)?'#4ade80':'#f87171',margin:'0 0 10px',fontSize:14}}>{bug.label}</h3>
            <div className="de2-panel" style={{margin:'0 0 8px'}}>
              <div className="de2-panel-hdr" style={{color:'#f87171'}}>❌ Bug</div>
              <pre className="de2-panel-body" style={{margin:0,overflowX:'auto',fontSize:12,color:'#cbd5e1'}}>{bug.bad}</pre>
            </div>
            <p style={{color:'#64748b',fontSize:13,margin:'8px 0'}}>💡 {bug.hint}</p>
            {!found.has(bug.id) ? (
              <button className="de2-check-btn" style={{background:'#334155',color:'#94a3b8',fontSize:13,padding:'7px 16px'}}
                onClick={() => setFound(p=>{const n=new Set(p);n.add(bug.id);return n;})}>Reveal Fix</button>
            ) : (
              <>
                <div className="de2-panel" style={{margin:'8px 0 6px'}}>
                  <div className="de2-panel-hdr" style={{color:'#4ade80'}}>✅ Fixed</div>
                  <pre className="de2-panel-body" style={{margin:0,overflowX:'auto',fontSize:12,color:'#94a3b8'}}>{bug.good}</pre>
                </div>
                <p style={{color:'#94a3b8',fontSize:13,lineHeight:1.6,margin:'6px 0'}}>{bug.why}</p>
              </>
            )}
          </div>
        ))}
      </div>
      {found.size >= BUGS.length && <div className="de2-feedback success" style={{marginTop:20}}>✅ All 4 SQL bugs identified. Your analytics will never be silently wrong.</div>}
    </DE2Shell>
  );
}
