// src/screens/stage5/Level5_1.jsx — CREATE TABLE & Data Types (FILL)
import { useState } from 'react';
import Stage5Shell from './Stage5Shell';
import './Level5_1.css';

const SUPPORT = {
  reveal: {
    concept: 'CREATE TABLE',
    whatYouLearned: 'CREATE TABLE defines a table\'s structure. Every column has a name and a data type. Constraints like NOT NULL and DEFAULT enforce data quality at the database level.',
    realWorldUse: 'Every table in your hospital system starts here. When JPA sees @Entity Patient, it generates exactly this SQL to create the patients table on first startup.',
    developerSays: 'Always define NOT NULL on columns that must have values. A NULL sneaking into your DB causes NullPointerExceptions in Java — defend at the database layer too.',
  },
};

const BLANKS = {
  b1: { answer: 'CREATE TABLE', hint: 'Two words: CREATE ___' },
  b2: { answer: 'INT',          hint: 'Whole numbers — short for INTEGER' },
  b3: { answer: 'PRIMARY KEY',  hint: 'Uniquely identifies each row' },
  b4: { answer: 'AUTO_INCREMENT', hint: 'MySQL fills this number automatically' },
  b5: { answer: 'VARCHAR(100)', hint: 'Variable-length text, max 100 chars' },
  b6: { answer: 'NOT NULL',     hint: 'This column must always have a value' },
  b7: { answer: 'BOOLEAN',      hint: 'true/false — maps to Java boolean' },
  b8: { answer: 'DEFAULT FALSE', hint: 'Use the keyword DEFAULT then the value' },
};

const TYPE_ROWS = [
  { type:'INT',          java:'int / Integer',   use:'IDs, ages, counts' },
  { type:'BIGINT',       java:'long / Long',     use:'Large IDs (Twitter-scale)' },
  { type:'VARCHAR(n)',   java:'String',           use:'Names, emails, short text' },
  { type:'TEXT',         java:'String',           use:'Long descriptions, notes' },
  { type:'BOOLEAN',      java:'boolean / Boolean',use:'Flags — active, isAdmin' },
  { type:'DATE',         java:'LocalDate',        use:'Birthdays, admission dates' },
  { type:'DATETIME',     java:'LocalDateTime',    use:'Timestamps, audit logs' },
  { type:'DECIMAL(p,s)', java:'BigDecimal',       use:'Money, precise numbers' },
];

export default function Level5_1() {
  const [vals, setVals] = useState({ b1:'',b2:'',b3:'',b4:'',b5:'',b6:'',b7:'',b8:'' });
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState({});

  function check() {
    const r = {};
    Object.keys(BLANKS).forEach(k => {
      r[k] = vals[k].trim().toUpperCase() === BLANKS[k].answer.toUpperCase();
    });
    setResults(r);
    setChecked(true);
  }

  const allCorrect = checked && Object.keys(BLANKS).every(k => results[k]);

  return (
    <Stage5Shell levelId={1} canProceed={allCorrect} conceptReveal={SUPPORT.reveal}>
      <div className="l51-container">

        <div className="l51-brief">
          <div className="l51-brief-tag">🐘 Stage 5 · Level 5.1 · FILL</div>
          <h2>CREATE TABLE — Defining Your Database Structure</h2>
          <p>Before you can store any data, you tell MySQL <em>what shape</em> it has. This is the SQL that JPA runs when your Spring Boot app starts with <code>spring.jpa.hibernate.ddl-auto=create</code>.</p>
        </div>

        {/* Data types reference */}
        <div className="l51-anatomy">
          <div className="l51-anat-header">🔑 SQL Data Types → Java Equivalents</div>
          <div className="l51-type-table">
            <div className="l51-type-head">
              <span>SQL Type</span><span>Java Type</span><span>Use For</span>
            </div>
            {TYPE_ROWS.map(r => (
              <div key={r.type} className="l51-type-row">
                <code className="l51-sql-type">{r.type}</code>
                <code className="l51-java-type">{r.java}</code>
                <span className="l51-use">{r.use}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fill exercise */}
        <div className="l51-exercise">
          <div className="l51-ex-header">
            <span className="l51-ex-label">✏️ Fill in the blanks — CREATE TABLE patients</span>
          </div>
          <div className="l51-sql-block">
            <span className="kw">{renderBlank('b1', vals, setVals, results, checked)}</span>
            <span className="tbl"> patients </span>
            <span className="op">{'(\n'}</span>

            {'  '}<span className="col">id</span>
            {'          '}
            {renderBlank('b2', vals, setVals, results, checked)}
            {'          '}
            {renderBlank('b3', vals, setVals, results, checked)}
            {'  '}
            {renderBlank('b4', vals, setVals, results, checked)}
            {',\n'}

            {'  '}<span className="col">name</span>
            {'        '}
            {renderBlank('b5', vals, setVals, results, checked)}
            {'  '}
            {renderBlank('b6', vals, setVals, results, checked)}
            {',\n'}

            {'  '}<span className="col">ward</span>
            {'        '}
            <span className="typ">VARCHAR(50)</span>
            {'        '}
            <span className="kw">NOT NULL</span>
            {',\n'}

            {'  '}<span className="col">priority</span>
            {'     '}
            <span className="typ">INT</span>
            {'             '}
            <span className="kw">NOT NULL</span>
            {'             '}
            <span className="kw">DEFAULT 0</span>
            {',\n'}

            {'  '}<span className="col">active</span>
            {'       '}
            {renderBlank('b7', vals, setVals, results, checked)}
            {'       '}
            {renderBlank('b8', vals, setVals, results, checked)}
            {'\n'}

            <span className="op">{');'}</span>
          </div>

          {checked && !allCorrect && (
            <div className="l51-hints">
              {Object.keys(BLANKS).filter(k => !results[k]).map(k => (
                <div key={k} className="l51-hint">💡 {BLANKS[k].hint}</div>
              ))}
            </div>
          )}

          <button className="l51-check-btn" onClick={check}>
            {checked ? 'Check Again' : 'Check My Answer'}
          </button>
        </div>

        <div className="l51-bridge">
          <span className="l51-bridge-icon">🔗</span>
          <div>
            <div className="l51-bridge-title">How JPA maps this</div>
            <div className="l51-bridge-text">When you annotate a class with <code>@Entity</code>, Hibernate reads its fields and generates exactly this SQL. <code>id INT PRIMARY KEY AUTO_INCREMENT</code> comes from <code>@Id @GeneratedValue(strategy=AUTO)</code>. You'll build this connection in levels 5.12–5.13.</div>
          </div>
        </div>
      </div>
    </Stage5Shell>
  );
}

function renderBlank(key, vals, setVals, results, checked) {
  const cls = !checked ? 'blank' : results[key] ? 'blank blank--ok' : 'blank blank--err';
  return (
    <input
      key={key}
      className={cls}
      value={vals[key]}
      placeholder="____"
      onChange={e => setVals(p => ({ ...p, [key]: e.target.value }))}
      spellCheck={false}
    />
  );
}
