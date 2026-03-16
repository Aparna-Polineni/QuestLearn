// src/screens/stage6/Level6_12.jsx — Real-Time Notifications (BUILD)
import { useState } from 'react';
import Stage6Shell from './Stage6Shell';

const REQUIREMENTS = [
  { id: 'r1', label: 'Spring @MessageMapping receives admission event' },
  { id: 'r2', label: 'SimpMessagingTemplate broadcasts to /topic/admissions' },
  { id: 'r3', label: 'React useEffect creates and activates STOMP client' },
  { id: 'r4', label: 'Subscribes to /topic/admissions on connect' },
  { id: 'r5', label: 'Notifications state updated when message arrives' },
  { id: 'r6', label: 'Client deactivated on component unmount (cleanup)' },
];

const SOLUTION = `// ── Spring Boot — Broadcast on Patient Admission ───────────────────────────
@Service
public class AdmissionService {

    private final SimpMessagingTemplate messagingTemplate;

    public AdmissionService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public Patient admitPatient(Patient patient) {
        Patient saved = patientRepository.save(patient);

        // Broadcast to all subscribers of /topic/admissions
        messagingTemplate.convertAndSend("/topic/admissions",
            Map.of(
                "message", "New patient admitted: " + saved.getName(),
                "wardId",  saved.getWard().getId(),
                "time",    LocalTime.now().toString()
            )
        );

        return saved;
    }
}

// ── React — Live Notification Bell ──────────────────────────────────────────
import { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
    });

    client.onConnect = () => {
      client.subscribe('/topic/admissions', (frame) => {
        const notification = JSON.parse(frame.body);
        setNotifications(prev => [notification, ...prev].slice(0, 20)); // keep last 20
      });
    };

    client.activate();
    return () => client.deactivate(); // cleanup on unmount
  }, []);

  return (
    <div className="notification-bell">
      <button onClick={() => setOpen(o => !o)}>
        🔔 {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
      </button>
      {open && (
        <div className="notification-dropdown">
          {notifications.length === 0
            ? <p>No new admissions</p>
            : notifications.map((n, i) => (
                <div key={i} className="notification-item">
                  <span>{n.message}</span>
                  <small>{n.time}</small>
                </div>
              ))
          }
        </div>
      )}
    </div>
  );
}`;

export default function Level6_12() {
  const [code, setCode] = useState('');
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState({});
  const [showSolution, setShowSolution] = useState(false);

  function check() {
    const c = code.toUpperCase();
    setResults({
      r1: c.includes('@MESSAGEMAPPING') || c.includes('MESSAGEMAPPING'),
      r2: c.includes('SIMPMES') || c.includes('CONVERTANDSEND') || (c.includes('/TOPIC/') && c.includes('SEND')),
      r3: c.includes('NEW CLIENT') && c.includes('BROKERURL'),
      r4: c.includes('SUBSCRIBE') && c.includes('/TOPIC/'),
      r5: c.includes('SETNOTIFICATIONS') || c.includes('SET_NOTIFICATIONS'),
      r6: c.includes('DEACTIVATE'),
    });
    setChecked(true);
  }

  const allPass = checked && Object.values(results).every(Boolean);

  return (
    <Stage6Shell levelId={12} canProceed={allPass}
      conceptReveal={[
        { label: 'SimpMessagingTemplate', detail: 'Inject SimpMessagingTemplate into any Spring service to broadcast messages from outside a WebSocket controller. This is how you trigger broadcasts from events — like saving a new patient — rather than only responding to client messages.' },
        { label: 'slice(0, 20)', detail: 'Don\'t keep growing the notifications array forever — older items are never cleaned up and memory grows unbounded. Slice to keep only the last N items. For a production app, also add a "Clear all" button.' },
        { label: 'Cleanup is Critical', detail: 'Always deactivate the STOMP client on unmount. Without cleanup, navigating away from the component leaves the WebSocket connection open. Multiple mounts (React StrictMode renders twice) without cleanup create duplicate subscriptions and double notifications.' },
      ]}
    >
      <div className="s6-intro">
        <h1>Real-Time Notifications</h1>
        <p className="s6-tagline">🔔 Patient admitted in ward 3 — every open browser sees it instantly.</p>
        <p className="s6-why">Build the notification bell: Spring broadcasts on patient admission, React receives via WebSocket and displays a live count. This is the complete server-push pattern.</p>
      </div>

      <div style={{ marginBottom:14 }}>
        {REQUIREMENTS.map(r => (
          <div className="s6-req" key={r.id}>
            <span className="s6-req-icon" style={{ color: !checked ? '#475569' : results[r.id] ? '#4ade80' : '#f87171' }}>
              {!checked ? '○' : results[r.id] ? '✓' : '✗'}
            </span>
            <span className="s6-req-text">{r.label}</span>
          </div>
        ))}
      </div>

      <textarea className="s6-editor" value={code} onChange={e => setCode(e.target.value)}
        placeholder="// Build Spring broadcast service + React NotificationBell component..." style={{ minHeight:300 }} />

      <div style={{ display:'flex', gap:10, marginTop:10 }}>
        <button className="s6-btn" onClick={check}>Check Requirements</button>
        <button className="s6-btn secondary" onClick={() => setShowSolution(s => !s)}>
          {showSolution ? 'Hide' : 'Show'} Solution
        </button>
      </div>

      {showSolution && (
        <div className="s6-panel" style={{ marginTop:12 }}>
          <div className="s6-panel-header">✅ Reference Solution</div>
          <pre className="s6-panel-body" style={{ color:'#94a3b8', overflowX:'auto', margin:0, fontSize:12 }}>{SOLUTION}</pre>
        </div>
      )}

      {checked && (
        <div className={`s6-feedback ${allPass ? 'success' : 'error'}`}>
          {allPass ? '✅ Real-time notifications working. Your app is now live.' : `❌ ${Object.values(results).filter(Boolean).length}/${REQUIREMENTS.length} requirements met.`}
        </div>
      )}
    </Stage6Shell>
  );
}
