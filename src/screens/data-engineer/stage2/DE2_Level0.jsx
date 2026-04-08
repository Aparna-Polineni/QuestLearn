// src/screens/data-engineer/stage2/DE2_Level0.jsx — CONCEPTS
import { useState } from 'react';
import DE2Shell from './DE2Shell';

const CARDS = [
  { id:'why',   title:'Why SQL for Data Engineers?',    body:'SQL is the universal language of data. Every data warehouse, every analytics tool, every data pipeline reads and writes SQL. A data engineer who can\'t write complex SQL can\'t do the job. This stage goes beyond basic SELECT — window functions, CTEs, query optimisation.' },
  { id:'rdb',   title:'Relational Databases',           body:'Data is stored in tables with rows and columns. Tables relate to each other via keys. SQL lets you query, join, filter, and aggregate this data. PostgreSQL, MySQL, and BigQuery are all relational. Most analytical data lives here.' },
  { id:'nosql', title:'NoSQL — When Relational Breaks Down', body:'MongoDB: flexible schemas for rapidly changing data. Redis: in-memory key-value for caching. Cassandra: writes at massive scale (IoT, time-series). Elasticsearch: full-text search. NoSQL doesn\'t replace relational — it handles the cases where relational struggles.' },
  { id:'oltp',  title:'OLTP vs OLAP',                   body:'OLTP (Online Transaction Processing): MySQL, Postgres — optimised for fast row-level reads/writes. Powers your app. OLAP (Online Analytical Processing): Snowflake, BigQuery, Redshift — optimised for column-scan aggregations over billions of rows. Powers your analytics.' },
  { id:'dw',    title:'The Data Warehouse',              body:'A central repository of integrated data from multiple sources, structured for analytics. Star schema (fact + dimension tables) is the standard. SQL is how analysts query it. Data engineers build and maintain it. It\'s the foundation of every BI dashboard.' },
  { id:'sql',   title:'SQL Skill Levels',               body:'Level 1 (junior): SELECT, WHERE, ORDER BY, basic JOINs. Level 2 (mid): Subqueries, CTEs, GROUP BY, HAVING. Level 3 (senior): Window functions, query plan analysis, index design, partitioning. This stage gets you to Level 3.' },
];

export default function DE2_Level0() {
  const [seen, setSeen] = useState(new Set());
  const toggle = id => setSeen(p => { const n = new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });

  return (
    <DE2Shell levelId={0} canProceed={seen.size >= CARDS.length}
      cumulativeSkills={[
        "Set up the hospital analytics database and ran first SELECT queries",
      ]}
    >
      <div className="de2-intro">
        <h1>SQL & Databases</h1>
        <p className="de2-tagline">🗄️ The universal language of data. Every data engineer lives in SQL.</p>
        <p className="de2-why">You built pipelines in Stage 1. Now you learn the language that powers every step — from querying source systems to building the warehouse schema to optimising slow analytical queries.</p>
      </div>
      <div className="de2-cards">
        {CARDS.map(c => (
          <div key={c.id} className={`de2-card ${seen.has(c.id)?'seen':''}`} onClick={() => toggle(c.id)}>
            <div className="de2-card-top">
              <span className="de2-card-title">{c.title}</span>
              <span style={{color:'#818cf8',fontSize:11}}>{seen.has(c.id)?'▲':'▼'}</span>
            </div>
            {seen.has(c.id) && <p className="de2-card-body">{c.body}</p>}
          </div>
        ))}
      </div>
      {seen.size < CARDS.length && <p style={{textAlign:'center',color:'#475569',fontSize:13}}>Open all {CARDS.length} cards to continue →</p>}
      {seen.size >= CARDS.length && <div className="de2-feedback success">✅ Foundation set. Time to write real SQL.</div>}
    </DE2Shell>
  );
}
