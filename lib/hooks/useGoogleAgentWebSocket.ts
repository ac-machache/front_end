/**
 * WebSocket hook to talk to backend Google agent (text chat).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { getClientById } from '@/lib/firebase';

export type WsStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

function makeId() {
  return `m_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function useGoogleAgentWebSocket(clientId?: string) {
  const { user } = useAuth();
  const [status, setStatus] = useState<WsStatus>('disconnected');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const clientIdRef = useRef(clientId);
  
  // Update ref when clientId changes
  useEffect(() => {
    clientIdRef.current = clientId;
  }, [clientId]);
  
  const backendUrl = useMemo(() => {
    const base = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    // Convert http(s) -> ws(s)
    try {
      const u = new URL(base);
      u.protocol = u.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${u.toString().replace(/\/$/, '')}/google-agent/ws`;
    } catch {
      return `ws://localhost:8080/google-agent/ws`;
    }
  }, []);

  const connect = useCallback(async () => {
    if (!user) {
      setError('User not authenticated');
      return;
    }
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    setStatus('connecting');
    setError(null);
    // Prefetch client name to include in init payload
    let clientName = '';
    try {
      const cid = clientIdRef.current;
      if (cid) {
        const c = await getClientById(user.uid, cid);
        if (c && typeof c.name === 'string') clientName = c.name;
      }
    } catch {}

    const url = `${backendUrl}?user_id=${encodeURIComponent(user.uid)}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('connected');
      // Send initial payload with Firestore path and names
      try {
        const cid = clientIdRef.current;
        const uid = user?.uid;
        if (cid && uid) {
          const currectPath = `technico/${uid}/clients/${cid}`;
          ws.send(JSON.stringify({
            event: 'init',
            currect_firestore_path: currectPath,
            nom_tc: user?.displayName || user?.email || 'Utilisateur',
            nom_agri: clientName || '',
          }));
        }
      } catch {}
    };
    ws.onerror = () => {
      setStatus('error');
      setError('WebSocket error');
    };
    ws.onclose = () => setStatus('disconnected');
    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        switch (data.event) {
          case 'ready':
            break;
          case 'agent_thinking':
            setIsThinking(true);
            break;
          case 'message': {
            if (data.role === 'assistant' && data.text) {
              setMessages((prev) => prev.concat({ id: makeId(), role: 'assistant', content: data.text }));
              setIsThinking(false);
            }
            break;
          }
          case 'error':
            setError(data.message || 'Unknown error');
            setIsThinking(false);
            break;
          default:
            break;
        }
      } catch (e) {
        // ignore
      }
    };
  }, [backendUrl, user]);

  const disconnect = useCallback(() => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ event: 'disconnect' }));
      ws.close(1000, 'User disconnected');
    }
    wsRef.current = null;
    setStatus('disconnected');
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setError('Not connected to agent');
      return;
    }
    // Append user message locally
    setMessages((prev) => prev.concat({ id: makeId(), role: 'user', content: text }));
    ws.send(JSON.stringify({ event: 'message', text }));
    setIsThinking(true);
  }, []);

  // Auto-connect when user available
  useEffect(() => {
    if (!user) return;
    connect();
    return () => disconnect();
  }, [user, connect, disconnect]);

  // Heartbeat
  useEffect(() => {
    const ws = wsRef.current;
    if (!ws || status !== 'connected') return;
    const id = setInterval(() => {
      try {
        ws.send(JSON.stringify({ event: 'heartbeat' }));
      } catch {}
    }, 30000);
    return () => clearInterval(id);
  }, [status]);

  return { messages, sendMessage, status, isThinking, error, connect, disconnect } as const;
}


