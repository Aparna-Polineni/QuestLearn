// src/screens/stage5/Level5_11.jsx — Indexes (FILL)
import { useState } from 'react';
import Stage5Shell from './Stage5Shell';
import './Level5_11.css';

const SUPPORT = {
  reveal: {
    concept: 'Database Indexes',
    whatYouLearned: 'An index is a sorted data structure that lets MySQL find rows without scanning the whole table. Like a book index — go straight to the page instead of reading every page. The trade-off: indexes speed up reads but slow down writes.',
    realWorldUse: 'findByWard() on a patients table with 1 million rows is instant with an index, 2 seconds without. Spring Data @Column(index=true) or @Index on @Table creates these automatically.',
    developerSays: 'Index columns you filter or join on frequently. Don\'t index everything — each index costs write performance. Primary keys are indexed automatically. Foreign keys should almost always have an index.',
  },
};

const BLANKS = {
  b1: { answer: 'CREATE INDEX',  hint: 'Two words to create an index' },
  b2: { answer: 'idx_ward',      hint: 'Index name convention: idx_columnname' },
  b3: { answer: 'ON',            hint: 'Tells MySQL which table+column to index' },
  b4: { answer: 'patients',      hint: 'The table being indexed' },
  b5: { answer: 'ward',          hint: 'The column being indexed' },
  b6: { answer: 'CREATE UNIQUE INDEX', hint: 'Three words — like CREATE INDEX but enforces no duplicates' },
};

export default function Level5_11() {
  const [vals, setVals] = useState(Object.fromEntries(Object.keys(BLANKS).map(k=>[k,''])));
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState({});

  function check() {
    const r = {};
    Object.keys(BLANKS).forEach(k => { r[k] = vals[k].trim().toUpperCase() === BLANKS[k].answer.toUpperCase(); });
    setResults(r); setChecked(true);
  }
  const allCorrect = checked && Object.keys(BLANKS).every(k=>results[k]);
  const B = (key,w=140) => {
    const cls = !checked ? 'blank' : results[key] ? 'blank blank--ok' : 'blank blank--err';
    return <input style={{minWidth:w}} className={cls} value={vals[key]} placeholder="____" onChange={e=>setVals(p=>({...p,[key]:e.target.value}))} spellCheck={false}/>;
  };

  return (
    <Stage5Shell levelId={11} canProceed={allCorrect} conceptReveal={SUPPORT.reveal}>
      <div className="l511-container">
        <div className="l511-brief">
          <div className="l511-brief-tag">🐘 Stage 5 · Level 5.11 · FILL</div>
          <h2>Indexes — Making Queries Fast</h2>
          <p>Without an index, MySQL reads every row to find matches. With an index on the right column, it jumps directly to the result. This is the difference between milliseconds and seconds at scale.</p>
        </div>

        <div className="l511-compare">
          <div className="l511-ccard l511-slow">
            <div className="l511-clabel">⚡ No index — 1M rows</div>
            <code>Full table scan — reads every row</code>
            <div className="l511-ctime">~2,000ms</div>
          </div>
          <div className="l511-ccard l511-fast">
            <div className="l511-clabel">⚡ With index on ward</div>
            <code>B-tree lookup — jumps to matches</code>
            <div className="l511-ctime">~1ms</div>
          </div>
        </div>

        <div className="l511-exercise">
          <div className="l511-ex-header"><span className="l511-ex-label">✏️ Fill in the blanks</span></div>
          <div className="l511-sql-block">
            <span className="cm">{'-- 1) Index the ward column — common filter\n'}</span>
            {B('b1',150)}<span className="op"> </span>{B('b2',110)}<span className="op">{'\n  '}</span>
            {B('b3',50)}<span className="op"> </span>{B('b4',90)}<span className="op"> {'('}</span>{B('b5',80)}<span className="op">{');\n\n'}</span>

            <span className="cm">{'-- 2) Unique index — no duplicate emails\n'}</span>
            {B('b6',200)}<span className="op"> idx_email</span><span className="op">{'\n  ON patients (email);\n\n'}</span>

            <span className="cm">{'-- 3) Composite index — common combined filter\n'}</span>
            <span className="kw">CREATE INDEX </span><span className="op">idx_ward_priority</span>
            <span className="op">{'\n  ON patients (ward, priority);\n'}</span>
          </div>
          {checked && !allCorrect && (
            <div className="l511-hints">
              {Object.keys(BLANKS).filter(k=>!results[k]).map(k=>(
                <div key={k} className="l511-hint">💡 {BLANKS[k].hint}</div>
              ))}
            </div>
          )}
          <button className="l511-check-btn" onClick={check}>{checked?'Check Again':'Check My Answer'}</button>
        </div>

        <div className="l511-rules">
          <div className="l511-rules-title">When to add an index</div>
          {[
            ['✓ Add index', 'Columns in WHERE, JOIN ON, or ORDER BY clauses'],
            ['✓ Add index', 'Foreign key columns (ward_id, doctor_id)'],
            ['✗ Skip index', 'Columns rarely used in queries'],
            ['✗ Skip index', 'Boolean or low-cardinality columns (active: true/false)'],
          ].map(([tag,note],i)=>(
            <div key={i} className="l511-rule">
              <span className={`l511-rtag ${tag.startsWith('✓')?'ok':'skip'}`}>{tag}</span>
              <span className="l511-rnote">{note}</span>
            </div>
          ))}
        </div>
      </div>
    </Stage5Shell>
  );
}
