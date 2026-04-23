// src/components/AnatomyDiagram.jsx
// Visual anatomy cards — one SVG diagram per DE Stage 1 level.
// Each diagram shows the hospital domain concept as a labelled structure,
// not just text. Used before the exercise begins.
//
// Usage:
//   import AnatomyDiagram from '../../../components/AnatomyDiagram';
//   <AnatomyDiagram levelKey="de1-2" color="#06b6d4" />

import './AnatomyDiagram.css';

// ── Shared SVG primitives ─────────────────────────────────────────────────

function Box({ x, y, w = 140, h = 52, rx = 8, fill = '#0f2340', stroke, label, sub, emoji }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx}
        fill={fill} stroke={stroke || 'none'} strokeWidth={stroke ? 1.5 : 0} />
      {emoji && <text x={x + 14} y={y + h / 2 + 1} fontSize={18} dominantBaseline="middle">{emoji}</text>}
      <text x={x + (emoji ? 38 : w / 2)} y={y + (sub ? h / 2 - 7 : h / 2 + 1)}
        textAnchor={emoji ? 'start' : 'middle'} fontSize={12} fontWeight={700}
        fill="#f0f4ff" fontFamily="DM Sans, sans-serif" dominantBaseline="middle">
        {label}
      </text>
      {sub && (
        <text x={x + (emoji ? 38 : w / 2)} y={y + h / 2 + 10}
          textAnchor={emoji ? 'start' : 'middle'} fontSize={10}
          fill="#64748b" fontFamily="DM Mono, monospace" dominantBaseline="middle">
          {sub}
        </text>
      )}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color = '#334155', label }) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return (
    <g>
      <defs>
        <marker id={`arr-${x1}-${x2}`} markerWidth="8" markerHeight="8"
          refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={color} />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2 - 8} y2={y2}
        stroke={color} strokeWidth={1.5}
        markerEnd={`url(#arr-${x1}-${x2})`} />
      {label && (
        <text x={mx} y={my - 6} textAnchor="middle" fontSize={9}
          fill="#475569" fontFamily="DM Mono, monospace">{label}</text>
      )}
    </g>
  );
}

function Chip({ x, y, text, color }) {
  const w = text.length * 6.5 + 16;
  return (
    <g>
      <rect x={x - w / 2} y={y - 10} width={w} height={20} rx={10}
        fill={`${color}22`} stroke={`${color}66`} strokeWidth={1} />
      <text x={x} y={y + 1} textAnchor="middle" fontSize={9} fontWeight={700}
        fill={color} fontFamily="DM Mono, monospace" dominantBaseline="middle">
        {text}
      </text>
    </g>
  );
}

function SectionLabel({ x, y, text, color }) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize={9} fontWeight={800}
      fill={color || '#475569'} fontFamily="DM Mono, monospace"
      letterSpacing={1} textTransform="uppercase">
      {text.toUpperCase()}
    </text>
  );
}

// ── Individual diagrams ────────────────────────────────────────────────────

// Level 0 — What is Data Engineering
function DiagramDE10({ color }) {
  return (
    <svg viewBox="0 0 560 200" className="anat-svg">
      {/* Sources */}
      <Box x={10} y={74} w={110} h={52} label="Hospital DB" sub="raw patient data" emoji="🏥" fill="#0a1628" stroke={color} />
      <Box x={10} y={136} w={110} h={40} label="API / Logs" sub="events" emoji="📡" fill="#0a1628" stroke="#334155" />
      {/* DE person */}
      <g>
        <rect x={145} y={60} width={130} height={90} rx={10} fill="#0f2340" stroke={color} strokeWidth={1.5} strokeDasharray="4 2" />
        <text x={210} y={80} textAnchor="middle" fontSize={9} fill={color} fontFamily="DM Mono, monospace" fontWeight={800}>DATA ENGINEER</text>
        <text x={210} y={98} textAnchor="middle" fontSize={11} fill="#94a3b8" fontFamily="DM Sans, sans-serif">Collects · Cleans</text>
        <text x={210} y={114} textAnchor="middle" fontSize={11} fill="#94a3b8" fontFamily="DM Sans, sans-serif">Transforms · Loads</text>
        <text x={210} y={132} textAnchor="middle" fontSize={18}>🛢️</text>
      </g>
      {/* Warehouse */}
      <Box x={300} y={74} w={120} h={52} label="Data Warehouse" sub="clean + structured" emoji="🗄️" fill="#0a1628" stroke="#4ade80" />
      {/* Consumers */}
      <Box x={440} y={54} w={110} h={36} label="Analyst" sub="dashboards" emoji="📊" fill="#0a1628" stroke="#334155" />
      <Box x={440} y={98} w={110} h={36} label="ML Model" sub="predictions" emoji="🤖" fill="#0a1628" stroke="#334155" />
      <Box x={440} y={142} w={110} h={36} label="Executive" sub="reports" emoji="👔" fill="#0a1628" stroke="#334155" />
      {/* Arrows */}
      <Arrow x1={120} y1={100} x2={145} y2={100} color={color} />
      <Arrow x1={120} y1={156} x2={145} y2={130} color="#475569" />
      <Arrow x1={275} y1={100} x2={300} y2={100} color={color} label="ETL" />
      <Arrow x1={420} y1={100} x2={440} y2={72} color="#4ade80" />
      <Arrow x1={420} y1={100} x2={440} y2={116} color="#4ade80" />
      <Arrow x1={420} y1={100} x2={440} y2={160} color="#4ade80" />
      {/* Labels */}
      <SectionLabel x={65} y={54} text="SOURCES" color="#475569" />
      <SectionLabel x={440} y={44} text="CONSUMERS" color="#475569" />
    </svg>
  );
}

// Level 1 — Data Quality Disasters
function DiagramDE11({ color }) {
  return (
    <svg viewBox="0 0 560 200" className="anat-svg">
      {/* Three columns of bugs */}
      {/* Bug 1: NULL */}
      <g>
        <rect x={10} y={30} width={160} height={155} rx={10} fill="#1a0a0a" stroke="#f87171" strokeWidth={1.5} />
        <text x={90} y={52} textAnchor="middle" fontSize={10} fill="#f87171" fontWeight={800} fontFamily="DM Mono, monospace">NULL CRASH</text>
        <rect x={22} y={62} width={136} height={52} rx={6} fill="#0f172a" />
        <text x={90} y={80} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="DM Mono, monospace">patient_dob = NULL</text>
        <text x={90} y={94} textAnchor="middle" fontSize={9} fill="#f87171" fontFamily="DM Mono, monospace">age = 2024 - NULL</text>
        <text x={90} y={108} textAnchor="middle" fontSize={9} fill="#f87171" fontFamily="DM Mono, monospace">→ TypeError 💥</text>
        <path d="M90,125 L90,148" stroke="#475569" strokeWidth={1} strokeDasharray="3 2" />
        <Chip x={90} y={158} text="FIX: COALESCE(dob, '1900-01-01')" color="#4ade80" />
      </g>
      {/* Bug 2: Duplicate */}
      <g>
        <rect x={195} y={30} width={170} height={155} rx={10} fill="#1a1200" stroke="#fbbf24" strokeWidth={1.5} />
        <text x={280} y={52} textAnchor="middle" fontSize={10} fill="#fbbf24" fontWeight={800} fontFamily="DM Mono, monospace">DUPLICATE ROWS</text>
        <rect x={207} y={62} width={146} height={68} rx={6} fill="#0f172a" />
        <text x={280} y={78} textAnchor="middle" fontSize={9} fill="#94a3b8" fontFamily="DM Mono, monospace">id=42 John Doe ← original</text>
        <text x={280} y={92} textAnchor="middle" fontSize={9} fill="#fbbf24" fontFamily="DM Mono, monospace">id=42 John Doe ← duplicate</text>
        <text x={280} y={106} textAnchor="middle" fontSize={9} fill="#fbbf24" fontFamily="DM Mono, monospace">COUNT(*) = 2 ← wrong!</text>
        <text x={280} y={118} textAnchor="middle" fontSize={9} fill="#f87171" fontFamily="DM Mono, monospace">Revenue doubled 🤯</text>
        <path d="M280,137 L280,148" stroke="#475569" strokeWidth={1} strokeDasharray="3 2" />
        <Chip x={280} y={158} text="FIX: INSERT ... ON CONFLICT DO NOTHING" color="#4ade80" />
      </g>
      {/* Bug 3: Timezone */}
      <g>
        <rect x={385} y={30} width={165} height={155} rx={10} fill="#0a0f1a" stroke="#818cf8" strokeWidth={1.5} />
        <text x={468} y={52} textAnchor="middle" fontSize={10} fill="#818cf8" fontWeight={800} fontFamily="DM Mono, monospace">TIMEZONE MISMATCH</text>
        <rect x={397} y={62} width={141} height={68} rx={6} fill="#0f172a" />
        <text x={468} y={78} textAnchor="middle" fontSize={9} fill="#94a3b8" fontFamily="DM Mono, monospace">appt: 09:00 UTC+0</text>
        <text x={468} y={92} textAnchor="middle" fontSize={9} fill="#94a3b8" fontFamily="DM Mono, monospace">system: 05:00 UTC-4</text>
        <text x={468} y={106} textAnchor="middle" fontSize={9} fill="#818cf8" fontFamily="DM Mono, monospace">Diff = 4 hours ← not 0</text>
        <text x={468} y={118} textAnchor="middle" fontSize={9} fill="#f87171" fontFamily="DM Mono, monospace">Late flag = wrong 🌍</text>
        <path d="M468,137 L468,148" stroke="#475569" strokeWidth={1} strokeDasharray="3 2" />
        <Chip x={468} y={158} text="FIX: store all timestamps as UTC" color="#4ade80" />
      </g>
    </svg>
  );
}

// Level 2 — Anatomy of a Pipeline
function DiagramDE12({ color }) {
  return (
    <svg viewBox="0 0 560 220" className="anat-svg">
      {/* Title row */}
      <SectionLabel x={90} y={20} text="EXTRACT" color={color} />
      <SectionLabel x={280} y={20} text="TRANSFORM" color="#f59e0b" />
      <SectionLabel x={460} y={20} text="LOAD" color="#4ade80" />
      {/* Vertical lane dividers */}
      <line x1={185} y1={25} x2={185} y2={205} stroke="#1e293b" strokeWidth={1} strokeDasharray="4 3" />
      <line x1={375} y1={25} x2={375} y2={205} stroke="#1e293b" strokeWidth={1} strokeDasharray="4 3" />
      {/* EXTRACT lane */}
      <Box x={20} y={36} w={150} h={44} label="Patient Admissions" sub="PostgreSQL · raw" emoji="🏥" fill="#0a1628" stroke={color} />
      <Box x={20} y={90} w={150} h={36} label="Billing System" sub="CSV export" emoji="💳" fill="#0a1628" stroke="#334155" />
      <Box x={20} y={136} w={150} h={36} label="Lab Results API" sub="JSON endpoint" emoji="🧪" fill="#0a1628" stroke="#334155" />
      {/* Extract arrows → */}
      <Arrow x1={170} y1={58} x2={194} y2={100} color={color} />
      <Arrow x1={170} y1={108} x2={194} y2={108} color="#475569" />
      <Arrow x1={170} y1={154} x2={194} y2={116} color="#475569" />
      {/* TRANSFORM lane */}
      <rect x={192} y={64} width={175} height={110} rx={10} fill="#0f2006" stroke="#f59e0b" strokeWidth={1.5} />
      <text x={280} y={86} textAnchor="middle" fontSize={10} fill="#f59e0b" fontWeight={700} fontFamily="DM Mono, monospace">python transform.py</text>
      <text x={280} y={102} textAnchor="middle" fontSize={10} fill="#94a3b8" fontFamily="DM Sans, sans-serif">① Fill NULL dob → 1900-01-01</text>
      <text x={280} y={118} textAnchor="middle" fontSize={10} fill="#94a3b8" fontFamily="DM Sans, sans-serif">② Normalise dates → UTC</text>
      <text x={280} y={134} textAnchor="middle" fontSize={10} fill="#94a3b8" fontFamily="DM Sans, sans-serif">③ Deduplicate on patient_id</text>
      <text x={280} y={150} textAnchor="middle" fontSize={10} fill="#94a3b8" fontFamily="DM Sans, sans-serif">④ Join billing + lab rows</text>
      <text x={280} y={166} textAnchor="middle" fontSize={10} fill="#94a3b8" fontFamily="DM Sans, sans-serif">⑤ Validate schema</text>
      {/* Transform → Load */}
      <Arrow x1={367} y1={119} x2={390} y2={119} color="#4ade80" label="clean rows" />
      {/* LOAD lane */}
      <Box x={390} y={58} w={155} h={52} label="Data Warehouse" sub="BigQuery · Snowflake" emoji="🗄️" fill="#0a1628" stroke="#4ade80" />
      <Box x={390} y={122} w={155} h={38} label="Analytics Layer" sub="dbt models · Looker" emoji="📊" fill="#0a1628" stroke="#334155" />
      {/* Idempotency badge */}
      <rect x={390} y={170} width={155} height={30} rx={6} fill="#0f2340" stroke="#818cf8" strokeWidth={1} />
      <text x={468} y={181} textAnchor="middle" fontSize={9} fill="#818cf8" fontFamily="DM Mono, monospace" fontWeight={700}>IDEMPOTENT</text>
      <text x={468} y={193} textAnchor="middle" fontSize={9} fill="#475569" fontFamily="DM Mono, monospace">safe to re-run on crash</text>
    </svg>
  );
}

// Level 3 — Schema Design
function DiagramDE13({ color }) {
  return (
    <svg viewBox="0 0 560 220" className="anat-svg">
      {/* PATIENTS table */}
      <g>
        <rect x={10} y={10} width={155} height={150} rx={8} fill="#0a1628" stroke={color} strokeWidth={1.5} />
        <rect x={10} y={10} width={155} height={28} rx={8} fill={`${color}33`} />
        <rect x={10} y={36} width={155} height={2} fill={color} />
        <text x={88} y={30} textAnchor="middle" fontSize={11} fontWeight={800} fill={color} fontFamily="DM Mono, monospace">PATIENTS</text>
        {[
          ['🔑', 'patient_id', 'INT PK'],
          ['', 'name', 'VARCHAR'],
          ['', 'dob', 'DATE'],
          ['', 'nhs_number', 'CHAR(10)'],
          ['', 'ward_id', 'INT FK →'],
          ['', 'gp_id', 'INT FK →'],
        ].map(([icon, col, type], i) => (
          <g key={col}>
            <text x={22} y={58 + i * 18} fontSize={9} fill={icon ? color : '#64748b'} fontFamily="DM Mono, monospace">{icon}</text>
            <text x={34} y={58 + i * 18} fontSize={10} fill="#94a3b8" fontFamily="DM Mono, monospace">{col}</text>
            <text x={150} y={58 + i * 18} textAnchor="end" fontSize={9} fill="#475569" fontFamily="DM Mono, monospace">{type}</text>
          </g>
        ))}
      </g>

      {/* WARDS table */}
      <g>
        <rect x={200} y={10} width={150} height={100} rx={8} fill="#0a1628" stroke="#f59e0b" strokeWidth={1} />
        <rect x={200} y={10} width={150} height={28} rx={8} fill="#f59e0b22" />
        <text x={275} y={30} textAnchor="middle" fontSize={11} fontWeight={800} fill="#f59e0b" fontFamily="DM Mono, monospace">WARDS</text>
        {[['🔑', 'ward_id', 'INT PK'], ['', 'name', 'VARCHAR'], ['', 'floor', 'INT'], ['', 'capacity', 'INT']].map(([icon, col, type], i) => (
          <g key={col}>
            <text x={212} y={54 + i * 16} fontSize={9} fill={icon ? '#f59e0b' : '#64748b'} fontFamily="DM Mono, monospace">{icon}</text>
            <text x={224} y={54 + i * 16} fontSize={10} fill="#94a3b8" fontFamily="DM Mono, monospace">{col}</text>
            <text x={342} y={54 + i * 16} textAnchor="end" fontSize={9} fill="#475569" fontFamily="DM Mono, monospace">{type}</text>
          </g>
        ))}
      </g>

      {/* APPOINTMENTS table */}
      <g>
        <rect x={200} y={125} width={150} height={95} rx={8} fill="#0a1628" stroke="#818cf8" strokeWidth={1} />
        <rect x={200} y={125} width={150} height={28} rx={8} fill="#818cf822" />
        <text x={275} y={145} textAnchor="middle" fontSize={11} fontWeight={800} fill="#818cf8" fontFamily="DM Mono, monospace">APPOINTMENTS</text>
        {[['🔑', 'appt_id', 'INT PK'], ['→', 'patient_id', 'INT FK'], ['→', 'doctor_id', 'INT FK'], ['', 'scheduled_at', 'TIMESTAMPTZ']].map(([icon, col, type], i) => (
          <g key={col}>
            <text x={212} y={169 + i * 16} fontSize={9} fill={icon === '🔑' ? '#818cf8' : icon === '→' ? '#f59e0b' : '#64748b'} fontFamily="DM Mono, monospace">{icon}</text>
            <text x={224} y={169 + i * 16} fontSize={10} fill="#94a3b8" fontFamily="DM Mono, monospace">{col}</text>
            <text x={342} y={169 + i * 16} textAnchor="end" fontSize={9} fill="#475569" fontFamily="DM Mono, monospace">{type}</text>
          </g>
        ))}
      </g>

      {/* DOCTORS table */}
      <g>
        <rect x={380} y={10} width={165} height={100} rx={8} fill="#0a1628" stroke="#4ade80" strokeWidth={1} />
        <rect x={380} y={10} width={165} height={28} rx={8} fill="#4ade8022" />
        <text x={463} y={30} textAnchor="middle" fontSize={11} fontWeight={800} fill="#4ade80" fontFamily="DM Mono, monospace">DOCTORS</text>
        {[['🔑', 'doctor_id', 'INT PK'], ['', 'name', 'VARCHAR'], ['', 'specialty', 'VARCHAR'], ['→', 'ward_id', 'INT FK']].map(([icon, col, type], i) => (
          <g key={col}>
            <text x={392} y={54 + i * 16} fontSize={9} fill={icon === '🔑' ? '#4ade80' : icon === '→' ? '#f59e0b' : '#64748b'} fontFamily="DM Mono, monospace">{icon}</text>
            <text x={404} y={54 + i * 16} fontSize={10} fill="#94a3b8" fontFamily="DM Mono, monospace">{col}</text>
            <text x={537} y={54 + i * 16} textAnchor="end" fontSize={9} fill="#475569" fontFamily="DM Mono, monospace">{type}</text>
          </g>
        ))}
      </g>

      {/* Normalisation note */}
      <rect x={380} y={125} width={165} height={95} rx={8} fill="#0f1a0f" stroke="#334155" strokeWidth={1} />
      <text x={463} y={145} textAnchor="middle" fontSize={10} fill="#4ade80" fontWeight={700} fontFamily="DM Mono, monospace">NORMAL FORM</text>
      <text x={463} y={161} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="DM Sans, sans-serif">Each fact stored once.</text>
      <text x={463} y={175} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="DM Sans, sans-serif">No repeated ward name</text>
      <text x={463} y={189} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="DM Sans, sans-serif">across 10,000 patients.</text>
      <text x={463} y={207} textAnchor="middle" fontSize={9} fill="#4ade80" fontFamily="DM Mono, monospace">UPDATE ward in 1 row ✓</text>

      {/* Relationship arrows */}
      <Arrow x1={165} y1={94} x2={200} y2={60} color="#f59e0b" />
      <Arrow x1={165} y1={112} x2={380} y2={60} color="#4ade80" />
      <Arrow x1={200} y1={178} x2={165} y2={65} color={color} />
      <Arrow x1={350} y1={177} x2={380} y2={70} color="#4ade80" />
    </svg>
  );
}

// Level 4 — Batch vs Streaming
function DiagramDE14({ color }) {
  return (
    <svg viewBox="0 0 560 210" className="anat-svg">
      {/* BATCH side */}
      <text x={140} y={22} textAnchor="middle" fontSize={13} fontWeight={800} fill={color} fontFamily="DM Sans, sans-serif">BATCH</text>
      <text x={140} y={36} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="DM Mono, monospace">run once, process many</text>
      {/* Timeline */}
      <rect x={20} y={50} width={240} height={8} rx={4} fill="#1e293b" />
      {[0, 60, 120, 180].map(x => (
        <g key={x}>
          <rect x={22 + x} y={48} width={52} height={12} rx={3} fill="#0f2340" stroke="#334155" strokeWidth={1} />
        </g>
      ))}
      {/* Batch windows */}
      <rect x={22} y={48} width={52} height={12} rx={3} fill={`${color}33`} stroke={color} strokeWidth={1.5} />
      <text x={48} y={70} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="DM Mono, monospace">00:00</text>
      <rect x={82} y={48} width={52} height={12} rx={3} fill={`${color}33`} stroke={color} strokeWidth={1.5} />
      <text x={108} y={70} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="DM Mono, monospace">06:00</text>
      <rect x={142} y={48} width={52} height={12} rx={3} fill={`${color}33`} stroke={color} strokeWidth={1.5} />
      <text x={168} y={70} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="DM Mono, monospace">12:00</text>
      <rect x={202} y={48} width={52} height={12} rx={3} fill={`${color}33`} stroke={color} strokeWidth={1.5} />
      <text x={228} y={70} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="DM Mono, monospace">18:00</text>
      {/* Batch characteristics */}
      {[
        '✓ Simple to implement',
        '✓ Easy to reprocess',
        '✓ Great for billing reports',
        '✗ Data is hours old',
        '✗ Wrong for live monitoring',
      ].map((t, i) => (
        <text key={i} x={26} y={92 + i * 16} fontSize={10}
          fill={t.startsWith('✓') ? '#4ade80' : '#f87171'}
          fontFamily="DM Sans, sans-serif">{t}</text>
      ))}
      {/* Use case */}
      <rect x={20} y={175} width={240} height={28} rx={6} fill="#0a1628" stroke={color} strokeWidth={1} />
      <text x={140} y={185} textAnchor="middle" fontSize={9} fill={color} fontFamily="DM Mono, monospace" fontWeight={700}>USE CASE: Nightly billing run</text>
      <text x={140} y={197} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="DM Mono, monospace">Process 24h of patient records at 2am</text>

      {/* Divider */}
      <line x1={280} y1={10} x2={280} y2={210} stroke="#334155" strokeWidth={1} strokeDasharray="5 3" />
      <text x={280} y={110} textAnchor="middle" fontSize={9} fill="#475569" fontFamily="DM Mono, monospace" transform="rotate(-90 280 110)">vs</text>

      {/* STREAMING side */}
      <text x={420} y={22} textAnchor="middle" fontSize={13} fontWeight={800} fill="#f59e0b" fontFamily="DM Sans, sans-serif">STREAMING</text>
      <text x={420} y={36} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="DM Mono, monospace">process each event as it arrives</text>
      {/* Stream dots */}
      <rect x={295} y={50} width={250} height={8} rx={4} fill="#1e293b" />
      {[0, 28, 56, 84, 112, 140, 168, 196, 224].map((x, i) => (
        <circle key={i} cx={305 + x} cy={54} r={5}
          fill={i % 3 === 0 ? '#f59e0b' : '#1e293b'}
          stroke="#f59e0b" strokeWidth={1} />
      ))}
      <text x={420} y={72} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="DM Mono, monospace">each dot = one patient event → processed instantly</text>
      {/* Streaming characteristics */}
      {[
        '✓ Data processed in ms',
        '✓ Detect fraud in real-time',
        '✓ Live dashboards',
        '✗ Harder to implement',
        '✗ Exactly-once is complex',
      ].map((t, i) => (
        <text key={i} x={298} y={92 + i * 16} fontSize={10}
          fill={t.startsWith('✓') ? '#4ade80' : '#f87171'}
          fontFamily="DM Sans, sans-serif">{t}</text>
      ))}
      {/* Use case */}
      <rect x={295} y={175} width={250} height={28} rx={6} fill="#1a1200" stroke="#f59e0b" strokeWidth={1} />
      <text x={420} y={185} textAnchor="middle" fontSize={9} fill="#f59e0b" fontFamily="DM Mono, monospace" fontWeight={700}>USE CASE: ICU alert system</text>
      <text x={420} y={197} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="DM Mono, monospace">Detect abnormal vitals within 500ms</text>
    </svg>
  );
}

// Level 5 — Data Formats
function DiagramDE15({ color }) {
  const formats = [
    { name: 'CSV', emoji: '📄', good: 'Human readable\nUniversal support', bad: 'No types\nNo compression', color: '#94a3b8', use: 'Small exports' },
    { name: 'JSON', emoji: '{}', good: 'Nested data\nAPI standard', bad: 'Verbose\nSlow at scale', color: '#f59e0b', use: 'API responses' },
    { name: 'PARQUET', emoji: '⚡', good: 'Columnar\n10× smaller', bad: 'Not human readable\nNeeds library', color: color, use: 'Analytics warehouse' },
    { name: 'AVRO', emoji: '📦', good: 'Schema enforced\nKafka native', bad: 'Complex setup\nLess SQL support', color: '#818cf8', use: 'Data streams' },
  ];
  return (
    <svg viewBox="0 0 560 200" className="anat-svg">
      {formats.map((f, i) => {
        const x = 10 + i * 137;
        return (
          <g key={f.name}>
            <rect x={x} y={10} width={130} height={180} rx={10} fill="#0a1628" stroke={f.color} strokeWidth={1.5} />
            <rect x={x} y={10} width={130} height={36} rx={10} fill={`${f.color}22`} />
            <rect x={x + 10} y={44} width={110} height={1} fill="#1e293b" />
            <text x={x + 38} y={28} fontSize={13} fontWeight={800} fill={f.color} fontFamily="DM Mono, monospace">{f.emoji}</text>
            <text x={x + 65} y={33} textAnchor="middle" fontSize={12} fontWeight={800} fill={f.color} fontFamily="DM Mono, monospace">{f.name}</text>
            {/* Good */}
            {f.good.split('\n').map((line, li) => (
              <text key={li} x={x + 14} y={62 + li * 16} fontSize={9} fill="#4ade80" fontFamily="DM Sans, sans-serif">✓ {line}</text>
            ))}
            {/* Bad */}
            {f.bad.split('\n').map((line, li) => (
              <text key={li} x={x + 14} y={98 + li * 16} fontSize={9} fill="#f87171" fontFamily="DM Sans, sans-serif">✗ {line}</text>
            ))}
            {/* Use case */}
            <rect x={x + 8} y={140} width={114} height={40} rx={6} fill="#0f172a" />
            <text x={x + 65} y={155} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="DM Mono, monospace">USE FOR</text>
            <text x={x + 65} y={171} textAnchor="middle" fontSize={10} fill={f.color} fontFamily="DM Sans, sans-serif" fontWeight={700}>{f.use}</text>
          </g>
        );
      })}
    </svg>
  );
}

// Level 6 — The Data Stack
function DiagramDE16({ color }) {
  const layers = [
    { label: 'SOURCES', items: ['Hospital EHR', 'Booking App', 'Lab APIs', 'IoT Monitors'], color: '#94a3b8', emoji: '🏥', y: 10 },
    { label: 'INGESTION', items: ['Fivetran', 'Airbyte', 'custom ETL'], color: color, emoji: '⬇️', y: 68 },
    { label: 'STORAGE', items: ['BigQuery', 'Snowflake', 'Redshift', 'S3'], color: '#f59e0b', emoji: '🗄️', y: 126 },
    { label: 'TRANSFORM', items: ['dbt models', 'Spark jobs', 'python scripts'], color: '#818cf8', emoji: '⚙️', y: 184 },
  ];
  return (
    <svg viewBox="0 0 560 250" className="anat-svg">
      {/* Left stack */}
      {layers.map(l => (
        <g key={l.label}>
          <rect x={10} y={l.y} width={200} height={50} rx={8} fill="#0a1628" stroke={l.color} strokeWidth={1.5} />
          <text x={32} y={l.y + 15} fontSize={9} fontWeight={800} fill={l.color} fontFamily="DM Mono, monospace">{l.emoji}  {l.label}</text>
          <text x={32} y={l.y + 32} fontSize={10} fill="#64748b" fontFamily="DM Sans, sans-serif">{l.items.join(' · ')}</text>
          {l.y < 184 && <Arrow x1={110} y1={l.y + 50} x2={110} y2={l.y + 68} color={l.color} />}
        </g>
      ))}
      {/* Right — BI + output */}
      <g>
        <rect x={10} y={244} width={200} height={50} rx={8} fill="#0a1628" stroke="#4ade80" strokeWidth={1.5} />
        <text x={32} y={259} fontSize={9} fontWeight={800} fill="#4ade80" fontFamily="DM Mono, monospace">📊  VISUALISE</text>
        <text x={32} y={276} fontSize={10} fill="#64748b" fontFamily="DM Sans, sans-serif">Looker · Tableau · Metabase</text>
        <Arrow x1={110} y1={234} x2={110} y2={244} color="#4ade80" />
      </g>
      {/* Right panel — real example */}
      <rect x={230} y={10} width={320} height={282} rx={12} fill="#0f172a" stroke="#1e293b" strokeWidth={1} />
      <text x={390} y={32} textAnchor="middle" fontSize={11} fontWeight={800} fill="#f0f4ff" fontFamily="DM Sans, sans-serif">Hospital Analytics Stack</text>
      {[
        [color, '① EHR exports patient records nightly via Fivetran'],
        [color, '② Lab results stream via custom Kafka pipeline'],
        ['#f59e0b', '③ Raw data lands in BigQuery raw dataset'],
        ['#818cf8', '④ dbt cleans NULLs, deduplicates, joins tables'],
        ['#818cf8', '⑤ dbt builds patient_summary, ward_metrics views'],
        ['#4ade80', '⑥ Looker dashboard: bed occupancy, wait times'],
        ['#4ade80', '⑦ ML model reads from BigQuery — no raw access'],
      ].map(([c, t], i) => (
        <g key={i}>
          <circle cx={248} cy={54 + i * 34} r={4} fill={c} />
          <text x={260} y={54 + i * 34 + 4} fontSize={10} fill="#94a3b8" fontFamily="DM Sans, sans-serif">{t}</text>
          {i < 6 && <line x1={248} y1={58 + i * 34} x2={248} y2={84 + i * 34} stroke={c} strokeWidth={1} strokeDasharray="2 2" opacity={0.4} />}
        </g>
      ))}
    </svg>
  );
}

// Level 7 — Pipeline Design Capstone
function DiagramDE17({ color }) {
  return (
    <svg viewBox="0 0 560 220" className="anat-svg">
      {/* Full end-to-end system for the hospital */}
      {/* Header */}
      <rect x={10} y={8} width={540} height={24} rx={6} fill={`${color}15`} stroke={`${color}40`} strokeWidth={1} />
      <text x={280} y={24} textAnchor="middle" fontSize={10} fontWeight={800} fill={color} fontFamily="DM Mono, monospace">
        COMPLETE PIPELINE ARCHITECTURE — Hospital Analytics System
      </text>

      {/* Row 1: Sources */}
      <Box x={10}  y={44} w={100} h={40} label="EHR DB" sub="PostgreSQL" emoji="🏥" fill="#0a1628" stroke="#475569" />
      <Box x={120} y={44} w={100} h={40} label="Booking App" sub="MySQL" emoji="📅" fill="#0a1628" stroke="#475569" />
      <Box x={230} y={44} w={100} h={40} label="Lab API" sub="JSON/REST" emoji="🧪" fill="#0a1628" stroke="#475569" />
      <Box x={340} y={44} w={100} h={40} label="IoT Vitals" sub="Kafka stream" emoji="💓" fill="#0a1628" stroke="#f59e0b" />
      <Box x={450} y={44} w={100} h={40} label="Billing CSV" sub="SFTP daily" emoji="💳" fill="#0a1628" stroke="#475569" />

      {/* Arrows down to ingestion */}
      {[60, 170, 280, 390, 500].map(x => (
        <Arrow key={x} x1={x} y1={84} x2={x} y2={102} color="#334155" />
      ))}

      {/* Ingestion */}
      <rect x={10} y={102} width={540} height={30} rx={6} fill="#0f2340" stroke={color} strokeWidth={1.5} />
      <text x={280} y={118} textAnchor="middle" fontSize={10} fill={color} fontWeight={700} fontFamily="DM Mono, monospace">
        ⬇ INGESTION · Fivetran (batch) + Kafka consumer (stream) + custom scripts
      </text>

      <Arrow x1={280} y1={132} x2={280} y2={148} color={color} />

      {/* Transform */}
      <rect x={10} y={148} width={540} height={30} rx={6} fill="#1a1200" stroke="#f59e0b" strokeWidth={1.5} />
      <text x={280} y={164} textAnchor="middle" fontSize={10} fill="#f59e0b" fontWeight={700} fontFamily="DM Mono, monospace">
        ⚙ TRANSFORM · dbt: clean NULLs · dedup patient_id · normalise UTC · join tables
      </text>

      <Arrow x1={280} y1={178} x2={280} y2={194} color="#4ade80" />

      {/* Output split */}
      <Box x={10}  y={194} w={160} h={36} label="Warehouse" sub="BigQuery — historical" emoji="🗄️" fill="#0a1628" stroke="#4ade80" />
      <Box x={185} y={194} w={160} h={36} label="Dashboard" sub="Looker — live metrics" emoji="📊" fill="#0a1628" stroke="#4ade80" />
      <Box x={360} y={194} w={160} h={36} label="ML Features" sub="patient_summary view" emoji="🤖" fill="#0a1628" stroke="#4ade80" />

      <Arrow x1={280} y1={192} x2={90}  y2={194} color="#4ade80" />
      <Arrow x1={280} y1={192} x2={265} y2={194} color="#4ade80" />
      <Arrow x1={280} y1={192} x2={440} y2={194} color="#4ade80" />
    </svg>
  );
}

// ── Diagram registry ───────────────────────────────────────────────────────
const DIAGRAMS = {
  'de1-0': DiagramDE10,
  'de1-1': DiagramDE11,
  'de1-2': DiagramDE12,
  'de1-3': DiagramDE13,
  'de1-4': DiagramDE14,
  'de1-5': DiagramDE15,
  'de1-6': DiagramDE16,
  'de1-7': DiagramDE17,
};

// ── Public component ───────────────────────────────────────────────────────
export default function AnatomyDiagram({ levelKey, color = '#06b6d4', title }) {
  const Diagram = DIAGRAMS[levelKey];
  if (!Diagram) return null;

  return (
    <div className="anat-card">
      <div className="anat-card-header">
        <span className="anat-badge">⬡ ANATOMY</span>
        {title && <span className="anat-title">{title}</span>}
      </div>
      <div className="anat-body">
        <Diagram color={color} />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// ML / AI ENGINEER — Stage 1 (8 levels)
// ════════════════════════════════════════════════════════════════

// ML1-0 — What is Machine Learning?
function DiagramML10({ color }) {
  return (
    <svg viewBox="0 0 560 200" className="anat-svg">
      {/* Three columns: Traditional vs ML */}
      <text x={140} y={20} textAnchor="middle" fontSize={12} fontWeight={800} fill="#94a3b8" fontFamily="DM Sans,sans-serif">TRADITIONAL CODE</text>
      <text x={420} y={20} textAnchor="middle" fontSize={12} fontWeight={800} fill={color} fontFamily="DM Sans,sans-serif">MACHINE LEARNING</text>
      {/* Traditional */}
      <Box x={20}  y={32} w={110} h={36} label="Data Input" sub="patient records" emoji="📊" fill="#0a1628" stroke="#334155" />
      <Box x={20}  y={84} w={110} h={36} label="Rules" sub="if age>65 AND…" emoji="📋" fill="#0a1628" stroke="#f87171" />
      <Arrow x1={75} y1={68} x2={75} y2={84} color="#475569" />
      <Box x={20}  y={136} w={110} h={36} label="Output" sub="prediction" emoji="✅" fill="#0a1628" stroke="#334155" />
      <Arrow x1={75} y1={120} x2={75} y2={136} color="#475569" />
      <text x={75} y={186} textAnchor="middle" fontSize={10} fill="#f87171" fontFamily="DM Mono,monospace">You write every rule</text>
      {/* Divider */}
      <line x1={280} y1={15} x2={280} y2={195} stroke="#1e293b" strokeWidth={1} strokeDasharray="4 3" />
      {/* ML */}
      <Box x={310} y={32} w={110} h={36} label="Data + Labels" sub="records + outcomes" emoji="📊" fill="#0a1628" stroke={color} />
      <Box x={310} y={84} w={110} h={36} label="Algorithm" sub="learns patterns" emoji="🤖" fill="#0f2340" stroke={color} />
      <Arrow x1={365} y1={68} x2={365} y2={84} color={color} label="trains on" />
      <Box x={310} y={136} w={110} h={36} label="Model" sub="makes predictions" emoji="⚡" fill="#0a1628" stroke="#4ade80" />
      <Arrow x1={365} y1={120} x2={365} y2={136} color="#4ade80" />
      <text x={365} y={186} textAnchor="middle" fontSize={10} fill="#4ade80" fontFamily="DM Mono,monospace">System learns the rules</text>
      {/* Right: new data arrow */}
      <Box x={438} y={84} w={110} h={36} label="New Patient" sub="predict readmission" emoji="🏥" fill="#0a1628" stroke="#334155" />
      <Arrow x1={420} y1={152} x2={438} y2={102} color="#4ade80" label="predicts" />
      <text x={140} y={200} textAnchor="middle" fontSize={9} fill="#475569" fontFamily="DM Mono,monospace">Hard to scale — rules break on edge cases</text>
      <text x={420} y={200} textAnchor="middle" fontSize={9} fill={color} fontFamily="DM Mono,monospace">Finds patterns humans can't enumerate</text>
    </svg>
  );
}

// ML1-1 — When NOT to use ML
function DiagramML11({ color }) {
  return (
    <svg viewBox="0 0 560 200" className="anat-svg">
      <text x={280} y={18} textAnchor="middle" fontSize={11} fontWeight={800} fill={color} fontFamily="DM Mono,monospace">WHEN TO USE ML vs WHEN NOT TO</text>
      {/* Use ML */}
      <rect x={10} y={26} width={255} height={162} rx={10} fill="#0a1628" stroke={color} strokeWidth={1.5} />
      <text x={138} y={46} textAnchor="middle" fontSize={10} fontWeight={800} fill={color} fontFamily="DM Mono,monospace">✅ USE ML WHEN</text>
      {[
        'Pattern too complex for rules',
        'Data is available at scale',
        'Output is a prediction/score',
        'Rules change over time',
        'e.g. readmission risk, fraud',
      ].map((t, i) => <text key={i} x={24} y={64+i*22} fontSize={11} fill="#94a3b8" fontFamily="DM Sans,sans-serif">• {t}</text>)}
      {/* Don't use */}
      <rect x={295} y={26} width={255} height={162} rx={10} fill="#1a0a0a" stroke="#f87171" strokeWidth={1.5} />
      <text x={422} y={46} textAnchor="middle" fontSize={10} fontWeight={800} fill="#f87171" fontFamily="DM Mono,monospace">❌ DON'T USE ML WHEN</text>
      {[
        'Simple rule works fine',
        'You have no training data',
        'Need to explain every decision',
        'Dataset has <100 examples',
        'e.g. "is this field empty?"',
      ].map((t, i) => <text key={i} x={309} y={64+i*22} fontSize={11} fill="#94a3b8" fontFamily="DM Sans,sans-serif">• {t}</text>)}
    </svg>
  );
}

// ML1-2 — Types of Learning
function DiagramML12({ color }) {
  const types = [
    { name: 'SUPERVISED', emoji: '🎓', color: color, desc: 'Labelled examples.\nLearn input→output mapping.', eg: 'Readmission: yes/no' },
    { name: 'UNSUPERVISED', emoji: '🔍', color: '#f59e0b', desc: 'No labels.\nFind hidden structure.', eg: 'Patient clusters' },
    { name: 'REINFORCEMENT', emoji: '🏆', color: '#ec4899', desc: 'Learn by reward/penalty.\nAgent acts in environment.', eg: 'Treatment scheduling' },
  ];
  return (
    <svg viewBox="0 0 560 200" className="anat-svg">
      {types.map((t, i) => {
        const x = 10 + i * 184;
        return (
          <g key={t.name}>
            <rect x={x} y={10} width={174} height={178} rx={10} fill="#0a1628" stroke={t.color} strokeWidth={1.5} />
            <rect x={x} y={10} width={174} height={36} rx={10} fill={`${t.color}22`} />
            <text x={x+30} y={30} fontSize={16}>{t.emoji}</text>
            <text x={x+87} y={34} textAnchor="middle" fontSize={10} fontWeight={800} fill={t.color} fontFamily="DM Mono,monospace">{t.name}</text>
            {t.desc.split('\n').map((line, li) => (
              <text key={li} x={x+14} y={62+li*18} fontSize={10} fill="#94a3b8" fontFamily="DM Sans,sans-serif">{line}</text>
            ))}
            <rect x={x+10} y={110} width={154} height={36} rx={6} fill="#0f172a" />
            <text x={x+87} y={123} textAnchor="middle" fontSize={9} fill="#475569" fontFamily="DM Mono,monospace">Hospital example:</text>
            <text x={x+87} y={138} textAnchor="middle" fontSize={10} fill={t.color} fontFamily="DM Sans,sans-serif" fontWeight={700}>{t.eg}</text>
            <rect x={x+10} y={156} width={154} height={24} rx={6} fill={`${t.color}15`} />
            <text x={x+87} y={172} textAnchor="middle" fontSize={9} fill={t.color} fontFamily="DM Mono,monospace">
              {t.name === 'SUPERVISED' ? '90% of ML jobs use this' : t.name === 'UNSUPERVISED' ? 'Used in EDA and anomaly detection' : 'Robotics, games, scheduling'}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ML1-3 — The ML Workflow
function DiagramML13({ color }) {
  const steps = [
    { n:'1', label:'Problem\nFraming', icon:'🎯', color: color },
    { n:'2', label:'Data\nCollection', icon:'📊', color: '#f59e0b' },
    { n:'3', label:'EDA &\nCleaning', icon:'🔍', color: '#f59e0b' },
    { n:'4', label:'Feature\nEngineering', icon:'⚙️', color: '#818cf8' },
    { n:'5', label:'Model\nTraining', icon:'🤖', color: '#818cf8' },
    { n:'6', label:'Evaluation', icon:'📈', color: '#4ade80' },
    { n:'7', label:'Deploy &\nMonitor', icon:'🚀', color: '#4ade80' },
  ];
  return (
    <svg viewBox="0 0 560 200" className="anat-svg">
      <text x={280} y={16} textAnchor="middle" fontSize={11} fontWeight={800} fill={color} fontFamily="DM Mono,monospace">THE 7-STEP ML WORKFLOW — Hospital Readmission Model</text>
      {steps.map((s, i) => {
        const x = 12 + i * 78;
        return (
          <g key={s.n}>
            <rect x={x} y={24} width={70} height={90} rx={8} fill="#0a1628" stroke={s.color} strokeWidth={1.5} />
            <text x={x+35} y={42} textAnchor="middle" fontSize={18}>{s.icon}</text>
            <text x={x+35} y={56} textAnchor="middle" fontSize={9} fontWeight={800} fill={s.color} fontFamily="DM Mono,monospace">STEP {s.n}</text>
            {s.label.split('\n').map((line, li) => (
              <text key={li} x={x+35} y={70+li*13} textAnchor="middle" fontSize={10} fill="#94a3b8" fontFamily="DM Sans,sans-serif">{line}</text>
            ))}
            {i < steps.length - 1 && <Arrow x1={x+70} y1={69} x2={x+78} y2={69} color={s.color} />}
          </g>
        );
      })}
      {/* Bottom: hospital-specific notes */}
      {[
        ['12', '"Will this patient be readmitted in 30 days?"'],
        ['90', 'EHR records: age, diagnosis, LOS, vitals, prior visits'],
        ['168', 'Fill NULLs, remove duplicates, normalise dates'],
        ['246', 'length_of_stay, age_group, admission_count_6m'],
        ['324', 'Logistic regression → Random Forest → XGBoost'],
        ['402', 'AUC-ROC, precision, recall — choose recall over precision'],
        ['480', 'REST API → hospital dashboard, retrain monthly'],
      ].map(([x, note]) => (
        <text key={x} x={parseInt(x)+35} y={138} textAnchor="middle" fontSize={8} fill="#475569" fontFamily="DM Mono,monospace">{note.length > 18 ? note.slice(0,16)+'…' : note}</text>
      ))}
      {/* Iteration arrow */}
      <path d="M540,114 Q555,160 280,175 Q10,160 20,114" stroke="#334155" strokeWidth={1} fill="none" strokeDasharray="4 3" markerEnd="url(#arr-540-20)" />
      <text x={280} y={193} textAnchor="middle" fontSize={9} fill="#475569" fontFamily="DM Mono,monospace">⟳ iterate — most models go through this cycle 3-10 times before production</text>
    </svg>
  );
}

// ML1-4 — Data: The Foundation
function DiagramML14({ color }) {
  return (
    <svg viewBox="0 0 560 200" className="anat-svg">
      <text x={280} y={16} textAnchor="middle" fontSize={11} fontWeight={800} fill={color} fontFamily="DM Mono,monospace">WHAT MAKES A GOOD TRAINING DATASET — Readmission Prediction</text>
      {/* Data quality dimensions */}
      {[
        { x:10,  y:26,  label:'VOLUME', color: color,    icon:'📦', good:'≥1,000 examples\nper class minimum', bad:'47 patient records\nis not enough' },
        { x:146, y:26,  label:'QUALITY', color:'#f59e0b',icon:'✨', good:'No NULLs, no dupes\nconsistent types', bad:'30% NULL dob\ncorrupts features' },
        { x:282, y:26,  label:'LABELS',  color:'#818cf8', icon:'🏷️', good:'Ground truth known\nreadmitted: yes/no', bad:'Label = "maybe"\ntrains nothing' },
        { x:418, y:26,  label:'BALANCE', color:'#4ade80', icon:'⚖️', good:'Similar class sizes\nor weighted loss', bad:'98% "no" → model\npredicts "no" always' },
      ].map(d => (
        <g key={d.label}>
          <rect x={d.x} y={d.y} width={128} height={162} rx={8} fill="#0a1628" stroke={d.color} strokeWidth={1.5} />
          <text x={d.x+25} y={d.y+20} fontSize={16}>{d.icon}</text>
          <text x={d.x+64} y={d.y+24} textAnchor="middle" fontSize={10} fontWeight={800} fill={d.color} fontFamily="DM Mono,monospace">{d.label}</text>
          <text x={d.x+10} y={d.y+46} fontSize={9} fontWeight={700} fill="#4ade80" fontFamily="DM Mono,monospace">✓ GOOD</text>
          {d.good.split('\n').map((line, li) => (
            <text key={li} x={d.x+10} y={d.y+60+li*14} fontSize={10} fill="#94a3b8" fontFamily="DM Sans,sans-serif">{line}</text>
          ))}
          <text x={d.x+10} y={d.y+98} fontSize={9} fontWeight={700} fill="#f87171" fontFamily="DM Mono,monospace">✗ BAD</text>
          {d.bad.split('\n').map((line, li) => (
            <text key={li} x={d.x+10} y={d.y+112+li*14} fontSize={10} fill="#94a3b8" fontFamily="DM Sans,sans-serif">{line}</text>
          ))}
        </g>
      ))}
    </svg>
  );
}

// ML1-5 — Evaluation Metrics
function DiagramML15({ color }) {
  return (
    <svg viewBox="0 0 560 210" className="anat-svg">
      <text x={280} y={16} textAnchor="middle" fontSize={11} fontWeight={800} fill={color} fontFamily="DM Mono,monospace">CONFUSION MATRIX — Readmission Prediction (100 patients)</text>
      {/* Confusion matrix */}
      <rect x={20}  y={28} width={120} height={60} rx={4} fill="#0f2d1f" stroke="#4ade80" strokeWidth={2} />
      <text x={80} y={52} textAnchor="middle" fontSize={11} fontWeight={800} fill="#4ade80" fontFamily="DM Mono,monospace">TP = 30</text>
      <text x={80} y={66} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="DM Sans,sans-serif">Predicted YES, Was YES</text>
      <text x={80} y={80} textAnchor="middle" fontSize={9} fill="#4ade80" fontFamily="DM Mono,monospace">caught 30 patients ✓</text>
      <rect x={148} y={28} width={120} height={60} rx={4} fill="#1a0a0a" stroke="#f87171" strokeWidth={2} />
      <text x={208} y={52} textAnchor="middle" fontSize={11} fontWeight={800} fill="#f87171" fontFamily="DM Mono,monospace">FP = 10</text>
      <text x={208} y={66} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="DM Sans,sans-serif">Predicted YES, Was NO</text>
      <text x={208} y={80} textAnchor="middle" fontSize={9} fill="#f87171" fontFamily="DM Mono,monospace">unnecessary care ✗</text>
      <rect x={20}  y={96} width={120} height={60} rx={4} fill="#1a0a0a" stroke="#f59e0b" strokeWidth={2} />
      <text x={80} y={120} textAnchor="middle" fontSize={11} fontWeight={800} fill="#f59e0b" fontFamily="DM Mono,monospace">FN = 20</text>
      <text x={80} y={134} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="DM Sans,sans-serif">Predicted NO, Was YES</text>
      <text x={80} y={148} textAnchor="middle" fontSize={9} fill="#f59e0b" fontFamily="DM Mono,monospace">missed patients! ✗✗</text>
      <rect x={148} y={96} width={120} height={60} rx={4} fill="#0f2d1f" stroke="#334155" strokeWidth={1} />
      <text x={208} y={120} textAnchor="middle" fontSize={11} fontWeight={800} fill="#475569" fontFamily="DM Mono,monospace">TN = 40</text>
      <text x={208} y={134} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="DM Sans,sans-serif">Predicted NO, Was NO</text>
      <text x={208} y={148} textAnchor="middle" fontSize={9} fill="#475569" fontFamily="DM Mono,monospace">correctly dismissed ✓</text>
      {/* Axis labels */}
      <text x={84} y={170} textAnchor="middle" fontSize={9} fill="#475569" fontFamily="DM Mono,monospace">← Predicted Positive | Predicted Negative →</text>
      {/* Metrics derived */}
      <rect x={290} y={28} width={258} height={148} rx={10} fill="#0a1628" stroke="#334155" strokeWidth={1} />
      <text x={419} y={48} textAnchor="middle" fontSize={10} fontWeight={800} fill={color} fontFamily="DM Mono,monospace">DERIVED METRICS</text>
      {[
        [color,    'Accuracy',  '(30+40)/100 = 70%', 'Often misleading — see below'],
        ['#f87171','Precision', '30/(30+10) = 75%',  'Of alerted patients, 75% real'],
        ['#f59e0b','Recall',    '30/(30+20) = 60%',  'Caught 60% of actual cases'],
        ['#818cf8','F1',        '2×(0.75×0.6)/…',   'Harmonic mean of P and R'],
      ].map(([col, name, formula, note], i) => (
        <g key={name}>
          <text x={304} y={68+i*28} fontSize={10} fontWeight={700} fill={col} fontFamily="DM Mono,monospace">{name}:</text>
          <text x={380} y={68+i*28} fontSize={10} fill="#94a3b8" fontFamily="DM Mono,monospace">{formula}</text>
          <text x={304} y={81+i*28} fontSize={9} fill="#475569" fontFamily="DM Sans,sans-serif">{note}</text>
        </g>
      ))}
      <rect x={298} y={164} width={242} height={26} rx={6} fill="#1a1200" stroke="#f59e0b" strokeWidth={1} />
      <text x={419} y={174} textAnchor="middle" fontSize={9} fill="#f59e0b" fontFamily="DM Mono,monospace" fontWeight={700}>For readmission: maximise RECALL</text>
      <text x={419} y={186} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="DM Mono,monospace">Missing a sick patient (FN) costs more than a false alert (FP)</text>
    </svg>
  );
}

// ML1-6 — ML in Production
function DiagramML16({ color }) {
  return (
    <svg viewBox="0 0 560 200" className="anat-svg">
      <text x={280} y={16} textAnchor="middle" fontSize={11} fontWeight={800} fill={color} fontFamily="DM Mono,monospace">ML IN PRODUCTION — The full lifecycle</text>
      {/* Pipeline */}
      {[
        { x:10,  label:'Training\nPipeline',   icon:'🔧', color, detail:'Data prep + train\n+ evaluate offline' },
        { x:130, label:'Model\nRegistry',      icon:'📦', color:'#f59e0b', detail:'Version control\nfor trained models' },
        { x:250, label:'Serving\nAPI',         icon:'⚡', color:'#818cf8', detail:'REST endpoint\n/predict JSON in/out' },
        { x:370, label:'Monitoring',           icon:'📊', color:'#4ade80', detail:'Drift, latency\naccuracy over time' },
        { x:490, label:'Retraining\nTrigger',  icon:'🔄', color:'#ec4899', detail:'Monthly or when\ndrift detected' },
      ].map((s, i) => (
        <g key={s.label}>
          <rect x={s.x} y={28} width={108} height={90} rx={8} fill="#0a1628" stroke={s.color} strokeWidth={1.5} />
          <text x={s.x+54} y={50} textAnchor="middle" fontSize={18}>{s.icon}</text>
          {s.label.split('\n').map((line, li) => (
            <text key={li} x={s.x+54} y={64+li*14} textAnchor="middle" fontSize={10} fontWeight={700} fill={s.color} fontFamily="DM Mono,monospace">{line}</text>
          ))}
          {s.detail.split('\n').map((line, li) => (
            <text key={li} x={s.x+54} y={98+li*12} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="DM Sans,sans-serif">{line}</text>
          ))}
          {i < 4 && <Arrow x1={s.x+108} y1={73} x2={s.x+120} y2={73} color={s.color} />}
        </g>
      ))}
      {/* Feedback loop */}
      <path d="M540,118 Q550,165 280,180 Q10,165 20,118" stroke="#ec4899" strokeWidth={1} fill="none" strokeDasharray="4 3" />
      <text x={280} y={198} textAnchor="middle" fontSize={9} fill="#ec4899" fontFamily="DM Mono,monospace">⟳ Production data → new training set → better model</text>
      {/* Failure modes */}
      <rect x={10} y={132} width={540} height={26} rx={6} fill="#1a0808" stroke="#f87171" strokeWidth={1} />
      <text x={280} y={143} textAnchor="middle" fontSize={9} fill="#f87171" fontFamily="DM Mono,monospace" fontWeight={700}>⚠ Common failures:</text>
      <text x={280} y={154} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="DM Mono,monospace">Data drift (hospital changes protocol) · Label drift · Latency spikes · Silent wrong predictions</text>
    </svg>
  );
}

// ML1-7 — Capstone Frame
function DiagramML17({ color }) {
  return (
    <svg viewBox="0 0 560 200" className="anat-svg">
      <text x={280} y={16} textAnchor="middle" fontSize={11} fontWeight={800} fill={color} fontFamily="DM Mono,monospace">ML PROJECT SPECIFICATION — Hospital Readmission (30-day)</text>
      {[
        [color,    'Problem',        'Binary classification: will patient be readmitted within 30 days?'],
        ['#f59e0b','Data Required',  '≥5,000 records. Features: age, LOS, diagnosis ICD-10, prior visits, vitals at discharge.'],
        ['#818cf8','Model Family',   'Logistic regression baseline → Gradient Boosted Trees (XGBoost) for production.'],
        ['#4ade80','Success Metric', 'Recall ≥ 0.75 on holdout set. Precision acceptable ≥ 0.55. AUC-ROC ≥ 0.80.'],
        ['#ec4899','Risks',          'Data leakage from discharge notes. Class imbalance (~15% positive). GDPR compliance.'],
        ['#f87171','Failure Modes',  'Silent degradation if hospital changes admission protocol. Monitor monthly.'],
      ].map(([col, label, text], i) => (
        <g key={label}>
          <rect x={10} y={26+i*28} width={540} height={24} rx={6} fill={i%2===0?'#0a1628':'#080e1a'} stroke="#1e293b" strokeWidth={1} />
          <rect x={10} y={26+i*28} width={4} height={24} rx={2} fill={col} />
          <text x={22} y={42+i*28} fontSize={10} fontWeight={800} fill={col} fontFamily="DM Mono,monospace">{label}:</text>
          <text x={130} y={42+i*28} fontSize={10} fill="#94a3b8" fontFamily="DM Sans,sans-serif">{text}</text>
        </g>
      ))}
    </svg>
  );
}

// ════════════════════════════════════════════════════════════════
// CYBER SECURITY — Stage 1 (8 levels)
// ════════════════════════════════════════════════════════════════

// CY1-0 — The Security Mindset
function DiagramCY10({ color }) {
  return (
    <svg viewBox="0 0 560 200" className="anat-svg">
      <text x={280} y={16} textAnchor="middle" fontSize={11} fontWeight={800} fill={color} fontFamily="DM Mono,monospace">THE CIA TRIAD — Foundation of Every Security Decision</text>
      {[
        { x:10,  label:'CONFIDENTIALITY', icon:'🔒', color, ex:'Patient records visible\nonly to authorised staff.', attack:'Data breach: attacker\nreads all records' },
        { x:195, label:'INTEGRITY',       icon:'✅', color:'#f59e0b', ex:'Lab result cannot be\nmodified in transit.', attack:'MITM: attacker changes\nblood type field' },
        { x:380, label:'AVAILABILITY',    icon:'⚡', color:'#818cf8', ex:'Booking system online\n24/7 for emergencies.', attack:'DDoS: system down\nduring critical moment' },
      ].map(d => (
        <g key={d.label}>
          <rect x={d.x} y={26} width={165} height={162} rx={10} fill="#0a1628" stroke={d.color} strokeWidth={1.5} />
          <text x={d.x+82} y={48} textAnchor="middle" fontSize={22}>{d.icon}</text>
          <text x={d.x+82} y={64} textAnchor="middle" fontSize={10} fontWeight={800} fill={d.color} fontFamily="DM Mono,monospace">{d.label}</text>
          <text x={d.x+10} y={84} fontSize={9} fontWeight={700} fill="#4ade80" fontFamily="DM Mono,monospace">GOAL:</text>
          {d.ex.split('\n').map((line, li) => (
            <text key={li} x={d.x+10} y={98+li*14} fontSize={10} fill="#94a3b8" fontFamily="DM Sans,sans-serif">{line}</text>
          ))}
          <text x={d.x+10} y={136} fontSize={9} fontWeight={700} fill="#f87171" fontFamily="DM Mono,monospace">ATTACK:</text>
          {d.attack.split('\n').map((line, li) => (
            <text key={li} x={d.x+10} y={150+li*14} fontSize={10} fill="#94a3b8" fontFamily="DM Sans,sans-serif">{line}</text>
          ))}
        </g>
      ))}
    </svg>
  );
}

// CY1-1 — CIA Triad in depth
function DiagramCY11({ color }) {
  return (
    <svg viewBox="0 0 560 200" className="anat-svg">
      <text x={280} y={16} textAnchor="middle" fontSize={11} fontWeight={800} fill={color} fontFamily="DM Mono,monospace">ATTACKER MINDSET — Think Like a Threat Actor</text>
      {/* Kill chain */}
      {[
        { label:'Reconnaissance', icon:'🔭', color:'#94a3b8', note:'LinkedIn, Shodan,\nGoogle dork results' },
        { label:'Initial Access',  icon:'🚪', color:'#f59e0b', note:'Phishing email,\nexposed RDP, SQLi' },
        { label:'Persistence',    icon:'🕸️', color:'#f87171', note:'Cron backdoor,\nweb shell, new user' },
        { label:'Privilege Esc.', icon:'⬆️', color:'#ec4899', note:'SUID binary,\nsudo misconfiguration' },
        { label:'Exfiltration',   icon:'📤', color: color,    note:'DNS tunnel,\nHTTPS to C2 server' },
      ].map((s, i) => (
        <g key={s.label}>
          <rect x={10+i*108} y={30} width={98} height={90} rx={8} fill="#0a1628" stroke={s.color} strokeWidth={1.5} />
          <text x={59+i*108} y={54} textAnchor="middle" fontSize={18}>{s.icon}</text>
          <text x={59+i*108} y={68} textAnchor="middle" fontSize={9} fontWeight={800} fill={s.color} fontFamily="DM Mono,monospace">{s.label}</text>
          {s.note.split('\n').map((line, li) => (
            <text key={li} x={59+i*108} y={82+li*13} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="DM Sans,sans-serif">{line}</text>
          ))}
          {i < 4 && <Arrow x1={108+i*108} y1={75} x2={118+i*108} y2={75} color={s.color} />}
        </g>
      ))}
      <text x={280} y={140} textAnchor="middle" fontSize={9} fill="#475569" fontFamily="DM Mono,monospace">← Each step leaves evidence. Defenders can interrupt at any stage.</text>
      {/* Defender interrupts */}
      {['Threat intel', 'Patch + MFA', 'EDR alerts', 'Least privilege', 'DLP + SIEM'].map((d, i) => (
        <g key={d}>
          <rect x={10+i*108} y={148} width={98} height={26} rx={6} fill={`${color}15`} stroke={`${color}40`} strokeWidth={1} />
          <text x={59+i*108} y={164} textAnchor="middle" fontSize={9} fill={color} fontFamily="DM Mono,monospace">{d}</text>
        </g>
      ))}
      <text x={280} y={193} textAnchor="middle" fontSize={9} fill={color} fontFamily="DM Mono,monospace">↑ Defender controls at each stage</text>
    </svg>
  );
}

// CY1-2 — Threat Modelling
function DiagramCY12({ color }) {
  return (
    <svg viewBox="0 0 560 200" className="anat-svg">
      <text x={280} y={16} textAnchor="middle" fontSize={11} fontWeight={800} fill={color} fontFamily="DM Mono,monospace">STRIDE THREAT MODEL — Hospital Booking System</text>
      {[
        { id:'S', name:'Spoofing',             icon:'🎭', color:'#f87171', threat:'Attacker impersonates\na doctor account', mitigation:'MFA + session tokens' },
        { id:'T', name:'Tampering',            icon:'✏️',  color:'#f59e0b', threat:'Modifying appointment\nrecords in transit', mitigation:'TLS + digital signatures' },
        { id:'R', name:'Repudiation',          icon:'🙅',  color:'#818cf8', threat:'Doctor denies prescribing\na dangerous dose', mitigation:'Immutable audit log' },
        { id:'I', name:'Info Disclosure',      icon:'📤',  color: color,    threat:'Patient data visible\nto wrong staff', mitigation:'Role-based access control' },
        { id:'D', name:'Denial of Service',    icon:'🔴',  color:'#ec4899', threat:'DDoS takes down\nbooking system', mitigation:'Rate limiting + CDN' },
        { id:'E', name:'Elevation of Privilege',icon:'⬆️', color:'#4ade80', threat:'Nurse gains admin\naccess via bug', mitigation:'Least privilege + audits' },
      ].map((s, i) => {
        const col = i < 3 ? 0 : 1;
        const row = i % 3;
        const x = 10 + col * 280;
        const y = 26 + row * 58;
        return (
          <g key={s.id}>
            <rect x={x} y={y} width={270} height={50} rx={8} fill="#0a1628" stroke={s.color} strokeWidth={1.5} />
            <text x={x+14} y={y+18} fontSize={14}>{s.icon}</text>
            <text x={x+38} y={y+16} fontSize={10} fontWeight={800} fill={s.color} fontFamily="DM Mono,monospace">{s.id} — {s.name}</text>
            <text x={x+38} y={y+29} fontSize={9} fill="#64748b" fontFamily="DM Sans,sans-serif">{s.threat.replace('\n', ' ')}</text>
            <text x={x+38} y={y+42} fontSize={9} fill={s.color} fontFamily="DM Mono,monospace">Fix: {s.mitigation}</text>
          </g>
        );
      })}
    </svg>
  );
}

// CY1-3 — Attack Surfaces
function DiagramCY13({ color }) {
  return (
    <svg viewBox="0 0 560 200" className="anat-svg">
      <text x={280} y={16} textAnchor="middle" fontSize={11} fontWeight={800} fill={color} fontFamily="DM Mono,monospace">ATTACK SURFACE — Hospital System Entry Points</text>
      {/* System in center */}
      <rect x={210} y={70} width={140} height={60} rx={10} fill="#0f2340" stroke={color} strokeWidth={2} />
      <text x={280} y={97} textAnchor="middle" fontSize={12} fontWeight={800} fill={color} fontFamily="DM Sans,sans-serif">🏥 Hospital</text>
      <text x={280} y={113} textAnchor="middle" fontSize={10} fill="#64748b" fontFamily="DM Sans,sans-serif">EHR + Booking</text>
      {/* Attack vectors pointing in */}
      {[
        { x:20,  y:40,  label:'Web App', sub:'/api endpoints\nSQL injection\nXSS', color:'#f87171' },
        { x:20,  y:120, label:'Staff',   sub:'Phishing\nInsider threat\nWeak passwords', color:'#f59e0b' },
        { x:420, y:40,  label:'Network', sub:'Open ports\nSSH bruteforce\nMITM', color:'#818cf8' },
        { x:420, y:120, label:'Supply Chain', sub:'3rd party libs\nSoftware deps\nAPI partners', color:'#ec4899' },
        { x:210, y:168, label:'Physical', sub:'USB drops, tailgating\nPrinter firmware', color:'#94a3b8' },
      ].map(v => (
        <g key={v.label}>
          <rect x={v.x} y={v.y} width={120} height={52} rx={6} fill="#0a1628" stroke={v.color} strokeWidth={1.5} />
          <text x={v.x+60} y={v.y+14} textAnchor="middle" fontSize={10} fontWeight={800} fill={v.color} fontFamily="DM Mono,monospace">{v.label}</text>
          {v.sub.split('\n').map((line, li) => (
            <text key={li} x={v.x+60} y={v.y+27+li*12} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="DM Sans,sans-serif">{line}</text>
          ))}
          {/* Arrow toward center */}
          {v.x < 200 && <Arrow x1={v.x+120} y1={v.y+26} x2={210} y2={100} color={v.color} />}
          {v.x > 400 && <Arrow x1={v.x} y1={v.y+26} x2={350} y2={100} color={v.color} />}
          {v.y > 150 && <Arrow x1={v.x+60} y1={v.y} x2={280} y2={130} color={v.color} />}
        </g>
      ))}
    </svg>
  );
}

// CY1-4 — Common Attack Types
function DiagramCY14({ color }) {
  return (
    <svg viewBox="0 0 560 200" className="anat-svg">
      <text x={280} y={16} textAnchor="middle" fontSize={11} fontWeight={800} fill={color} fontFamily="DM Mono,monospace">OWASP TOP RISKS — Seen in Real Hospital Systems</text>
      {[
        { rank:'A01', name:'Broken Access Control',  icon:'🚪', eg:'Nurse reads surgeon notes', fix:'Role-based access, deny by default' },
        { rank:'A02', name:'Cryptographic Failures', icon:'🔑', eg:'Patient data in HTTP, not HTTPS', fix:'TLS everywhere, encrypt at rest' },
        { rank:'A03', name:'SQL Injection',          icon:'💉', eg:`name=' OR '1'='1`, fix:'Parameterised queries only' },
        { rank:'A05', name:'Security Misconfiguration',icon:'⚙️',eg:'Admin panel on default password', fix:'Harden config, remove defaults' },
        { rank:'A07', name:'Auth Failures',          icon:'🔐', eg:'No MFA, weak password policy', fix:'MFA + rate limiting + lockout' },
        { rank:'A09', name:'Logging Failures',       icon:'📋', eg:'Breach undetected for 6 months', fix:'SIEM, alerting, immutable logs' },
      ].map((r, i) => {
        const x = 10 + (i%3)*184;
        const y = 26 + Math.floor(i/3)*88;
        return (
          <g key={r.rank}>
            <rect x={x} y={y} width={174} height={80} rx={8} fill="#0a1628" stroke={color} strokeWidth={1} />
            <text x={x+14} y={y+18} fontSize={14}>{r.icon}</text>
            <text x={x+36} y={y+16} fontSize={9} fontWeight={800} fill={color} fontFamily="DM Mono,monospace">{r.rank}</text>
            <text x={x+36} y={y+28} fontSize={9} fontWeight={700} fill="#f0f4ff" fontFamily="DM Sans,sans-serif">{r.name}</text>
            <text x={x+10} y={y+46} fontSize={9} fill="#f87171" fontFamily="DM Mono,monospace">⚠ {r.eg}</text>
            <text x={x+10} y={y+62} fontSize={9} fill="#4ade80" fontFamily="DM Mono,monospace">✓ {r.fix}</text>
          </g>
        );
      })}
    </svg>
  );
}

// CY1-5 — Defence in Depth
function DiagramCY15({ color }) {
  return (
    <svg viewBox="0 0 560 210" className="anat-svg">
      <text x={280} y={16} textAnchor="middle" fontSize={11} fontWeight={800} fill={color} fontFamily="DM Mono,monospace">DEFENCE IN DEPTH — Concentric Security Layers</text>
      {/* Onion layers */}
      {[
        { r:190, color:'#1e293b',  label:'' },
        { r:155, color:'#94a3b820',label:'' },
        { r:118, color:'#f5950b20',label:'' },
        { r: 82, color:'#818cf820',label:'' },
        { r: 46, color:`${color}30`,label:'' },
      ].map((l, i) => (
        <circle key={i} cx={280} cy={108} r={l.r} fill={l.color} stroke="#1e293b" strokeWidth={1} />
      ))}
      {/* Layer labels */}
      {[
        { y: 20, label:'Physical — locked server rooms, badge access', color:'#94a3b8' },
        { y: 56, label:'Network — firewall, IDS, VPN, segmentation', color:'#f59e0b' },
        { y: 90, label:'Application — WAF, input validation, auth', color:'#818cf8' },
        { y:122, label:'Data — encryption, access control, DLP', color: color },
        { y:155, label:'🏥 Asset', color:'#4ade80' },
      ].map((l, i) => (
        <text key={i} x={280} y={l.y} textAnchor="middle" fontSize={i===4?11:9} fontWeight={700}
          fill={l.color} fontFamily="DM Mono,monospace">{l.label}</text>
      ))}
      {/* Attacker arrow */}
      <path d="M490,108 L370,108" stroke="#f87171" strokeWidth={2} markerEnd="url(#arr-490-370)" />
      <text x={505} y={112} fontSize={10} fill="#f87171" fontFamily="DM Mono,monospace">Attacker</text>
      <text x={280} y={193} textAnchor="middle" fontSize={9} fill="#475569" fontFamily="DM Mono,monospace">Each layer must be independently breached — attacker must defeat all of them</text>
    </svg>
  );
}

// CY1-6 — Security Careers
function DiagramCY16({ color }) {
  return (
    <svg viewBox="0 0 560 200" className="anat-svg">
      <text x={280} y={16} textAnchor="middle" fontSize={11} fontWeight={800} fill={color} fontFamily="DM Mono,monospace">SECURITY CAREER PATHS — Red vs Blue vs Purple</text>
      {[
        { x:10, label:'RED TEAM\n(Offensive)', color:'#f87171', icon:'🗡️',
          roles:['Penetration Tester', 'Bug Bounty Hunter', 'Red Team Operator'],
          tools:['Metasploit', 'Burp Suite', 'nmap', 'Cobalt Strike'],
          cert:'OSCP, CEH' },
        { x:196, label:'PURPLE TEAM\n(Both)', color:'#818cf8', icon:'🛡️⚔️',
          roles:['Security Engineer', 'DevSecOps', 'Threat Intelligence'],
          tools:['All of the above', 'SIEM', 'SOAR', 'Custom scripts'],
          cert:'CISSP, Security+' },
        { x:382, label:'BLUE TEAM\n(Defensive)', color, icon:'🛡️',
          roles:['SOC Analyst', 'IR Analyst', 'Security Architect'],
          tools:['Splunk', 'Wireshark', 'CrowdStrike', 'Velociraptor'],
          cert:'GCIH, GREM, CEH' },
      ].map(t => (
        <g key={t.label}>
          <rect x={t.x} y={26} width={160} height={162} rx={10} fill="#0a1628" stroke={t.color} strokeWidth={1.5} />
          <text x={t.x+80} y={48} textAnchor="middle" fontSize={18}>{t.icon}</text>
          {t.label.split('\n').map((line, li) => (
            <text key={li} x={t.x+80} y={63+li*14} textAnchor="middle" fontSize={10} fontWeight={800} fill={t.color} fontFamily="DM Mono,monospace">{line}</text>
          ))}
          <text x={t.x+10} y={98} fontSize={9} fontWeight={700} fill="#475569" fontFamily="DM Mono,monospace">ROLES:</text>
          {t.roles.map((r, ri) => (
            <text key={ri} x={t.x+10} y={110+ri*13} fontSize={9} fill="#94a3b8" fontFamily="DM Sans,sans-serif">• {r}</text>
          ))}
          <text x={t.x+80} y={156} textAnchor="middle" fontSize={8} fill={t.color} fontFamily="DM Mono,monospace">{t.cert}</text>
        </g>
      ))}
    </svg>
  );
}

// CY1-7 — Capstone Threat Model
function DiagramCY17({ color }) {
  return (
    <svg viewBox="0 0 560 200" className="anat-svg">
      <text x={280} y={16} textAnchor="middle" fontSize={11} fontWeight={800} fill={color} fontFamily="DM Mono,monospace">COMPLETE THREAT MODEL — Hospital Booking System</text>
      {[
        [color,    'Asset',         'Patient appointment data, doctor credentials, EHR access tokens'],
        ['#f87171','Threats',       'SQLi (A03), broken auth (A07), insider threat, credential stuffing'],
        ['#f59e0b','Attack Surface','Login form, /api endpoints, staff email, physical reception terminals'],
        ['#818cf8','Likelihood',    'SQLi: High (exposed endpoint). Insider: Medium. Credential stuffing: High'],
        ['#4ade80','Controls',      'Parameterised queries, MFA, role-based access, fail2ban, audit log'],
        ['#ec4899','Residual Risk', 'Zero-day in framework. Mitigate: WAF + dependency scanning monthly'],
      ].map(([col, label, text], i) => (
        <g key={label}>
          <rect x={10} y={26+i*28} width={540} height={24} rx={6} fill={i%2===0?'#0a1628':'#080e1a'} stroke="#1e293b" strokeWidth={1} />
          <rect x={10} y={26+i*28} width={4} height={24} rx={2} fill={col} />
          <text x={22} y={42+i*28} fontSize={10} fontWeight={800} fill={col} fontFamily="DM Mono,monospace">{label}:</text>
          <text x={120} y={42+i*28} fontSize={10} fill="#94a3b8" fontFamily="DM Sans,sans-serif">{text}</text>
        </g>
      ))}
    </svg>
  );
}

// ════════════════════════════════════════════════════════════════
// UX/UI DESIGNER — Stage 1 (8 levels)
// ════════════════════════════════════════════════════════════════

// UX1-0 — What is Design Thinking?
function DiagramUX10({ color }) {
  const phases = [
    { n:1, label:'EMPATHISE', icon:'🫂', color:'#f59e0b', note:'Understand users,\nnot assumptions' },
    { n:2, label:'DEFINE',    icon:'🎯', color: color,    note:'Problem statement,\nnot solution' },
    { n:3, label:'IDEATE',    icon:'💡', color:'#818cf8', note:'Quantity of ideas,\njudge later' },
    { n:4, label:'PROTOTYPE', icon:'🔧', color:'#4ade80', note:'Make it real,\nfast and cheap' },
    { n:5, label:'TEST',      icon:'🧪', color:'#ec4899', note:'Users show you\nwhat you missed' },
  ];
  return (
    <svg viewBox="0 0 560 200" className="anat-svg">
      <text x={280} y={16} textAnchor="middle" fontSize={11} fontWeight={800} fill={color} fontFamily="DM Mono,monospace">DESIGN THINKING — 5 Phases Applied to Hospital Booking</text>
      {phases.map((p, i) => {
        const x = 10 + i * 108;
        return (
          <g key={p.n}>
            <rect x={x} y={28} width={98} height={110} rx={10} fill="#0a1628" stroke={p.color} strokeWidth={1.5} />
            <text x={x+49} y={54} textAnchor="middle" fontSize={22}>{p.icon}</text>
            <text x={x+49} y={70} textAnchor="middle" fontSize={9} fontWeight={800} fill={p.color} fontFamily="DM Mono,monospace">{p.n}. {p.label}</text>
            {p.note.split('\n').map((line, li) => (
              <text key={li} x={x+49} y={85+li*14} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="DM Sans,sans-serif">{line}</text>
            ))}
            {i < 4 && <Arrow x1={x+98} y1={83} x2={x+108} y2={83} color={p.color} />}
          </g>
        );
      })}
      {/* Hospital-specific actions */}
      <text x={280} y={155} textAnchor="middle" fontSize={9} fill="#475569" fontFamily="DM Mono,monospace">Hospital booking context ↓</text>
      {[
        [59,   'Interview 5 patients\nabout booking pain'],
        [167,  'Define: "Anxious patient\ncan\'t find appointment"'],
        [275,  'Sketch 20 concepts\nfor a 2-click booking'],
        [383,  'Paper prototype\nof new flow'],
        [491,  'Test with 5 users,\nfind 3 critical bugs'],
      ].map(([x, note]) => (
        note.split('\n').map((line, li) => (
          <text key={`${x}-${li}`} x={x} y={168+li*13} textAnchor="middle" fontSize={8} fill="#4a5a72" fontFamily="DM Sans,sans-serif">{line}</text>
        ))
      ))}
    </svg>
  );
}

// UX1-1 — Empathy
function DiagramUX11({ color }) {
  return (
    <svg viewBox="0 0 560 200" className="anat-svg">
      <text x={280} y={16} textAnchor="middle" fontSize={11} fontWeight={800} fill={color} fontFamily="DM Mono,monospace">EMPATHY MAP — Margaret, 68, Hospital Outpatient</text>
      {/* Four quadrants */}
      {[
        { x:10,  y:26, label:'SAYS', color:'#f59e0b', quotes:['"I just want to know my appointment is confirmed."', '"I can\'t see the small text on my phone."', '"Why do I have to log in again?"'] },
        { x:290, y:26, label:'THINKS', color: color, quotes:['"What if I\'m at the wrong ward?', 'I hope I\'m not late — the bus was delayed.', '"I don\'t trust that the form saved."'] },
        { x:10,  y:114,label:'DOES', color:'#818cf8', quotes:['Calls the hospital to confirm after booking online.', 'Writes the appointment on paper.', 'Asks her daughter to help with the app.'] },
        { x:290, y:114,label:'FEELS', color:'#ec4899', quotes:['Anxious about forgetting details.', 'Frustrated by confusing navigation.', 'Relieved when she gets a confirmation text.'] },
      ].map(q => (
        <g key={q.label}>
          <rect x={q.x} y={q.y} width={260} height={82} rx={8} fill="#0a1628" stroke={q.color} strokeWidth={1.5} />
          <text x={q.x+130} y={q.y+16} textAnchor="middle" fontSize={10} fontWeight={800} fill={q.color} fontFamily="DM Mono,monospace">{q.label}</text>
          {q.quotes.map((quote, qi) => (
            <text key={qi} x={q.x+10} y={q.y+32+qi*16} fontSize={9} fill="#94a3b8" fontFamily="DM Sans,sans-serif">• {quote}</text>
          ))}
        </g>
      ))}
    </svg>
  );
}

// UX1-2 — Define (Problem Statement)
function DiagramUX12({ color }) {
  return (
    <svg viewBox="0 0 560 200" className="anat-svg">
      <text x={280} y={16} textAnchor="middle" fontSize={11} fontWeight={800} fill={color} fontFamily="DM Mono,monospace">HOW MIGHT WE — From Research to Problem Statement</text>
      {/* Research findings → HMW → Problem statement */}
      <rect x={10} y={28} width={160} height={150} rx={8} fill="#0a1628" stroke="#f59e0b" strokeWidth={1.5} />
      <text x={90} y={46} textAnchor="middle" fontSize={10} fontWeight={800} fill="#f59e0b" fontFamily="DM Mono,monospace">RESEARCH FINDINGS</text>
      {['68% of patients call to confirm', '40% miss their appointment', 'Navigation rated 2/5', '5 clicks to book = too many', 'Mobile: hard to read text'].map((f, i) => (
        <text key={i} x={20} y={62+i*20} fontSize={9} fill="#94a3b8" fontFamily="DM Sans,sans-serif">• {f}</text>
      ))}
      <Arrow x1={170} y1={103} x2={195} y2={103} color="#f59e0b" label="synthesise" />
      {/* HMW questions */}
      <rect x={195} y={28} width={175} height={150} rx={8} fill="#0f1a0f" stroke={color} strokeWidth={1.5} />
      <text x={283} y={46} textAnchor="middle" fontSize={10} fontWeight={800} fill={color} fontFamily="DM Mono,monospace">HOW MIGHT WE…</text>
      {['…confirm without calling?', '…reduce clicks to 2?', '…make text readable at 68?', '…surface the ward clearly?', '…build user confidence?'].map((hmw, i) => (
        <text key={i} x={205} y={62+i*20} fontSize={9} fill="#94a3b8" fontFamily="DM Sans,sans-serif">{hmw}</text>
      ))}
      <Arrow x1={370} y1={103} x2={395} y2={103} color={color} label="focus" />
      {/* Problem statement */}
      <rect x={395} y={28} width={155} height={150} rx={8} fill="#0a1628" stroke="#4ade80" strokeWidth={1.5} />
      <text x={473} y={48} textAnchor="middle" fontSize={10} fontWeight={800} fill="#4ade80" fontFamily="DM Mono,monospace">PROBLEM STATEMENT</text>
      <text x={405} y={68} fontSize={9} fill="#94a3b8" fontFamily="DM Sans,sans-serif" fontStyle="italic">"Margaret, an outpatient</text>
      <text x={405} y={82} fontSize={9} fill="#94a3b8" fontFamily="DM Sans,sans-serif" fontStyle="italic">with low digital confidence,</text>
      <text x={405} y={96} fontSize={9} fill="#94a3b8" fontFamily="DM Sans,sans-serif" fontStyle="italic">needs to book and confirm</text>
      <text x={405} y={110} fontSize={9} fill="#94a3b8" fontFamily="DM Sans,sans-serif" fontStyle="italic">appointments in 2 clicks</text>
      <text x={405} y={124} fontSize={9} fill="#94a3b8" fontFamily="DM Sans,sans-serif" fontStyle="italic">because she cannot read</text>
      <text x={405} y={138} fontSize={9} fill="#94a3b8" fontFamily="DM Sans,sans-serif" fontStyle="italic">small text and doesn't trust</text>
      <text x={405} y={152} fontSize={9} fill="#94a3b8" fontFamily="DM Sans,sans-serif" fontStyle="italic">the system saved her booking."</text>
    </svg>
  );
}

// UX1-3 — Ideation
function DiagramUX13({ color }) {
  return (
    <svg viewBox="0 0 560 200" className="anat-svg">
      <text x={280} y={16} textAnchor="middle" fontSize={11} fontWeight={800} fill={color} fontFamily="DM Mono,monospace">IDEATION — Quantity Before Quality</text>
      {/* Crazy 8s grid */}
      <text x={140} y={34} textAnchor="middle" fontSize={10} fill="#475569" fontFamily="DM Mono,monospace">CRAZY 8s — 8 ideas in 8 minutes</text>
      {Array.from({length:8}, (_,i) => {
        const x = 10 + (i%4)*130;
        const y = 42 + Math.floor(i/4)*72;
        const ideas = ['QR code at reception', '2-click app shortcut', 'SMS confirmation bot', 'Voice booking IVR', 'Family member proxy', 'Kiosk at entrance', 'Wearable reminder', 'GP auto-books'];
        const col = i < 3 ? color : i < 5 ? '#818cf8' : '#4ade80';
        return (
          <g key={i}>
            <rect x={x} y={y} width={120} height={60} rx={6} fill="#0a1628" stroke={col} strokeWidth={i===0?2:1} />
            {i===0 && <rect x={x} y={y} width={120} height={60} rx={6} fill={`${color}10`} />}
            <text x={x+60} y={y+18} textAnchor="middle" fontSize={9} fontWeight={700} fill={col} fontFamily="DM Mono,monospace">Idea {i+1}{i===0?' ★':''}</text>
            <text x={x+60} y={y+36} textAnchor="middle" fontSize={10} fill="#94a3b8" fontFamily="DM Sans,sans-serif">{ideas[i]}</text>
            {i===0 && <text x={x+60} y={y+50} textAnchor="middle" fontSize={8} fill={color} fontFamily="DM Mono,monospace">← selected for prototype</text>}
          </g>
        );
      })}
      {/* Dot voting */}
      <text x={420} y={42} textAnchor="middle" fontSize={9} fill="#475569" fontFamily="DM Mono,monospace">SELECTION</text>
      <rect x={355} y={50} width={195} height={110} rx={8} fill="#0a1628" stroke="#334155" strokeWidth={1} />
      {[['Impact vs Effort matrix', color], ['QR code: High/Low ★★★', '#4ade80'], ['2-click app: High/Med ★★', color], ['Voice IVR: Med/High ★', '#818cf8'], ['Kiosk: Med/High ★', '#818cf8']].map(([text, col], i) => (
        <text key={i} x={365} y={66+i*18} fontSize={i===0?9:10} fontWeight={i===0?700:400} fill={col} fontFamily={i===0?'DM Mono,monospace':'DM Sans,sans-serif'}>{text}</text>
      ))}
    </svg>
  );
}

// UX1-4 — Prototype
function DiagramUX14({ color }) {
  return (
    <svg viewBox="0 0 560 200" className="anat-svg">
      <text x={280} y={16} textAnchor="middle" fontSize={11} fontWeight={800} fill={color} fontFamily="DM Mono,monospace">PROTOTYPE FIDELITY SPECTRUM — Choose the right level</text>
      {[
        { x:10, label:'PAPER', fidelity:'Lo-fi', icon:'📄', time:'30 mins', cost:'£0', best:'Early ideation\ntest core flows', color:'#94a3b8' },
        { x:148,label:'WIREFRAME', fidelity:'Lo-fi', icon:'🔲', time:'2–4 hrs', cost:'Low', best:'Test IA and\nnavigation logic', color:'#f59e0b' },
        { x:286,label:'FIGMA MOCKUP', fidelity:'Mid-fi', icon:'🎨', time:'1–2 days', cost:'Medium', best:'Visual direction\nshareholder review', color: color },
        { x:424,label:'CODED', fidelity:'Hi-fi', icon:'💻', time:'1–2 weeks', cost:'High', best:'Final user testing\nbefore launch', color:'#4ade80' },
      ].map(p => (
        <g key={p.label}>
          <rect x={p.x} y={26} width={130} height={160} rx={8} fill="#0a1628" stroke={p.color} strokeWidth={1.5} />
          <text x={p.x+65} y={46} textAnchor="middle" fontSize={20}>{p.icon}</text>
          <text x={p.x+65} y={60} textAnchor="middle" fontSize={9} fontWeight={800} fill={p.color} fontFamily="DM Mono,monospace">{p.label}</text>
          <text x={p.x+65} y={74} textAnchor="middle" fontSize={9} fill="#475569" fontFamily="DM Mono,monospace">{p.fidelity}</text>
          <text x={p.x+10} y={94} fontSize={9} fill="#64748b" fontFamily="DM Mono,monospace">Time: {p.time}</text>
          <text x={p.x+10} y={108} fontSize={9} fill="#64748b" fontFamily="DM Mono,monospace">Cost: {p.cost}</text>
          <text x={p.x+10} y={126} fontSize={9} fontWeight={700} fill="#475569" fontFamily="DM Mono,monospace">BEST FOR:</text>
          {p.best.split('\n').map((line, li) => (
            <text key={li} x={p.x+10} y={140+li*14} fontSize={9} fill="#94a3b8" fontFamily="DM Sans,sans-serif">{line}</text>
          ))}
        </g>
      ))}
      <text x={280} y={196} textAnchor="middle" fontSize={9} fill="#475569" fontFamily="DM Mono,monospace">Rule: use the lowest fidelity that answers your current question. Never code before you've paper-tested.</text>
    </svg>
  );
}

// UX1-5 — Test
function DiagramUX15({ color }) {
  return (
    <svg viewBox="0 0 560 200" className="anat-svg">
      <text x={280} y={16} textAnchor="middle" fontSize={11} fontWeight={800} fill={color} fontFamily="DM Mono,monospace">USABILITY TESTING — 5-User Method (Jakob Nielsen)</text>
      {/* Left: process */}
      <rect x={10} y={26} width={240} height={162} rx={8} fill="#0a1628" stroke={color} strokeWidth={1.5} />
      <text x={130} y={44} textAnchor="middle" fontSize={10} fontWeight={800} fill={color} fontFamily="DM Mono,monospace">TEST SESSION STRUCTURE</text>
      {[
        ['5 min',  'Welcome + consent form'],
        ['3 min',  '"Tell me about last time\n you booked an appointment"'],
        ['15 min', 'Task: Book a 9am appt\n with Dr Singh'],
        ['10 min', '"Walk me through\n what you were thinking"'],
        ['5 min',  '"What confused you?\n What worked well?"'],
      ].map(([time, note], i) => (
        <g key={i}>
          <rect x={18} y={52+i*26} width={36} height={20} rx={4} fill={`${color}20`} />
          <text x={36} y={65+i*26} textAnchor="middle" fontSize={8} fill={color} fontFamily="DM Mono,monospace">{time}</text>
          {note.split('\n').map((line, li) => (
            <text key={li} x={62} y={62+i*26+li*11} fontSize={9} fill="#94a3b8" fontFamily="DM Sans,sans-serif">{line}</text>
          ))}
        </g>
      ))}
      {/* Right: findings */}
      <rect x={265} y={26} width={285} height={162} rx={8} fill="#0a1628" stroke="#4ade80" strokeWidth={1.5} />
      <text x={408} y={44} textAnchor="middle" fontSize={10} fontWeight={800} fill="#4ade80" fontFamily="DM Mono,monospace">FINDINGS → ACTION</text>
      {[
        ['#f87171', 'Critical', '4/5 users missed the "Confirm"\nbutton — it blended with background'],
        ['#f59e0b', 'Major',    '3/5 confused "Appointment Type"\nlabel — changed to "What for?"'],
        ['#818cf8', 'Minor',    '2/5 expected back button to\nreturn to date, not home'],
        ['#4ade80', 'Insight',  '"I feel safer when I see my\nGP\'s name and photo"'],
      ].map(([col, sev, note], i) => (
        <g key={sev}>
          <rect x={274} y={54+i*32} width={268} height={28} rx={4} fill={`${col}10`} stroke={`${col}40`} strokeWidth={1} />
          <text x={282} y={64+i*32} fontSize={9} fontWeight={700} fill={col} fontFamily="DM Mono,monospace">{sev}:</text>
          {note.split('\n').map((line, li) => (
            <text key={li} x={330} y={64+i*32+li*11} fontSize={8} fill="#94a3b8" fontFamily="DM Sans,sans-serif">{line}</text>
          ))}
        </g>
      ))}
    </svg>
  );
}

// UX1-6 — UX vs UI
function DiagramUX16({ color }) {
  return (
    <svg viewBox="0 0 560 200" className="anat-svg">
      <text x={280} y={16} textAnchor="middle" fontSize={11} fontWeight={800} fill={color} fontFamily="DM Mono,monospace">UX vs UI — Two Different Skills, Both Needed</text>
      <rect x={10}  y={26} width={255} height={162} rx={10} fill="#0a1628" stroke={color} strokeWidth={1.5} />
      <text x={138} y={46} textAnchor="middle" fontSize={12} fontWeight={800} fill={color} fontFamily="DM Sans,sans-serif">UX — User Experience</text>
      <text x={138} y={60} textAnchor="middle" fontSize={9} fill="#475569" fontFamily="DM Mono,monospace">"Does it work for people?"</text>
      {[
        '🔍 Research & interviews',
        '🗺️ Information architecture',
        '🌊 User journey mapping',
        '📋 Wireframes & flows',
        '🧪 Usability testing',
        '📊 Analytics & iteration',
      ].map((item, i) => (
        <text key={i} x={24} y={80+i*17} fontSize={10} fill="#94a3b8" fontFamily="DM Sans,sans-serif">{item}</text>
      ))}
      <rect x={295} y={26} width={255} height={162} rx={10} fill="#0a1628" stroke="#818cf8" strokeWidth={1.5} />
      <text x={423} y={46} textAnchor="middle" fontSize={12} fontWeight={800} fill="#818cf8" fontFamily="DM Sans,sans-serif">UI — User Interface</text>
      <text x={423} y={60} textAnchor="middle" fontSize={9} fill="#475569" fontFamily="DM Mono,monospace">"Does it look right?"</text>
      {[
        '🎨 Visual design & colour',
        '🔤 Typography & spacing',
        '🧩 Component libraries',
        '✨ Motion & micro-animations',
        '📱 Responsive layouts',
        '🖼️ Icons, imagery, illustration',
      ].map((item, i) => (
        <text key={i} x={309} y={80+i*17} fontSize={10} fill="#94a3b8" fontFamily="DM Sans,sans-serif">{item}</text>
      ))}
    </svg>
  );
}

// UX1-7 — Capstone
function DiagramUX17({ color }) {
  return (
    <svg viewBox="0 0 560 200" className="anat-svg">
      <text x={280} y={16} textAnchor="middle" fontSize={11} fontWeight={800} fill={color} fontFamily="DM Mono,monospace">DESIGN CHALLENGE DELIVERABLES — Hospital Booking Redesign</text>
      {[
        [color,    'Persona',         'Margaret, 68, outpatient. Goal: book without calling. Pain: small text, too many steps.'],
        ['#f59e0b','Problem Statement','"Margaret needs a 2-click booking confirmation because she cannot read small text and doubts the system."'],
        ['#818cf8','Wireframe',       '5 screens: Home → Type → Date → Time → Confirmation. Each with clear back navigation.'],
        [color,    'IA Map',          'Flat structure: max 2 levels deep. Every action reachable in 2 taps from home.'],
        ['#4ade80','Test Findings',   '3 critical issues found: confirm button invisible, ward info missing, no phone fallback link.'],
        ['#ec4899','Design Decisions','14pt minimum text. High-contrast confirm button. GP photo on confirmation screen.'],
      ].map(([col, label, text], i) => (
        <g key={label}>
          <rect x={10} y={26+i*28} width={540} height={24} rx={6} fill={i%2===0?'#0a1628':'#080e1a'} stroke="#1e293b" strokeWidth={1} />
          <rect x={10} y={26+i*28} width={4} height={24} rx={2} fill={col} />
          <text x={22} y={42+i*28} fontSize={10} fontWeight={800} fill={col} fontFamily="DM Mono,monospace">{label}:</text>
          <text x={160} y={42+i*28} fontSize={10} fill="#94a3b8" fontFamily="DM Sans,sans-serif">{text.length > 75 ? text.slice(0,73)+'…' : text}</text>
        </g>
      ))}
    </svg>
  );
}

// ── Add new diagrams to the registry ──────────────────────────────────────
Object.assign(DIAGRAMS, {
  'ml1-0': DiagramML10, 'ml1-1': DiagramML11, 'ml1-2': DiagramML12, 'ml1-3': DiagramML13,
  'ml1-4': DiagramML14, 'ml1-5': DiagramML15, 'ml1-6': DiagramML16, 'ml1-7': DiagramML17,
  'cy1-0': DiagramCY10, 'cy1-1': DiagramCY11, 'cy1-2': DiagramCY12, 'cy1-3': DiagramCY13,
  'cy1-4': DiagramCY14, 'cy1-5': DiagramCY15, 'cy1-6': DiagramCY16, 'cy1-7': DiagramCY17,
  'ux1-0': DiagramUX10, 'ux1-1': DiagramUX11, 'ux1-2': DiagramUX12, 'ux1-3': DiagramUX13,
  'ux1-4': DiagramUX14, 'ux1-5': DiagramUX15, 'ux1-6': DiagramUX16, 'ux1-7': DiagramUX17,
});
