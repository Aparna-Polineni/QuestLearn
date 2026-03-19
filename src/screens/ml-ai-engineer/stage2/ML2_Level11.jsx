// src/screens/ml-ai-engineer/stage2/ML2_Level11.jsx — Feature Engineering (FILL)
import { useState } from 'react';
import ML2Shell from './ML2Shell';

const BLANKS = [
  { id:'B1', answer:'StandardScaler',   hint:'Scale to mean=0, std=1 — required for SVM, KNN, neural nets' },
  { id:'B2', answer:'MinMaxScaler',     hint:'Scale to [0,1] range — good for neural networks' },
  { id:'B3', answer:'OneHotEncoder',    hint:'Convert categories to binary columns — no ordinal assumption' },
  { id:'B4', answer:'LabelEncoder',     hint:'Convert categories to integers — only for tree models' },
  { id:'B5', answer:'PolynomialFeatures', hint:'Create interaction terms and powers — x₁², x₁×x₂' },
  { id:'B6', answer:'fit_transform',    hint:'Fit on training data then transform — never fit on test!' },
  { id:'B7', answer:'transform',        hint:'Apply already-fitted scaler to test/production data' },
];

const LINES = [
  'from sklearn.preprocessing import (',
  '    [B1], [B2], [B3], [B4], [B5]',
  ')',
  '',
  '# Scale numeric features',
  'scaler = [B1]()',
  'X_train_scaled = scaler.[B6](X_train)  # fit on TRAIN only',
  'X_test_scaled  = scaler.[B7](X_test)   # apply to test',
  '',
  '# Encode categorical features',
  'ohe = [B3](sparse=False, handle_unknown=\'ignore\')',
  'ward_encoded = ohe.[B6](df[[\'ward_id\']])',
  '',
  '# Create interaction features',
  'poly = [B5](degree=2, include_bias=False)',
  'X_poly = poly.[B6](X_train)',
  '# Adds: age², fee², age×fee, etc.',
  '',
  '# Feature creation from domain knowledge',
  'df[\'length_of_stay\'] = (df[\'discharged_at\'] - df[\'admitted_at\']).dt.days',
  'df[\'is_weekend\']     = df[\'admitted_at\'].dt.dayofweek >= 5',
  'df[\'log_fee\']        = np.log1p(df[\'fee\'])   # fix skewness',
];

export default function ML2_Level11() {
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
          return <input key={i} className={`ml2-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:140,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <ML2Shell levelId={11} canProceed={allCorrect}
      conceptReveal={[
        { label:'Never Fit on Test Data', detail:'scaler.fit_transform(X_train) learns the mean and std from training data. scaler.transform(X_test) applies those learned values to test. If you fit on test data, information leaks from test into training — your evaluation is optimistic and the model won\'t generalise.' },
        { label:'Feature Engineering > Algorithm Choice', detail:'Kaggle winners spend 80% of time on feature engineering. A well-engineered dataset with logistic regression often beats a poorly engineered dataset with XGBoost. Domain features (length_of_stay, is_weekend, log_fee) are often more predictive than any raw column.' },
      ]}
    >
      <div className="ml2-intro">
        <h1>Feature Engineering</h1>
        <p className="ml2-tagline">⚙️ Better features beat better algorithms. Every time.</p>
        <p className="ml2-why">Feature engineering transforms raw columns into signals the model can actually use. Scaling prevents large-valued features dominating. Encoding makes categories numeric. Domain features encode expert knowledge.</p>
      </div>
      <div className="ml2-panel">
        <div className="ml2-panel-hdr">⚙️ Feature Engineering — fill the blanks</div>
        <div className="ml2-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="ml2-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`ml2-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Feature engineering toolkit ready.':'❌ Check your answers — exact class names required.'}</div>}
    </ML2Shell>
  );
}
