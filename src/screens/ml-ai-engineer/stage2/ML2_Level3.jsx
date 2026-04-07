// src/screens/ml-ai-engineer/stage2/ML2_Level3.jsx — Pandas Filtering & Groupby (FILL)
import { useState } from 'react';
import ML2Shell from './ML2Shell';

const BLANKS = [
  { id:'B1', answer:'.loc',         hint:'Label-based selection: df.loc[row_label, col_label]' },
  { id:'B2', answer:'.query',       hint:'Filter with a readable string expression' },
  { id:'B3', answer:'.groupby',     hint:'Group rows by column value for aggregation' },
  { id:'B4', answer:'.agg',         hint:'Apply multiple aggregate functions at once' },
  { id:'B5', answer:'.merge',       hint:'Join two DataFrames — like SQL JOIN' },
  { id:'B6', answer:'.pivot_table', hint:'Cross-tabulate two columns with an aggregate value' },
  { id:'B7', answer:'.reset_index', hint:'Move the index back to a regular column after groupby' },
];

const LINES = [
  '# Boolean filtering',
  'active   = df[df[\'status\'] == \'active\']',
  'ward3    = df[B1](df[\'ward_id\'] == 3, [\'name\',\'fee\']]',
  '',
  '# Readable filter with query()',
  'filtered = df[B2](\'fee > 100 and status == "active"\')',
  '',
  '# Group and aggregate',
  'df[B3](\'ward_id\')[\'fee\'][B4]([\'mean\',\'sum\',\'count\'])',
  '',
  '# Multiple groupby columns',
  'result = (',
  '  df[B3]([\'ward_id\',\'status\'])',
  '  [[\'fee\']]',
  '  .mean()',
  '  [B7]()              # flatten multi-level index',
  ')',
  '',
  '# Join with another DataFrame',
  'merged = df[B5](ward_df, on=\'ward_id\', how=\'left\')',
  '',
  '# Pivot: avg fee per ward per status',
  'df[B6](values=\'fee\', index=\'ward_id\',',
  '              columns=\'status\', aggfunc=\'mean\')',
];

export default function ML2_Level3() {
  const [vals, setVals] = useState({});
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState({});

  function check() {
    const r = {};
    BLANKS.forEach(b => { r[b.id]=(vals[b.id]||'').trim()===b.answer; });
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
          return <input key={i} className={`ml2-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:110,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <ML2Shell levelId={3} canProceed={allCorrect}
      conceptReveal={[
        { label:'groupby is Lazy', detail:'df.groupby("ward_id") creates a GroupBy object — nothing is computed yet. The aggregation (.mean(), .sum(), .agg()) triggers execution. This allows efficient chaining. Always reset_index() after groupby to flatten the multi-level index into regular columns.' },
        { label:'merge vs join', detail:'df.merge(other, on="ward_id", how="left") is like SQL LEFT JOIN. how="inner" drops unmatched rows. how="outer" keeps all rows. The on parameter specifies the join key. Use suffixes=("_x","_y") when both DataFrames have columns with the same name.' },
      ]}
      prevLevelContext="In the last level you inspected the raw patient data. Now you\'ll clean it — fix missing values, wrong types, and duplicate rows — so it is safe to train a model on."
      cumulativeSkills={[
        "Set up the Python ML environment and ran first NumPy array operations",
        "Implemented vectorised operations: dot products, broadcasting, array slicing",
        "Loaded and inspected the patient dataset: shape, dtypes, missing values, distributions",
        "Cleaned the dataset: imputed nulls, fixed dtypes, removed duplicates",
      ]}
    >
      <div className="ml2-intro">
        <h1>Pandas — Filtering & Groupby</h1>
        <p className="ml2-tagline">🔍 Slice any subset, aggregate any group.</p>
        <p className="ml2-why">70% of Pandas work is filtering rows and grouping to compute statistics. Master these and you can answer any business question from a DataFrame.</p>
      </div>
      <div className="ml2-panel">
        <div className="ml2-panel-hdr">🔍 Filtering & Groupby — fill the blanks</div>
        <div className="ml2-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="ml2-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`ml2-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Filtering and groupby mastered.':'❌ Check your answers.'}</div>}
    </ML2Shell>
  );
}
