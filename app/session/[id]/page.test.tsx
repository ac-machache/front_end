import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SessionDetail from './page';
import { WsStatus } from '@/lib/types';

// Mocks
const routerReplaceMock = vi.fn();
const connectMock = vi.fn();
const disconnectMock = vi.fn();
const sendMessageMock = vi.fn();
const startMicMock = vi.fn().mockResolvedValue(undefined);
const stopMicMock = vi.fn();
const playAudioChunkMock = vi.fn();
const clearPlaybackQueueMock = vi.fn();
const setStreamingEnabledMock = vi.fn();

const audioPlaybackMock = {
  playConnectedSound: vi.fn(),
  startToolCall: vi.fn(),
  endToolCall: vi.fn(),
  cleanup: vi.fn(),
  isToolCallActive: vi.fn().mockReturnValue(false),
};

const sessionModeMock = {
  resetToIdle: vi.fn(),
  setDisconnected: vi.fn(),
  startThinking: vi.fn(),
  stopThinking: vi.fn(),
  mode: 'idle' as const,
};

const sessionReconnectionMock = {
  isReconnecting: false,
  connectionState: { isResuming: false, hasResumed: false, backendSessionState: undefined } as { isResuming: boolean; hasResumed: boolean; backendSessionState: undefined; },
  reconnectAttempts: 0,
  manualConnect: vi.fn().mockResolvedValue(undefined),
  manualDisconnect: vi.fn(),
  handleConnectionClose: vi.fn(),
  handleConnectionOpen: vi.fn(),
  handleSessionResumed: vi.fn(),
};

const wsStatusRef = { value: WsStatus.Disconnected };
const wsCbs = { onOpen: undefined as unknown as () => void, onMessage: undefined as unknown as (d: unknown) => void, onClose: undefined as unknown as (c?: number, r?: string, m?: boolean) => void, onError: undefined as unknown as (e?: Event) => void };
const configRef = { value: { scheme: 'wss', host: 'localhost', port: '443', appName: 'app', userId: 'user', sessionId: '' } };
const setConfigMock = vi.fn(updater => {
  if (typeof updater === 'function') {
    configRef.value = updater(configRef.value);
  } else {
    configRef.value = updater;
  }
});

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: 's1' }),
  useRouter: () => ({ replace: routerReplaceMock }),
  useSearchParams: () => ({ get: (k: string) => (k === 'clientId' ? 'c1' : null) }),
}));

vi.mock('@/components/auth/AuthProvider', () => ({
  useAuth: () => ({ user: { uid: 'u1' }, loading: false }),
}));

vi.mock('@/lib/hooks', async () => {
  const actual = await vi.importActual<typeof import('@/lib/hooks')>('@/lib/hooks');
  return {
    ...actual,
    useLocalStorage: () => [configRef.value, setConfigMock],
    useWebSocket: (_url: string, onOpen: () => void, onMessage: (d: unknown) => void, onClose: (c?: number, r?: string, m?: boolean) => void, onError: (e?: Event) => void) => {
      wsCbs.onOpen = onOpen;
      wsCbs.onMessage = onMessage;
      wsCbs.onClose = onClose;
      wsCbs.onError = onError;
      return { connect: connectMock, disconnect: disconnectMock, sendMessage: sendMessageMock, status: wsStatusRef.value };
    },
    useAudioProcessor: () => ({
      startMic: startMicMock,
      stopMic: stopMicMock,
      playAudioChunk: playAudioChunkMock,
      clearPlaybackQueue: clearPlaybackQueueMock,
      setStreamingEnabled: setStreamingEnabledMock,
    }),
    useAudioPlayback: () => audioPlaybackMock,
    useSessionMode: () => sessionModeMock,
    useSessionReconnection: () => sessionReconnectionMock,
  };
});

describe('SessionDetail page', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL = 'http://localhost:8080';
    configRef.value = { scheme: 'wss', host: 'localhost', port: '443', appName: 'app', userId: 'c1', sessionId: 's1' };
    wsStatusRef.value = WsStatus.Disconnected;
    sessionReconnectionMock.isReconnecting = false;
    sessionReconnectionMock.connectionState.hasResumed = false;
    sessionReconnectionMock.reconnectAttempts = 0;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders disconnected state initially', () => {
    render(<SessionDetail />);
    expect(screen.getByText('Disconnected')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Connecter/i })).toBeEnabled();
  });

  test('clicking Connect calls manualConnect', async () => {
    render(<SessionDetail />);
    const connectBtn = screen.getByRole('button', { name: /Connecter/i });
    await userEvent.click(connectBtn);
    await waitFor(() => {
      expect(sessionReconnectionMock.manualConnect).toHaveBeenCalled();
    });
  });

  test('clicking Disconnect calls manualDisconnect', async () => {
    wsStatusRef.value = WsStatus.Connected;
    render(<SessionDetail />);
    const disconnectBtn = screen.getByRole('button', { name: /Déconnecter/i });
    await userEvent.click(disconnectBtn);
    await waitFor(() => {
      expect(sessionReconnectionMock.manualDisconnect).toHaveBeenCalled();
    });
  });

  test('handles WebSocket open event', async () => {
    render(<SessionDetail />);
    await act(async () => wsCbs.onOpen());
    expect(sessionModeMock.resetToIdle).toHaveBeenCalled();
  });

  test('handles WebSocket close event', async () => {
    render(<SessionDetail />);
    await act(async () => wsCbs.onClose(1000, 'test', false));
    expect(sessionReconnectionMock.handleConnectionClose).toHaveBeenCalledWith(1000, 'test', false);
  });
  
  test('handles "ready" message', async () => {
    wsStatusRef.value = WsStatus.Connected;
    render(<SessionDetail />);
    await act(async () => wsCbs.onMessage({ event: 'ready' }));
    expect(audioPlaybackMock.playConnectedSound).toHaveBeenCalled();
    await waitFor(() => {
      // The status will change to "Connected" once the server is ready
      expect(screen.getByText('Connected')).toBeInTheDocument();
    });
  });
  
  test('handles heartbeat message by sending a response', async () => {
    render(<SessionDetail />);
    await act(async () => wsCbs.onMessage({ event: 'heartbeat', timestamp: 12345 }));
    expect(sendMessageMock).toHaveBeenCalledWith(expect.objectContaining({
      event: 'heartbeat_response'
    }));
  });

  test('handles function_call and function_response messages', async () => {
    render(<SessionDetail />);
    await act(async () => wsCbs.onMessage({ event: 'function_call' }));
    expect(sessionModeMock.startThinking).toHaveBeenCalled();
    expect(audioPlaybackMock.startToolCall).toHaveBeenCalled();

    await act(async () => wsCbs.onMessage({ event: 'function_response' }));
    expect(sessionModeMock.stopThinking).toHaveBeenCalled();
    expect(audioPlaybackMock.endToolCall).toHaveBeenCalled();
  });

  test('displays reconnecting status correctly', async () => {
    sessionReconnectionMock.isReconnecting = true;
    sessionReconnectionMock.reconnectAttempts = 2;
    render(<SessionDetail />);
    await waitFor(() => {
      expect(screen.getByText(/Connection lost, attempting to resume… \(attempt 3\)/i)).toBeInTheDocument();
    });
  });

  test('displays resumed status correctly', async () => {
    wsStatusRef.value = WsStatus.Connected;
    sessionReconnectionMock.connectionState.hasResumed = true;
    render(<SessionDetail />);
    await waitFor(() => {
      expect(screen.getByText(/Session resumed successfully/i)).toBeInTheDocument();
    });
  });

  test('handles browser going offline', async () => {
    render(<SessionDetail />);
    const offlineEvent = new Event('offline');
    act(() => {
      window.dispatchEvent(offlineEvent);
    });
    await waitFor(() => {
      expect(sessionReconnectionMock.manualDisconnect).toHaveBeenCalled();
      expect(screen.getByText(/Offline: Please check your network connection./i)).toBeInTheDocument();
    });
  });
});


