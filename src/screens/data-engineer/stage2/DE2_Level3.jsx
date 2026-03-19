// src/screens/data-engineer/stage2/DE2_Level3.jsx — JOINs (FILL)
import { useState } from 'react';
import DE2Shell from './DE2Shell';

const BLANKS = [
  { id:'B1', answer:'INNER JOIN', hint:'Only rows with matches in BOTH tables' },
  { id:'B2', answer:'ON',         hint:'Specify the join condition' },
  { id:'B3', answer:'LEFT JOIN',  hint:'ALL rows from left table + matches from right (NULLs if no match)' },
  { id:'B4', answer:'p.name',     hint:'Patient name with table alias' },
  { id:'B5', answer:'w.name',     hint:'Ward name with table alias' },
  { id:'B6', answer:'RIGHT JOIN', hint:'ALL rows from right table + matches from left' },
  { id:'B7', answer:'FULL OUTER JOIN', hint:'ALL rows from BOTH tables, NULLs where no match' },
];

const LINES = [
  '-- INNER JOIN: only patients with a ward assigned',
  'SELECT [B4], [B5] AS ward_name, w.floor',
  'FROM patients p',
  '[B1] wards w [B2] p.ward_id = w.id;',
  '',
  '-- LEFT JOIN: ALL patients, even those without a ward',
  'SELECT p.name, w.name AS ward_name',
  'FROM patients p',
  '[B3] wards w ON p.ward_id = w.id;',
  '-- Patients without a ward: ward_name = NULL',
  '',
  '-- Self-join: patients admitted same day as patient 42',
  'SELECT b.name, b.admitted_at',
  'FROM patients a',
  'JOIN patients b ON a.admitted_at::date = b.admitted_at::date',
  'WHERE a.id = 42 AND b.id != 42;',
  '',
  '-- Find wards with NO patients',
  'SELECT w.name FROM wards w',
  '[B3] patients p ON p.ward_id = w.id',
  'WHERE p.id IS NULL;',
];

export default function DE2_Level3() {
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
          return <input key={i} className={`de2-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:bid==='B7'?140:90,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <DE2Shell levelId={3} canProceed={allCorrect}
      conceptReveal={[
        { label:'Finding Missing Data with LEFT JOIN + IS NULL', detail:'LEFT JOIN from wards to patients returns all wards. WHERE p.id IS NULL filters to wards with no matching patients — the anti-join pattern. This is one of the most common data quality checks in analytics: "which accounts have no transactions this month?"' },
        { label:'Self-Joins', detail:'A self-join joins a table to itself using two different aliases. Used for: comparing rows within the same table (same-day admissions), hierarchical data (employee and their manager in the same table), finding duplicates.' },
      ]}
    >
      <div className="de2-intro">
        <h1>JOINs</h1>
        <p className="de2-tagline">🔗 The most powerful SQL feature. Combine data from multiple tables.</p>
        <p className="de2-why">Real data is spread across many tables. JOINs are how you bring it together. Understanding INNER vs LEFT JOIN is the difference between correct and misleading analytics.</p>
      </div>
      <table className="de2-table">
        <thead><tr><th>JOIN Type</th><th>Returns</th><th>Use When</th></tr></thead>
        <tbody>
          {[['INNER JOIN','Only matching rows','You only want complete records'],['LEFT JOIN','All left + matching right (NULL if none)','Include records even without a match'],['RIGHT JOIN','All right + matching left','Rare — usually rewrite as LEFT JOIN'],['FULL OUTER JOIN','All rows from both tables','Find all unmatched rows on both sides'],['SELF JOIN','Table joined to itself','Compare rows within the same table']].map(([t,r,u],i)=>(
            <tr key={i}><td style={{color:'#818cf8',fontWeight:600,fontSize:12}}>{t}</td><td style={{color:'#94a3b8',fontSize:12}}>{r}</td><td style={{color:'#64748b',fontSize:12}}>{u}</td></tr>
          ))}
        </tbody>
      </table>
      <div className="de2-panel">
        <div className="de2-panel-hdr">🔗 JOINs — fill the blanks</div>
        <div className="de2-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="de2-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`de2-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ JOINs mastered.':'❌ Check your answers.'}</div>}
    </DE2Shell>
  );
}
