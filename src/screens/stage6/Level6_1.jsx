// src/screens/stage6/Level6_1.jsx — CORS Configuration (FILL)
import { useState } from 'react';
import Stage6Shell from './Stage6Shell';
import FillEditor from '../stage2/FillEditor';

const BLANKS = [
  { id: 'CORS',      answer: '@CrossOrigin(origins = "http://localhost:3000")', placeholder: '@CrossOrigin annotation', hint: 'Allow requests from the React dev server on port 3000.' },
  { id: 'ALLOWED',   answer: 'allowedOrigins("http://localhost:3000")',          placeholder: 'allowedOrigins method',    hint: 'The Spring Security CORS config method for allowed origins.' },
  { id: 'METHODS',   answer: 'allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")', placeholder: 'allowedMethods', hint: 'List every HTTP verb React will use, plus OPTIONS for preflight.' },
  { id: 'HEADERS',   answer: 'allowedHeaders("*")',                              placeholder: 'allowedHeaders',          hint: 'Allow all request headers — including Authorization.' },
  { id: 'CREDS',     answer: 'allowCredentials(true)',                           placeholder: 'allowCredentials',        hint: 'Required for cookies and Authorization headers to be sent.' },
  { id: 'MAPPING',   answer: 'addMapping("/**")',                                placeholder: 'path mapping',            hint: 'Apply CORS rules to ALL endpoints, not just /api.' },
];

const TEMPLATE = `// OPTION 1 — Quick fix for a single controller
[CORS]
@RestController
@RequestMapping("/api/patients")
public class PatientController { }

// OPTION 2 — Global config in SecurityConfig (recommended)
@Configuration
public class SecurityConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.[ALLOWED];
        config.[METHODS];
        config.[HEADERS];
        config.[CREDS];

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.[MAPPING], config);
        return source;
    }
}`;

export default function Level6_1() {
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage6Shell levelId={1} canProceed={isCorrect}
      conceptReveal={[
        { label: 'Why OPTIONS?', detail: 'Before every cross-origin POST/PUT/DELETE, the browser sends a "preflight" OPTIONS request to ask if it\'s allowed. If Spring doesn\'t respond correctly to OPTIONS, the real request never fires. allowedMethods must include "OPTIONS".' },
        { label: '@CrossOrigin vs Global Config', detail: '@CrossOrigin on a controller is quick but you\'d have to add it to every controller. The global CorsConfigurationSource bean in SecurityConfig applies to everything automatically — always use this in production.' },
        { label: 'Production Origins', detail: 'In production, replace "http://localhost:3000" with your actual frontend URL: "https://myapp.com". Never use "*" (wildcard) with allowCredentials(true) — browsers reject that combination.' },
      ]}
    >
      <div className="s6-intro">
        <h1>CORS Configuration</h1>
        <p className="s6-tagline">🌐 The first thing to fix when your React app can't reach Spring Boot.</p>
        <p className="s6-why">Without CORS, every Axios call from React returns "Network Error" in the browser — but the same request works in Postman. CORS is a browser security feature, not an API one.</p>
      </div>

      <table className="s6-table">
        <thead><tr><th>Symptom</th><th>Cause</th><th>Fix</th></tr></thead>
        <tbody>
          <tr><td>Network Error in browser, works in Postman</td><td>CORS not configured</td><td>Add CorsConfigurationSource bean</td></tr>
          <tr><td>OPTIONS request returns 403</td><td>Spring Security blocking preflight</td><td>Add OPTIONS to allowedMethods</td></tr>
          <tr><td>Authorization header missing</td><td>allowCredentials not set</td><td>allowCredentials(true)</td></tr>
          <tr><td>Works on /api/patients, fails on /api/upload</td><td>addMapping too specific</td><td>Use addMapping("/**")</td></tr>
        </tbody>
      </table>

      <FillEditor template={TEMPLATE} blanks={BLANKS} onAllCorrect={() => setIsCorrect(true)} />
    </Stage6Shell>
  );
}
