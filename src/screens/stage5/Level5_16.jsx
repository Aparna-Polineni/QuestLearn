// src/screens/stage5/Level5_16.jsx — Derived Query Methods (FILL, Java)
import { useState } from 'react';
import Stage5Shell from './Stage5Shell';
import FillEditor from '../stage2/FillEditor';

const BLANKS = [
  { id: 'M1', answer: 'findByWardId',                         placeholder: 'find by ward ID',          hint: 'Simple equality on wardId field.' },
  { id: 'M2', answer: 'findByNameContainingIgnoreCase',       placeholder: 'case-insensitive search',   hint: 'LIKE %name% with case ignored.' },
  { id: 'M3', answer: 'findByWardIdAndConfirmed',             placeholder: 'two conditions with AND',   hint: 'Both wardId AND confirmed must match.' },
  { id: 'M4', answer: 'findByAdmittedAtBetween',              placeholder: 'date range query',          hint: 'Between two dates — Spring adds BETWEEN in SQL.' },
  { id: 'M5', answer: 'findTop5ByOrderByIdDesc',              placeholder: 'latest 5 records',          hint: 'Top5 = LIMIT 5, OrderByIdDesc = ORDER BY id DESC.' },
  { id: 'M6', answer: 'countByWardId',                        placeholder: 'count per ward',            hint: 'Returns Long, not a List.' },
  { id: 'M7', answer: 'existsByEmail',                        placeholder: 'check email uniqueness',    hint: 'Returns boolean — faster than findBy + check null.' },
  { id: 'M8', answer: 'deleteByConfirmedFalse',               placeholder: 'bulk delete unconfirmed',   hint: 'Deletes all rows where confirmed = false.' },
];

const TEMPLATE = `public interface PatientRepository extends JpaRepository<Patient, Long> {

    // WHERE ward_id = ?
    List<Patient> [M1](Long wardId);

    // WHERE LOWER(name) LIKE LOWER('%?%')
    List<Patient> [M2](String name);

    // WHERE ward_id = ? AND confirmed = ?
    List<Patient> [M3](Long wardId, boolean confirmed);

    // WHERE admitted_at BETWEEN ? AND ?
    List<Patient> [M4](LocalDate start, LocalDate end);

    // SELECT ... ORDER BY id DESC LIMIT 5
    List<Patient> [M5]();

    // SELECT COUNT(*) WHERE ward_id = ?
    Long [M6](Long wardId);

    // SELECT COUNT(*) > 0 WHERE email = ?
    boolean [M7](String email);

    // DELETE WHERE confirmed = false
    @Modifying @Transactional
    void [M8]();
}`;

export default function Level5_16() {
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage5Shell levelId={16} canProceed={isCorrect}
      conceptReveal={[
        { label: 'Derived Method Grammar', detail: 'findBy[Field][Condition][And/Or][Field]: findByWardIdAndConfirmed. Keywords: Containing=LIKE %%, StartingWith=LIKE %%, Between, LessThan, GreaterThan, IsNull, OrderBy, Top/First, Count, Exists, Delete.' },
        { label: 'existsBy vs findBy + null check', detail: 'existsByEmail returns boolean with SELECT COUNT(*) > 0 — much faster than loading the full entity. Always use existsBy for uniqueness checks (registration, email validation).' },
        { label: '@Modifying for writes', detail: 'DELETE and UPDATE derived methods need @Modifying + @Transactional on the method. Without @Modifying, Spring Data treats all queries as reads and throws an exception.' },
      ]}
    >
      <div className="s5-intro">
        <h1>Derived Query Methods</h1>
        <p className="s5-tagline">🪄 Spring reads the method name and generates the SQL. No @Query needed.</p>
        <p className="s5-why">These are the most common JPA queries. Learning the naming grammar means you can write any filter, sort, or count without a single line of SQL.</p>
      </div>

      <table className="s5-table">
        <thead><tr><th>Keyword</th><th>SQL</th><th>Example</th></tr></thead>
        <tbody>
          {[
            ['Containing','LIKE %x%','findByNameContaining'],
            ['Between','BETWEEN a AND b','findByDateBetween'],
            ['And / Or','AND / OR','findByWardAndConfirmed'],
            ['OrderBy','ORDER BY','findByWardOrderByName'],
            ['Top5','LIMIT 5','findTop5ByOrderById'],
            ['Exists','COUNT > 0','existsByEmail'],
            ['Count','COUNT(*)','countByWard'],
          ].map(([k,s,e],i)=>(
            <tr key={i}><td style={{color:'#818cf8'}}>{k}</td><td><code>{s}</code></td><td style={{color:'#94a3b8',fontSize:12}}>{e}</td></tr>
          ))}
        </tbody>
      </table>

      <FillEditor template={TEMPLATE} blanks={BLANKS} onAllCorrect={() => setIsCorrect(true)} />
    </Stage5Shell>
  );
}
