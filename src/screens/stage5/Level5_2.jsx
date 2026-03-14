// src/screens/stage5/Level5_2.jsx — INSERT INTO & SELECT (FILL)
import { useState } from 'react';
import Stage5Shell from './Stage5Shell';
import './Level5_2.css';

const SUPPORT = {
  reveal: {
    concept: 'INSERT & SELECT',
    whatYouLearned: 'INSERT INTO adds rows. SELECT retrieves them. Together these are the most-used SQL commands. SELECT * returns every column; SELECT col1, col2 returns only what you need.',
    realWorldUse: 'Every patientRepository.save(patient) runs an INSERT. Every findAll() runs a SELECT *. Understanding the SQL makes debugging Spring Boot trivially easy.',
    developerSays: 'Never use SELECT * in production code. Always name your columns. It avoids surprises when the schema changes and makes queries faster by fetching only what you need.',
  },
};

const BLANKS = {
  b1: { answer: 'INSERT INTO', hint: 'Two words: INSERT ___' },
  b2: { answer: 'VALUES',      hint: 'The keyword before the actual data' },
  b3: { answer: 'SELECT',      hint: 'The read command in SQL' },
  b4: { answer: 'FROM',        hint: 'Comes after SELECT — WHERE is the data?' },
  b5: { answer: 'WHERE',       hint: 'Filters rows — like an if statement' },
  b6: { answer: 'id = 1',      hint: 'Filter: column = value' },
};

const TABLE_ROWS = [
  { id:1, name:'Alice Patel',   ward:'ICU',     priority:1, active:'true'  },
  { id:2, name:'Bob Chen',      ward:'Cardiac', priority:2, active:'true'  },
  { id:3, name:'Carol Smith',   ward:'ICU',     priority:1, active:'false' },
];

export default function Level5_2() {
  const [vals, setVals] = useState({ b1:'',b2:'',b3:'',b4:'',b5:'',b6:'' });
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState({});

  function check() {
    const r = {};
    Object.keys(BLANKS).forEach(k => {
      r[k] = vals[k].trim().toUpperCase() === BLANKS[k].answer.toUpperCase();
    });
    setResults(r); setChecked(true);
  }

  const allCorrect = checked && Object.keys(BLANKS).every(k => results[k]);

  return (
    <Stage5Shell levelId={2} canProceed={allCorrect} conceptReveal={SUPPORT.reveal}>
      <div className="l52-container">
        <div className="l52-brief">
          <div className="l52-brief-tag">🐘 Stage 5 · Level 5.2 · FILL</div>
          <h2>INSERT & SELECT — Writing and Reading Data</h2>
          <p>You've defined the table structure. Now put data in it and read it back. These two commands underpin every Spring Boot <code>save()</code> and <code>findAll()</code> call.</p>
        </div>

        {/* Live table preview */}
        <div className="l52-anatomy">
          <div className="l52-anat-header">📋 The patients table after INSERT</div>
          <div className="l52-table-wrap">
            <table className="l52-table">
              <thead><tr><th>id</th><th>name</th><th>ward</th><th>priority</th><th>active</th></tr></thead>
              <tbody>
                {TABLE_ROWS.map(r => (
                  <tr key={r.id}><td>{r.id}</td><td>{r.name}</td><td>{r.ward}</td><td>{r.priority}</td><td>{r.active}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="l52-exercise">
          <div className="l52-ex-header"><span className="l52-ex-label">✏️ Fill in the blanks</span></div>
          <div className="l52-sql-block">
            <span className="cm">{'-- 1) Add a patient row\n'}</span>
            {renderB('b1',vals,setVals,results,checked)}
            <span className="tbl"> patients </span>
            <span className="op">{'(name, ward, priority, active)\n'}</span>
            <span className="op">{'  '}</span>
            {renderB('b2',vals,setVals,results,checked)}
            <span className="op"> {'(\'Alice Patel\', \'ICU\', 1, true);\n\n'}</span>

            <span className="cm">{'-- 2) Read ALL patients\n'}</span>
            {renderB('b3',vals,setVals,results,checked)}
            <span className="op"> {'* '}</span>
            {renderB('b4',vals,setVals,results,checked)}
            <span className="tbl"> patients</span>
            <span className="op">{';\n\n'}</span>

            <span className="cm">{'-- 3) Read ONE patient by id\n'}</span>
            <span className="kw">SELECT </span>
            <span className="op">* </span>
            <span className="kw">FROM </span>
            <span className="tbl">patients</span>
            <span className="op">{'\n  '}</span>
            {renderB('b5',vals,setVals,results,checked)}
            <span className="op"> </span>
            {renderB('b6',vals,setVals,results,checked)}
            <span className="op">;</span>
          </div>

          {checked && !allCorrect && (
            <div className="l52-hints">
              {Object.keys(BLANKS).filter(k => !results[k]).map(k => (
                <div key={k} className="l52-hint">💡 {BLANKS[k].hint}</div>
              ))}
            </div>
          )}
          <button className="l52-check-btn" onClick={check}>{checked ? 'Check Again' : 'Check My Answer'}</button>
        </div>

        <div className="l52-ref-grid">
          <div className="l52-ref-head">SELECT options</div>
          {[
            ['SELECT *',            'All columns — convenient but avoid in prod'],
            ['SELECT id, name',     'Only those columns — faster, explicit'],
            ['SELECT COUNT(*)',      'How many rows match — used in aggregation'],
            ['SELECT DISTINCT ward','Unique values only — no duplicates'],
          ].map(([sig,note]) => (
            <div key={sig} className="l52-ref-row">
              <code className="l52-sig">{sig}</code>
              <span className="l52-note">{note}</span>
            </div>
          ))}
        </div>
      </div>
    </Stage5Shell>
  );
}

function renderB(key, vals, setVals, results, checked) {
  const cls = !checked ? 'blank' : results[key] ? 'blank blank--ok' : 'blank blank--err';
  return <input key={key} className={cls} value={vals[key]} placeholder="____"
    onChange={e => setVals(p=>({...p,[key]:e.target.value}))} spellCheck={false} />;
}
