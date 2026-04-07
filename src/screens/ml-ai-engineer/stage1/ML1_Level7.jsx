// src/screens/ml-ai-engineer/stage1/ML1_Level7.jsx — Capstone: Frame an ML Problem (BUILD)
import { useState } from 'react';
import ML1Shell from './ML1Shell';

const REQS = [
  { id:'r1', label:'State the business problem and success metric' },
  { id:'r2', label:'Identify ML type: supervised/unsupervised/reinforcement + classification/regression' },
  { id:'r3', label:'List 5+ input features and the target label' },
  { id:'r4', label:'Identify at least one data quality risk (imbalance, leakage, missing)' },
  { id:'r5', label:'Choose evaluation metric and justify why' },
  { id:'r6', label:'State serving strategy: real-time API or batch scoring' },
];

const CHECK = {
  r1: c => (c.includes('BUSINESS') || c.includes('PROBLEM') || c.includes('GOAL')) && (c.includes('METRIC') || c.includes('ACCURACY') || c.includes('RECALL') || c.includes('PRECISION') || c.includes('AUC')),
  r2: c => (c.includes('SUPERVISED') || c.includes('UNSUPERVISED') || c.includes('REINFORCEMENT')) && (c.includes('CLASSIFICATION') || c.includes('REGRESSION') || c.includes('CLUSTERING')),
  r3: c => c.includes('FEATURE') && c.includes('LABEL'),
  r4: c => c.includes('IMBALANCE') || c.includes('LEAKAGE') || c.includes('MISSING') || c.includes('BIAS') || c.includes('DRIFT'),
  r5: c => (c.includes('F1') || c.includes('RECALL') || c.includes('PRECISION') || c.includes('AUC') || c.includes('RMSE')) && (c.includes('BECAUSE') || c.includes('SINCE') || c.includes('BECAUSE') || c.includes('AS')),
  r6: c => (c.includes('REAL-TIME') || c.includes('API') || c.includes('BATCH') || c.includes('ONLINE')),
};

const SOLUTION = `# ML Problem Frame: Hospital Readmission Prediction

## Business Problem
Predict which patients are likely to be readmitted within 30 days of discharge.
Success metric: reduce readmissions by 15% by targeting high-risk patients for
follow-up calls. Clinical team can act on 50 flagged patients/day maximum.

## ML Type
Supervised learning — Binary classification
(readmitted within 30 days: yes/no)

## Features & Label
Input features:
- Age, gender, length of stay
- Primary diagnosis code (ICD-10)
- Number of previous admissions (last 12 months)
- Discharge disposition (home, nursing facility, against advice)
- Number of medications at discharge
- Lab results: HbA1c, creatinine
- Insurance type

Target label: readmitted_30_days (1 = yes, 0 = no)

## Data Quality Risks
- Class imbalance: ~20% readmitted, 80% not → use F1/recall, class_weight="balanced"
- Data leakage risk: exclude any features recorded AFTER discharge decision
- Missing lab values (~15% missing) → impute with median per diagnosis group

## Evaluation Metric
Recall — we want to catch as many high-risk patients as possible.
A missed case (FN) = missed follow-up call = potential readmission.
A false alarm (FP) = unnecessary call = low cost.
Target: recall > 0.75 at precision > 0.4

## Serving Strategy
Batch scoring — run nightly after discharge decisions are recorded.
Output: ranked list of top-50 high-risk patients for care coordinator.
Real-time not needed — coordinators plan the next morning's calls the night before.`;

export default function ML1_Level7() {
  const [code, setCode] = useState('');
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState({});
  const [showSolution, setShowSolution] = useState(false);

  function check() {
    const c = code.toUpperCase();
    const r = {};
    Object.entries(CHECK).forEach(([id,fn]) => { r[id] = fn(c); });
    setResults(r); setChecked(true);
  }

  const passCount = Object.values(results).filter(Boolean).length;
  const allPass = checked && passCount === REQS.length;

  return (
    <ML1Shell levelId={7} canProceed={allPass}
      conceptReveal={[
        { label:'Stage 1 Complete', detail:'You now understand what ML is, when not to use it, the three learning types, the full 8-step workflow, data quality issues, evaluation metrics, and production considerations. Stage 2 starts with Python and the maths that powers every algorithm.' },
      ]}
      prevLevelContext="You have now framed problems, defined data, chosen models, set metrics, and diagnosed failures. This capstone asks you to produce a complete ML project specification for the hospital readmission problem."
      cumulativeSkills={[
        "Explained what ML is and the three problem types it solves",
        "Mapped the 8-step ML workflow from problem definition to production deployment",
        "Framed three business problems as supervised learning tasks",
        "Defined data requirements: minimum volume, feature types, labelling strategy",
        "Matched clinical prediction problems to the correct model family",
        "Chose the right evaluation metric for each clinical scenario",
        "Diagnosed overfitting, underfitting, and data leakage from model outputs alone",
        "Produced a complete ML project specification: problem, data, model, metric, risks",
      ]}
    >
      <div className="ml1-intro">
        <h1>Capstone — Frame an ML Problem</h1>
        <p className="ml1-tagline">🏆 The most valuable skill in ML: defining the problem correctly before coding anything.</p>
        <p className="ml1-why">Write a complete ML problem framing document. Cover all six requirements. This is the document a senior ML engineer produces before a single line of code is written.</p>
      </div>

      <div style={{marginBottom:14}}>
        {REQS.map(r => (
          <div className="ml1-req" key={r.id}>
            <span style={{color:!checked?'#475569':results[r.id]?'#4ade80':'#f87171',fontSize:14,width:18}}>
              {!checked?'○':results[r.id]?'✓':'✗'}
            </span>
            <span style={{color:'#cbd5e1',fontSize:13}}>{r.label}</span>
          </div>
        ))}
      </div>

      <textarea className="ml1-editor" value={code} onChange={e => setCode(e.target.value)}
        placeholder="# Frame your ML problem...&#10;# Cover: business problem, ML type, features/label, data risks, metric, serving strategy"
        style={{minHeight:300}} />

      <div style={{display:'flex',gap:10,marginTop:10}}>
        <button className="ml1-check-btn" onClick={check}>Check Design</button>
        <button className="ml1-check-btn" style={{background:'#334155',color:'#94a3b8'}} onClick={() => setShowSolution(s=>!s)}>
          {showSolution?'Hide':'Show'} Example Solution
        </button>
      </div>

      {showSolution && (
        <div className="ml1-panel" style={{marginTop:12}}>
          <div className="ml1-panel-hdr">✅ Example Solution</div>
          <pre className="ml1-panel-body" style={{color:'#94a3b8',overflowX:'auto',margin:0,fontSize:12}}>{SOLUTION}</pre>
        </div>
      )}

      {checked && (
        <div className={`ml1-feedback ${allPass?'success':'error'}`}>
          {allPass ? '🎓 Stage 1 Complete! You think like an ML engineer.' : `❌ ${passCount}/${REQS.length} requirements met.`}
        </div>
      )}
    </ML1Shell>
  );
}
