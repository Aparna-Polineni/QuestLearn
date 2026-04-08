// src/screens/cyber-security/stage1/CY1_Level3.jsx — Attack Surfaces (FILL)
import { useState } from 'react';
import CY1Shell from './CY1Shell';

const BLANKS = [
  { id:'B1', answer:'attack surface',  hint:'All the ways an attacker can try to enter or extract data' },
  { id:'B2', answer:'ports',           hint:'Network entry points — every open one is potential exposure' },
  { id:'B3', answer:'nmap',            hint:'Network scanner — discovers open ports and services' },
  { id:'B4', answer:'social engineering', hint:'Manipulating people rather than systems' },
  { id:'B5', answer:'supply chain',    hint:'Third-party libraries and vendors as attack vectors' },
  { id:'B6', answer:'patch',           hint:'Apply software updates to fix known vulnerabilities' },
  { id:'B7', answer:'firewall',        hint:'Network control that allows or blocks traffic by rules' },
];

const LINES = [
  '# Mapping the [B1]',
  '',
  '# Network surface',
  '# Every open [B2] is a potential entry point',
  '# Scan your own infrastructure: nmap -sV -p 1-65535 target_ip',
  '# [B3] discovers: open ports, running services, OS fingerprint',
  '',
  '# Web application surface',
  '# Login pages, APIs, file uploads, user input fields',
  '# Every parameter a user can control is potentially exploitable',
  '',
  '# Human surface',
  '# [B4]: phishing, pretexting, vishing (voice phishing)',
  '# 82% of breaches involve the human element (Verizon DBIR)',
  '',
  '# Third-party [B5] surface',
  '# Log4Shell: a vulnerability in a logging library used by thousands of apps',
  '# Audit your dependencies: npm audit, pip-audit, OWASP Dependency-Check',
  '',
  '# Reducing the attack surface:',
  '# [B6] all software — most exploits target known, unpatched vulnerabilities',
  '# [B7] rules: block all inbound traffic except what\'s explicitly needed',
  '# Principle of least privilege on all accounts and services',
];

export default function CY1_Level3() {
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
          return <input key={i} className={`cy1-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:120,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <CY1Shell levelId={3} canProceed={allCorrect}
      conceptReveal={[
        { label:'Reduce Before You Protect', detail:'Every unnecessary open port, running service, or user account is a liability. Before adding security controls, ask: do we need this? A web server doesn\'t need port 22 (SSH) open to the internet. Disable it. Smaller attack surface = less to protect.' },
        { label:'Supply Chain Attacks', detail:'SolarWinds (2020): attackers compromised a software update mechanism — 18,000 organisations downloaded malware as a legitimate update. Log4Shell (2021): a single logging library had a critical RCE vulnerability affecting millions of Java applications. Your dependencies are part of your attack surface.' },
      ]}
      prevLevelContext="In the last level you mapped the technical attack surface. Now you'll study the human one — phishing, pretexting, and vishing attacks that bypass every firewall by targeting staff."
      cumulativeSkills={[
        "Applied the CIA triad to evaluate a hospital system's security posture",
        "Built a STRIDE threat model identifying spoofing, tampering, and escalation risks",
        "Mapped the full attack surface: network boundaries, API endpoints, user inputs",
        "Identified social engineering attacks targeting hospital reception and admin staff",
      ]}
    >
      <div className="cy1-intro">
        <h1>Attack Surfaces</h1>
        <p className="cy1-tagline">🔎 You can\'t protect what you don\'t know you have.</p>
        <p className="cy1-why">Every organisation has a larger attack surface than they think — forgotten servers, unused APIs, third-party libraries, and employees who click phishing links. Map it before attackers do.</p>
      </div>
      <div className="cy1-panel">
        <div className="cy1-panel-hdr">🔎 Attack Surfaces — fill the blanks</div>
        <div className="cy1-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="cy1-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`cy1-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Attack surfaces understood. You can now audit any system.':'❌ Check your answers.'}</div>}
    </CY1Shell>
  );
}
