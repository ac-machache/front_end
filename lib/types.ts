export interface Config {
  scheme: 'ws' | 'wss';
  host: string;
  port: string;
  appName: string;
  userId: string;
  sessionId: string;
}

export interface Session {
  id: string;
  lastUpdateTime?: string;
  [key: string]: any;
}

export enum LogLevel {
  Info = 'INFO',
  Error = 'ERROR',
  Event = 'EVENT',
  Data = 'DATA',
  Ws = 'WS',
  Http = 'HTTP',
  Audio = 'AUDIO',
}

export interface LogEntry {
  id: number;
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
}

export enum WsStatus {
  Disconnected = 'Disconnected',
  Connecting = 'Connecting',
  Connected = 'Connected',
  Error = 'Error',
}

