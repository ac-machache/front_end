"use client";
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import AIVoice from '@/components/kokonutui/ai-voice';
// removed Loader2-based status row in events panel
import AITextLoading from '@/components/kokonutui/ai-text-loading';
import type { Config } from '@/lib/types';
import { WsStatus } from '@/lib/types';
import { useLocalStorage, useWebSocket, useAudioProcessor } from '@/lib/hooks';
import { buildWsUrl } from '@/lib/utils';

export default function SessionDetail() {
  const params = useParams<{ id: string }>();
  const [config, setConfig] = useLocalStorage<Config>('app-config', { scheme: 'wss', host: 'localhost', port: '443', appName: 'app', userId: 'user', sessionId: '' });
  const [isMicOn, setIsMicOn] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // Ensure sessionId matches URL
  React.useEffect(() => {
    const id = params?.id as string;
    if (id && config.sessionId !== id) setConfig(prev => ({ ...prev, sessionId: id }));
  }, [params?.id, config.sessionId, setConfig]);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  const wsUrl = useMemo(() => buildWsUrl(config), [config]);

  const onWsOpen = useCallback(() => console.log('WebSocket connected.'), []);

  // Bridge sendMessage to audio hook without TDZ issues
  const sendMessageRef = useRef<(data: unknown) => void>(() => {});
  const onMicData = useCallback((base64: string) => {
    sendMessageRef.current({ mime_type: 'audio/pcm', data: base64 });
  }, []);
  const { startMic, stopMic, playAudioChunk, clearPlaybackQueue, setStreamingEnabled } = useAudioProcessor(onMicData, () => {});
  const [toolLabel, setToolLabel] = useState<string>('');
  type Mode = 'idle' | 'listening' | 'speaking' | 'thinking';
  const [mode, setMode] = useState<Mode>('idle');
  const speakTimerRef = useRef<number | null>(null);

  const onWsMessage = useCallback((data: Record<string, unknown>) => {
    if (data?.event) {
      const name: string = (data?.name || '') as string;
      const lower = name.toLowerCase();
      const labelFor = (toolLower: string, original: string) => {
        if (toolLower.includes('topicclarifier')) return 'Réflexion en cours…';
        if (toolLower.includes('resport') || toolLower.includes('reportsynth') || toolLower.includes('report')) return 'Génération du rapport…';
        if (toolLower.includes('memorymanager')) return 'Mise à jour de la mémoire…';
        if (toolLower.includes('search_memories')) return 'Recherche en mémoire…';
        return `Appel d’outil: ${original || 'inconnu'}`;
      };
      if (data.event === 'function_call') {
        const label = labelFor(lower, name);
        setToolLabel(label);
        setMode('thinking');
      } else if (data.event === 'function_response') {
        setToolLabel('');
        if (speakTimerRef.current) {
          setMode('speaking');
          window.clearTimeout(speakTimerRef.current);
          speakTimerRef.current = window.setTimeout(() => setMode(isMicOn ? 'listening' : 'idle'), 800);
        } else {
          setMode(isMicOn ? 'listening' : 'idle');
        }
      }
      console.log('Event:', data.event, data.name || data.data);
      return;
    }
    if (data?.turn_complete !== undefined || data?.interrupted !== undefined) {
      console.log('Turn Control:', data);
      if (data?.interrupted) {
        clearPlaybackQueue();
      }
      setToolLabel('');
      if (speakTimerRef.current) {
        setMode('speaking');
        window.clearTimeout(speakTimerRef.current);
        speakTimerRef.current = window.setTimeout(() => setMode(isMicOn ? 'listening' : 'idle'), 800);
      } else {
        setMode(isMicOn ? 'listening' : 'idle');
      }
      return;
    }
    if (data?.mime_type && data?.data) {
      if (data.mime_type.startsWith('audio/')) {
        playAudioChunk(data.data);
        setMode('speaking');
        if (speakTimerRef.current) window.clearTimeout(speakTimerRef.current);
        speakTimerRef.current = window.setTimeout(() => setMode(isMicOn ? 'listening' : 'idle'), 1200);
        return;
      }
    }
  }, [playAudioChunk, clearPlaybackQueue, isMicOn]);

  const onWsClose = useCallback((code?: number, reason?: string) => {
    console.log('WebSocket disconnected', { code, reason });
    stopMic();
    setStreamingEnabled(false);
    setIsMicOn(false);
    setMode('idle');
  }, [stopMic, setStreamingEnabled]);

  const onWsError = useCallback((event?: Event) => console.error('WebSocket error', event), []);
  const { connect, disconnect, sendMessage, status: wsStatus } = useWebSocket(wsUrl, onWsOpen, onWsMessage, onWsClose, onWsError);

  React.useEffect(() => {
    sendMessageRef.current = (data: unknown) => sendMessage(data);
  }, [sendMessage]);

  // Manual connect only via UI controls to avoid auto-reconnect behavior
  React.useEffect(() => {
    setMode(isMicOn ? 'listening' : 'idle');
  }, [isMicOn]);

  // Reset local loading flags on status changes
  React.useEffect(() => {
    if (wsStatus !== WsStatus.Connecting) setIsConnecting(false);
    if (wsStatus === WsStatus.Disconnected) setIsDisconnecting(false);
  }, [wsStatus]);

  return (
    <div className="container flex flex-col h-screen max-w-6xl p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Événements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex-1 overflow-auto bg-background border rounded-md p-4 min-h-[200px]">
                <AITextLoading
                  texts={
                    mode === 'thinking'
                      ? [toolLabel || 'Réflexion en cours…']
                      : mode === 'speaking'
                        ? ['Synthèse de parole…']
                        : mode === 'listening'
                          ? ['À l’écoute']
                          : ['En attente']
                  }
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Micro</CardTitle>
            </CardHeader>
            <CardContent>
              <AIVoice
                active={isMicOn}
                onToggle={(_next) => {
                  if (_next) {
                    setStreamingEnabled(true);
                    setIsMicOn(true);
                    setMode('listening');
                  } else {
                    setStreamingEnabled(false);
                    setIsMicOn(false);
                    setMode('idle');
                  }
                }}
              />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Connexion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={async () => {
                    setIsConnecting(true);
                    try {
                      await startMic();
                      connect();
                    } catch {
                      setIsConnecting(false);
                    }
                  }}
                  className="w-full"
                  variant={(wsStatus === WsStatus.Connected || wsStatus === WsStatus.Connecting) ? 'secondary' : 'default'}
                  disabled={wsStatus === WsStatus.Connected || wsStatus === WsStatus.Connecting || isConnecting}
                >
                  {(isConnecting || wsStatus === WsStatus.Connecting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {(isConnecting || wsStatus === WsStatus.Connecting) ? 'Connexion…' : 'Connecter'}
                </Button>
                <Button
                  onClick={() => {
                    setIsDisconnecting(true);
                    disconnect();
                    stopMic();
                    setStreamingEnabled(false);
                    setIsMicOn(false);
                    setMode('idle');
                  }}
                  className="w-full"
                  variant={wsStatus === WsStatus.Connected ? 'default' : 'secondary'}
                  disabled={wsStatus !== WsStatus.Connected || isDisconnecting}
                >
                  {isDisconnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isDisconnecting ? 'Déconnexion…' : 'Déconnecter'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

