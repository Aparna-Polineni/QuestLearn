// src/screens/stage4/Level4_4.jsx — The Repository
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage4Shell from './Stage4Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from '../stage2/FillEditor';
import './Level4_4.css';

const SUPPORT = {
  intro: {
    concept: 'The Repository — Free Database Queries',
    tagline: 'Extend one interface. Get dozens of database methods for free.',
    whatYouWillDo: 'Fill in the repository interface declaration — extend JpaRepository with the right types, then add a custom query method by naming it correctly.',
    whyItMatters: 'The repository is where Java meets the database. With Spring Data JPA, you write zero SQL for standard operations. Just declare the interface — Spring generates all the code at startup.',
  },
  hints: [
    'JpaRepository<EntityType, IdType> — first type is the entity class, second is the type of the @Id field. Patient uses Long for its ID.',
    'Custom queries are generated from the method name. findByWard(String ward) generates: SELECT * FROM patients WHERE ward = ?. Spring reads the method name and builds the SQL.',
    'findByWardAndPriority finds by two fields. findByWardOrderByNameAsc sorts results. The method name IS the query.',
  ],
  reveal: {
    concept: 'Spring Data JPA Repositories',
    whatYouLearned: 'JpaRepository gives you: findAll(), findById(), save(), delete(), count(), existsById() — for free. Custom queries come from method names. Spring reads "findByWard" and generates the SQL. For complex queries, use @Query with JPQL.',
    realWorldUse: 'In a real hospital system: patientRepo.findByWard("ICU") returns all ICU patients. patientRepo.findByPriorityAndActiveTrue("CRITICAL") finds critical active patients. All zero SQL — just method names. Spring Data JPA handles 80% of your database layer automatically.',
    developerSays: 'The repository pattern is one of the best ideas in software. Your service asks for patients. It does not care HOW they are fetched — database, cache, API. The repository is the boundary. Swap implementations without changing the rest of the code.',
  },
};

const TEMPLATE = `import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

// FILL 1: Extend JpaRepository for Patient entities with Long IDs
public interface PatientRepository extends ___JPAREPO___ {

    // FILL 2: Find all patients in a specific ward
    // Spring generates: SELECT * FROM patients WHERE ward = ?
    ___FIND_BY_WARD___(String ward);

    // FILL 3: Find by ward AND priority
    // Spring generates: SELECT * FROM patients WHERE ward = ? AND priority = ?
    ___FIND_BY_BOTH___(String ward, String priority);

    // FILL 4: Count patients in a ward
    // Spring generates: SELECT COUNT(*) FROM patients WHERE ward = ?
    ___COUNT_BY_WARD___(String ward);
}`;

const BLANKS = [
  { id: 'JPAREPO',        answer: 'JpaRepository<Patient, Long>', placeholder: 'type params',   hint: 'First type = entity class. Second type = ID field type. Patient ID is Long.' },
  { id: 'FIND_BY_WARD',   answer: 'List<Patient> findByWard',     placeholder: 'method',        hint: 'Returns a list. Method name = find + By + FieldName. Spring generates the SQL.' },
  { id: 'FIND_BY_BOTH',   answer: 'List<Patient> findByWardAndPriority', placeholder: 'method', hint: 'Chain field names with And. findByWardAndPriority finds rows matching both.' },
  { id: 'COUNT_BY_WARD',  answer: 'long countByWard',             placeholder: 'method',        hint: 'countBy returns a number. long (lowercase) is fine for count results.' },
];

const ANATOMY = [
  { method: 'findAll()',                         sql: 'SELECT * FROM patients' },
  { method: 'findById(1L)',                      sql: 'SELECT * FROM patients WHERE id=1' },
  { method: 'findByWard("ICU")',                 sql: 'WHERE ward = "ICU"' },
  { method: 'findByWardAndPriority(w, p)',       sql: 'WHERE ward=? AND priority=?' },
  { method: 'countByWard("ICU")',               sql: 'SELECT COUNT(*) WHERE ward="ICU"' },
  { method: 'save(patient)',                     sql: 'INSERT or UPDATE' },
  { method: 'deleteById(1L)',                    sql: 'DELETE WHERE id=1' },
];

export default function Level4_4() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage4Shell levelId={4} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l44-container">
          <div className="l44-brief">
            <div className="l44-brief-tag">// Fill Mission — Repository</div>
            <h2>Build the data access layer for the <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'hospital'}</span> database.</h2>
            <p>One interface, four blanks. Spring generates all the SQL from the method names you declare.</p>
          </div>

          <div className="l44-anatomy">
            <div className="l44-anatomy-title">// Method Name → SQL (Spring Data JPA)</div>
            <div className="l44-anatomy-rows">
              {ANATOMY.map(a => (
                <div key={a.method} className="l44-anat-row">
                  <span className="l44-anat-method">{a.method}</span>
                  <span className="l44-anat-arrow">→</span>
                  <span className="l44-anat-sql">{a.sql}</span>
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