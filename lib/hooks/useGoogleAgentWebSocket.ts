/**
 * Hook to communicate with backend Google chat agent via HTTP POST.
 * Replaces the previous WebSocket implementation with stateless HTTP requests.
 * 
 * Session Management:
 * - Sessions have a 1-hour TTL with a sliding window (resets on each request)
 * - Each message sent (sendMessage()) resets the TTL clock
 * - If no activity for 1 hour, the session expires and is deleted from backend
 * - Users who navigate away and return after 1h must start a new session
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { getClientById, getFirebaseAuth } from '@/lib/firebase';

export type WsStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

function makeId() {
  return `m_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function generateChatSessionId() {
  return `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function useGoogleAgentWebSocket(clientId?: string) {
  const { user } = useAuth();
  const [status, setStatus] = useState<WsStatus>('disconnected');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const clientIdRef = useRef(clientId);
  const clientNameRef = useRef('');
  // Session ID persists for the lifetime of this component
  // Each new chat conversation gets a new session ID
  // TTL of 1 hour with sliding window: resets on each POST request
  const chatSessionIdRef = useRef(generateChatSessionId());
  
  // Update ref when clientId changes
  useEffect(() => {
    clientIdRef.current = clientId;
  }, [clientId]);
  
  const backendUrl = useMemo(() => {
    const base = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8080';
    return base.replace(/\/$/, '');
  }, []);

  // Initialize by fetching client name
  useEffect(() => {
    const initializeClient = async () => {
      if (!user || !clientId) {
        setStatus('disconnected');
        return;
      }
      
      try {
        setStatus('connecting');
        const c = await getClientById(user.uid, clientId);
        if (c && typeof c.name === 'string') {
          clientNameRef.current = c.name;
        }
        setStatus('connected');
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to initialize';
        setError(message);
        setStatus('error');
      }
    };

    initializeClient();
  }, [user, clientId]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    if (!user) {
      setError('User not authenticated');
      return;
    }

    const cid = clientIdRef.current;
    if (!cid) {
      setError('No client selected');
      return;
    }

    // Add user message locally immediately
    setMessages((prev) => prev.concat({ id: makeId(), role: 'user', content: text }));
    setIsThinking(true);
    setError(null);

    try {
      // Get Firebase token for authentication
      const auth = getFirebaseAuth();
      const currentUser = auth?.currentUser;
      const token = currentUser ? await currentUser.getIdToken() : null;
      
      // Construct the HTTP endpoint URL
      const url = `${backendUrl}/clients/${cid}/sessions/${chatSessionIdRef.current}/chat`;
      
      // Build request body (flattened, no current_firestore_path)
      const body = {
        text: text,
        technician_name: user.displayName || user.email || 'Utilisateur',
        farmer_name: clientNameRef.current || '',
      };

      // Build headers with auth token
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Make HTTP POST request
      // This request resets the session TTL clock (sliding window)
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      
      // Add assistant response
      // Backend returns { result: "..." } from run_agent method
      if (data.result) {
        setMessages((prev) => prev.concat({ 
          id: makeId(), 
          role: 'assistant', 
          content: data.result 
        }));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);
      console.error('Chat error:', err);
    } finally {
      setIsThinking(false);
    }
  }, [backendUrl, user]);

  const disconnect = useCallback(() => {
    setStatus('disconnected');
    chatSessionIdRef.current = generateChatSessionId(); // Reset for next session
  }, []);

  // Auto-connect when user available and clientId is set
  useEffect(() => {
    if (!user) {
      setStatus('disconnected');
    }
  }, [user]);

  return { messages, sendMessage, status, isThinking, error, connect: () => {}, disconnect } as const;
}


