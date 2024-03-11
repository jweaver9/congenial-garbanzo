import Anthropic from '@anthropic-ai/sdk';
import { AnthropicStream, StreamingTextResponse } from 'ai';

// Initialization of the Anthropic API client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export default async function(req: { method: string; body: { messages: any; model?: "claude-2.1" | undefined; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; details?: unknown; }): any; new(): any; }; }; }) {
  if (req.method === "POST") {
    try {
      // Extract `messages` from the request body, and set a default model
      const { messages, model = 'claude-2.1' } = req.body;
      
      // Validate input - ensuring `messages` follows the required structure
      if (!messages || !Array.isArray(messages) || messages.some(msg => typeof msg !== 'string' && typeof msg.content !== 'string')) {
        return res.status(400).json({ error: 'Invalid message format' });
      }

      // Request a streaming response from Anthropic using the provided messages and model
      const response = await anthropic.messages.create({
        messages,
        model,
        stream: true, // Assuming streaming is correctly handled by your platform or utilities
        max_tokens: 300,
      });

      // Convert the API response into a stream format using your custom utility
      const stream = AnthropicStream(response); 

      // Return the streaming response
      return new StreamingTextResponse(stream);
    } catch (error) {
      console.error('Error from Anthropic:', error);
      // Return an error as a response
      return res.status(500).json({ error: 'Failed to process request', details: error });
    }
  } else {
    // Handling for non-POST requests
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}