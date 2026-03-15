// src/screens/stage5/Level5_18.jsx — @Transactional (FILL, Java)
import { useState } from 'react';
import Stage5Shell from './Stage5Shell';
import FillEditor from '../stage2/FillEditor';

const BLANKS = [
  { id: 'TXN1',    answer: '@Transactional',                                         placeholder: 'wrap method in a transaction', hint: 'Spring opens BEGIN before the method and COMMIT after.' },
  { id: 'ROLL',    answer: '@Transactional(rollbackOn = Exception.class)',            placeholder: '@Transactional that rolls back on any exception', hint: 'By default only RuntimeException triggers rollback. This rolls back on checked exceptions too.' },
  { id: 'READONLY',answer: '@Transactional(readOnly = true)',                        placeholder: '@Transactional for read-only methods', hint: 'Tells Hibernate this is a read — enables optimisations, no dirty checking.' },
  { id: 'PROP',    answer: 'Propagation.REQUIRES_NEW',                               placeholder: 'start a NEW transaction', hint: 'Suspend the current transaction and start a brand new one.' },
  { id: 'ISO',     answer: 'Isolation.READ_COMMITTED',                               placeholder: 'isolation level', hint: 'Only see data that has been committed — prevents dirty reads.' },
];

const TEMPLATE = `import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;

@Service
public class PatientService {

    // Basic — wraps the method: BEGIN → method → COMMIT (or ROLLBACK on RuntimeException)
    [TXN1]
    public Patient transferPatient(Long patientId, Long newWardId) {
        Patient p = patientRepository.findById(patientId).orElseThrow();
        wardRepository.decrementCapacity(p.getWard().getId());
        wardRepository.incrementCapacity(newWardId);
        p.setWard(wardRepository.getReferenceById(newWardId));
        return patientRepository.save(p);
        // If ANY line above throws → ROLLBACK, no partial state saved
    }

    // Rolls back on checked exceptions too
    [ROLL]
    public void bookAppointment(Long patientId, Long doctorId) throws SchedulingException {
        // Checked exception also triggers rollback
    }

    // Read-only — no dirty checking, faster queries
    [READONLY]
    public List<Patient> getPatientsByWard(Long wardId) {
        return patientRepository.findByWardId(wardId);
    }

    // REQUIRES_NEW — audit log must save even if outer transaction rolls back
    @Transactional(propagation = [PROP])
    public void saveAuditLog(String action) {
        auditRepository.save(new AuditLog(action));
    }

    // Custom isolation level — prevents dirty reads
    @Transactional(isolation = [ISO])
    public BigDecimal calculateTotalFees(Long wardId) {
        return appointmentRepository.sumFeesByWardId(wardId);
    }
}`;

export default function Level5_18() {
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage5Shell levelId={18} canProceed={isCorrect}
      conceptReveal={[
        { label: 'Default Rollback Behaviour', detail: '@Transactional only rolls back on RuntimeException (and its subclasses) by default. Checked exceptions (IOException, SchedulingException) do NOT trigger rollback unless you specify rollbackOn=Exception.class. This catches many developers by surprise.' },
        { label: 'readOnly = true', detail: 'Marks the transaction as read-only. Hibernate skips dirty checking (tracking entity changes), which reduces memory and CPU overhead. Use on all read-only service methods — it\'s a free optimisation.' },
        { label: 'Propagation.REQUIRES_NEW', detail: 'The current transaction is suspended. A new transaction begins, commits or rolls back independently, then the original continues. Use for audit logs, notifications — things that must save even if the main operation fails.' },
      ]}
    >
      <div className="s5-intro">
        <h1>@Transactional</h1>
        <p className="s5-tagline">🔒 Spring\'s wrapper around SQL BEGIN / COMMIT / ROLLBACK.</p>
        <p className="s5-why">
          In Stage 4 you put @Transactional on repository methods. Here you understand
          the full API — rollbackOn, readOnly, propagation, isolation — and when each matters.
        </p>
      </div>

      <table className="s5-table">
        <thead><tr><th>Attribute</th><th>Default</th><th>Change When</th></tr></thead>
        <tbody>
          {[
            ['rollbackOn','RuntimeException','Checked exceptions should also roll back'],
            ['readOnly','false','Method only reads — enable for all findBy methods'],
            ['propagation','REQUIRED (join existing)','Need a fresh independent transaction (audit)'],
            ['isolation','DEFAULT (DB default)','Need to prevent dirty/phantom reads'],
            ['timeout','-1 (none)','Query should fail after N seconds'],
          ].map(([a,d,w],i)=>(
            <tr key={i}>
              <td style={{color:'#818cf8'}}><code>{a}</code></td>
              <td style={{color:'#94a3b8',fontSize:13}}>{d}</td>
              <td style={{color:'#64748b',fontSize:13}}>{w}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <FillEditor template={TEMPLATE} blanks={BLANKS} onAllCorrect={() => setIsCorrect(true)} />
    </Stage5Shell>
  );
}
