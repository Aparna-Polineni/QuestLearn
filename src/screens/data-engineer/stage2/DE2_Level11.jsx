// src/screens/data-engineer/stage2/DE2_Level11.jsx — NoSQL — When & Why (FILL)
import { useState } from 'react';
import DE2Shell from './DE2Shell';

const BLANKS = [
  { id:'B1', answer:'MongoDB', hint:'Document store — flexible JSON-like schemas' },
  { id:'B2', answer:'Redis', hint:'In-memory key-value — caching, sessions, queues' },
  { id:'B3', answer:'Cassandra', hint:'Wide-column — massive write throughput, IoT, time-series' },
  { id:'B4', answer:'Elasticsearch', hint:'Full-text search and log analytics' },
  { id:'B5', answer:'CAP', hint:'Theorem: pick 2 of Consistency, Availability, Partition tolerance' },
  { id:'B6', answer:'eventual consistency', hint:'NoSQL trade-off: data converges to consistent state over time' },
];

const LINES = [
  '-- Choose the right database for the job',
  '',
  '-- [B1]: flexible schemas, nested JSON documents',
  '-- Good for: product catalogues, user profiles',
  '-- Bad for: complex joins, strict consistency',
  '',
  '-- [B2]: sub-millisecond reads, stored in memory',
  '-- Good for: caching, session storage, leaderboards',
  '-- Bad for: durable primary data storage',
  '',
  '-- [B3]: scales writes horizontally across nodes',
  '-- Good for: IoT sensor data, time-series, event logs',
  '-- Bad for: ad-hoc queries, complex aggregations',
  '',
  '-- [B4]: full-text search and log analytics',
  '-- Good for: search bars, Kibana dashboards',
  '',
  '-- [B5] theorem: distributed systems pick 2',
  '-- SQL: Consistent + Partition tolerant',
  '-- DynamoDB: Available + Partition tolerant ([B6])',
];

export default function DE2_Level11() {
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
    <DE2Shell levelId={11} canProceed={allCorrect}
      conceptReveal={[
        { label: 'Start With Postgres', detail: 'Postgres handles most use cases well: relational data, JSON columns, full-text search, time-series with TimescaleDB extension. Only reach for a specialist NoSQL database when you have a specific bottleneck Postgres cannot solve at your scale.' },
        { label: 'CAP Theorem in Practice', detail: 'During a network partition, you choose: stay consistent (reject writes until the partition heals) or stay available (accept writes that may diverge and converge later). Cassandra chooses availability. Postgres chooses consistency. Neither is wrong — it depends on the use case.' },
      ]}
    >
      <div className="de2-intro">
        <h1>NoSQL — When & Why</h1>
        <p className="de2-tagline">📦 SQL is the default. NoSQL is the exception — for good reasons.</p>
        <p className="de2-why">Choosing the wrong database costs months of migration work. MongoDB is not always better than Postgres — it depends entirely on the access patterns.</p>
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
