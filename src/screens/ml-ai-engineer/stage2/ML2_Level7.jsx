// src/screens/ml-ai-engineer/stage2/ML2_Level7.jsx — Linear Algebra for ML (FILL)
import { useState } from 'react';
import ML2Shell from './ML2Shell';

const BLANKS = [
  { id:'B1', answer:'vector',    hint:'1D array of numbers — represents one data point or direction' },
  { id:'B2', answer:'matrix',    hint:'2D array — rows are samples, columns are features' },
  { id:'B3', answer:'dot product', hint:'Sum of element-wise products — measures similarity' },
  { id:'B4', answer:'transpose',  hint:'Flip rows and columns — (m,n) becomes (n,m)' },
  { id:'B5', answer:'eigenvalue', hint:'Scalar that shows how much a transformation stretches a direction' },
  { id:'B6', answer:'norm',       hint:'Length/magnitude of a vector' },
  { id:'B7', answer:'matrix multiplication', hint:'Combine two matrices — (m,k) @ (k,n) = (m,n)' },
];

const LINES = [
  '# ML uses linear algebra constantly — here\'s why',
  '',
  '# A [B1]: one patient\'s features',
  'patient = np.array([45, 1, 3, 120.5])  # age, ward, visits, fee',
  '',
  '# A [B2]: all patients (rows=samples, cols=features)',
  'X = np.array([[45,1,3,120.5],[32,2,1,80.0],[67,3,5,200.0]])',
  '# Shape: (3 patients, 4 features)',
  '',
  '# [B3]: similarity between two vectors',
  'weights = np.array([0.4, 0.1, 0.2, 0.3])',
  'score = np.dot(patient, weights)',
  '# Equivalent to: sum(patient * weights)',
  '',
  '# [B4]: flip dimensions',
  'X_T = X.[B4]()   # or X.T — (4,3) instead of (3,4)',
  '',
  '# [B7]: the core of neural networks',
  '# X @ W: (3,4) @ (4,1) = (3,1) predictions for all patients',
  'W = np.random.randn(4, 1)',
  'predictions = X @ W',
  '',
  '# [B6]: distance between points',
  'distance = np.linalg.[B6](patient)',
];

export default function ML2_Level7() {
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
          return <input key={i} className={`ml2-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:140,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <ML2Shell levelId={7} canProceed={allCorrect}
      conceptReveal={[
        { label:'Why ML is Linear Algebra', detail:'A neural network is just: output = activation(X @ W + b). X is the input matrix, W is the weight matrix, b is the bias vector, @ is matrix multiplication. Every layer, every prediction, every gradient is a matrix operation. NumPy makes this fast.' },
        { label:'Dot Product = Similarity', detail:'The dot product of two vectors measures how much they point in the same direction. In NLP, words with similar meaning have vectors with high dot products. In recommendation systems, users with similar tastes have high dot products. It\'s the mathematical definition of "similar".' },
      ]}
      prevLevelContext="In the last level you identified the bugs that corrupt data. Now you'll visualise the patient dataset in full — the plots that reveal model problems before a single line of training code is written."
      cumulativeSkills={[
        "Set up the Python ML environment and ran first NumPy array operations",
        "Implemented vectorised operations: dot products, broadcasting, array slicing",
        "Loaded and inspected the patient dataset: shape, dtypes, missing values, distributions",
        "Cleaned the dataset: imputed nulls, fixed dtypes, removed duplicates",
        "Engineered five new predictive features from the raw patient columns",
        "Produced a full EDA: correlation matrix, class balance, distribution analysis",
        "Identified three Pandas traps that silently corrupt ML training data",
        "Built a complete visualisation suite: distributions, correlations, class balance plots",
      ]}
    >
      <div className="ml2-intro">
        <h1>Linear Algebra for ML</h1>
        <p className="ml2-tagline">📐 Vectors, matrices, dot products — ML is just linear algebra at scale.</p>
        <p className="ml2-why">You don't need to derive eigenvectors by hand. You do need to understand that a neural network is X @ W, that similarity is a dot product, and that matrix shapes determine what operations are valid.</p>
      </div>
      <div className="ml2-panel">
        <div className="ml2-panel-hdr">📐 Linear Algebra — fill the blanks</div>
        <div className="ml2-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="ml2-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`ml2-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Linear algebra foundation set.':'❌ Check your answers.'}</div>}
    </ML2Shell>
  );
}
