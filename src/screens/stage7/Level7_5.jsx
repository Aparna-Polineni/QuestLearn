// src/screens/stage7/Level7_5.jsx — GitHub Actions CI (FILL)
import { useState } from 'react';
import Stage7Shell from './Stage7Shell';
import FillEditor from '../stage2/FillEditor';

const BLANKS = [
  { id: 'TRIGGER', answer: 'on:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]', placeholder: 'trigger on push + PR to main', hint: 'Run on every push to main AND every pull request targeting main.' },
  { id: 'RUNNER',  answer: 'runs-on: ubuntu-latest',                        placeholder: 'runner OS',               hint: 'GitHub\'s managed Ubuntu runner — free for public repos.' },
  { id: 'JAVA',    answer: 'uses: actions/setup-java@v3\n        with:\n          java-version: \'17\'\n          distribution: \'temurin\'', placeholder: 'set up Java 17', hint: 'Use the setup-java action with Java 17 Temurin distribution.' },
  { id: 'MVNTEST', answer: 'run: ./mvnw test',                              placeholder: 'run Spring Boot tests',   hint: 'Use the Maven wrapper to run all tests.' },
  { id: 'NODE',    answer: 'uses: actions/setup-node@v3\n        with:\n          node-version: \'18\'', placeholder: 'set up Node 18',   hint: 'Use the setup-node action with Node 18.' },
  { id: 'NPMTEST', answer: 'run: npm test -- --watchAll=false',             placeholder: 'run React tests',         hint: '--watchAll=false exits after running tests instead of watching.' },
];

const TEMPLATE = `# .github/workflows/ci.yml
name: CI — Test on every push

[TRIGGER]

jobs:
  test-backend:
    name: Spring Boot Tests
    [RUNNER]
    steps:
      - uses: actions/checkout@v3

      - name: Set up Java 17
        [JAVA]

      - name: Run tests
        working-directory: ./backend
        [MVNTEST]

  test-frontend:
    name: React Tests
    [RUNNER]
    steps:
      - uses: actions/checkout@v3

      - name: Set up Node 18
        [NODE]

      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci

      - name: Run tests
        working-directory: ./frontend
        [NPMTEST]`;

export default function Level7_5() {
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage7Shell levelId={5} canProceed={isCorrect}
      conceptReveal={[
        { label: 'Two Parallel Jobs', detail: 'test-backend and test-frontend run in parallel by default — no depends_on between them. GitHub spins up two separate Ubuntu VMs simultaneously. Total CI time is the longer of the two, not their sum.' },
        { label: 'working-directory', detail: 'The checkout action puts code in the root. working-directory: ./backend changes into that folder before running commands. Without it, ./mvnw would fail because it\'s not in the root.' },
        { label: 'Free CI Minutes', detail: 'GitHub Actions gives 2,000 free minutes/month for private repos, unlimited for public. Each job run counts separately. These two jobs might each take 2–3 minutes, costing ~4–6 minutes per push.' },
      ]}
    >
      <div className="s7-intro">
        <h1>GitHub Actions — CI</h1>
        <p className="s7-tagline">⚙️ Tests run automatically on every push. Broken code never reaches main.</p>
        <p className="s7-why">Without CI, a developer merges broken code and you find out when users report errors. With CI, tests fail on the pull request — before the merge — and the problem is caught immediately.</p>
      </div>

      <div className="s7-info">
        <p>Place this file at <code style={{color:'#ef4444'}}>.github/workflows/ci.yml</code> in your repo root. GitHub detects it automatically.</p>
      </div>

      <FillEditor template={TEMPLATE} blanks={BLANKS} onAllCorrect={() => setIsCorrect(true)} />
    </Stage7Shell>
  );
}
