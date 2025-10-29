'use client';

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent } from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputBody,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from '@/components/ai-elements/prompt-input';
import {
  Actions,
  Action,
} from '@/components/ai-elements/actions';
import { Fragment, useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CopyIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArrowLeftSolid, CheckCircleSolid, XCircleSolid } from '@mynaui/icons-react';
import { Loader } from '@/components/ai-elements/loader';
import { useGoogleAuth } from '@/lib/hooks/useGoogleAuth';
import { useGoogleAgentWebSocket } from '@/lib/hooks/useGoogleAgentWebSocket';

const GoogleAssistantChat = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams?.get('clientId') || '';
  const oauthSuccess = searchParams?.get('oauth_success');
  const oauthError = searchParams?.get('oauth_error');
  const [input, setInput] = useState('');
  const [showOAuthMessage, setShowOAuthMessage] = useState(!!oauthSuccess || !!oauthError);
  const { status: authStatus, loading: authLoading, checkStatus } = useGoogleAuth();
  const isAuthorized = !!authStatus?.is_connected;
  const { messages, sendMessage, status, isThinking, error, disconnect } = useGoogleAgentWebSocket(clientId);

  // Handle OAuth callback results
  useEffect(() => {
    if (oauthSuccess === 'true') {
      // Refresh auth status after successful OAuth
      checkStatus();
      // Clear message after 3 seconds
      setTimeout(() => {
        setShowOAuthMessage(false);
        // Remove query params
        router.replace('/assistant/google' + (clientId ? `?clientId=${clientId}` : ''));
      }, 3000);
    } else if (oauthError) {
      // Keep error visible for 5 seconds
      setTimeout(() => {
        setShowOAuthMessage(false);
        router.replace('/assistant/google' + (clientId ? `?clientId=${clientId}` : ''));
      }, 5000);
    }
  }, [oauthSuccess, oauthError, checkStatus, router, clientId]);

  // Redirect to authorization page if not authorized
  useEffect(() => {
    if (!authLoading && !isAuthorized && !showOAuthMessage) {
      router.push('/assistant/google/authorize');
    }
  }, [authLoading, isAuthorized, router, showOAuthMessage]);

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);

    if (!hasText) {
      return;
    }

    sendMessage(message.text || '');
    setInput('');
  };

  const handleBack = () => {
    // Disconnect WebSocket before leaving
    disconnect();
    // Go back to previous page (sessions list with client selected)
    router.back();
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-muted-foreground">Vérification des autorisations...</p>
        </div>
      </div>
    );
  }

  // Don't render chat if not authorized (will redirect)
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="h-[calc(100vh-3rem)] md:h-[calc(100vh-3.5rem)] w-full flex flex-col">
      {/* OAuth Message Alert */}
      {showOAuthMessage && (
        <div className="flex-shrink-0 border-b">
          <div className="max-w-4xl mx-auto px-4 py-3">
            {oauthSuccess === 'true' && (
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircleSolid className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <p className="text-sm text-green-700 dark:text-green-300">
                  ✓ Google authorization successful! Redirecting...
                </p>
              </div>
            )}
            {oauthError && (
              <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <XCircleSolid className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  ✗ Authorization failed: {oauthError}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Header avec bouton retour */}
      <div className="flex-shrink-0 border-b bg-background">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="gap-2"
          >
            <ArrowLeftSolid className="h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-lg font-semibold">Advisor</h1>
          <div className="w-20"></div> {/* Spacer pour centrer le titre */}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Conversation className="h-full">
          <ConversationContent className="max-w-4xl mx-auto w-full px-4">
            {/* Connection status */}
            {status === 'connecting' && (
              <div className="text-center text-sm text-muted-foreground py-4">
                Connexion à l&apos;assistant...
              </div>
            )}
            {status === 'error' && (
              <div className="text-center text-sm text-destructive py-4">
                Erreur de connexion. {error || 'Reconnexion en cours...'}
              </div>
            )}

            {/* Messages */}
            {messages.map((message) => (
              <Fragment key={message.id}>
                <Message from={message.role}>
                  <MessageContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div className="whitespace-pre-wrap break-words">
                        {message.content}
                      </div>
                    </div>
                  </MessageContent>
                </Message>
                {message.role === 'assistant' && (
                  <Actions className="mt-2">
                    <Action
                      onClick={() => navigator.clipboard.writeText(message.content)}
                      label="Copy"
                    >
                      <CopyIcon className="size-3" />
                    </Action>
                  </Actions>
                )}
              </Fragment>
            ))}

            {/* Thinking indicator */}
            {isThinking && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>

      <div className="flex-shrink-0 max-w-4xl mx-auto w-full p-4">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputBody>
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
              placeholder="Tapez votre message..."
            />
          </PromptInputBody>
          <PromptInputToolbar>
            <div></div>
            <PromptInputSubmit
              disabled={!input.trim() || status !== 'connected' || isThinking}
              status={isThinking ? 'streaming' : 'ready'}
            />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
};

const GoogleAssistantPage = () => {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    }>
      <GoogleAssistantChat />
    </Suspense>
  );
};

export default GoogleAssistantPage;
