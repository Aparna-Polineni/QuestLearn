// src/screens/data-engineer/stage2/DE2_Level5.jsx — Window Functions (FILL)
import { useState } from 'react';
import DE2Shell from './DE2Shell';

const BLANKS = [
  { id:'B1', answer:'OVER',         hint:'Defines the window — required for all window functions' },
  { id:'B2', answer:'PARTITION BY', hint:'Reset the calculation for each group (like GROUP BY but keeps all rows)' },
  { id:'B3', answer:'ROW_NUMBER',   hint:'Sequential 1,2,3... within each partition' },
  { id:'B4', answer:'RANK',         hint:'Like ROW_NUMBER but ties get the same number (gaps after ties)' },
  { id:'B5', answer:'LAG',          hint:'Access the previous row\'s value' },
  { id:'B6', answer:'LEAD',         hint:'Access the next row\'s value' },
  { id:'B7', answer:'SUM',          hint:'Running total when used with OVER' },
];

const LINES = [
  '-- Window functions: aggregate without collapsing rows',
  '',
  '-- Rank patients by fee within each ward',
  'SELECT name, ward_id, fee,',
  '  [B3]() [B1] ([B2] ward_id ORDER BY fee DESC) AS rank_in_ward,',
  '  [B4]()  OVER (PARTITION BY ward_id ORDER BY fee DESC) AS rank_with_ties',
  'FROM appointments;',
  '',
  '-- Running total of revenue over time',
  'SELECT appointment_date, fee,',
  '  [B7](fee) [B1] (ORDER BY appointment_date) AS running_total',
  'FROM appointments;',
  '',
  '-- Compare each day\'s revenue to previous day',
  'SELECT appointment_date, fee,',
  '  [B5](fee, 1) OVER (ORDER BY appointment_date) AS prev_day_fee,',
  '  [B6](fee, 1) OVER (ORDER BY appointment_date) AS next_day_fee,',
  '  fee - LAG(fee, 1) OVER (ORDER BY appointment_date) AS day_over_day_change',
  'FROM daily_revenue;',
];

export default function DE2_Level5() {
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
          return <input key={i} className={`de2-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:bid==='B2'?120:80,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <DE2Shell levelId={5} canProceed={allCorrect}
      conceptReveal={[
        { label:'Window Functions Don\'t Collapse Rows', detail:'GROUP BY collapses many rows into one. Window functions keep all rows and add a new calculated column. ROW_NUMBER() OVER (PARTITION BY ward_id ORDER BY fee DESC) ranks patients within each ward while keeping every patient row visible.' },
        { label:'LAG and LEAD for Time-Series', detail:'LAG(fee, 1) gives you the previous row\'s fee. LEAD(fee, 1) gives you the next row\'s fee. Combined: fee - LAG(fee) gives you day-over-day change. This pattern appears in virtually every time-series dashboard — growth rates, churn, retention.' },
      ]}
      prevLevelContext="In the last level you fixed NULL handling. Now you\'ll write subqueries and CTEs — structuring complex questions as readable steps rather than nested SQL tangles."
      cumulativeSkills={[
        "Set up the hospital analytics database and ran first SELECT queries",
        "Written SELECT, FROM, WHERE, ORDER BY, LIMIT, DISTINCT, and LIKE queries",
        "Aggregated patient data with GROUP BY, COUNT, SUM, AVG, and HAVING",
        "Connected patients, wards, appointments, and doctors with INNER and LEFT JOINs",
        "Handled NULL correctly: IS NULL, COALESCE, NULLIF, and NOT EXISTS patterns",
        "Structured complex queries as CTEs: readable, testable, and reusable blocks",
      ]}
    >
      <div className="de2-intro">
        <h1>Window Functions</h1>
        <p className="de2-tagline">🪟 The most powerful SQL feature most engineers don't know.</p>
        <p className="de2-why">Running totals, rankings, day-over-day comparisons — these all require window functions. They separate senior SQL writers from junior ones.</p>
      </div>
      <div className="de2-panel">
        <div className="de2-panel-hdr">🪟 Window Functions — fill the blanks</div>
        <div className="de2-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="de2-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`de2-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Window functions unlocked. Senior SQL achieved.':'❌ Check your answers.'}</div>}
    </DE2Shell>
  );
}
