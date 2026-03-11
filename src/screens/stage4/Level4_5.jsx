// src/screens/stage4/Level4_5.jsx — The Service Layer
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage4Shell from './Stage4Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from '../stage2/FillEditor';
import './Level4_5.css';

const SUPPORT = {
  intro: {
    concept: 'The Service Layer — Business Logic Lives Here',
    tagline: 'Controllers handle requests. Repositories touch the database. Services own the rules.',
    whatYouWillDo: 'Fill in the @Service annotation, @Autowired injection, and the business logic inside getPatientsByWard — including a validation check that throws if the ward is invalid.',
    whyItMatters: 'The service layer is where real work happens. Validation, calculations, rules, emails, audit logs — all of it belongs here, not in the controller or repository. This separation makes code testable, reusable, and safe to change.',
  },
  hints: [
    '@Service marks the class as a Spring service component. Spring creates one instance and injects it wherever needed.',
    '@Autowired injects the PatientRepository automatically — Spring finds the matching bean and wires it in. No new keyword needed.',
    'throw new IllegalArgumentException("message") stops execution and returns an error to the caller. The @ExceptionHandler in the controller (or @ControllerAdvice) catches it.',
  ],
  reveal: {
    concept: 'Service Layer & Dependency Injection',
    whatYouLearned: '@Service marks business logic. @Autowired injects dependencies — Spring handles wiring. Controllers call services. Services call repositories. Each layer has one job. Validation in the service means it applies everywhere the service is used — not just one endpoint.',
    realWorldUse: 'PatientService.admitPatient() checks ward capacity, validates priority, creates an audit log, sends a notification, and saves the patient. None of that belongs in the controller. The controller just calls service.admitPatient(dto) and returns the result.',
    developerSays: 'Fat services, thin controllers. Controllers should be 10-20 lines. Services can be 100+. If your controller has if statements or database calls, move them to the service.',
  },
};

const TEMPLATE = `import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Set;

// FILL 1: Mark this class as a Spring service component
___SERVICE___
public class PatientService {

    private static final Set<String> VALID_WARDS = Set.of("1","2","3","4","ICU");

    // FILL 2: Inject the repository — Spring wires this automatically
    ___AUTOWIRED___
    private PatientRepository patientRepository;

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public List<Patient> getPatientsByWard(String ward) {
        // FILL 3: Throw IllegalArgumentException if ward is not in VALID_WARDS
        if (___INVALID_CHECK___) {
            ___THROW___;
        }
        return patientRepository.findByWard(ward);
    }

    public Patient admitPatient(Patient patient) {
        patient.setPriority(patient.getPriority() == null ? "NORMAL" : patient.getPriority());
        return patientRepository.save(patient);
    }
}`;

const BLANKS = [
  { id: 'SERVICE',       answer: '@Service',                                                  placeholder: 'annotation',  hint: 'Marks this class as a Spring service. Spring creates and manages one instance.' },
  { id: 'AUTOWIRED',     answer: '@Autowired',                                                placeholder: 'annotation',  hint: 'Tells Spring to inject the matching bean here. No new keyword needed.' },
  { id: 'INVALID_CHECK', answer: '!VALID_WARDS.contains(ward)',                              placeholder: 'condition',   hint: 'VALID_WARDS is a Set. Use .contains() to check membership. Negate it with !' },
  { id: 'THROW',         answer: 'throw new IllegalArgumentException("Invalid ward: "+ward)', placeholder: 'statement',   hint: 'throw new ExceptionType("message") — stops execution with an error message.' },
];

const ANATOMY = [
  { layer: 'Controller',  job: 'Receive HTTP request, call service, return response' },
  { layer: 'Service',     job: 'Business logic, validation, rules, orchestration' },
  { layer: 'Repository',  job: 'Database access — find, save, delete' },
  { layer: 'Entity',      job: 'Data structure — maps to database table' },
];

export default function Level4_5() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage4Shell levelId={5} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l45-container">
          <div className="l45-brief">
            <div className="l45-brief-tag">// Fill Mission — Service Layer</div>
            <h2>Add business logic to the <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'hospital'}</span> service.</h2>
            <p>Four blanks. Mark the service, wire the repository, validate the ward, and throw if invalid.</p>
          </div>

          <div className="l45-anatomy">
            <div className="l45-anatomy-title">// Spring Boot Layer Responsibilities</div>
            <div className="l45-anatomy-rows">
              {ANATOMY.map(a => (
                <div key={a.layer} className="l45-anat-row">
                  <span className="l45-anat-layer">{a.layer}</span>
                  <span className="l45-anat-desc">— {a.job}</span>
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