// src/screens/data-engineer/stage1/DE1_Level1.jsx — Data Quality Disasters (DEBUG)
import { useState } from 'react';
import DE1Shell from './DE1Shell';
import AnatomyDiagram from '../../../components/AnatomyDiagram';

const BUGS = [
  {
    id:1, label:'Bug 1 — NULL phone numbers crashing the dialler',
    bad:`-- Customer table has phone as optional
SELECT customer_id, UPPER(phone) AS formatted
FROM customers;
-- When phone IS NULL: UPPER(NULL) = NULL — no crash
-- But downstream Python:
formatted_numbers = [row['formatted'].replace('-','') for row in results]
-- AttributeError: 'NoneType' has no attribute 'replace'`,
    good:`-- Fix in SQL: filter or replace NULLs before sending downstream
SELECT customer_id,
       COALESCE(UPPER(phone), 'NO_PHONE') AS formatted
FROM customers
WHERE phone IS NOT NULL;
-- Or handle in Python:
formatted = (row['formatted'] or '').replace('-','')`,
    why:'NULL values travel silently through SQL but explode in Python/Java. Always handle NULLs explicitly at the pipeline boundary — either filter them, replace with a default, or document that downstream code must handle them.',
    hint:'NULL flows through SQL fine but crashes string methods in Python.',
  },
  {
    id:2, label:'Bug 2 — Duplicate transactions inflating revenue',
    bad:`-- ETL job ingests Stripe webhook events
-- Stripe retries failed deliveries — same event arrives twice
INSERT INTO transactions (event_id, amount, customer_id)
SELECT event_id, amount, customer_id
FROM raw_stripe_events;
-- Result: revenue is 30% higher than actual — refunds issued!`,
    good:`-- Fix: use INSERT ... ON CONFLICT DO NOTHING (idempotent load)
INSERT INTO transactions (event_id, amount, customer_id)
SELECT event_id, amount, customer_id
FROM raw_stripe_events
ON CONFLICT (event_id) DO NOTHING;
-- event_id must have a UNIQUE constraint
-- Re-running the pipeline never creates duplicates`,
    why:'External data sources (webhooks, APIs) deliver events at-least-once — duplicates are normal. Pipelines must be idempotent: running them twice should produce the same result as running once. ON CONFLICT DO NOTHING is the SQL pattern.',
    hint:'Webhook retries create duplicate events. Make inserts idempotent.',
  },
  {
    id:3, label:'Bug 3 — Date timezone mismatch losing midnight orders',
    bad:`-- Orders placed at 23:50 UTC stored as 2024-03-15 23:50:00 UTC
-- Analytics team in New York queries:
SELECT DATE(order_time) AS order_date, COUNT(*) AS orders
FROM orders
-- DATE() uses server timezone (UTC)
-- An order at 23:50 UTC = 19:50 EST on March 15
-- But appears as March 15 in UTC → counts for wrong day in reports`,
    good:`-- Always store timestamps in UTC, convert at query time
SELECT DATE(CONVERT_TZ(order_time, 'UTC', 'America/New_York')) AS order_date,
       COUNT(*) AS orders
FROM orders
GROUP BY order_date;
-- Or in BigQuery/Redshift:
-- DATE(order_time AT TIME ZONE 'UTC' AT TIME ZONE 'America/New_York')`,
    why:'Always store timestamps as UTC in the database. Convert to local time only when displaying to users or in reports. Mixing storage timezones in the same table is a data quality disaster waiting to happen.',
    hint:'Store UTC, convert at query time. Never mix timezones in storage.',
  },
];

export default function DE1_Level1() {
  const [found, setFound] = useState(new Set());

  return (
    <DE1Shell levelId={1} canProceed={found.size >= BUGS.length}
      prevLevelContext="In the last level you learned why data engineering exists. Now you'll see what happens when it goes wrong — three real bugs that corrupted live business data."
      cumulativeSkills={[
        "Explained what a data engineer does and why the role exists",
        "Diagnosed three production bugs: NULL crashes, duplicate records, and timezone mismatches",
      ]}

      conceptReveal={[
        { label:'The 3 Data Quality Pillars', detail:'Completeness (no missing values), Uniqueness (no duplicates), Consistency (same timezone, same format everywhere). These three failures cause the majority of "the data is wrong" complaints from analysts.' },
      ]}
    >
      <div className="de1-intro">
        <h1>Data Quality Disasters</h1>
        <p className="de1-tagline">🐛 Three real bugs that corrupted real business data. Find the fixes.</p>
        <p className="de1-why">Bad data costs companies millions. NULLs crash pipelines. Duplicates inflate revenue. Timezone bugs lose orders. These aren't edge cases — they happen on day one in production.</p>
      </div>
      <AnatomyDiagram levelKey="de1-1" color={STAGE_COLOR} title="Three production bugs — what they look like in logs" />
      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        {BUGS.map(bug => (
          <div key={bug.id} style={{background:'#1e293b',borderRadius:10,padding:'16px 20px',border:`1px solid ${found.has(bug.id)?'#4ade8060':'#334155'}`,borderLeft:`3px solid ${found.has(bug.id)?'#4ade80':'#f87171'}`}}>
            <h3 style={{color:found.has(bug.id)?'#4ade80':'#f87171',margin:'0 0 10px',fontSize:14}}>{bug.label}</h3>
            <div className="de1-panel" style={{margin:'0 0 8px'}}>
              <div className="de1-panel-hdr" style={{color:'#f87171'}}>❌ Bug</div>
              <pre className="de1-panel-body" style={{margin:0,overflowX:'auto',fontSize:12,color:'#cbd5e1'}}>{bug.bad}</pre>
            </div>
            <p style={{color:'#64748b',fontSize:13,margin:'8px 0'}}>💡 {bug.hint}</p>
            {!found.has(bug.id) ? (
              <button className="de1-check-btn" style={{background:'#334155',color:'#94a3b8',fontSize:13,padding:'7px 16px'}}
                onClick={() => setFound(p=>{const n=new Set(p);n.add(bug.id);return n;})}>Reveal Fix</button>
            ) : (
              <>
                <div className="de1-panel" style={{margin:'8px 0 6px'}}>
                  <div className="de1-panel-hdr" style={{color:'#4ade80'}}>✅ Fixed</div>
                  <pre className="de1-panel-body" style={{margin:0,overflowX:'auto',fontSize:12,color:'#94a3b8'}}>{bug.good}</pre>
                </div>
                <p style={{color:'#94a3b8',fontSize:13,lineHeight:1.6,margin:'6px 0'}}>{bug.why}</p>
              </>
            )}
          </div>
        ))}
      </div>
      {found.size >= BUGS.length && <div className="de1-feedback success" style={{marginTop:20}}>✅ You understand why data quality is the data engineer's first job.</div>}
    </DE1Shell>
  );
}
