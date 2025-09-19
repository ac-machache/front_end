export type WireFrame = { mime_type: string; data: string };
export type WireMessage = {
  event?: string;
  name?: string;
  turn_complete?: unknown;
  interrupted?: unknown;
  mime_type?: string;
  data?: unknown;
  frames?: WireFrame[];
  state?: unknown;
};

export type WsHandlers = {
  ready: () => void;
  session_resumed: (state: unknown) => void;
  speech_start: () => void;
  speech_end: () => void;
  audio_buffer: (frames: WireFrame[]) => void;
  heartbeat: (msg: unknown) => void;
  function_call: () => void;
  function_response: () => void;
  interrupt: () => void;
  turn_control: (msg: WireMessage) => void;
  audio_data: (msg: WireMessage) => void;
  fallback: (event: string, payload?: unknown) => void;
};

export function routeWsMessage(raw: unknown, handlers: WsHandlers) {
  const msg = raw as WireMessage;

  if (msg.event) {
    switch (msg.event) {
      case 'ready':
        return handlers.ready();
      case 'session_resumed':
        return handlers.session_resumed(msg.state);
      case 'speech_start':
        return handlers.speech_start();
      case 'speech_end':
        return handlers.speech_end();
      case 'audio_buffer':
        return handlers.audio_buffer(msg.frames || []);
      case 'heartbeat':
        return handlers.heartbeat(msg);
      case 'function_call':
        return handlers.function_call();
      case 'function_response':
        return handlers.function_response();
      case 'interrupt':
        return handlers.interrupt();
      default:
        return handlers.fallback(msg.event, msg.name || msg.data);
    }
  }

  if (msg?.turn_complete !== undefined || msg?.interrupted !== undefined) {
    return handlers.turn_control(msg);
  }

  if (msg?.mime_type && msg?.data) {
    return handlers.audio_data(msg);
  }
}
