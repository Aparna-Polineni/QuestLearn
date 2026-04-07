// src/screens/ml-ai-engineer/stage2/ML2_Level5.jsx — Visualisation (FILL)
import { useState } from 'react';
import ML2Shell from './ML2Shell';

const BLANKS = [
  { id:'B1', answer:'sns.histplot',    hint:'Distribution of a numeric column — shows shape, skew' },
  { id:'B2', answer:'sns.boxplot',     hint:'Median, quartiles, and outliers per group' },
  { id:'B3', answer:'sns.heatmap',     hint:'Correlation matrix as a colour grid' },
  { id:'B4', answer:'sns.countplot',   hint:'Bar chart of category frequencies' },
  { id:'B5', answer:'sns.scatterplot', hint:'Relationship between two numeric columns' },
  { id:'B6', answer:'.corr',           hint:'Compute pairwise correlation between numeric columns' },
  { id:'B7', answer:'plt.show',        hint:'Render the current figure' },
];

const LINES = [
  'import matplotlib.pyplot as plt',
  'import seaborn as sns',
  '',
  '# 1. Distribution — check skew, outliers',
  '[B1](data=df, x=\'fee\', bins=50)',
  'plt.title(\'Fee Distribution\')',
  '[B7]()',
  '',
  '# 2. Outliers by group',
  '[B2](data=df, x=\'ward_id\', y=\'fee\')',
  '[B7]()',
  '',
  '# 3. Correlation matrix',
  'corr = df.select_dtypes(\'number\')[B6]()',
  '[B3](corr, annot=True, fmt=\'.2f\', cmap=\'coolwarm\')',
  '[B7]()',
  '',
  '# 4. Class balance check',
  '[B4](data=df, x=\'readmitted\')',
  '',
  '# 5. Feature vs target',
  '[B5](data=df, x=\'age\', y=\'fee\', hue=\'readmitted\')',
];

export default function ML2_Level5() {
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
    <ML2Shell levelId={5} canProceed={allCorrect}
      conceptReveal={[
        { label:'Visualise Before You Model', detail:'A scatter plot of age vs fee might show fee spikes exponentially after 70 — a non-linear relationship a linear model would miss. A countplot might show 95% negative class — your model will predict "negative" always and get 95% accuracy. Charts expose what statistics hide.' },
        { label:'Correlation Heatmap', detail:'If two features have correlation
      prevLevelContext="In the last level you created the features. Now you\'ll explore them — visualise distributions, compute correlations, and check class balance — to understand what the model will actually learn."
      cumulativeSkills={[
        "Set up the Python ML environment and ran first NumPy array operations",
        "Implemented vectorised operations: dot products, broadcasting, array slicing",
        "Loaded and inspected the patient dataset: shape, dtypes, missing values, distributions",
        "Cleaned the dataset: imputed nulls, fixed dtypes, removed duplicates",
        "Engineered five new predictive features from the raw patient columns",
        "Produced a full EDA: correlation matrix, class balance check, distribution analysis",
      ]}
    > 0.95, they carry nearly identical information. Including both wastes model capacity and can cause instability in linear models (multicollinearity). The heatmap identifies this instantly — drop one of the highly correlated pair.' },
      ]}
    >
      <div className="ml2-intro">
        <h1>Visualisation</h1>
        <p className="ml2-tagline">📊 A chart reveals what 10,000 rows hide. Always plot before modelling.</p>
        <p className="ml2-why">Distributions, correlations, class balance, feature-target relationships — these are impossible to understand from raw numbers but obvious in a chart. Visualisation drives every modelling decision.</p>
      </div>
      <div className="ml2-panel">
        <div className="ml2-panel-hdr">📊 Visualisation — fill the blanks</div>
        <div className="ml2-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="ml2-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`ml2-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Visualisation toolkit ready.':'❌ Check your answers.'}</div>}
    </ML2Shell>
  );
}
