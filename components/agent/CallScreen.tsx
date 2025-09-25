'use client';

import React from 'react';
import ControlBarLite from '@/components/agent/ControlBarLite';

type CallScreenProps = {
  inCall: boolean;
  isConnecting?: boolean;
  isDisconnecting?: boolean;
  // Streaming (ear)
  isStreamingOn: boolean;
  disableStreaming?: boolean;
  level01?: number; // 0..1
  onDisconnect: () => void | Promise<void>;
  onToggleStreaming: (next: boolean) => void | Promise<void>;
  // Mic hardware
  isMicHwOn: boolean;
  onToggleMicHardware: (next: boolean) => void | Promise<void>;
};

export default function CallScreen(props: CallScreenProps) {
  const {
    inCall,
    isConnecting,
    isDisconnecting,
    isStreamingOn,
    disableStreaming,
    level01,
    onDisconnect,
    onToggleStreaming,
    isMicHwOn,
    onToggleMicHardware,
  } = props;

  return (
    <div className="fixed inset-0 z-40 bg-black text-white" data-testid="call-screen">
      <div className="relative h-full w-full">
        {/* Center logo / waveform */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center justify-center gap-3">
            <span className="block h-4 w-4 rounded-full bg-white/90 animate-[pulse_2s_ease-in-out_infinite]" />
            <span className="block h-10 w-6 rounded-full bg-white/90 animate-[pulse_2s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }} />
            <span className="block h-24 w-8 rounded-full bg-white animate-[pulse_2s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }} />
            <span className="block h-10 w-6 rounded-full bg-white/90 animate-[pulse_2s_ease-in-out_infinite]" style={{ animationDelay: '0.6s' }} />
            <span className="block h-4 w-4 rounded-full bg-white/90 animate-[pulse_2s_ease-in-out_infinite]" style={{ animationDelay: '0.8s' }} />
          </div>
        </div>

        {/* Bottom control bar */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-50 px-3 pt-2 pb-3 md:px-12 md:pb-12">
          <div className="mx-auto w-full flex justify-center">
            <div className="pointer-events-auto mx-auto inline-flex items-center justify-center rounded-[31px] border border-white/15 bg-zinc-900/80 p-3 md:p-3.5 backdrop-blur-md">
              <ControlBarLite
                isConnected={inCall}
                isConnecting={isConnecting}
                isDisconnecting={isDisconnecting}
                isStreamingOn={isStreamingOn}
                disableStreaming={disableStreaming}
                level01={level01}
                showStartAudio={false}
                onConnect={() => { /* no-op inside call screen */ }}
                onDisconnect={onDisconnect}
                onToggleStreaming={onToggleStreaming}
                onStartAudio={undefined}
                isMicHwOn={isMicHwOn}
                onToggleMicHardware={onToggleMicHardware}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


