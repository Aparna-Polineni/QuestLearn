// src/screens/data-engineer/stage2/DE2_Level2.jsx — Aggregates & GROUP BY (FILL)
import { useState } from 'react';
import DE2Shell from './DE2Shell';

const BLANKS = [
  { id:'B1', answer:'COUNT(*)',    hint:'Count all rows including NULLs' },
  { id:'B2', answer:'SUM',        hint:'Total of a numeric column' },
  { id:'B3', answer:'AVG',        hint:'Average value of a column' },
  { id:'B4', answer:'GROUP BY',   hint:'Group rows with the same value together' },
  { id:'B5', answer:'HAVING',     hint:'Filter AFTER grouping (WHERE runs before grouping)' },
  { id:'B6', answer:'MAX',        hint:'Highest value in a column' },
  { id:'B7', answer:'MIN',        hint:'Lowest value in a column' },
  { id:'B8', answer:'ROUND',      hint:'Round a decimal to N decimal places' },
];

const LINES = [
  '-- Total patients per ward',
  'SELECT ward_id, [B1] AS total_patients',
  'FROM patients',
  '[B4] ward_id',
  '[B5] COUNT(*) > 5',
  'ORDER BY total_patients DESC;',
  '',
  '-- Revenue stats per doctor',
  'SELECT doctor_id,',
  '  [B2](fee)              AS total_revenue,',
  '  [B8]([B3](fee), 2)    AS avg_fee,',
  '  [B6](fee)              AS highest_fee,',
  '  [B7](fee)              AS lowest_fee',
  'FROM appointments',
  'GROUP BY doctor_id;',
  '',
  '-- Only doctors with > £5000 total revenue',
  'SELECT doctor_id, SUM(fee) AS total',
  'FROM appointments',
  'GROUP BY doctor_id',
  '[B5] SUM(fee) > 5000;',
];

export default function DE2_Level2() {
  const [vals, setVals] = useState({});
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState({});

  function check() {
    const r = {};
    BLANKS.forEach(b => { r[b.id]=(vals[b.id]||'').trim().toUpperCase()===b.answer.toUpperCase(); });
    setCorrect(r); setChecked(true);
  }
  const allCorrect = checked && BLANKS.every(b => correct[b.id]);

  function renderLine(line, idx) {
    if (line.startsWith('--')) return <div key={idx} style={{color:'#475569',fontStyle:'italic',padding:'1px 0'}}>{line}</div>;
    if (!line.trim()) return <div key={idx} style={{height:8}}/>;
    const parts = line.split(/(\[B\d\])/g);
    return (
      <div key={idx} style={{padding:'1px 0',color:'#cbd5e1',whiteSpace:'pre-wrap'}}>
        {parts.map((p,i)=>{
          const m=p.match(/^\[B(\d)\]$/); if(!m) return <span key={i}>{p}</span>;
          const bid='B'+m[1]; const bl=BLANKS.find(b=>b.id===bid);
          const st=!checked?'':correct[bid]?'correct':'incorrect';
          return <input key={i} className={`de2-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:80,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <DE2Shell levelId={2} canProceed={allCorrect}
      conceptReveal={[
        { label:'WHERE vs HAVING', detail:'WHERE filters individual rows before grouping. HAVING filters groups after grouping. You cannot use aggregate functions in WHERE. SELECT ward_id, COUNT(*) FROM patients WHERE status="active" GROUP BY ward_id HAVING COUNT(*)
      prevLevelContext="In the last level you selected and filtered individual rows. Now you\'ll group them — aggregating patient data to answer questions like \"how many patients per ward?\""
      cumulativeSkills={[
        "Set up the hospital analytics database and ran first SELECT queries",
        "Written SELECT, FROM, WHERE, ORDER BY, LIMIT, DISTINCT, and LIKE queries",
        "Aggregated patient data with GROUP BY, COUNT, SUM, AVG, and HAVING",
      ]}
    > 5 — WHERE filters rows, HAVING filters the resulting groups.' },
        { label:'COUNT(*) vs COUNT(column)', detail:'COUNT(*) counts all rows including NULLs. COUNT(fee) counts only rows where fee is not NULL. For totals, use COUNT(*). For non-null counts, use COUNT(column). This distinction causes subtle bugs in analytics when columns have missing values.' },
      ]}
    >
      <div className="de2-intro">
        <h1>Aggregates & GROUP BY</h1>
        <p className="de2-tagline">📊 Turn thousands of rows into business insights.</p>
        <p className="de2-why">Every dashboard metric — revenue per doctor, patients per ward, average length of stay — is an aggregate query. These are the queries analysts run every day.</p>
      </div>
      <div className="de2-panel">
        <div className="de2-panel-hdr">📊 Aggregates — fill the blanks</div>
        <div className="de2-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="de2-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`de2-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Aggregation mastered.':'❌ Check your answers.'}</div>}
    </DE2Shell>
  );
}
