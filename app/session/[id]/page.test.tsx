import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import SessionDetail from './page';
import { useAuth } from '@/components/auth/AuthProvider';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import * as hooks from '@/lib/hooks';
import * as firebase from '@/lib/firebase';
import { WsStatus } from '@/lib/types';
import * as wsRouter from '@/lib/wsRouter';

// --- MOCKS ---

vi.mock('next/navigation', () => ({
  useParams: vi.fn(),
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));
vi.mock('@/components/auth/AuthProvider');
vi.mock('@/lib/firebase');
vi.mock('@/lib/wsRouter');

let wsHooks: {
  onOpen: () => void;
  onMessage: (data: unknown) => void;
  onClose: (code?: number, reason?: string, wasManual?: boolean) => void;
  onError: (event?: Event) => void;
} | null = null;

let visibilityHooks: {
    pause: () => Promise<void>;
    restore: () => Promise<void>;
    disconnect: () => Promise<void>;
} | null = null;
let mockUseWebSocketReturnValue: { connect: vi.Mock; disconnect: vi.Mock; sendMessage: vi.Mock; status: WsStatus; };

vi.mock('@/lib/hooks', async (importOriginal) => {
    const original = await importOriginal();
    return {
        ...original,
        useLocalStorage: vi.fn(),
        useWebSocket: vi.fn().mockImplementation((_url, onOpen, onMessage, onClose, onError) => {
            wsHooks = { onOpen, onMessage, onClose, onError };
            return mockUseWebSocketReturnValue;
        }),
        useAudioProcessor: vi.fn(),
        useAudioPlayback: vi.fn(),
        useSessionReconnection: vi.fn(),
        useSessionMode: vi.fn(),
        useApiClient: vi.fn(),
        useVisibilityGuard: vi.fn().mockImplementation((_addLog, hooks) => {
            visibilityHooks = hooks;
        }),
        useWakeLock: vi.fn(),
    };
});

vi.mock('@/components/agent/CallScreen', () => ({
    __esModule: true,
    default: ({ onToggleStreaming, onToggleMicHardware, onDisconnect }: any) => (
        <div data-testid="call-screen">
            <button onClick={() => onToggleStreaming(true)} data-testid="toggle-streaming-on-btn" />
            <button onClick={() => onToggleMicHardware(true)} data-testid="toggle-mic-on-btn" />
            <button onClick={() => onDisconnect()} data-testid="disconnect-btn" />
        </div>
    ),
}));

// --- SETUP ---
const useAuthMock = vi.spyOn(hooks, 'useAuth');
const useApiClientMock = vi.spyOn(hooks, 'useApiClient');
const useAudioProcessorMock = vi.spyOn(hooks, 'useAudioProcessor');
const useSessionReconnectionMock = vi.spyOn(hooks, 'useSessionReconnection');
const useSessionModeMock = vi.spyOn(hooks, 'useSessionMode');

const mockGetClientSessionDoc = vi.spyOn(firebase, 'getClientSessionDoc');
const mockRouteWsMessage = vi.spyOn(wsRouter, 'routeWsMessage');

let mockPlayAudioChunk: vi.Mock;

const setupMocks = (initialWsStatus = WsStatus.Disconnected) => {
    wsHooks = null;
    visibilityHooks = null;
    mockPlayAudioChunk = vi.fn();

    vi.mocked(useParams).mockReturnValue({ id: 'test-session-id' });
    vi.mocked(useRouter).mockReturnValue({ replace: vi.fn() } as any);
    vi.mocked(useSearchParams).mockReturnValue({ get: vi.fn().mockReturnValue('test-client-id') } as any);
    vi.mocked(useAuth).mockReturnValue({ user: { uid: 'test-user-id' } } as any);
    vi.mocked(hooks.useLocalStorage).mockReturnValue([
        { scheme: 'wss', host: 'localhost', port: '443', appName: 'app', userId: 'test-client-id', sessionId: 'test-session-id' },
        vi.fn(),
    ]);
    useAudioProcessorMock.mockReturnValue({
        startMic: vi.fn().mockResolvedValue(undefined),
        stopMic: vi.fn(),
        playAudioChunk: mockPlayAudioChunk,
        clearPlaybackQueue: vi.fn(),
        setStreamingEnabled: vi.fn(),
        onMicData: vi.fn(),
    } as any);
    vi.mocked(hooks.useAudioPlayback).mockReturnValue({
        playConnectedSound: vi.fn(),
        startToolCall: vi.fn(),
        endToolCall: vi.fn(),
        isToolCallActive: vi.fn().mockReturnValue(false),
        keepModelAudioAlive: vi.fn(),
        cleanup: vi.fn(),
    });
    useSessionReconnectionMock.mockReturnValue({
        manualConnect: vi.fn().mockResolvedValue(undefined),
        manualDisconnect: vi.fn(),
        handleConnectionClose: vi.fn(),
        handleSessionResumed: vi.fn(),
        isReconnecting: false,
    });
    useSessionModeMock.mockReturnValue({
        resetToIdle: vi.fn(),
        setDisconnected: vi.fn(),
        startResponding: vi.fn(),
        startThinking: vi.fn(),
        stopThinking: vi.fn(),
    });
    mockUseWebSocketReturnValue = {
        connect: vi.fn(),
        disconnect: vi.fn(),
        sendMessage: vi.fn(),
        status: initialWsStatus,
    };

    vi.stubGlobal('process', {
        ...global.process,
        env: { ...global.process.env, NEXT_PUBLIC_BACKEND_BASE_URL: 'https://test-backend.com' },
    });
};

// --- TESTS ---

describe('SessionDetail Page', () => {
    beforeEach(() => {
        setupMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.unstubAllGlobals();
    });

    it('shows loading indicator while fetching report', async () => {
        const getSessionMock = vi.fn().mockReturnValue(new Promise(() => {})); // Never resolves
        useApiClientMock.mockReturnValue({ getSession: getSessionMock } as any);
        mockGetClientSessionDoc.mockResolvedValue(null);

        render(<SessionDetail />);

        await waitFor(() => {
          expect(screen.getByText('Chargement…')).toBeInTheDocument();
        });
    });

    it('handles audio_buffer when streaming is on', async () => {
        mockGetClientSessionDoc.mockResolvedValue(null);
        useApiClientMock.mockReturnValue({ getSession: vi.fn().mockResolvedValue(null) } as any);

        render(<SessionDetail />);

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /démarrer l’appel/i }));
        });

        await screen.findByTestId('call-screen');

        await act(async () => {
            mockUseWebSocketReturnValue.status = WsStatus.Connected;
            wsHooks!.onOpen();
            wsHooks!.onMessage({ event: 'ready' });
            const handlers = mockRouteWsMessage.mock.calls[0][1];
            handlers.ready();
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('toggle-mic-on-btn'));
            fireEvent.click(screen.getByTestId('toggle-streaming-on-btn'));
        });

        const message = { event: 'audio_buffer', frames: [{ mime_type: 'audio/pcm', data: '...data...' }] };
        await act(async () => {
            wsHooks!.onMessage(message);
        });

        const handlers = mockRouteWsMessage.mock.calls[1][1];
        handlers.audio_buffer(message.frames);
        expect(mockPlayAudioChunk).toHaveBeenCalledWith('...data...');
    });

    it('handles WebSocket error', async () => {
      render(<SessionDetail />);
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /démarrer l’appel/i }));
      });
      const errorEvent = new Event('error');
      await act(async () => {
        wsHooks!.onError(errorEvent);
      });
      // Not much to assert here other than that the app doesn't crash.
      // A real implementation would likely involve some UI feedback.
    });

    it('handles reconnection logic on WebSocket close', async () => {
      render(<SessionDetail />);
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /démarrer l’appel/i }));
      });
      await act(async () => {
        wsHooks!.onClose(1006, 'abnormal closure', false);
      });
      expect(useSessionReconnectionMock().handleConnectionClose).toHaveBeenCalledWith(1006, 'abnormal closure', false);
    });

    it('handles different session modes', async () => {
      render(<SessionDetail />);
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /démarrer l’appel/i }));
      });
      await act(async () => {
        mockUseWebSocketReturnValue.status = WsStatus.Connected;
        wsHooks!.onOpen();
        wsHooks!.onMessage({ event: 'function_call' });
      });
      const handlers = mockRouteWsMessage.mock.calls[0][1];
      handlers.function_call();
      expect(useSessionModeMock().startThinking).toHaveBeenCalled();
    });
});
