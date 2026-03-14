// src/screens/stage5/Level5_8.jsx — Aggregate Functions (BUILD)
import { useState } from 'react';
import Stage5Shell from './Stage5Shell';
import './Level5_8.css';

const SUPPORT = {
  reveal: {
    concept: 'Aggregate Functions',
    whatYouLearned: 'COUNT, SUM, AVG, MAX, MIN collapse many rows into one value. GROUP BY runs the aggregate per group. HAVING filters groups (like WHERE, but for groups).',
    realWorldUse: 'Dashboard stats — "how many patients per ward", "average priority by ward" — are all aggregates. Spring Data @Query with COUNT() or AVG() generates this SQL.',
    developerSays: 'GROUP BY is very common in reporting. HAVING is rare but important — remember: WHERE filters rows, HAVING filters groups after GROUP BY.',
  },
};

const TASKS = [
  { id:'count', title:'Count total patients', hint:'SELECT COUNT(*) FROM patients', check: v => v.toUpperCase().includes('COUNT') && v.toUpperCase().includes('PATIENTS') },
  { id:'group', title:'Count patients per ward', hint:'Use GROUP BY ward', check: v => { const u=v.toUpperCase(); return u.includes('COUNT') && u.includes('GROUP BY') && u.includes('WARD'); } },
  { id:'avg',   title:'Average priority of ICU patients', hint:'Use AVG() and WHERE ward = \'ICU\'', check: v => { const u=v.toUpperCase(); return u.includes('AVG') && u.includes('WHERE') && u.includes('ICU'); } },
  { id:'having',title:'Wards with more than 2 patients', hint:'GROUP BY ward HAVING COUNT(*) > 2', check: v => { const u=v.toUpperCase(); return u.includes('GROUP BY') && u.includes('HAVING') && u.includes('COUNT'); } },
];

const FUNCS = [
  ['COUNT(*)',  'Number of rows'],
  ['SUM(col)', 'Total of a column'],
  ['AVG(col)', 'Average value'],
  ['MAX(col)', 'Largest value'],
  ['MIN(col)', 'Smallest value'],
];

export default function Level5_8() {
  const [codes, setCodes] = useState(Object.fromEntries(TASKS.map(t=>[t.id,''])));
  const [results, setResults] = useState({});
  const [checked, setChecked] = useState(false);

  function check() {
    const r = {};
    TASKS.forEach(t => { r[t.id] = t.check(codes[t.id]); });
    setResults(r); setChecked(true);
  }
  const allCorrect = checked && TASKS.every(t=>results[t.id]);

  return (
    <Stage5Shell levelId={8} canProceed={allCorrect} conceptReveal={SUPPORT.reveal}>
      <div className="l58-container">
        <div className="l58-brief">
          <div className="l58-brief-tag">🐘 Stage 5 · Level 5.8 · BUILD</div>
          <h2>Aggregate Functions — Summarising Many Rows into One</h2>
          <p>Instead of returning every row, aggregates compute a result across a set of rows. Write each query from scratch.</p>
        </div>

        <div className="l58-ref-grid">
          {FUNCS.map(([fn,note])=>(
            <div key={fn} className="l58-ref-row">
              <code className="l58-fn">{fn}</code><span className="l58-fnote">{note}</span>
            </div>
          ))}
        </div>

        <div className="l58-info">
          <strong>Order:</strong> SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY — always in this sequence.
        </div>

        {TASKS.map(task=>(
          <div key={task.id} className="l58-task">
            <div className="l58-task-header">
              <span className="l58-task-title">{task.title}</span>
              {checked && <span className={`l58-badge ${results[task.id]?'ok':'err'}`}>{results[task.id]?'✓':'✗'}</span>}
            </div>
            <div className="l58-task-hint">💡 Hint: {task.hint}</div>
            <textarea className="l58-editor" value={codes[task.id]} rows={3}
              onChange={e=>setCodes(p=>({...p,[task.id]:e.target.value}))}
              placeholder="-- Write your SQL here" spellCheck={false} />
          </div>
        ))}

        <button className="l58-check-btn" onClick={check}>{checked?'Check Again':'Check My SQL'}</button>
      </div>
    </Stage5Shell>
  );
}
