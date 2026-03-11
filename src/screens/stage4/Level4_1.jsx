// src/screens/stage4/Level4_1.jsx — Your First Endpoint
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage4Shell from './Stage4Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from '../stage2/FillEditor';
import './Level4_1.css';

const SUPPORT = {
  intro: {
    concept: 'Your First REST Endpoint',
    tagline: 'Three annotations. One method. A working API.',
    whatYouWillDo: 'Add the three annotations that turn a plain Java class into a REST controller that returns patient data at GET /api/patients.',
    whyItMatters: 'Every Spring Boot feature starts here. @RestController + @RequestMapping + @GetMapping is the skeleton of every endpoint you will ever write.',
  },
  hints: [
    '@RestController tells Spring this class handles HTTP requests and returns data (not views). Without it, Spring ignores the class entirely.',
    '@RequestMapping("/api/patients") sets the base URL for the entire class. Every method in the class inherits this prefix.',
    '@GetMapping maps a method to HTTP GET requests. The full URL becomes base + method path: /api/patients + "" = /api/patients.',
  ],
  reveal: {
    concept: 'REST Controllers & Request Mapping',
    whatYouLearned: '@RestController marks the class. @RequestMapping sets the base URL. @GetMapping / @PostMapping / @PutMapping / @DeleteMapping map methods to HTTP verbs. Spring Boot handles everything else — parsing requests, serialising responses to JSON, sending HTTP status codes.',
    realWorldUse: 'Every Spring Boot API endpoint follows this pattern. In a hospital system, you might have PatientController, DoctorController, WardController — each with @RequestMapping("/api/patients"), ("/api/doctors"), ("/api/wards"). The structure scales from 1 endpoint to 100.',
    developerSays: 'The annotations feel like magic at first. They are not — they are just metadata that Spring reads at startup to build a routing table. @GetMapping("/patients") tells Spring: "when a GET /patients request arrives, call this method."',
  },
};

const TEMPLATE = `import org.springframework.web.bind.annotation.*;
import java.util.List;

// FILL 1: Mark this class as a REST controller
___RESTCONTROLLER___
// FILL 2: Set the base URL for all endpoints in this class
___REQUESTMAPPING___("/api/patients")
public class PatientController {

    // FILL 3: Map this method to HTTP GET requests
    ___GETMAPPING___
    public List<String> getAllPatients() {
        return List.of("Alice — Ward 1", "Bob — Ward 2", "Charlie — Ward 3");
    }
}`;

const BLANKS = [
  {
    id: 'RESTCONTROLLER',
    answer: '@RestController',
    placeholder: 'annotation',
    hint: 'Marks this class as a REST API controller. Combines @Controller and @ResponseBody.',
  },
  {
    id: 'REQUESTMAPPING',
    answer: '@RequestMapping',
    placeholder: 'annotation',
    hint: 'Sets the base URL path for all methods in this class.',
  },
  {
    id: 'GETMAPPING',
    answer: '@GetMapping',
    placeholder: 'annotation',
    hint: 'Maps this method to HTTP GET requests on the base URL.',
  },
];

const ANATOMY = [
  { label: '@RestController',        desc: 'marks the class as a REST API handler' },
  { label: '@RequestMapping("/url")', desc: 'sets the base URL for all methods' },
  { label: '@GetMapping',            desc: 'maps to HTTP GET — read data' },
  { label: '@PostMapping',           desc: 'maps to HTTP POST — create data' },
  { label: '@PutMapping',            desc: 'maps to HTTP PUT — update data' },
  { label: '@DeleteMapping',         desc: 'maps to HTTP DELETE — remove data' },
];

export default function Level4_1() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage4Shell levelId={1} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l41-container">
          <div className="l41-brief">
            <div className="l41-brief-tag">// Fill Mission — Annotations</div>
            <h2>Wire up your first endpoint for the <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'hospital'}</span> system.</h2>
            <p>Three blanks. All annotations. Fill them to turn a plain Java class into a working REST controller that returns patients at <code>GET /api/patients</code>.</p>
          </div>

          <div className="l41-anatomy">
            <div className="l41-anatomy-title">// Spring Boot Annotation Reference</div>
            <div className="l41-anatomy-rows">
              {ANATOMY.map(a => (
                <div key={a.label} className="l41-anat-row">
                  <span className="l41-anat-annotation">{a.label}</span>
                  <span className="l41-anat-desc">— {a.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <FillEditor
            template={TEMPLATE}
            blanks={BLANKS}
            onAllCorrect={() => setIsCorrect(true)}
          />
        </div>
      </LevelSupportWrapper>
    </Stage4Shell>
  );
}