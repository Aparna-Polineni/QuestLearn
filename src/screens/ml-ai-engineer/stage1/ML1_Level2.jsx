// src/screens/ml-ai-engineer/stage1/ML1_Level2.jsx — Types of Learning (FILL)
import { useState } from 'react';
import ML1Shell from './ML1Shell';

const BLANKS = [
  { id:'B1', answer:'supervised',    hint:'Labelled training data — you know the correct answer' },
  { id:'B2', answer:'unsupervised',  hint:'No labels — model finds patterns itself' },
  { id:'B3', answer:'reinforcement', hint:'Agent learns by trial and error with rewards' },
  { id:'B4', answer:'classification',hint:'Predict a category: spam/not spam, fraud/legit' },
  { id:'B5', answer:'regression',    hint:'Predict a number: house price, demand forecast' },
  { id:'B6', answer:'clustering',    hint:'Group similar items without predefined categories' },
  { id:'B7', answer:'features',      hint:'The input columns the model uses to make predictions' },
  { id:'B8', answer:'label',         hint:'The output column the model is trying to predict' },
];

const LINES = [
  '# [B1] Learning — you have labelled training data',
  '# Input → Model → Predicted Output',
  '# Training: show model (email text → "spam") thousands of times',
  '',
  '# Two types of supervised tasks:',
  '# [B4]: output is a category   → is this email spam? (yes/no)',
  '# [B5]: output is a number     → what will this house sell for? (£342,000)',
  '',
  '# [B2] Learning — no labels, discover structure',
  '# [B6]: group customers by behaviour without pre-defined groups',
  '# Dimensionality reduction: compress 1000 columns to 10 key patterns',
  '',
  '# [B3] Learning — agent learns by doing',
  '# Agent takes action → environment gives reward/penalty → agent improves',
  '# Used in: game AI, robotics, ad bidding, trading',
  '',
  '# Key ML vocabulary:',
  '# [B7]: input columns (age, income, location)',
  '# [B8]: output column (churned: yes/no)',
  '# Model: learns mapping from features → label',
];

export default function ML1_Level2() {
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
          return <input key={i} className={`ml1-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:110}}/>;
        })}
      </div>
    );
  }

  return (
    <ML1Shell levelId={2} canProceed={allCorrect}
      conceptReveal={[
        { label:'Supervised is 80% of Industry ML', detail:'Most real business ML is supervised: churn prediction, demand forecasting, credit scoring, image classification. Reinforcement learning makes headlines but supervised learning makes money.' },
        { label:'Feature Engineering', detail:'The quality of your features determines model quality more than the algorithm. Transforming raw data (log of income, age buckets, day of week) often matters more than choosing XGBoost vs Random Forest. This is covered in Stage 2.' },
      ]}
      prevLevelContext="In the last level you mapped the full ML workflow. Now you\'ll use the first two steps — problem framing — to convert real business problems into supervised learning tasks."
      cumulativeSkills={[
        "Explained what ML is and the three problem types it solves",
        "Mapped the 8-step ML workflow from problem definition to production deployment",
        "Framed three business problems as supervised learning tasks with defined inputs and outputs",
      ]}
    >
      <div className="ml1-intro">
        <h1>Types of Learning</h1>
        <p className="ml1-tagline">📐 Supervised, Unsupervised, Reinforcement — three fundamentally different approaches.</p>
        <p className="ml1-why">Choosing the wrong learning type wastes months. No labels? Supervised won't work. Need explainability? Reinforcement learning is a nightmare to audit. Know the type before picking a model.</p>
      </div>
      <div className="ml1-panel">
        <div className="ml1-panel-hdr">🧠 ML Types — fill the blanks</div>
        <div className="ml1-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="ml1-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`ml1-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Types of learning locked in.':'❌ Check your answers.'}</div>}
    </ML1Shell>
  );
}
