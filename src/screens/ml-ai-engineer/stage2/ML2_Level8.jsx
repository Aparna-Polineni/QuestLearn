// src/screens/ml-ai-engineer/stage2/ML2_Level8.jsx — Statistics (FILL)
import { useState } from 'react';
import ML2Shell from './ML2Shell';

const BLANKS = [
  { id:'B1', answer:'mean',        hint:'Average — sum divided by count' },
  { id:'B2', answer:'median',      hint:'Middle value — robust to outliers' },
  { id:'B3', answer:'variance',    hint:'Average squared distance from the mean' },
  { id:'B4', answer:'std',         hint:'Standard deviation — square root of variance, same units as data' },
  { id:'B5', answer:'correlation', hint:'Measures linear relationship between two variables (-1 to 1)' },
  { id:'B6', answer:'skewness',    hint:'Asymmetry of a distribution — positive = tail on right' },
  { id:'B7', answer:'normal',      hint:'Bell-curve distribution — many ML algorithms assume this' },
];

const LINES = [
  '# Descriptive statistics',
  'fee_mean   = df[\'fee\'].[B1]()       # average',
  'fee_median = df[\'fee\'].[B2]()     # middle value — outlier-robust',
  'fee_var    = df[\'fee\'].[B3]()    # spread squared',
  'fee_std    = df[\'fee\'].[B4]()        # spread in original units',
  '',
  '# Outlier detection: values beyond mean ± 3×std are unusual',
  'z_scores = (df[\'fee\'] - fee_mean) / fee_std',
  'outliers = df[abs(z_scores) > 3]',
  '',
  '# Correlation between features',
  'r = df[\'age\'].[B5](df[\'fee\'])  # -1 to +1',
  '# r > 0.7: strong positive  r < -0.7: strong negative',
  '',
  '# Distribution shape',
  'sk = df[\'fee\'].skew()     # positive = right tail',
  '# Log-transform right-skewed features before modelling:',
  'df[\'log_fee\'] = np.log1p(df[\'fee\'])',
  '',
  '# Check if feature is [B7]ly distributed',
  'from scipy import stats',
  'stat, p = stats.normaltest(df[\'fee\'])',
  '# p < 0.05 → not [B7] → may need transformation',
];

export default function ML2_Level8() {
  const [vals, setVals] = useState({});
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState({});

  function check() {
    const r = {};
    BLANKS.forEach(b => { r[b.id]=(vals[b.id]||'').trim().toLowerCase()===b.answer.toLowerCase(); });
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
          return <input key={i} className={`ml2-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:100,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <ML2Shell levelId={8} canProceed={allCorrect}
      conceptReveal={[
        { label:'Mean vs Median', detail:'A ward with 99 patients paying £100 and 1 patient paying £100,000 has a mean of £1,099 — misleading. The median is £100 — accurate. Whenever outliers are possible (income, house prices, medical costs), prefer median. Use mean when data is symmetric and clean.' },
        { label:'Log Transform for Skewed Features', detail:'Many ML algorithms (linear regression, logistic regression) assume normally distributed features. Right-skewed features (income, fee) perform better after log transformation. np.log1p() (log of 1+x) handles zeros safely. Always check skewness before choosing to transform.' },
      ]}
    >
      <div className="ml2-intro">
        <h1>Statistics Fundamentals</h1>
        <p className="ml2-tagline">📊 Mean, variance, correlation — the vocabulary of data.</p>
        <p className="ml2-why">Statistics tells you what your data looks like before the model sees it. An ML engineer who skips statistics trains on skewed distributions, correlated features, and outlier-dominated means.</p>
      </div>
      <div className="ml2-panel">
        <div className="ml2-panel-hdr">📊 Statistics — fill the blanks</div>
        <div className="ml2-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="ml2-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`ml2-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Statistics fundamentals solid.':'❌ Check your answers.'}</div>}
    </ML2Shell>
  );
}
