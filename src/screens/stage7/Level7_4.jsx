// src/screens/stage7/Level7_4.jsx — Docker Bug Hunt (DEBUG)
import { useState } from 'react';
import Stage7Shell from './Stage7Shell';

const BUGS = [
  {
    id: 1, label: 'Bug 1 — Wrong port mapping',
    bad:  `# docker-compose.yml
services:
  api:
    ports:
      - "8080"        # ← missing host port
      # Only exposes port inside Docker network
      # Accessing localhost:8080 from your browser FAILS`,
    good: `services:
  api:
    ports:
      - "8080:8080"   # ← host:container
      # localhost:8080 on your machine → port 8080 in the container`,
    why:  'Port mapping format is HOST:CONTAINER. "8080" alone only exposes the port inside the Docker network — external access from your browser is blocked. Always use "hostPort:containerPort".',
    hint: 'Port mapping needs both sides: "hostPort:containerPort".',
  },
  {
    id: 2, label: 'Bug 2 — Using localhost to connect containers',
    bad:  `# application.properties inside the api container
spring.datasource.url=jdbc:mysql://localhost:3306/questlearn
# localhost inside a container = that container itself
# MySQL is in a DIFFERENT container → connection refused`,
    good: `# Use the Docker Compose service name as the hostname
spring.datasource.url=jdbc:mysql://db:3306/questlearn
# "db" is the service name in docker-compose.yml
# Docker's internal DNS resolves it to the correct container IP`,
    why:  'Inside a Docker container, localhost refers to that container itself — not to other containers. Use the Compose service name ("db") as the hostname. Docker\'s internal DNS resolves it automatically.',
    hint: 'Containers talk to each other by service name, not localhost.',
  },
  {
    id: 3, label: 'Bug 3 — API starts before MySQL is ready',
    bad:  `services:
  api:
    depends_on:
      - db    # only waits for container to START
              # MySQL takes ~10s to accept connections
              # Spring Boot crashes on startup with "Connection refused"`,
    good: `services:
  db:
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      retries: 5

  api:
    depends_on:
      db:
        condition: service_healthy  # waits for healthcheck to pass`,
    why:  'depends_on only waits for the MySQL container to start — not for MySQL itself to accept connections (which takes 5–15 seconds). Add a healthcheck to the db service and use condition: service_healthy so Spring Boot only starts when MySQL is actually ready.',
    hint: 'depends_on doesn\'t wait for MySQL to be ready — add a healthcheck.',
  },
  {
    id: 4, label: 'Bug 4 — .env file not loaded',
    bad:  `# .env file exists in project root with DB passwords
# docker-compose.yml references them:
environment:
  MYSQL_ROOT_PASSWORD: \${DB_PASSWORD}

# But running: docker compose up
# Error: variable DB_PASSWORD is not set`,
    good: `# Option 1 — docker compose automatically loads .env from the same directory
# Make sure .env is in the SAME folder as docker-compose.yml

# Option 2 — explicitly reference it
docker compose --env-file .env up

# Option 3 — use env_file in compose:
services:
  db:
    env_file:
      - .env`,
    why:  'Docker Compose automatically reads a file named exactly ".env" in the same directory as docker-compose.yml. A file named "env" or ".env.local" is NOT picked up automatically. Use --env-file flag or env_file key to reference non-default filenames.',
    hint: 'The .env file must be named exactly ".env" and in the same folder as docker-compose.yml.',
  },
];

export default function Level7_4() {
  const [found, setFound] = useState(new Set());

  return (
    <Stage7Shell levelId={4} canProceed={found.size >= BUGS.length}
      conceptReveal={[{ label: 'The 4 Docker Bug Patterns', detail: 'Wrong port mapping, localhost vs service name, depends_on without healthcheck, .env not loaded. These four cause almost every "it works locally but breaks in Docker" problem.' }]}
    >
      <div className="s7-intro">
        <h1>Docker Bug Hunt</h1>
        <p className="s7-tagline">🐛 Four bugs every developer hits when Dockerising for the first time.</p>
        <p className="s7-why">Docker adds a networking layer that breaks assumptions you made about localhost. These bugs are all caused by that one mental shift.</p>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        {BUGS.map(bug => (
          <div key={bug.id} style={{
            background:'#1e293b', borderRadius:10, padding:'16px 20px',
            border:`1px solid ${found.has(bug.id) ? '#4ade8060' : '#334155'}`,
            borderLeft:`3px solid ${found.has(bug.id) ? '#4ade80' : '#f87171'}`,
          }}>
            <h3 style={{color: found.has(bug.id) ? '#4ade80' : '#f87171', margin:'0 0 10px', fontSize:14}}>{bug.label}</h3>
            <div className="s7-panel" style={{margin:'0 0 8px'}}>
              <div className="s7-panel-header" style={{color:'#f87171'}}>❌ Buggy</div>
              <pre className="s7-panel-body" style={{margin:0,overflowX:'auto',fontSize:12}}>{bug.bad}</pre>
            </div>
            <p style={{color:'#64748b',fontSize:13,margin:'8px 0'}}>💡 {bug.hint}</p>
            {!found.has(bug.id) ? (
              <button className="s7-btn secondary" style={{fontSize:13,padding:'7px 16px',marginTop:6}}
                onClick={() => setFound(p => { const n = new Set(p); n.add(bug.id); return n; })}>
                Reveal Fix
              </button>
            ) : (
              <>
                <div className="s7-panel" style={{margin:'8px 0 6px'}}>
                  <div className="s7-panel-header" style={{color:'#4ade80'}}>✅ Fixed</div>
                  <pre className="s7-panel-body" style={{margin:0,color:'#94a3b8',overflowX:'auto',fontSize:12}}>{bug.good}</pre>
                </div>
                <p style={{color:'#94a3b8',fontSize:13,lineHeight:1.6,margin:'6px 0'}}>{bug.why}</p>
              </>
            )}
          </div>
        ))}
      </div>
      {found.size >= BUGS.length && <div className="s7-feedback success" style={{marginTop:20}}>✅ All 4 Docker bugs found. Your containers will talk to each other correctly.</div>}
    </Stage7Shell>
  );
}
