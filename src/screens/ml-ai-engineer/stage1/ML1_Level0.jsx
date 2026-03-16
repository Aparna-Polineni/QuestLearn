// src/screens/ml-ai-engineer/stage1/ML1_Level0.jsx — CONCEPTS
import { useState } from 'react';
import ML1Shell from './ML1Shell';

const CARDS = [
  { id:'def', title:'What is Machine Learning?', body:'ML is programming a system to learn patterns from data instead of following explicit rules. Classic programming: you write rules → computer follows them. ML: you provide examples → computer discovers the rules itself.' },
  { id:'vs', title:'ML vs Traditional Programming', body:'Traditional: if fraud_amount > 10000 and country != home_country → flag. ML: train on 10 million historical transactions, let the model discover what "suspicious" looks like — including patterns you\'d never think to write.' },
  { id:'types', title:'Three Types of ML', body:'Supervised: labelled data — you show the model inputs AND correct answers (spam/not spam). Unsupervised: no labels — model finds patterns itself (customer segments). Reinforcement: agent learns by trial and error with rewards (game AI).' },
  { id:'data', title:'Data is Everything', body:'An ML model is only as good as its training data. Garbage in, garbage out. If your training data has biases — like historical hiring decisions that discriminated by gender — your model will reproduce those biases at scale.' },
  { id:'when', title:'When ML is Worth It', body:'ML is worth it when: rules are too complex to write manually, data is abundant, patterns change over time. ML is overkill when: the problem is simple, data is scarce, you need to explain exactly why each decision was made (regulated industries).' },
  { id:'job', title:'What ML Engineers Build', body:'Not just models — the full system. Data pipelines to feed the model. Training infrastructure. Evaluation frameworks. APIs to serve predictions. Monitoring to detect when the model degrades. Model retraining pipelines.' },
];

export default function ML1_Level0() {
  const [seen, setSeen] = useState(new Set());
  const toggle = id => setSeen(p => { const n = new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });

  return (
    <ML1Shell levelId={0} canProceed={seen.size >= CARDS.length}>
      <div className="ml1-intro">
        <h1>What is Machine Learning?</h1>
        <p className="ml1-tagline">🧠 Teaching computers to learn instead of following rules.</p>
        <p className="ml1-why">ML engineers don't just train models — they build the data pipelines, serving infrastructure, monitoring, and retraining systems that make models work in production for real users.</p>
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
      {seen.size >= CARDS.length && <div className="ml1-feedback success">✅ You understand what ML is — and what it isn't. Next: when NOT to use it.</div>}
    </ML1Shell>
  );
}
