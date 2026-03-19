// src/screens/data-engineer/stage2/DE2_Level13.jsx — Data Warehouse Capstone (BUILD)
import { useState } from 'react';
import DE2Shell from './DE2Shell';

const TABS = ['Schema Design', 'Analytical Queries', 'Optimisation'];
const REQS = {
  'Schema Design': [
    { id:'s1', label:'At least 2 fact tables (fact_appointments, fact_admissions)' },
    { id:'s2', label:'At least 3 dimension tables (dim_patients, dim_doctors, dim_date)' },
    { id:'s3', label:'Surrogate keys (sk suffix) separate from source IDs' },
    { id:'s4', label:'dim_date with year, month, quarter, day_of_week columns' },
  ],
  'Analytical Queries': [
    { id:'q1', label:'Dashboard query: daily admissions with 7-day rolling average (window function)' },
    { id:'q2', label:'Cohort query: patient retention — % readmitted within 30 days by ward' },
    { id:'q3', label:'Ranking query: top doctors by revenue this quarter vs last quarter' },
  ],
  'Optimisation': [
    { id:'o1', label:'Add indexes on foreign key columns and date columns' },
    { id:'o2', label:'Explain one query with EXPLAIN and describe what to look for' },
    { id:'o3', label:'Describe one partitioning strategy (by date/ward) and why it helps' },
  ],
};

const CHECK = {
  s1: c => c.includes('FACT_APPOINT') || (c.includes('FACT_') && c.includes('APPOINT')),
  s2: c => (c.includes('DIM_PATIENT') || c.includes('DIM_DOCTOR')) && c.includes('DIM_DATE'),
  s3: c => c.includes('_SK') || c.includes('SURROGATE'),
  s4: c => c.includes('DIM_DATE') && (c.includes('QUARTER') || c.includes('DAY_OF_WEEK')),
  q1: c => c.includes('ROLLING') || (c.includes('ROWS BETWEEN') || c.includes('RANGE BETWEEN')) || (c.includes('AVG') && c.includes('OVER')),
  q2: c => (c.includes('30') || c.includes('READMIT')) && (c.includes('WARD') || c.includes('COHORT')),
  q3: c => c.includes('LAG') || (c.includes('QUARTER') && c.includes('RANK')),
  o1: c => c.includes('CREATE INDEX') && (c.includes('DATE') || c.includes('WARD')),
  o2: c => c.includes('EXPLAIN') && (c.includes('SEQ SCAN') || c.includes('INDEX SCAN') || c.includes('LOOK FOR')),
  o3: c => c.includes('PARTITION') && (c.includes('DATE') || c.includes('MONTH') || c.includes('YEAR')),
};

export default function DE2_Level13() {
  const [tab, setTab] = useState('Schema Design');
  const [code, setCode] = useState({'Schema Design':'','Analytical Queries':'','Optimisation':''});
  const [results, setResults] = useState({});
  const [checked, setChecked] = useState(false);
  const [showHints, setShowHints] = useState(false);

  function check() {
    const allCode = Object.values(code).join('\n').toUpperCase();
    const r = {};
    Object.entries(CHECK).forEach(([id,fn]) => { r[id]=fn(allCode); });
    setResults(r); setChecked(true);
  }

  const allReqs = Object.values(REQS).flat();
  const passCount = allReqs.filter(r => results[r.id]).length;
  const allPass = checked && passCount === allReqs.length;

  return (
    <DE2Shell levelId={13} canProceed={allPass}
      conceptReveal={[{ label:'Stage 2 Complete', detail:'You can now write SELECT, WHERE, GROUP BY, JOINs, subqueries, CTEs, and window functions. You understand indexes, normalisation, transactions, and when to use NoSQL. Stage 3 builds on this with Python Pandas — the tool that drives most modern data pipelines.' }]}
    >
      <div className="de2-intro">
        <h1>Data Warehouse Capstone</h1>
        <p className="de2-tagline">🏆 Design and query a complete hospital analytics warehouse.</p>
        <p className="de2-why">Three tabs — schema, queries, optimisation. This is a complete data warehouse deliverable.</p>
      </div>
      {checked && (
        <div style={{background:'#1e293b',borderRadius:8,padding:'12px 16px',marginBottom:16,display:'flex',alignItems:'center',gap:12}}>
          <div style={{flex:1}}><div style={{height:6,background:'#334155',borderRadius:3,overflow:'hidden'}}>
            <div style={{height:'100%',background:'#818cf8',borderRadius:3,width:`${(passCount/allReqs.length)*100}%`,transition:'width .4s'}}/>
          </div></div>
          <span style={{color:'#818cf8',fontWeight:700,fontSize:14}}>{passCount}/{allReqs.length} requirements</span>
        </div>
      )}
      <div style={{display:'flex',gap:4,marginBottom:14,flexWrap:'wrap'}}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{padding:'8px 16px',borderRadius:6,border:'none',cursor:'pointer',fontSize:13,fontWeight:600,background:tab===t?'#818cf8':'#1e293b',color:tab===t?'white':'#64748b'}}>
            {t}
          </button>
        ))}
      </div>
      <div style={{marginBottom:12}}>
        {(REQS[tab]||[]).map(r => (
          <div className="de2-req" key={r.id}>
            <span style={{color:!checked?'#475569':results[r.id]?'#4ade80':'#f87171',fontSize:14,width:18}}>{!checked?'○':results[r.id]?'✓':'✗'}</span>
            <span style={{color:'#cbd5e1',fontSize:13}}>{r.label}</span>
          </div>
        ))}
      </div>
      <div className="de2-panel">
        <div className="de2-panel-hdr">✏️ {tab}</div>
        <textarea className="de2-editor" value={code[tab]} onChange={e => setCode(c=>({...c,[tab]:e.target.value}))}
          placeholder={`-- Write your ${tab} here...`} style={{border:'none',borderRadius:0,minHeight:260}}/>
      </div>
      <div style={{display:'flex',gap:10,marginTop:12}}>
        <button className="de2-check-btn" onClick={check}>Check All Tabs</button>
        <button className="de2-check-btn" style={{background:'#334155',color:'#94a3b8'}} onClick={()=>setShowHints(s=>!s)}>{showHints?'Hide':'Show'} Hints</button>
      </div>
      {showHints && (
        <div style={{background:'#1e293b',border:'1px solid #334155',borderRadius:8,padding:'14px',marginTop:12,fontSize:13,color:'#94a3b8',lineHeight:1.7}}>
          <p><strong style={{color:'#818cf8'}}>Schema:</strong> fact_appointments(appt_sk, patient_sk, doctor_sk, date_sk, fee), dim_patients(patient_sk, patient_id, name, age), dim_date(date_sk, date, year, month, quarter, day_of_week)</p>
          <p><strong style={{color:'#818cf8'}}>Queries:</strong> Rolling avg: AVG(admissions) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW). Cohort: COUNT readmissions within 30 days / total patients per ward. QoQ: SUM(fee) for current vs prev quarter using LAG.</p>
          <p><strong style={{color:'#818cf8'}}>Optimisation:</strong> CREATE INDEX idx_fact_appt_date ON fact_appointments(date_sk). EXPLAIN shows Seq Scan (bad) vs Index Scan (good). PARTITION BY RANGE on date_sk — older partitions excluded from queries automatically.</p>
        </div>
      )}
      {checked && <div className={`de2-feedback ${allPass?'success':'error'}`}>{allPass?'🎓 Stage 2 Complete! You\'re a SQL expert.': `❌ ${passCount}/${allReqs.length} requirements met.`}</div>}
    </DE2Shell>
  );
}
