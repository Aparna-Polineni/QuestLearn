// src/screens/ml-ai-engineer/stage1/ML1_Level5.jsx — Evaluation Metrics (FILL)
import { useState } from 'react';
import ML1Shell from './ML1Shell';

const BLANKS = [
  { id:'B1', answer:'accuracy',   hint:'% of correct predictions — misleading for imbalanced data' },
  { id:'B2', answer:'precision',  hint:'Of all predicted positives, how many were actually positive?' },
  { id:'B3', answer:'recall',     hint:'Of all actual positives, how many did we catch?' },
  { id:'B4', answer:'F1',         hint:'Harmonic mean of precision and recall' },
  { id:'B5', answer:'ROC-AUC',    hint:'Area under the curve — threshold-independent performance' },
  { id:'B6', answer:'RMSE',       hint:'Root Mean Squared Error — for regression problems' },
  { id:'B7', answer:'confusion',  hint:'Table showing TP, TN, FP, FN counts' },
];

const LINES = [
  '# Classification Metrics',
  '',
  '# [B1] = (TP + TN) / total   ← DON\'T use for imbalanced classes',
  '',
  '# [B2] = TP / (TP + FP)',
  '# "When we say it\'s fraud, how often are we right?"',
  '# High precision = few false alarms',
  '',
  '# [B3] = TP / (TP + FN)',
  '# "Of all real fraud cases, how many did we catch?"',
  '# High recall = few missed frauds (critical in medical screening)',
  '',
  '# [B4] = 2 * (precision * recall) / (precision + recall)',
  '# Balances precision and recall — use when both matter',
  '',
  '# [B5] — measures model at ALL thresholds',
  '# 0.5 = random, 1.0 = perfect, > 0.7 = usually acceptable',
  '',
  '# Regression Metrics',
  '# [B6] = sqrt(mean((predicted - actual)^2))',
  '# Same units as target — easier to interpret than MSE',
  '',
  '# Always look at the [B7] matrix:',
  '# Shows TP, TN, FP (false alarm), FN (missed case)',
];

export default function ML1_Level5() {
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
          return <input key={i} className={`ml1-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:90,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <ML1Shell levelId={5} canProceed={allCorrect}
      conceptReveal={[
        { label:'Precision vs Recall Trade-off', detail:'You can\'t maximise both. Fraud detection: high recall (catch every fraud) at the cost of low precision (more false alarms). Cancer screening: same. Spam filter: high precision (never miss real email) at the cost of recall (some spam gets through). The business decides which matters more.' },
        { label:'Why Accuracy Lies', detail:'99% accuracy on a dataset with 1% positives is achieved by predicting "negative" every time. This model is useless. Always report precision, recall, and F1 alongside accuracy. Always look at the confusion matrix.' },
      ]}
      prevLevelContext="In the last level you chose the model type. Now you'll define how you'll know if it's working — accuracy, precision, recall, and AUC — and why choosing the wrong metric is as dangerous as a wrong diagnosis."
      cumulativeSkills={[
        "Explained what ML is and the three problem types it solves",
        "Mapped the 8-step ML workflow from problem definition to production deployment",
        "Framed three business problems as supervised learning tasks",
        "Defined data requirements: minimum volume, feature types, labelling strategy",
        "Matched clinical prediction problems to the correct model family",
        "Chose the right evaluation metric: accuracy vs precision vs recall vs AUC",
      ]}
    >
      <div className="ml1-intro">
        <h1>Evaluation Metrics</h1>
        <p className="ml1-tagline">📊 Accuracy lies. Know which metric actually matters for your problem.</p>
        <p className="ml1-why">Reporting 99% accuracy to a stakeholder sounds great until they ask "so how many frauds did you miss?" Choosing the right metric is as important as choosing the right model.</p>
      </div>
      <table className="ml1-table">
        <thead><tr><th>Metric</th><th>When to Use</th><th>Avoid When</th></tr></thead>
        <tbody>
          {[['Accuracy','Balanced classes, general use','Imbalanced classes'],['Precision','False alarms are costly (spam filter)','Missing positives is costly'],['Recall','Missing cases is costly (cancer, fraud)','False alarms are costly'],['F1','Both precision and recall matter','Classes are balanced'],['ROC-AUC','Comparing models at all thresholds','Need a single business metric']].map(([m,u,a],i)=>(
            <tr key={i}><td style={{color:'#8b5cf6',fontWeight:600}}>{m}</td><td style={{color:'#94a3b8',fontSize:12}}>{u}</td><td style={{color:'#64748b',fontSize:12}}>{a}</td></tr>
          ))}
        </tbody>
      </table>
      <div className="ml1-panel">
        <div className="ml1-panel-hdr">📊 Metrics — fill the blanks</div>
        <div className="ml1-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="ml1-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`ml1-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Metrics mastered. You\'ll always report the right number.':'❌ Check your answers.'}</div>}
    </ML1Shell>
  );
}
