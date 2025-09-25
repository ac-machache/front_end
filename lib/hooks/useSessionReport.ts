"use client";
import React, { useState } from 'react';
import type { SessionDetails } from '../types';
import { useApiClient } from './useApiClient';
import { getClientSessionDoc } from '../firebase';

export function useSessionReport(sessionId: string, clientId: string, user: { uid: string } | null) {
  const [reportDetails, setReportDetails] = useState<SessionDetails | null>(null);
  const [reportLoading, setReportLoading] = useState(false);

  const apiClient = useApiClient({
    scheme: (typeof window !== 'undefined' && window.location.protocol === 'https:') ? 'wss' : 'ws',
    host: 'env',
    port: '0',
    appName: 'app',
    userId: clientId || 'user',
    sessionId: ''
  }, () => {}); // Simplified logging

  React.useEffect(() => {
    if (!sessionId || !clientId) {
      setReportDetails(null);
      return;
    }

    setReportLoading(true);
    (async () => {
      try {
        // Prefer Firestore ReportKey if present (requires user.uid)
        if (user?.uid) {
          const fsDoc = await getClientSessionDoc(user.uid, clientId, sessionId);
          const reportKey = fsDoc?.ReportKey;
          if (reportKey) {
            setReportDetails({ id: sessionId, state: { RapportDeSortie: reportKey } });
            return;
          }
        }
        // Fallback to backend
        const result = await apiClient.getSession(sessionId);
        if(result.ok) {
            setReportDetails(result.value);
        }

      } finally {
        setReportLoading(false);
      }
    })().catch(() => setReportLoading(false));
  }, [sessionId, clientId, user?.uid, apiClient]);

  return { reportDetails, reportLoading };
}