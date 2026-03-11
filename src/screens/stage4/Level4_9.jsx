// src/screens/stage4/Level4_9.jsx — DELETE & PUT (FILL)
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage4Shell from './Stage4Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from '../stage2/FillEditor';
import './Level4_9.css';

const SUPPORT = {
  intro: {
    concept: 'PUT & DELETE — Update and Remove Records',
    tagline: 'CRUD is not complete without Update and Delete.',
    whatYouWillDo: 'Add PUT (update patient) and DELETE (discharge patient) endpoints. Fill in the mapping annotations, path variables, and correct HTTP status codes for each.',
    whyItMatters: 'GET reads, POST creates, PUT updates, DELETE removes. Together these are the four CRUD operations every database-backed API needs. Knowing which HTTP verb to use for which operation is fundamental to REST design.',
  },
  hints: [
    '@PutMapping("/{id}") maps to PUT /api/patients/42. PUT replaces the entire resource. PATCH partially updates — but PUT is simpler and more common in Spring Boot.',
    '@DeleteMapping("/{id}") maps to DELETE /api/patients/42. After a successful delete, return 204 No Content — the resource is gone, nothing to return.',
    'ResponseEntity.noContent().build() creates a 204 No Content response with no body. This is the standard response for successful DELETE.',
    'For PUT, find the existing patient first, update its fields, save it, and return 200 OK with the updated object.',
  ],
  reveal: {
    concept: 'PUT, DELETE, and ResponseEntity patterns',
    whatYouLearned: '@PutMapping("/{id}") updates a resource. @DeleteMapping("/{id}") removes it. DELETE returns 204 No Content. PUT returns 200 OK with the updated resource. Always verify the resource exists before updating or deleting — throw 404 if not found.',
    realWorldUse: 'Discharge a patient → DELETE /api/patients/42. Update ward assignment → PUT /api/patients/42 with new ward in body. Update priority only → PATCH /api/patients/42 with just priority. REST convention: PUT for full replacement, PATCH for partial update.',
    developerSays: 'Never use GET for mutations. Never use POST for everything. REST verbs carry meaning. DELETE /patients/42 is instantly understood. POST /patients/delete-patient is confusing and wrong.',
  },
};

const TEMPLATE = `@RestController
@RequestMapping("/api/patients")
public class PatientController {

    // PUT /api/patients/{id} — update an existing patient
    // FILL 1: Map to PUT requests with an {id} path variable
    ___PUTMAPPING___("/{id}")
    public ResponseEntity<Patient> updatePatient(
            @PathVariable Long id,
            // FILL 2: Convert incoming JSON to a Patient object
            ___REQUESTBODY___ Patient patient) {
        Patient existing = patientService.findById(id); // throws 404 if not found
        existing.setName(patient.getName());
        existing.setWard(patient.getWard());
        existing.setAge(patient.getAge());
        Patient updated = patientService.save(existing);
        return ResponseEntity.ok(updated); // 200 OK with updated patient
    }

    // DELETE /api/patients/{id} — discharge (remove) a patient
    // FILL 3: Map to DELETE requests with an {id} path variable
    ___DELETEMAPPING___("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        patientService.deleteById(id);
        // FILL 4: Return 204 No Content — nothing to send back after delete
        return ResponseEntity.___NOCONTENT___().build();
    }
}`;

const BLANKS = [
  { id: 'PUTMAPPING',    answer: '@PutMapping',    placeholder: 'annotation', hint: 'Maps to HTTP PUT requests — used for full resource replacement.' },
  { id: 'REQUESTBODY',   answer: '@RequestBody',   placeholder: 'annotation', hint: 'Converts the incoming JSON body to a Patient Java object.' },
  { id: 'DELETEMAPPING', answer: '@DeleteMapping', placeholder: 'annotation', hint: 'Maps to HTTP DELETE requests — removes the resource.' },
  { id: 'NOCONTENT',     answer: 'noContent',      placeholder: 'method',     hint: 'Creates a 204 No Content ResponseEntity — standard response after successful delete.' },
];

const ANATOMY = [
  { label: '@PutMapping("/{id}")',       desc: 'HTTP PUT — full resource update' },
  { label: '@DeleteMapping("/{id}")',    desc: 'HTTP DELETE — remove resource' },
  { label: '@PatchMapping("/{id}")',     desc: 'HTTP PATCH — partial update' },
  { label: 'ResponseEntity.ok(body)',    desc: '200 OK with body' },
  { label: 'ResponseEntity.noContent()', desc: '204 No Content (no body)' },
  { label: 'ResponseEntity.notFound()',  desc: '404 Not Found (no body)' },
];

export default function Level4_9() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage4Shell levelId={9} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l49-container">
          <div className="l49-brief">
            <div className="l49-brief-tag">// Fill Mission — PUT & DELETE</div>
            <h2>Complete CRUD for your <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'hospital'}</span> patient API.</h2>
            <p>4 blanks. Add update and delete endpoints with the correct HTTP verbs and status codes.</p>
          </div>
          <div className="l49-anatomy">
            <div className="l49-anatomy-title">// HTTP Methods & Status Codes</div>
            <div className="l49-anatomy-rows">
              {ANATOMY.map(a => (
                <div key={a.label} className="l49-anat-row">
                  <span className="l49-anat-annotation">{a.label}</span>
                  <span className="l49-anat-desc">— {a.desc}</span>
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