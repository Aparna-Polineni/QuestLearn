// src/screens/cyber-security/stage2/CY2_Level0.jsx — CONCEPTS
import { useState } from 'react';
import CY2Shell from './CY2Shell';

const CARDS = [
  { id:'why',    title:'Why Linux for Security?',        body:'95% of servers, cloud instances, and network devices run Linux. Every penetration test, every incident response, every log analysis happens on the command line. GUI security tools are wrappers around CLI tools. Knowing the CLI means you always have access — even when the GUI is gone.' },
  { id:'fs',     title:'The Linux File System',          body:'Everything is a file in Linux — even devices and processes. /etc: configuration files. /var/log: logs. /home: user directories. /proc: running processes as files. /dev: devices. Knowing where things live makes you faster at every security task.' },
  { id:'perms',  title:'File Permissions — The Security Backbone', body:'Every file has owner, group, and other permissions: read (4), write (2), execute (1). chmod 644 = owner read/write, group read, others read. A misconfigured permission (world-writable /etc/passwd) is a critical vulnerability. Understanding permissions is non-negotiable.' },
  { id:'net',    title:'Networking — How Data Moves',    body:'IP addresses identify hosts. Ports identify services (22=SSH, 80=HTTP, 443=HTTPS, 3306=MySQL). TCP/IP is the protocol stack. DNS resolves names to IPs. ARP resolves IPs to MACs. Understanding this is how you read network traffic in Wireshark and find attackers.' },
  { id:'tools',  title:'The Security Analyst\'s Toolkit', body:'nmap: discover hosts and open ports. netstat/ss: show active connections. Wireshark/tcpdump: capture and analyse packets. grep/awk: search and parse logs. iptables/ufw: firewall rules. ssh: remote access. These are the tools you\'ll use every single day.' },
  { id:'ctf',    title:'CTF Skills',                     body:'Capture The Flag competitions are how security skills are practised legally. Each challenge is a mini exploitation scenario — find the flag hidden on a system. Platforms: HackTheBox, TryHackMe, PicoCTF. This stage builds the Linux and networking foundation every CTF requires.' },
];

export default function CY2_Level0() {
  const [seen, setSeen] = useState(new Set());
  const toggle = id => setSeen(p => { const n = new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });

  return (
    <CY2Shell levelId={0} canProceed={seen.size >= CARDS.length}>
      <div className="cy2-intro">
        <h1>Linux & Networking</h1>
        <p className="cy2-tagline">🐧 The environment every security professional operates in.</p>
        <p className="cy2-why">You can't do incident response, penetration testing, or log analysis without Linux and networking fundamentals. This stage is the technical foundation everything else in the Cyber Security path builds on.</p>
      </div>
      <div className="cy2-cards">
        {CARDS.map(c => (
          <div key={c.id} className={`cy2-card ${seen.has(c.id)?'seen':''}`} onClick={() => toggle(c.id)}>
            <div className="cy2-card-top">
              <span className="cy2-card-title">{c.title}</span>
              <span style={{color:'#06b6d4',fontSize:11}}>{seen.has(c.id)?'▲':'▼'}</span>
            </div>
            {seen.has(c.id) && <p className="cy2-card-body">{c.body}</p>}
          </div>
        ))}
      </div>
      {seen.size < CARDS.length && <p style={{textAlign:'center',color:'#475569',fontSize:13}}>Open all {CARDS.length} cards to continue →</p>}
      {seen.size >= CARDS.length && <div className="cy2-feedback success">✅ Foundation set. Time to learn the command line.</div>}
    </CY2Shell>
  );
}
