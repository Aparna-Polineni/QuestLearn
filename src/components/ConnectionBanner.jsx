// src/components/ConnectionBanner.jsx
// Shown when the Spring Boot backend is unreachable.
// Subscribes to the connection state from api.js.
// Message is honest about what is and isn't saved.

import { useState, useEffect } from 'react';
import { subscribeConnection } from '../services/api';
import './ConnectionBanner.css';

export default function ConnectionBanner() {
  const [online,  setOnline]  = useState(true);
  const [showing, setShowing] = useState(false); // start hidden even if offline
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    // Subscribe to api.js connection events
    const unsub = subscribeConnection(isOnline => {
      setOnline(isOnline);
      if (!isOnline) setShowing(true); // show when we go offline
    });

    // Also listen to native browser online/offline events as a secondary signal
    const goOnline  = () => { setOnline(true);  setSyncing(true); setTimeout(() => setSyncing(false), 2000); };
    const goOffline = () => { setOnline(false); setShowing(true); };
    window.addEventListener('online',  goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      unsub();
      window.removeEventListener('online',  goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // When back online — show reconnected message briefly then hide
  useEffect(() => {
    if (online && showing) {
      const t = setTimeout(() => setShowing(false), 3000);
      return () => clearTimeout(t);
    }
  }, [online, showing]);

  if (!showing) return null;

  return (
    <div className={`conn-banner ${online ? 'conn-banner--online' : 'conn-banner--offline'}`}>
      <div className="conn-banner-icon">
        {online ? '✓' : '⚡'}
      </div>
      <div className="conn-banner-text">
        {online && syncing
          ? 'Back online — syncing your progress now.'
          : online
          ? 'Reconnected.'
          : "We're having a connection issue — your work is saved locally and will sync when you reconnect."}
      </div>
      {!online && (
        <button className="conn-banner-close" onClick={() => setShowing(false)}>
          ×
        </button>
      )}
    </div>
  );
}
