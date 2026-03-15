// src/screens/stage5/Level5_15.jsx — JPQL with @Query (FILL, Java)
import { useState } from 'react';
import Stage5Shell from './Stage5Shell';
import FillEditor from '../stage2/FillEditor';

const BLANKS = [
  { id: 'QUERY1', answer: '@Query("SELECT p FROM Patient p WHERE p.ward.id = :wardId")',         placeholder: '@Query for ward filter',     hint: 'JPQL: use class name (Patient), field name (ward.id), not table/column.' },
  { id: 'PARAM1', answer: '@Param("wardId") Long wardId',                                          placeholder: '@Param parameter',           hint: 'Bind :wardId in the query to the wardId method parameter.' },
  { id: 'QUERY2', answer: '@Query("SELECT p FROM Patient p WHERE p.name LIKE %:name%")',           placeholder: '@Query LIKE search',         hint: 'JPQL LIKE uses % — same as SQL. :name is the parameter.' },
  { id: 'QUERY3', answer: '@Query("SELECT p FROM Patient p LEFT JOIN FETCH p.ward WHERE p.id = :id")', placeholder: '@Query with JOIN FETCH', hint: 'JOIN FETCH loads the related entity in one query — prevents N+1.' },
  { id: 'NATIVE', answer: '@Query(value = "SELECT * FROM patients WHERE ward_id = :wardId", nativeQuery = true)', placeholder: '@Query native SQL', hint: 'nativeQuery=true uses raw SQL, not JPQL.' },
];

const TEMPLATE = `import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    // JPQL — filter by ward id (navigate relationship with dot notation)
    [QUERY1]
    List<Patient> findByWardId([PARAM1]);

    // JPQL — search by name containing a string
    [QUERY2]
    List<Patient> searchByName(@Param("name") String name);

    // JPQL — JOIN FETCH to load ward in the same query (avoids N+1)
    [QUERY3]
    Optional<Patient> findByIdWithWard(@Param("id") Long id);

    // Native SQL — for complex queries JPQL can't express
    [NATIVE]
    List<Patient> findByWardNative(@Param("wardId") Long wardId);
}`;

export default function Level5_15() {
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage5Shell levelId={15} canProceed={isCorrect}
      conceptReveal={[
        { label: 'JPQL vs SQL', detail: 'JPQL uses Java class names and field names: FROM Patient p WHERE p.ward.id = 1. SQL uses table/column names: FROM patients WHERE ward_id = 1. JPQL is database-agnostic — switch from MySQL to PostgreSQL with no query changes.' },
        { label: 'JOIN FETCH', detail: 'Without JOIN FETCH: accessing patient.getWard() triggers a separate SELECT for each patient (N+1 problem). With JOIN FETCH: one query loads both patient and ward together. Always use JOIN FETCH when you know you\'ll access the relationship.' },
        { label: 'nativeQuery = true', detail: 'Escape to raw SQL when JPQL can\'t express what you need: window functions, database-specific functions, complex CTEs. The result still maps to your entity or a projection interface.' },
      ]}
    >
      <div className="s5-intro">
        <h1>JPQL with @Query</h1>
        <p className="s5-tagline">🔍 Write custom queries in Java — more powerful than derived methods.</p>
        <p className="s5-why">Derived methods handle 80% of queries. @Query handles the rest — complex filters, JOIN FETCH for N+1 prevention, and native SQL escapes.</p>
      </div>
      <FillEditor template={TEMPLATE} blanks={BLANKS} onAllCorrect={() => setIsCorrect(true)} />
    </Stage5Shell>
  );
}
