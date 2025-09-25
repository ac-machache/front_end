import { renderHook, act } from '@testing-library/react';
import { useUiState } from './useUiState';
import { WsStatus } from '../types';

describe('useUiState', () => {
  it('should return the initial state', () => {
    const { result } = renderHook(() => useUiState());
    expect(result.current.state).toEqual({
      isMicOn: false,
      isMuted: false,
      isThinking: false,
      isSpeaking: false,
      isWaitingForAgent: false,
      isCallScreen: false,
      isConnecting: false,
      isDisconnecting: false,
      isReconnecting: false,
      isResuming: false,
      hasResumed: false,
      isMicHwOn: false,
      isOnline: true,
      serverAlive: true,
      wsConnected: false,
      reconnectAttempts: 0,
      reportDetails: null,
      hasReport: false,
    });
  });

  it('should handle SHOW_CALL_SCREEN action', () => {
    const { result } = renderHook(() => useUiState());
    act(() => {
      result.current.dispatch({ type: 'SHOW_CALL_SCREEN' });
    });
    expect(result.current.state.isCallScreen).toBe(true);
    expect(result.current.state.isConnecting).toBe(true);
  });

  it('should handle RESET_CALL_STATE action', () => {
    const { result } = renderHook(() => useUiState());
    act(() => {
      result.current.dispatch({ type: 'SHOW_CALL_SCREEN' });
      result.current.dispatch({ type: 'RESET_CALL_STATE' });
    });
    expect(result.current.state).toEqual({
        isMicOn: false,
        isMuted: false,
        isThinking: false,
        isSpeaking: false,
        isWaitingForAgent: false,
        isCallScreen: false,
        isConnecting: false,
        isDisconnecting: false,
        isReconnecting: false,
        isResuming: false,
        hasResumed: false,
        isMicHwOn: false,
        isOnline: true,
        serverAlive: true,
        wsConnected: false,
        reconnectAttempts: 0,
        reportDetails: null,
        hasReport: false,
    });
  });

  it('should handle SET_SERVER_READY action', () => {
    const { result } = renderHook(() => useUiState());
    act(() => {
      result.current.dispatch({ type: 'SET_SERVER_READY', payload: true });
    });
    expect(result.current.state.serverReady).toBe(true);
    expect(result.current.state.isConnecting).toBe(false);
  });

  it('should handle SET_LISTENING action', () => {
    const { result } = renderHook(() => useUiState());
    act(() => {
      result.current.dispatch({ type: 'SET_LISTENING', payload: true });
    });
    expect(result.current.state.isListening).toBe(true);
  });

  it('should handle SET_TOOL_CALL_ACTIVE action', () => {
    const { result } = renderHook(() => useUiState());
    act(() => {
      result.current.dispatch({ type: 'SET_TOOL_CALL_ACTIVE', payload: true });
    });
    expect(result.current.state.isThinking).toBe(true);
  });

  it('should handle SET_WS_CONNECTION_STATUS action', () => {
    const { result } = renderHook(() => useUiState());
    act(() => {
      result.current.dispatch({ type: 'SET_WS_CONNECTION_STATUS', payload: WsStatus.Connected });
    });
    expect(result.current.state.wsConnected).toBe(true);
  });

  it('should handle SET_MIC_HW_ON action', () => {
    const { result } = renderHook(() => useUiState());
    act(() => {
      result.current.dispatch({ type: 'SET_MIC_HW_ON', payload: true });
    });
    expect(result.current.state.isMicHwOn).toBe(true);
  });

  it('should handle SET_STREAMING_ON action', () => {
    const { result } = renderHook(() => useUiState());
    act(() => {
        result.current.dispatch({ type: 'SET_STREAMING_ON', payload: true });
    });
    expect(result.current.state.isStreamingOn).toBe(true);
  });

  it('should handle SET_SERVER_ALIVE action', () => {
    const { result } = renderHook(() => useUiState());
    act(() => {
        result.current.dispatch({ type: 'SET_SERVER_ALIVE', payload: false });
    });
    expect(result.current.state.serverAlive).toBe(false);
  });

  it('should handle SET_RECONNECTING action', () => {
    const { result } = renderHook(() => useUiState());
    act(() => {
        result.current.dispatch({ type: 'SET_RECONNECTING', payload: true });
    });
    expect(result.current.state.isReconnecting).toBe(true);
  });

  it('should handle SET_HAS_RESUMED action', () => {
    const { result } = renderHook(() => useUiState());
    act(() => {
        result.current.dispatch({ type: 'SET_HAS_RESUMED', payload: true });
    });
    expect(result.current.state.hasResumed).toBe(true);
  });

  it('should handle INCREMENT_RECONNECT_ATTEMPTS action', () => {
    const { result } = renderHook(() => useUiState());
    act(() => {
        result.current.dispatch({ type: 'INCREMENT_RECONNECT_ATTEMPTS' });
    });
    expect(result.current.state.reconnectAttempts).toBe(1);
  });

  it('should handle SET_IS_DISCONNECTING action', () => {
    const { result } = renderHook(() => useUiState());
    act(() => {
        result.current.dispatch({ type: 'SET_IS_DISCONNECTING', payload: true });
    });
    expect(result.current.state.isDisconnecting).toBe(true);
  });

  it('should handle SET_REPORT_DETAILS action', () => {
    const { result } = renderHook(() => useUiState());
    const reportDetails = { id: '123', state: {} };
    act(() => {
        result.current.dispatch({ type: 'SET_REPORT_DETAILS', payload: reportDetails });
    });
    expect(result.current.state.reportDetails).toEqual(reportDetails);
  });

  it('should handle SET_HAS_REPORT action', () => {
    const { result } = renderHook(() => useUiState());
    act(() => {
        result.current.dispatch({ type: 'SET_HAS_REPORT', payload: true });
    });
    expect(result.current.state.hasReport).toBe(true);
  });

  it('should handle SET_IS_ONLINE action', () => {
    const { result } = renderHook(() => useUiState());
    act(() => {
        result.current.dispatch({ type: 'SET_IS_ONLINE', payload: false });
    });
    expect(result.current.state.isOnline).toBe(false);
  });
});