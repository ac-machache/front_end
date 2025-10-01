import { NextRequest, NextResponse } from 'next/server';
import { streamText } from 'ai';

/**
 * Google Assistant Chat API Endpoint
 * 
 * This endpoint receives chat messages from the frontend and forwards them
 * to the backend Google Integration Agent.
 */
export async function POST(req: NextRequest) {
  try {
    const { messages, model, webSearch } = await req.json();

    // Get the backend URL from environment or default to localhost
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    
    // TODO: Get user_id from Firebase Auth session
    const userId = 'temp-user-id'; // Replace with actual user ID from auth
    
    // TODO: Get session_id from URL params or create new one
    const sessionId = crypto.randomUUID();

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    const taskDescription = lastMessage?.content || '';

    // Call the backend Google Agent
    const response = await fetch(`${backendUrl}/api/google/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        session_id: sessionId,
        task_description: taskDescription,
        model: model,
        web_search: webSearch,
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const result = await response.json();

    // Return the agent's response
    return NextResponse.json({
      id: crypto.randomUUID(),
      role: 'assistant',
      content: result.summary || result.understanding || 'Task completed',
      parts: [
        {
          type: 'text',
          text: result.summary || result.understanding || 'Task completed',
        },
      ],
    });

  } catch (error) {
    console.error('Error in Google chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
