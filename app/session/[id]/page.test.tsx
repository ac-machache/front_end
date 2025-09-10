import { describe, test, expect, vi, beforeEach, beforeAll } from 'vitest';
import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Hoisted shared mocks/state so module factory can use them
const {
  routerReplaceMock,
  connectMock,
  disconnectMock,
  sendMessageMock,
  startMicMock,
  stopMicMock,
  playAudioChunkMock,
  clearPlaybackQueueMock,
  setStreamingEnabledMock,
  wsStatusRef,
  wsCbs,
} = vi.hoisted(() => ({
  routerReplaceMock: vi.fn(),
  connectMock: vi.fn(),
  disconnectMock: vi.fn(),
  sendMessageMock: vi.fn(),
  startMicMock: vi.fn(async () => {}),
  stopMicMock: vi.fn(),
  playAudioChunkMock: vi.fn(),
  clearPlaybackQueueMock: vi.fn(),
  setStreamingEnabledMock: vi.fn(),
  wsStatusRef: { value: 'Disconnected' as string },
  wsCbs: { onOpen: undefined as undefined | (() => void), onMessage: undefined as undefined | ((d: unknown) => void), onClose: undefined as undefined | ((code?: number, reason?: string) => void), onError: undefined as undefined | ((e?: Event) => void) },
}));

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: 's1' }),
  useRouter: () => ({ replace: routerReplaceMock }),
  useSearchParams: () => ({ get: (k: string) => (k === 'clientId' ? 'c1' : null) }),
}));

vi.mock('@/components/auth/AuthProvider', () => ({
  useAuth: () => ({ user: { uid: 'u1', displayName: 'Tech C', email: 'tc@example.com' }, loading: false }),
}));

vi.mock('@/lib/hooks', async () => {
  const actual = await vi.importActual<typeof import('@/lib/hooks')>('@/lib/hooks');
  return {
    ...actual,
    useWebSocket: (_url: string, onOpen: () => void, onMessage: (d: unknown) => void, onClose: (c?: number, r?: string) => void, onError: (e?: Event) => void) => {
      wsCbs.onOpen = onOpen;
      wsCbs.onMessage = onMessage;
      wsCbs.onClose = onClose;
      wsCbs.onError = onError;
      return { connect: connectMock, disconnect: disconnectMock, sendMessage: sendMessageMock, status: wsStatusRef.value as 'Disconnected' | 'Connecting' | 'Connected' | 'Error' };
    },
    useAudioProcessor: (_onMicData: (b64: string, mime?: string) => void) => ({
      startMic: startMicMock,
      stopMic: stopMicMock,
      playAudioChunk: playAudioChunkMock,
      clearPlaybackQueue: clearPlaybackQueueMock,
      setStreamingEnabled: setStreamingEnabledMock,
    }),
  };
});

import SessionDetail from './page';

describe('SessionDetail page', () => {
  beforeAll(() => {
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL = 'http://localhost:8080';
  });
  beforeEach(() => {
    routerReplaceMock.mockReset();
    connectMock.mockReset();
    disconnectMock.mockReset();
    sendMessageMock.mockReset();
    startMicMock.mockReset();
    stopMicMock.mockReset();
    playAudioChunkMock.mockReset();
    clearPlaybackQueueMock.mockReset();
    setStreamingEnabledMock.mockReset();
    wsStatusRef.value = 'Disconnected';
    wsCbs.onOpen = undefined;
    wsCbs.onMessage = undefined;
    wsCbs.onClose = undefined;
    wsCbs.onError = undefined;
  });

  test('Connect button starts mic then connects', async () => {
    render(<SessionDetail />);
    const connectBtn = await screen.findByRole('button', { name: /^Connecter$/i });
    await userEvent.click(connectBtn);
    await waitFor(() => expect(startMicMock).toHaveBeenCalled());
    await waitFor(() => expect(connectMock).toHaveBeenCalled());
  });

  test('onClose cleans up mic and streaming', async () => {
    render(<SessionDetail />);
    // simulate ws close
    await act(async () => { wsCbs.onClose?.(1000, 'bye'); });
    expect(stopMicMock).toHaveBeenCalled();
    expect(setStreamingEnabledMock).toHaveBeenCalledWith(false);
  });

  test('audio frame plays via audio processor', async () => {
    render(<SessionDetail />);
    await act(async () => { wsCbs.onMessage?.({ mime_type: 'audio/pcm', data: 'AAAA' }); });
    expect(playAudioChunkMock).toHaveBeenCalledWith('AAAA');
  });

  test('non-report tool call pauses and resumes upstream', async () => {
    render(<SessionDetail />);
    await act(async () => { wsCbs.onMessage?.({ event: 'function_call', name: 'otherTool' }); });
    expect(setStreamingEnabledMock).toHaveBeenCalledWith(false);
    await act(async () => { wsCbs.onMessage?.({ event: 'function_response', name: 'otherTool' }); });
    // Since it is not a report tool, it should resume streaming
    expect(setStreamingEnabledMock).toHaveBeenCalledWith(true);
  });

  test('report tool completion disconnects and navigates back to list', async () => {
    render(<SessionDetail />);
    // Start report tool
    await act(async () => { wsCbs.onMessage?.({ event: 'function_call', name: 'generateReport' }); });
    expect(setStreamingEnabledMock).toHaveBeenCalledWith(false);
    // When turn completes, should disconnect, stop mic and navigate back
    await act(async () => { wsCbs.onMessage?.({ turn_complete: true }); });
    expect(disconnectMock).toHaveBeenCalled();
    expect(stopMicMock).toHaveBeenCalled();
    expect(setStreamingEnabledMock).toHaveBeenCalledWith(false);
    expect(routerReplaceMock).toHaveBeenCalledWith('/session?clientId=c1');
  });
});


