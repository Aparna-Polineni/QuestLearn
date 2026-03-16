// src/screens/stage6/Level6_5.jsx — Global Error Handling (FILL)
import { useState } from 'react';
import Stage6Shell from './Stage6Shell';
import FillEditor from '../stage2/FillEditor';

const BLANKS = [
  { id: 'ADVICE',    answer: '@RestControllerAdvice',                             placeholder: 'global handler annotation',hint: 'Combines @ControllerAdvice + @ResponseBody — catches all exceptions.' },
  { id: 'HANDLER',   answer: '@ExceptionHandler(ResourceNotFoundException.class)', placeholder: '@ExceptionHandler',        hint: 'Map this method to ResourceNotFoundException.' },
  { id: 'STATUS404', answer: '@ResponseStatus(HttpStatus.NOT_FOUND)',             placeholder: '@ResponseStatus for 404',  hint: 'Return 404 when a resource is not found.' },
  { id: 'STATUS400', answer: 'HttpStatus.BAD_REQUEST',                            placeholder: 'status for validation errors', hint: '400 Bad Request — the client sent invalid data.' },
  { id: 'ERRORS',    answer: 'ex.getBindingResult().getFieldErrors()',            placeholder: 'extract field errors',     hint: 'MethodArgumentNotValidException exposes field-level errors here.' },
  { id: 'FIELD',     answer: 'error.getField()',                                  placeholder: 'get the field name',       hint: 'The name of the field that failed validation.' },
  { id: 'MSG',       answer: 'error.getDefaultMessage()',                         placeholder: 'get the error message',    hint: 'The @NotBlank / @Min message for this field.' },
];

const TEMPLATE = `// src/exception/GlobalExceptionHandler.java
@[ADVICE]
public class GlobalExceptionHandler {

    // 404 — Resource not found
    [HANDLER]
    [STATUS404]
    public Map<String, String> handleNotFound(ResourceNotFoundException ex) {
        return Map.of("error", ex.getMessage());
    }

    // 400 — Validation errors from @Valid
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(
            MethodArgumentNotValidException ex) {

        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError error : [ERRORS]) {
            fieldErrors.put([FIELD], [MSG]);
        }
        return ResponseEntity
            .status([STATUS400])
            .body(Map.of("errors", fieldErrors));
    }

    // 500 — Catch-all for unexpected errors
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, String> handleGeneral(Exception ex) {
        // Log ex.getMessage() to your logging system here
        return Map.of("error", "An unexpected error occurred");
    }
}`;

export default function Level6_5() {
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage6Shell levelId={5} canProceed={isCorrect}
      conceptReveal={[
        { label: 'Consistent Error Shape', detail: 'React needs a predictable error format to display messages. Always return { "error": "message" } for single errors, and { "errors": { "field": "message" } } for validation. Your Axios interceptor can then check error.response.data.error for toast notifications.' },
        { label: '@RestControllerAdvice vs @ControllerAdvice', detail: '@ControllerAdvice handles exceptions globally but returns views. @RestControllerAdvice adds @ResponseBody — every handler method returns JSON automatically. Always use @RestControllerAdvice for REST APIs.' },
        { label: 'React Side', detail: 'In Axios catch block: error.response.data.error gives you the message from Spring. Display it in a toast: toast.error(error.response?.data?.error || "Something went wrong"). This gives users real feedback instead of generic browser errors.' },
      ]}
    >
      <div className="s6-intro">
        <h1>Global Error Handling</h1>
        <p className="s6-tagline">🛡️ One class handles all errors. React always gets a clean JSON response.</p>
        <p className="s6-why">Without global error handling, unhandled exceptions return an HTML error page to React instead of JSON. Axios can't parse HTML — the error swallows the real message and the user sees nothing useful.</p>
      </div>

      <table className="s6-table">
        <thead><tr><th>Exception</th><th>HTTP Status</th><th>When</th></tr></thead>
        <tbody>
          <tr><td><code>ResourceNotFoundException</code></td><td>404</td><td>Entity not found by ID</td></tr>
          <tr><td><code>MethodArgumentNotValidException</code></td><td>400</td><td>@Valid fails on @RequestBody</td></tr>
          <tr><td><code>AccessDeniedException</code></td><td>403</td><td>User lacks permission</td></tr>
          <tr><td><code>Exception</code> (catch-all)</td><td>500</td><td>Unexpected server error</td></tr>
        </tbody>
      </table>

      <FillEditor template={TEMPLATE} blanks={BLANKS} onAllCorrect={() => setIsCorrect(true)} />
    </Stage6Shell>
  );
}
