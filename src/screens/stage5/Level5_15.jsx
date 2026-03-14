// src/screens/stage5/Level5_15.jsx — Derived Query Methods (FILL)
import { useState } from 'react';
import Stage5Shell from './Stage5Shell';
import FillEditor from '../../components/FillEditor';
import './Level5_15.css';

const SUPPORT = {
  reveal: {
    concept: 'Derived Query Methods',
    whatYouLearned: 'Spring Data reads your method name and generates the SQL. findByWard → WHERE ward = ?. findByPriorityLessThan → WHERE priority < ?. The method name IS the query.',
    realWorldUse: 'These are the methods in your Stage 4 PatientRepository. No @Query needed for simple filters — just name the method right and Spring handles the SQL.',
    developerSays: 'Derived methods are great up to 2–3 conditions. Beyond that, switch to @Query — "findByWardAndPriorityLessThanAndActiveTrue" is unreadable.',
  },
};

const CODE_TEMPLATE = `@Repository
public interface PatientRepository
        extends JpaRepository<Patient, Long> {

    // WHERE ward = ?
    List<Patient> [[findByWard]](String ward);

    // WHERE priority < ?
    List<Patient> [[findByPriorityLessThan]](int priority);

    // WHERE ward = ? AND priority = ?
    List<Patient> [[findByWardAndPriority]](String ward, int priority);

    // WHERE name LIKE %?%
    List<Patient> [[findByNameContaining]](String keyword);

    // WHERE active = true
    List<Patient> [[findByActiveTrue]]();

    // ORDER BY priority ASC
    List<Patient> findByWardOrderBy[[Priority]]Asc(String ward);
}`;

const ANSWERS = ['findByWard','findByPriorityLessThan','findByWardAndPriority','findByNameContaining','findByActiveTrue','Priority'];

const KEYWORDS = [
  ['findBy',       'Start of every derived method'],
  ['And / Or',     'Combine multiple conditions'],
  ['LessThan',     '< (also: GreaterThan, Between)'],
  ['Containing',   'LIKE %val% (also: StartingWith, EndingWith)'],
  ['True / False', 'WHERE col = true / false'],
  ['OrderByColAsc','ORDER BY col ASC'],
];

export default function Level5_15() {
  const [isCorrect, setIsCorrect] = useState(false);
  return (
    <Stage5Shell levelId={15} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <div className="jpa-container">
        <div className="jpa-brief">
          <div className="jpa-brief-tag">🐘 Stage 5 · Level 5.15 · FILL</div>
          <h2>Derived Query Methods — The Method Name Is the SQL</h2>
          <p>Spring reads your repository method names and generates SQL automatically. <code>findByWard()</code> becomes <code>WHERE ward = ?</code>. No SQL, no implementation.</p>
        </div>
        <div className="jpa-ref">
          <div className="jpa-ref-label">Naming keywords → SQL</div>
          <div className="jpa-ref-grid">
            {KEYWORDS.map(([sig,note])=>(
              <div key={sig} className="jpa-ref-row"><code className="jpa-sig">{sig}</code><span className="jpa-note">{note}</span></div>
            ))}
          </div>
        </div>
        <FillEditor template={CODE_TEMPLATE} answers={ANSWERS} language="java" onCorrect={() => setIsCorrect(true)} />
      </div>
    </Stage5Shell>
  );
}
