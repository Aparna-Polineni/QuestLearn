// src/screens/data-engineer/stage2/DE2_Level10.jsx — Transactions & ACID (FILL)
import { useState } from 'react';
import DE2Shell from './DE2Shell';

const BLANKS = [
  { id:'B1', answer:'BEGIN', hint:'Start a transaction block' },
  { id:'B2', answer:'COMMIT', hint:'Save all changes in the transaction permanently' },
  { id:'B3', answer:'ROLLBACK', hint:'Undo all changes since BEGIN' },
  { id:'B4', answer:'Atomicity', hint:'All steps succeed or none — no partial results' },
  { id:'B5', answer:'Isolation', hint:'Transactions do not see each other in-progress changes' },
  { id:'B6', answer:'SAVEPOINT', hint:'Named checkpoint to partially roll back within a transaction' },
];

const LINES = [
  '-- Transfer patient between wards atomically',
  '[B1];',
  '  UPDATE patients SET ward_id = 2 WHERE id = 42;',
  '  UPDATE wards SET capacity = capacity - 1 WHERE id = 1;',
  '  UPDATE wards SET capacity = capacity + 1 WHERE id = 2;',
  '[B2]; -- All 3 succeed together, or:',
  '[B3]; -- All 3 are undone if anything fails',
  '',
  '-- ACID properties:',
  '-- [B4]: all steps succeed or none do',
  '-- Consistency: FK and CHECK rules always hold',
  '-- [B5]: transactions run as if alone',
  '-- Durability: committed data survives crashes',
  '',
  '-- Partial rollback with [B6]:',
  '-- BEGIN; INSERT ...; [B6] sp1; UPDATE ...; ROLLBACK TO sp1; COMMIT;',
];

export default function DE2_Level10() {
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
    <DE2Shell levelId={10} canProceed={allCorrect}
      conceptReveal={[
        { label: 'Why Pipelines Need Transactions', detail: 'An ETL job that inserts 100,000 rows and fails at row 50,000 without transactions leaves 50,000 orphaned rows. Wrap bulk operations in a transaction — either all rows land cleanly or none do. ON CONFLICT DO NOTHING makes re-runs idempotent.' },
        { label: 'ACID in NoSQL', detail: 'Traditional NoSQL databases sacrificed ACID for scale. Modern NoSQL (MongoDB 4+, DynamoDB Transactions) has added multi-document transactions. Cassandra still does not support multi-row transactions — design your data model accordingly.' },
      ]}
    >
      <div className="de2-intro">
        <h1>Transactions & ACID</h1>
        <p className="de2-tagline">🔒 All-or-nothing operations. Data stays consistent.</p>
        <p className="de2-why">Without transactions, a pipeline crash halfway through leaves data in a corrupt state. ACID guarantees all-or-nothing.</p>
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
