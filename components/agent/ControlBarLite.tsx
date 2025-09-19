'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { MicrophoneSolid, MicrophoneSlashSolid, TelephoneSlashSolid, EarSolid, EarSlashSolid } from '@mynaui/icons-react';
import { Play } from '@phosphor-icons/react';

type ControlBarLiteProps = {
  isConnected: boolean;
  isConnecting?: boolean;
  isDisconnecting?: boolean;
  // Streaming toggle (ear)
  isStreamingOn: boolean;
  disableStreaming?: boolean;
  // Mic hardware toggle
  isMicHwOn: boolean;
  onToggleMicHardware: (next: boolean) => void | Promise<void>;
  level01?: number; // 0..1 (unused now but kept for API compatibility)
  showStartAudio?: boolean;
  onConnect: () => void | Promise<void>;
  onDisconnect: () => void | Promise<void>;
  onToggleStreaming: (next: boolean) => void | Promise<void>;
  onStartAudio?: () => void | Promise<void>;
};

export default function ControlBarLite(props: ControlBarLiteProps) {
  const {
    isConnected,
    isConnecting,
    isDisconnecting,
    isStreamingOn,
    disableStreaming,
    isMicHwOn,
    onToggleMicHardware,
    showStartAudio,
    onConnect,
    onDisconnect,
    onToggleStreaming,
    onStartAudio,
  } = props;

  const showEndCall = !!isConnected || !!isConnecting; // show End while connecting

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Mic hardware toggle */}
          <Toggle
            variant="primary"
            pressed={isMicHwOn}
            aria-label={isMicHwOn ? 'Désactiver le micro' : 'Activer le micro'}
            onPressedChange={() => onToggleMicHardware(!isMicHwOn)}
            className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-transparent hover:bg-zinc-800 border border-transparent text-white"
          >
            {isMicHwOn ? <MicrophoneSolid /> : <MicrophoneSlashSolid />}
          </Toggle>
          {/* Streaming (ear) toggle */}
          <Toggle
            variant="primary"
            pressed={isStreamingOn}
            disabled={!isConnected || !!disableStreaming}
            aria-label={isStreamingOn ? 'Désactiver l\'écoute' : 'Activer l\'écoute'}
            onPressedChange={() => onToggleStreaming(!isStreamingOn)}
            className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-transparent hover:bg-zinc-800 border border-transparent text-white"
          >
            {isStreamingOn ? <EarSolid /> : <EarSlashSolid />}
          </Toggle>
          {showStartAudio && (
            <Button variant="outline" onClick={() => onStartAudio && onStartAudio()} aria-label="Start Audio" className="h-10 rounded-full">
              <Play weight="bold" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showEndCall ? (
            <Button
              variant="destructive"
              onClick={onDisconnect}
              disabled={!!isDisconnecting}
              aria-label="End Call"
              className="font-mono bg-red-800 hover:bg-red-700 border-red-700 text-white rounded-full h-10 px-4"
            >
              <TelephoneSlashSolid />
              <span className="hidden md:inline">END CALL</span>
              <span className="inline md:hidden">END</span>
            </Button>
          ) : (
            <Button
              onClick={onConnect}
              disabled={!!isConnecting}
              aria-label="Start Call"
              className="bg-zinc-800 hover:bg-zinc-700 border-zinc-700 rounded-full h-10 px-4"
            >
              {isConnecting ? 'Connecting…' : 'Start Call'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}


