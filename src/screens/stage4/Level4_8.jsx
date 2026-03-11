// src/screens/stage4/Level4_8.jsx — Exception Handling (DEBUG)
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage4Shell from './Stage4Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from '../stage2/FillEditor';
import './Level4_8.css';

const SUPPORT = {
  intro: {
    concept: 'Global Exception Handling with @ControllerAdvice',
    tagline: 'Catch once. Handle everywhere.',
    whatYouWillDo: 'Fix a broken GlobalExceptionHandler class. The bugs mean exceptions leak as 500 errors instead of clean 404/400 responses. Find and fix 3 bugs.',
    whyItMatters: 'Without a global handler, any unhandled exception returns a raw 500 Internal Server Error with a Java stack trace. That exposes implementation details and confuses clients. A global handler converts exceptions into clean, consistent JSON error responses.',
  },
  hints: [
    '@ControllerAdvice marks the class as a global exception handler. @RestControllerAdvice is the same but adds @ResponseBody automatically — use this for REST APIs.',
    '@ExceptionHandler(ResourceNotFoundException.class) maps the method to a specific exception type. When that exception is thrown anywhere in the application, this method handles it.',
    'ResponseEntity.status(HttpStatus.NOT_FOUND).body(message) returns 404 with the error message. NOT_FOUND = 404. BAD_REQUEST = 400. INTERNAL_SERVER_ERROR = 500.',
  ],
  reveal: {
    concept: '@ControllerAdvice & @ExceptionHandler',
    whatYouLearned: '@RestControllerAdvice makes one class handle all exceptions. @ExceptionHandler(X.class) maps to a specific exception. ResponseEntity lets you set the status code and body. Custom exception classes (ResourceNotFoundException extends RuntimeException) carry the error message.',
    realWorldUse: 'In production, your handler catches: ResourceNotFoundException → 404, ValidationException → 400, AccessDeniedException → 403, and a catch-all Exception → 500 with a generic message (never expose stack traces). The error response is standardised JSON: {status, message, timestamp}.',
    developerSays: 'One GlobalExceptionHandler class. That is all you need. Every exception in the entire application flows to it. No try-catch in controllers or services for expected exceptions — just throw, and let the handler deal with it.',
  },
};

const TEMPLATE = `import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;

// BUG 1: Wrong annotation — this is a REST API, use the variant that includes @ResponseBody
___RESTCONTROLLERADVICE___
public class GlobalExceptionHandler {

    // BUG 2: Missing the exception type to handle — must specify ResourceNotFoundException
    @ExceptionHandler(___RESOURCENOTFOUNDEXCEPTION___.class)
    public ResponseEntity<String> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity
            // BUG 3: Wrong status — a "not found" error should be 404, not 500
            .status(HttpStatus.___NOT_FOUND___)
            .body(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneral(Exception ex) {
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("An unexpected error occurred");
    }
}`;

const BLANKS = [
  {
    id: 'RESTCONTROLLERADVICE',
    answer: '@RestControllerAdvice',
    placeholder: 'annotation',
    hint: '@RestControllerAdvice = @ControllerAdvice + @ResponseBody. Use this for REST APIs so responses are serialised to JSON automatically.',
  },
  {
    id: 'RESOURCENOTFOUNDEXCEPTION',
    answer: 'ResourceNotFoundException',
    placeholder: 'exception class',
    hint: 'The exception class this handler should catch. Specify the exact class.',
  },
  {
    id: 'NOT_FOUND',
    answer: 'NOT_FOUND',
    placeholder: 'status',
    hint: 'The HttpStatus constant for 404 Not Found. Used when a requested resource does not exist.',
  },
];

const ANATOMY = [
  { label: '@RestControllerAdvice',              desc: 'global handler for all exceptions in the app' },
  { label: '@ExceptionHandler(X.class)',          desc: 'handles a specific exception type' },
  { label: 'HttpStatus.NOT_FOUND',               desc: '404 — resource does not exist' },
  { label: 'HttpStatus.BAD_REQUEST',             desc: '400 — invalid input' },
  { label: 'HttpStatus.FORBIDDEN',               desc: '403 — authenticated but not authorised' },
  { label: 'HttpStatus.INTERNAL_SERVER_ERROR',   desc: '500 — unexpected server error' },
];

export default function Level4_8() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage4Shell levelId={8} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l48-container">
          <div className="l48-brief">
            <div className="l48-brief-tag">// Debug Mission — Exception Handling</div>
            <h2>Fix the broken error handler so your <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'hospital'}</span> API returns clean errors.</h2>
            <p>3 bugs. The exception handler has the wrong annotation, a missing exception type, and the wrong HTTP status code. Fix all three.</p>
          </div>
          <div className="l48-anatomy">
            <div className="l48-anatomy-title">// HTTP Status Codes</div>
            <div className="l48-anatomy-rows">
              {ANATOMY.map(a => (
                <div key={a.label} className="l48-anat-row">
                  <span className="l48-anat-annotation">{a.label}</span>
                  <span className="l48-anat-desc">— {a.desc}</span>
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