// src/screens/stage5/Level5_17.jsx — Repository Capstone (BUILD)
import { useState } from 'react';
import Stage5Shell from './Stage5Shell';

const REQUIREMENTS = [
  { id: 'r1', label: 'Extends JpaRepository<Patient, Long>' },
  { id: 'r2', label: 'findByWardId(Long wardId)' },
  { id: 'r3', label: 'findByNameContainingIgnoreCase(String name)' },
  { id: 'r4', label: '@Query with JOIN FETCH for ward' },
  { id: 'r5', label: 'countByWardId(Long wardId)' },
  { id: 'r6', label: 'existsByEmail(String email)' },
  { id: 'r7', label: '@Modifying deleteByConfirmedFalse()' },
];

const SOLUTION = `import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    // Derived methods
    List<Patient> findByWardId(Long wardId);
    List<Patient> findByNameContainingIgnoreCase(String name);
    Long countByWardId(Long wardId);
    boolean existsByEmail(String email);

    // JOIN FETCH — load patient + ward in one query
    @Query("SELECT p FROM Patient p LEFT JOIN FETCH p.ward WHERE p.id = :id")
    Optional<Patient> findByIdWithWard(@Param("id") Long id);

    // Bulk delete unconfirmed
    @Modifying
    @Transactional
    void deleteByConfirmedFalse();
}`;

export default function Level5_17() {
  const [code, setCode]       = useState('');
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState({});

  function check() {
    const c = code.toUpperCase();
    const r = {
      r1: c.includes('JPAREPOSITORY') && c.includes('PATIENT') && c.includes('LONG'),
      r2: c.includes('FINDBYWARDID'),
      r3: c.includes('FINDBYNAME') && c.includes('CONTAINING') && c.includes('IGNORECASE'),
      r4: c.includes('@QUERY') && c.includes('JOIN FETCH') && c.includes('WARD'),
      r5: c.includes('COUNTBYWARDID'),
      r6: c.includes('EXISTSBYEMAIL'),
      r7: c.includes('@MODIFYING') && c.includes('DELETEBYCONFIRMED'),
    };
    setResults(r);
    setChecked(true);
  }

  const allPass = checked && Object.values(results).every(Boolean);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <Stage5Shell levelId={17} canProceed={allPass}
      conceptReveal={[
        { label: 'Repository as Contract', detail: 'The repository interface is the contract between your service layer and the database. Services call it without knowing whether the implementation is MySQL, PostgreSQL, or an in-memory test DB. This is the power of the Repository pattern.' },
        { label: 'Combining Derived + @Query', detail: 'Use derived methods for simple lookups. Use @Query when you need JOIN FETCH (N+1 prevention), complex JPQL, or native SQL. Both live in the same interface — pick the right tool per method.' },
      ]}
    >
      <div className="s5-intro">
        <h1>Repository Capstone</h1>
        <p className="s5-tagline">🏗️ Build the full PatientRepository from scratch.</p>
        <p className="s5-why">Combine everything from levels 15 and 16 — derived methods, @Query with JOIN FETCH, and @Modifying for writes — into one production-ready repository.</p>
      </div>

      <div className="s5-concepts" style={{marginBottom:16}}>
        {REQUIREMENTS.map(r => (
          <div key={r.id} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:'1px solid #1e293b'}}>
            <span style={{color: !checked ? '#475569' : results[r.id] ? '#4ade80' : '#f87171', fontSize:16}}>
              {!checked ? '○' : results[r.id] ? '✓' : '✗'}
            </span>
            <span style={{color:'#cbd5e1',fontSize:14}}>{r.label}</span>
          </div>
        ))}
      </div>

      <div className="s5-java-panel">
        <div className="s5-java-header">✏️ Write your PatientRepository interface</div>
        <textarea
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="public interface PatientRepository extends JpaRepository<Patient, Long> { ... }"
          style={{
            width:'100%', minHeight:300, background:'#0f172a', color:'#e2e8f0',
            border:'none', padding:'16px', fontFamily:'Fira Code, monospace',
            fontSize:13, lineHeight:1.7, resize:'vertical', outline:'none',
            boxSizing:'border-box'
          }}
        />
      </div>

      <div style={{display:'flex',gap:12,marginTop:12}}>
        <button className="s5-check-btn" onClick={check}>Check Requirements</button>
        <button className="s5-check-btn" style={{background:'#334155'}} onClick={() => setShowSolution(s=>!s)}>
          {showSolution ? 'Hide' : 'Show'} Solution
        </button>
      </div>

      {showSolution && (
        <div className="s5-java-panel" style={{marginTop:12}}>
          <div className="s5-java-header">✅ Reference Solution</div>
          <pre style={{padding:16,margin:0,color:'#94a3b8',fontSize:13,lineHeight:1.7,overflowX:'auto'}}>{SOLUTION}</pre>
        </div>
      )}

      {checked && (
        <div className={`s5-feedback ${allPass?'success':'error'}`}>
          {allPass
            ? '✅ Complete repository built! This is production-quality Spring Data JPA.'
            : `❌ ${Object.values(results).filter(Boolean).length}/${REQUIREMENTS.length} requirements met. Check what's missing above.`}
        </div>
      )}
    </Stage5Shell>
  );
}
