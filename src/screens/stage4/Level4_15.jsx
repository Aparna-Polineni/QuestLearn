// src/screens/stage4/Level4_15.jsx — Full Backend Capstone (BUILD)
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage4Shell from './Stage4Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import CodeEditor from '../stage2/CodeEditor';
import './Level4_15.css';

const SUPPORT = {
  intro: {
    concept: 'Stage 4 Capstone — The Complete Backend',
    tagline: 'Every layer. One feature. A complete, production-shaped backend.',
    whatYouWillDo: 'Build the complete PatientService — the most important layer of the backend. It must: validate input, fetch with filters, create with priority defaulting, update ward/priority, discharge (delete), and throw the right exceptions for each error case.',
    whyItMatters: 'The service is where the hospital system\'s rules live. Wrong ward? Reject. Duplicate patient? Reject. Discharge from wrong ward? Reject. A well-built service means the entire system behaves correctly regardless of which controller or UI calls it.',
  },
  hints: [
    'admitPatient(): validate ward exists (throw if not), default priority to NORMAL if null, call repo.save(). Return the saved patient with its generated ID.',
    'getPatients(ward, priority): if ward is "all" fetch all, else findByWard. Then filter in Java by priority if priority is not "all". Return the filtered list.',
    'dischargePatient(id): find by ID first (throw RuntimeException("Patient not found") if absent). Then repo.deleteById(id).',
    'updatePatient(id, data): find existing (throw if absent). Update only non-null fields from data. Return repo.save(existing).',
  ],
  reveal: {
    concept: 'Stage 4 Complete — Spring Boot Backend',
    whatYouLearned: 'You have built: Entity (@Entity, @Id, relationships), Repository (JpaRepository, derived methods, @Query), Service (business logic, validation, exceptions), Controller (@RestController, all HTTP verbs, ResponseEntity), Security (@EnableWebSecurity, JWT), and Tests (MockMvc). This is the complete Spring Boot stack. Stage 5 adds the database configuration and deployment.',
    realWorldUse: 'This PatientService is the core of the hospital backend. Real production services handle transactions (@Transactional), caching (@Cacheable), async operations (@Async), and events (ApplicationEventPublisher). The structure you\'ve built scales to all of those.',
    developerSays: 'The service is where you earn your salary. Controllers are boilerplate. Repositories are framework magic. But the service — the rules, the edge cases, the validation — that is where thinking happens. Write it carefully, test it thoroughly, and document the non-obvious rules.',
  },
};

const STARTER = `import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.*;
import java.util.stream.*;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private WardRepository wardRepository;

    private static final Set<String> PRIORITIES = Set.of("NORMAL", "HIGH", "CRITICAL");

    // TODO: admitPatient(Patient patient)
    // 1. Validate: ward must exist in wardRepository (throw IllegalArgumentException if not)
    // 2. Validate: priority must be in PRIORITIES (default to "NORMAL" if null, throw if invalid)
    // 3. Save and return the patient

    // TODO: getPatients(String ward, String priority)
    // 1. Fetch: if ward is "all" → findAll(), else → findByWard(ward)
    // 2. Filter: if priority is not "all" → filter the list by priority
    // 3. Return the filtered list

    // TODO: dischargePatient(Long id)
    // 1. Find by ID — throw RuntimeException("Patient not found: " + id) if absent
    // 2. Delete by ID

    // TODO: updatePatient(Long id, Patient data)
    // 1. Find existing by ID — throw RuntimeException("Patient not found: " + id) if absent
    // 2. Update name if data.getName() is not null
    // 3. Update ward if data.getWard() is not null
    // 4. Update priority if data.getPriority() is not null and valid
    // 5. Save and return the updated patient
}`;

const CHECKS = [
  { id: 'admit',      label: 'admitPatient saves and returns patient',         test: c => c.includes('admitPatient') && c.includes('save') },
  { id: 'ward_check', label: 'Ward existence validated before saving',          test: c => c.includes('wardRepository') && (c.includes('existsBy') || c.includes('findBy') || c.includes('IllegalArgumentException')) },
  { id: 'priority',   label: 'Priority defaults to NORMAL if null',            test: c => c.includes('NORMAL') && (c.includes('null') || c.includes('default')) },
  { id: 'get_filter', label: 'getPatients filters by ward and priority',       test: c => c.includes('getPatients') && c.includes('ward') && c.includes('priority') },
  { id: 'discharge',  label: 'dischargePatient throws if patient not found',   test: c => c.includes('dischargePatient') && (c.includes('RuntimeException') || c.includes('not found')) },
  { id: 'delete',     label: 'dischargePatient deletes by ID',                 test: c => c.includes('deleteById') || c.includes('delete') },
  { id: 'update',     label: 'updatePatient updates and saves',                test: c => c.includes('updatePatient') && c.includes('save') },
  { id: 'partial',    label: 'updatePatient only updates non-null fields',     test: c => c.includes('getName()') && c.includes('null') },
];

export default function Level4_15() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage4Shell levelId={15} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l415-container">
          <div className="l415-brief">
            <div className="l415-tag">// Stage 4 Capstone</div>
            <h2>Build the complete <span style={{ color: selectedDomain?.color }}>PatientService</span> — the business logic core.</h2>
            <p>Four methods. Every rule that protects the hospital data lives here. Validate, fetch, create, update, discharge.</p>
          </div>

          <div className="l415-checklist">
            <div className="l415-checklist-title">// What to Build</div>
            {[
              { method: 'admitPatient(patient)',          desc: 'validate ward + priority, save, return' },
              { method: 'getPatients(ward, priority)',    desc: 'fetch all or by ward, filter by priority' },
              { method: 'dischargePatient(id)',           desc: 'find or throw, then delete' },
              { method: 'updatePatient(id, data)',        desc: 'find or throw, update non-null fields, save' },
            ].map(item => (
              <div key={item.method} className="l415-check-row">
                <span className="l415-check-method">{item.method}</span>
                <span className="l415-check-desc">— {item.desc}</span>
              </div>
            ))}
          </div>

          <CodeEditor
            initialCode={STARTER}
            writableMarker="// TODO"
            onOutputChange={(_, ok) => { if (ok) setIsCorrect(true); }}
            hints={SUPPORT.hints}
            height={400}
            language="java"
          />
        </div>
      </LevelSupportWrapper>
    </Stage4Shell>
  );
}