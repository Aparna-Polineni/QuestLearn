// src/screens/stage7/Level7_6.jsx — GitHub Actions CD (FILL)
import { useState } from 'react';
import Stage7Shell from './Stage7Shell';
import FillEditor from '../stage2/FillEditor';

const BLANKS = [
  { id: 'NEEDS',   answer: 'needs: [test-backend, test-frontend]',        placeholder: 'wait for CI jobs',        hint: 'Only deploy if both test jobs passed.' },
  { id: 'BRANCH',  answer: "if: github.ref == 'refs/heads/main'",         placeholder: 'only deploy from main',   hint: 'Only run this job when the push is to the main branch.' },
  { id: 'LOGIN',   answer: 'uses: docker/login-action@v2\n        with:\n          username: ${{ secrets.DOCKER_USERNAME }}\n          password: ${{ secrets.DOCKER_TOKEN }}', placeholder: 'Docker Hub login', hint: 'Use the docker/login-action with secrets for credentials.' },
  { id: 'BUILDX',  answer: 'uses: docker/build-push-action@v4\n        with:\n          context: ./backend\n          push: true\n          tags: ${{ secrets.DOCKER_USERNAME }}/questlearn-api:latest', placeholder: 'build and push image', hint: 'Build from ./backend context, push to Docker Hub with :latest tag.' },
  { id: 'SSH',     answer: 'uses: appleboy/ssh-action@master\n        with:\n          host: ${{ secrets.EC2_HOST }}\n          username: ubuntu\n          key: ${{ secrets.EC2_SSH_KEY }}', placeholder: 'SSH into EC2',        hint: 'Use appleboy/ssh-action with EC2 host, username ubuntu, and SSH key.' },
  { id: 'DEPLOY',  answer: 'script: |\n            docker pull ${{ secrets.DOCKER_USERNAME }}/questlearn-api:latest\n            docker compose up -d api', placeholder: 'pull and restart on EC2', hint: 'Pull the new image then restart just the api service.' },
];

const TEMPLATE = `# .github/workflows/cd.yml
name: CD — Deploy on merge to main

on:
  push:
    branches: [main]

jobs:
  test-backend:
    uses: ./.github/workflows/ci.yml  # reuse CI workflow

  test-frontend:
    uses: ./.github/workflows/ci.yml

  deploy:
    name: Deploy to EC2
    runs-on: ubuntu-latest
    [NEEDS]
    [BRANCH]
    steps:
      - uses: actions/checkout@v3

      # ── Build & push Docker image to Docker Hub ────────────────────────
      - name: Log in to Docker Hub
        [LOGIN]

      - name: Build and push API image
        [BUILDX]

      # ── Pull new image on EC2 and restart ──────────────────────────────
      - name: Deploy to EC2
        [SSH]
          [DEPLOY]`;

export default function Level7_6() {
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage7Shell levelId={6} canProceed={isCorrect}
      conceptReveal={[
        { label: 'GitHub Secrets', detail: 'Never put passwords in .yml files — they\'re public. Go to GitHub repo → Settings → Secrets → Actions → New secret. Add DOCKER_USERNAME, DOCKER_TOKEN, EC2_HOST, EC2_SSH_KEY. The workflow references them as ${{ secrets.SECRET_NAME }}.' },
        { label: 'needs: prevents broken deploys', detail: 'Without needs: [test-backend, test-frontend], the deploy job runs in parallel with tests — potentially deploying broken code. needs: makes deploy wait until both test jobs pass successfully.' },
        { label: 'docker compose up -d api', detail: 'The -d flag runs in detached mode (background). Specifying "api" restarts only the API container — not MySQL or the frontend. MySQL data persists in its volume.' },
      ]}
    >
      <div className="s7-intro">
        <h1>GitHub Actions — CD</h1>
        <p className="s7-tagline">🚢 Merge to main → tests pass → new version live on EC2. Automatically.</p>
        <p className="s7-why">CD eliminates manual deployments. No more SSH-ing into servers and running commands by hand. Every merge to main that passes tests automatically updates production.</p>
      </div>

      <div className="s7-info">
        <p><strong style={{color:'#ef4444'}}>Required GitHub Secrets:</strong> DOCKER_USERNAME, DOCKER_TOKEN (from Docker Hub), EC2_HOST (public IP), EC2_SSH_KEY (private key content).</p>
      </div>

      <FillEditor template={TEMPLATE} blanks={BLANKS} onAllCorrect={() => setIsCorrect(true)} />
    </Stage7Shell>
  );
}
