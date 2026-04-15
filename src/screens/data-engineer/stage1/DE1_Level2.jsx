// src/screens/data-engineer/stage1/DE1_Level2.jsx — Anatomy of a Pipeline (FILL)
import { useState } from 'react';
import DE1Shell from './DE1Shell';
import AnatomyDiagram from '../../../components/AnatomyDiagram';

const BLANKS = [
  { id:'B1', answer:'EXTRACT',   hint:'First step — pull data from source systems' },
  { id:'B2', answer:'TRANSFORM', hint:'Second step — clean, validate, reshape the data' },
  { id:'B3', answer:'LOAD',      hint:'Third step — write processed data to destination' },
  { id:'B4', answer:'idempotent',hint:'Running the pipeline twice gives the same result as once' },
  { id:'B5', answer:'lineage',   hint:'Tracking where each piece of data came from' },
  { id:'B6', answer:'schema',    hint:'The structure of the data — column names and types' },
];

const LINES = [
  '# ETL Pipeline — The 3 Steps',
  '# Step 1: [B1] — Pull raw data from source',
  'raw_orders = db.query("SELECT * FROM orders WHERE updated_at > :last_run")',
  '',
  '# Step 2: [B2] — Clean and reshape',
  'def transform(row):',
  '    return {',
  '        "order_id":    row["id"],',
  '        "revenue":     float(row["amount"]) / 100,  # cents to dollars',
  '        "order_date":  row["created_at"].date(),    # strip time',
  '        "status":      row["status"].upper(),        # normalise case',
  '    }',
  'clean_orders = [transform(r) for r in raw_orders if r["amount"] > 0]',
  '',
  '# Step 3: [B3] — Write to data warehouse',
  'warehouse.insert("orders_clean", clean_orders)',
  '',
  '# Good pipelines are [B4]:',
  '# Re-running produces the same result — no duplicates, no data loss',
  '',
  '# Always track data [B5] — where did each row come from?',
  '# And validate the [B6] — are column types what you expect?',
];

export default function DE1_Level2() {
  const [vals, setVals] = useState({});
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState({});

  function check() {
    const r = {};
    BLANKS.forEach(b => { r[b.id] = (vals[b.id]||'').trim().toLowerCase() === b.answer.toLowerCase(); });
    setCorrect(r); setChecked(true);
  }
  const allCorrect = checked && BLANKS.every(b => correct[b.id]);

  function renderLine(line, idx) {
    if (line.startsWith('#')) return <div key={idx} style={{color:'#475569',fontStyle:'italic',padding:'1px 0'}}>{line}</div>;
    if (!line.trim()) return <div key={idx} style={{height:8}}/>;
    const parts = line.split(/(\[B\d\])/g);
    return (
      <div key={idx} style={{padding:'1px 0',color:'#cbd5e1'}}>
        {parts.map((p,i) => {
          const m = p.match(/^\[B(\d)\]$/);
          if (!m) return <span key={i} style={{whiteSpace:'pre'}}>{p}</span>;
          const bid = 'B'+m[1];
          const bl = BLANKS.find(b=>b.id===bid);
          const st = !checked?'':correct[bid]?'correct':'incorrect';
          return <input key={i} className={`de1-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:100}}/>;
        })}
      </div>
    );
  }

  return (
    <DE1Shell levelId={2} canProceed={allCorrect}
      conceptReveal={[
        { label:'ETL vs ELT', detail:'Traditional ETL transforms before loading (good for limited storage). Modern ELT loads raw data first, transforms later in the warehouse (good for cloud scale — BigQuery, Snowflake have cheap storage). Both patterns are used in industry.' },
        { label:'Idempotency', detail:'The most important property of a production pipeline. If your pipeline crashes halfway and reruns, it must not create duplicates or lose data. Use UPSERT (ON CONFLICT), track high-water marks, or use event IDs as deduplication keys.' },
      ]}
      prevLevelContext="In the last level you identified three data quality failures. Now you'll build the pipeline structure that prevents them — Extract, Transform, Load."
      cumulativeSkills={[
        "Explained what a data engineer does and why the role exists",
        "Diagnosed three production bugs: NULL crashes, duplicates, timezone mismatches",
        "Built a three-step ETL pipeline: extraction from source, transformation, idempotent load",
      ]}
    >
      <div className="de1-intro">
        <h1>Anatomy of a Pipeline</h1>
        <p className="de1-tagline">🔧 Extract → Transform → Load. The 3-step heartbeat of every data system.</p>
        <p className="de1-why">Every data pipeline in the world — whether it moves 100 rows or 100 billion — follows this same pattern. Understanding it deeply makes every tool easier to learn.</p>
      </div>
      <AnatomyDiagram levelKey="de1-2" color={STAGE_COLOR} title="ETL pipeline — the hospital as source and destination" />
      <div className="de1-panel">
        <div className="de1-panel-hdr">🐍 Python ETL Pipeline — fill the blanks</div>
        <div className="de1-panel-body" style={{fontFamily:'Fira Code,monospace',fontSize:13}}>{LINES.map(renderLine)}</div>
      </div>
      <button className="de1-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`de1-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ ETL anatomy memorised. This pattern appears in every data job.':'❌ Check your answers.'}</div>}
    </DE1Shell>
  );
}
