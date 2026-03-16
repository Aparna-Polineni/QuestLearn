// src/screens/data-engineer/stage1/DE1_Level7.jsx — Capstone: Design a Pipeline (BUILD)
import { useState } from 'react';
import DE1Shell from './DE1Shell';

const REQS = [
  { id:'r1', label:'Identify source system and data format (CSV/JSON/DB)' },
  { id:'r2', label:'Define the ETL steps: Extract → Transform → Load' },
  { id:'r3', label:'Specify the destination schema (fact/dimension or flat table)' },
  { id:'r4', label:'Address data quality: NULLs, duplicates, type validation' },
  { id:'r5', label:'Choose batch or streaming with justification' },
  { id:'r6', label:'Name the orchestration tool and schedule' },
];

const CHECK = {
  r1: c => (c.includes('SOURCE') || c.includes('CSV') || c.includes('JSON') || c.includes('API') || c.includes('DATABASE')),
  r2: c => c.includes('EXTRACT') && c.includes('TRANSFORM') && c.includes('LOAD'),
  r3: c => c.includes('FACT') || c.includes('DIMENSION') || c.includes('SCHEMA') || c.includes('TABLE'),
  r4: c => (c.includes('NULL') || c.includes('DUPLICATE') || c.includes('QUALITY') || c.includes('VALIDATE')),
  r5: c => (c.includes('BATCH') || c.includes('STREAMING')) && (c.includes('BECAUSE') || c.includes('SINCE') || c.includes('REQUIRE') || c.includes('LATENCY')),
  r6: c => (c.includes('AIRFLOW') || c.includes('PREFECT') || c.includes('DAGSTER') || c.includes('CRON')),
};

const SOLUTION = `# Pipeline Design: E-commerce Order Analytics

## Source
- Source: MySQL orders database (operational)
- Format: Relational tables (orders, order_items, customers)
- Volume: ~50,000 orders/day

## ETL Steps
1. EXTRACT: Incremental pull using updated_at > last_run timestamp
2. TRANSFORM:
   - Join orders + customers + items into a flat record
   - Convert amounts from cents to dollars
   - Standardise country codes (ISO 3166)
   - Parse timestamps to UTC
3. LOAD: Insert into BigQuery fact_orders table (ON CONFLICT DO NOTHING)

## Schema
fact_orders (order_sk, customer_sk, date_sk, product_sk, quantity, revenue_usd)
dim_customers (customer_sk, customer_id, name, country, email_domain)
dim_date (date_sk, date, year, month, quarter, day_of_week)

## Data Quality
- Filter rows where amount IS NULL or amount <= 0
- Deduplicate on order_id (surrogate key prevents re-inserts)
- Validate email format using regex before loading
- Alert if daily row count drops below 40,000 (anomaly detection)

## Batch vs Streaming
Batch — daily report latency is acceptable (analysts need yesterday's data by 8am)
Streaming would add complexity with no business benefit here

## Orchestration
Tool: Airflow
Schedule: 0 3 * * * (3am daily — after all orders close)
Alerts: email + Slack on failure, PagerDuty if 2 consecutive failures`;

export default function DE1_Level7() {
  const [code, setCode] = useState('');
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState({});
  const [showSolution, setShowSolution] = useState(false);

  function check() {
    const c = code.toUpperCase();
    const r = {};
    Object.entries(CHECK).forEach(([id,fn]) => { r[id] = fn(c); });
    setResults(r); setChecked(true);
  }

  const passCount = Object.values(results).filter(Boolean).length;
  const allPass = checked && passCount === REQS.length;

  return (
    <DE1Shell levelId={7} canProceed={allPass}
      conceptReveal={[
        { label:'Stage 1 Complete', detail:'You now understand why data engineering exists, what bad data costs, how ETL pipelines work, star schema design, batch vs streaming trade-offs, data formats, and the full modern data stack. Stage 2 starts writing real SQL against messy datasets.' },
      ]}
    >
      <div className="de1-intro">
        <h1>Capstone — Design a Pipeline</h1>
        <p className="de1-tagline">🏆 Design an end-to-end data pipeline from scratch.</p>
        <p className="de1-why">A junior data engineer's first task is often: "we need analytics on X — design the pipeline." This is that task. Write a design document covering all six requirements.</p>
      </div>

      <div style={{marginBottom:14}}>
        {REQS.map(r => (
          <div className="de1-req" key={r.id}>
            <span style={{color:!checked?'#475569':results[r.id]?'#4ade80':'#f87171',fontSize:14,width:18}}>
              {!checked?'○':results[r.id]?'✓':'✗'}
            </span>
            <span style={{color:'#cbd5e1',fontSize:13}}>{r.label}</span>
          </div>
        ))}
      </div>

      <textarea className="de1-editor" value={code} onChange={e => setCode(e.target.value)}
        placeholder="# Design your data pipeline here...&#10;# Cover: source, ETL steps, schema, data quality, batch/streaming choice, orchestration"
        style={{minHeight:300}} />

      <div style={{display:'flex',gap:10,marginTop:10}}>
        <button className="de1-check-btn" onClick={check}>Check Design</button>
        <button className="de1-check-btn" style={{background:'#334155',color:'#94a3b8'}} onClick={() => setShowSolution(s=>!s)}>
          {showSolution?'Hide':'Show'} Example Solution
        </button>
      </div>

      {showSolution && (
        <div className="de1-panel" style={{marginTop:12}}>
          <div className="de1-panel-hdr">✅ Example Solution</div>
          <pre className="de1-panel-body" style={{color:'#94a3b8',overflowX:'auto',margin:0,fontSize:12}}>{SOLUTION}</pre>
        </div>
      )}

      {checked && (
        <div className={`de1-feedback ${allPass?'success':'error'}`}>
          {allPass ? '🎓 Stage 1 Complete! You think like a data engineer.' : `❌ ${passCount}/${REQS.length} requirements met. Add the missing pieces.`}
        </div>
      )}
    </DE1Shell>
  );
}
