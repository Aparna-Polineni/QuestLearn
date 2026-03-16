// src/screens/data-engineer/stage1/DE1_Level4.jsx — Batch vs Streaming (FILL)
import { useState } from 'react';
import DE1Shell from './DE1Shell';

const BLANKS = [
  { id:'B1', answer:'batch',    hint:'Process large chunks of data on a schedule' },
  { id:'B2', answer:'latency',  hint:'How long between data arriving and being available' },
  { id:'B3', answer:'streaming',hint:'Process each event as it arrives in real time' },
  { id:'B4', answer:'Kafka',    hint:'The most popular real-time message queue / event bus' },
  { id:'B5', answer:'window',   hint:'Group streaming events by time (e.g. last 5 minutes)' },
  { id:'B6', answer:'lambda',   hint:'Architecture combining batch (accurate) + stream (fast)' },
];

const LINES = [
  '# [B1] Processing — scheduled, large chunks',
  '# Run nightly, process yesterday\'s data',
  '# High [B2] (hours) — acceptable for daily reports',
  'airflow_dag.schedule = "0 2 * * *"  # 2am every night',
  '',
  '# [B3] Processing — event-by-event, real time',
  '# Process each order AS it happens',
  '# Low latency (milliseconds) — required for fraud detection',
  'consumer = [B4]Consumer(["order-events"])',
  'for message in consumer:',
  '    detect_fraud(message.value)',
  '',
  '# [B5] aggregations — group events by time',
  '# Count orders in the last 5 minutes',
  'SELECT COUNT(*) FROM orders',
  'WHERE order_time > NOW() - INTERVAL 5 MINUTE',
  '',
  '# [B6] architecture — best of both worlds',
  '# Batch layer: accurate historical data (runs nightly)',
  '# Speed layer: approximate real-time data (runs constantly)',
  '# Serving layer: merges both for queries',
];

export default function DE1_Level4() {
  const [vals, setVals] = useState({});
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState({});

  function check() {
    const r = {};
    BLANKS.forEach(b => { r[b.id]=(vals[b.id]||'').trim().toLowerCase()===b.answer.toLowerCase(); });
    setCorrect(r); setChecked(true);
  }
  const allCorrect = checked && BLANKS.every(b => correct[b.id]);

  function renderLine(line, idx) {
    if (line.startsWith('#')) return <div key={idx} style={{color:'#475569',fontStyle:'italic',padding:'1px 0'}}>{line}</div>;
    if (!line.trim()) return <div key={idx} style={{height:8}}/>;
    const parts = line.split(/(\[B\d\])/g);
    return (
      <div key={idx} style={{padding:'1px 0',color:'#cbd5e1',whiteSpace:'pre-wrap'}}>
        {parts.map((p,i)=>{
          const m=p.match(/^\[B(\d)\]$/); if(!m) return <span key={i}>{p}</span>;
          const bid='B'+m[1]; const bl=BLANKS.find(b=>b.id===bid);
          const st=!checked?'':correct[bid]?'correct':'incorrect';
          return <input key={i} className={`de1-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:90,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <DE1Shell levelId={4} canProceed={allCorrect}
      conceptReveal={[
        { label:'When to Use Batch vs Streaming', detail:'Batch: daily reports, ML training, large historical loads — latency is OK. Streaming: fraud detection, live dashboards, inventory updates, real-time recommendations — latency must be low. Most companies use both.' },
        { label:'Kafka in One Line', detail:'Kafka is a distributed log — producers write events to topics, consumers read them. Events are retained for a configurable period (days/weeks). Multiple consumers can read the same events independently. Stage 6 covers Kafka in depth.' },
      ]}
    >
      <div className="de1-intro">
        <h1>Batch vs Streaming</h1>
        <p className="de1-tagline">⏱️ Nightly reports or real-time fraud alerts — two different tools.</p>
        <p className="de1-why">Choosing batch vs streaming is the first architectural decision in any data project. Wrong choice = either wasted complexity (streaming when batch was fine) or unusable latency (batch when real-time was needed).</p>
      </div>
      <table className="de1-table">
        <thead><tr><th>Aspect</th><th>Batch</th><th>Streaming</th></tr></thead>
        <tbody>
          {[['Latency','Hours / daily','Milliseconds'],['Volume','Large chunks','One event at a time'],['Complexity','Simple','Higher'],['Tools','Airflow, Spark','Kafka, Flink, Spark Streaming'],['Use case','Reports, ML training','Fraud, live dashboards']].map(([a,b,s],i)=>(
            <tr key={i}><td style={{color:'#06b6d4',fontWeight:600}}>{a}</td><td style={{color:'#94a3b8'}}>{b}</td><td style={{color:'#94a3b8'}}>{s}</td></tr>
          ))}
        </tbody>
      </table>
      <div className="de1-panel">
        <div className="de1-panel-hdr">🐍 Batch vs Streaming — fill the blanks</div>
        <div className="de1-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="de1-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`de1-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ You can now choose the right processing model for any use case.':'❌ Check your answers.'}</div>}
    </DE1Shell>
  );
}
