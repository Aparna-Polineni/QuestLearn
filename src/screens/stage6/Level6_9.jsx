// src/screens/stage6/Level6_9.jsx — Pagination & Sorting (FILL)
import { useState } from 'react';
import Stage6Shell from './Stage6Shell';
import FillEditor from '../stage2/FillEditor';

const BLANKS = [
  { id: 'PAGEABLE', answer: 'Pageable pageable',                                    placeholder: 'Spring pageable param',     hint: 'Spring injects page, size, sort from query params automatically.' },
  { id: 'PAGEQ',    answer: 'Page<Patient>',                                        placeholder: 'return type for paged data', hint: 'Page<T> wraps the list with totalPages, totalElements, etc.' },
  { id: 'FINDALL',  answer: 'patientRepository.findAll(pageable)',                  placeholder: 'paged findAll',             hint: 'Pass the Pageable to findAll — JPA handles LIMIT/OFFSET.' },
  { id: 'PARAMS',   answer: 'page=0&size=10&sort=name,asc',                        placeholder: 'query params for page 1',   hint: 'page is 0-indexed. size=10 means 10 per page. sort=field,direction.' },
  { id: 'AXGET',    answer: 'api.get(`/api/patients?page=${page}&size=10&sort=name,asc`)', placeholder: 'Axios paginated GET', hint: 'Pass page as a query param — Spring binds it to Pageable automatically.' },
  { id: 'TOTAL',    answer: 'response.data.totalPages',                             placeholder: 'get total pages from response', hint: 'Spring Page response includes totalPages in the JSON.' },
];

const TEMPLATE = `// ── Spring Boot — Paginated Endpoint ───────────────────────────────────────
@GetMapping("/api/patients")
public ResponseEntity<[PAGEQ]> getPatients([PAGEABLE]) {
    Page<Patient> result = [FINDALL];
    return ResponseEntity.ok(result);
    // Response: { content: [...], totalPages: 5, totalElements: 47, number: 0 }
}

// Call: GET /api/patients?[PARAMS]

// ── React — Pagination Component ────────────────────────────────────────────
function PatientList() {
  const [patients,   setPatients]   = useState([]);
  const [page,       setPage]       = useState(0);  // 0-indexed
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    [AXGET]
      .then(response => {
        setPatients(response.data.content);       // the actual list
        setTotalPages([TOTAL]);
      });
  }, [page]);  // re-fetch when page changes

  return (
    <>
      {patients.map(p => <PatientRow key={p.id} patient={p} />)}

      <div className="pagination">
        <button onClick={() => setPage(p => p - 1)} disabled={page === 0}>← Prev</button>
        <span>Page {page + 1} of {totalPages}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>Next →</button>
      </div>
    </>
  );
}`;

export default function Level6_9() {
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage6Shell levelId={9} canProceed={isCorrect}
      conceptReveal={[
        { label: 'Spring Page Response Shape', detail: 'Spring returns { content: [...], totalPages: N, totalElements: M, number: 0, size: 10, first: true, last: false }. React reads content for the items and totalPages for the pagination controls.' },
        { label: '0-Indexed Pages', detail: 'Spring Pageable is 0-indexed: page=0 is the first page. Your UI shows "Page 1 of 5" but sends page=0 to the API. Always subtract 1 when displaying and add 1 when labelling.' },
        { label: 'Sort Parameter', detail: 'sort=name,asc sorts by name ascending. sort=id,desc sorts by id descending. You can sort by multiple fields: sort=ward,asc&sort=name,asc. Spring\'s Pageable parses all of these automatically from the query string.' },
      ]}
    >
      <div className="s6-intro">
        <h1>Pagination & Sorting</h1>
        <p className="s6-tagline">📄 Never load all 10,000 patients at once. Page them.</p>
        <p className="s6-why">Loading the full patient list is fine in development with 20 test records. With real data — thousands of patients — it times out. Spring's Pageable makes pagination a 3-line change.</p>
      </div>

      <table className="s6-table">
        <thead><tr><th>Query Param</th><th>Spring Pageable</th><th>SQL Generated</th></tr></thead>
        <tbody>
          <tr><td><code>?page=0&size=10</code></td><td>PageRequest.of(0, 10)</td><td>LIMIT 10 OFFSET 0</td></tr>
          <tr><td><code>?page=2&size=10</code></td><td>PageRequest.of(2, 10)</td><td>LIMIT 10 OFFSET 20</td></tr>
          <tr><td><code>?sort=name,asc</code></td><td>Sort.by("name").ascending()</td><td>ORDER BY name ASC</td></tr>
          <tr><td><code>?sort=id,desc</code></td><td>Sort.by("id").descending()</td><td>ORDER BY id DESC</td></tr>
        </tbody>
      </table>

      <FillEditor template={TEMPLATE} blanks={BLANKS} onAllCorrect={() => setIsCorrect(true)} />
    </Stage6Shell>
  );
}
