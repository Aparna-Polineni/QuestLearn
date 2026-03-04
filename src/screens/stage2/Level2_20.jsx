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