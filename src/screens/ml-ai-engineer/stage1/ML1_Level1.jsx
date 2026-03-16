// src/screens/ml-ai-engineer/stage1/ML1_Level1.jsx — When NOT to Use ML (DEBUG)
import { useState } from 'react';
import ML1Shell from './ML1Shell';

const BUGS = [
  {
    id:1, label:'Wrong choice 1 — ML for a simple rule',
    bad:`# Problem: flag orders over £1000 for manual review
# Developer decided to use ML because "it's more sophisticated"
model = train_classifier(order_history, labels=['review','ok'])
# Accuracy: 94% — sounds great!
# But a simple rule gets 100%:
if order.amount > 1000: flag_for_review()`,
    good:`# Use the explicit rule — it's 100% accurate, explainable, fast
# No training data needed, no model to maintain, no drift to monitor
def should_review(order):
    return order.amount > 1000
# ML adds cost with no benefit when a rule works perfectly`,
    why:'ML is not inherently better than rules. If you can write a rule that works perfectly, do it. ML is worth the complexity only when rules can\'t capture the pattern — like fraud detection with thousands of interacting signals.',
    hint:'If a simple rule achieves 100%, ML adds complexity with no benefit.',
  },
  {
    id:2, label:'Wrong choice 2 — ML with 200 training examples',
    bad:`# Medical diagnosis model: predict cancer from symptoms
# Training data: 200 patient records
model = RandomForestClassifier()
model.fit(X_train_200_rows, y_train)
print(f"Accuracy: {model.score(X_test):.2%}")  # 85%
# Deployed to hospital — gives wrong diagnosis to real patients
# 85% accuracy on 200 examples doesn't generalise`,
    good:`# With only 200 examples:
# 1. Use logistic regression (simpler, less overfitting risk)
# 2. Use rigorous cross-validation to detect overfitting
# 3. Do NOT deploy — gather more data first
# 4. Or use a rule-based system validated by doctors
# Medical ML requires thousands of examples minimum + clinical trials`,
    why:'ML models need enough data to learn patterns that generalise to new cases. With 200 examples, a Random Forest memorises the training data (overfitting). The 85% accuracy is on data the model has seen — real-world accuracy would be far lower.',
    hint:'200 examples is almost never enough for ML. Gather more data or use rules.',
  },
  {
    id:3, label:'Wrong choice 3 — Black box in a regulated context',
    bad:`# Loan approval model at a bank
model = XGBoostClassifier()
model.fit(loan_applications, approved_labels)
# Deployed — 87% accuracy, up from 82% with rules
# Regulator asks: "Why was this loan denied?"
explanation = "The model computed 0.23 probability"
# Regulatory violation — banks must explain every credit decision`,
    good:`# For regulated decisions, use interpretable models
from sklearn.linear_model import LogisticRegression
model = LogisticRegression()
# Now you can explain: "Denied because debt-to-income ratio of 0.68
# exceeds threshold of 0.45 (coefficient weight: 2.3)"
# Or: use SHAP values to explain complex models where required
import shap
explainer = shap.TreeExplainer(xgb_model)
shap_values = explainer.shap_values(X)  # feature contributions`,
    why:'GDPR and financial regulations require explainable decisions. A black-box model that can\'t say WHY it denied a loan violates the right to explanation. Always check regulatory requirements before choosing a model architecture.',
    hint:'Regulated decisions require explainable models — not just accurate ones.',
  },
];

export default function ML1_Level1() {
  const [found, setFound] = useState(new Set());

  return (
    <ML1Shell levelId={1} canProceed={found.size >= BUGS.length}
      conceptReveal={[{ label:'The ML Decision Framework', detail:'Ask 4 questions: (1) Can a rule solve it? If yes, use the rule. (2) Do you have enough data? If no, collect more. (3) Does it need to be explainable? If yes, use a simple model. (4) Is the cost of being wrong acceptable? Medical/legal = extreme caution.' }]}
    >
      <div className="ml1-intro">
        <h1>When NOT to Use ML</h1>
        <p className="ml1-tagline">🚫 The best engineers know when ML is the wrong tool.</p>
        <p className="ml1-why">Over-engineering with ML when a rule works perfectly wastes months of work. Under-engineering with ML in a regulated context creates legal risk. Three wrong choices — find why they're wrong.</p>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        {BUGS.map(bug => (
          <div key={bug.id} style={{background:'#1e293b',borderRadius:10,padding:'16px 20px',border:`1px solid ${found.has(bug.id)?'#4ade8060':'#334155'}`,borderLeft:`3px solid ${found.has(bug.id)?'#4ade80':'#f87171'}`}}>
            <h3 style={{color:found.has(bug.id)?'#4ade80':'#f87171',margin:'0 0 10px',fontSize:14}}>{bug.label}</h3>
            <div className="ml1-panel" style={{margin:'0 0 8px'}}>
              <div className="ml1-panel-hdr" style={{color:'#f87171'}}>❌ Wrong Approach</div>
              <pre className="ml1-panel-body" style={{margin:0,overflowX:'auto',fontSize:12,color:'#cbd5e1'}}>{bug.bad}</pre>
            </div>
            <p style={{color:'#64748b',fontSize:13,margin:'8px 0'}}>💡 {bug.hint}</p>
            {!found.has(bug.id) ? (
              <button className="ml1-btn" style={{background:'#334155',color:'#94a3b8',fontSize:13,padding:'7px 16px',marginTop:6}}
                onClick={() => setFound(p=>{const n=new Set(p);n.add(bug.id);return n;})}>Reveal Why</button>
            ) : (
              <>
                <div className="ml1-panel" style={{margin:'8px 0 6px'}}>
                  <div className="ml1-panel-hdr" style={{color:'#4ade80'}}>✅ Better Approach</div>
                  <pre className="ml1-panel-body" style={{margin:0,overflowX:'auto',fontSize:12,color:'#94a3b8'}}>{bug.good}</pre>
                </div>
                <p style={{color:'#94a3b8',fontSize:13,lineHeight:1.6,margin:'6px 0'}}>{bug.why}</p>
              </>
            )}
          </div>
        ))}
      </div>
      {found.size >= BUGS.length && <div className="ml1-feedback success" style={{marginTop:20}}>✅ You'll never over-engineer with ML when a simpler solution exists.</div>}
    </ML1Shell>
  );
}
