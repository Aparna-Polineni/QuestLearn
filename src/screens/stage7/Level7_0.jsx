// src/screens/stage7/Level7_0.jsx — DevOps Concepts (CONCEPTS)
import { useState } from 'react';
import Stage7Shell from './Stage7Shell';

const CONCEPTS = [
  { id: 'devops', title: 'What is DevOps?', body: 'DevOps is the practice of automating everything between writing code and running it in production. Without DevOps: a developer manually copies files to a server, hoping nothing breaks. With DevOps: every git push automatically tests, builds, and deploys the app.' },
  { id: 'docker', title: 'Docker — Ship the Environment', body: 'Docker packages your app and everything it needs (Java, Node, config) into a container. "It works on my machine" is no longer an excuse — the container runs identically on your laptop, a teammate\'s machine, and AWS.' },
  { id: 'cicd',   title: 'CI/CD Pipeline', body: 'CI (Continuous Integration): automatically run tests on every push. CD (Continuous Deployment): automatically deploy when tests pass. GitHub Actions is the tool — a .yml file in your repo defines the pipeline.' },
  { id: 'envs',   title: 'Environments', body: 'Development: localhost, fake data, no HTTPS. Staging: a real server, real database, mirrors production. Production: the live app users access. Each environment has different config — database URLs, API keys, CORS origins.' },
  { id: 'aws',    title: 'AWS — The Cloud', body: 'EC2 is a virtual server in the cloud — you SSH in and run Docker containers on it. RDS is a managed MySQL database — no server maintenance, automatic backups. Together they host your Spring Boot + MySQL backend.' },
  { id: 'flow',   title: 'The Full Deployment Flow', body: 'Developer pushes code → GitHub Actions runs tests → builds Docker image → pushes to Docker Hub → EC2 pulls the new image → restarts the container. React is built into static files and served by nginx inside a Docker container.' },
];

export default function Level7_0() {
  const [seen, setSeen] = useState(new Set());
  const toggle = id => setSeen(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const allSeen = seen.size >= CONCEPTS.length;

  return (
    <Stage7Shell levelId={0} canProceed={allSeen}>
      <div className="s7-intro">
        <h1>DevOps Concepts</h1>
        <p className="s7-tagline">🚀 From "works on my machine" to live on the internet.</p>
        <p className="s7-why">You've built a full stack app across Stages 1–6. Stage 7 gets it running in the cloud for real users — automatically, reliably, every time you push code.</p>
      </div>

      <div className="s7-pipeline">
        {['Code', 'Test', 'Build', 'Push', 'Deploy', 'Live'].map((step, i, arr) => (
          <span key={step} style={{display:'flex',alignItems:'center'}}>
            <div className={`s7-pipe-box ${i >= 2 ? 'active' : ''}`}>
              <div className="s7-pipe-label">{['Dev','CI','CI','CD','CD','Prod'][i]}</div>
              <div className="s7-pipe-name">{step}</div>
            </div>
            {i < arr.length - 1 && <div className="s7-pipe-arrow">→</div>}
          </span>
        ))}
      </div>

      <div className="s7-cards">
        {CONCEPTS.map(c => (
          <div key={c.id} className={`s7-card ${seen.has(c.id) ? 'seen' : ''}`} onClick={() => toggle(c.id)}>
            <div className="s7-card-top">
              <span className="s7-card-title">{c.title}</span>
              <span className="s7-chevron">{seen.has(c.id) ? '▲' : '▼'}</span>
            </div>
            {seen.has(c.id) && <p className="s7-card-body">{c.body}</p>}
          </div>
        ))}
      </div>

      {!allSeen && <p style={{textAlign:'center',color:'#475569',fontSize:13,marginTop:16}}>Open all {CONCEPTS.length} cards to continue →</p>}
      {allSeen && <div className="s7-feedback success">✅ DevOps mental model locked in. Let's containerise the app.</div>}
    </Stage7Shell>
  );
}
