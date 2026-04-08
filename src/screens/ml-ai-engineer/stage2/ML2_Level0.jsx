// src/screens/ml-ai-engineer/stage2/ML2_Level0.jsx — CONCEPTS
import { useState } from 'react';
import ML2Shell from './ML2Shell';

const CARDS = [
  { id:'numpy',  title:'NumPy — Fast Maths',            body:'NumPy provides arrays and vectorised operations. Instead of looping over 1M values in Python, NumPy processes them in compiled C code in parallel. Every ML library (PyTorch, TensorFlow, scikit-learn) uses NumPy arrays internally. It\'s the foundation.' },
  { id:'pandas', title:'Pandas — Data Wrangling',       body:'Pandas DataFrames are 2D tables with named columns and row indices. Load CSVs, filter rows, group by category, merge tables, handle missing values. 90% of ML data preparation happens in Pandas before any model sees the data.' },
  { id:'vis',    title:'Matplotlib & Seaborn — Visualisation', body:'matplotlib is the base plotting library. seaborn is built on top with better defaults and statistical plots. Before modelling, always visualise: distributions, correlations, class balance, feature vs target relationships. What you see drives what you build.' },
  { id:'math',   title:'Why Maths Matters',             body:'Linear algebra: matrices represent datasets and transformations. Gradient descent: calculus tells us how to adjust model weights. Probability: Bayes theorem is the foundation of many classifiers. You don\'t need to derive everything, but you need to understand what the algorithms are doing.' },
  { id:'env',    title:'The Data Science Environment',  body:'Jupyter notebooks: interactive cells — run one step at a time, see output immediately. Virtual environments (venv/conda): isolate dependencies per project. Colab: free GPU in the browser. VS Code with Python extension: for production code. Stage 2 focuses on the concepts — tools are secondary.' },
  { id:'flow',   title:'Stage 2 Flow',                  body:'NumPy (fast arrays) → Pandas (data wrangling) → matplotlib/seaborn (visualisation) → linear algebra concepts → statistics → probability → gradient descent → feature engineering → EDA project → full data pipeline. By the end you can prepare any dataset for modelling.' },
];

export default function ML2_Level0() {
  const [seen, setSeen] = useState(new Set());
  const toggle = id => setSeen(p => { const n = new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });

  return (
    <ML2Shell levelId={0} canProceed={seen.size >= CARDS.length}
      cumulativeSkills={[
        "Set up the Python ML environment and ran first NumPy array operations",
      ]}
    >
      <div className="ml2-intro">
        <h1>Python & Math for ML</h1>
        <p className="ml2-tagline">🐍 NumPy, Pandas, maths — the toolkit every ML engineer lives in.</p>
        <p className="ml2-why">Stage 1 taught you when and why to use ML. Stage 2 gives you the tools to work with data. You can't train a model on raw CSV files — this stage is how you prepare, explore, and understand data.</p>
      </div>
      <div className="ml2-cards">
        {CARDS.map(c => (
          <div key={c.id} className={`ml2-card ${seen.has(c.id)?'seen':''}`} onClick={() => toggle(c.id)}>
            <div className="ml2-card-top">
              <span className="ml2-card-title">{c.title}</span>
              <span style={{color:'#fbbf24',fontSize:11}}>{seen.has(c.id)?'▲':'▼'}</span>
            </div>
            {seen.has(c.id) && <p className="ml2-card-body">{c.body}</p>}
          </div>
        ))}
      </div>
      {seen.size < CARDS.length && <p style={{textAlign:'center',color:'#475569',fontSize:13}}>Open all {CARDS.length} cards to continue →</p>}
      {seen.size >= CARDS.length && <div className="ml2-feedback success">✅ Python ML ecosystem understood. Let's write code.</div>}
    </ML2Shell>
  );
}
