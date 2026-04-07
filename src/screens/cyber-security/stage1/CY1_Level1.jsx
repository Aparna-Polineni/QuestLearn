// src/screens/cyber-security/stage1/CY1_Level1.jsx — CIA Triad (FILL)
import { useState } from 'react';
import CY1Shell from './CY1Shell';

const BLANKS = [
  { id:'B1', answer:'Confidentiality', hint:'Data is only seen by authorised people' },
  { id:'B2', answer:'Integrity',       hint:'Data has not been tampered with' },
  { id:'B3', answer:'Availability',    hint:'Systems are accessible when needed' },
  { id:'B4', answer:'encryption',      hint:'Scrambles data so only authorised parties can read it' },
  { id:'B5', answer:'hashing',         hint:'One-way transformation — verifies data hasn\'t changed' },
  { id:'B6', answer:'DDoS',            hint:'Distributed Denial of Service — floods server with traffic' },
  { id:'B7', answer:'MFA',             hint:'Multi-Factor Authentication — something you know + have + are' },
];

const LINES = [
  '# The CIA Triad — foundation of all security controls',
  '',
  '# [B1] — data seen only by authorised users',
  '# Threat: data breach, eavesdropping, insider threat',
  '# Control: [B4], access control, least privilege',
  '# Example: patient records encrypted at rest and in transit',
  '',
  '# [B2] — data has not been altered',
  '# Threat: man-in-the-middle attack, malicious modification',
  '# Control: digital signatures, [B5] (SHA-256 checksums)',
  '# Example: software download hash verification',
  '',
  '# [B3] — systems accessible when needed',
  '# Threat: [B6] attack, ransomware, hardware failure',
  '# Control: redundancy, backups, incident response plan',
  '# Example: hospital systems must be up 24/7',
  '',
  '# [B7] — protects all three pillars',
  '# Even if password is stolen (Confidentiality breach),',
  '# attacker still can\'t login without the second factor',
];

export default function CY1_Level1() {
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
          return <input key={i} className={`cy1-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:110,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <CY1Shell levelId={1} canProceed={allCorrect}
      conceptReveal={[
        { label:'Every Attack Maps to CIA', detail:'Ransomware: Availability (files encrypted, system unusable) + Confidentiality (data exfiltrated before encryption). SQL injection: Confidentiality (data stolen) + Integrity (data modified). Phishing: Confidentiality (credentials stolen). Use CIA to categorise any incident.' },
        { label:'Least Privilege', detail:'Users and systems should only have the minimum permissions needed to do their job. An HR employee shouldn\'t have read access to source code. A web server shouldn\'t have write access to the database. Least privilege limits the blast radius of any breach.' },
      ]}
      prevLevelContext="In the last level you assessed a system using the CIA triad. Now you\'ll apply STRIDE — a structured framework for finding every category of threat before an attacker does."
      cumulativeSkills={[
        "Applied the CIA triad to evaluate a hospital system's security posture",
        "Built a STRIDE threat model identifying spoofing, tampering, and escalation risks",
      ]}
    >
      <div className="cy1-intro">
        <h1>CIA Triad</h1>
        <p className="cy1-tagline">🔐 Every security control maps to Confidentiality, Integrity, or Availability.</p>
        <p className="cy1-why">CIA is the lens every security professional uses to evaluate risks and controls. When a new attack emerges, the first question is: which pillar does it attack?</p>
      </div>
      <table className="cy1-table">
        <thead><tr><th>Pillar</th><th>Threat Example</th><th>Control Example</th></tr></thead>
        <tbody>
          {[['Confidentiality','Data breach, eavesdropping','Encryption, access control'],['Integrity','Man-in-the-middle, tampering','Hashing, digital signatures'],['Availability','DDoS, ransomware','Redundancy, backups, DR plan']].map(([p,t,c],i)=>(
            <tr key={i}><td style={{color:'#10b981',fontWeight:600}}>{p}</td><td style={{color:'#f87171',fontSize:12}}>{t}</td><td style={{color:'#4ade80',fontSize:12}}>{c}</td></tr>
          ))}
        </tbody>
      </table>
      <div className="cy1-panel">
        <div className="cy1-panel-hdr">🔐 CIA Triad — fill the blanks</div>
        <div className="cy1-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="cy1-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`cy1-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ CIA Triad mastered — the lens for every security decision.':'❌ Check your answers.'}</div>}
    </CY1Shell>
  );
}
