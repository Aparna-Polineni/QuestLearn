// src/screens/stage7/Level7_2.jsx — Dockerise React (FILL)
import { useState } from 'react';
import Stage7Shell from './Stage7Shell';
import FillEditor from '../stage2/FillEditor';

const BLANKS = [
  { id: 'FROM1',   answer: 'FROM node:18-alpine AS build',              placeholder: 'Node build stage',        hint: 'Node 18 Alpine for the build stage. Name it "build".' },
  { id: 'NPMCI',   answer: 'RUN npm ci',                                 placeholder: 'install dependencies',    hint: 'npm ci is faster and more reliable than npm install in CI/Docker.' },
  { id: 'NPMB',    answer: 'RUN npm run build',                          placeholder: 'build React app',         hint: 'Creates the optimised static files in /app/build.' },
  { id: 'FROM2',   answer: 'FROM nginx:alpine',                          placeholder: 'nginx serve stage',       hint: 'nginx serves static files — tiny and fast.' },
  { id: 'CPBUILD', answer: 'COPY --from=build /app/build /usr/share/nginx/html', placeholder: 'copy build output', hint: 'Copy React\'s build folder into nginx\'s default serve directory.' },
  { id: 'CPNGINX', answer: 'COPY nginx.conf /etc/nginx/conf.d/default.conf', placeholder: 'copy nginx config',  hint: 'Custom nginx config to handle React Router (SPA routing).' },
  { id: 'EXP',     answer: 'EXPOSE 80',                                  placeholder: 'expose nginx port',       hint: 'nginx serves on port 80 by default.' },
];

const TEMPLATE = `# ── Stage 1: Build React static files ────────────────────────────────────
[FROM1]
WORKDIR /app
COPY package*.json ./
[NPMCI]
COPY . .
[NPMB]

# ── Stage 2: Serve with nginx ─────────────────────────────────────────────
[FROM2]
[CPBUILD]
[CPNGINX]
[EXP]
CMD ["nginx", "-g", "daemon off;"]`;

const NGINX = `# nginx.conf — handles React Router (all paths → index.html)
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
        # ^ without this, refreshing /roadmap returns 404
    }
}`;

export default function Level7_2() {
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage7Shell levelId={2} canProceed={isCorrect}
      conceptReveal={[
        { label: 'Why nginx?', detail: 'npm start runs a development server — it\'s slow, watches files, and has no production optimisations. nginx is a production-grade static file server. It serves React\'s built files with caching headers, gzip compression, and handles thousands of concurrent requests.' },
        { label: 'try_files and React Router', detail: 'Without try_files $uri /index.html, refreshing /roadmap returns a 404 — nginx looks for a file literally called "roadmap" which doesn\'t exist. The try_files directive falls back to index.html for any unknown path, letting React Router take over.' },
        { label: 'npm ci vs npm install', detail: 'npm ci reads package-lock.json exactly and installs only those versions — no unexpected updates. npm install may update patch versions. In Docker and CI always use npm ci for reproducible, faster builds.' },
      ]}
    >
      <div className="s7-intro">
        <h1>Dockerise React</h1>
        <p className="s7-tagline">⚛️ Build once, serve anywhere with nginx.</p>
        <p className="s7-why">npm start is for development only. In production, React is compiled to static HTML/CSS/JS files and served by nginx — a proper web server that handles caching, compression, and thousands of users.</p>
      </div>

      <div className="s7-panel">
        <div className="s7-panel-header">📄 nginx.conf (place in frontend/ folder)</div>
        <pre className="s7-panel-body" style={{color:'#94a3b8',margin:0}}>{NGINX}</pre>
      </div>

      <FillEditor template={TEMPLATE} blanks={BLANKS} onAllCorrect={() => setIsCorrect(true)} />
    </Stage7Shell>
  );
}
