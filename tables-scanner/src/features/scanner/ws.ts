'use client';

import { IncomingWebSocketMessage, OutgoingWebSocketMessage } from './basic-types';

type Listener = (message: IncomingWebSocketMessage) => void;

const URL = 'wss://api-rs.dexcelerate.com/ws';

const createWS = () => {
  let ws: WebSocket | null = null;
  let isNeedToOpenConnection = false;
  const listeners = new Set<Listener>();

  const connect = () => {
    if (ws) {
      return;
    }

    isNeedToOpenConnection = true;
    ws = new WebSocket(URL);

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as IncomingWebSocketMessage;

        listeners.forEach((cb) => cb(msg));
      } catch {
        console.log('WS onmessage parse error');
      }
    };

    ws.onclose = () => {
      ws = null;

      if (isNeedToOpenConnection) {
        setTimeout(connect, 1000);
      }
    };

    ws.onerror = () => ws?.close();
  };

  const close = () => {
    isNeedToOpenConnection = false;
    ws?.close();
    ws = null;
  };

  const send = (msg: OutgoingWebSocketMessage) => {
    const payload = JSON.stringify(msg);

    const trySend = () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(payload);
      } else {
        setTimeout(trySend, 100);
      }
    };

    trySend();
  };

  const on = (cb: Listener) => {
    listeners.add(cb);

    return () => listeners.delete(cb);
  };

  return { connect, close, send, on };
};

export const ws = createWS();
