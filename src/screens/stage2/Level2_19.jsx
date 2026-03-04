// src/screens/stage2/Level2_19.jsx — File I/O (simulated)
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import CodeEditor from './CodeEditor';
import './Level2_19.css';

const SUPPORT = {
  intro: {
    concept: "File I/O — Reading and Writing Files",
    tagline: "Files persist data beyond program execution. Read records in. Write reports out.",
    whatYouWillDo: "Write the TODO section — loop through simulated file lines, split each line by comma, filter for active patients, print them, then print the total count.",
    whyItMatters: "File I/O is the bridge between running programs and persistent storage. Log files, CSV exports, configuration files, batch processing — all file I/O. In Spring Boot, reading application.properties and writing log files uses these exact mechanisms.",
  },
  hints: [
    "simulateFileRead() returns a String[] — loop through it with for-each. Each line is: \"P001,Alice Smith,Cardiology,Active\" — split by \",\" gives: parts[0]=ID, parts[1]=Name, parts[2]=Ward, parts[3]=Status.",
    "Check if status is Active: parts[3].equals(\"Active\"). If so, print: \"[\" + parts[0] + \"] \" + parts[1] + \" - \" + parts[2]. Increment a counter each time.",
    "After the loop, print: \"Total active: \" + activeCount. Declare the int activeCount = 0 before the loop so it is in scope after the loop ends.",
  ],
  reveal: {
    concept: "File I/O, Streams & try-with-resources",
    whatYouLearned: "In real Java: BufferedReader reads line-by-line. PrintWriter writes text. try-with-resources auto-closes resources. All file operations can throw IOException. The pattern you used here — loop, split, filter, count — is identical to real file processing.",
    realWorldUse: "Spring Boot's logging uses file I/O via Logback. Spring Batch reads CSV files line by line with BufferedReader. Configuration loading reads application.properties with file streams. The pattern is identical to what you practiced here.",
    developerSays: "Always use try-with-resources for anything that implements Closeable — files, database connections, HTTP clients. Forgetting to close a file descriptor is a resource leak. In a server handling thousands of requests, leaks accumulate until the JVM crashes with 'Too many open files'.",
  },
};

const INITIAL_CODE = `// NOTE: Real file I/O cannot run in a browser.
// This simulates the pattern using String data.
// In a real Java project: use BufferedReader(new FileReader("file.csv"))

public class Main {

    // Simulates reading lines from a patient CSV file
    // Each line format: "ID,Name,Ward,Status"
    static String[] simulateFileRead() {
        return new String[]{
            "P001,Alice Smith,Cardiology,Active",
            "P002,Bob Jones,Oncology,Discharged",
            "P003,Carol White,Neurology,Active"
        };
    }

    public static void main(String[] args) {

        System.out.println("=== Patient Report ===");

        // ── TASK: Process the file lines ─────────────────────────────
        // 1. Get the lines array from simulateFileRead()
        // 2. Declare int activeCount = 0 before the loop
        // 3. For each line: split by "," to get parts[]
        //    parts[0]=ID, parts[1]=Name, parts[2]=Ward, parts[3]=Status
        // 4. If parts[3] equals "Active":
        //    print "[ID] Name - Ward" and increment activeCount
        // 5. After loop: print "Total active: " + activeCount

        // TODO: write the loop, split, filter, and count logic here

    }
}`;

const EXPECTED = `=== Patient Report ===\n[P001] Alice Smith - Cardiology\n[P003] Carol White - Neurology\nTotal active: 2`;

export default function Level2_19() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);
  return (
    <Stage2Shell levelId={19} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div className="l219-container">
          <div className="l219-brief">
            <div className="l219-brief-tag">// Build Mission</div>
            <h2>Process patient records for your <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'system'}</span>.</h2>
            <p>The file simulator and class structure are locked. Write only in the <code style={{color:'#38bdf8'}}>// TODO</code> line — the full loop logic goes there.</p>
            <div className="l219-expected-box">
              <div className="l219-expected-label">Expected output</div>
              <pre className="l219-expected-output">{EXPECTED}</pre>
            </div>
          </div>
          <CodeEditor
            initialCode={INITIAL_CODE}
            expectedOutput={EXPECTED}
            onOutputChange={(_, correct) => setOk(correct)}
            hints={SUPPORT.hints}
            height={380}
            writableMarker="// TODO"
          />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}