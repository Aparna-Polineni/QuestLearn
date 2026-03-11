// src/screens/stage4/Level4_14.jsx — Testing with MockMvc
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage4Shell from './Stage4Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from '../stage2/FillEditor';
import './Level4_14.css';

const SUPPORT = {
  intro: {
    concept: 'Testing with MockMvc',
    tagline: 'Test your endpoints without starting a real server.',
    whatYouWillDo: 'Fill in the test class annotations and MockMvc assertions that verify your GET and POST endpoints return the right data and status codes.',
    whyItMatters: 'A test catches bugs before they reach production. MockMvc lets you simulate HTTP requests and verify responses in milliseconds — no browser, no Postman, no running server. Professional APIs have tests for every endpoint.',
  },
  hints: [
    '@SpringBootTest + @AutoConfigureMockMvc loads the full application context and wires in MockMvc. @WebMvcTest(PatientController.class) is faster — loads only that controller.',
    'mockMvc.perform(get("/api/patients")) sends a fake GET request. .andExpect(status().isOk()) asserts 200. .andExpect(jsonPath("$[0].name").value("Alice")) checks the first result\'s name.',
    '.andExpect(status().isCreated()) asserts 201. .contentType(MediaType.APPLICATION_JSON) sets the Content-Type header for POST requests.',
  ],
  reveal: {
    concept: 'Spring Boot Testing with MockMvc',
    whatYouLearned: '@SpringBootTest loads the full context. @AutoConfigureMockMvc wires MockMvc in. mockMvc.perform() sends requests. andExpect() chains assertions. status().isOk() = 200, .isCreated() = 201, .isNotFound() = 404. jsonPath() traverses the JSON response. Tests run in CI — every deploy is verified.',
    realWorldUse: 'Every endpoint in a production Spring Boot API has at least 2 tests: happy path (correct input → correct response) and error path (bad input → correct error code). MockMvc tests run in <1 second each. A 50-endpoint API is fully tested in under a minute.',
    developerSays: 'Write tests as you build — not after. The test reveals whether your mental model matches reality. When your GET test fails on your own code, you find the bug in 2 minutes. When QA finds it in a browser, it takes 2 hours to trace back to a missing @PathVariable.',
  },
};

const TEMPLATE = `import org.springframework.boot.test.autoconfigure.web.servlet.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// FILL 1: Load the full Spring Boot application context for testing
___SPRING_BOOT_TEST___
// FILL 2: Auto-configure and inject MockMvc
___AUTO_MOCK_MVC___
public class PatientControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void getAllPatients_returns200() throws Exception {
        // FILL 3: Perform a GET request and expect HTTP 200
        mockMvc.perform(___GET_REQUEST___)
               .andExpect(___STATUS_200___);
    }

    @Test
    public void createPatient_returns201() throws Exception {
        String body = "{\\"name\\":\\"Alice\\",\\"ward\\":\\"1\\",\\"priority\\":\\"NORMAL\\"}";

        // FILL 4: Perform a POST request with the JSON body above
        mockMvc.perform(post("/api/patients")
                   .contentType(MediaType.APPLICATION_JSON)
                   .content(body))
               // FILL 5: Expect HTTP 201 Created
               .andExpect(___STATUS_201___);
    }
}`;

const BLANKS = [
  { id: 'SPRING_BOOT_TEST', answer: '@SpringBootTest',        placeholder: 'annotation', hint: 'Loads the full Spring Boot context — all beans, config, and database.' },
  { id: 'AUTO_MOCK_MVC',    answer: '@AutoConfigureMockMvc',  placeholder: 'annotation', hint: 'Tells Spring to create and inject a MockMvc instance automatically.' },
  { id: 'GET_REQUEST',      answer: 'get("/api/patients")',   placeholder: 'method call', hint: 'Static import get() simulates a GET request to that URL.' },
  { id: 'STATUS_200',       answer: 'status().isOk()',        placeholder: 'assertion',  hint: 'isOk() asserts HTTP 200. From MockMvcResultMatchers.status().' },
  { id: 'STATUS_201',       answer: 'status().isCreated()',   placeholder: 'assertion',  hint: 'isCreated() asserts HTTP 201. Same pattern as isOk().' },
];

const ANATOMY = [
  { assertion: 'status().isOk()',          code: '200 OK' },
  { assertion: 'status().isCreated()',     code: '201 Created' },
  { assertion: 'status().isNotFound()',    code: '404 Not Found' },
  { assertion: 'status().isBadRequest()', code: '400 Bad Request' },
  { assertion: 'jsonPath("$.name")',       code: 'checks JSON field' },
  { assertion: 'jsonPath("$[0].id")',      code: 'checks first item in array' },
];

export default function Level4_14() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage4Shell levelId={14} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l414-container">
          <div className="l414-brief">
            <div className="l414-brief-tag">// Fill Mission — MockMvc Tests</div>
            <h2>Write tests for the <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'hospital'}</span> API endpoints.</h2>
            <p>Five blanks. Set up the test class annotations, simulate GET and POST requests, and assert the right status codes.</p>
          </div>

          <div className="l414-anatomy">
            <div className="l414-anatomy-title">// MockMvc Assertion Reference</div>
            <div className="l414-anatomy-rows">
              {ANATOMY.map(a => (
                <div key={a.assertion} className="l414-anat-row">
                  <span className="l414-anat-assertion">{a.assertion}</span>
                  <span className="l414-anat-arrow">→</span>
                  <span className="l414-anat-code">{a.code}</span>
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