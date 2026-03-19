// src/screens/ml-ai-engineer/stage2/ML2_Level9.jsx — Probability & Bayes (FILL)
import { useState } from 'react';
import ML2Shell from './ML2Shell';

const BLANKS = [
  { id:'B1', answer:'prior',        hint:'Probability before seeing new evidence' },
  { id:'B2', answer:'likelihood',   hint:'Probability of the evidence given the hypothesis' },
  { id:'B3', answer:'posterior',    hint:'Updated probability after seeing evidence' },
  { id:'B4', answer:'conditional',  hint:'P(A|B) — probability of A given B has occurred' },
  { id:'B5', answer:'independent',  hint:'P(A and B) = P(A) × P(B) when events don\'t affect each other' },
  { id:'B6', answer:'class prior',  hint:'P(spam) — base rate before seeing any features' },
];

const LINES = [
  '# Bayes\' Theorem: the foundation of probabilistic ML',
  '# P(hypothesis | evidence) = P(evidence | hypothesis) × P(hypothesis)',
  '#                             ─────────────────────────────────────────',
  '#                                       P(evidence)',
  '',
  '# [B3] = [B2] × [B1] / P(evidence)',
  '',
  '# Example: spam filter',
  '# P(spam) = 0.2              ← [B1] (20% of emails are spam)',
  '# P("free" | spam) = 0.8     ← [B2] ("free" appears in 80% of spam)',
  '# P("free") = 0.25           ← 25% of all emails contain "free"',
  '',
  '# P(spam | "free") = 0.8 × 0.2 / 0.25 = 0.64',
  '# 64% chance this email is spam',
  '',
  '# [B4] probability: P(A|B)',
  '# P(readmitted | age>70) ≠ P(readmitted)',
  '# Older patients have different readmission rates',
  '',
  '# [B5] events: P(A and B) = P(A) × P(B)',
  '# Naive Bayes assumes features are [B5]:',
  '# P(spam | "free" and "click") ≈ P("free"|spam) × P("click"|spam) × [B6]',
];

export default function ML2_Level9() {
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
    <ML2Shell levelId={9} canProceed={allCorrect}
      conceptReveal={[
        { label:'Bayes in Every ML Model', detail:'Naive Bayes: directly applies Bayes\' theorem. Logistic regression: outputs P(y=1|X). Random forests: vote is a probability estimate. Neural networks: softmax layer outputs class probabilities. Every ML classifier produces probabilities — understanding Bayes explains where they come from.' },
        { label:'Prior Matters', detail:'If only 1% of transactions are fraudulent (low prior), even a model that\'s 99% accurate might still be mostly guessing "not fraud". The prior forces you to think about base rates before evaluating model accuracy. A 99% accurate model on 1% fraud data is often useless.' },
      ]}
    >
      <div className="ml2-intro">
        <h1>Probability & Bayes</h1>
        <p className="ml2-tagline">🎲 ML models output probabilities. This is where they come from.</p>
        <p className="ml2-why">Every ML classifier — from logistic regression to neural networks — ultimately produces a probability. Bayes' theorem is the mathematical foundation. Understanding it makes you a better model builder.</p>
      </div>
      <div className="ml2-panel">
        <div className="ml2-panel-hdr">🎲 Probability & Bayes — fill the blanks</div>
        <div className="ml2-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="ml2-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`ml2-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Bayesian thinking unlocked.':'❌ Check your answers.'}</div>}
    </ML2Shell>
  );
}
