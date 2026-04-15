// src/screens/data-engineer/stage1/DE1_Level0.jsx — CONCEPTS
import { useState } from 'react';
import DE1Shell from './DE1Shell';
import AnatomyDiagram from '../../../components/AnatomyDiagram';

const CARDS = [
  { id:'de', title:'What is a Data Engineer?', body:'A data engineer builds the plumbing that moves data from where it\'s created to where it\'s used. Analysts and ML models can\'t work if the data is messy, missing, or in the wrong place. Data engineers fix that.' },
  { id:'pipeline', title:'What is a Data Pipeline?', body:'A pipeline is a series of steps that takes raw data (messy, scattered) and produces clean, structured data ready for analysis. Steps: Extract from source → Transform (clean, enrich) → Load into destination. This is ETL.' },
  { id:'vs', title:'Data Engineer vs Data Analyst vs Data Scientist', body:'Data Engineer: builds the infrastructure. Data Analyst: queries the data, makes dashboards. Data Scientist: builds models on top of the clean data. Without data engineers, analysts and scientists have nothing to work with.' },
  { id:'scale', title:'Why Scale Matters', body:'A startup with 1,000 users can query a spreadsheet. A company with 10 million events per day needs distributed systems — Spark, Kafka, cloud warehouses. Data engineers design systems that work at both scales.' },
  { id:'stack', title:'The Modern Data Stack', body:'Sources (databases, APIs, logs) → Ingestion (Fivetran, Airbyte) → Warehouse (Snowflake, BigQuery, Redshift) → Transform (dbt) → Visualise (Looker, Tableau). You\'ll build every part of this.' },
  { id:'job', title:'What You\'ll Be Able to Do', body:'Design schemas, write SQL for complex queries, build Python pipelines with Pandas, orchestrate jobs with Airflow, process millions of rows with Spark, stream real-time data with Kafka, and deploy to AWS.' },
];

export default function DE1_Level0() {
  const [seen, setSeen] = useState(new Set());
  const toggle = id => setSeen(p => { const n = new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });

  return (
    <DE1Shell levelId={0} canProceed={seen.size >= CARDS.length}
      cumulativeSkills={[
        "Explained what a data engineer does and why the role exists",
      ]}
    >
      <div className="de1-intro">
        <h1>What is Data Engineering?</h1>
        <p className="de1-tagline">🛢️ You build the pipes. Everyone else drinks the water.</p>
        <p className="de1-why">Before analysts can analyse and models can learn, someone has to collect the raw data, clean it, move it, and store it correctly. That person is a data engineer.</p>
      </div>
      <AnatomyDiagram levelKey="de1-0" color={STAGE_COLOR} title="The data engineering ecosystem — who builds what" />
      <div className="de1-cards">
        {CARDS.map(c => (
          <div key={c.id} className={`de1-card ${seen.has(c.id)?'seen':''}`} onClick={() => toggle(c.id)}>
            <div className="de1-card-top">
              <span className="de1-card-title">{c.title}</span>
              <span style={{color:'#06b6d4',fontSize:11}}>{seen.has(c.id)?'▲':'▼'}</span>
            </div>
            {seen.has(c.id) && <p className="de1-card-body">{c.body}</p>}
          </div>
        ))}
      </div>
      {seen.size < CARDS.length && <p style={{textAlign:'center',color:'#475569',fontSize:13}}>Open all {CARDS.length} cards to continue →</p>}
      {seen.size >= CARDS.length && <div className="de1-feedback success">✅ Foundation set. Let's see what bad data actually costs.</div>}
    </DE1Shell>
  );
}
