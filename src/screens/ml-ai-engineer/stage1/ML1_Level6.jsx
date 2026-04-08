// src/screens/ml-ai-engineer/stage1/ML1_Level6.jsx — ML in Production (CONCEPTS)
import { useState } from 'react';
import ML1Shell from './ML1Shell';

const CARDS = [
  { id:'serving', title:'Model Serving',        body:'A trained model needs to be accessible to applications. Two patterns: real-time API (FastAPI endpoint — responds in milliseconds, used for fraud detection, recommendations) and batch scoring (run overnight, score millions of records, used for churn prediction, email campaigns).' },
  { id:'drift',   title:'Model Drift',          body:'The world changes. A model trained on 2022 data degrades in 2024 because customer behaviour shifted. Data drift: input distributions change. Concept drift: the relationship between inputs and output changes. Monitor both with statistical tests.' },
  { id:'monitor', title:'Production Monitoring', body:'Track: prediction distribution (are outputs reasonable?), feature distributions (is input data drifting?), model accuracy (if labels come back, measure real performance). Alert when metrics cross thresholds. Automate retraining when drift is detected.' },
  { id:'ab',      title:'A/B Testing Models',   body:'Never replace a production model without comparing it. A/B test: route 5% of traffic to the new model, measure business metrics (conversion, fraud catch rate) not just ML metrics (AUC). Promote only when business metrics improve.' },
  { id:'mlops',   title:'MLOps',               body:'DevOps for ML: version models (MLflow), automate training pipelines (Airflow), containerise inference (Docker), monitor in production (Grafana). Without MLOps, models are retrained manually, versions are lost, and production incidents take days to diagnose.' },
  { id:'cost',    title:'Inference Cost',        body:'GPT-4 costs $0.03 per 1,000 tokens. A model serving 10M requests/day can cost $100k+/month. Real-time inference is 10x more expensive than batch. Always profile inference cost before choosing a model. Distillation and quantisation reduce cost.' },
];

export default function ML1_Level6() {
  const [seen, setSeen] = useState(new Set());
  const toggle = id => setSeen(p => { const n = new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });

  return (
    <ML1Shell levelId={6} canProceed={seen.size >= CARDS.length}
      prevLevelContext="In the last level you defined how to measure success. Now you'll see what failure looks like — overfitting, underfitting, and data leakage — in three real model output scenarios."
      cumulativeSkills={[
        "Explained what ML is and the three problem types it solves",
        "Mapped the 8-step ML workflow from problem definition to production deployment",
        "Framed three business problems as supervised learning tasks",
        "Defined data requirements: minimum volume, feature types, labelling strategy",
        "Matched clinical prediction problems to the correct model family",
        "Chose the right evaluation metric for each clinical scenario",
        "Diagnosed overfitting, underfitting, and data leakage from model outputs alone",
      ]}
    >
      <div className="ml1-intro">
        <h1>ML in Production</h1>
        <p className="ml1-tagline">🚀 Training a model is 10% of the work. Running it reliably is 90%.</p>
        <p className="ml1-why">Most ML courses end at model training. Real ML engineering starts after training — serving, monitoring, drift detection, A/B testing, and cost optimisation.</p>
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
      {seen.size >= CARDS.length && <div className="ml1-feedback success">✅ Production ML understood. One more level — then Stage 2.</div>}
    </ML1Shell>
  );
}
