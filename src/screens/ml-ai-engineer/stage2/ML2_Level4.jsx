// src/screens/ml-ai-engineer/stage2/ML2_Level4.jsx — Data Cleaning (FILL)
import { useState } from 'react';
import ML2Shell from './ML2Shell';

const BLANKS = [
  { id:'B1', answer:'.fillna',        hint:'Replace NaN with a value or strategy' },
  { id:'B2', answer:'.dropna',        hint:'Remove rows or columns containing NaN' },
  { id:'B3', answer:'.drop_duplicates', hint:'Remove repeated rows' },
  { id:'B4', answer:'.replace',       hint:'Swap specific values for others' },
  { id:'B5', answer:'.astype',        hint:'Convert column to a different dtype' },
  { id:'B6', answer:'.clip',          hint:'Cap values at min/max bounds — handles outliers' },
  { id:'B7', answer:'.str.strip',     hint:'Remove leading/trailing whitespace from strings' },
];

const LINES = [
  '# 1. Handle missing values',
  'df[\'fee\'][B1](df[\'fee\'].median(), inplace=True)',
  'df[\'ward_id\'][B1](method=\'ffill\')   # forward fill',
  'df[B2](subset=[\'name\',\'admitted_at\']) # drop rows missing these',
  '',
  '# 2. Remove duplicates',
  'df = df[B3](subset=[\'patient_id\'], keep=\'first\')',
  '',
  '# 3. Fix inconsistent categories',
  'df[\'status\'] = df[\'status\'][B4]({',
  '    \'Active\':\'active\', \'ACTIVE\':\'active\',',
  '    \'Discharged\':\'discharged\'',
  '})',
  '',
  '# 4. Fix data types',
  'df[\'fee\']         = df[\'fee\'][B5](float)',
  'df[\'admitted_at\'] = pd.to_datetime(df[\'admitted_at\'])',
  '',
  '# 5. Handle outliers — cap at 99th percentile',
  'upper = df[\'fee\'].quantile(0.99)',
  'df[\'fee\'] = df[\'fee\'][B6](upper=upper)',
  '',
  '# 6. Clean string columns',
  'df[\'name\'] = df[\'name\'][B7]().str.title()',
];

export default function ML2_Level4() {
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
          return <input key={i} className={`ml2-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:130,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <ML2Shell levelId={4} canProceed={allCorrect}
      conceptReveal={[
        { label:'Never Drop NULLs Blindly', detail:'dropna() without arguments removes every row with any NaN — you can lose 40% of your dataset. Always ask WHY values are missing. Is it random (safe to impute with median)? Is the NULL itself informative (no fee = outpatient visit)? Understand before you act.' },
        { label:'Outlier Strategy', detail:'Outliers can be valid (£50k surgery) or errors (age=999). Check domain knowledge first. Clipping (cap at 99th percentile) is safer than dropping — you keep the row but limit extreme influence on the model. Removing outliers is often the wrong choice.' },
      ]}
    >
      <div className="ml2-intro">
        <h1>Data Cleaning</h1>
        <p className="ml2-tagline">🧹 70% of ML work. Get it right or the model learns from noise.</p>
        <p className="ml2-why">Raw data has missing values, duplicates, wrong types, inconsistent strings, and outliers. Every one of these corrupts a model if left untreated. Cleaning is not glamorous — it's essential.</p>
      </div>
      <div className="ml2-panel">
        <div className="ml2-panel-hdr">🧹 Data Cleaning — fill the blanks</div>
        <div className="ml2-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="ml2-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`ml2-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Data cleaning toolkit ready.':'❌ Check your answers.'}</div>}
    </ML2Shell>
  );
}
