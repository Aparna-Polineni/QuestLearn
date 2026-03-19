// src/screens/cyber-security/stage2/CY2_Level4.jsx — Networking Basics (FILL)
import { useState } from 'react';
import CY2Shell from './CY2Shell';

const BLANKS = [
  { id:'B1', answer:'TCP',     hint:'Reliable, connection-based — HTTP, SSH, SMTP' },
  { id:'B2', answer:'UDP',     hint:'Fast, connectionless — DNS, NTP, streaming' },
  { id:'B3', answer:'DNS',     hint:'Resolves domain names to IP addresses' },
  { id:'B4', answer:'22',      hint:'SSH — secure remote shell' },
  { id:'B5', answer:'443',     hint:'HTTPS — encrypted web traffic' },
  { id:'B6', answer:'ARP',     hint:'Resolves IP addresses to MAC addresses on a LAN' },
  { id:'B7', answer:'subnet',  hint:'A range of IP addresses sharing a network prefix' },
];

const LINES = [
  '# Transport layer protocols',
  '# [B1]: three-way handshake SYN→SYN-ACK→ACK',
  '#   reliable, ordered, connection-based',
  '#   used by: HTTP, HTTPS, SSH, SMTP, FTP',
  '',
  '# [B2]: no handshake, no guarantee',
  '#   fast, low overhead',
  '#   used by: DNS, NTP, VoIP, DHCP',
  '',
  '# Common ports (memorise these)',
  '# [B4]  = SSH        [B5] = HTTPS    80  = HTTP',
  '# 3306 = MySQL      5432 = Postgres  25  = SMTP',
  '# 53   = [B3]        21  = FTP      3389 = RDP',
  '',
  '# [B3] — the phonebook of the internet',
  '# Attackers exploit DNS for exfiltration (DNS tunnelling)',
  '# Defenders monitor unusual DNS query volumes',
  '',
  '# IP [B7]s',
  '# 192.168.0.0/24 = 256 addresses, 254 usable hosts',
  '# 10.0.0.0/8     = 16.7M addresses (large private network)',
  '',
  '# [B6] — local network resolution',
  '# ARP spoofing = man-in-the-middle on a LAN',
  '# attacker replies to ARP "who has 192.168.1.1?" with own MAC',
];

export default function CY2_Level4() {
  const [vals, setVals] = useState({});
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState({});

  function check() {
    const r = {};
    BLANKS.forEach(b => { r[b.id]=(vals[b.id]||'').trim().toUpperCase()===b.answer.toUpperCase(); });
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
    <CY2Shell levelId={4} canProceed={allCorrect}
      conceptReveal={[
        { label:'Ports = Attack Surface', detail:'Every open port is a service that can be attacked. A web server only needs ports 80 and 443. If nmap shows port 3306 (MySQL) open to the internet — that\'s a critical misconfiguration. Principle: close every port that isn\'t explicitly needed.' },
        { label:'DNS Exfiltration', detail:'Attackers encode stolen data in DNS queries: SELECT * FROM patients → base64 → eyJkYXRhIjoiLi4ifQ==.attacker.com. DNS is often unmonitored and unblocked by firewalls. Monitor for: high volumes of DNS queries to unusual domains, long subdomains, queries to newly registered domains.' },
      ]}
    >
      <div className="cy2-intro">
        <h1>Networking Basics</h1>
        <p className="cy2-tagline">🌐 Understand how data moves — then understand how attackers exploit it.</p>
        <p className="cy2-why">Every network attack exploits a protocol. You can't detect port scans, DNS exfiltration, or ARP spoofing without understanding TCP, UDP, DNS, ports, and subnets.</p>
      </div>
      <div className="cy2-panel">
        <div className="cy2-panel-hdr">🌐 Networking — fill the blanks</div>
        <div className="cy2-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="cy2-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`cy2-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Networking fundamentals solid.':'❌ Check your answers.'}</div>}
    </CY2Shell>
  );
}
