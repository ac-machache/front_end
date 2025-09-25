import { describe, test, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SessionDetail from './page';
import * as AuthProvider from '@/components/auth/AuthProvider';
import * as nav from 'next/navigation';
import * as hooks from '@/lib/hooks';
import { WsStatus } from '@/lib/types';
import { NextRouter } from 'next/router';

// Mock individual hooks
vi.mock('@/lib/hooks/useLocalStorage');
vi.mock('@/lib/hooks/useSessionReport');
vi.mock('@/lib/hooks/useApiClient');
vi.mock('@/lib/hooks/useWebSocket');
vi.mock('@/lib/hooks/useAudio');
vi.mock('@/lib/hooks/useSessionMode');
vi.mock('@/lib/hooks/useVisibilityGuard');
vi.mock('@/lib/hooks/useWakeLock');
vi.mock('@/lib/hooks/useUiState');
vi.mock('next/navigation');
vi.mock('@/components/auth/AuthProvider');
vi.mock('@/lib/firebase');


const mockedUseLocalStorage = vi.mocked(hooks.useLocalStorage);
const mockedUseSessionReport = vi.mocked(hooks.useSessionReport);
const mockedUseApiClient = vi.mocked(hooks.useApiClient);
const mockedUseWebSocket = vi.mocked(hooks.useWebSocket);
const mockedUseAudioProcessor = vi.mocked(hooks.useAudioProcessor);
const mockedUseAudioPlayback = vi.mocked(hooks.useAudioPlayback);
const mockedUseSessionMode = vi.mocked(hooks.useSessionMode);
const mockedUseVisibilityGuard = vi.mocked(hooks.useVisibilityGuard);
const mockedUseWakeLock = vi.mocked(hooks.useWakeLock);
const mockedUseUiState = vi.mocked(hooks.useUiState);
const mockedUseRouter = vi.mocked(nav.useRouter);
const mockedUseParams = vi.mocked(nav.useParams);
const mockedUseSearchParams = vi.mocked(nav.useSearchParams);
const mockedUseAuth = vi.mocked(AuthProvider.useAuth);


describe('SessionDetail', () => {
    const mockDispatch = vi.fn();
    const pushMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseRouter.mockReturnValue({ replace: vi.fn(), push: pushMock } as unknown as NextRouter);
    mockedUseParams.mockReturnValue({ id: 's1' });
    mockedUseSearchParams.mockReturnValue({ get: () => 'c1' } as unknown as URLSearchParams);
    mockedUseAuth.mockReturnValue({ user: { uid: 'u1' }, loading: false });
    mockedUseLocalStorage.mockImplementation((key, initialValue) => [initialValue, vi.fn()]);
    mockedUseApiClient.mockReturnValue({
        getSession: vi.fn().mockResolvedValue({ id: 's1', state: {} }),
    } as unknown as ReturnType<typeof hooks.useApiClient>);
    mockedUseWebSocket.mockReturnValue({
      connect: vi.fn(),
      disconnect: vi.fn(),
      sendMessage: vi.fn(),
      status: WsStatus.Disconnected,
    } as unknown as ReturnType<typeof hooks.useWebSocket>);
    mockedUseAudioProcessor.mockReturnValue({
        startMic: vi.fn(),
        stopMic: vi.fn(),
        playAudioChunk: vi.fn(),
        clearPlaybackQueue: vi.fn(),
        setStreamingEnabled: vi.fn(),
    } as unknown as ReturnType<typeof hooks.useAudioProcessor>);
    mockedUseAudioPlayback.mockReturnValue({
        playConnectedSound: vi.fn(),
        keepModelAudioAlive: vi.fn(),
        endModelAudio: vi.fn(),
        startToolCall: vi.fn(),
        endToolCall: vi.fn(),
        isToolCallActive: vi.fn().mockReturnValue(false),
        cleanup: vi.fn(),
    } as unknown as ReturnType<typeof hooks.useAudioPlayback>);
    mockedUseSessionMode.mockReturnValue({
        resetToIdle: vi.fn(),
        startResponding: vi.fn(),
        startThinking: vi.fn(),
        stopThinking: vi.fn(),
        setDisconnected: vi.fn(),
    } as unknown as ReturnType<typeof hooks.useSessionMode>);
    mockedUseUiState.mockReturnValue({
        state: {
            isCallScreen: false,
            isConnecting: false,
            isDisconnecting: false,
            isStreamingOn: false,
            isMicHwOn: false,
            serverReady: false,
            isOnline: true,
            serverAlive: true,
            isThinking: false,
        },
        dispatch: mockDispatch,
    });
    mockedUseVisibilityGuard.mockReturnValue(undefined);
    mockedUseWakeLock.mockReturnValue(undefined);
  });

  test('renders loading state initially', () => {
    mockedUseSessionReport.mockReturnValue({ reportDetails: null, reportLoading: true });
    render(<SessionDetail />);
    expect(screen.getByText('Chargement…')).toBeInTheDocument();
  });

  test('renders "start call" button when no report is available', async () => {
    mockedUseSessionReport.mockReturnValue({ reportDetails: null, reportLoading: false });
    render(<SessionDetail />);
    await screen.findByText(/aucun rapport n’est disponible pour cette session/i);
    expect(screen.getByRole('button', { name: /démarrer l’appel/i })).toBeInTheDocument();
  });

  test('clicking "start call" button shows call screen and connects to websocket', async () => {
    const connectMock = vi.fn();
    mockedUseWebSocket.mockReturnValue({
        connect: connectMock,
        disconnect: vi.fn(),
        sendMessage: vi.fn(),
        status: WsStatus.Disconnected,
    } as unknown as ReturnType<typeof hooks.useWebSocket>);
    mockedUseSessionReport.mockReturnValue({ reportDetails: null, reportLoading: false });
    mockedUseUiState.mockReturnValue({
        state: { isCallScreen: true, isConnecting: false },
        dispatch: mockDispatch,
    });

    render(<SessionDetail />);
    const startCallButton = await screen.findByRole('button', { name: /démarrer l’appel/i });
    await userEvent.click(startCallButton);

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SHOW_CALL_SCREEN' });
  });

  test('displays the report when it is available', async () => {
    const reportDetails = {
        id: 's1',
        state: {
            RapportDeSortie: {
                main_report: {
                    title: 'Test Report',
                },
            },
        },
    };
    mockedUseSessionReport.mockReturnValue({ reportDetails, reportLoading: false });
    render(<SessionDetail />);
    await screen.findByText('Rapport de Visite');
    expect(screen.getByText('Test Report')).toBeInTheDocument();
  });
});