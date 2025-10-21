"use client";
import React, { Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ReportDisplay from '@/components/agent/ReportDisplay';
import { useSearchParams } from 'next/navigation';
import { PanelRightOpenSolid } from '@mynaui/icons-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useSessionReport } from '@/lib/hooks';

function ReportPageInner() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientIdParam = searchParams?.get('clientId') || '';
  const { user } = useAuth();

  const { reportDetails, reportLoading } = useSessionReport(params.id!, clientIdParam, user);

  const reportContent = reportDetails?.state?.RapportDeSortie;
  const hasReport = !!reportContent && Object.keys(reportContent as Record<string, unknown>).length > 0;

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center text-sm text-muted-foreground">
        Vous devez être connecté pour consulter ce rapport.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto p-4">
      <div className="flex-shrink-0 flex justify-end items-center mb-4">
        <Button
          className="w-auto md:w-auto gap-2 h-10 px-4 rounded-full shadow-xs"
          variant="default"
          onClick={() => router.replace(clientIdParam ? `/workspace/sessions/list?clientId=${clientIdParam}` : '/workspace/sessions/list')}
        >
          <PanelRightOpenSolid />
          Retour aux interactions
        </Button>
      </div>

      {reportLoading ? (
        <div className="text-sm text-muted-foreground">Chargement du rapport…</div>
      ) : hasReport ? (
        <ReportDisplay reportDetails={reportDetails} reportLoading={reportLoading} />
      ) : (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Aucun rapport n&apos;est disponible pour cette session.
            </p>
            <Button
              onClick={() => router.replace(clientIdParam ? `/workspace/sessions/list?clientId=${clientIdParam}` : '/workspace/sessions/list')}
            >
              Retour à la liste
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center text-sm text-muted-foreground">Chargement…</div>}>
      <ReportPageInner />
    </Suspense>
  );
}

