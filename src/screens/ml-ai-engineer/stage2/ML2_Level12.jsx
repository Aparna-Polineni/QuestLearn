// src/screens/ml-ai-engineer/stage2/ML2_Level12.jsx — Full EDA (BUILD)
import { useState } from 'react';
import ML2Shell from './ML2Shell';

const REQS = [
  { id:'r1', label:'Load and inspect: shape, dtypes, head, describe, isnull().sum()' },
  { id:'r2', label:'Distribution analysis: plot fee distribution, identify skewness' },
  { id:'r3', label:'Missing value strategy: document which columns have NULLs and how to handle each' },
  { id:'r4', label:'Correlation analysis: compute correlation matrix, identify top features related to readmission' },
  { id:'r5', label:'Class balance: check readmitted ratio, state if SMOTE or class_weight is needed' },
  { id:'r6', label:'Feature engineering: create at least 2 new features from existing columns' },
  { id:'r7', label:'Summary: state top 3 insights and recommended next steps' },
];

const CHECK = {
  r1: c => c.includes('SHAPE') && (c.includes('DTYPE') || c.includes('INFO')) && c.includes('DESCRIBE'),
  r2: c => (c.includes('HISTPLOT') || c.includes('HIST') || c.includes('DISTRIBUTION')) && (c.includes('SKEW') || c.includes('LOG')),
  r3: c => c.includes('ISNULL') && (c.includes('FILLNA') || c.includes('DROPNA') || c.includes('IMPUTE') || c.includes('MEDIAN')),
  r4: c => c.includes('CORR') && (c.includes('READMIT') || c.includes('TARGET') || c.includes('HEATMAP')),
  r5: c => (c.includes('VALUE_COUNTS') || c.includes('CLASS') || c.includes('BALANCE')) && (c.includes('SMOTE') || c.includes('CLASS_WEIGHT') || c.includes('IMBALANCE')),
  r6: c => {
    const features = ['LENGTH_OF_STAY','LOG_FEE','IS_WEEKEND','AGE_GROUP','VISIT_FREQUENCY','DAYS_SINCE'];
    return features.filter(f => c.includes(f)).length >= 2;
  },
  r7: c => (c.includes('INSIGHT') || c.includes('FINDING') || c.includes('SUMMARY')) && (c.includes('NEXT') || c.includes('RECOMMEND') || c.includes('MODEL')),
};

const SOLUTION = `# EDA: Patient Readmission Dataset

## 1. Load and Inspect
import pandas as pd, numpy as np
df = pd.read_csv('patients.csv')
print(df.shape)          # (15000, 18)
print(df.dtypes)
df.head()
df.describe()
df.isnull().sum()        # fee: 234 nulls, ward_id: 0

## 2. Distribution Analysis
import seaborn as sns, matplotlib.pyplot as plt
sns.histplot(df['fee'], bins=50)
print(f"Skewness: {df['fee'].skew():.2f}")  # 2.7 — highly right-skewed
# → Log-transform fee before modelling
df['log_fee'] = np.log1p(df['fee'])

## 3. Missing Value Strategy
# fee (234 nulls, 1.6%): impute with ward-specific median
df['fee'] = df.groupby('ward_id')['fee'].transform(
    lambda x: x.fillna(x.median()))
# ward_id (0 nulls): no action needed
# discharged_at (1200 nulls, 8%): NULL = still admitted — create flag
df['is_still_admitted'] = df['discharged_at'].isnull().astype(int)

## 4. Correlation Analysis
corr = df.select_dtypes('number').corr()
sns.heatmap(corr[['readmitted']].sort_values('readmitted', ascending=False),
            annot=True)
# Top correlates with readmission: prev_admissions (0.41), age (0.28), length_of_stay (0.22)

## 5. Class Balance
df['readmitted'].value_counts(normalize=True)
# 0: 78%  1: 22% — moderately imbalanced
# → Use class_weight='balanced' in sklearn

## 6. Feature Engineering
df['length_of_stay'] = (df['discharged_at'] - df['admitted_at']).dt.days
df['is_weekend']     = df['admitted_at'].dt.dayofweek >= 5
df['age_group']      = pd.cut(df['age'], bins=[0,40,60,80,120],
                               labels=['young','mid','senior','elderly'])
df['log_fee']        = np.log1p(df['fee'])

## 7. Summary — Top 3 Insights
# 1. Previous admissions is the strongest predictor (r=0.41) — include raw + log transform
# 2. Fee is highly right-skewed — log_fee replaces raw fee
# 3. 8% still-admitted patients — is_still_admitted flag captures this pattern

# Recommended next steps:
# - Use class_weight='balanced' to handle 78/22 imbalance
# - Features: log_fee, length_of_stay, prev_admissions, age, is_weekend
# - Start with logistic regression baseline, then try XGBoost`;

export default function ML2_Level12() {
  const [code, setCode] = useState('');
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState({});
  const [showSolution, setShowSolution] = useState(false);

  function check() {
    const c = code.toUpperCase();
    const r = {};
    Object.entries(CHECK).forEach(([id,fn]) => { r[id]=fn(c); });
    setResults(r); setChecked(true);
  }
  const passCount = Object.values(results).filter(Boolean).length;
  const allPass = checked && passCount === REQS.length;

  return (
    <ML2Shell levelId={12} canProceed={allPass}>
      <div className="ml2-intro">
        <h1>Full EDA</h1>
        <p className="ml2-tagline">🔬 End-to-end exploratory data analysis on a real dataset.</p>
        <p className="ml2-why">This is the deliverable you produce at the start of every ML project. A thorough EDA tells you what features matter, what cleaning is needed, what transformations help, and what model strategy to use.</p>
      </div>
      <div style={{background:'#0f172a',borderRadius:8,padding:'12px 16px',marginBottom:16,fontSize:12,color:'#64748b',fontFamily:'monospace',lineHeight:1.7}}>
        <div style={{color:'#fbbf24',marginBottom:6,fontWeight:600}}>Dataset: patients.csv</div>
        <div>15,000 rows × 18 columns: patient_id, name, age, ward_id, admitted_at, discharged_at, fee, prev_admissions, diagnosis_code, doctor_id, status, readmitted (target: 1=yes, 0=no)</div>
      </div>
      <div style={{marginBottom:14}}>
        {REQS.map(r => (
          <div className="ml2-req" key={r.id}>
            <span style={{color:!checked?'#475569':results[r.id]?'#4ade80':'#f87171',fontSize:14,width:18}}>{!checked?'○':results[r.id]?'✓':'✗'}</span>
            <span style={{color:'#cbd5e1',fontSize:13}}>{r.label}</span>
          </div>
        ))}
      </div>
      <textarea className="ml2-editor" value={code} onChange={e => setCode(e.target.value)}
        placeholder="# Write your full EDA here...&#10;# Cover all 7 requirements above" style={{minHeight:320}} />
      <div style={{display:'flex',gap:10,marginTop:10}}>
        <button className="ml2-check-btn" onClick={check}>Check EDA</button>
        <button className="ml2-check-btn" style={{background:'#334155',color:'#94a3b8'}} onClick={()=>setShowSolution(s=>!s)}>
          {showSolution?'Hide':'Show'} Reference Solution
        </button>
      </div>
      {showSolution && (
        <div className="ml2-panel" style={{marginTop:12}}>
          <div className="ml2-panel-hdr">✅ Reference EDA</div>
          <pre className="ml2-panel-body" style={{color:'#94a3b8',overflowX:'auto',margin:0,fontSize:11}}>{SOLUTION}</pre>
        </div>
      )}
      {checked && <div className={`ml2-feedback ${allPass?'success':'error'}`}>{allPass?'✅ Production-grade EDA complete.': `❌ ${passCount}/${REQS.length} sections covered.`}</div>}
    </ML2Shell>
  );
}
