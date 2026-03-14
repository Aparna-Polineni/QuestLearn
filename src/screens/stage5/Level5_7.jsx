// src/screens/stage5/Level5_7.jsx — JOINs (FILL)
import { useState } from 'react';
import Stage5Shell from './Stage5Shell';
import './Level5_7.css';

const SUPPORT = {
  reveal: {
    concept: 'SQL JOINs',
    whatYouLearned: 'JOIN combines rows from two tables based on a matching column. INNER JOIN returns only matches. LEFT JOIN returns all left rows + matches. This is what JPQL does when you navigate @ManyToOne relationships.',
    realWorldUse: 'When your REST endpoint returns a patient WITH their ward details, JPA runs a JOIN behind the scenes. Understanding JOINs helps you debug slow queries and write efficient @Query JPQL.',
    developerSays: 'Default to INNER JOIN when you need matching data from both sides. Use LEFT JOIN when the related entity might not exist — like a patient with no assigned ward yet.',
  },
};

const BLANKS = {
  b1: { answer: 'INNER JOIN', hint: 'Returns only rows that match on both sides' },
  b2: { answer: 'ON',         hint: 'The keyword before the join condition' },
  b3: { answer: 'patients.ward_id', hint: 'The FK column in the patients table' },
  b4: { answer: 'wards.id',   hint: 'The PK column in the wards table' },
  b5: { answer: 'LEFT JOIN',  hint: 'Returns ALL patients, even those with no ward' },
};

const JOIN_TYPES = [
  { type:'INNER JOIN', def:'Only rows with a match in BOTH tables', example:'Patients who HAVE a ward' },
  { type:'LEFT JOIN',  def:'ALL rows from left + matching right (NULL if no match)', example:'All patients, ward can be NULL' },
  { type:'RIGHT JOIN', def:'ALL rows from right + matching left', example:'All wards, patient can be NULL' },
];

export default function Level5_7() {
  const [vals, setVals] = useState(Object.fromEntries(Object.keys(BLANKS).map(k=>[k,''])));
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState({});

  function check() {
    const r = {};
    Object.keys(BLANKS).forEach(k => { r[k] = vals[k].trim().toUpperCase() === BLANKS[k].answer.toUpperCase(); });
    setResults(r); setChecked(true);
  }
  const allCorrect = checked && Object.keys(BLANKS).every(k=>results[k]);
  const B = (key,w=120) => {
    const cls = !checked ? 'blank' : results[key] ? 'blank blank--ok' : 'blank blank--err';
    return <input style={{minWidth:w}} className={cls} value={vals[key]} placeholder="____" onChange={e=>setVals(p=>({...p,[key]:e.target.value}))} spellCheck={false}/>;
  };

  return (
    <Stage5Shell levelId={7} canProceed={allCorrect} conceptReveal={SUPPORT.reveal}>
      <div className="l57-container">
        <div className="l57-brief">
          <div className="l57-brief-tag">🐘 Stage 5 · Level 5.7 · FILL</div>
          <h2>JOINs — Combining Data From Multiple Tables</h2>
          <p>Relational data lives in separate tables. JOIN brings them together in a single query. When you access <code>patient.getWard().getName()</code> in Java, JPA runs a JOIN in SQL.</p>
        </div>

        <div className="l57-join-grid">
          {JOIN_TYPES.map(j => (
            <div key={j.type} className="l57-join-card">
              <code className="l57-jtype">{j.type}</code>
              <div className="l57-jdef">{j.def}</div>
              <div className="l57-jex">e.g. {j.example}</div>
            </div>
          ))}
        </div>

        <div className="l57-exercise">
          <div className="l57-ex-header"><span className="l57-ex-label">✏️ Fill in the blanks</span></div>
          <div className="l57-sql-block">
            <span className="cm">{'-- 1) Get patients WITH their ward name\n'}</span>
            <span className="kw">SELECT </span>
            <span className="col">patients.name</span><span className="op">, </span>
            <span className="col">patients.priority</span><span className="op">, </span>
            <span className="col">wards.name </span>
            <span className="kw">AS </span><span className="col">ward_name</span>
            <span className="op">{'\n'}</span>
            <span className="kw">FROM </span><span className="tbl">patients</span>
            <span className="op">{'\n'}</span>
            {B('b1',130)}<span className="op"> </span><span className="tbl">wards </span>
            {B('b2',50)}<span className="op"> </span>
            {B('b3',170)}<span className="op"> = </span>
            {B('b4',90)}<span className="op">{';\n\n'}</span>

            <span className="cm">{'-- 2) All patients even if ward not assigned yet\n'}</span>
            <span className="kw">SELECT </span><span className="col">patients.name</span><span className="op">, </span><span className="col">wards.name</span>
            <span className="op">{'\nFROM patients\n'}</span>
            {B('b5',120)}<span className="op"> wards </span>
            <span className="kw">ON </span><span className="col">patients.ward_id </span><span className="op">= </span><span className="col">wards.id</span><span className="op">;</span>
          </div>
          {checked && !allCorrect && (
            <div className="l57-hints">
              {Object.keys(BLANKS).filter(k=>!results[k]).map(k=>(
                <div key={k} className="l57-hint">💡 {BLANKS[k].hint}</div>
              ))}
            </div>
          )}
          <button className="l57-check-btn" onClick={check}>{checked?'Check Again':'Check My Answer'}</button>
        </div>

        <div className="l57-bridge">
          <span>🔗</span>
          <div>
            <div className="l57-bridge-title">JPQL equivalent</div>
            <div className="l57-bridge-text">
              <code>SELECT p FROM Patient p JOIN p.ward w WHERE w.name = :name</code> generates the INNER JOIN SQL above.
              JPA navigates object relationships — you write <code>p.ward</code>, not <code>JOIN patients ON patients.ward_id = wards.id</code>.
            </div>
          </div>
        </div>
      </div>
    </Stage5Shell>
  );
}
