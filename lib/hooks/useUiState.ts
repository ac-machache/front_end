"use client";
import { useReducer } from 'react';
import { UiState, WsStatus, SessionDetails } from '../types';

type Action =
  | { type: 'SHOW_CALL_SCREEN' }
  | { type: 'RESET_CALL_STATE' }
  | { type: 'SET_SERVER_READY'; payload: boolean }
  | { type: 'SET_LISTENING'; payload: boolean }
  | { type: 'SET_TOOL_CALL_ACTIVE'; payload: boolean }
  | { type: 'SET_WS_CONNECTION_STATUS'; payload: WsStatus }
  | { type: 'SET_MIC_HW_ON'; payload: boolean }
  | { type: 'SET_STREAMING_ON'; payload: boolean }
  | { type: 'SET_SERVER_ALIVE'; payload: boolean }
  | { type: 'SET_RECONNECTING'; payload: boolean }
  | { type: 'SET_HAS_RESUMED'; payload: boolean }
  | { type: 'INCREMENT_RECONNECT_ATTEMPTS' }
  | { type: 'SET_IS_CONNECTING'; payload: boolean }
  | { type: 'SET_IS_DISCONNECTING'; payload: boolean }
  | { type: 'SET_REPORT_DETAILS'; payload: SessionDetails | null }
  | { type: 'SET_HAS_REPORT'; payload: boolean }
  | { type: 'SET_IS_ONLINE'; payload: boolean };

const initialState: UiState = {
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
  serverReady: false,
  isListening: false,
  isStreamingOn: false,
};

function reducer(state: UiState, action: Action): UiState {
  switch (action.type) {
    case 'SHOW_CALL_SCREEN':
      return { ...state, isCallScreen: true, isConnecting: true };
    case 'RESET_CALL_STATE':
      return {
        ...state,
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
        wsConnected: false,
        reconnectAttempts: 0,
        serverReady: false,
        isStreamingOn: false,
        isListening: false,
      };
    case 'SET_SERVER_READY':
      return { ...state, serverReady: action.payload, isConnecting: false };
    case 'SET_LISTENING':
      return { ...state, isListening: action.payload };
    case 'SET_TOOL_CALL_ACTIVE':
      return { ...state, isThinking: action.payload };
    case 'SET_WS_CONNECTION_STATUS':
      return { ...state, wsConnected: action.payload === WsStatus.Connected };
    case 'SET_MIC_HW_ON':
      return { ...state, isMicHwOn: action.payload };
    case 'SET_STREAMING_ON':
        return { ...state, isStreamingOn: action.payload };
    case 'SET_SERVER_ALIVE':
        return { ...state, serverAlive: action.payload };
    case 'SET_RECONNECTING':
        return { ...state, isReconnecting: action.payload };
    case 'SET_HAS_RESUMED':
        return { ...state, hasResumed: action.payload };
    case 'INCREMENT_RECONNECT_ATTEMPTS':
        return { ...state, reconnectAttempts: state.reconnectAttempts + 1 };
    case 'SET_IS_CONNECTING':
        return { ...state, isConnecting: action.payload };
    case 'SET_IS_DISCONNECTING':
        return { ...state, isDisconnecting: action.payload };
    case 'SET_REPORT_DETAILS':
        return { ...state, reportDetails: action.payload };
    case 'SET_HAS_REPORT':
        return { ...state, hasReport: action.payload };
    case 'SET_IS_ONLINE':
        return { ...state, isOnline: action.payload };
    default:
      return state;
  }
}

export function useUiState() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
}