// src/screens/cyber-security/stage2/CY2_Level9.jsx — Firewalls (FILL)
import { useState } from 'react';
import CY2Shell from './CY2Shell';

const BLANKS = [
  { id:'B1', answer:'iptables',  hint:'Low-level Linux firewall rules tool' },
  { id:'B2', answer:'ufw',       hint:'Uncomplicated Firewall — friendlier interface for iptables' },
  { id:'B3', answer:'ACCEPT',    hint:'Allow the packet through' },
  { id:'B4', answer:'DROP',      hint:'Silently discard — attacker gets no response' },
  { id:'B5', answer:'REJECT',    hint:'Discard and send error response back to sender' },
  { id:'B6', answer:'--dport',   hint:'Match destination port in iptables rules' },
  { id:'B7', answer:'default deny', hint:'Block everything unless explicitly allowed' },
];

const LINES = [
  '# Firewall philosophy: [B7]',
  '# Block all traffic. Then allow only what you need.',
  '',
  '# ufw — simple interface (recommended for most servers)',
  '[B2] default deny incoming    # block all inbound by default',
  '[B2] default allow outgoing   # allow all outbound',
  '[B2] allow 22/tcp             # SSH',
  '[B2] allow 443/tcp            # HTTPS',
  '[B2] allow 80/tcp             # HTTP',
  '[B2] enable                   # activate rules',
  '[B2] status verbose           # show all rules',
  '',
  '# iptables — lower level, more control',
  '# Allow established connections',
  '[B1] -A INPUT -m state --state ESTABLISHED,RELATED -j [B3]',
  '',
  '# Allow SSH only from management IP',
  '[B1] -A INPUT -p tcp [B6] 22 -s 10.0.0.50 -j [B3]',
  '',
  '# Block everything else (at end of INPUT chain)',
  '[B1] -A INPUT -j [B4]       # silent drop vs [B5] (sends RST)',
  '',
  '# View current rules',
  '[B1] -L -n -v               # verbose, no DNS, all chains',
];

export default function CY2_Level9() {
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
          return <input key={i} className={`cy2-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:bid==='B7'?120:80,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <CY2Shell levelId={9} canProceed={allCorrect}
      conceptReveal={[
        { label:'DROP vs REJECT', detail:'DROP silently discards packets — the sender gets no response and must wait for a timeout. REJECT sends an error (TCP RST or ICMP port unreachable) immediately. For security, DROP is preferred: it slows port scans (attacker waits for timeouts) and reveals less information about your firewall rules.' },
        { label:'Always Allow Established First', detail:'iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT must come before your DROP rule. Without it, responses to outbound connections you initiated (web browsing, apt updates) will be blocked. You\'ll cut off your own server from the internet.' },
      ]}
    >
      <div className="cy2-intro">
        <h1>Firewalls & iptables</h1>
        <p className="cy2-tagline">🛡️ Default deny. Allow only what you need. Block everything else.</p>
        <p className="cy2-why">A server exposed to the internet with no firewall gets probed within minutes. Firewalls are the first line of defence — they reduce attack surface by ensuring only intended services are reachable.</p>
      </div>
      <div className="cy2-panel">
        <div className="cy2-panel-hdr">🛡️ Firewalls — fill the blanks</div>
        <div className="cy2-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="cy2-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`cy2-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Firewall rules mastered.':'❌ Check your answers.'}</div>}
    </CY2Shell>
  );
}
