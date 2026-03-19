// src/screens/data-engineer/stage2/DE2_Level1.jsx — SELECT, WHERE, ORDER BY (FILL)
import { useState } from 'react';
import DE2Shell from './DE2Shell';

const BLANKS = [
  { id:'B1', answer:'SELECT',    hint:'Start every query — choose which columns to return' },
  { id:'B2', answer:'FROM',      hint:'Which table to read from' },
  { id:'B3', answer:'WHERE',     hint:'Filter rows — only return rows matching this condition' },
  { id:'B4', answer:'AND',       hint:'Both conditions must be true' },
  { id:'B5', answer:'ORDER BY',  hint:'Sort results — add DESC for highest first' },
  { id:'B6', answer:'LIMIT',     hint:'Return only the first N rows' },
  { id:'B7', answer:'DISTINCT',  hint:'Remove duplicate rows from results' },
  { id:'B8', answer:'LIKE',      hint:'Pattern match — % wildcard, _ single character' },
];

const LINES = [
  '-- Query 1: Basic select with filter',
  '[B1] patient_id, name, ward_id, admitted_at',
  '[B2] patients',
  '[B3] ward_id = 3 [B4] status = \'active\'',
  '[B5] admitted_at DESC',
  '[B6] 20;',
  '',
  '-- Query 2: Remove duplicates',
  'SELECT [B7] ward_id FROM patients;',
  '',
  '-- Query 3: Pattern match on name',
  "SELECT * FROM patients WHERE name [B8] 'San%';",
  '',
  '-- Query 4: Range filter with OR',
  'SELECT name, admitted_at FROM patients',
  'WHERE admitted_at >= \'2024-01-01\'',
  'AND admitted_at < \'2024-04-01\';',
];

export default function DE2_Level1() {
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
          return <input key={i} className={`de2-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:90,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <DE2Shell levelId={1} canProceed={allCorrect}
      conceptReveal={[
        { label:'SQL Execution Order', detail:'SQL runs in this order: FROM → WHERE → SELECT → ORDER BY → LIMIT. This matters because you can\'t reference a SELECT alias in WHERE — WHERE runs before SELECT. Use a subquery or CTE to filter on calculated columns.' },
        { label:'LIKE Wildcards', detail:'% matches any sequence of characters. _ matches exactly one character. LIKE \'San%\' matches Santos, Sandra. LIKE \'_an%\' matches any name where the second character is "a". Case sensitivity depends on the database collation.' },
      ]}
    >
      <div className="de2-intro">
        <h1>SELECT, WHERE, ORDER BY</h1>
        <p className="de2-tagline">🔍 The foundation — 90% of all SQL queries use these three clauses.</p>
        <p className="de2-why">Every analytical query starts here. Master filtering and sorting before attempting joins and aggregations.</p>
      </div>
      <div className="de2-panel">
        <div className="de2-panel-hdr">🗄️ SQL — fill the blanks</div>
        <div className="de2-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="de2-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`de2-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ SELECT fundamentals solid.':'❌ Check your answers.'}</div>}
    </DE2Shell>
  );
}
