import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { OpenAIStream, AnthropicStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });

export const runtime = 'edge';

interface GeneralMessage { // Define this interface if it is used across providers.
    role: string;
    content: string;
}

export async function POST(req: Request) {
  try {
    const { messages, provider } = await req.json();
    if (!messages || !messages.length || !provider) {
      return new Response(
        JSON.stringify({ error: 'Invalid request parameters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  
    let stream;
    if (provider === 'openai') {
      const openaiMessages = messages.map((m: GeneralMessage) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      }));
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        stream: true,
        messages: openaiMessages,
      });
      stream = OpenAIStream(response);
    } else if (provider === 'anthropic') {
        // Assuming Anthropic accepts the same general structure but without role differentiation.
        const anthropicMessages = messages.map((m: GeneralMessage) => ({
            // Transform messages accordingly if there's a specific structure expected by Anthropic.
            content: m.content,
            // Adjust or add additional fields required by Anthropic API here.
        }));
        const response = await anthropic.messages.create({
            messages: anthropicMessages,
            model: 'claude-2.1',
            stream: true,
            max_tokens: 300,
        });
        stream = AnthropicStream(response);
    } else {
      return new Response(
        JSON.stringify({ error: 'Unsupported provider' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(`Request processing failed due to:`, error);
    return new Response(
      JSON.stringify({ error: `Request processing failure` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}