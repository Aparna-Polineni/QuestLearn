// src/screens/data-engineer/stage1/DE1_Level6.jsx — The Data Stack (CONCEPTS)
import { useState } from 'react';
import DE1Shell from './DE1Shell';

const LAYERS = [
  { id:'src', emoji:'🏭', title:'Sources', tools:'MySQL, Postgres, Salesforce, APIs, logs, IoT', desc:'Where data is born — operational databases, SaaS apps, event streams. Raw, messy, and not designed for analytics.' },
  { id:'ing', emoji:'📥', title:'Ingestion', tools:'Fivetran, Airbyte, Kafka, custom scripts', desc:'Pull data from sources into the warehouse. Handles connectors, scheduling, and schema changes automatically.' },
  { id:'store', emoji:'🏛️', title:'Storage / Warehouse', tools:'Snowflake, BigQuery, Redshift, S3 + Parquet', desc:'Where clean data lives. Optimised for analytical reads — billions of rows, complex joins, aggregations.' },
  { id:'trans', emoji:'⚙️', title:'Transform', tools:'dbt, Spark, Python, SQL', desc:'Turn raw ingested data into clean, modelled tables ready for analysts. dbt runs SQL transforms with version control and testing.' },
  { id:'viz', emoji:'📊', title:'Visualise / Consume', tools:'Looker, Tableau, Metabase, Python notebooks', desc:'Analysts and data scientists query the clean warehouse data to build dashboards, reports, and ML models.' },
  { id:'orch', emoji:'🎼', title:'Orchestration', tools:'Airflow, Prefect, Dagster', desc:'Schedule and monitor all the above. If ingestion fails, orchestration alerts you. Airflow DAGs define the pipeline dependencies.' },
];

export default function DE1_Level6() {
  const [seen, setSeen] = useState(new Set());
  const toggle = id => setSeen(p => { const n = new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });

  return (
    <DE1Shell levelId={6} canProceed={seen.size >= LAYERS.length}>
      <div className="de1-intro">
        <h1>The Modern Data Stack</h1>
        <p className="de1-tagline">🏗️ Six layers. Every company uses some version of this.</p>
        <p className="de1-why">Understanding the full stack tells you where your work fits — and which tools to learn for which job. You'll touch all six layers across Stages 2–7.</p>
      </div>

      <div style={{display:'flex',alignItems:'center',justifyContent:'center',flexWrap:'wrap',gap:0,margin:'20px 0'}}>
        {LAYERS.map((l,i) => (
          <span key={l.id} style={{display:'flex',alignItems:'center'}}>
            <div onClick={() => toggle(l.id)} style={{
              background: seen.has(l.id) ? '#0e7490' : '#1e293b',
              border:`2px solid ${seen.has(l.id)?'#06b6d4':'#334155'}`,
              borderRadius:8, padding:'10px 14px', textAlign:'center',
              cursor:'pointer', minWidth:90, transition:'all .2s',
            }}>
              <div style={{fontSize:20}}>{l.emoji}</div>
              <div style={{fontSize:12,fontWeight:700,color:'#e2e8f0',marginTop:4}}>{l.title}</div>
            </div>
            {i < LAYERS.length-1 && <div style={{color:'#475569',fontSize:18,padding:'0 4px'}}>→</div>}
          </span>
        ))}
      </div>

      <div className="de1-cards">
        {LAYERS.map(l => (
          <div key={l.id} className={`de1-card ${seen.has(l.id)?'seen':''}`} onClick={() => toggle(l.id)}>
            <div className="de1-card-top">
              <span className="de1-card-title">{l.emoji} {l.title}</span>
              <span style={{color:'#06b6d4',fontSize:11}}>{seen.has(l.id)?'▲':'▼'}</span>
            </div>
            {seen.has(l.id) && (
              <>
                <p className="de1-card-body">{l.desc}</p>
                <p style={{color:'#64748b',fontSize:12,margin:'8px 0 0'}}><strong style={{color:'#06b6d4'}}>Tools:</strong> {l.tools}</p>
              </>
            )}
          </div>
        ))}
      </div>
      {seen.size < LAYERS.length && <p style={{textAlign:'center',color:'#475569',fontSize:13}}>Explore all {LAYERS.length} layers to continue →</p>}
      {seen.size >= LAYERS.length && <div className="de1-feedback success">✅ You know the full stack. Stage 1 capstone next.</div>}
    </DE1Shell>
  );
}
