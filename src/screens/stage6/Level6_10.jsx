// src/screens/stage6/Level6_10.jsx — Integration Bug Hunt (DEBUG)
import { useState } from 'react';
import Stage6Shell from './Stage6Shell';

const BUGS = [
  {
    id: 1, label: 'Bug 1 — 415 Unsupported Media Type',
    bad:  `// React — sending JSON to a multipart endpoint
const handleUpload = async () => {
  await api.post('/api/patients/1/photo', { file: selectedFile });
  //                                       ^^^^ sending as JSON object, not FormData
};`,
    good: `const handleUpload = async () => {
  const formData = new FormData();
  formData.append('file', selectedFile);
  await api.post('/api/patients/1/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};`,
    why: 'Spring\'s @RequestParam MultipartFile expects multipart/form-data. Sending a plain JSON object triggers 415 Unsupported Media Type. You must use FormData and set the Content-Type header explicitly.',
    hint: '415 = wrong Content-Type. File uploads need FormData, not JSON.',
  },
  {
    id: 2, label: 'Bug 2 — Circular Reference in JSON Serialisation',
    bad:  `// Patient has @ManyToOne Ward, Ward has @OneToMany List<Patient>
// Spring tries to serialise Patient → Ward → List<Patient> → Ward → ...
// Result: 500 Internal Server Error, stack overflow

@GetMapping("/api/patients")
public List<Patient> getAll() {
    return patientRepository.findAll(); // circular serialisation!
}`,
    good: `// Fix 1 — Add @JsonIgnore on the back-reference
@OneToMany(mappedBy = "ward")
@JsonIgnore  // breaks the cycle
private List<Patient> patients;

// Fix 2 (recommended) — Return DTOs instead of entities
@GetMapping("/api/patients")
public List<PatientDto> getAll() {
    return patientRepository.findAll()
        .stream()
        .map(p -> new PatientDto(p.getId(), p.getName(), p.getWard().getName()))
        .collect(toList());
}`,
    why: 'Bidirectional JPA relationships (Patient→Ward→patients→Ward...) cause infinite recursion when Jackson serialises them. @JsonIgnore breaks the cycle. DTOs are better — they only include fields React actually needs.',
    hint: 'Bidirectional relationships cause infinite loops. Use @JsonIgnore or DTOs.',
  },
  {
    id: 3, label: 'Bug 3 — 400 Bad Request on POST',
    bad:  `// React — missing Content-Type header on JSON POST
const handleCreate = async () => {
  await axios.post('/api/patients', formData);
  // Using raw axios instead of the configured api instance
  // → no Content-Type: application/json header
  // → Spring can't parse the body → 400 Bad Request
};`,
    good: `// Always use the configured api instance — it sets Content-Type: application/json
const handleCreate = async () => {
  await api.post('/api/patients', formData);
  //  ^^^ api instance has Content-Type: application/json as default
};`,
    why: 'Raw axios.post() doesn\'t include the Content-Type header you set on the api instance. Spring\'s @RequestBody can\'t deserialise the body without it. Always import and use the api instance from services/api.js.',
    hint: 'Use api.post(), not axios.post() — your configured instance has the right headers.',
  },
  {
    id: 4, label: 'Bug 4 — CORS error only on DELETE/PUT',
    bad:  `// SecurityConfig — CORS only allows GET and POST
config.setAllowedMethods(Arrays.asList("GET", "POST"));
// DELETE and PUT from React fail with CORS error`,
    good: `config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
// All methods React uses — plus OPTIONS for preflight`,
    why: 'Browsers send a preflight OPTIONS request before every PUT/DELETE/PATCH. If those methods aren\'t in allowedMethods, the preflight returns 403 and the actual request never fires. Symptom: GET works, but PUT/DELETE fail.',
    hint: 'PUT and DELETE need to be in allowedMethods too — and don\'t forget OPTIONS.',
  },
];

export default function Level6_10() {
  const [found, setFound] = useState(new Set());

  return (
    <Stage6Shell levelId={10} canProceed={found.size >= BUGS.length}
      conceptReveal={[
        { label: 'The 4 Integration Bug Patterns', detail: '415 (wrong Content-Type), circular JSON (missing @JsonIgnore or DTO), 400 (missing header from wrong axios instance), CORS on PUT/DELETE (incomplete allowedMethods). These four account for the majority of full stack integration bugs in real Spring Boot + React projects.' },
      ]}
    >
      <div className="s6-intro">
        <h1>Integration Bug Hunt</h1>
        <p className="s6-tagline">🐛 Four bugs that only appear when React and Spring Boot meet.</p>
        <p className="s6-why">These bugs can't be reproduced in Postman or unit tests — they only surface in the browser. Knowing the patterns means you resolve them in minutes.</p>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {BUGS.map(bug => (
          <div key={bug.id} style={{
            background:'#1e293b', border:`1px solid ${found.has(bug.id) ? '#4ade8060' : '#334155'}`,
            borderLeft:`3px solid ${found.has(bug.id) ? '#4ade80' : '#f87171'}`,
            borderRadius:10, padding:'16px 20px'
          }}>
            <h3 style={{ color: found.has(bug.id) ? '#4ade80' : '#f87171', margin:'0 0 10px', fontSize:14 }}>{bug.label}</h3>
            <div className="s6-panel" style={{ margin:'0 0 8px' }}>
              <div className="s6-panel-header" style={{ color:'#f87171' }}>❌ Buggy Code</div>
              <pre className="s6-panel-body" style={{ margin:0, overflowX:'auto', fontSize:12 }}>{bug.bad}</pre>
            </div>
            <p style={{ color:'#64748b', fontSize:13, margin:'8px 0' }}>💡 {bug.hint}</p>
            {!found.has(bug.id) ? (
              <button className="s6-btn secondary" style={{ fontSize:13, padding:'7px 16px', marginTop:6 }}
                onClick={() => setFound(p => { const n = new Set(p); n.add(bug.id); return n; })}>
                Reveal Fix
              </button>
            ) : (
              <>
                <div className="s6-panel" style={{ margin:'8px 0 6px' }}>
                  <div className="s6-panel-header" style={{ color:'#4ade80' }}>✅ Fixed Code</div>
                  <pre className="s6-panel-body" style={{ margin:0, color:'#94a3b8', overflowX:'auto', fontSize:12 }}>{bug.good}</pre>
                </div>
                <p style={{ color:'#94a3b8', fontSize:13, lineHeight:1.6, margin:'6px 0' }}>{bug.why}</p>
              </>
            )}
          </div>
        ))}
      </div>
      {found.size >= BUGS.length && <div className="s6-feedback success" style={{ marginTop:20 }}>✅ All 4 integration bugs found. Nothing will surprise you now.</div>}
    </Stage6Shell>
  );
}
