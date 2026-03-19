// src/screens/data-engineer/stage2/DE2_Level9.jsx
import { useState } from 'react';
import DE2Shell from './DE2Shell';

const TITLES = ['Data Types & NULLs','Indexes & Query Optimisation','Database Design & Normalisation','Transactions & ACID','NoSQL — When & Why'];
const BLANKS_DATA = [
  // Level 7 — Data Types & NULLs
  [
    {id:'B1',answer:'CAST',hint:'Convert a value to a different data type'},
    {id:'B2',answer:'COALESCE',hint:'Return first non-NULL value from a list'},
    {id:'B3',answer:'NULLIF',hint:'Return NULL if two values are equal'},
    {id:'B4',answer:'VARCHAR',hint:'Variable-length text — use for names, emails'},
    {id:'B5',answer:'TIMESTAMP',hint:'Date + time — always store in UTC'},
    {id:'B6',answer:'DECIMAL',hint:'Exact decimal — use for money, never FLOAT'},
  ],
  // Level 8 — Indexes
  [
    {id:'B1',answer:'CREATE INDEX',hint:'Add an index to speed up queries on a column'},
    {id:'B2',answer:'EXPLAIN',hint:'Show the query execution plan'},
    {id:'B3',answer:'Seq Scan',hint:'Reading every row — slow on large tables'},
    {id:'B4',answer:'Index Scan',hint:'Using the index — fast lookup'},
    {id:'B5',answer:'UNIQUE',hint:'Index that also enforces no duplicate values'},
    {id:'B6',answer:'composite',hint:'Index on multiple columns together'},
  ],
  // Level 9 — Normalisation
  [
    {id:'B1',answer:'1NF',hint:'First Normal Form — atomic values, no repeating groups'},
    {id:'B2',answer:'2NF',hint:'Second Normal Form — no partial dependencies on composite PK'},
    {id:'B3',answer:'3NF',hint:'Third Normal Form — no transitive dependencies'},
    {id:'B4',answer:'primary key',hint:'Uniquely identifies each row'},
    {id:'B5',answer:'foreign key',hint:'References the primary key of another table'},
    {id:'B6',answer:'denormalise',hint:'Intentionally add redundancy for query performance'},
  ],
  // Level 10 — Transactions
  [
    {id:'B1',answer:'BEGIN',hint:'Start a transaction'},
    {id:'B2',answer:'COMMIT',hint:'Save all changes permanently'},
    {id:'B3',answer:'ROLLBACK',hint:'Undo all changes since BEGIN'},
    {id:'B4',answer:'Atomicity',hint:'All-or-nothing — either all steps succeed or none'},
    {id:'B5',answer:'Isolation',hint:'Transactions don\'t see each other\'s in-progress changes'},
    {id:'B6',answer:'SAVEPOINT',hint:'Create a named checkpoint within a transaction'},
  ],
  // Level 11 — NoSQL
  [
    {id:'B1',answer:'MongoDB',hint:'Document store — flexible JSON-like schemas'},
    {id:'B2',answer:'Redis',hint:'In-memory key-value — caching, sessions, queues'},
    {id:'B3',answer:'Cassandra',hint:'Wide-column store — massive write throughput, IoT, time-series'},
    {id:'B4',answer:'Elasticsearch',hint:'Full-text search and log analytics'},
    {id:'B5',answer:'CAP',hint:'Theorem: Consistency, Availability, Partition tolerance — pick 2'},
    {id:'B6',answer:'eventual consistency',hint:'NoSQL trade-off: data will be consistent eventually, not immediately'},
  ],
][2];

const LINES_DATA = [
  // Level 7
  ['-- Data type conversions','SELECT [B1](admitted_at AS DATE) AS admit_date;',"SELECT [B1]('£42.50' AS [B6]) AS price;",'',"-- Handle NULLs elegantly","SELECT [B2](ward_id, 0) AS ward_or_default FROM patients;",'-- Returns 0 if ward_id is NULL','',"SELECT [B3](fee, 0) AS fee_or_null FROM appointments;",'-- Returns NULL if fee = 0 (sentinel value → real NULL','',"-- Choose the right type:","-- Names, email: [B4](255)","-- Dates with time: [B5] (always UTC)",'-- Money: [B6](10,2) — NEVER use FLOAT for currency'],
  // Level 8
  ['-- Add index on frequently filtered column','[B1] idx_patients_ward ON patients(ward_id);','',"-- See the query plan before and after",'[B2] SELECT * FROM patients WHERE ward_id = 3;',"-- Without index: '[B3]' reads all rows","-- With index:    '[B4]' jumps straight to matches",'',"-- Unique index — also enforces constraint","[B1] [B5] idx_patients_email ON patients(email);",'',"-- [B6] index for multi-column filters","[B1] idx_appt_patient_date ON appointments(patient_id, date);","-- Speeds up: WHERE patient_id = ? AND date > ?"],
  // Level 9
  ['-- Normalisation: eliminate redundancy','','-- Bad (unnormalised): patient row stores ward name','-- patient_id | name | ward_name | ward_floor','-- If ward name changes → update every patient row','',"-- [B1]: each cell has one value, no arrays","-- [B2]: all columns depend on the whole [B4]","-- [B3]: no column depends on another non-key column",'',"-- Good design: separate tables with [B5]s","-- patients(id, name, ward_id) -- ward_id is a [B5] → wards","-- wards(id, name, floor)       -- id is the [B4]",'',"-- Exception: [B6] for the data warehouse","-- Flat tables with repeated data are FASTER for analytical queries"],
  // Level 10
  ['-- Transfer patient between wards atomically','[B1];','  UPDATE patients SET ward_id = 2 WHERE id = 42;','  UPDATE wards SET capacity = capacity - 1 WHERE id = 1;','  UPDATE wards SET capacity = capacity + 1 WHERE id = 2;','[B2]; -- All 3 succeed together, or:','[B3]; -- All 3 are undone','',"-- ACID properties:","-- [B4]: all steps succeed or none do","-- Consistency: rules (FK, CHECK) always hold","-- [B5]: transactions run as if alone","-- Durability: committed data survives crashes",'',"-- Partial rollback with [B6]:","'[B1]; INSERT ...; [B6] sp1; UPDATE ...; ROLLBACK TO sp1; [B2];'"],
  // Level 11
  ["-- Choose the right database for the job",'',"-- [B1]: flexible schemas, JSON documents","-- Good for: product catalogues, user profiles","-- Bad for: complex joins, strict consistency",'',"-- [B2]: sub-millisecond reads, in-memory","-- Good for: caching, session storage, leaderboards","-- Bad for: persistent primary data",'',"-- [B3]: scales writes horizontally","-- Good for: IoT sensor data, time-series, event logs","-- Bad for: ad-hoc queries, complex aggregations",'',"-- [B4]: full-text search, log analysis","-- Good for: search bars, Kibana dashboards",'',"-- [B5] theorem: distributed systems trade-off","-- SQL: CP (consistent + partition tolerant)","-- DynamoDB: AP (available + partition tolerant, [B6])"],
][2];

const TITLES_MAP = {7:'Data Types & NULLs',8:'Indexes & Query Optimisation',9:'Database Design & Normalisation',10:'Transactions & ACID',11:'NoSQL — When & Why'};
const TAGLINES = {7:'🔢 Wrong types cause silent bugs. Right types prevent them.',8:'⚡ An index turns a 10-second query into 10 milliseconds.',9:'🏗️ Good design makes queries fast and updates safe.',10:'🔒 All-or-nothing operations. Data stays consistent.',11:'📦 SQL is default. NoSQL is the exception — for good reasons.'};
const WHY = {7:'Data engineers spend half their time dealing with type mismatches and NULLs from messy source systems. Knowing CAST, COALESCE, and NULLIF is essential for writing robust ETL.',8:'Unindexed queries on large tables time out. Understanding EXPLAIN and index design is what separates senior data engineers from juniors.',9:'Bad schema design means update anomalies, duplicate data, and queries that join 8 tables. Good normalisation prevents all of this.',10:'Without transactions, a pipeline crash halfway through leaves data in a corrupt state. ACID guarantees all-or-nothing.',11:'Choosing the wrong database for a use case costs months of migration work. MongoDB is not always better than Postgres — it depends entirely on the access patterns.'};

export default function DE2_Level9() {
  const blanks = BLANKS_DATA;
  const lines = LINES_DATA;
  const [vals, setVals] = useState({});
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState({});

  function check() {
    const r = {};
    blanks.forEach(b => { r[b.id]=(vals[b.id]||'').trim().toUpperCase()===b.answer.toUpperCase(); });
    setCorrect(r); setChecked(true);
  }
  const allCorrect = checked && blanks.every(b => correct[b.id]);

  function renderLine(line, idx) {
    if (line.startsWith('--') || line.startsWith("'[")) return <div key={idx} style={{color:'#475569',fontStyle:'italic',padding:'1px 0'}}>{line.replace(/^'/,'').replace(/'$/,'')}</div>;
    if (!line.trim()) return <div key={idx} style={{height:8}}/>;
    const parts = line.split(/(\[B\d\])/g);
    return (
      <div key={idx} style={{padding:'1px 0',color:'#cbd5e1',whiteSpace:'pre-wrap'}}>
        {parts.map((p,i2)=>{
          const m=p.match(/^\[B(\d)\]$/); if(!m) return <span key={i2}>{p}</span>;
          const bid='B'+m[1]; const bl=blanks.find(b=>b.id===bid);
          const st=!checked?'':correct[bid]?'correct':'incorrect';
          return <input key={i2} className={'de2-blank '+st} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:110,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <DE2Shell levelId={9} canProceed={allCorrect}>
      <div className="de2-intro">
        <h1>{TITLES_MAP[9]}</h1>
        <p className="de2-tagline">{TAGLINES[9]}</p>
        <p className="de2-why">{WHY[9]}</p>
      </div>
      <div className="de2-panel">
        <div className="de2-panel-hdr">🗄️ SQL — fill the blanks</div>
        <div className="de2-panel-body">{lines.map(renderLine)}</div>
      </div>
      <button className="de2-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={'de2-feedback '+(allCorrect?'success':'error')}>{allCorrect?'✅ Correct!':'❌ Check your answers.'}</div>}
    </DE2Shell>
  );
}
