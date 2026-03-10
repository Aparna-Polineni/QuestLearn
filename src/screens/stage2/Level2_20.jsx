// src/screens/stage2/Level2_20.jsx — Lambdas & Streams
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import CodeEditor from './CodeEditor';
import './Level2_20.css';

const SUPPORT = {
  intro: {
    concept: "Java 8 Lambdas & Streams",
    tagline: "Lambdas turn multi-line anonymous classes into one-liners. Streams process collections declaratively.",
    whatYouWillDo: "Write three TODO sections — forEach with a lambda, a stream pipeline with sorted/distinct/limit, and a stream with filter/map/collect.",
    whyItMatters: "Modern Spring Boot code is full of lambdas and streams. Every .map(), .filter(), .collect() in a service layer is a lambda. If you cannot read them, you cannot read Spring Boot code.",
  },
  hints: [
    "forEach with lambda: list.forEach(name -> System.out.println(\"  \" + name)); The arrow -> separates the parameter from the body. No type needed — Java infers it from the list type.",
    "Stream pipeline: list.stream().sorted().distinct().limit(3).forEach(name -> System.out.println(\"  \" + name)); Chain the operations left to right. Nothing runs until the terminal operation (forEach, collect, count).",
    "filter + map + collect: list.stream().distinct().filter(name -> name.length() > 4).map(String::toUpperCase).collect(Collectors.toList()); — filter keeps matches, map transforms each one, collect gathers into a new List.",
  ],
  reveal: {
    concept: "Lambdas, Streams & Functional Java",
    whatYouLearned: "Lambdas: (params) -> body. Stream pipeline: filter (keep matching), map (transform), sorted, distinct, limit, collect. Streams are lazy — nothing executes until the terminal operation. Streams do not modify the original list — they produce new results.",
    realWorldUse: "In Spring Boot services: List<PatientDto> dtos = patients.stream().filter(p -> p.isActive()).map(p -> toDto(p)).collect(Collectors.toList()); That is the exact pattern for converting database entities to API response objects. Before Java 8 this was a for loop with a manual list.",
    developerSays: "When I see a for loop building a new list with an if inside, I rewrite it as a stream — not because it is shorter, but because the intent is clearer. filter + map + collect reads like English: keep the ones that match, transform each one, gather into a list.",
  },
};

const INITIAL_CODE = `import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {

        List<String> patients = new ArrayList<>();
        patients.add("Charlie");
        patients.add("Alice");
        patients.add("Bob");
        patients.add("Diana");
        patients.add("Alice"); // duplicate — intentional

        // ── TASK 1: Print all with forEach + lambda ──────────────────
        // Use: patients.forEach(name -> System.out.println("  " + name))
        // Print the header first, then the forEach
        System.out.println("All patients:");

        // TODO: use forEach with a lambda to print each patient indented with "  "

        // ── TASK 2: Sorted, distinct, first 3 ───────────────────────
        // Chain: .stream().sorted().distinct().limit(3)
        // Then forEach to print each one indented
        System.out.println("First 3 alphabetically:");

        // TODO: stream().sorted().distinct().limit(3).forEach(print with "  " indent)

        // ── TASK 3: Filter long names, uppercase, collect ────────────
        // Chain: .stream().distinct().filter(name.length() > 4).map(toUpperCase).collect
        // Print: "Long names: " + the collected list
        // TODO: build longNames list with stream, then print it

    }
}`;

const EXPECTED = `All patients:\n  Charlie\n  Alice\n  Bob\n  Diana\n  Alice\nFirst 3 alphabetically:\n  Alice\n  Bob\n  Charlie\nLong names: [CHARLIE, DIANA]`;

export default function Level2_20() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);
  return (
    <Stage2Shell levelId={20} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div className="l220-container">
          <div className="l220-brief">
            <div className="l220-brief-tag">// Build Mission</div>
            <h2>Process data with lambdas for your <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'system'}</span>.</h2>
            <p>The list is built and locked. Write only in the <code style={{color:'#38bdf8'}}>// TODO</code> lines — one lambda, one stream pipeline, one stream with collect.</p>
            <div className="l220-expected-box">
              <div className="l220-expected-label">Expected output</div>
              <pre className="l220-expected-output">{EXPECTED}</pre>
            </div>
          </div>

          {/* ── Anatomy ───────────────────────────────────────────── */}
          <div className="l220-anatomy">

            {/* Lambda syntax */}
            <div className="l220-anatomy-header">// Lambda syntax — anatomy</div>
            <div className="l220-lambda-diagram">
              <div className="l220-lambda-row">
                <div className="l220-lambda-parts">
                  <span className="l220-lam-param">name</span>
                  <span className="l220-lam-arrow"> -&gt; </span>
                  <span className="l220-lam-body">System.out.println("  " + name)</span>
                </div>
                <div className="l220-lambda-labels">
                  <span className="l220-lam-label param-label">parameter<br/>(type inferred)</span>
                  <span className="l220-lam-label arrow-label">lambda<br/>arrow</span>
                  <span className="l220-lam-label body-label">body<br/>(what to do)</span>
                </div>
              </div>
              <div className="l220-lambda-note">Java infers the type of <code>name</code> from the list: <code>List&lt;String&gt;</code> → <code>name</code> is a <code>String</code>. No <code>String</code> keyword needed.</div>
            </div>

            {/* Stream pipeline operations */}
            <div className="l220-anatomy-header" style={{marginTop:'18px'}}>// Stream pipeline — each operation explained</div>
            <div className="l220-pipeline">
              <div className="l220-pipeline-source">
                <span className="l220-pipe-label">Source</span>
                <div className="l220-code-block">
                  <div className="l220-code-line">
                    <span className="l220-tok-name">patients</span>
                    <span className="l220-tok-plain">.stream()</span>
                  </div>
                </div>
                <span className="l220-pipe-note">opens a stream — does not copy the list</span>
              </div>
              <div className="l220-pipe-arrow">→</div>
              {[
                { op: '.distinct()',   colour: '#60a5fa', note: 'removes duplicates — one "Alice" stays' },
                { op: '.filter(x -> x.length() > 4)', colour: '#a78bfa', note: 'keeps only names longer than 4 chars' },
                { op: '.sorted()',     colour: '#34d399', note: 'alphabetical order A → Z' },
                { op: '.limit(3)',     colour: '#fbbf24', note: 'takes only the first 3' },
                { op: '.map(String::toUpperCase)', colour: '#f97316', note: 'transforms each element' },
              ].map((op, i) => (
                <div key={i} className="l220-pipe-stage">
                  <span className="l220-pipe-label" style={{color: op.colour}}>Intermediate</span>
                  <div className="l220-code-block">
                    <div className="l220-code-line">
                      <span style={{color: op.colour, fontFamily:'Fira Code,monospace', fontSize:'12.5px'}}>{op.op}</span>
                    </div>
                  </div>
                  <span className="l220-pipe-note">{op.note}</span>
                  {i < 4 && <div className="l220-pipe-arrow small">→</div>}
                </div>
              ))}
              <div className="l220-pipe-arrow">→</div>
              <div className="l220-pipeline-terminal">
                <span className="l220-pipe-label terminal-label">Terminal</span>
                <div className="l220-code-block">
                  <div className="l220-code-line">
                    <span className="l220-tok-plain">.forEach(...)</span>
                  </div>
                  <div className="l220-code-line">
                    <span className="l220-tok-plain">.collect(Collectors.toList())</span>
                  </div>
                  <div className="l220-code-line">
                    <span className="l220-tok-plain">.count()</span>
                  </div>
                </div>
                <span className="l220-pipe-note">triggers execution — stream runs HERE</span>
              </div>
            </div>

            {/* Three tasks with exact code */}
            <div className="l220-anatomy-header" style={{marginTop:'18px'}}>// Exact patterns for each task</div>
            <div className="l220-tasks-ref">
              {[
                {
                  n: 1,
                  title: 'forEach + lambda',
                  code: 'patients.forEach(name -> System.out.println("  " + name));',
                  note: 'No .stream() needed — List has its own forEach()',
                },
                {
                  n: 2,
                  title: 'sorted + distinct + limit',
                  code: 'patients.stream()\n  .sorted().distinct().limit(3)\n  .forEach(name -> System.out.println("  " + name));',
                  note: 'Order matters: sorted first, then distinct, then limit 3',
                },
                {
                  n: 3,
                  title: 'filter + map + collect',
                  code: 'List<String> longNames = patients.stream()\n  .distinct()\n  .filter(name -> name.length() > 4)\n  .map(String::toUpperCase)\n  .collect(Collectors.toList());\nSystem.out.println("Long names: " + longNames);',
                  note: 'String::toUpperCase is a method reference — shorthand for name -> name.toUpperCase()',
                },
              ].map(t => (
                <div key={t.n} className="l220-task-ref">
                  <div className="l220-task-ref-header">
                    <span className="l220-task-num">Task {t.n}</span>
                    <span className="l220-task-title">{t.title}</span>
                  </div>
                  <pre className="l220-task-code">{t.code}</pre>
                  <div className="l220-task-note">{t.note}</div>
                </div>
              ))}
            </div>

            {/* Common mistake */}
            <div className="l220-mistake">
              <div className="l220-mistake-label">⚠ Streams are lazy — nothing runs without a terminal operation</div>
              <div className="l220-mistake-rows">
                <div className="l220-mistake-row bad">
                  <span className="l220-mistake-tag bad-tag">✗ Wrong</span>
                  <code>patients.stream().sorted().distinct();</code>
                  <span className="l220-mistake-note">no terminal operation — nothing executes, nothing prints</span>
                </div>
                <div className="l220-mistake-row good">
                  <span className="l220-mistake-tag good-tag">✓ Correct</span>
                  <code>patients.stream().sorted().distinct().forEach(name -&gt; System.out.println(name));</code>
                  <span className="l220-mistake-note"><code>forEach</code> is the terminal operation that triggers execution</span>
                </div>
              </div>
            </div>

          </div>

          <CodeEditor
            initialCode={INITIAL_CODE}
            expectedOutput={EXPECTED}
            onOutputChange={(_, correct) => setOk(correct)}
            hints={SUPPORT.hints}
            height={400}
            writableMarker="// TODO"
          />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}