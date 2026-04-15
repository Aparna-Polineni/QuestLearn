// src/screens/data-engineer/stage1/DE1_Level5.jsx — Data Formats (FILL)
import { useState } from 'react';
import DE1Shell from './DE1Shell';
import AnatomyDiagram from '../../../components/AnatomyDiagram';

const BLANKS = [
  { id:'B1', answer:'CSV',     hint:'Comma-separated values — simplest text format' },
  { id:'B2', answer:'JSON',    hint:'JavaScript Object Notation — nested, flexible' },
  { id:'B3', answer:'Parquet', hint:'Columnar binary format — fast for analytics' },
  { id:'B4', answer:'Avro',    hint:'Row-based binary with schema — ideal for Kafka' },
  { id:'B5', answer:'columnar',hint:'Parquet stores data by column not by row' },
  { id:'B6', answer:'schema',  hint:'Avro embeds the data structure definition in the file' },
];

const LINES = [
  '# [B1] — simple, human-readable, slow for large data',
  'order_id,customer_id,amount',
  '1,42,99.99',
  '2,43,14.50',
  '',
  '# [B2] — flexible, handles nested data, verbose',
  '{"order_id": 1, "customer": {"id": 42, "name": "Maria"}, "amount": 99.99}',
  '',
  '# [B3] — [B5] format, compressed, fast analytics',
  '# Instead of reading all columns, reads only what the query needs',
  '# SELECT revenue FROM orders → reads ONLY the revenue column',
  '# 10x smaller, 10x faster than CSV for analytical queries',
  '',
  '# [B4] — row-based binary with embedded [B6]',
  '# Perfect for Kafka: consumer knows the structure without external config',
  '# Supports schema evolution: add fields without breaking old consumers',
];

export default function DE1_Level5() {
  const [vals, setVals] = useState({});
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState({});

  function check() {
    const r = {};
    BLANKS.forEach(b => { r[b.id]=(vals[b.id]||'').trim().toLowerCase()===b.answer.toLowerCase(); });
    setCorrect(r); setChecked(true);
  }
  const allCorrect = checked && BLANKS.every(b => correct[b.id]);

  function renderLine(line, idx) {
    if (line.startsWith('#')) return <div key={idx} style={{color:'#475569',fontStyle:'italic',padding:'1px 0'}}>{line}</div>;
    if (!line.trim()) return <div key={idx} style={{height:8}}/>;
    const parts = line.split(/(\[B\d\])/g);
    return (
      <div key={idx} style={{padding:'1px 0',color:'#cbd5e1',whiteSpace:'pre-wrap'}}>
        {parts.map((p,i)=>{
          const m=p.match(/^\[B(\d)\]$/); if(!m) return <span key={i}>{p}</span>;
          const bid='B'+m[1]; const bl=BLANKS.find(b=>b.id===bid);
          const st=!checked?'':correct[bid]?'correct':'incorrect';
          return <input key={i} className={`de1-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:80,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <DE1Shell levelId={5} canProceed={allCorrect}
      conceptReveal={[
        { label:'Always Use Parquet for Analytics', detail:'Parquet\'s columnar storage means a query for revenue only reads the revenue column — not names, addresses, or timestamps. For a 100-column table with 1 billion rows, this is the difference between a 10-second query and a 10-minute one. Always store analytical data as Parquet in S3.' },
        { label:'CSV vs JSON in Production', detail:'CSV is fine for small exports and Excel. JSON is good for APIs and flexible schemas. Neither is good for storing billions of analytics rows — they\'re uncompressed and row-based. Parquet or ORC for the data warehouse, Avro for event streams.' },
      ]}
      prevLevelContext="In the last level you decided when to run the pipeline. Now you'll choose what format data travels in — CSV, JSON, Parquet, or Avro — each with different trade-offs at scale."
      cumulativeSkills={[
        "Explained what a data engineer does and why the role exists",
        "Diagnosed three production bugs: NULL crashes, duplicates, timezone mismatches",
        "Built a three-step ETL pipeline: extraction, transformation, idempotent load",
        "Designed a normalised hospital schema: patients, wards, appointments, doctors tables",
        "Chose between batch and streaming for three clinical data scenarios",
        "Selected the right data format for storage, transport, and analytics workloads",
      ]}
    >
      <div className="de1-intro">
        <h1>Data Formats</h1>
        <p className="de1-tagline">📄 CSV is fine for 10,000 rows. Parquet is for 10 billion.</p>
        <p className="de1-why">The format you choose affects storage cost, query speed, and whether schema changes break downstream consumers. Knowing when to use each is a core data engineering skill.</p>
      </div>
      <AnatomyDiagram levelKey="de1-5" color={STAGE_COLOR} title="Four data formats — trade-offs at a glance" />
      <table className="de1-table">
        <thead><tr><th>Format</th><th>Type</th><th>Best For</th><th>Avoid When</th></tr></thead>
        <tbody>
          {[['CSV','Text, row','Small files, Excel','Big analytics'],['JSON','Text, nested','APIs, flexible','10M+ rows'],['Parquet','Binary, columnar','Analytics, S3','Streaming'],['Avro','Binary, row','Kafka, streaming','Ad-hoc queries']].map(([f,t,b,a],i)=>(
            <tr key={i}><td style={{color:'#06b6d4',fontWeight:600}}>{f}</td><td style={{color:'#94a3b8'}}>{t}</td><td style={{color:'#4ade80',fontSize:12}}>{b}</td><td style={{color:'#f87171',fontSize:12}}>{a}</td></tr>
          ))}
        </tbody>
      </table>
      <div className="de1-panel">
        <div className="de1-panel-hdr">📄 Data Formats — fill the blanks</div>
        <div className="de1-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="de1-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`de1-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Format knowledge locked in. You\'ll make the right choice every time.':'❌ Check your answers.'}</div>}
    </DE1Shell>
  );
}
