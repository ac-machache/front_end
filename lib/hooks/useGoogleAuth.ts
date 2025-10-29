/**
 * Hook for managing Google OAuth status (Calendar & Gmail)
 */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { getFirebaseAuth } from '@/lib/firebase';

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
  initiateAuth: () => Promise<void>;
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

      // Get Firebase token
      const auth = getFirebaseAuth();
      const currentUser = auth?.currentUser;
      const token = currentUser ? await currentUser.getIdToken() : null;

      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `${backendUrl}/auth/google/status`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
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
  const initiateAuth = useCallback(async () => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    try {
      setError(null);

      // Get Firebase token
      const auth = getFirebaseAuth();
      const currentUser = auth?.currentUser;
      const token = currentUser ? await currentUser.getIdToken() : null;

      if (!token) {
        throw new Error('Not authenticated');
      }

      // Store current URL to redirect back after auth
      sessionStorage.setItem('google_auth_return_url', window.location.pathname);

      // Request authorization URL from backend
      const response = await fetch(
        `${backendUrl}/auth/google/authorize`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to initiate OAuth');
      }

      const data = await response.json();
      const authorizationUrl = data.authorization_url;

      if (!authorizationUrl) {
        throw new Error('No authorization URL received from backend');
      }

      // Redirect to Google OAuth consent screen
      window.location.href = authorizationUrl;
    } catch (err) {
      console.error('Error initiating OAuth:', err);
      setError(err instanceof Error ? err.message : 'Failed to initiate authorization');
    }
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

      // Get Firebase token
      const auth = getFirebaseAuth();
      const currentUser = auth?.currentUser;
      const token = currentUser ? await currentUser.getIdToken() : null;

      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `${backendUrl}/auth/google/disconnect`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
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

