// src/screens/ml-ai-engineer/stage2/ML2_Level13.jsx — Data Pipeline Capstone (BUILD)
import { useState } from 'react';
import ML2Shell from './ML2Shell';

const REQS = [
  { id:'r1', label:'load_data(): load CSV, log shape and dtypes' },
  { id:'r2', label:'clean_data(): handle missing values, fix dtypes, remove duplicates' },
  { id:'r3', label:'engineer_features(): create at least 3 new features' },
  { id:'r4', label:'split_data(): train/validation/test split (60/20/20), stratified' },
  { id:'r5', label:'scale_and_encode(): StandardScaler on numeric, OneHotEncoder on categorical (fit on train only)' },
  { id:'r6', label:'validate_pipeline(): assert no NULLs in X_train, assert shapes correct' },
  { id:'r7', label:'Main block calling all functions in order' },
];

const CHECK = {
  r1: c => c.includes('LOAD_DATA') && (c.includes('READ_CSV') || c.includes('SHAPE')),
  r2: c => c.includes('CLEAN_DATA') && (c.includes('FILLNA') || c.includes('DROPNA')) && (c.includes('ASTYPE') || c.includes('DROP_DUPLICATES')),
  r3: c => c.includes('ENGINEER') && (c.match(/LENGTH_OF_STAY|LOG_FEE|IS_WEEKEND|AGE_GROUP|PREV_ADM/g)||[]).length >= 3,
  r4: c => c.includes('SPLIT') && c.includes('STRATIFY') && (c.includes('60') || c.includes('0.6') || c.includes('TEST_SIZE=0.2')),
  r5: c => c.includes('STANDARDSCALER') && c.includes('ONEHOTENCODER') && (c.includes('FIT_TRANSFORM') || c.includes('FIT(X_TRAIN')),
  r6: c => c.includes('ASSERT') && (c.includes('ISNULL') || c.includes('SHAPE') || c.includes('NULL')),
  r7: c => c.includes('IF __NAME__') || (c.includes('LOAD_DATA') && c.includes('CLEAN_DATA') && c.includes('ENGINEER') && c.includes('SPLIT')),
};

const SOLUTION = `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.pipeline import Pipeline

def load_data(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)
    print(f"Loaded: {df.shape}, dtypes:\\n{df.dtypes}")
    return df

def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    df = df.drop_duplicates(subset=['patient_id'])
    # Fix dtypes
    df['fee'] = pd.to_numeric(df['fee'], errors='coerce')
    df['admitted_at'] = pd.to_datetime(df['admitted_at'])
    df['discharged_at'] = pd.to_datetime(df['discharged_at'])
    # Handle missing
    df['fee'] = df.groupby('ward_id')['fee'].transform(
        lambda x: x.fillna(x.median()))
    df['ward_id'].fillna(df['ward_id'].mode()[0], inplace=True)
    # Consistent categories
    df['status'] = df['status'].str.lower().str.strip()
    return df

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    df['length_of_stay'] = (df['discharged_at'] - df['admitted_at']).dt.days
    df['log_fee']        = np.log1p(df['fee'])
    df['is_weekend']     = df['admitted_at'].dt.dayofweek >= 5
    df['age_group']      = pd.cut(df['age'], bins=[0,40,60,80,120],
                                   labels=['young','mid','senior','elderly'])
    df['is_still_admitted'] = df['discharged_at'].isnull().astype(int)
    return df

def split_data(df, target='readmitted'):
    X = df.drop(columns=[target, 'patient_id', 'name'])
    y = df[target]
    X_train, X_temp, y_train, y_temp = train_test_split(
        X, y, test_size=0.4, stratify=y, random_state=42)
    X_val, X_test, y_val, y_test = train_test_split(
        X_temp, y_temp, test_size=0.5, stratify=y_temp, random_state=42)
    print(f"Train: {X_train.shape}, Val: {X_val.shape}, Test: {X_test.shape}")
    return X_train, X_val, X_test, y_train, y_val, y_test

def scale_and_encode(X_train, X_val, X_test):
    num_cols = X_train.select_dtypes('number').columns.tolist()
    cat_cols = X_train.select_dtypes('object').columns.tolist()
    scaler = StandardScaler()
    X_train[num_cols] = scaler.fit_transform(X_train[num_cols])  # fit on train!
    X_val[num_cols]   = scaler.transform(X_val[num_cols])
    X_test[num_cols]  = scaler.transform(X_test[num_cols])
    ohe = OneHotEncoder(sparse=False, handle_unknown='ignore')
    ohe.fit(X_train[cat_cols])
    for split in [X_train, X_val, X_test]:
        enc = pd.DataFrame(ohe.transform(split[cat_cols]),
                            columns=ohe.get_feature_names_out(),
                            index=split.index)
        split.drop(columns=cat_cols, inplace=True)
        split[enc.columns] = enc
    return X_train, X_val, X_test, scaler, ohe

def validate_pipeline(X_train, y_train, X_val, X_test):
    assert X_train.isnull().sum().sum() == 0, "NULLs in X_train!"
    assert len(X_train) == len(y_train),      "Row mismatch!"
    assert X_val.shape[1] == X_test.shape[1], "Column mismatch val/test!"
    print("✅ Pipeline validation passed")

if __name__ == '__main__':
    df = load_data('patients.csv')
    df = clean_data(df)
    df = engineer_features(df)
    X_train, X_val, X_test, y_train, y_val, y_test = split_data(df)
    X_train, X_val, X_test, scaler, ohe = scale_and_encode(X_train, X_val, X_test)
    validate_pipeline(X_train, y_train, X_val, X_test)
    print("Pipeline complete — ready for modelling")`;

export default function ML2_Level13() {
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
    <ML2Shell levelId={13} canProceed={allPass}
      conceptReveal={[{ label:'Stage 2 Complete', detail:'You can now load, clean, explore, visualise, and prepare any tabular dataset for ML. You understand NumPy vectorisation, Pandas wrangling, statistics, probability, gradient descent, and feature engineering. Stage 3 builds classical ML models on top of this foundation.' }]}
    >
      <div className="ml2-intro">
        <h1>Data Pipeline Capstone</h1>
        <p className="ml2-tagline">🏆 Build a reusable, production-grade data preparation pipeline.</p>
        <p className="ml2-why">This is the exact deliverable a junior ML engineer produces in their first week: a clean, modular Python pipeline that takes raw CSV and outputs model-ready arrays. Write it once, reuse it on every project.</p>
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
        placeholder="# Write your data pipeline here...&#10;# 7 functions + main block" style={{minHeight:360}} />
      <div style={{display:'flex',gap:10,marginTop:10}}>
        <button className="ml2-check-btn" onClick={check}>Check Pipeline</button>
        <button className="ml2-check-btn" style={{background:'#334155',color:'#94a3b8'}} onClick={()=>setShowSolution(s=>!s)}>
          {showSolution?'Hide':'Show'} Reference Solution
        </button>
      </div>
      {showSolution && (
        <div className="ml2-panel" style={{marginTop:12}}>
          <div className="ml2-panel-hdr">✅ Reference Solution</div>
          <pre className="ml2-panel-body" style={{color:'#94a3b8',overflowX:'auto',margin:0,fontSize:11}}>{SOLUTION}</pre>
        </div>
      )}
      {checked && <div className={`ml2-feedback ${allPass?'success':'error'}`}>{allPass?'🎓 Stage 2 Complete! Your data pipeline is production-ready.':`❌ ${passCount}/${REQS.length} functions complete.`}</div>}
    </ML2Shell>
  );
}
