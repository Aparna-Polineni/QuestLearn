// src/screens/ml-ai-engineer/stage2/ML2_Level1.jsx — NumPy (FILL)
import { useState } from 'react';
import ML2Shell from './ML2Shell';

const BLANKS = [
  { id:'B1', answer:'np.array',      hint:'Create a NumPy array from a Python list' },
  { id:'B2', answer:'np.zeros',      hint:'Create array filled with 0.0' },
  { id:'B3', answer:'np.arange',     hint:'Like Python range() but returns an array' },
  { id:'B4', answer:'.shape',        hint:'Attribute: tuple of array dimensions (rows, cols)' },
  { id:'B5', answer:'.reshape',      hint:'Change dimensions without changing data' },
  { id:'B6', answer:'np.dot',        hint:'Dot product / matrix multiplication' },
  { id:'B7', answer:'.mean',         hint:'Average of all elements (or along an axis)' },
];

const LINES = [
  'import numpy as np',
  '',
  '# Create arrays',
  'features = [B1]([[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]])',
  'zeros    = [B2]((3, 4))          # 3×4 matrix of 0.0',
  'sequence = [B3](0, 10, 2)        # [0, 2, 4, 6, 8]',
  '',
  '# Inspect',
  'print(features[B4])              # (3, 2)',
  '',
  '# Reshape: (3,2) → (2,3)',
  'reshaped = features[B5]((2, 3))',
  '# -1 means "infer this dimension"',
  'flat = features[B5]((-1,))       # (6,) — 1D array',
  '',
  '# Vectorised ops — no loops!',
  'weights = np.array([0.4, 0.6])',
  'scores  = [B6](features, weights)  # dot product: (3,)',
  '',
  '# Aggregate',
  'print(features[B7]())            # mean of all values',
  'print(features[B7](axis=0))      # mean per column',
];

export default function ML2_Level1() {
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
          return <input key={i} className={`ml2-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:100,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <ML2Shell levelId={1} canProceed={allCorrect}
      conceptReveal={[
        { label:'Vectorisation is Everything', detail:'NumPy operations work on entire arrays without Python loops. features * 2 doubles every element in compiled C code. A loop over 1M elements takes ~1s in Python, ~1ms in NumPy. Every ML library uses NumPy arrays — you must understand them.' },
        { label:'Broadcasting', detail:'np.array([1,2,3]) + 10 adds 10 to every element. This is broadcasting — NumPy expands the scalar to match the array shape. More complex: (3,2) array + (2,) array broadcasts the (2,) across all 3 rows. This is how bias vectors are added to weight matrices in neural networks.' },
      ]}
      prevLevelContext="In the last level you set up NumPy. Now you'll implement the fundamental operations that power every ML computation — vectorised arithmetic, broadcasting, and array manipulation."
      cumulativeSkills={[
        "Set up the Python ML environment and ran first NumPy array operations",
        "Implemented vectorised operations: dot products, broadcasting, array slicing",
      ]}
    >
      <div className="ml2-intro">
        <h1>NumPy Arrays & Vectorisation</h1>
        <p className="ml2-tagline">🔢 100× faster than Python loops. The foundation of all ML computation.</p>
        <p className="ml2-why">Every tensor in PyTorch, every matrix in scikit-learn, every computation in your ML pipeline runs on NumPy arrays under the hood. Master this once and everything else becomes clear.</p>
      </div>
      <div className="ml2-panel">
        <div className="ml2-panel-hdr">🔢 NumPy — fill the blanks</div>
        <div className="ml2-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="ml2-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`ml2-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ NumPy mastered.':'❌ Check your answers — case sensitive!'}</div>}
    </ML2Shell>
  );
}
