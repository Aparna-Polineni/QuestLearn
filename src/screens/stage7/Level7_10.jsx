// src/screens/stage7/Level7_10.jsx — Production Bug Hunt (DEBUG)
import { useState } from 'react';
import Stage7Shell from './Stage7Shell';

const BUGS = [
  {
    id: 1, label: 'Bug 1 — CORS fails in production',
    bad: `# application-prod.properties
spring.web.cors.allowed-origins=http://localhost:3000
# ← still pointing to localhost even in production
# All API calls from https://questlearn.com fail with CORS error`,
    good: `# application-prod.properties
spring.web.cors.allowed-origins=\${CORS_ORIGIN}

# Set in docker-compose.yml or GitHub Secrets:
# CORS_ORIGIN=https://questlearn.com`,
    why: 'The localhost:3000 CORS origin works in development but is wrong in production. Your deployed React app is served from https://questlearn.com — that\'s the origin that needs to be allowed. Use an environment variable so staging and production can each have the right value.',
    hint: 'Production CORS origin must match your actual domain, not localhost.',
  },
  {
    id: 2, label: 'Bug 2 — Database connection refused on startup',
    bad: `# docker-compose.yml
services:
  api:
    depends_on:
      - db       # ← no healthcheck
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/questlearn
# Spring Boot starts before MySQL is accepting connections
# Error: Communications link failure`,
    good: `services:
  db:
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      retries: 10     # give MySQL more time in production

  api:
    depends_on:
      db:
        condition: service_healthy`,
    why: 'MySQL on a real server can take 20–30 seconds to initialise on first launch (creating databases, loading InnoDB). depends_on alone only waits for the container process to start. service_healthy waits until mysqladmin ping succeeds.',
    hint: 'Add a healthcheck — MySQL takes longer to start in production than in dev.',
  },
  {
    id: 3, label: 'Bug 3 — Environment variable not found',
    bad: `# docker-compose.yml
services:
  api:
    environment:
      JWT_SECRET: \${JWT_SECRET}   # reads from .env file

# .env file is in /home/ubuntu/ but docker-compose.yml is in /home/ubuntu/app/
# Docker Compose looks for .env in the SAME directory
# Result: variable JWT_SECRET is not set`,
    good: `# Option 1 — put .env in the same directory as docker-compose.yml
# (most common fix)

# Option 2 — specify the env file explicitly:
docker compose --env-file /home/ubuntu/.env up -d

# Option 3 — hardcode in compose (only for non-secrets):
environment:
  SPRING_PROFILES_ACTIVE: prod`,
    why: 'Docker Compose only auto-loads a file named exactly ".env" from the same directory as docker-compose.yml. If your .env is in a different directory, variables resolve to empty strings and Spring Boot gets no config.',
    hint: '.env must be in the same directory as docker-compose.yml.',
  },
  {
    id: 4, label: 'Bug 4 — ddl-auto=create wipes production data',
    bad: `# application-prod.properties
spring.jpa.hibernate.ddl-auto=create
# ← Every Spring Boot restart drops all tables and recreates them
# All patient records, users, progress data DELETED on every deploy`,
    good: `# application-prod.properties
spring.jpa.hibernate.ddl-auto=validate
# Checks schema matches entities but never modifies it
# Use Flyway for schema changes (V2__add_column.sql)

# application-dev.properties
spring.jpa.hibernate.ddl-auto=update  # OK in dev — no real data`,
    why: 'ddl-auto=create drops and recreates all tables on every startup — destroying all production data. Always use validate in production. Schema changes go through Flyway migration files that run once and never again.',
    hint: 'Never use ddl-auto=create in production. Use validate + Flyway.',
  },
];

export default function Level7_10() {
  const [found, setFound] = useState(new Set());

  return (
    <Stage7Shell levelId={10} canProceed={found.size >= BUGS.length}
      conceptReveal={[{ label: 'The 4 Production Bug Patterns', detail: 'CORS localhost origin in prod, DB connection without healthcheck, .env in wrong directory, ddl-auto=create destroying data. Every developer deploys to production for the first time and hits at least two of these.' }]}
    >
      <div className="s7-intro">
        <h1>Production Bug Hunt</h1>
        <p className="s7-tagline">🐛 Four bugs that only appear after you deploy to a real server.</p>
        <p className="s7-why">These bugs don't exist in development — they only surface in production. Knowing them in advance saves your first deployment from being a disaster.</p>
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
      {found.size >= BUGS.length && <div className="s7-feedback success" style={{marginTop:20}}>✅ All 4 production bugs identified. Your first deploy won't be a disaster.</div>}
    </Stage7Shell>
  );
}
