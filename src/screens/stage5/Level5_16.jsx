// src/screens/stage5/Level5_16.jsx — @Query with JPQL (BUILD)
import { useState } from 'react';
import Stage5Shell from './Stage5Shell';
import './Level5_16.css';

const SUPPORT = {
  reveal: {
    concept: '@Query with JPQL',
    whatYouLearned: '@Query lets you write custom queries using JPQL — Java Persistence Query Language. JPQL uses entity class names and field names, not table/column names. It\'s database-agnostic SQL.',
    realWorldUse: 'When derived method names get too complex, or you need aggregates or JOINs, @Query is the answer. You wrote these in Stage 4 — now you understand the SQL behind them.',
    developerSays: 'JPQL is almost identical to SQL but uses class/field names. "FROM Patient p" not "FROM patients". "p.ward" not "p.ward_id". If JPQL can\'t express it, use nativeQuery=true — but that\'s rare.',
  },
};

const TASKS = [
  {
    id: 'active_ward',
    title: 'Find active patients in a specific ward',
    hint: 'SELECT p FROM Patient p WHERE p.ward = :ward AND p.active = true',
    check: (v) => {
      const u = v.toUpperCase();
      return u.includes('@QUERY') && u.includes('FROM PATIENT') &&
             u.includes('P.WARD') && (u.includes(':WARD') || u.includes('?1')) &&
             u.includes('ACTIVE');
    },
    solution: `@Query("SELECT p FROM Patient p WHERE p.ward = :ward AND p.active = true")\nList<Patient> findActiveByWard(@Param("ward") String ward);`,
  },
  {
    id: 'count_ward',
    title: 'Count patients per ward (return a list of [ward, count])',
    hint: 'Use SELECT p.ward, COUNT(p) FROM Patient p GROUP BY p.ward',
    check: (v) => {
      const u = v.toUpperCase();
      return u.includes('@QUERY') && u.includes('COUNT') && u.includes('GROUP BY');
    },
    solution: `@Query("SELECT p.ward, COUNT(p) FROM Patient p GROUP BY p.ward")\nList<Object[]> countByWard();`,
  },
  {
    id: 'search',
    title: 'Search patients by partial name (case insensitive)',
    hint: 'Use LOWER(p.name) LIKE LOWER(CONCAT(\'%\', :keyword, \'%\'))',
    check: (v) => {
      const u = v.toUpperCase();
      return u.includes('@QUERY') && u.includes('LOWER') && u.includes('LIKE');
    },
    solution: `@Query("SELECT p FROM Patient p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")\nList<Patient> searchByName(@Param("keyword") String keyword);`,
  },
];

export default function Level5_16() {
  const [codes, setCodes] = useState(Object.fromEntries(TASKS.map(t=>[t.id,''])));
  const [results, setResults] = useState({});
  const [checked, setChecked] = useState(false);
  const [show, setShow] = useState({});

  function check() {
    const r = {};
    TASKS.forEach(t => { r[t.id] = t.check(codes[t.id]); });
    setResults(r); setChecked(true);
  }
  const allCorrect = checked && TASKS.every(t=>results[t.id]);

  return (
    <Stage5Shell levelId={16} canProceed={allCorrect} conceptReveal={SUPPORT.reveal}>
      <div className="l516-container">
        <div className="l516-brief">
          <div className="l516-brief-tag">🐘 Stage 5 · Level 5.16 · BUILD</div>
          <h2>@Query — Custom JPQL When Derived Methods Aren't Enough</h2>
          <p>Derived method names have limits. <code>@Query</code> lets you write full JPQL — the JPA dialect of SQL that uses Java class and field names instead of table/column names.</p>
        </div>

        <div className="l516-ref">
          <div className="l516-ref-label">SQL vs JPQL</div>
          <div className="l516-compare">
            <div><div className="l516-lang">SQL</div>
              {[['FROM patients','Table name'],['WHERE ward_id = ?','Column name'],['JOIN wards ON ...','SQL JOIN']].map(([c,n])=>(
                <div key={c} className="l516-row"><code>{c}</code><span>{n}</span></div>
              ))}
            </div>
            <div><div className="l516-lang jpa">JPQL</div>
              {[['FROM Patient p','Entity class name'],['WHERE p.ward = :w','Field name'],['JOIN p.ward w','Object navigation']].map(([c,n])=>(
                <div key={c} className="l516-row"><code>{c}</code><span>{n}</span></div>
              ))}
            </div>
          </div>
        </div>

        {TASKS.map(task => (
          <div key={task.id} className="l516-task">
            <div className="l516-task-header">
              <span className="l516-task-title">{task.title}</span>
              {checked && <span className={`l516-badge ${results[task.id]?'ok':'err'}`}>{results[task.id]?'✓ Correct':'✗ Try again'}</span>}
            </div>
            <div className="l516-task-hint">💡 {task.hint}</div>
            <textarea className="l516-editor" value={codes[task.id]}
              onChange={e=>setCodes(p=>({...p,[task.id]:e.target.value}))}
              placeholder={'@Query("...")\nReturnType methodName(...);'}
              rows={4} spellCheck={false} />
            {checked && !results[task.id] && (
              <>
                <button className="l516-show-btn" onClick={()=>setShow(p=>({...p,[task.id]:!p[task.id]}))}>
                  {show[task.id]?'Hide solution':'Show solution'}
                </button>
                {show[task.id] && <pre className="l516-solution">{task.solution}</pre>}
              </>
            )}
          </div>
        ))}

        <button className="l516-check-btn" onClick={check}>{checked?'Check Again':'Check My @Query'}</button>
      </div>
    </Stage5Shell>
  );
}
