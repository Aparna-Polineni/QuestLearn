// src/screens/cyber-security/stage2/CY2_Level8.jsx — Packet Analysis (FILL)
import { useState } from 'react';
import CY2Shell from './CY2Shell';

const BLANKS = [
  { id:'B1', answer:'tcpdump',  hint:'CLI packet capture tool — no GUI required' },
  { id:'B2', answer:'-i',       hint:'Specify network interface to capture on' },
  { id:'B3', answer:'-w',       hint:'Write captured packets to a pcap file' },
  { id:'B4', answer:'-r',       hint:'Read packets from a pcap file' },
  { id:'B5', answer:'port',     hint:'Filter by port number in capture filter' },
  { id:'B6', answer:'host',     hint:'Filter by IP address (source or destination)' },
  { id:'B7', answer:'-n',       hint:'Don\'t resolve hostnames — show raw IPs (faster)' },
];

const LINES = [
  '# Capture live traffic (CLI)',
  'sudo [B1] [B2] eth0              # capture on eth0',
  'sudo [B1] [B2] eth0 [B7]        # no DNS — faster, shows raw IPs',
  '',
  '# Save to file for analysis in Wireshark',
  'sudo [B1] [B2] eth0 [B3] capture.pcap',
  '',
  '# Read saved capture',
  '[B1] [B4] capture.pcap',
  '',
  '# Filter syntax (Berkeley Packet Filter)',
  'sudo [B1] [B2] eth0 [B5] 443         # HTTPS only',
  'sudo [B1] [B2] eth0 [B6] 192.168.1.50  # traffic to/from one host',
  'sudo [B1] [B2] eth0 "[B5] 22 or [B5] 23"  # SSH or Telnet',
  '',
  '# Detect suspicious traffic patterns',
  '# Many SYN packets with no ACK = port scan',
  '# Large DNS queries = possible DNS tunnelling',
  '# Unusual destination ports = malware C2',
  '',
  '# Wireshark filters (display filter, GUI)',
  '# http.request.method == "POST"  — find form submissions',
  '# tcp.flags.syn == 1             — find SYN packets',
  '# dns.qry.name contains "evil"   — DNS lookup filter',
];

export default function CY2_Level8() {
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
          return <input key={i} className={`cy2-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:80,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <CY2Shell levelId={8} canProceed={allCorrect}
      conceptReveal={[
        { label:'Port Scan Signature', detail:'A port scan produces many TCP SYN packets to different ports with no corresponding ACK responses. In tcpdump: dozens of "S" (SYN) flags from one source IP to sequential ports in a short time window. In Wireshark: filter tcp.flags.syn==1 && tcp.flags.ack==0.' },
        { label:'Encrypted Traffic Analysis', detail:'HTTPS encrypts content but metadata is visible: destination IP, timing, packet sizes, connection patterns. TLS handshake reveals: SNI (server name), certificate details, cipher suites. Even without decryption, an analyst can detect: unusual C2 connection patterns, data exfiltration (large outbound transfers), beaconing (regular intervals = malware).' },
      ]}
    >
      <div className="cy2-intro">
        <h1>Packet Analysis</h1>
        <p className="cy2-tagline">📡 See every packet on the wire. Find what shouldn't be there.</p>
        <p className="cy2-why">Packet capture is how you confirm a breach, find data exfiltration, detect malware C2 communications, and reconstruct an attacker's actions. tcpdump in the CLI, Wireshark with the GUI — same packets, different views.</p>
      </div>
      <div className="cy2-panel">
        <div className="cy2-panel-hdr">📡 Packet Analysis — fill the blanks</div>
        <div className="cy2-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="cy2-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`cy2-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Packet analysis tools mastered.':'❌ Check your answers.'}</div>}
    </CY2Shell>
  );
}
