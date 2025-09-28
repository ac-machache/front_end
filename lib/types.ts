export type Result<T> = { ok: true; value: T } | { ok: false; error: Error };

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
  // Additional fields from the backend are allowed but unknown at compile time
  state?: SessionState | Record<string, unknown>;
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
  data?: unknown;
}

export enum WsStatus {
  Disconnected = 'Disconnected',
  Connecting = 'Connecting',
  Connected = 'Connected',
  Error = 'Error',
}

// ---- Domain types for session details ----
export interface ReportMain {
  title?: string;
  date_of_visit?: string;
  farmer?: string;
  tc?: string;
  report_summary?: string;
}

export interface ProactiveInsights {
  identified_issues?: string[];
  proposed_solutions?: string[];
}

export interface ActionPlan {
  for_tc?: string[];
  for_farmer?: string[];
}

export interface OpportunityDetector {
  sales?: string[];
  advice?: string[];
  farmer_projects?: string[];
}

export interface RiskAnalysis {
  commercial?: string[];
  technical?: string[];
  weak_signals?: string[];
}

export interface RelationshipBarometer {
  satisfaction_points?: string[];
  frustration_points?: string[];
  personal_notes?: string[];
}

export interface NextContactPrep {
  opening_topic?: string;
  next_visit_objective?: string;
}

export interface StrategicDashboard {
  proactive_insights?: ProactiveInsights;
  action_plan?: ActionPlan;
  opportunity_detector?: OpportunityDetector;
  risk_analysis?: RiskAnalysis;
  relationship_barometer?: RelationshipBarometer;
  next_contact_prep?: NextContactPrep;
}

export interface RapportDeSortie {
  main_report?: ReportMain;
  strategic_dashboard?: StrategicDashboard;
}

export interface SessionState {
  RapportDeSortie?: RapportDeSortie;
  nom_tc?: string;
  nom_agri?: string;
  [key: string]: unknown;
}

export type SessionDetails = Session & { state?: SessionState };

// Client and Firestore domain types
export interface ClientRecord {
  id: string;
  name: string;
  email: string;
  city: string;
  zipCode: string;
  contexte: string;
  createdAt?: unknown;
}

export type ClientFormValues = {
  name: string;
  email: string;
  city: string;
  zipCode: string;
  contexte: string;
};

export interface ClientSessionRecord {
  id: string;
  realtimeSessionId: string;
  title?: string;
  createdAt?: unknown;
}


// Heartbeat event types
export interface HeartbeatEvent {
  event: 'heartbeat';
  timestamp: number;
  data: string;
}

export interface HeartbeatResponseEvent {
  event: 'heartbeat_response';
  timestamp: number;
  server_timestamp: number;
}

export interface UiState {
    isMicOn: boolean;
    isMuted: boolean;
    isThinking: boolean;
    isSpeaking: boolean;
    isWaitingForAgent: boolean;
    isCallScreen: boolean;
    isConnecting: boolean;
    isDisconnecting: boolean;
    isReconnecting: boolean;
    isResuming: boolean;
    hasResumed: boolean;
    isMicHwOn: boolean;
    isOnline: boolean;
    serverAlive: boolean;
    wsConnected: boolean;
    reconnectAttempts: number;
    reportDetails: SessionDetails | null;
    hasReport: boolean;
    serverReady?: boolean;
    isListening?: boolean;
    isStreamingOn?: boolean;
    isGeneratingReport?: boolean;
  }