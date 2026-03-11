// src/screens/stage4/Level4_6.jsx — POST: Creating Records
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage4Shell from './Stage4Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from '../stage2/FillEditor';
import './Level4_6.css';

const SUPPORT = {
  intro: {
    concept: 'POST — Creating Records',
    tagline: 'The request body arrives as JSON. Spring converts it to a Java object. You save it.',
    whatYouWillDo: 'Fill in the @PostMapping, @RequestBody, and ResponseEntity return so that POST /api/patients creates a new patient and returns 201 Created.',
    whyItMatters: 'POST is how data gets created. Every admission form, registration, or order creates a POST request. Getting the response code right (201 vs 200) is professional API design that frontends depend on.',
  },
  hints: [
    '@PostMapping maps a method to HTTP POST. @RequestBody tells Spring to deserialise the incoming JSON into a Patient object — Jackson handles the conversion.',
    'ResponseEntity<Patient> lets you control the HTTP status code. Return ResponseEntity.status(201).body(saved) for a 201 Created response, or use ResponseEntity.created(uri).body(saved).',
    'The body of the POST request arrives as JSON: {"name":"Alice","ward":"1","priority":"HIGH"}. Spring + Jackson converts it to a Patient object before your method even runs.',
  ],
  reveal: {
    concept: 'POST Endpoint & ResponseEntity',
    whatYouLearned: '@PostMapping handles POST requests. @RequestBody deserialises incoming JSON to a Java object. ResponseEntity controls status codes. 201 Created is the correct response for resource creation — not 200 OK. The Location header (optional) tells the client where the new resource lives.',
    realWorldUse: 'POST /api/patients with JSON body is exactly what your React admission form sends. Spring receives it, creates a Patient, saves it, and returns 201 with the saved patient (including its new database ID). The React frontend reads the ID from the response.',
    developerSays: 'Always return 201 for creation, not 200. Clients — including automated systems — check status codes. A 201 tells the frontend "the resource was created". Include the created resource in the body so the frontend has the database-generated ID.',
  },
};

const TEMPLATE = `@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @GetMapping
    public List<Patient> getAll() {
        return patientService.getAllPatients();
    }

    // FILL 1: Map this method to HTTP POST requests
    ___POSTMAPPING___
    // FILL 2: The method should return ResponseEntity<Patient>
    public ___RETURN_TYPE___ createPatient(
        // FILL 3: Deserialise the incoming JSON into a Patient object
        ___REQUESTBODY___ Patient patient
    ) {
        Patient saved = patientService.admitPatient(patient);
        // FILL 4: Return HTTP 201 Created with the saved patient as the body
        return ResponseEntity.___STATUS_201___.body(saved);
    }
}`;

const BLANKS = [
  { id: 'POSTMAPPING',  answer: '@PostMapping',            placeholder: 'annotation',   hint: 'Maps this method to HTTP POST on the base URL /api/patients.' },
  { id: 'RETURN_TYPE',  answer: 'ResponseEntity<Patient>', placeholder: 'return type',  hint: 'ResponseEntity wraps the response so you can set the HTTP status code.' },
  { id: 'REQUESTBODY',  answer: '@RequestBody',            placeholder: 'annotation',   hint: 'Tells Spring to parse the request JSON body into the Patient parameter.' },
  { id: 'STATUS_201',   answer: 'status(201)',             placeholder: 'method call',  hint: 'ResponseEntity.status(201) sets the HTTP status to 201 Created.' },
];

const ANATOMY = [
  { code: '@PostMapping',        desc: 'maps to HTTP POST' },
  { code: '@RequestBody',        desc: 'JSON body → Java object (via Jackson)' },
  { code: 'ResponseEntity<T>',  desc: 'control HTTP status code + body' },
  { code: '.status(201)',        desc: '201 Created — resource was created' },
  { code: '.status(200)',        desc: '200 OK — read/update success' },
  { code: '.status(404)',        desc: '404 Not Found — resource missing' },
];

export default function Level4_6() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage4Shell levelId={6} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l46-container">
          <div className="l46-brief">
            <div className="l46-brief-tag">// Fill Mission — POST Endpoint</div>
            <h2>Wire up the admit-patient endpoint for the <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'hospital'}</span> API.</h2>
            <p>Four blanks. Map to POST, read the request body, return 201 Created.</p>
          </div>

          <div className="l46-anatomy">
            <div className="l46-anatomy-title">// HTTP Methods & Status Codes</div>
            <div className="l46-anatomy-rows">
              {ANATOMY.map(a => (
                <div key={a.code} className="l46-anat-row">
                  <span className="l46-anat-code">{a.code}</span>
                  <span className="l46-anat-desc">— {a.desc}</span>
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