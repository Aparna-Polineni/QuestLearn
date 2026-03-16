// src/screens/stage6/Level6_7.jsx — File Upload (FILL)
import { useState } from 'react';
import Stage6Shell from './Stage6Shell';
import FillEditor from '../stage2/FillEditor';

const BLANKS = [
  { id: 'MULTI',    answer: '@PostMapping("/api/patients/{id}/photo")',            placeholder: 'POST endpoint path',       hint: 'Upload a photo for a specific patient by ID.' },
  { id: 'PARAM',    answer: '@RequestParam("file") MultipartFile file',           placeholder: '@RequestParam for file',   hint: 'MultipartFile receives the uploaded file. "file" must match the FormData key.' },
  { id: 'EMPTY',    answer: 'file.isEmpty()',                                      placeholder: 'check for empty file',     hint: 'Guard against empty uploads before processing.' },
  { id: 'ORIG',     answer: 'file.getOriginalFilename()',                          placeholder: 'get original filename',    hint: 'The filename the user uploaded — use for storage or display.' },
  { id: 'FORMDATA', answer: 'new FormData()',                                      placeholder: 'create FormData object',   hint: 'FormData encodes file + fields as multipart/form-data.' },
  { id: 'APPEND',   answer: 'formData.append("file", selectedFile)',              placeholder: 'attach file to FormData',  hint: '"file" must match @RequestParam("file") on the Spring side.' },
  { id: 'AXPOST',   answer: 'api.post(`/api/patients/${id}/photo`, formData, { headers: { "Content-Type": "multipart/form-data" } })', placeholder: 'Axios POST with file', hint: 'Set Content-Type to multipart/form-data so Spring knows to parse it.' },
];

const TEMPLATE = `// ── Spring Boot — File Upload Endpoint ─────────────────────────────────────
@RestController
public class PatientPhotoController {

    @[MULTI]
    public ResponseEntity<String> uploadPhoto(
            @PathVariable Long id,
            @[PARAM]) {

        if ([EMPTY]) {
            return ResponseEntity.badRequest().body("No file provided");
        }

        String filename = [ORIG];
        // Save to disk: Files.copy(file.getInputStream(), uploadPath.resolve(filename))
        // Or save to S3, Cloudinary, etc.

        return ResponseEntity.ok("Uploaded: " + filename);
    }
}

// application.properties
// spring.servlet.multipart.max-file-size=10MB
// spring.servlet.multipart.max-request-size=10MB

// ── React — File Upload Component ──────────────────────────────────────────
function PatientPhotoUpload({ patientId }) {
  const [selectedFile, setSelectedFile] = useState(null);

  async function handleUpload() {
    const formData = [FORMDATA];
    [APPEND];

    await [AXPOST];
  }

  return (
    <>
      <input type="file" accept="image/*"
        onChange={e => setSelectedFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={!selectedFile}>
        Upload Photo
      </button>
    </>
  );
}`;

export default function Level6_7() {
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage6Shell levelId={7} canProceed={isCorrect}
      conceptReveal={[
        { label: 'FormData vs JSON', detail: 'Files cannot be sent as JSON. FormData encodes the request as multipart/form-data — each field is a separate "part". You must set Content-Type: multipart/form-data in the Axios request, or Spring can\'t parse it.' },
        { label: 'File Naming & Security', detail: 'Never use the original filename directly for storage — users can upload files named "../../../etc/passwd". Sanitise: UUID.randomUUID() + extension. Store the original name in the database for display only.' },
        { label: 'File Size Limits', detail: 'Spring Boot defaults to 1MB max. Set spring.servlet.multipart.max-file-size and max-request-size in application.properties. Return a clear 400 error when the limit is exceeded so React can display a useful message.' },
      ]}
    >
      <div className="s6-intro">
        <h1>File Upload</h1>
        <p className="s6-tagline">📎 Patient photos, documents, reports — multipart/form-data from React to Spring.</p>
        <p className="s6-why">File upload requires different handling than JSON: FormData on the React side, MultipartFile on the Spring side, and a matching Content-Type header to connect them.</p>
      </div>

      <table className="s6-table">
        <thead><tr><th>Side</th><th>Key Piece</th><th>Purpose</th></tr></thead>
        <tbody>
          <tr><td>React</td><td><code>new FormData()</code></td><td>Encodes file as multipart/form-data</td></tr>
          <tr><td>React</td><td><code>formData.append("file", file)</code></td><td>Attaches file with the field name Spring expects</td></tr>
          <tr><td>React</td><td><code>Content-Type: multipart/form-data</code></td><td>Tells Spring how to parse the request body</td></tr>
          <tr><td>Spring</td><td><code>@RequestParam MultipartFile file</code></td><td>Receives the uploaded file</td></tr>
          <tr><td>Spring</td><td><code>file.getBytes() / getInputStream()</code></td><td>Read file contents for saving</td></tr>
        </tbody>
      </table>

      <FillEditor template={TEMPLATE} blanks={BLANKS} onAllCorrect={() => setIsCorrect(true)} />
    </Stage6Shell>
  );
}
