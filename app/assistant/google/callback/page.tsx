'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader } from '@/components/ai-elements/loader';
import { CheckCircleSolid, XCircleSolid } from '@mynaui/icons-react';

function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Finalisation de l\'autorisation...');

  useEffect(() => {
    const error = searchParams.get('error');
    const success = searchParams.get('success');

    if (error) {
      setStatus('error');
      setMessage(`Erreur : ${error}`);
      
      // Redirect to authorize page after 3 seconds
      setTimeout(() => {
        router.push('/assistant/google/authorize');
      }, 3000);
    } else if (success === 'true') {
      setStatus('success');
      setMessage('Autorisation réussie ! Redirection...');
      
      // Get return URL from session storage or default to home page
      const returnUrl = sessionStorage.getItem('google_auth_return_url') || '/workspace';
      sessionStorage.removeItem('google_auth_return_url');
      
      // Redirect to home page after 1 second
      setTimeout(() => {
        router.push(returnUrl);
      }, 1000);
    } else {
      setStatus('error');
      setMessage('État inconnu. Redirection...');
      
      setTimeout(() => {
        router.push('/assistant/google/authorize');
      }, 2000);
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        {status === 'loading' && (
          <>
            <Loader />
            <p className="text-muted-foreground">{message}</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircleSolid className="h-16 w-16 text-green-500 mx-auto" />
            <p className="text-lg font-semibold text-green-600 dark:text-green-400">
              {message}
            </p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <XCircleSolid className="h-16 w-16 text-destructive mx-auto" />
            <p className="text-lg font-semibold text-destructive">
              {message}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const GoogleCallbackPageWrapper = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    }>
      <GoogleCallbackPage />
    </Suspense>
  );
};

export default GoogleCallbackPageWrapper;

