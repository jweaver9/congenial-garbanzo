// Import the necessary SDK and utilities
import Anthropic from '@anthropic-ai/sdk';
import { AnthropicStream, StreamingTextResponse } from 'ai';

// Set the runtime to Edge for improved performance
export const runtime = 'edge';

// Create an Anthropic API client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Unified async handler for POST requests
export async function handler(req: Request): Promise<Response> {
  try {
    // Parse the request JSON body
    const { messages } = await req.json();

    // Validate the input
    if (!messages || !Array.isArray(messages) || messages.some(msg => typeof msg !== 'string' && typeof msg.content !== 'string')) {
      return new Response(JSON.stringify({ error: 'Invalid message format' }), { status: 400 });
    }

    // Make a request to the Anthropic API
    const response = await anthropic.messages.create({
      messages,
      model: 'claude-2.1',
      stream: true,
      max_tokens: 300,
    });

    // Convert the API response into a stream
    const stream = AnthropicStream(response);

    // Return the streaming response
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error from Anthropic:', error);
    return new Response(JSON.stringify({ error: 'Failed to process request', details: error }), { status: 500 });
  }
}