// src/screens/ml-ai-engineer/stage2/ML2_Level6.jsx — Pandas Bug Hunt (DEBUG)
import { useState } from 'react';
import ML2Shell from './ML2Shell';

const BUGS = [
  {
    id:1, label:'Bug 1 — SettingWithCopyWarning: modifying a slice silently fails',
    bad:`# Filter patients, then update their status
active = df[df['ward_id'] == 3]
active['status'] = 'reviewed'    # SettingWithCopyWarning!
# The original df is NOT modified — silent failure
print(df[df['ward_id'] == 3]['status'].unique())  # still old values`,
    good:`# Fix: use .loc on the original DataFrame directly
df.loc[df['ward_id'] == 3, 'status'] = 'reviewed'

# Or: make an explicit copy first
active = df[df['ward_id'] == 3].copy()
active['status'] = 'reviewed'    # modifies the copy safely`,
    why:'A boolean-filtered DataFrame may be a view or a copy depending on Pandas internals — you can\'t know which. Modifying a view updates the original (what you want). Modifying a copy does nothing. Use .loc[mask, col] = value to always modify the original, or .copy() when you intentionally want a separate DataFrame.',
    hint:'Never modify a filtered slice. Use .loc on the original or .copy().',
  },
  {
    id:2, label:'Bug 2 — Chained indexing gives wrong results',
    bad:`# Get the fee of the first active patient
first_fee = df[df['status'] == 'active']['fee'][0]
# KeyError or wrong row! Index 0 might not exist after filtering
# Pandas keeps original integer index — filtered df might start at index 847`,
    good:`# Fix: reset index after filtering, or use .iloc
active = df[df['status'] == 'active'].reset_index(drop=True)
first_fee = active['fee'].iloc[0]    # positional: truly first row

# Or use .squeeze() to get scalar
first_fee = df.loc[df['status'] == 'active', 'fee'].iloc[0]`,
    why:'When you filter a DataFrame, Pandas keeps the original integer index. So df[df["status"]=="active"]["fee"][0] looks for index label 0 which may not exist after filtering. Always use .iloc[0] for positional access or reset_index() before using integer indexing.',
    hint:'After filtering, index labels shift. Use .iloc[0] not [0].',
  },
  {
    id:3, label:'Bug 3 — dtype mismatch causing merge to silently drop rows',
    bad:`# Merge patients with ward info
patients['ward_id'] = patients['ward_id'].astype(int)
# ward_df was loaded from CSV — ward_id is a string "1","2","3"
merged = patients.merge(ward_df, on='ward_id', how='left')
print(len(merged))    # 10000 rows, but all ward columns are NaN!
# int 3 != str "3" — no matches found`,
    good:`# Always check types before merging
print(patients['ward_id'].dtype)   # int64
print(ward_df['ward_id'].dtype)    # object (string)

# Fix: align types before merge
ward_df['ward_id'] = ward_df['ward_id'].astype(int)
merged = patients.merge(ward_df, on='ward_id', how='left')
# Now int matches int — merge works correctly`,
    why:'LEFT JOIN silently returns NaN for all right-side columns when join keys don\'t match — no error is raised. A common cause is type mismatch: one side has int64, the other has object (string). Always verify dtypes on both sides before merging. pd.merge() never raises an error for zero matches — it just returns NaNs.',
    hint:'Check dtypes on both DataFrames before merging. int != str silently.',
  },
];

export default function ML2_Level6() {
  const [found, setFound] = useState(new Set());

  return (
    <ML2Shell levelId={6} canProceed={found.size
      prevLevelContext="In the last level you explored clean data. Now you\'ll see what happens when Pandas data is not clean — three bugs that silently corrupt model training without raising a single error."
      cumulativeSkills={[
        "Set up the Python ML environment and ran first NumPy array operations",
        "Implemented vectorised operations: dot products, broadcasting, array slicing",
        "Loaded and inspected the patient dataset: shape, dtypes, missing values, distributions",
        "Cleaned the dataset: imputed nulls, fixed dtypes, removed duplicates",
        "Engineered five new predictive features from the raw patient columns",
        "Produced a full EDA: correlation matrix, class balance, distribution analysis",
        "Identified three Pandas traps that silently corrupt ML training data",
      ]}
    >= BUGS.length}
      conceptReveal={[{ label:'The Three Pandas Traps', detail:'SettingWithCopyWarning (modifying a slice), chained indexing (wrong index after filter), dtype mismatch in merge (silent NaN flood). These three bugs are in real ML codebases right now producing wrong training data. Recognise them instantly.' }]}
    >
      <div className="ml2-intro">
        <h1>Pandas Bug Hunt</h1>
        <p className="ml2-tagline">🐛 Three bugs that corrupt your training data silently. No crashes.</p>
        <p className="ml2-why">The worst Pandas bugs don't raise exceptions — they quietly produce wrong DataFrames that feed bad data into your model, which then trains confidently on garbage.</p>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        {BUGS.map(bug => (
          <div key={bug.id} style={{background:'#1e293b',borderRadius:10,padding:'16px 20px',border:`1px solid ${found.has(bug.id)?'#4ade8060':'#334155'}`,borderLeft:`3px solid ${found.has(bug.id)?'#4ade80':'#f87171'}`}}>
            <h3 style={{color:found.has(bug.id)?'#4ade80':'#f87171',margin:'0 0 10px',fontSize:14}}>{bug.label}</h3>
            <div className="ml2-panel" style={{margin:'0 0 8px'}}>
              <div className="ml2-panel-hdr" style={{color:'#f87171'}}>❌ Bug</div>
              <pre className="ml2-panel-body" style={{margin:0,overflowX:'auto',fontSize:12,color:'#cbd5e1'}}>{bug.bad}</pre>
            </div>
            <p style={{color:'#64748b',fontSize:13,margin:'8px 0'}}>💡 {bug.hint}</p>
            {!found.has(bug.id) ? (
              <button className="ml2-check-btn" style={{background:'#334155',color:'#94a3b8',fontSize:13,padding:'7px 16px'}}
                onClick={() => setFound(p=>{const n=new Set(p);n.add(bug.id);return n;})}>Reveal Fix</button>
            ) : (
              <>
                <div className="ml2-panel" style={{margin:'8px 0 6px'}}>
                  <div className="ml2-panel-hdr" style={{color:'#4ade80'}}>✅ Fixed</div>
                  <pre className="ml2-panel-body" style={{margin:0,overflowX:'auto',fontSize:12,color:'#94a3b8'}}>{bug.good}</pre>
                </div>
                <p style={{color:'#94a3b8',fontSize:13,lineHeight:1.6,margin:'6px 0'}}>{bug.why}</p>
              </>
            )}
          </div>
        ))}
      </div>
      {found.size >= BUGS.length && <div className="ml2-feedback success" style={{marginTop:20}}>✅ Three Pandas traps identified. Your training data will be correct.</div>}
    </ML2Shell>
  );
}
