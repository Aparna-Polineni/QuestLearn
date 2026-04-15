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
