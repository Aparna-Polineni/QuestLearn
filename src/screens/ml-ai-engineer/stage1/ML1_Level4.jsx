// src/screens/ml-ai-engineer/stage1/ML1_Level4.jsx — Data: The Foundation (FILL)
import { useState } from 'react';
import ML1Shell from './ML1Shell';

const BLANKS = [
  { id:'B1', answer:'imbalanced',  hint:'Class distribution is unequal (1% fraud, 99% legit)' },
  { id:'B2', answer:'leakage',     hint:'Future information accidentally included in training data' },
  { id:'B3', answer:'impute',      hint:'Fill missing values with mean, median, or a model' },
  { id:'B4', answer:'normalise',   hint:'Scale features to a common range (0-1 or z-score)' },
  { id:'B5', answer:'SMOTE',       hint:'Synthetic minority oversampling — create fake minority samples' },
  { id:'B6', answer:'stratified',  hint:'Split preserving the class distribution in each subset' },
];

const LINES = [
  '# Data Quality Issues Every ML Engineer Faces',
  '',
  '# Problem 1: [B1] classes',
  '# 99% not-fraud, 1% fraud → model learns "always predict not-fraud"',
  '# Fix: use [B5] to oversample minority class',
  '# Or: use class_weight="balanced" in sklearn',
  '',
  '# Problem 2: Data [B2]',
  '# Including the target variable or future data in features',
  '# Example: predicting churn using "cancelled_date" column',
  '# Always ask: would this feature be available at prediction time?',
  '',
  '# Problem 3: Missing values',
  '# Option 1: [B3] with mean/median for numerical columns',
  '# Option 2: [B3] with mode for categorical columns',
  '# Option 3: drop rows/columns (only if < 5% missing)',
  '',
  '# Problem 4: Feature scales',
  '# Income: 20,000–200,000 vs Age: 18–80 → income dominates',
  '# Fix: [B4] features before training (required for KNN, SVM, neural nets)',
  '',
  '# Always use [B6] splits when classes are imbalanced',
  'from sklearn.model_selection import train_test_split',
  'X_train, X_test, y_train, y_test = train_test_split(',
  '    X, y, test_size=0.2, stratify=y, random_state=42)',
];

export default function ML1_Level4() {
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
        {parts.map((p,i) => {
          const m=p.match(/^\[B(\d)\]$/); if(!m) return <span key={i}>{p}</span>;
          const bid='B'+m[1]; const bl=BLANKS.find(b=>b.id===bid);
          const st=!checked?'':correct[bid]?'correct':'incorrect';
          return <input key={i} className={`ml1-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:100,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <ML1Shell levelId={4} canProceed={allCorrect}
      conceptReveal={[
        { label:'Data Leakage is Career-Ending', detail:'A model that achieves 99.9% accuracy on validation but 60% in production is almost always a data leakage bug. Including a feature that contains future information causes the model to "cheat". Always ask: is this feature available at prediction time, before the label is known?' },
        { label:'Imbalanced Classes', detail:'With 1% fraud: a model predicting "never fraud" gets 99% accuracy. This is useless. Use precision/recall/F1 instead of accuracy. Use class_weight="balanced" or SMOTE. Always check the class distribution before training.' },
      ]}
      prevLevelContext="In the last level you defined what data to collect. Now you\'ll choose which model family is right for the job — and understand why the choice matters before you see a single line of training code."
      cumulativeSkills={[
        "Explained what ML is and the three problem types it solves",
        "Mapped the 8-step ML workflow from problem definition to production deployment",
        "Framed three business problems as supervised learning tasks",
        "Defined data requirements: minimum volume, feature types, labelling strategy",
        "Matched three clinical prediction problems to the correct model family",
      ]}
    >
      <div className="ml1-intro">
        <h1>Data — The Foundation</h1>
        <p className="ml1-tagline">🗃️ Bad data beats good algorithms every time.</p>
        <p className="ml1-why">Senior ML engineers spend 70% of their time on data — cleaning, validating, engineering features. The algorithm is the last 10 minutes. Get the data right first.</p>
      </div>
      <div className="ml1-panel">
        <div className="ml1-panel-hdr">🗃️ Data Issues — fill the blanks</div>
        <div className="ml1-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="ml1-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`ml1-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Data fundamentals locked. You\'ll avoid the most common ML mistakes.':'❌ Check your answers.'}</div>}
    </ML1Shell>
  );
}
