// src/screens/stage5/Level5_5.jsx — Primary Keys & AUTO_INCREMENT (BUILD)
import { useState } from 'react';
import Stage5Shell from './Stage5Shell';
import './Level5_5.css';

const SUPPORT = {
  reveal: {
    concept: 'Primary Keys',
    whatYouLearned: 'Every table needs a PRIMARY KEY — a column guaranteed to be unique for every row. AUTO_INCREMENT makes MySQL assign the next integer automatically. This maps directly to @Id @GeneratedValue in JPA.',
    realWorldUse: 'Every entity in your hospital system has an id. Patient.id, Doctor.id, Ward.id — all backed by AUTO_INCREMENT primary keys. Foreign keys reference these IDs to link tables.',
    developerSays: 'Use BIGINT not INT for IDs in production systems. INT maxes out at ~2 billion. BIGINT holds 9 quintillion. Twitter switched IDs to BIGINT after running out of INTs.',
  },
};

const TASKS = [
  {
    id: 'doctors',
    title: 'Create the doctors table with a primary key',
    hint: 'id BIGINT PRIMARY KEY AUTO_INCREMENT — then name, specialty, and department columns',
    check: (val) => {
      const v = val.toUpperCase();
      return v.includes('CREATE TABLE') && v.includes('DOCTORS') &&
             (v.includes('BIGINT') || v.includes('INT')) &&
             v.includes('PRIMARY KEY') && v.includes('AUTO_INCREMENT') &&
             v.includes('NAME') && (v.includes('VARCHAR') || v.includes('TEXT'));
    },
    solution: `CREATE TABLE doctors (\n  id         BIGINT       PRIMARY KEY AUTO_INCREMENT,\n  name       VARCHAR(100) NOT NULL,\n  specialty  VARCHAR(80)  NOT NULL,\n  department VARCHAR(80)  NOT NULL\n);`,
  },
  {
    id: 'wards',
    title: 'Create the wards table — name must be UNIQUE',
    hint: 'Wards have a name (unique), floor (INT), and capacity (INT). Use UNIQUE keyword after the data type.',
    check: (val) => {
      const v = val.toUpperCase();
      return v.includes('CREATE TABLE') && v.includes('WARDS') &&
             (v.includes('BIGINT') || v.includes('INT')) &&
             v.includes('PRIMARY KEY') && v.includes('UNIQUE') &&
             v.includes('CAPACITY');
    },
    solution: `CREATE TABLE wards (\n  id       BIGINT       PRIMARY KEY AUTO_INCREMENT,\n  name     VARCHAR(50)  NOT NULL UNIQUE,\n  floor    INT          NOT NULL DEFAULT 1,\n  capacity INT          NOT NULL DEFAULT 20\n);`,
  },
];

export default function Level5_5() {
  const [codes, setCodes] = useState({ doctors: '', wards: '' });
  const [results, setResults] = useState({});
  const [checked, setChecked] = useState(false);
  const [show, setShow] = useState({});

  function check() {
    const r = {};
    TASKS.forEach(t => { r[t.id] = t.check(codes[t.id]); });
    setResults(r); setChecked(true);
  }

  const allCorrect = checked && TASKS.every(t => results[t.id]);

  return (
    <Stage5Shell levelId={5} canProceed={allCorrect} conceptReveal={SUPPORT.reveal}>
      <div className="l55-container">
        <div className="l55-brief">
          <div className="l55-brief-tag">🐘 Stage 5 · Level 5.5 · BUILD</div>
          <h2>Primary Keys — Every Row's Unique Identity</h2>
          <p>A primary key guarantees uniqueness. <code>AUTO_INCREMENT</code> tells MySQL to assign the next integer automatically — you never set it manually. Write the CREATE TABLE statements from scratch.</p>
        </div>

        <div className="l55-anatomy">
          <div className="l55-anat-header">🔑 Primary Key anatomy</div>
          <div className="l55-sql-demo">
            <span className="kw">CREATE TABLE </span><span className="tbl">example </span><span className="op">{'(\n'}</span>
            <span className="op">{'  '}</span><span className="col">id</span><span className="op">        </span><span className="typ">BIGINT</span>
            <span className="op">       </span><span className="kw">PRIMARY KEY AUTO_INCREMENT</span><span className="op">{',  '}</span>
            <span className="cm">{'-- ← unique id, auto-filled\n'}</span>
            <span className="op">{'  '}</span><span className="col">name</span><span className="op">      </span><span className="typ">VARCHAR(100)</span>
            <span className="op"> </span><span className="kw">NOT NULL</span><span className="op">{',             '}</span>
            <span className="cm">{'-- ← must have a value\n'}</span>
            <span className="op">{'  '}</span><span className="col">code</span><span className="op">      </span><span className="typ">VARCHAR(10)</span>
            <span className="op">  </span><span className="kw">NOT NULL UNIQUE</span><span className="op">{'       '}</span>
            <span className="cm">{'-- ← no duplicates allowed\n'}</span>
            <span className="op">{');'}</span>
          </div>
        </div>

        {TASKS.map(task => (
          <div key={task.id} className="l55-task">
            <div className="l55-task-header">
              <span className="l55-task-title">{task.title}</span>
              {checked && (
                <span className={`l55-task-badge ${results[task.id] ? 'l55-ok' : 'l55-err'}`}>
                  {results[task.id] ? '✓ Correct' : '✗ Try again'}
                </span>
              )}
            </div>
            <div className="l55-task-hint">💡 {task.hint}</div>
            <textarea
              className="l55-editor"
              value={codes[task.id]}
              onChange={e => setCodes(p=>({...p,[task.id]:e.target.value}))}
              placeholder={`-- Write your CREATE TABLE ${task.id} statement here`}
              rows={6}
              spellCheck={false}
            />
            {checked && !results[task.id] && (
              <div className="l55-solution-toggle">
                <button className="l55-show-btn" onClick={()=>setShow(p=>({...p,[task.id]:!p[task.id]}))}>
                  {show[task.id] ? 'Hide solution' : 'Show solution'}
                </button>
                {show[task.id] && <pre className="l55-solution">{task.solution}</pre>}
              </div>
            )}
          </div>
        ))}

        <button className="l55-check-btn" onClick={check}>{checked ? 'Check Again' : 'Check My SQL'}</button>
      </div>
    </Stage5Shell>
  );
}
