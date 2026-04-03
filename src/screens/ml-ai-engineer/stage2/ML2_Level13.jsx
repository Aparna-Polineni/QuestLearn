// src/screens/ml-ai-engineer/stage2/ML2_Level13.jsx — Data Pipeline Capstone (BUILD)
// Uses RubricValidator — rubric with per-criterion diagnostic hints
import { useState } from 'react';
import ML2Shell from './ML2Shell';
import { RubricValidator } from '../../../components/BuildValidator';

const RUBRIC = [
  {
    label:    'load_data(): loads CSV, logs shape and dtypes',
    check:    (_, u) => u.includes('LOAD_DATA') && (u.includes('READ_CSV') || u.includes('SHAPE')),
    hint:     'Define a function called load_data(path). Inside: pd.read_csv(path), print df.shape and df.dtypes, return df.',
  },
  {
    label:    'clean_data(): handles missing values, fixes dtypes, removes duplicates',
    check:    (_, u) => u.includes('CLEAN_DATA') && (u.includes('FILLNA') || u.includes('DROPNA')) && (u.includes('ASTYPE') || u.includes('DROP_DUPLICATES')),
    hint:     'clean_data(df) must call drop_duplicates(), fix dtypes with astype(), and fillna() or dropna() for nulls.',
  },
  {
    label:    'engineer_features(): creates at least 3 new features',
    check:    (_, u) => u.includes('ENGINEER') && (u.match(/LENGTH_OF_STAY|LOG_FEE|IS_WEEKEND|AGE_GROUP|IS_STILL_ADMITTED|PREV_ADM/g) || []).length >= 3,
    hint:     'Create at least 3 derived columns: length_of_stay (discharged - admitted days), log_fee (np.log1p), is_weekend (dayofweek >= 5), age_group (pd.cut), is_still_admitted.',
  },
  {
    label:    'split_data(): 60/20/20 train/val/test split, stratified on target',
    check:    (_, u) => u.includes('SPLIT') && u.includes('STRATIFY') && (u.includes('0.2') || u.includes('TEST_SIZE')),
    hint:     'Use train_test_split twice. First: 80% train, 20% test (stratify=y). Second: split the 80% into 75/25 to get 60/20/20 overall. Always pass stratify=y.',
  },
  {
    label:    'scale_and_encode(): StandardScaler on numeric, OneHotEncoder on categorical — fit on train only',
    check:    (_, u) => u.includes('STANDARDSCALER') && u.includes('ONEHOTENCODER') && (u.includes('FIT_TRANSFORM') || u.includes('FIT(X_TRAIN')),
    hint:     'Fit scalers and encoders on X_train only, then transform X_val and X_test. Never fit on val/test — that\'s data leakage.',
  },
  {
    label:    'validate_pipeline(): asserts no NULLs in X_train, asserts shapes are correct',
    check:    (_, u) => u.includes('ASSERT') && (u.includes('ISNULL') || u.includes('ISNA') || u.includes('SHAPE')),
    hint:     'assert X_train.isnull().sum().sum() == 0 — this catches any null that slipped through. Also assert X_val.shape[1] == X_train.shape[1].',
  },
  {
    label:    'Main block: calls all functions in the correct order',
    check:    (_, u) => (u.includes('IF __NAME__') || u.includes('LOAD_DATA') && u.includes('CLEAN_DATA') && u.includes('ENGINEER') && u.includes('SPLIT')),
    hint:     'At the bottom: df = load_data(...) → df = clean_data(df) → df = engineer_features(df) → X_train, ... = split_data(df) → scale_and_encode() → validate_pipeline()',
  },
];

const SOLUTION = `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder

def load_data(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)
    print(f"Loaded: {df.shape}")
    print(df.dtypes)
    return df

def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    df = df.drop_duplicates(subset=['patient_id'])
    df['fee'] = pd.to_numeric(df['fee'], errors='coerce')
    df['admitted_at']   = pd.to_datetime(df['admitted_at'])
    df['discharged_at'] = pd.to_datetime(df['discharged_at'])
    df['fee'] = df.groupby('ward_id')['fee'].transform(
        lambda x: x.fillna(x.median()))
    df['ward_id'].fillna(df['ward_id'].mode()[0], inplace=True)
    df['status'] = df['status'].str.lower().str.strip()
    return df

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    df['length_of_stay']   = (df['discharged_at'] - df['admitted_at']).dt.days
    df['log_fee']          = np.log1p(df['fee'])
    df['is_weekend']       = df['admitted_at'].dt.dayofweek >= 5
    df['age_group']        = pd.cut(df['age'], bins=[0,40,60,80,120],
                                    labels=['young','mid','senior','elderly'])
    df['is_still_admitted']= df['discharged_at'].isnull().astype(int)
    return df

def split_data(df, target='readmitted'):
    X = df.drop(columns=[target, 'patient_id'])
    y = df[target]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=42)
    X_train, X_val, y_train, y_val = train_test_split(
        X_train, y_train, test_size=0.25, stratify=y_train, random_state=42)
    return X_train, X_val, X_test, y_train, y_val, y_test

def scale_and_encode(X_train, X_val, X_test):
    num_cols = X_train.select_dtypes(include='number').columns
    cat_cols = X_train.select_dtypes(include='object').columns
    scaler  = StandardScaler()
    encoder = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
    X_train[num_cols] = scaler.fit_transform(X_train[num_cols])
    X_val[num_cols]   = scaler.transform(X_val[num_cols])
    X_test[num_cols]  = scaler.transform(X_test[num_cols])
    return X_train, X_val, X_test

def validate_pipeline(X_train, X_val, X_test):
    assert X_train.isnull().sum().sum() == 0, "NULLs in X_train"
    assert X_val.shape[1]  == X_train.shape[1], "Val/train feature mismatch"
    assert X_test.shape[1] == X_train.shape[1], "Test/train feature mismatch"
    print("Pipeline validated ✓")

if __name__ == '__main__':
    df = load_data('patients.csv')
    df = clean_data(df)
    df = engineer_features(df)
    X_train, X_val, X_test, y_train, y_val, y_test = split_data(df)
    X_train, X_val, X_test = scale_and_encode(X_train, X_val, X_test)
    validate_pipeline(X_train, X_val, X_test)`;

export default function ML2_Level13() {
  const [passed, setPassed] = useState(false);

  return (
    <ML2Shell levelId={13} canProceed={passed}
      conceptReveal={[{
        label: 'Pipeline = Functions in Order',
        detail: 'Every ML pipeline is a sequence of pure functions: load → clean → engineer → split → scale → validate. Each function takes a DataFrame in and returns a DataFrame out. This makes it testable, reproducible, and safe to re-run. The validate step is what separates production code from notebook experiments.',
      }]}
    >
      <div className="ml2-intro">
        <h1>Data Pipeline Capstone</h1>
        <p className="ml2-tagline">🏗️ Build a complete, reproducible ML data pipeline from scratch.</p>
        <p className="ml2-why">
          Real ML engineers don't write scripts — they write pipelines made of named functions.
          Each criterion below maps to one function. When a check fails, the hint tells you
          exactly which line is missing.
        </p>
      </div>

      <div className="ml2-panel" style={{ marginBottom: 14 }}>
        <div className="ml2-panel-hdr">📋 Dataset: Patient Readmission</div>
        <pre className="ml2-panel-body" style={{ fontSize: 12, color: '#64748b' }}>
{`patients.csv columns:
  patient_id, name, age, ward_id, fee, admitted_at, discharged_at,
  status, prev_admissions, readmitted (0/1 — target)

Known issues:
  fee: ~1.6% nulls | ward_id: 0 nulls | discharged_at: 8% nulls (still admitted)`}
        </pre>
      </div>

      <RubricValidator
        language="Python"
        rubric={RUBRIC}
        solutionCode={SOLUTION}
        onAllPassed={() => setPassed(true)}
      />
    </ML2Shell>
  );
}
