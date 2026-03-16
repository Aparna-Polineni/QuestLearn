// src/screens/stage7/Level7_11.jsx — Deployment Capstone (BUILD)
import { useState } from 'react';
import Stage7Shell from './Stage7Shell';

const TABS = ['Dockerfiles', 'Compose', 'CI/CD', 'Config'];

const REQUIREMENTS = {
  Dockerfiles: [
    { id: 'd1', label: 'Spring Boot multi-stage Dockerfile (JDK build → JRE run)' },
    { id: 'd2', label: 'React multi-stage Dockerfile (Node build → nginx serve)' },
    { id: 'd3', label: 'nginx.conf with try_files for React Router' },
    { id: 'd4', label: 'EXPOSE 8080 on Spring Boot, EXPOSE 80 on React' },
  ],
  Compose: [
    { id: 'c1', label: 'All 3 services: db, api, frontend' },
    { id: 'c2', label: 'MySQL healthcheck + api depends_on condition: service_healthy' },
    { id: 'c3', label: 'All env vars use ${VARIABLE} syntax (not hardcoded)' },
    { id: 'c4', label: 'All services on a shared bridge network' },
  ],
  'CI/CD': [
    { id: 'ci1', label: 'CI workflow runs tests on push + PR to main' },
    { id: 'ci2', label: 'CD workflow needs CI jobs before deploying' },
    { id: 'ci3', label: 'CD builds + pushes Docker image to Docker Hub' },
    { id: 'ci4', label: 'CD SSHs into EC2 and runs docker compose pull + up' },
  ],
  Config: [
    { id: 'cf1', label: 'application-dev.properties with localhost DB + ddl-auto=update' },
    { id: 'cf2', label: 'application-prod.properties with env var DB URL + ddl-auto=validate' },
    { id: 'cf3', label: 'Production CORS origin from env var (not localhost)' },
    { id: 'cf4', label: 'JWT secret from environment variable in both profiles' },
  ],
};

const CHECK = {
  d1: c => c.includes('ECLIPSE-TEMURIN') && c.includes('AS BUILD') && c.includes('JRE'),
  d2: c => c.includes('NODE') && c.includes('NGINX') && c.includes('NPM RUN BUILD'),
  d3: c => c.includes('TRY_FILES') || c.includes('TRY FILES'),
  d4: c => c.includes('EXPOSE 8080') && c.includes('EXPOSE 80'),
  c1: c => c.includes('DB:') && c.includes('API:') && c.includes('FRONTEND:'),
  c2: c => c.includes('HEALTHCHECK') && c.includes('SERVICE_HEALTHY'),
  c3: c => c.includes('${') && !c.includes('ROOTPASSWORD') || c.includes('${DB'),
  c4: c => c.includes('NETWORKS') && c.includes('BRIDGE'),
  ci1: c => c.includes('ON:') && c.includes('PUSH') && c.includes('PULL_REQUEST'),
  ci2: c => c.includes('NEEDS') && (c.includes('TEST-BACKEND') || c.includes('TEST_BACKEND')),
  ci3: c => c.includes('DOCKER/BUILD-PUSH-ACTION') || (c.includes('DOCKER BUILD') && c.includes('DOCKER PUSH')),
  ci4: c => c.includes('SSH') && c.includes('DOCKER COMPOSE'),
  cf1: c => c.includes('APPLICATION-DEV') && c.includes('LOCALHOST') && c.includes('UPDATE'),
  cf2: c => c.includes('APPLICATION-PROD') && c.includes('${SPRING_DATASOURCE') && c.includes('VALIDATE'),
  cf3: c => c.includes('CORS') && c.includes('${CORS') || c.includes('CORS_ORIGIN'),
  cf4: c => c.includes('JWT') && c.includes('${JWT'),
};

export default function Level7_11() {
  const [tab, setTab] = useState('Dockerfiles');
  const [code, setCode] = useState({ Dockerfiles:'', Compose:'', 'CI/CD':'', Config:'' });
  const [results, setResults] = useState({});
  const [checked, setChecked] = useState(false);
  const [showHints, setShowHints] = useState(false);

  function check() {
    const allCode = Object.values(code).join('\n').toUpperCase();
    const r = {};
    Object.entries(CHECK).forEach(([id, fn]) => { r[id] = fn(allCode); });
    setResults(r); setChecked(true);
  }

  const allReqs = Object.values(REQUIREMENTS).flat();
  const passCount = allReqs.filter(r => results[r.id]).length;
  const allPass = checked && passCount === allReqs.length;

  return (
    <Stage7Shell levelId={11} canProceed={allPass}
      conceptReveal={[
        { label: 'You are now a Full Stack Developer', detail: 'You\'ve built a complete system from database design (Stage 5) through backend API (Stage 4), React frontend (Stage 3), JavaScript fundamentals (Stage 2.5), Java core (Stage 2), and system design (Stage 1). Stage 7 deploys it to the cloud. This is the complete Java Full Stack Developer journey.' },
        { label: 'What to do next', detail: 'Deploy QuestLearn itself using what you learned. Push it to GitHub, set up GitHub Actions CI/CD, launch an EC2 instance, create an RDS database, and make QuestLearn accessible to real learners. You have all the skills — now ship it.' },
      ]}
    >
      <div className="s7-intro">
        <h1>Deployment Capstone</h1>
        <p className="s7-tagline">🏆 Dockerfiles + Compose + CI/CD + Config. Ship QuestLearn to production.</p>
        <p className="s7-why">Write the complete deployment setup across four tabs. Every concept from Stage 7 combined into a production-ready deployment pipeline.</p>
      </div>

      {checked && (
        <div style={{background:'#1e293b',borderRadius:8,padding:'12px 16px',marginBottom:16,display:'flex',alignItems:'center',gap:12}}>
          <div style={{flex:1}}>
            <div style={{height:6,background:'#334155',borderRadius:3,overflow:'hidden'}}>
              <div style={{height:'100%',background:'#ef4444',borderRadius:3,width:`${(passCount/allReqs.length)*100}%`,transition:'width .4s'}} />
            </div>
          </div>
          <span style={{color:'#ef4444',fontWeight:700,fontSize:14,whiteSpace:'nowrap'}}>{passCount}/{allReqs.length} requirements</span>
        </div>
      )}

      <div style={{display:'flex',gap:4,marginBottom:14,flexWrap:'wrap'}}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding:'8px 16px', borderRadius:6, border:'none', cursor:'pointer',
            fontSize:13, fontWeight:600, transition:'all .15s',
            background: tab===t ? '#ef4444' : '#1e293b',
            color: tab===t ? 'white' : '#64748b',
          }}>{t}</button>
        ))}
      </div>

      <div style={{marginBottom:12}}>
        {(REQUIREMENTS[tab] || []).map(r => (
          <div className="s7-req" key={r.id}>
            <span className="s7-req-icon" style={{color: !checked ? '#475569' : results[r.id] ? '#4ade80' : '#f87171'}}>
              {!checked ? '○' : results[r.id] ? '✓' : '✗'}
            </span>
            <span className="s7-req-text">{r.label}</span>
          </div>
        ))}
      </div>

      <div className="s7-panel">
        <div className="s7-panel-header">✏️ {tab}</div>
        <textarea className="s7-editor" value={code[tab]} onChange={e => setCode(c => ({...c,[tab]:e.target.value}))}
          placeholder={`// Write your ${tab} here...`}
          style={{border:'none',borderRadius:0,minHeight:260}} />
      </div>

      <div style={{display:'flex',gap:10,marginTop:12,flexWrap:'wrap'}}>
        <button className="s7-btn" onClick={check}>Check All Tabs</button>
        <button className="s7-btn secondary" onClick={() => setShowHints(s => !s)}>
          {showHints ? 'Hide' : 'Show'} Hints
        </button>
      </div>

      {showHints && (
        <div className="s7-info" style={{marginTop:12}}>
          <p><strong style={{color:'#ef4444'}}>Dockerfiles:</strong> Spring Boot — eclipse-temurin:17-jdk-alpine build → JRE runtime. React — node:18-alpine build → nginx:alpine serve with nginx.conf.</p>
          <p style={{marginTop:8}}><strong style={{color:'#ef4444'}}>Compose:</strong> 3 services (db/api/frontend), MySQL healthcheck, depends_on condition: service_healthy, all env vars from {'${VARIABLES}'}, bridge network.</p>
          <p style={{marginTop:8}}><strong style={{color:'#ef4444'}}>CI/CD:</strong> ci.yml triggers on push+PR, runs backend + frontend tests. cd.yml needs both CI jobs, builds Docker image, pushes to Hub, SSHs to EC2.</p>
          <p style={{marginTop:8}}><strong style={{color:'#ef4444'}}>Config:</strong> application-dev.properties (localhost, update), application-prod.properties (env vars, validate, prod CORS), JWT secret from env.</p>
        </div>
      )}

      {checked && (
        <div className={`s7-feedback ${allPass ? 'success' : 'error'}`} style={{marginTop:12}}>
          {allPass
            ? '🎓 Stage 7 Complete! QuestLearn is production-ready. Time to deploy.'
            : `❌ ${passCount}/${allReqs.length} requirements met. Check all four tabs.`}
        </div>
      )}
    </Stage7Shell>
  );
}
