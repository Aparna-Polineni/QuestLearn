// src/screens/ml-ai-engineer/stage1/ML1_Level3.jsx — The ML Workflow (FILL)
import { useState } from 'react';
import ML1Shell from './ML1Shell';

const BLANKS = [
  { id:'B1', answer:'problem',      hint:'Define what you\'re trying to predict before touching data' },
  { id:'B2', answer:'baseline',     hint:'Simple benchmark to beat — a rule or majority-class guess' },
  { id:'B3', answer:'split',        hint:'Divide data into train / validation / test sets' },
  { id:'B4', answer:'train',        hint:'Fit the model on training data' },
  { id:'B5', answer:'evaluate',     hint:'Measure performance on held-out validation data' },
  { id:'B6', answer:'overfitting',  hint:'Model memorises training data but fails on new data' },
  { id:'B7', answer:'deploy',       hint:'Serve the model via an API for real predictions' },
  { id:'B8', answer:'monitor',      hint:'Track model performance in production over time' },
];

const LINES = [
  '# The 8-Step ML Workflow',
  '',
  '# Step 1: Define the [B1]',
  '# What exactly are we predicting? What metric means success?',
  '# Bad: "build a churn model"',
  '# Good: "predict 30-day churn, optimise recall, deploy to CRM"',
  '',
  '# Step 2: Establish a [B2]',
  '# Before ML: what does a simple rule achieve?',
  '# If always-predict-no-churn gives 95% accuracy → ML must beat 95%',
  '',
  '# Step 3: [B3] the data',
  '# 60% train / 20% validation / 20% test (never touch test until final eval)',
  '',
  '# Step 4: [B4] the model',
  '# Start simple (logistic regression, decision tree) before complex models',
  '',
  '# Step 5: [B5] on validation set',
  '# Check for [B6]: high train accuracy but low validation accuracy',
  '',
  '# Step 6: Iterate (feature eng, hyperparameter tuning, try other models)',
  '',
  '# Step 7: [B7] the model',
  '# Serve predictions via REST API, batch job, or embedded in app',
  '',
  '# Step 8: [B8] in production',
  '# Models degrade as real-world data shifts — alert when performance drops',
];

export default function ML1_Level3() {
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
      <div key={idx} style={{padding:'1px 0',color:'#cbd5e1'}}>
        {parts.map((p,i) => {
          const m=p.match(/^\[B(\d)\]$/); if(!m) return <span key={i} style={{whiteSpace:'pre'}}>{p}</span>;
          const bid='B'+m[1]; const bl=BLANKS.find(b=>b.id===bid);
          const st=!checked?'':correct[bid]?'correct':'incorrect';
          return <input key={i} className={`ml1-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:100}}/>;
        })}
      </div>
    );
  }

  return (
    <ML1Shell levelId={3} canProceed={allCorrect}
      conceptReveal={[
        { label:'Always Establish a Baseline First', detail:'A "dumb" model that predicts the majority class can reach 95% accuracy on an imbalanced dataset. If your ML model gets 96%, the business impact is tiny. The baseline reveals whether ML is actually adding value.' },
        { label:'Never Touch the Test Set', detail:'The test set is your one shot at an honest estimate of real-world performance. If you evaluate on the test set during development, you\'re implicitly tuning to it and your final number is optimistic. Use validation for tuning, test for the final report only.' },
      ]}
      prevLevelContext="In the last level you framed the prediction problem. Now you\'ll define the data requirements — what you need to collect before you can train a model to predict hospital readmissions."
      cumulativeSkills={[
        "Explained what ML is and the three problem types it solves",
        "Mapped the 8-step ML workflow from problem definition to production deployment",
        "Framed three business problems as supervised learning tasks",
        "Defined data requirements: minimum volume, feature types, and labelling strategy",
      ]}
    >
      <div className="ml1-intro">
        <h1>The ML Workflow</h1>
        <p className="ml1-tagline">⚙️ 8 steps from problem definition to production monitoring.</p>
        <p className="ml1-why">Most failed ML projects fail at steps 1 and 2 — they skip proper problem definition and jump straight to modelling. The workflow makes every step explicit.</p>
      </div>
      <div className="ml1-panel">
        <div className="ml1-panel-hdr">⚙️ ML Workflow — fill the blanks</div>
        <div className="ml1-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="ml1-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`ml1-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Workflow memorised. This sequence guides every ML project you\'ll ever work on.':'❌ Check your answers.'}</div>}
    </ML1Shell>
  );
}
