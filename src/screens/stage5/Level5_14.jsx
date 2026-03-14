// src/screens/stage5/Level5_14.jsx — JpaRepository (FILL)
import { useState } from 'react';
import Stage5Shell from './Stage5Shell';
import FillEditor from '../../components/FillEditor';
import './Level5_14.css';

const SUPPORT = {
  reveal: {
    concept: 'JpaRepository',
    whatYouLearned: 'JpaRepository<Entity, ID> gives you 20+ methods for free — save(), findById(), findAll(), delete(), count(). Spring generates the implementation at startup. You write zero SQL for standard CRUD.',
    realWorldUse: 'Every repository in your hospital system extends JpaRepository. PatientRepository, DoctorRepository, WardRepository — one interface declaration gives you a complete DAO layer.',
    developerSays: 'JpaRepository extends CrudRepository which extends Repository. The two type params must match your @Entity class and its @Id type. Patient uses Long — so it\'s JpaRepository<Patient, Long>.',
  },
};

const CODE_TEMPLATE = `// One interface = full CRUD automatically
@Repository
public interface PatientRepository
        extends [[JpaRepository]]<[[Patient]], [[Long]]> {

    // All of these are FREE — no implementation needed:
    // save(patient)       → INSERT or UPDATE
    // findById(id)        → SELECT WHERE id = ?
    // findAll()           → SELECT *
    // deleteById(id)      → DELETE WHERE id = ?
    // count()             → SELECT COUNT(*)
    // existsById(id)      → SELECT 1 WHERE id = ?
}`;

const ANSWERS = ['JpaRepository', 'Patient', 'Long'];

export default function Level5_14() {
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage5Shell levelId={14} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <div className="jpa-container">
        <div className="jpa-brief">
          <div className="jpa-brief-tag">🐘 Stage 5 · Level 5.14 · FILL</div>
          <h2>JpaRepository — Free Database Methods From One Interface</h2>
          <p>Extend <code>JpaRepository</code> and Spring writes the SQL for you. Standard CRUD operations — no boilerplate, no SQL, no implementation class needed.</p>
        </div>

        <div className="jpa-ref">
          <div className="jpa-ref-label">Generated SQL for free methods</div>
          <div className="jpa-ref-grid">
            {[
              ['save(entity)',      'INSERT if new, UPDATE if id exists'],
              ['findById(id)',      'SELECT * FROM patients WHERE id = ?'],
              ['findAll()',         'SELECT * FROM patients'],
              ['deleteById(id)',    'DELETE FROM patients WHERE id = ?'],
              ['count()',           'SELECT COUNT(*) FROM patients'],
              ['existsById(id)',    'SELECT COUNT(*) > 0 WHERE id = ?'],
            ].map(([sig,note])=>(
              <div key={sig} className="jpa-ref-row"><code className="jpa-sig">{sig}</code><span className="jpa-note">{note}</span></div>
            ))}
          </div>
        </div>

        <FillEditor template={CODE_TEMPLATE} answers={ANSWERS} language="java" onCorrect={() => setIsCorrect(true)} />
      </div>
    </Stage5Shell>
  );
}
