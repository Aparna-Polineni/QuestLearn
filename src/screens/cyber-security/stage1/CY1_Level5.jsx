// src/screens/cyber-security/stage1/CY1_Level5.jsx — Defence in Depth (FILL)
import { useState } from 'react';
import CY1Shell from './CY1Shell';

const BLANKS = [
  { id:'B1', answer:'perimeter',  hint:'Outer boundary — firewall, WAF, network controls' },
  { id:'B2', answer:'zero trust', hint:'Never trust, always verify — even internal traffic' },
  { id:'B3', answer:'WAF',        hint:'Web Application Firewall — blocks malicious HTTP requests' },
  { id:'B4', answer:'EDR',        hint:'Endpoint Detection and Response — monitors devices for threats' },
  { id:'B5', answer:'segmentation', hint:'Divide network into zones — breach in one doesn\'t spread' },
  { id:'B6', answer:'backup',     hint:'Offline copy of data — last resort against ransomware' },
  { id:'B7', answer:'SIEM',       hint:'Security Information and Event Management — central log analysis' },
];

const LINES = [
  '# Defence in Depth — never rely on a single control',
  '',
  '# Layer 1: [B1] security',
  '# Firewall blocks unauthorised inbound traffic',
  '# [B3] filters malicious HTTP requests (SQLi, XSS)',
  '# VPN encrypts remote access',
  '',
  '# Layer 2: Network [B5]',
  '# Finance servers isolated from web servers',
  '# Breach in the web DMZ can\'t reach core databases',
  '',
  '# Layer 3: Endpoint protection',
  '# [B4] monitors each device for suspicious behaviour',
  '# Anti-malware, application whitelisting',
  '',
  '# Layer 4: Application security',
  '# Input validation, parameterised queries, MFA',
  '# Least privilege — apps only access what they need',
  '',
  '# Layer 5: Data protection',
  '# Encryption at rest and in transit',
  '# Regular [B6]s — tested, offline, immutable',
  '',
  '# Layer 6: Detection',
  '# [B7] aggregates logs from all layers — detects anomalies',
  '',
  '# Modern approach: [B2]',
  '# "Never trust, always verify" — even internal systems authenticate each other',
];

export default function CY1_Level5() {
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
          return <input key={i} className={`cy1-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:100,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <CY1Shell levelId={5} canProceed={allCorrect}
      conceptReveal={[
        { label:'Zero Trust Architecture', detail:'"Never trust, always verify" — assume the network is already compromised. Every access request is authenticated, authorised, and encrypted regardless of where it originates. Internal systems authenticate each other with certificates. The Castle-and-Moat model (strong perimeter, trust everything inside) is dead.' },
        { label:'Backups Are the Last Line of Defence', detail:'Ransomware encrypts all reachable files. If backups are network-attached, they get encrypted too. Offline, immutable backups (write-once storage, air-gapped) survive ransomware. Test restore procedures quarterly — a backup you\'ve never tested may not actually restore.' },
      ]}
      prevLevelContext="In the last level you secured the login gate. Now you'll protect what's behind it — encrypting patient data at rest and in transit so a breach doesn't become a catastrophe."
      cumulativeSkills={[
        "Applied the CIA triad to evaluate a hospital system's security posture",
        "Built a STRIDE threat model identifying spoofing, tampering, and escalation risks",
        "Mapped the full attack surface: network boundaries, API endpoints, user inputs",
        "Identified social engineering attacks targeting hospital staff",
        "Designed an authentication system resistant to credential stuffing and brute force",
        "Selected and applied encryption for data at rest (AES-256) and in transit (TLS)",
      ]}
    >
      <div className="cy1-intro">
        <h1>Defence in Depth</h1>
        <p className="cy1-tagline">🛡️ Assume each layer will be breached. Design the next layer accordingly.</p>
        <p className="cy1-why">A single firewall is a single point of failure. Defence in depth means an attacker who bypasses the perimeter still faces network segmentation, endpoint detection, application security, and monitoring before reaching sensitive data.</p>
      </div>
      <div className="cy1-panel">
        <div className="cy1-panel-hdr">🛡️ Defence in Depth — fill the blanks</div>
        <div className="cy1-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="cy1-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`cy1-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Defence in depth understood. You think in layers now.':'❌ Check your answers.'}</div>}
    </CY1Shell>
  );
}
