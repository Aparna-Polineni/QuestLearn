// src/screens/data-engineer/stage2/DE2_Level1.jsx — SELECT Basics (FILL)
// Reference implementation of DiagnosticFeedback
import { useState } from 'react';
import DE2Shell from './DE2Shell';
import { DiagnosticFeedback } from '../../../components/LevelSupport';
import useDraftAnswers from '../../../hooks/useDraftAnswers';

const BLANKS = [
  {
    id:'B1', answer:'SELECT', category:'syntax',
    hint:'Start every query — choose which columns to return',
    wrong_feedback: {
      'insert':  'INSERT writes new rows into a table. You need to read data here, not write it.',
      'update':  'UPDATE modifies existing rows. You need to retrieve rows first — think: read vs write.',
      'delete':  'DELETE removes rows. You want to read them, not remove them.',
      'from':    'FROM specifies the table — but you need a keyword before it that names the columns to return.',
      '*':       'This keyword names which columns to return from the table. It starts every read query in SQL.',
    },
  },
  {
    id:'B2', answer:'FROM', category:'syntax',
    hint:'Which table to read from',
    wrong_feedback: {
      'where':   'WHERE filters rows — but you haven\'t named the table yet. Table comes before filter.',
      'join':    'JOIN connects tables — but first SQL needs to know the starting table.',
      'select':  'SELECT already appeared on the line above. This keyword specifies which table to read from.',
      '*':       'After listing the columns, SQL needs to know which table they come from.',
    },
  },
  {
    id:'B3', answer:'WHERE', category:'logic',
    hint:'Filter rows — only return rows matching this condition',
    wrong_feedback: {
      'having':  'HAVING filters groups after aggregation. You\'re filtering individual rows here — before any grouping.',
      'and':     'AND combines conditions — but you haven\'t started the filter clause yet.',
      'if':      'SQL doesn\'t use IF for filtering rows in a query. There\'s a specific clause for row conditions.',
      '*':       'You need a clause that filters which rows are included. Think: which word introduces a condition on rows?',
    },
  },
  {
    id:'B4', answer:'AND', category:'logic',
    hint:'Both conditions must be true',
    wrong_feedback: {
      'or':      'OR means either condition can be true — but you need both to be true here simultaneously.',
      'where':   'WHERE already appeared above. This keyword connects the two conditions inside the WHERE clause.',
      'but':     'SQL uses specific keywords for combining conditions — not natural language like "but".',
      '*':       'Two conditions joined together — both must be true. One keyword does this in SQL.',
    },
  },
  {
    id:'B5', answer:'ORDER BY', category:'order',
    hint:'Sort results — add DESC for highest first',
    wrong_feedback: {
      'sort by':   'SORT BY is not valid SQL syntax — the SQL keyword for sorting is different.',
      'group by':  'GROUP BY aggregates rows into groups. You want to sort the results, not group them.',
      'order':     'Close — but SQL needs both words together as the sorting clause.',
      '*':         'You want to sort the result rows. SQL has a two-word clause for this.',
    },
  },
  {
    id:'B6', answer:'LIMIT', category:'syntax',
    hint:'Return only the first N rows',
    wrong_feedback: {
      'top':     'TOP is SQL Server syntax. In MySQL/Postgres/BigQuery the equivalent is a different keyword placed at the end.',
      'max':     'MAX() is an aggregate function that returns the maximum value — not the same as restricting row count.',
      'rownum':  'ROWNUM is Oracle syntax. Standard SQL uses a simpler keyword for this.',
      '*':       'You want to cap how many rows come back. One short keyword at the end of the query does this.',
    },
  },
  {
    id:'B7', answer:'DISTINCT', category:'logic',
    hint:'Remove duplicate rows from results',
    wrong_feedback: {
      'unique':  'UNIQUE is used in constraints (CREATE TABLE), not in SELECT queries for deduplication.',
      'group by':'GROUP BY can deduplicate but requires aggregation. There\'s a simpler single-word option here.',
      '*':       'You want each row to appear only once. One keyword placed right after SELECT does this.',
    },
  },
  {
    id:'B8', answer:'LIKE', category:'concept',
    hint:'Pattern match — % wildcard, _ single character',
    wrong_feedback: {
      'contains': 'CONTAINS is not standard SQL. SQL uses a different operator for pattern matching with wildcards.',
      'match':    'MATCH is used for full-text search in MySQL. For simple wildcard patterns, SQL has a simpler operator.',
      '=':        'Equals (=) does exact matching only. You need a ward ID that *starts with* "A" — that\'s a pattern, not an exact value.',
      '*':        'You need to match a pattern — ward IDs that start with "A". SQL has a specific operator for pattern matching.',
    },
  },
];

const LINES = [
  '-- Get ward A patients sorted by fee',
  '[B1] name, ward_id, fee',
  '[B2] patients',
  '[B3] status = "active"',
  '[B4] fee > 50',
  '[B5] fee DESC',
  '[B6] 10;',
  '',
  '-- Remove duplicate ward IDs from results',
  '[B1] [B7] ward_id [B2] patients;',
  '',
  '-- Find all wards starting with letter A',
  '[B1] * [B2] wards [B3] ward_code [B8] "A%";',
];

export default function DE2_Level1() {
  // useDraftAnswers persists typed answers across page refresh (Area 7)
  const [vals, setVals, clearDraft] = useDraftAnswers('de-2-1', {});
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState({});
  const [wrongAttempts, setWrongAttempts] = useState(0);

  function check() {
    const r = {};
    BLANKS.forEach(b => {
      r[b.id] = (vals[b.id] || '').trim().toUpperCase() === b.answer.toUpperCase();
    });
    setCorrect(r);
    setChecked(true);
    const allRight = BLANKS.every(b => r[b.id]);
    if (!allRight) {
      setWrongAttempts(n => n + 1);
    } else {
      clearDraft(); // level complete — remove the localStorage draft
    }
  }

  const allCorrect = checked && BLANKS.every(b => correct[b.id]);

  function renderLine(line, lineIdx) {
    if (line.startsWith('--')) return (
      <div key={lineIdx} style={{color:'#475569',fontStyle:'italic',padding:'1px 0'}}>{line}</div>
    );
    if (!line.trim()) return <div key={lineIdx} style={{height:8}}/>;
    const parts = line.split(/(\[B\d\])/g);
    return (
      <div key={lineIdx} style={{padding:'1px 0',color:'#cbd5e1',whiteSpace:'pre-wrap'}}>
        {parts.map((p, pi) => {
          const m = p.match(/^\[B(\d)\]$/);
          if (!m) return <span key={pi}>{p}</span>;
          const bid = 'B' + m[1];
          const bl  = BLANKS.find(b => b.id === bid);
          const st  = !checked ? '' : correct[bid] ? 'correct' : 'incorrect';
          return (
            <input
              key={pi}
              className={`de2-blank ${st}`}
              value={vals[bid] || ''}
              onChange={e => setVals(v => ({ ...v, [bid]: e.target.value }))}
              placeholder={bl?.hint}
              style={{ minWidth: 90, whiteSpace: 'normal' }}
            />
          );
        })}
      </div>
    );
  }

  return (
    <DE2Shell levelId={1} canProceed={allCorrect} wrongAttempts={wrongAttempts}
      conceptReveal={[
        { label:'Clause Order is Enforced', detail:'SQL clauses must appear in order: SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT. Writing them out of order causes a syntax error. The database executes them in a different order internally (FROM first, SELECT last) — but you write them in the standard order.' },
        { label:'DISTINCT vs GROUP BY', detail:'SELECT DISTINCT ward_id returns unique ward IDs in one line. SELECT ward_id, COUNT(*) FROM patients GROUP BY ward_id returns unique ward IDs plus a count per ward. Use DISTINCT for deduplication, GROUP BY for aggregation.' },
      ]}
      prevLevelContext="In the last level you set up the database and ran basic reads. Now you'll master SELECT — the clause that names which columns to return, combined with filtering and sorting."
      cumulativeSkills={[
        "Set up the hospital analytics database and ran first SELECT queries",
        "Written SELECT, FROM, WHERE, ORDER BY, LIMIT, DISTINCT, and LIKE queries",
      ]}
    >
      <div className="de2-intro">
        <h1>SELECT — Reading Data</h1>
        <p className="de2-tagline">🔍 Every data engineering query starts here.</p>
        <p className="de2-why">You cannot manipulate data you cannot read. SELECT, FROM, WHERE, and ORDER BY are the skeleton of every analytics query — from a simple lookup to a complex pipeline transformation.</p>
      </div>

      <div className="de2-panel">
        <div className="de2-panel-hdr">🗄️ SQL SELECT — fill the blanks</div>
        <div className="de2-panel-body">{LINES.map(renderLine)}</div>
      </div>

      {/* Diagnostic feedback — replaces generic error message */}
      {checked && !allCorrect && (
        <DiagnosticFeedback
          blanks={BLANKS}
          vals={vals}
          correct={correct}
          checked={checked}
        />
      )}

      <button className="de2-check-btn" onClick={check}>Check Answers</button>

      {checked && allCorrect && (
        <div className="de2-feedback success">✅ SELECT fundamentals solid.</div>
      )}
    </DE2Shell>
  );
}
