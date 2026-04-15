// src/screens/data-engineer/stage1/DE1_Level3.jsx — Schema Design (FILL)
import { useState } from 'react';
import DE1Shell from './DE1Shell';
import AnatomyDiagram from '../../../components/AnatomyDiagram';

const BLANKS = [
  { id:'B1', answer:'fact',       hint:'Central table with measurements/events (orders, clicks)' },
  { id:'B2', answer:'dimension',  hint:'Descriptive table (customers, products, dates)' },
  { id:'B3', answer:'surrogate',  hint:'Warehouse-generated integer key (not the source system ID)' },
  { id:'B4', answer:'grain',      hint:'The level of detail — one row per what?' },
  { id:'B5', answer:'SCD',        hint:'Slowly Changing Dimension — how to handle historical changes' },
  { id:'B6', answer:'star',       hint:'One fact table surrounded by dimension tables' },
];

const LINES = [
  '# Data Warehouse Schema Design',
  '',
  '# [B1] table — the measurements (what happened)',
  'CREATE TABLE fact_orders (',
  '  order_sk       BIGINT PRIMARY KEY,  -- [B3] key (warehouse-generated)',
  '  customer_sk    BIGINT,              -- FK to dim_customers',
  '  product_sk     BIGINT,              -- FK to dim_products',
  '  order_date_sk  INT,                 -- FK to dim_date',
  '  quantity       INT,',
  '  revenue_usd    DECIMAL(10,2)',
  ');',
  '',
  '# [B2] table — the context (who, what, where)',
  'CREATE TABLE dim_customers (',
  '  customer_sk    BIGINT PRIMARY KEY,',
  '  customer_id    VARCHAR(50),  -- source system ID',
  '  name           VARCHAR(100),',
  '  country        VARCHAR(50)',
  ');',
  '',
  '# [B4] = one row per order line item (not per order)',
  '# [B5] Type 2 = add new row when customer address changes (keep history)',
  '# Together: [B6] schema — fast for analytics queries',
];

export default function DE1_Level3() {
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
      <div key={idx} style={{padding:'1px 0',color:'#cbd5e1',whiteSpace:'pre'}}>
        {parts.map((p,i) => {
          const m = p.match(/^\[B(\d)\]$/);
          if (!m) return <span key={i}>{p}</span>;
          const bid = 'B'+m[1];
          const bl = BLANKS.find(b=>b.id===bid);
          const st = !checked?'':correct[bid]?'correct':'incorrect';
          return <input key={i} className={`de1-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:90,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <DE1Shell levelId={3} canProceed={allCorrect}
      conceptReveal={[
        { label:'Star Schema vs Snowflake Schema', detail:'Star: dimension tables are flat (denormalised) — faster queries, more storage. Snowflake: dimensions are normalised into sub-dimensions — less storage, more joins. Analysts prefer star schema. Most modern data warehouses use it.' },
        { label:'Surrogate Keys', detail:'Never use the source system\'s ID as the warehouse primary key. Source IDs can change, be reused, or conflict across systems. A surrogate key is a simple auto-increment integer the warehouse owns — stable, unique, fast to join.' },
      ]}
      prevLevelContext="In the last level you built a pipeline that extracts and loads patient records. Now you'll design the schema those records load into — the structure that makes data queryable."
      cumulativeSkills={[
        "Explained what a data engineer does and why the role exists",
        "Diagnosed three production bugs: NULL crashes, duplicates, timezone mismatches",
        "Built a three-step ETL pipeline: extraction, transformation, idempotent load",
        "Designed a normalised hospital schema: patients, wards, appointments, doctors tables",
      ]}
    >
      <div className="de1-intro">
        <h1>Schema Design</h1>
        <p className="de1-tagline">🗺️ How you structure data determines how fast analysts can query it.</p>
        <p className="de1-why">Operational databases (MySQL, Postgres) are designed for writes. Data warehouses are designed for reads. The star schema — fact + dimension tables — makes analytical queries 10–100x faster.</p>
      </div>
      <AnatomyDiagram levelKey="de1-3" color={STAGE_COLOR} title="Relational schema — four tables, normalised" />
      <table className="de1-table">
        <thead><tr><th>Table Type</th><th>Contains</th><th>Example</th></tr></thead>
        <tbody>
          {[['Fact','Measurements, events, transactions','fact_orders, fact_pageviews'],['Dimension','Descriptive attributes','dim_customers, dim_products, dim_date']].map(([t,c,e],i)=>(
            <tr key={i}><td style={{color:'#06b6d4',fontWeight:600}}>{t}</td><td style={{color:'#94a3b8'}}>{c}</td><td style={{color:'#64748b',fontSize:12}}>{e}</td></tr>
          ))}
        </tbody>
      </table>
      <div className="de1-panel">
        <div className="de1-panel-hdr">🗄️ SQL Schema — fill the blanks</div>
        <div className="de1-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="de1-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`de1-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Schema design mastered. Analysts will love your tables.':'❌ Check your answers.'}</div>}
    </DE1Shell>
  );
}
