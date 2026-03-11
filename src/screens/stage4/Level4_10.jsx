// src/screens/stage4/Level4_10.jsx — Filtering & Custom Queries (FILL)
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage4Shell from './Stage4Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from '../stage2/FillEditor';
import './Level4_10.css';

const SUPPORT = {
  intro: {
    concept: 'Custom Queries with @Query and Derived Methods',
    tagline: 'Derived methods cover 80% of queries. @Query covers the rest.',
    whatYouWillDo: 'Add two custom query methods to PatientRepository: one using Spring\'s derived query naming convention, and one using @Query with JPQL for a more complex filter.',
    whyItMatters: 'Real applications need more than findAll(). Filter by ward AND priority. Search by name. Find patients admitted this week. @Query and derived methods give you full control without writing SQL boilerplate.',
  },
  hints: [
    'Derived query method names: findBy + FieldName + Condition. findByWardAndPriority(ward, priority) → WHERE ward = ? AND priority = ?. Spring generates the SQL from the method name.',
    '@Query uses JPQL — Java Persistence Query Language. It looks like SQL but references Java class names and field names, not table/column names. FROM Patient p WHERE p.name LIKE %:name%.',
    'Named parameters in @Query: :ward binds to the method parameter named ward. Use @Param("ward") String ward to name the parameter explicitly.',
  ],
  reveal: {
    concept: 'Derived Queries & @Query JPQL',
    whatYouLearned: 'Derived query method names: findBy + fields + conditions. Supported keywords: And, Or, Between, LessThan, GreaterThan, Like, Containing, StartingWith, OrderBy. @Query for complex queries — uses JPQL (FROM ClassName, not FROM table_name). @Param binds named parameters.',
    realWorldUse: 'Hospital dashboard: findByWardOrderByAdmissionDateDesc (latest in ward). findByPriorityIn(List<Priority> priorities) (multiple priorities). @Query for "patients admitted in last 24 hours". These replace hundreds of lines of SQL with a few method names.',
    developerSays: 'Derived methods first — they are readable and require no code. When they get too complex (3+ conditions, joins, aggregations), switch to @Query. Never write native SQL unless JPQL cannot do it — JPQL is database-agnostic.',
  },
};

const TEMPLATE = `import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    // FILL 1 & 2: Find patients by ward AND priority using derived query naming
    // Spring generates: SELECT * FROM patient WHERE ward = ? AND priority = ?
    List<Patient> findBy___WARD___And___PRIORITY___(String ward, String priority);

    // FILL 3: Custom JPQL query — search patients by name (case-insensitive)
    // :name is a named parameter — bound to the method parameter via @Param
    ___QUERY___("SELECT p FROM Patient p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Patient> searchByName(___PARAM___("name") String name);

    // Bonus: find all patients ordered by admission date descending
    List<Patient> findAllByOrderBy___ADMISSIONDATE___Desc();
}`;

const BLANKS = [
  { id: 'WARD',          answer: 'Ward',          placeholder: 'field',       hint: 'Capitalise the first letter of the field name in derived methods: ward → Ward.' },
  { id: 'PRIORITY',      answer: 'Priority',      placeholder: 'field',       hint: 'Same pattern: priority → Priority. Spring reads: AND priority = ?.' },
  { id: 'QUERY',         answer: '@Query',         placeholder: 'annotation',  hint: 'Annotation for custom JPQL (or SQL) queries on repository methods.' },
  { id: 'PARAM',         answer: '@Param',         placeholder: 'annotation',  hint: 'Binds the method parameter to the named parameter in the @Query string.' },
  { id: 'ADMISSIONDATE', answer: 'AdmissionDate',  placeholder: 'field',       hint: 'OrderBy + field name + direction (Desc/Asc). admissionDate → AdmissionDate.' },
];

const ANATOMY = [
  { label: 'findByWardAndPriority',         desc: 'WHERE ward = ? AND priority = ?' },
  { label: 'findByAgeGreaterThan(int age)', desc: 'WHERE age > ?' },
  { label: 'findByNameContainingIgnoreCase', desc: 'WHERE LOWER(name) LIKE \'%x%\'' },
  { label: 'findAllByOrderByNameAsc',        desc: 'ORDER BY name ASC' },
  { label: '@Query("SELECT p FROM Patient p WHERE...")', desc: 'custom JPQL query' },
  { label: '@Param("name") String name',    desc: 'binds :name parameter in @Query' },
];

export default function Level4_10() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage4Shell levelId={10} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l410-container">
          <div className="l410-brief">
            <div className="l410-brief-tag">// Fill Mission — Custom Queries</div>
            <h2>Add filtering and search to your <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'hospital'}</span> patient repository.</h2>
            <p>5 blanks. Build a derived query method and a custom @Query — the two tools that cover every query your API will ever need.</p>
          </div>
          <div className="l410-anatomy">
            <div className="l410-anatomy-title">// Query Methods Reference</div>
            <div className="l410-anatomy-rows">
              {ANATOMY.map(a => (
                <div key={a.label} className="l410-anat-row">
                  <span className="l410-anat-annotation">{a.label}</span>
                  <span className="l410-anat-desc">— {a.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <FillEditor template={TEMPLATE} blanks={BLANKS} onAllCorrect={() => setIsCorrect(true)} />
        </div>
      </LevelSupportWrapper>
    </Stage4Shell>
  );
}