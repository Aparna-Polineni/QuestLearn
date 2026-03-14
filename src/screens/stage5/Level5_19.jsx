// src/screens/stage5/Level5_19.jsx — N+1 & LAZY vs EAGER (DEBUG)
import { useState } from 'react';
import Stage5Shell from './Stage5Shell';
import './Level5_19.css';

const SUPPORT = {
  reveal: {
    concept: 'N+1 Query Problem',
    whatYouLearned: 'N+1 happens when you load N entities then access a lazy relationship on each one — triggering N extra queries. Fix with JOIN FETCH in JPQL or @EntityGraph. LAZY is safe until you iterate.',
    realWorldUse: 'Loading 100 patients and calling patient.getWard().getName() in a loop fires 101 queries. With JOIN FETCH it\'s 1. This is one of the most common JPA performance bugs in production.',
    developerSays: 'Use LAZY on all relationships by default. Only change to EAGER if you genuinely always need the data together. And always check your query count with Spring\'s show-sql=true in development.',
  },
};

const BUGS = [
  {
    id: 'n1',
    label: 'N+1 Problem — 101 queries instead of 1',
    bad: `// Loading 100 patients = 1 query ✓
List<Patient> patients = patientRepository.findAll();
// But then accessing ward on each = 100 MORE queries ✗
for (Patient p : patients) {
    System.out.println(p.getWard().getName()); // triggers SELECT per patient
}`,
    good: `// JOIN FETCH loads patients AND wards in ONE query ✓
@Query("SELECT p FROM Patient p JOIN FETCH p.ward")
List<Patient> findAllWithWard();

// Now iterate safely — no extra queries
for (Patient p : patients) {
    System.out.println(p.getWard().getName()); // already loaded
}`,
    explanation: 'JOIN FETCH in JPQL tells JPA to load the relationship in the same query. It generates a SQL JOIN instead of separate SELECT statements per entity.',
  },
  {
    id: 'eager',
    label: 'Wrong EAGER on @OneToMany',
    bad: `// EAGER on a collection = load ALL patients for EVERY ward query
@OneToMany(fetch = FetchType.EAGER)
private List<Patient> patients; // thousands of patients loaded every time!`,
    good: `// LAZY = load patients only when explicitly accessed
@OneToMany(fetch = FetchType.LAZY)  // default, explicitly stated
private List<Patient> patients;
// Load when needed with JOIN FETCH or @EntityGraph`,
    explanation: 'EAGER on @OneToMany loads the entire collection with every parent query. 1 ward query becomes: 1 ward SELECT + 1 patients SELECT. With 100 wards in a list: 101 queries.',
  },
  {
    id: 'showsql',
    label: 'How to detect the N+1 problem',
    bad: `# application.properties — production default (hides the problem)
spring.jpa.show-sql=false`,
    good: `# application.properties — development only
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
# Then watch the console — count the SELECT statements`,
    explanation: 'Turn on show-sql in development. If you see the same SELECT repeated many times with different IDs, you have an N+1 problem.',
  },
];

export default function Level5_19() {
  const [understood, setUnderstood] = useState(new Set());
  const toggle = (id) => setUnderstood(prev => { const s=new Set(prev); s.has(id)?s.delete(id):s.add(id); return s; });
  const allDone = BUGS.every(b=>understood.has(b.id));

  return (
    <Stage5Shell levelId={19} canProceed={allDone} conceptReveal={SUPPORT.reveal}>
      <div className="l519-container">
        <div className="l519-brief">
          <div className="l519-brief-tag">🐘 Stage 5 · Level 5.19 · DEBUG</div>
          <h2>N+1 Problem & LAZY vs EAGER — The Silent Performance Killer</h2>
          <p>The N+1 problem is the most common JPA performance bug. It's invisible in tests (small data), catastrophic in production (millions of rows). Study each pattern, understand the fix.</p>
        </div>

        {BUGS.map(bug => (
          <div key={bug.id} className={`l519-bug ${understood.has(bug.id)?'l519-bug--done':''}`}>
            <div className="l519-label">{bug.label}</div>
            <div className="l519-pair">
              <div className="l519-code l519-bad">
                <div className="l519-tag bad-tag">✗ PROBLEM</div>
                <pre><code>{bug.bad}</code></pre>
              </div>
              <div className="l519-code l519-good">
                <div className="l519-tag good-tag">✓ FIX</div>
                <pre><code>{bug.good}</code></pre>
              </div>
            </div>
            <div className="l519-explain">{bug.explanation}</div>
            <button className={`l519-btn ${understood.has(bug.id)?'l519-btn--done':''}`} onClick={()=>toggle(bug.id)}>
              {understood.has(bug.id)?'✓ Understood':'Mark as Understood'}
            </button>
          </div>
        ))}

        {!allDone && <p className="l519-prompt">Mark all {BUGS.length} patterns as understood to continue →</p>}
      </div>
    </Stage5Shell>
  );
}
