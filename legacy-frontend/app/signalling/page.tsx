"use client";
import React, { useEffect, useRef, useState } from "react";

const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:8000/signalling";

export default function SignallingDemoPage() {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    ws.onopen = () => { setConnected(true); setLog((l)=>[...l, 'connected']); };
    ws.onmessage = (evt) => setLog((l)=>[...l, `msg: ${evt.data}`]);
    ws.onclose = () => { setConnected(false); setLog((l)=>[...l, 'closed']); };
    ws.onerror = () => setLog((l)=>[...l, 'error']);
    return () => ws.close();
  }, []);

  const sendPing = () => {
    wsRef.current?.send(JSON.stringify({ type: 'ping', t: Date.now() }));
  };

  return (
    <div className="sub-container">
      <h1 className="header">Signalling Demo</h1>
      <p className="mt-2">WS URL: {wsUrl}</p>
      <div className="mt-4 space-x-3">
        <button className="shad-gray-btn rounded px-4 py-2" disabled={!connected} onClick={sendPing}>Send Ping</button>
      </div>
      <div className="mt-6 h-64 overflow-auto rounded border border-dark-400 p-3">
        {log.map((l, i)=> (<div key={i} className="text-14-regular">{l}</div>))}
      </div>
    </div>
  );
}
