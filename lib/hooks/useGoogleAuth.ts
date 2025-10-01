/**
 * Hook for managing Google OAuth status (Calendar & Gmail)
 */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';

interface GoogleAuthStatus {
  is_connected: boolean;
  has_calendar: boolean;
  has_gmail: boolean;
  email?: string;
}

interface UseGoogleAuthResult {
  status: GoogleAuthStatus | null;
  loading: boolean;
  error: string | null;
  checkStatus: () => Promise<void>;
  initiateAuth: () => void;
  disconnect: () => Promise<void>;
}

export function useGoogleAuth(): UseGoogleAuthResult {
  const { user } = useAuth();
  const [status, setStatus] = useState<GoogleAuthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

  // Check OAuth status
  const checkStatus = useCallback(async () => {
    if (!user) {
      setStatus(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${backendUrl}/auth/google/status?user_id=${user.uid}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to check OAuth status');
      }

      const data = await response.json();

      // Normalize backend shapes: support {connected, scopes} and {is_connected, has_*}
      const isConnected: boolean = (data.is_connected ?? data.connected) ?? false;
      const scopes: string[] = Array.isArray(data.scopes) ? data.scopes : [];
      const hasCalendar: boolean = (data.has_calendar ?? scopes.some((s: string) => s.includes('calendar')) ) ?? false;
      const hasGmail: boolean = (data.has_gmail ?? scopes.some((s: string) => s.includes('gmail')) ) ?? false;

      setStatus({
        is_connected: isConnected,
        has_calendar: hasCalendar,
        has_gmail: hasGmail,
        email: data.email,
      });
    } catch (err) {
      console.error('Error checking Google auth status:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, [user, backendUrl]);

  // Initiate OAuth flow
  const initiateAuth = useCallback(() => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    // Store current URL to redirect back after auth
    sessionStorage.setItem('google_auth_return_url', window.location.pathname);

    // Redirect to backend OAuth endpoint
    const authUrl = `${backendUrl}/auth/google/authorize?user_id=${user.uid}`;
    window.location.href = authUrl;
  }, [user, backendUrl]);

  // Disconnect Google account
  const disconnect = useCallback(async () => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${backendUrl}/auth/google/disconnect`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: user.uid }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to disconnect Google account');
      }

      setStatus(null);
      await checkStatus();
    } catch (err) {
      console.error('Error disconnecting Google account:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [user, backendUrl, checkStatus]);

  // Check status on mount and when user changes
  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  return {
    status,
    loading,
    error,
    checkStatus,
    initiateAuth,
    disconnect,
  };
}

