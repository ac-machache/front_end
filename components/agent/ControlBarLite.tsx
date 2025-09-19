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
      <div className="flex flex-row items-center justify-center gap-4 md:gap-3">
        {/* Mic hardware toggle */}
        <Toggle
          variant="primary"
          size="lg"
          pressed={isMicHwOn}
          aria-label={isMicHwOn ? 'Désactiver le micro' : 'Activer le micro'}
          onPressedChange={() => onToggleMicHardware(!isMicHwOn)}
          className="inline-flex items-center justify-center h-14 w-14 md:h-12 md:w-12 rounded-full bg-transparent hover:bg-zinc-800 border border-transparent text-white"
        >
          {isMicHwOn ? <MicrophoneSolid className="size-7 md:size-6" /> : <MicrophoneSlashSolid className="size-7 md:size-6" />}
        </Toggle>
        {/* Streaming (ear) toggle */}
        <Toggle
          variant="primary"
          size="lg"
          pressed={isStreamingOn}
          disabled={!isConnected || !!disableStreaming}
          aria-label={isStreamingOn ? 'Désactiver l\'écoute' : 'Activer l\'écoute'}
          onPressedChange={() => onToggleStreaming(!isStreamingOn)}
          className="inline-flex items-center justify-center h-14 w-14 md:h-12 md:w-12 rounded-full bg-transparent hover:bg-zinc-800 border border-transparent text-white"
        >
          {isStreamingOn ? <EarSolid className="size-7 md:size-6" /> : <EarSlashSolid className="size-7 md:size-6" />}
        </Toggle>
        {showStartAudio && (
          <Button variant="outline" onClick={() => onStartAudio && onStartAudio()} aria-label="Start Audio" className="h-12 md:h-11 rounded-full px-5">
            <Play weight="bold" />
          </Button>
        )}

        {showEndCall ? (
          <Button
            variant="destructive"
            onClick={onDisconnect}
            disabled={!!isDisconnecting}
            aria-label="End Call"
            className="font-mono bg-red-800 hover:bg-red-700 border-red-700 text-white rounded-full h-14 md:h-12 px-6 md:px-5"
          >
            <TelephoneSlashSolid className="size-6 md:size-5" />
            <span className="hidden md:inline">END CALL</span>
            <span className="inline md:hidden">END</span>
          </Button>
        ) : (
          <Button
            onClick={onConnect}
            disabled={!!isConnecting}
            aria-label="Start Call"
            className="bg-zinc-800 hover:bg-zinc-700 border-zinc-700 rounded-full h-14 md:h-12 px-6 md:px-5"
          >
            {isConnecting ? 'Connecting…' : 'Start Call'}
          </Button>
        )}
      </div>
    </div>
  );
}


