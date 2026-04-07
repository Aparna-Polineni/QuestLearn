// src/screens/data-engineer/stage2/DE2_Level9.jsx — Database Design & Normalisation (FILL)
import { useState } from 'react';
import DE2Shell from './DE2Shell';

const BLANKS = [
  { id:'B1', answer:'1NF', hint:'First Normal Form — atomic values, no repeating groups' },
  { id:'B2', answer:'2NF', hint:'Second Normal Form — no partial dependencies on composite PK' },
  { id:'B3', answer:'3NF', hint:'Third Normal Form — no transitive dependencies' },
  { id:'B4', answer:'primary key', hint:'Uniquely identifies each row in the table' },
  { id:'B5', answer:'foreign key', hint:'References the primary key of another table' },
  { id:'B6', answer:'denormalise', hint:'Add redundancy intentionally for query performance' },
];

const LINES = [
  '-- Normalisation: eliminate redundancy',
  '',
  '-- Bad: patient row stores ward name',
  '-- patient_id | name | ward_name | ward_floor',
  '-- If ward name changes update every patient row',
  '',
  '-- [B1]: each cell has one value, no arrays',
  '-- [B2]: all columns depend on the whole [B4]',
  '-- [B3]: no column depends on a non-key column',
  '',
  '-- Good: separate tables with [B5]s',
  '-- patients(id, name, ward_id)',
  '-- wards(id, name, floor)',
  '',
  '-- Exception: [B6] for the data warehouse',
  '-- Flat denormalised tables are faster for analytics',
];

export default function DE2_Level9() {
  const [vals, setVals] = useState({});
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState({});

  function check() {
    const r = {};
    BLANKS.forEach(b => {
      r[b.id] = (vals[b.id] || '').trim().toUpperCase() === b.answer.toUpperCase();
    });
    setCorrect(r);
    setChecked(true);
  }
  const allCorrect = checked && BLANKS.every(b => correct[b.id]);

  function renderLine(line, lineIdx) {
    if (line.startsWith('--')) {
      return <div key={lineIdx} style={{color:'#475569',fontStyle:'italic',padding:'1px 0'}}>{line}</div>;
    }
    if (!line.trim()) return <div key={lineIdx} style={{height:8}}/>;
    const parts = line.split(/(\[B\d\])/g);
    return (
      <div key={lineIdx} style={{padding:'1px 0',color:'#cbd5e1',whiteSpace:'pre-wrap'}}>
        {parts.map((p, pIdx) => {
          const m = p.match(/^\[B(\d)\]$/);
          if (!m) return <span key={pIdx}>{p}</span>;
          const bid = 'B' + m[1];
          const bl = BLANKS.find(b => b.id === bid);
          const st = !checked ? '' : correct[bid] ? 'correct' : 'incorrect';
          return (
            <input
              key={pIdx}
              className={`de2-blank ${st}`}
              value={vals[bid] || ''}
              onChange={e => setVals(v => ({ ...v, [bid]: e.target.value }))}
              placeholder={bl?.hint}
              style={{minWidth: 110, whiteSpace: 'normal'}}
            />
          );
        })}
      </div>
    );
  }

  return (
    <DE2Shell levelId={9} canProceed={allCorrect}
      conceptReveal={[
        { label: 'Star Schema is Denormalised on Purpose', detail: 'Data warehouses use star schema — a central fact table joined to flat dimension tables. Analysts query one or two JOINs instead of eight. The redundancy is acceptable because warehouses are read-heavy and storage is cheap.' },
        { label: 'Surrogate Keys', detail: 'Never use the source system ID as the warehouse primary key. Source IDs can change or conflict across systems. A surrogate key is a simple auto-increment integer the warehouse owns — stable and fast to join.' },
      ]}
    >
      <div className="de2-intro">
        <h1>Database Design & Normalisation</h1>
        <p className="de2-tagline">🏗️ Good design makes queries fast and updates safe.</p>
        <p className="de2-why">Bad schema design means update anomalies, duplicate data, and queries joining 8 tables. Normalisation prevents all of this.</p>
      </div>
      <div className="de2-panel">
        <div className="de2-panel-hdr">🗄️ SQL — fill the blanks</div>
        <div className="de2-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="de2-check-btn" onClick={check}>Check Answers</button>
      {checked && (
        <div className={`de2-feedback ${allCorrect ? 'success' : 'error'}`}>
          {allCorrect ? '✅ Correct!' : '❌ Check your answers.'}
        </div>
      )}
    </DE2Shell>
  );
}
