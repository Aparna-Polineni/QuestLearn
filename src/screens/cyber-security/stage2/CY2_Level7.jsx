// src/screens/cyber-security/stage2/CY2_Level7.jsx — nmap Scanning (FILL)
import { useState } from 'react';
import CY2Shell from './CY2Shell';

const BLANKS = [
  { id:'B1', answer:'-sV',   hint:'Service version detection' },
  { id:'B2', answer:'-sS',   hint:'SYN scan — stealth, doesn\'t complete TCP handshake' },
  { id:'B3', answer:'-O',    hint:'OS fingerprinting' },
  { id:'B4', answer:'-p',    hint:'Specify port range to scan' },
  { id:'B5', answer:'-A',    hint:'Aggressive scan — OS, version, script, traceroute' },
  { id:'B6', answer:'--open',hint:'Show only open ports (filter out filtered/closed)' },
  { id:'B7', answer:'-oN',   hint:'Output to normal text file' },
];

const LINES = [
  '# nmap — the network mapper (run only on systems you own/have permission)',
  '',
  '# Quick scan — what ports are open?',
  'nmap 192.168.1.1',
  '',
  '# Service version detection',
  'nmap [B1] 192.168.1.1       # Apache/2.4.29, OpenSSH_8.2',
  '',
  '# SYN scan — harder to detect in logs',
  'nmap [B2] 192.168.1.1       # requires root: sudo nmap -sS ...',
  '',
  '# OS detection',
  'nmap [B3] 192.168.1.1       # Ubuntu 20.04, Windows Server 2019',
  '',
  '# Scan specific ports',
  'nmap [B4] 22,80,443,3306 192.168.1.1',
  'nmap [B4] 1-65535 192.168.1.1   # all ports (slow)',
  '',
  '# Full scan — aggressive',
  'sudo nmap [B5] 192.168.1.1',
  '',
  '# Only show open ports (cleaner output)',
  'nmap [B1] [B6] 192.168.1.0/24   # scan whole subnet',
  '',
  '# Save results',
  'nmap [B1] [B7] results.txt 192.168.1.1',
];

export default function CY2_Level7() {
  const [vals, setVals] = useState({});
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState({});

  function check() {
    const r = {};
    BLANKS.forEach(b => { r[b.id]=(vals[b.id]||'').trim()===b.answer; });
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
          return <input key={i} className={`cy2-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:70,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <CY2Shell levelId={7} canProceed={allCorrect}
      conceptReveal={[
        { label:'Only Scan Systems You Own', detail:'Unauthorised port scanning is illegal in most jurisdictions. Only scan systems you own, are employed to test (with written authorisation), or that are in a lab environment. nmap against external targets without permission can result in criminal charges.' },
        { label:'What to Look For', detail:'Open ports reveal attack surface. Port 22 open to internet = SSH brute force risk. Port 3306 open to internet = direct MySQL access = critical. Port 8080 = unencrypted admin panel often. Outdated service versions (Apache 2.2) = known CVEs. nmap -sV reveals all of this.' },
      ]}
    >
      <div className="cy2-intro">
        <h1>nmap Scanning</h1>
        <p className="cy2-tagline">🔭 See your network the way an attacker sees it.</p>
        <p className="cy2-why">nmap is the first tool in every penetration test and every network audit. It maps open ports, service versions, and operating systems — the same information an attacker discovers during recon.</p>
      </div>
      <div className="cy2-panel">
        <div className="cy2-panel-hdr">🔭 nmap — fill the blanks</div>
        <div className="cy2-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="cy2-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`cy2-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ nmap flags memorised.':'❌ Exact flags required — case sensitive.'}</div>}
    </CY2Shell>
  );
}
