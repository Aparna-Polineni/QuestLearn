// src/screens/stage5/Level5_20.jsx — Flyway Migrations (FILL)
import { useState } from 'react';
import Stage5Shell from './Stage5Shell';

const BLANKS = [
  { id: 'B1', answer: 'V1__create_tables.sql',      hint: 'V[version]__[description].sql — two underscores' },
  { id: 'B2', answer: 'V2__add_ward_floor.sql',      hint: 'Version 2, adds a column to wards' },
  { id: 'B3', answer: 'V3__add_indexes.sql',         hint: 'Version 3, adds performance indexes' },
  { id: 'B4', answer: 'ADD COLUMN',                  hint: 'SQL to add a new column to an existing table' },
  { id: 'B5', answer: 'CREATE INDEX',                hint: 'SQL to create an index' },
  { id: 'B6', answer: 'flyway.locations',             hint: 'Spring property that tells Flyway where to find migrations' },
];

export default function Level5_20() {
  const [vals, setVals] = useState({});
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState({});

  function check() {
    const r = {};
    BLANKS.forEach(b => { r[b.id] = (vals[b.id]||'').trim().toLowerCase() === b.answer.toLowerCase(); });
    setCorrect(r); setChecked(true);
  }
  const allCorrect = checked && BLANKS.every(b => correct[b.id]);

  function blank(bid) {
    const b = BLANKS.find(x=>x.id===bid);
    const state = !checked?'':correct[bid]?'correct':'incorrect';
    return (
      <input className={`s5-blank ${state}`} value={vals[bid]||''}
        onChange={e=>setVals(v=>({...v,[bid]:e.target.value}))}
        placeholder={b?.hint} style={{minWidth:180}} />
    );
  }

  return (
    <Stage5Shell levelId={20} canProceed={allCorrect}
      conceptReveal={[
        { label: 'Why Migrations?', detail: 'spring.jpa.hibernate.ddl-auto=create drops and recreates your tables on every restart — destroying production data. Flyway runs versioned SQL scripts in order, tracking which have already run. Safe for production.' },
        { label: 'Naming Convention', detail: 'V{version}__{description}.sql — capital V, version number, TWO underscores, description. Flyway rejects any file that doesn\'t match this pattern. R__ prefix for repeatable migrations.' },
        { label: 'flyway_schema_history', detail: 'Flyway creates a tracking table in your DB. Each migration gets a checksum. If you edit an already-applied migration, Flyway detects the checksum change and refuses to start — preventing accidental data loss.' },
      ]}
    >
      <div className="s5-intro">
        <h1>Flyway Migrations</h1>
        <p className="s5-tagline">🚀 Version-controlled database changes. Production-safe schema evolution.</p>
        <p className="s5-why">Never use ddl-auto=create in production. Flyway runs your SQL migrations in order, tracks which ran, and never re-runs a completed migration.</p>
      </div>

      <div className="s5-info">
        <p><strong style={{color:'#818cf8'}}>File structure:</strong> <code style={{color:'#94a3b8'}}>src/main/resources/db/migration/</code></p>
      </div>

      <div style={{marginBottom:20}}>
        <p style={{color:'#94a3b8',fontSize:14,marginBottom:12}}>Name these migration files correctly:</p>

        <div className="s5-migration">
          <div className="s5-migration-name">📁 db/migration / {blank('B1')}</div>
          <div className="s5-migration-body">
            <span className="sql-cmt">-- Initial schema</span><br/>
            <span className="s5-lc">CREATE TABLE wards (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(100) NOT NULL);</span><br/>
            <span className="s5-lc">CREATE TABLE patients (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(100) NOT NULL, ward_id INT, FOREIGN KEY (ward_id) REFERENCES wards(id));</span>
          </div>
        </div>

        <div className="s5-migration">
          <div className="s5-migration-name">📁 db/migration / {blank('B2')}</div>
          <div className="s5-migration-body">
            <span className="sql-cmt">-- Add floor column to wards (forgot it in V1)</span><br/>
            <span className="s5-lc">ALTER TABLE wards&nbsp;</span>
            <input className={`s5-blank ${!checked?'':correct['B4']?'correct':'incorrect'}`}
              value={vals['B4']||''} onChange={e=>setVals(v=>({...v,B4:e.target.value}))}
              placeholder="SQL command to add a column" style={{minWidth:110}} />
            <span className="s5-lc">&nbsp;floor INT NOT NULL DEFAULT 1;</span>
          </div>
        </div>

        <div className="s5-migration">
          <div className="s5-migration-name">📁 db/migration / {blank('B3')}</div>
          <div className="s5-migration-body">
            <span className="sql-cmt">-- Performance indexes</span><br/>
            <input className={`s5-blank ${!checked?'':correct['B5']?'correct':'incorrect'}`}
              value={vals['B5']||''} onChange={e=>setVals(v=>({...v,B5:e.target.value}))}
              placeholder="create index command" style={{minWidth:120}} />
            <span className="s5-lc">&nbsp;idx_patients_ward ON patients(ward_id);</span>
          </div>
        </div>
      </div>

      <div className="s5-migration">
        <div className="s5-migration-name">⚙️ application.properties</div>
        <div className="s5-migration-body">
          <span className="s5-lc">spring.jpa.hibernate.ddl-auto=validate</span><br/>
          <span className="s5-lc">spring.</span>
          <input className={`s5-blank ${!checked?'':correct['B6']?'correct':'incorrect'}`}
            value={vals['B6']||''} onChange={e=>setVals(v=>({...v,B6:e.target.value}))}
            placeholder="Flyway locations property" style={{minWidth:140}} />
          <span className="s5-lc">=classpath:db/migration</span>
        </div>
      </div>

      <button className="s5-check-btn" onClick={check}>Check Answers</button>
      {checked && (
        <div className={`s5-feedback ${allCorrect?'success':'error'}`}>
          {allCorrect ? '✅ Migration setup correct. Your schema is production-safe.' : '❌ Check the V__ naming and SQL commands.'}
        </div>
      )}
    </Stage5Shell>
  );
}
