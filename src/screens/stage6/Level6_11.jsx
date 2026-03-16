// src/screens/stage6/Level6_11.jsx — WebSockets (FILL)
import { useState } from 'react';
import Stage6Shell from './Stage6Shell';
import FillEditor from '../stage2/FillEditor';

const BLANKS = [
  { id: 'ENABLEWS',  answer: '@EnableWebSocketMessageBroker',                      placeholder: 'enable WebSocket annotation', hint: 'Activates STOMP WebSocket support in Spring Boot.' },
  { id: 'REGISTRY',  answer: 'registry.enableSimpleBroker("/topic")',               placeholder: 'enable message broker',       hint: 'Clients subscribe to /topic/... to receive messages.' },
  { id: 'PREFIX',    answer: 'registry.setApplicationDestinationPrefixes("/app")',  placeholder: 'set app destination prefix',  hint: 'Messages sent from React to /app/... reach @MessageMapping.' },
  { id: 'MSGMAP',    answer: '@MessageMapping("/ward-update")',                      placeholder: 'map incoming message',         hint: 'Receives messages sent from React to /app/ward-update.' },
  { id: 'SENDTO',    answer: '@SendTo("/topic/wards")',                              placeholder: 'broadcast destination',        hint: 'Broadcasts the return value to all subscribers of /topic/wards.' },
  { id: 'STOMP',     answer: 'new Client({ brokerURL: "ws://localhost:8080/ws" })', placeholder: 'create STOMP client',          hint: 'Connect to Spring Boot\'s WebSocket endpoint on /ws.' },
  { id: 'SUBSCRIBE', answer: 'client.subscribe("/topic/wards", callback)',          placeholder: 'subscribe to topic',          hint: 'Listen for messages on the /topic/wards channel.' },
];

const TEMPLATE = `// ── Spring Boot — WebSocket Config ─────────────────────────────────────────
@Configuration
@[ENABLEWS]
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        [REGISTRY];   // clients subscribe here
        [PREFIX];     // React sends messages here
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:3000")
                .withSockJS(); // fallback for browsers without native WS
    }
}

// ── Spring Boot — Ward Update Controller ────────────────────────────────────
@Controller
public class WardController {

    [MSGMAP]           // receives: /app/ward-update
    [SENDTO]           // broadcasts to: /topic/wards
    public WardUpdate updateWard(@Payload WardUpdate update) {
        // process and broadcast
        return update;
    }
}

// ── React — WebSocket Client ─────────────────────────────────────────────────
import { Client } from '@stomp/stompjs';

function useWardUpdates(onUpdate) {
  useEffect(() => {
    const client = [STOMP];

    client.onConnect = () => {
      [SUBSCRIBE]((frame) => {
        const update = JSON.parse(frame.body);
        onUpdate(update);
      });
    };

    client.activate();
    return () => client.deactivate(); // cleanup on unmount
  }, []);
}`;

export default function Level6_11() {
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage6Shell levelId={11} canProceed={isCorrect}
      conceptReveal={[
        { label: 'STOMP over WebSocket', detail: 'Raw WebSockets are low-level. STOMP (Simple Text Oriented Messaging Protocol) adds channels, subscriptions, and message headers on top. Spring Boot\'s @EnableWebSocketMessageBroker uses STOMP, which is why React uses the @stomp/stompjs library.' },
        { label: '/app vs /topic', detail: '/app is for React → Spring (client sends a message). /topic is for Spring → React (server broadcasts). Never confuse them: subscribing to /app won\'t get broadcasts; sending to /topic bypasses your @MessageMapping.' },
        { label: 'SockJS Fallback', detail: 'withSockJS() enables a fallback for environments that block WebSockets (some corporate firewalls, older browsers). SockJS emulates WebSocket behaviour using HTTP long-polling or iframe techniques. Always include it.' },
      ]}
    >
      <div className="s6-intro">
        <h1>WebSockets</h1>
        <p className="s6-tagline">📡 Server pushes to React. No polling. Real-time ward updates.</p>
        <p className="s6-why">HTTP is pull — React asks, Spring answers. WebSockets are push — Spring sends when something changes. When a patient is admitted, every open browser tab should update instantly without React polling every second.</p>
      </div>

      <table className="s6-table">
        <thead><tr><th>Direction</th><th>Path</th><th>Used For</th></tr></thead>
        <tbody>
          <tr><td>React → Spring</td><td><code>/app/ward-update</code></td><td>Client sends a message to a @MessageMapping handler</td></tr>
          <tr><td>Spring → React</td><td><code>/topic/wards</code></td><td>Server broadcasts to all subscribed React clients</td></tr>
          <tr><td>Connect</td><td><code>ws://localhost:8080/ws</code></td><td>WebSocket handshake endpoint registered with addEndpoint</td></tr>
        </tbody>
      </table>

      <FillEditor template={TEMPLATE} blanks={BLANKS} onAllCorrect={() => setIsCorrect(true)} />
    </Stage6Shell>
  );
}
