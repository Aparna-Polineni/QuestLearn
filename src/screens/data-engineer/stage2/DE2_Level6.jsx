// src/screens/data-engineer/stage2/DE2_Level6.jsx — SQL Bug Hunt (DEBUG)
// Reference implementation of DebugDiagnostic
import { useState } from 'react';
import DE2Shell from './DE2Shell';
import { DebugDiagnostic } from '../../../components/LevelSupport';

const BUGS = [
  {
    id: 1,
    label: 'Bug 1 — Aggregating without grouping all non-aggregate columns',
    bad:
`SELECT ward_id, name, COUNT(*) AS patients
FROM patients
GROUP BY ward_id;
-- Runs in MySQL but returns unpredictable names
-- Fails in Postgres, BigQuery, standard SQL`,
    good:
`-- Fix: only select columns that are in GROUP BY or wrapped in an aggregate
SELECT ward_id, COUNT(*) AS patients
FROM patients
GROUP BY ward_id;

-- If you need name: pick a specific one with MIN/MAX
SELECT ward_id, MIN(name) AS sample_name, COUNT(*) AS patients
FROM patients
GROUP BY ward_id;`,
    why: 'Every column in SELECT must either be in GROUP BY or wrapped in an aggregate function. "name" has many values per ward — SQL doesn\'t know which to return. Standard SQL enforces this. MySQL sometimes allows it, giving unpredictable results silently.',
    hint: 'Non-aggregate SELECT columns must be in GROUP BY.',
    // DebugDiagnostic fields — for WRONG selections
    wrong_category: 'logic',
    wrong_direction: 'The GROUP BY clause itself is not the problem — the issue is in what you\'re selecting alongside it. Look at which columns appear in SELECT vs which appear in GROUP BY.',
    wrong_hint: 'Count the columns in SELECT. Count the columns in GROUP BY. Do they match (excluding aggregates)?',
  },
  {
    id: 2,
    label: 'Bug 2 — NULL comparison with = instead of IS NULL',
    bad:
`-- Find patients with no ward assigned
SELECT name FROM patients
WHERE ward_id = NULL;
-- Returns 0 rows — always — even when NULLs exist`,
    good:
`-- Fix: NULL comparisons require IS NULL / IS NOT NULL
SELECT name FROM patients
WHERE ward_id IS NULL;

-- Checking for non-null:
WHERE ward_id IS NOT NULL`,
    why: 'NULL means unknown. NULL = NULL evaluates to UNKNOWN (not TRUE) in SQL. Any comparison with NULL using = or != returns UNKNOWN, which is treated as false. IS NULL is the only correct way to test for NULL.',
    hint: 'Never use = NULL. Use IS NULL.',
    wrong_category: 'null',
    wrong_direction: 'The structure of the query is fine — WHERE clause is in the right place. The problem is much smaller: look at the comparison operator used with NULL specifically.',
    wrong_hint: 'In SQL, you cannot compare a value to NULL using =. NULL is "unknown" — it requires a different operator.',
  },
  {
    id: 3,
    label: 'Bug 3 — Wrong JOIN type losing data',
    bad:
`-- Report: revenue per doctor including doctors with no appointments
SELECT d.name, SUM(a.fee) AS total_revenue
FROM appointments a
INNER JOIN doctors d ON a.doctor_id = d.id
GROUP BY d.name;
-- Doctors with zero appointments don't appear`,
    good:
`-- Fix: start from doctors, LEFT JOIN to appointments
SELECT d.name, COALESCE(SUM(a.fee), 0) AS total_revenue
FROM doctors d
LEFT JOIN appointments a ON a.doctor_id = d.id
GROUP BY d.name;
-- COALESCE turns NULL sum (no appointments) into 0`,
    why: 'INNER JOIN excludes doctors who have no appointments at all. LEFT JOIN from doctors includes all doctors — those without appointments get NULL for fee fields, which COALESCE converts to 0.',
    hint: 'When you need ALL rows from one table, start there with a LEFT JOIN.',
    wrong_category: 'logic',
    wrong_direction: 'The aggregation and grouping are correct. The problem is about which rows survive the join. Ask: which doctors will this query return — all doctors, or only doctors who already have appointments?',
    wrong_hint: 'INNER JOIN returns only rows that match in both tables. What happens to a doctor who has never had an appointment?',
  },
  {
    id: 4,
    label: 'Bug 4 — Integer division silently truncates',
    bad:
`-- Calculate percentage of patients in ward 1
SELECT
  SUM(CASE WHEN ward_id = 1 THEN 1 ELSE 0 END) * 100 / COUNT(*) AS pct
FROM patients;
-- Returns 0 when ward_1_count < total_count`,
    good:
`-- Fix: force decimal arithmetic with 100.0 or CAST
SELECT
  SUM(CASE WHEN ward_id = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS pct
FROM patients;

-- Alternative:
  CAST(SUM(CASE WHEN ward_id = 1 THEN 1 ELSE 0 END) AS DECIMAL(10,2))
  * 100 / COUNT(*) AS pct`,
    why: 'In SQL, integer ÷ integer = integer (truncated). 3 / 10 = 0, not 0.3. Changing 100 to 100.0 forces floating-point arithmetic for the whole expression. This is an extremely common analytics bug — percentages silently return 0.',
    hint: 'Integer division truncates. Use 100.0 or CAST to decimal.',
    wrong_category: 'type',
    wrong_direction: 'The CASE statement logic is fine. The aggregation is fine. The problem is in how SQL handles arithmetic between two integers — specifically what happens to the decimal part of the result.',
    wrong_hint: 'What is 3 / 10 in integer arithmetic? What is 3 / 10.0?',
  },
];

export default function DE2_Level6() {
  const [found,    setFound]    = useState(new Set());
  const [selected, setSelected] = useState(null); // wrong selection for diagnostic

  function handleReveal(bugId) {
    setFound(prev => { const n = new Set(prev); n.add(bugId); return n; });
    setSelected(null);
  }

  const allDone = found.size >= BUGS.length;

  return (
    <DE2Shell levelId={6} canProceed={allDone}
      conceptReveal={[
        { label:'The Four SQL Traps', detail:'GROUP BY without all non-aggregate selects, NULL = NULL (always false), wrong JOIN type losing rows, integer division truncating decimals. These four bugs are in real production SQL right now. Recognise them from the symptom: unexpected zero rows, wrong totals, missing data, or truncated percentages.' },
      ]}
      prevLevelContext="In the last level you structured queries with CTEs. Now you\'ll find four bugs producing silently wrong data — the SQL errors that appear in real hospital dashboards today."
      cumulativeSkills={[
        "Set up the hospital analytics database and ran first SELECT queries",
        "Written SELECT, FROM, WHERE, ORDER BY, LIMIT, DISTINCT, and LIKE queries",
        "Aggregated patient data with GROUP BY, COUNT, SUM, AVG, and HAVING",
        "Connected patients, wards, appointments, and doctors with INNER and LEFT JOINs",
        "Handled NULL correctly: IS NULL, COALESCE, NULLIF, and NOT EXISTS patterns",
        "Structured complex queries as CTEs: readable, testable, and reusable blocks",
        "Diagnosed four SQL bugs: GROUP BY violation, NULL =, wrong JOIN, integer division",
      ]}
    >
      <div className="de2-intro">
        <h1>SQL Bug Hunt</h1>
        <p className="de2-tagline">🐛 Four bugs producing silently wrong data. Find and fix each one.</p>
        <p className="de2-why">The worst SQL bugs don't throw errors — they return plausible-looking wrong results. 0 rows when you expect some. 0% when the real answer is 33%. These are in production dashboards right now.</p>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {BUGS.map(bug => {
          const isSolved = found.has(bug.id);
          const isWrongSelected = selected === bug.id && !isSolved;

          return (
            <div key={bug.id} style={{
              background:'#1e293b', borderRadius:10, padding:'16px 20px',
              border:`1px solid ${isSolved ? '#4ade8060' : '#334155'}`,
              borderLeft:`3px solid ${isSolved ? '#4ade80' : '#f87171'}`,
            }}>
              <h3 style={{ color: isSolved ? '#4ade80' : '#f87171', margin:'0 0 10px', fontSize:14 }}>
                {bug.label}
              </h3>

              {/* Buggy code */}
              <div className="de2-panel" style={{ margin:'0 0 8px' }}>
                <div className="de2-panel-hdr" style={{ color:'#f87171' }}>❌ Buggy code</div>
                <pre className="de2-panel-body" style={{ margin:0, overflowX:'auto', fontSize:12, color:'#cbd5e1' }}>
                  {bug.bad}
                </pre>
              </div>

              {/* Hint */}
              <p style={{ color:'#64748b', fontSize:13, margin:'8px 0' }}>💡 {bug.hint}</p>

              {/* DebugDiagnostic — shown when wrong bug selected */}
              {isWrongSelected && (
                <DebugDiagnostic
                  selectedId={selected}
                  correctId={bug.id}
                  bugs={[{ ...bug, id: 'wrong' }]}
                  onClear={() => setSelected(null)}
                />
              )}

              {!isSolved ? (
                <button
                  className="de2-check-btn"
                  style={{ background:'#334155', color:'#94a3b8', fontSize:13, padding:'7px 16px' }}
                  onClick={() => handleReveal(bug.id)}
                >
                  Show Fix & Explanation
                </button>
              ) : (
                <>
                  <div className="de2-panel" style={{ margin:'8px 0 6px' }}>
                    <div className="de2-panel-hdr" style={{ color:'#4ade80' }}>✅ Fixed code</div>
                    <pre className="de2-panel-body" style={{ margin:0, overflowX:'auto', fontSize:12, color:'#94a3b8' }}>
                      {bug.good}
                    </pre>
                  </div>
                  <p style={{ color:'#94a3b8', fontSize:13, lineHeight:1.6, margin:'6px 0' }}>{bug.why}</p>
                </>
              )}
            </div>
          );
        })}
      </div>

      {allDone && (
        <div className="de2-feedback success" style={{ marginTop:20 }}>
          ✅ Four SQL traps identified. Your queries will never silently lie.
        </div>
      )}
    </DE2Shell>
  );
}
