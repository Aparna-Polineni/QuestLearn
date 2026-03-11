// src/screens/stage4/Level4_2.jsx — Request Params & Path Variables
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage4Shell from './Stage4Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from '../stage2/FillEditor';
import './Level4_2.css';

const SUPPORT = {
  intro: {
    concept: 'Request Params & Path Variables',
    tagline: 'Two ways to pass data in a URL. Same result, different style.',
    whatYouWillDo: 'Fill in the annotations that read a ward number from the URL — once as a path variable (/api/patients/3) and once as a query param (/api/patients?ward=3).',
    whyItMatters: 'Every real API uses both. Path variables identify a specific resource (/patients/42). Query params filter a collection (/patients?ward=2&priority=HIGH). You need both patterns.',
  },
  hints: [
    '@PathVariable extracts a value from the URL path itself. The name in the URL {ward} must match the parameter name in the method.',
    '@RequestParam extracts a query string value (?ward=2). You can make it optional with required=false and provide a defaultValue.',
    'The method parameter name must match the URL template name exactly — {ward} in the path maps to @PathVariable String ward in the method signature.',
  ],
  reveal: {
    concept: 'Path Variables vs Request Params',
    whatYouLearned: '@PathVariable reads from the URL path: /patients/{id}. @RequestParam reads from query string: /patients?ward=2. Path variables identify resources. Query params filter or configure. Both are just ways Spring pulls data from the URL into your method.',
    realWorldUse: 'GET /api/patients/42 uses @PathVariable to load one patient by ID. GET /api/patients?ward=3&priority=HIGH uses @RequestParam to filter. DELETE /api/patients/42 uses @PathVariable. This pattern appears in every REST API you will ever build.',
    developerSays: 'Rule of thumb: path variable for "which specific thing", query param for "what criteria". /orders/123 (which order). /orders?status=pending&page=2 (which criteria).',
  },
};

const TEMPLATE = `@RestController
@RequestMapping("/api/patients")
public class PatientController {

    // URL: GET /api/patients/{ward}
    // FILL 1: Extract 'ward' from the path
    @GetMapping("/{ward}")
    public List<Patient> getByWard(___PATHVARIABLE___ String ward) {
        return service.findByWard(ward);
    }

    // URL: GET /api/patients?ward=2&priority=HIGH
    // FILL 2: Extract 'ward' from query string (optional, default "all")
    // FILL 3: Extract 'priority' from query string (optional, default "NORMAL")
    @GetMapping("/filter")
    public List<Patient> filter(
        ___REQPARAM_WARD___(required = false, defaultValue = "all") String ward,
        ___REQPARAM_PRI___(required = false, defaultValue = "NORMAL") String priority
    ) {
        return service.findByWardAndPriority(ward, priority);
    }
}`;

const BLANKS = [
  { id: 'PATHVARIABLE',   answer: '@PathVariable',  placeholder: 'annotation', hint: 'Reads a value from {curly braces} in the URL path.' },
  { id: 'REQPARAM_WARD',  answer: '@RequestParam',  placeholder: 'annotation', hint: 'Reads a value from the ?key=value query string.' },
  { id: 'REQPARAM_PRI',   answer: '@RequestParam',  placeholder: 'annotation', hint: 'Same annotation — each query param gets its own @RequestParam.' },
];

const ANATOMY = [
  { pattern: 'GET /patients/{id}',      annotation: '@PathVariable',  desc: 'value in the URL path' },
  { pattern: 'GET /patients?ward=2',    annotation: '@RequestParam',  desc: 'value in the query string' },
  { pattern: '?ward=2 (optional)',       annotation: 'required=false', desc: 'makes the param optional' },
  { pattern: '?ward=all (default)',      annotation: 'defaultValue=', desc: 'used when param is absent' },
];

export default function Level4_2() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage4Shell levelId={2} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l42-container">
          <div className="l42-brief">
            <div className="l42-brief-tag">// Fill Mission — URL Parameters</div>
            <h2>Read ward and priority from the URL in your <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'hospital'}</span> API.</h2>
            <p>Three blanks — two annotation types. One reads from the URL path, two read from the query string.</p>
          </div>

          <div className="l42-anatomy">
            <div className="l42-anatomy-title">// URL → Method Parameter Mapping</div>
            <div className="l42-anatomy-rows">
              {ANATOMY.map((a, i) => (
                <div key={i} className="l42-anat-row">
                  <span className="l42-anat-url">{a.pattern}</span>
                  <span className="l42-anat-arrow">→</span>
                  <span className="l42-anat-annotation">{a.annotation}</span>
                  <span className="l42-anat-desc">{a.desc}</span>
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