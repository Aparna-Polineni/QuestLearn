// src/screens/data-engineer/stage2/DE2_Level12.jsx — Analytical Query Suite (BUILD)
// Uses RubricValidator — keyword rubric with per-criterion feedback
import { useState } from 'react';
import DE2Shell from './DE2Shell';
import { RubricValidator, checks } from '../../../components/BuildValidator';

const RUBRIC = [
  {
    label:    'Query 1 — Top 5 busiest wards: uses GROUP BY + ORDER BY + LIMIT with COUNT',
    check:    (_, u) => u.includes('GROUP BY') && u.includes('ORDER BY') && u.includes('LIMIT') && u.includes('COUNT'),
    hint:     'COUNT(*) to count patients per ward, GROUP BY ward, ORDER BY count DESC, LIMIT 5.',
  },
  {
    label:    'Query 2 — Patients with no appointment in 90 days: uses LEFT JOIN with IS NULL or NOT EXISTS',
    check:    (_, u) => (u.includes('LEFT JOIN') || u.includes('NOT EXISTS') || u.includes('NOT IN'))
                     && (u.includes('IS NULL') || u.includes('NOT EXISTS'))
                     && (u.includes('90') || u.includes('INTERVAL')),
    hint:     'LEFT JOIN appointments ON patient_id, filter WHERE appointment.id IS NULL, add date condition.',
  },
  {
    label:    'Query 3 — Revenue per doctor ranked within specialty: uses OVER (PARTITION BY)',
    check:    (_, u) => u.includes('OVER') && (u.includes('PARTITION BY') || u.includes('RANK') || u.includes('ROW_NUMBER')),
    hint:     'Use RANK() OVER (PARTITION BY d.specialty ORDER BY SUM(a.fee) DESC) — window functions need OVER.',
  },
  {
    label:    'Query 4 — Month-over-month admissions: uses LAG() with date truncation',
    check:    (_, u) => (u.includes('DATE_TRUNC') || u.includes('MONTH') || u.includes('YEAR')) && u.includes('LAG'),
    hint:     'DATE_TRUNC(\'month\', admitted_at) groups by month. LAG(count, 1) OVER (ORDER BY month) gets previous month.',
  },
  {
    label:    'Query 5 — Wards where avg stay > 7 days: uses WITH (CTE) and AVG()',
    check:    (_, u) => u.includes('WITH') && (u.includes('AVG') || u.includes('AVERAGE')) && (u.includes('7') || u.includes('DAYS') || u.includes('STAY')),
    hint:     'WITH avg_stays AS (SELECT ward_id, AVG(...) ...) SELECT ... WHERE avg_days > 7.',
  },
];

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
SELECT d.name, d.specialty, SUM(a.fee) AS revenue,
  RANK() OVER (PARTITION BY d.specialty ORDER BY SUM(a.fee) DESC) AS rank
FROM doctors d
JOIN appointments a ON a.doctor_id = d.id
GROUP BY d.id, d.name, d.specialty;

-- Query 4: Month-over-month admissions
WITH monthly AS (
  SELECT DATE_TRUNC('month', admitted_at) AS month, COUNT(*) AS admissions
  FROM patients GROUP BY 1
)
SELECT month, admissions,
  LAG(admissions) OVER (ORDER BY month) AS prev_month,
  admissions - LAG(admissions) OVER (ORDER BY month) AS change
FROM monthly ORDER BY month;

-- Query 5: Wards with avg stay > 7 days
WITH avg_stays AS (
  SELECT ward_id,
    AVG(EXTRACT(EPOCH FROM (discharged_at - admitted_at)) / 86400) AS avg_days
  FROM patients WHERE discharged_at IS NOT NULL
  GROUP BY ward_id
)
SELECT w.name, ROUND(s.avg_days, 1) AS avg_stay_days
FROM avg_stays s JOIN wards w ON w.id = s.ward_id
WHERE s.avg_days > 7 ORDER BY avg_days DESC;`;

export default function DE2_Level12() {
  const [passed, setPassed] = useState(false);

  return (
    <DE2Shell levelId={12} canProceed={passed}
      conceptReveal={[{
        label: 'The 5 Query Patterns',
        detail: 'Every analytical query falls into one of five patterns: aggregation (GROUP BY), anti-join (LEFT JOIN + IS NULL), window function (OVER PARTITION BY), time-series (LAG/LEAD), or CTE composition (WITH). Recognise the pattern first — then the syntax follows naturally.',
      }]}
    >
      <div className="de2-intro">
        <h1>Analytical Query Suite</h1>
        <p className="de2-tagline">⚡ Write 5 production-grade queries. Each criterion shows exactly what to include.</p>
        <p className="de2-why">
          These are real queries data analysts ask data engineers to build. When a criterion fails,
          you'll see exactly which concept is missing — not just "wrong."
        </p>
      </div>

      <div className="de2-panel" style={{ marginBottom: 14 }}>
        <div className="de2-panel-hdr">🏥 Schema — Hospital Analytics Database</div>
        <pre className="de2-panel-body" style={{ fontSize: 12, color: '#64748b' }}>
{`patients(id, name, ward_id, admitted_at, discharged_at)
wards(id, name, floor, capacity)
appointments(id, patient_id, doctor_id, date, fee)
doctors(id, name, specialty)`}
        </pre>
      </div>

      <RubricValidator
        language="SQL"
        rubric={RUBRIC}
        solutionCode={SOLUTION}
        onAllPassed={() => setPassed(true)}
      />
    </DE2Shell>
  );
}
