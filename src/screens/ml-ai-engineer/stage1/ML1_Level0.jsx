// src/screens/ml-ai-engineer/stage1/ML1_Level0.jsx — CONCEPTS
import { useState } from 'react';
import ML1Shell from './ML1Shell';

const CARDS = [
  { id:'def',    title:'What is Machine Learning?',       body:'ML is programming by example instead of by rules. Classic: you write if/else logic. ML: you show the model thousands of examples and it learns the pattern itself. The model finds rules you\'d never think to write.' },
  { id:'vs',     title:'ML vs Traditional Programming',   body:'Traditional: if fraud_amount > 10000 → flag. Works for simple rules. ML: train on 10M transactions and discover that fraud correlates with unusual time + location + device combination — a pattern impossible to write manually.' },
  { id:'types',  title:'3 Types of ML',                  body:'Supervised: you provide labelled examples (spam/not spam) — model learns to classify. Unsupervised: no labels — model finds hidden structure (customer segments). Reinforcement: agent learns by trial and reward (game AI, robotics).' },
  { id:'data',   title:'Data is Everything',              body:'A model trained on biased data produces biased results. If your fraud training data over-represents certain demographics, your model will discriminate. "Garbage in, garbage out" is the most important phrase in ML.' },
  { id:'eng',    title:'What ML Engineers Actually Build', body:'Not just models. The full system: data pipelines to feed training. Feature engineering. Training infrastructure. Evaluation frameworks. Serving APIs. Monitoring for model drift. Automated retraining. The model is 10% of the work.' },
  { id:'when',   title:'When ML is Worth It',             body:'Use ML when: rules are too complex, data is abundant, patterns change over time. Skip ML when: a simple rule works, data is scarce, every decision needs a legal explanation (credit, hiring). This is Level 1\'s topic.' },
];

export default function ML1_Level0() {
  const [seen, setSeen] = useState(new Set());
  const toggle = id => setSeen(p => { const n = new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });

  return (
    <ML1Shell levelId={0} canProceed={seen.size >= CARDS.length}
      cumulativeSkills={[
        "Explained what machine learning is and the three problems it can and cannot solve",
      ]}
    >
      <div className="ml1-intro">
        <h1>What is Machine Learning?</h1>
        <p className="ml1-tagline">🧠 Teaching computers to learn instead of programming every rule.</p>
        <p className="ml1-why">ML engineers don't just train models — they build the full system: data pipelines, training infrastructure, serving APIs, and monitoring. The model is the smallest part.</p>
      </div>
      <div className="ml1-cards">
        {CARDS.map(c => (
          <div key={c.id} className={`ml1-card ${seen.has(c.id)?'seen':''}`} onClick={() => toggle(c.id)}>
            <div className="ml1-card-top">
              <span className="ml1-card-title">{c.title}</span>
              <span style={{color:'#8b5cf6',fontSize:11}}>{seen.has(c.id)?'▲':'▼'}</span>
            </div>
            {seen.has(c.id) && <p className="ml1-card-body">{c.body}</p>}
          </div>
        ))}
      </div>
      {seen.size < CARDS.length && <p style={{textAlign:'center',color:'#475569',fontSize:13}}>Open all {CARDS.length} cards to continue →</p>}
      {seen.size >= CARDS.length && <div className="ml1-feedback success">✅ Foundation set. Next: when NOT to use ML.</div>}
    </ML1Shell>
  );
}
