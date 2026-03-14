// src/screens/stage5/Level5_6.jsx — Foreign Keys & Relationships (FILL)
import { useState } from 'react';
import Stage5Shell from './Stage5Shell';
import './Level5_6.css';

const SUPPORT = {
  reveal: {
    concept: 'Foreign Keys',
    whatYouLearned: 'A FOREIGN KEY is a column in one table that references the PRIMARY KEY of another. It creates a relationship. If the referenced row doesn\'t exist, the DB rejects the insert — referential integrity.',
    realWorldUse: 'In Stage 4, @ManyToOne Patient→Ward creates a ward_id column in the patients table that is a foreign key to wards.id. JPA writes the FOREIGN KEY constraint automatically.',
    developerSays: 'Foreign keys enforce consistency at the database level — not just in your Java code. Even if a bug bypasses your service layer, the DB will refuse orphaned records.',
  },
};

const BLANKS = {
  b1: { answer: 'ward_id',      hint: 'Convention: related_table_id' },
  b2: { answer: 'BIGINT',       hint: 'Must match the PK type of the referenced table' },
  b3: { answer: 'FOREIGN KEY',  hint: 'Two words that declare the relationship' },
  b4: { answer: 'ward_id',      hint: 'The column in THIS table that holds the reference' },
  b5: { answer: 'REFERENCES',   hint: 'Points to another table' },
  b6: { answer: 'wards',        hint: 'The parent table being referenced' },
  b7: { answer: 'id',           hint: 'The primary key column of the parent table' },
};

export default function Level5_6() {
  const [vals, setVals] = useState(Object.fromEntries(Object.keys(BLANKS).map(k=>[k,''])));
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState({});

  function check() {
    const r = {};
    Object.keys(BLANKS).forEach(k => { r[k] = vals[k].trim().toUpperCase() === BLANKS[k].answer.toUpperCase(); });
    setResults(r); setChecked(true);
  }
  const allCorrect = checked && Object.keys(BLANKS).every(k=>results[k]);
  const B = (key,w=100) => {
    const cls = !checked ? 'blank' : results[key] ? 'blank blank--ok' : 'blank blank--err';
    return <input style={{minWidth:w}} className={cls} value={vals[key]} placeholder="____" onChange={e=>setVals(p=>({...p,[key]:e.target.value}))} spellCheck={false}/>;
  };

  return (
    <Stage5Shell levelId={6} canProceed={allCorrect} conceptReveal={SUPPORT.reveal}>
      <div className="l56-container">
        <div className="l56-brief">
          <div className="l56-brief-tag">🐘 Stage 5 · Level 5.6 · FILL</div>
          <h2>Foreign Keys — Linking Tables Together</h2>
          <p>A foreign key connects a column in one table to the primary key of another. This is the SQL behind <code>@ManyToOne</code> — many patients belong to one ward.</p>
        </div>

        <div className="l56-diagram">
          <div className="l56-table-box">
            <div className="l56-tbl-name">wards</div>
            <div className="l56-tbl-col pk">🔑 id BIGINT PK</div>
            <div className="l56-tbl-col">name VARCHAR</div>
            <div className="l56-tbl-col">capacity INT</div>
          </div>
          <div className="l56-arrow">←FK</div>
          <div className="l56-table-box">
            <div className="l56-tbl-name">patients</div>
            <div className="l56-tbl-col pk">🔑 id BIGINT PK</div>
            <div className="l56-tbl-col">name VARCHAR</div>
            <div className="l56-tbl-col fk">🔗 ward_id BIGINT FK</div>
          </div>
        </div>

        <div className="l56-exercise">
          <div className="l56-ex-header"><span className="l56-ex-label">✏️ Add ward_id FK to the patients table</span></div>
          <div className="l56-sql-block">
            <span className="kw">CREATE TABLE </span><span className="tbl">patients </span><span className="op">{'(\n'}</span>
            <span className="op">{'  '}</span><span className="col">id</span><span className="op">       </span><span className="typ">BIGINT</span><span className="op">       </span><span className="kw">PRIMARY KEY AUTO_INCREMENT</span><span className="op">{',\n'}</span>
            <span className="op">{'  '}</span><span className="col">name</span><span className="op">     </span><span className="typ">VARCHAR(100)</span><span className="op"> </span><span className="kw">NOT NULL</span><span className="op">{',\n'}</span>
            <span className="op">{'  '}</span><span className="col">priority</span><span className="op"> </span><span className="typ">INT</span><span className="op">         </span><span className="kw">NOT NULL DEFAULT 0</span><span className="op">{',\n'}</span>
            <span className="op">{'  '}</span>
            {B('b1',110)}<span className="op"> </span>{B('b2',80)}<span className="op">{',            '}</span>
            <span className="cm">{'-- FK column\n'}</span>
            <span className="op">{'  '}</span>
            <span className="kw">CONSTRAINT </span><span className="col">fk_ward </span>
            {B('b3',130)}<span className="op"> {'('}</span>{B('b4',90)}<span className="op">)</span><span className="op">{'\n    '}</span>
            {B('b5',120)}<span className="op"> </span>
            {B('b6',80)}<span className="op"> {'('}</span>{B('b7',50)}<span className="op">)</span>
            <span className="op">{'\n);'}</span>
          </div>
          {checked && !allCorrect && (
            <div className="l56-hints">
              {Object.keys(BLANKS).filter(k=>!results[k]).map(k=>(
                <div key={k} className="l56-hint">💡 {BLANKS[k].hint}</div>
              ))}
            </div>
          )}
          <button className="l56-check-btn" onClick={check}>{checked?'Check Again':'Check My Answer'}</button>
        </div>

        <div className="l56-bridge">
          <span>🔗</span>
          <div>
            <div className="l56-bridge-title">@ManyToOne = FOREIGN KEY</div>
            <div className="l56-bridge-text">
              <code>@ManyToOne Ward ward;</code> in your Patient entity creates <code>ward_id BIGINT FOREIGN KEY REFERENCES wards(id)</code> automatically.
              The column name can be customised with <code>@JoinColumn(name="ward_id")</code>.
            </div>
          </div>
        </div>
      </div>
    </Stage5Shell>
  );
}
