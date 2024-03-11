import OpenAI from 'openai';
import Anthropic from a;
import { OpenAIStream, AnthropicStream, StreamingTextResponse } from 'ai';

// Create API clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Unified endpoint to handle requests for both OpenAI and Anthropic
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages, provider } = await req.json(); // `provider` can be 'openai' or 'anthropic'

    // Input validation
    if (!messages || !messages.length || !provider) {
      return new Response(JSON.stringify({ error: 'Invalid request parameters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    let response;
    if (provider === 'openai') {
      // Processing with OpenAI
      response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        stream: true,
        messages,
      });
    } else if (provider === 'anthropic') {
      // Processing with Anthropic
      response = await anthropic.messages.create({
        messages,
        model: 'claude-2.1',
        stream: true,
        max_tokens: 300,
      });
    } else {
      return new Response(JSON.stringify({ error: 'Unsupported provider' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Adjust the streaming utility based on the selected provider
    const stream = (provider === 'openai') ? OpenAIStream(response) : AnthropicStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(`Failed to get completion from ${provider}:`, error);
    return new Response(JSON.stringify({ error: `Failed to process request with ${provider}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}