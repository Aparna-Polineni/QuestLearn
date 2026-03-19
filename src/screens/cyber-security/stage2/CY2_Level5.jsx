// src/screens/cyber-security/stage2/CY2_Level5.jsx — Network Tools (FILL)
import { useState } from 'react';
import CY2Shell from './CY2Shell';

const BLANKS = [
  { id:'B1', answer:'ping',          hint:'Test reachability and measure round-trip latency' },
  { id:'B2', answer:'traceroute',    hint:'Show each network hop to the destination' },
  { id:'B3', answer:'netstat -tulpn', hint:'Listening ports and the process using each' },
  { id:'B4', answer:'ss -tulpn',     hint:'Modern, faster alternative to netstat' },
  { id:'B5', answer:'curl -I',       hint:'Fetch HTTP headers only — no body' },
  { id:'B6', answer:'dig',           hint:'Detailed DNS lookup with timing info' },
  { id:'B7', answer:'whois',         hint:'Domain registration info — owner, registrar, dates' },
];

const LINES = [
  '# Test connectivity',
  '[B1] 8.8.8.8               # test internet (Google DNS)',
  '[B1] -c 3 192.168.1.1     # 3 packets to gateway',
  '',
  '# Trace path to destination',
  '[B2] hospital.nhs.uk       # show every network hop',
  '# High latency at a hop = congestion or filtering there',
  '',
  '# See what is listening on this machine',
  '[B3]                       # all listening ports + process IDs',
  '[B4]                       # same — faster, more info',
  '# -t TCP  -u UDP  -l listening  -p process  -n no DNS',
  '',
  '# HTTP investigation',
  '[B5] https://target.com    # see server, powered-by headers',
  '# Look for: Server: Apache/2.4.29 (Ubuntu) — version disclosure',
  '',
  '# DNS investigation',
  '[B6] hospital.nhs.uk ANY   # all DNS record types',
  '[B6] +short hospital.nhs.uk  # just the IP',
  '',
  '# Domain intel',
  '[B7] hospital.nhs.uk       # registrar, creation date, nameservers',
  '# Newly registered domain + suspicious = likely phishing',
];

export default function CY2_Level5() {
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
          return <input key={i} className={`cy2-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:120,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <CY2Shell levelId={5} canProceed={allCorrect}
      conceptReveal={[
        { label:'Version Disclosure', detail:'curl -I https://target.com often reveals: Server: Apache/2.2.22. Apache 2.2.22 was released in 2012 with dozens of known CVEs. Never expose version numbers in HTTP headers. ServerTokens Prod in Apache config hides the version. This is a common finding in penetration tests.' },
        { label:'whois for Phishing Detection', detail:'Phishing sites are often registered days before the attack. A domain for "nhs-patient-portal.com" registered 3 days ago is almost certainly malicious. whois reveals registration date, registrar, and registrant — key indicators in phishing investigations.' },
      ]}
    >
      <div className="cy2-intro">
        <h1>Network Tools</h1>
        <p className="cy2-tagline">🔧 The first tools you reach for — in any network investigation.</p>
        <p className="cy2-why">ping, traceroute, netstat, dig, whois — these are in every SOC analyst's muscle memory. Master them and you can investigate any network incident from the command line.</p>
      </div>
      <div className="cy2-panel">
        <div className="cy2-panel-hdr">🔧 Network Tools — fill the blanks</div>
        <div className="cy2-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="cy2-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`cy2-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Network toolkit ready.':'❌ Check your answers — include flags like -I, -tulpn.'}</div>}
    </CY2Shell>
  );
}
