# Frontend Connection Resilience Guide

## Overview

The frontend has been enhanced to work seamlessly with the new backend session resumption features. These improvements provide a much better user experience during network disruptions.

## What's New

### 🔧 **Enhanced WebSocket Connection**
- **Smart Resumption**: Automatically attempts to resume existing sessions on reconnection
- **Disconnect Detection**: Distinguishes between manual disconnects and network issues
- **Better Retry Logic**: Only resumes sessions for unintentional disconnects

### 📡 **New Event Handling**
- **Session Resumed**: Shows when a session is successfully resumed
- **Audio Resume**: Handles mid-conversation audio resumption
- **Backend State Sync**: Displays current backend session state

### 🎨 **Enhanced User Feedback**
- **Resumption Status**: "Reprise de session…" during resumption attempts
- **Resume Success**: "Session reprise" with additional context
- **Tool State Awareness**: Shows "Outils actifs" when backend has pending functions
- **Auto-clear**: Resume status automatically clears after 5 seconds

## Technical Changes

### 1. **Enhanced `buildWsUrl()` Function**
```typescript
// Before
buildWsUrl(config)

// After - supports resume parameter
buildWsUrl(config, { resume: true })
```

### 2. **Improved WebSocket Hook**
```typescript
// New signature with manual disconnect detection
useWebSocket(
  url,
  onOpen,
  onMessage,
  (code, reason, wasManual) => { /* handle close */ },
  onError
)

// New properties
const { connect, disconnect, sendMessage, status, isFirstConnection } = useWebSocket(...)
```

### 3. **New Event Types**
```typescript
interface SessionResumedEvent {
  event: 'session_resumed';
  state: {
    mode: string;
    turn_id: number;
    has_pending_functions: boolean;
  };
}

interface AudioResumeEvent {
  event: 'audio_resume';
  state: {
    agent_mode: string;
    is_audio_active: boolean;
    current_turn_id: number;
  };
}
```

### 4. **Connection State Tracking**
```typescript
interface ConnectionState {
  isResuming: boolean;      // Currently attempting to resume
  hasResumed: boolean;      // Successfully resumed (clears after 5s)
  backendSessionState?: {   // Synced backend state
    mode: string;
    turnId: number;
    hasPendingFunctions: boolean;
  };
}
```

## User Experience Improvements

### **Before Enhancement:**
- Network disconnect → Connection lost
- Reconnect → Fresh session, lost context
- No indication of session continuity
- Function calls interrupted and lost

### **After Enhancement:**
- Network disconnect → "Reprise de session…" 
- Reconnect → "Session reprise • Outils actifs"
- Conversation context preserved
- Audio can resume mid-speech
- Backend state synchronized

## Status Indicators

| Status | Meaning | Color |
|--------|---------|-------|
| "Reprise de session…" | Attempting to resume existing session | Blue |
| "Session reprise" | Successfully resumed session | Green |
| "Session reprise • Outils actifs" | Resumed with pending tool calls | Green |
| "Connecté" | Normal new connection | Emerald |
| "Hors ligne" | No internet connection | Red |

## Implementation Notes

### **Automatic Resume Logic:**
1. **First Connection**: Never attempts resume (`resume=false`)
2. **Reconnection**: Automatically adds `resume=true` parameter
3. **Manual Disconnect**: Resets resume logic for next connection

### **Event Flow:**
1. Network interruption detected
2. Backend keeps session alive (60s grace period)
3. Frontend reconnects with `resume=true`
4. Backend responds with `session_resumed` event
5. Frontend updates UI and syncs state
6. If audio was active, `audio_resume` event sent
7. Normal operation continues

### **Timeout Handling:**
- **Resume Status**: Auto-clears after 5 seconds
- **Grace Period**: Backend cleans up after 60 seconds if no reconnection
- **Retry Logic**: Exponential backoff for failed connections

## Code Examples

### **Basic Usage (Unchanged)**
Your existing connection code works as before:
```typescript
// This automatically gets resume functionality
const { connect, disconnect, sendMessage, status } = useWebSocket(
  wsUrl,
  onOpen,
  onMessage,
  onClose,
  onError
);
```

### **Enhanced Message Handling**
```typescript
const onMessage = useCallback((data: unknown) => {
  const msg = data as any;
  
  if (msg?.event === 'session_resumed') {
    // Handle session resumption
    console.log('Session resumed with state:', msg.state);
  }
  
  if (msg?.event === 'audio_resume') {
    // Handle audio resumption
    console.log('Audio resumed:', msg.state.is_audio_active);
  }
  
  // ... existing message handling
}, []);
```

### **Connection State Access**
```typescript
// Access connection state for UI decisions
const [connectionState, setConnectionState] = useState<ConnectionState>({
  isResuming: false,
  hasResumed: false,
});

// Show different UI based on connection state
if (connectionState.isResuming) {
  return <div>Resuming session...</div>;
}
```

## Benefits

### **For Users:**
- **Seamless Experience**: Brief network issues don't interrupt conversations
- **Context Preservation**: No lost conversation history
- **Audio Continuity**: Can resume mid-sentence
- **Clear Feedback**: Always know what's happening with connection

### **For Developers:**
- **Type Safety**: All new events and states are typed
- **Backward Compatibility**: Existing code continues to work
- **Easy Monitoring**: Clear logs for debugging connection issues
- **Configurable**: Can be extended with additional resumption logic

## Migration Guide

### **Minimal Changes Required:**
1. **Update WebSocket callback signature** (add `wasManual` parameter):
   ```typescript
   // Before
   const onClose = (code: number, reason: string) => { ... }
   
   // After
   const onClose = (code: number, reason: string, wasManual?: boolean) => { ... }
   ```

2. **Handle new events** (optional but recommended):
   ```typescript
   const onMessage = (data: unknown) => {
     // Add handlers for session_resumed and audio_resume events
   }
   ```

### **Optional Enhancements:**
- Add `ConnectionState` tracking for advanced UI feedback
- Implement custom logic for specific resumption scenarios
- Add analytics for connection resilience metrics

## Troubleshooting

### **Session Not Resuming:**
- Check backend logs for grace period expiration
- Verify `resume=true` parameter in WebSocket URL
- Ensure session ID consistency across connections

### **Events Not Firing:**
- Verify new event handlers are properly implemented
- Check TypeScript types for `SessionResumedEvent` and `AudioResumeEvent`
- Ensure backend is sending the new event format

### **UI Not Updating:**
- Check `ConnectionState` is properly managed
- Verify `statusMeta` dependencies include `connectionState`
- Ensure timeout for clearing resume status is working

## Future Enhancements

### **Possible Additions:**
- **Audio Position Sync**: Resume from exact playback position
- **Visual Queue Indicator**: Show buffered vs played audio
- **Connection Quality Metrics**: Display connection stability
- **Offline Mode**: Cache and replay when connection restored
- **Multi-tab Coordination**: Handle session resumption across browser tabs

## Testing

### **Manual Testing Scenarios:**
1. **Basic Resume**: Disconnect Wi-Fi briefly, reconnect
2. **Grace Period**: Disconnect for >60s, verify new session
3. **Manual Disconnect**: Use disconnect button, verify no resume
4. **Audio Resume**: Disconnect during agent speech
5. **Tool Resume**: Disconnect during function call execution

### **Automated Testing:**
```typescript
// Example test for session resumption
test('should resume session on network reconnection', async () => {
  // Setup connection
  // Simulate network disconnect
  // Verify resume attempt
  // Check session state synchronization
});
```

This enhanced frontend provides a much more resilient and user-friendly experience, especially for the real-time audio application where continuity is crucial.
