// src/screens/ml-ai-engineer/stage2/ML2_Level10.jsx — Gradient Descent (FILL)
import { useState } from 'react';
import ML2Shell from './ML2Shell';

const BLANKS = [
  { id:'B1', answer:'loss',          hint:'Measure of how wrong the model\'s predictions are' },
  { id:'B2', answer:'gradient',      hint:'Partial derivatives — direction of steepest increase' },
  { id:'B3', answer:'learning rate', hint:'How big a step to take in each update (α)' },
  { id:'B4', answer:'weights',       hint:'The model parameters being optimised' },
  { id:'B5', answer:'epoch',         hint:'One full pass through the entire training dataset' },
  { id:'B6', answer:'overfitting',   hint:'Train loss low but validation loss high — memorised training data' },
  { id:'B7', answer:'batch',         hint:'Subset of training data used for one gradient update' },
];

const LINES = [
  '# Gradient descent — how every ML model learns',
  '',
  '# 1. Make predictions with current [B4]',
  'predictions = X @ weights + bias',
  '',
  '# 2. Compute the [B1] (how wrong are we?)',
  'loss = np.mean((predictions - y_true) ** 2)  # MSE',
  '',
  '# 3. Compute the [B2] (which direction to adjust)',
  'grad_w = (2/n) * X.T @ (predictions - y_true)',
  '',
  '# 4. Update [B4] in the opposite direction',
  'alpha = 0.01  # [B3]',
  'weights = weights - alpha * grad_w',
  '',
  '# 5. Repeat for many [B5]s',
  'for epoch in range(100):',
  '    # Shuffle and split into [B7]es (mini-batch GD)',
  '    for X_batch, y_batch in get_batches(X, y, size=32):',
  '        pred  = X_batch @ weights',
  '        loss  = np.mean((pred - y_batch)**2)',
  '        grad  = (2/32) * X_batch.T @ (pred - y_batch)',
  '        weights -= alpha * grad',
  '',
  '# Watch for [B6]: train loss ↓ but val loss ↑',
];

export default function ML2_Level10() {
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
          return <input key={i} className={`ml2-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:110,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <ML2Shell levelId={10} canProceed={allCorrect}
      conceptReveal={[
        { label:'Learning Rate is Critical', detail:'Too high: weights overshoot the minimum, loss oscillates or explodes. Too low: training takes forever. Typical starting values: 0.1, 0.01, 0.001. Learning rate schedulers reduce it over time. Adam optimizer adapts it automatically — which is why Adam is the default in PyTorch.' },
        { label:'Mini-batch vs Full-batch vs Stochastic', detail:'Full-batch GD: use all data per update — stable but slow. Stochastic GD: use 1 sample — fast but noisy. Mini-batch GD: use 32-256 samples — best of both. Mini-batch is the standard. The "batch size" hyperparameter trades memory for gradient stability.' },
      ]}
    >
      <div className="ml2-intro">
        <h1>Gradient Descent</h1>
        <p className="ml2-tagline">⬇️ The algorithm behind every neural network. Understand it once, understand everything.</p>
        <p className="ml2-why">Whether it's logistic regression or GPT-4, every ML model learns by computing a loss, calculating gradients, and nudging weights in the opposite direction. This is that process, in 20 lines of NumPy.</p>
      </div>
      <div className="ml2-panel">
        <div className="ml2-panel-hdr">⬇️ Gradient Descent — fill the blanks</div>
        <div className="ml2-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="ml2-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`ml2-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Gradient descent demystified.':'❌ Check your answers.'}</div>}
    </ML2Shell>
  );
}
