// src/screens/stage5/Level5_21.jsx — Full DB Capstone (BUILD)
import { useState } from 'react';
import Stage5Shell from './Stage5Shell';

const TABS = ['Schema', 'Entities', 'Repository', 'Service'];

const REQUIREMENTS = {
  Schema: [
    { id: 's1', label: 'CREATE TABLE wards with id, name, floor' },
    { id: 's2', label: 'CREATE TABLE doctors with id, name, specialty' },
    { id: 's3', label: 'CREATE TABLE patients with id, name, ward_id FK' },
    { id: 's4', label: 'CREATE TABLE appointments with id, patient_id FK, doctor_id FK, fee, appt_date' },
  ],
  Entities: [
    { id: 'e1', label: 'Ward @Entity with @OneToMany patients (LAZY)' },
    { id: 'e2', label: 'Patient @Entity with @ManyToOne ward + @JoinColumn' },
    { id: 'e3', label: 'Appointment @Entity with @ManyToOne patient and doctor' },
    { id: 'e4', label: 'All @Id fields use @GeneratedValue(IDENTITY)' },
  ],
  Repository: [
    { id: 'r1', label: 'PatientRepository with findByWardId' },
    { id: 'r2', label: '@Query JOIN FETCH for patient + ward' },
    { id: 'r3', label: 'AppointmentRepository with findByPatientId' },
    { id: 'r4', label: 'countByWardId and existsByEmail on PatientRepository' },
  ],
  Service: [
    { id: 'sv1', label: '@Transactional on bookAppointment method' },
    { id: 'sv2', label: '@Transactional(readOnly=true) on all find methods' },
    { id: 'sv3', label: 'Maps entities to DTOs inside transaction (no lazy leaks)' },
    { id: 'sv4', label: 'Throws ResourceNotFoundException when entity not found' },
  ],
};

const CHECK_PATTERNS = {
  s1: c => c.includes('CREATE TABLE') && c.includes('wards') && c.includes('floor'),
  s2: c => c.includes('CREATE TABLE') && c.includes('doctors') && c.includes('specialty'),
  s3: c => c.includes('CREATE TABLE') && c.includes('patients') && c.includes('ward_id'),
  s4: c => c.includes('CREATE TABLE') && c.includes('appointments') && (c.includes('patient_id') || c.includes('PATIENT_ID')) && c.includes('fee'),
  e1: c => c.includes('@ENTITY') && c.includes('WARD') && c.includes('@ONETOMANY') && c.includes('LAZY'),
  e2: c => c.includes('@ENTITY') && c.includes('PATIENT') && c.includes('@MANYTOONE') && c.includes('@JOINCOLUMN'),
  e3: c => c.includes('@ENTITY') && c.includes('APPOINTMENT') && c.includes('@MANYTOONE'),
  e4: c => c.includes('@GENERATEDVALUE') && c.includes('IDENTITY'),
  r1: c => c.includes('JPAREPOSITORY') && c.includes('FINDBYWARDID'),
  r2: c => c.includes('@QUERY') && c.includes('JOIN FETCH') && c.includes('WARD'),
  r3: c => c.includes('FINDBYPATIENTIID') || c.includes('FINDBYPATIENTID'),
  r4: c => c.includes('COUNTBYWARDID') && c.includes('EXISTSBYEMAIL'),
  sv1: c => c.includes('@TRANSACTIONAL') && c.includes('BOOKAPPOINTMENT'),
  sv2: c => c.includes('READONLY') && (c.includes('TRUE') || c.includes('= TRUE')),
  sv3: c => c.includes('DTO') && c.includes('@TRANSACTIONAL'),
  sv4: c => c.includes('RESOURCENOTFOUNDEXCEPTION') || c.includes('ORELSETHROW'),
};

const SOLUTION = {
  Schema: `-- V1__create_tables.sql
CREATE TABLE wards (
  id        INT          PRIMARY KEY AUTO_INCREMENT,
  name      VARCHAR(100) NOT NULL,
  floor     INT          NOT NULL DEFAULT 1
);

CREATE TABLE doctors (
  id        INT          PRIMARY KEY AUTO_INCREMENT,
  name      VARCHAR(100) NOT NULL,
  specialty VARCHAR(100) NOT NULL
);

CREATE TABLE patients (
  id        INT          PRIMARY KEY AUTO_INCREMENT,
  name      VARCHAR(100) NOT NULL,
  email     VARCHAR(150) UNIQUE,
  ward_id   INT,
  confirmed BOOLEAN      DEFAULT FALSE,
  FOREIGN KEY (ward_id) REFERENCES wards(id)
);

CREATE TABLE appointments (
  id         INT          PRIMARY KEY AUTO_INCREMENT,
  patient_id INT          NOT NULL,
  doctor_id  INT          NOT NULL,
  fee        DECIMAL(10,2) NOT NULL,
  appt_date  DATE          NOT NULL,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (doctor_id)  REFERENCES doctors(id)
);`,
  Entities: `@Entity @Table(name="wards")
public class Ward {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    private String name;
    private int floor;
    @OneToMany(mappedBy="ward", fetch=FetchType.LAZY, cascade=CascadeType.ALL)
    private List<Patient> patients;
}

@Entity @Table(name="patients")
public class Patient {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false, length=100) private String name;
    @Column(unique=true, length=150)    private String email;
    private boolean confirmed;
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="ward_id")
    private Ward ward;
}

@Entity @Table(name="appointments")
public class Appointment {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="patient_id") private Patient patient;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="doctor_id")  private Doctor  doctor;
    @Column(precision=10, scale=2) private BigDecimal fee;
    private LocalDate apptDate;
}`,
  Repository: `public interface PatientRepository extends JpaRepository<Patient, Long> {
    List<Patient> findByWardId(Long wardId);
    boolean existsByEmail(String email);
    Long countByWardId(Long wardId);

    @Query("SELECT p FROM Patient p LEFT JOIN FETCH p.ward WHERE p.id = :id")
    Optional<Patient> findByIdWithWard(@Param("id") Long id);
}

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);
    @Query("SELECT SUM(a.fee) FROM Appointment a WHERE a.patient.ward.id = :wardId")
    BigDecimal sumFeesByWardId(@Param("wardId") Long wardId);
}`,
  Service: `@Service
public class PatientService {

    @Transactional(readOnly = true)
    public PatientDto findById(Long id) {
        Patient p = patientRepository.findByIdWithWard(id).orElseThrow(
            () -> new ResourceNotFoundException("Patient not found: " + id)
        );
        return new PatientDto(p.getId(), p.getName(), p.getWard().getName());
    }

    @Transactional
    public AppointmentDto bookAppointment(Long patientId, Long doctorId, BookingRequest req) {
        Patient p = patientRepository.findById(patientId).orElseThrow(...);
        Doctor  d = doctorRepository.findById(doctorId).orElseThrow(...);
        Appointment a = new Appointment(p, d, req.getFee(), req.getDate());
        return toDto(appointmentRepository.save(a));
    }

    @Transactional(readOnly = true)
    public List<PatientDto> findByWard(Long wardId) {
        return patientRepository.findByWardId(wardId)
            .stream().map(this::toDto).collect(toList());
    }
}`,
};

export default function Level5_21() {
  const [tab, setTab] = useState('Schema');
  const [code, setCode] = useState({ Schema:'', Entities:'', Repository:'', Service:'' });
  const [results, setResults] = useState({});
  const [checked, setChecked] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  function check() {
    const r = {};
    Object.entries(CHECK_PATTERNS).forEach(([id, fn]) => {
      r[id] = fn(code[tab]?.toUpperCase() || '');
    });
    // Run all tabs
    const allCode = Object.values(code).join('\n').toUpperCase();
    const allR = {};
    Object.entries(CHECK_PATTERNS).forEach(([id, fn]) => { allR[id] = fn(allCode); });
    setResults(allR);
    setChecked(true);
  }

  const tabReqs = REQUIREMENTS[tab] || [];
  const passCount = Object.values(results).filter(Boolean).length;
  const totalReqs = Object.values(REQUIREMENTS).flat().length;
  const allPass = checked && passCount === totalReqs;

  return (
    <Stage5Shell levelId={21} canProceed={allPass}
      conceptReveal={[
        { label: 'Stage 5 Complete', detail: 'You now know the full database stack: SQL schema design, JOINs and aggregates, JPA entities and relationships, JPQL and derived queries, @Transactional semantics, N+1 prevention, and Flyway migrations. This is what production-grade Spring Boot backends look like.' },
        { label: 'What Stage 6 Covers', detail: 'Full Stack Integration — connecting your React frontend (Stage 3) to your Spring Boot backend (Stage 4/5). CORS configuration, unified error handling, file uploads, WebSockets for real-time features, and end-to-end testing.' },
      ]}
    >
      <div className="s5-intro">
        <h1>Full DB Capstone</h1>
        <p className="s5-tagline">🏆 Hospital system — schema, entities, repositories, and service layer.</p>
        <p className="s5-why">Build the complete database layer for the hospital backend from Stage 4. Four tabs — write each piece, then check all requirements.</p>
      </div>

      {checked && (
        <div style={{background:'#1e293b',borderRadius:8,padding:'12px 16px',marginBottom:16,display:'flex',alignItems:'center',gap:12}}>
          <div style={{flex:1}}>
            <div style={{height:6,background:'#334155',borderRadius:3,overflow:'hidden'}}>
              <div style={{height:'100%',background:'#818cf8',borderRadius:3,width:`${(passCount/totalReqs)*100}%`,transition:'width .4s'}} />
            </div>
          </div>
          <span style={{color:'#818cf8',fontWeight:700,fontSize:14,whiteSpace:'nowrap'}}>{passCount}/{totalReqs} requirements</span>
        </div>
      )}

      {/* Tab bar */}
      <div style={{display:'flex',gap:4,marginBottom:16}}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding:'8px 18px', borderRadius:6, border:'none', cursor:'pointer', fontSize:13, fontWeight:600,
            background: tab===t ? '#818cf8' : '#1e293b',
            color: tab===t ? 'white' : '#64748b',
            transition:'all .15s',
          }}>{t}</button>
        ))}
      </div>

      {/* Requirements for current tab */}
      <div style={{marginBottom:12}}>
        {tabReqs.map(r => (
          <div key={r.id} style={{display:'flex',alignItems:'center',gap:10,padding:'6px 0',borderBottom:'1px solid #1e293b'}}>
            <span style={{color: !checked ? '#475569' : results[r.id] ? '#4ade80' : '#f87171', fontSize:14}}>
              {!checked ? '○' : results[r.id] ? '✓' : '✗'}
            </span>
            <span style={{color:'#cbd5e1',fontSize:13}}>{r.label}</span>
          </div>
        ))}
      </div>

      <div className="s5-java-panel">
        <div className="s5-java-header">✏️ {tab}</div>
        <textarea
          value={code[tab]}
          onChange={e => setCode(c => ({...c, [tab]: e.target.value}))}
          placeholder={`Write your ${tab} code here...`}
          style={{
            width:'100%', minHeight:260, background:'#0f172a', color:'#e2e8f0',
            border:'none', padding:'14px 16px', fontFamily:'Fira Code, monospace',
            fontSize:13, lineHeight:1.7, resize:'vertical', outline:'none', boxSizing:'border-box'
          }}
        />
      </div>

      <div style={{display:'flex',gap:10,marginTop:12,flexWrap:'wrap'}}>
        <button className="s5-check-btn" onClick={check}>Check All Tabs</button>
        <button className="s5-check-btn" style={{background:'#334155'}} onClick={() => setShowSolution(s=>!s)}>
          {showSolution ? 'Hide' : 'Show'} Solution
        </button>
      </div>

      {showSolution && (
        <div className="s5-java-panel" style={{marginTop:12}}>
          <div className="s5-java-header">✅ Reference — {tab}</div>
          <pre style={{padding:'14px 16px',margin:0,color:'#94a3b8',fontSize:12,lineHeight:1.7,overflowX:'auto'}}>{SOLUTION[tab]}</pre>
        </div>
      )}

      {checked && (
        <div className={`s5-feedback ${allPass?'success':'error'}`} style={{marginTop:12}}>
          {allPass
            ? '🎓 Stage 5 Complete! You have built a full, production-ready database layer.'
            : `❌ ${passCount}/${totalReqs} requirements met. Check all four tabs.`}
        </div>
      )}
    </Stage5Shell>
  );
}
