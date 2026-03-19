// src/screens/ml-ai-engineer/stage2/ML2_Level2.jsx — Pandas Basics (FILL)
import { useState } from 'react';
import ML2Shell from './ML2Shell';

const BLANKS = [
  { id:'B1', answer:'pd.read_csv',   hint:'Load a CSV file into a DataFrame' },
  { id:'B2', answer:'.head',         hint:'Show first N rows (default 5)' },
  { id:'B3', answer:'.info',         hint:'Column names, non-null counts, dtypes' },
  { id:'B4', answer:'.describe',     hint:'Count, mean, std, min, percentiles, max' },
  { id:'B5', answer:'.isnull',       hint:'Boolean mask: True where value is NaN' },
  { id:'B6', answer:'.value_counts', hint:'Count occurrences of each unique value' },
  { id:'B7', answer:'.shape',        hint:'Tuple: (number of rows, number of columns)' },
];

const LINES = [
  'import pandas as pd',
  '',
  '# Load data',
  'df = [B1](\'patients.csv\')',
  '',
  '# First look',
  'df[B2]()                 # first 5 rows',
  'df[B3]()                 # column types, null counts',
  'df[B4]()                 # stats for numeric columns',
  'print(df[B7])            # (10000, 15)',
  '',
  '# Find missing values',
  'df[B5]().sum()           # NaN count per column',
  '',
  '# Categorical distribution',
  'df[\'ward_id\'][B6]()     # patients per ward',
  '',
  '# Select columns',
  'df[\'name\']              # Series (single column)',
  'df[[\'name\',\'ward_id\']] # DataFrame (multiple columns)',
  'df.select_dtypes(include=\'number\')  # only numeric cols',
];

export default function ML2_Level2() {
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
    <ML2Shell levelId={2} canProceed={allCorrect}
      conceptReveal={[
        { label:'The EDA Opening Move', detail:'Every ML project starts the same way: df.head() to see the data, df.info() to see types and nulls, df.describe() to see numeric distributions. These three commands in 30 seconds reveal the structure of any dataset.' },
        { label:'DataFrame vs Series', detail:'df["ward_id"] returns a Series (1D). df[["ward_id"]] returns a DataFrame (2D with one column). The double brackets are intentional — you\'re passing a list of column names. Most operations work the same on both, but some functions require DataFrames.' },
      ]}
    >
      <div className="ml2-intro">
        <h1>Pandas — DataFrames Basics</h1>
        <p className="ml2-tagline">🐼 Load, inspect, understand — before modelling anything.</p>
        <p className="ml2-why">The first 30 minutes with any new dataset is always the same: load it, inspect it, understand its shape, types, missing values, and distributions. These are the Pandas commands for those 30 minutes.</p>
      </div>
      <div className="ml2-panel">
        <div className="ml2-panel-hdr">🐼 Pandas basics — fill the blanks</div>
        <div className="ml2-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="ml2-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`ml2-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Pandas basics solid.':'❌ Check your answers.'}</div>}
    </ML2Shell>
  );
}
