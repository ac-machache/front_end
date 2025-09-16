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
  Resume = 'RESUME',
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
  notes?: string;
  createdAt?: unknown;
}

export interface ClientSessionRecord {
  id: string;
  realtimeSessionId: string;
  title?: string;
  createdAt?: unknown;
}

// Backend session resumption event types
export interface SessionResumedEvent {
  event: 'session_resumed';
  state: {
    mode: string;
    turn_id: number;
    has_pending_functions: boolean;
  };
}

export interface AudioResumeEvent {
  event: 'audio_resume';
  state: {
    agent_mode: string;
    is_audio_active: boolean;
    current_turn_id: number;
  };
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

// Connection state for UI feedback
export interface ConnectionState {
  isResuming: boolean;
  hasResumed: boolean;
  backendSessionState?: {
    mode: string;
    turnId: number;
    hasPendingFunctions: boolean;
  };
}

