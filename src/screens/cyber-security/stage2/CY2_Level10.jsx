// src/screens/cyber-security/stage2/CY2_Level10.jsx — SSH Hardening (FILL)
import { useState } from 'react';
import CY2Shell from './CY2Shell';

const BLANKS = [
  { id:'B1', answer:'ssh-keygen',       hint:'Generate an SSH key pair' },
  { id:'B2', answer:'ssh-copy-id',      hint:'Copy public key to remote server\'s authorized_keys' },
  { id:'B3', answer:'authorized_keys',  hint:'File on server listing allowed public keys' },
  { id:'B4', answer:'~/.ssh/config',    hint:'Client-side SSH config — aliases, options per host' },
  { id:'B5', answer:'ProxyJump',        hint:'SSH through a bastion host — no direct access to internal servers' },
  { id:'B6', answer:'AllowUsers',       hint:'Whitelist specific users allowed to SSH' },
  { id:'B7', answer:'PermitRootLogin no', hint:'Prevent direct root SSH access' },
];

const LINES = [
  '# Generate SSH key pair',
  '[B1] -t ed25519 -C "analyst@hospital"',
  '# Creates: ~/.ssh/id_ed25519 (private) and ~/.ssh/id_ed25519.pub (public)',
  '',
  '# Copy public key to server',
  '[B2] analyst@192.168.1.10',
  '# Appends pub key to /home/analyst/[B3]',
  '',
  '# SSH client config (~/.ssh/config)',
  'Host prod-web',
  '  HostName 10.0.0.50',
  '  User analyst',
  '  IdentityFile ~/.ssh/id_ed25519',
  '  [B5] bastion.hospital.nhs.uk',
  '# Now: ssh prod-web — routes through bastion',
  '',
  '# /etc/ssh/sshd_config hardening',
  '[B7]',
  'PasswordAuthentication no',
  '[B6] analyst deploy monitoring',
  'Port 2222',
  'MaxAuthTries 3',
  'ClientAliveInterval 300',
  '',
  '# After editing sshd_config:',
  'sudo systemctl restart sshd',
];

export default function CY2_Level10() {
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
          return <input key={i} className={`cy2-blank ${st}`} value={vals[bid]||''} onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))} placeholder={bl?.hint} style={{minWidth:bid==='B7'?160:120,whiteSpace:'normal'}}/>;
        })}
      </div>
    );
  }

  return (
    <CY2Shell levelId={10} canProceed={allCorrect}
      conceptReveal={[
        { label:'Bastion Hosts', detail:'A bastion host (jump box) is the only server with a public IP and SSH open. All other internal servers are accessible only through the bastion: ssh -J bastion.hospital.nhs.uk db-server. This means an attacker who compromises an application server can\'t directly SSH to the database — they must go through the bastion, which has stricter monitoring.' },
        { label:'ed25519 vs RSA', detail:'Ed25519 keys are shorter (256-bit), faster to generate, faster to verify, and considered more secure than 4096-bit RSA. They\'re also the default in modern OpenSSH. Always use -t ed25519. Avoid DSA (broken) and RSA < 2048-bit (weak).' },
      ]}
    >
      <div className="cy2-intro">
        <h1>SSH Hardening</h1>
        <p className="cy2-tagline">🔑 Keys only. No root. Bastion host. These three changes stop most SSH attacks.</p>
        <p className="cy2-why">SSH is the primary remote access method for every Linux server. Misconfigured SSH (password auth, root login allowed) is one of the most common attack vectors. Harden it correctly and SSH attacks become infeasible.</p>
      </div>
      <div className="cy2-panel">
        <div className="cy2-panel-hdr">🔑 SSH Hardening — fill the blanks</div>
        <div className="cy2-panel-body">{LINES.map(renderLine)}</div>
      </div>
      <button className="cy2-check-btn" onClick={check}>Check Answers</button>
      {checked && <div className={`cy2-feedback ${allCorrect?'success':'error'}`}>{allCorrect?'✅ SSH hardening complete.':'❌ Check your answers.'}</div>}
    </CY2Shell>
  );
}
