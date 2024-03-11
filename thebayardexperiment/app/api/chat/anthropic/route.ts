import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { OpenAIStream, AnthropicStream, StreamingTextResponse } from 'ai';
import ChatCompletionMessageParam  from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });

export const runtime = 'edge';

interface GeneralMessage {
    role: string;
    content: string;
}

// Assume that StreamResponse is the correct return type for both AnthropicStream and OpenAIStream
type StreamResponse = AsyncIterable<any> | null; 

async function getStream(provider: string, messages: GeneralMessage[]): Promise<StreamResponse> {
    if (provider === 'openai') {
        const openaiMessages = messages.map(m => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content,
        }));
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: openaiMessages,
        });
        return OpenAIStream(response);
    } else if (provider === 'anthropic') {
        // Mapping directly without unnecessary casting
        const anthropicMessages = messages.map(({ content }) => ({ content }));
        const response = await anthropic.messages.create({
            messages: anthropicMessages,
            model: 'claude-2.1',
            max_tokens: 300,
        });
        return AnthropicStream(response);
    }
    return null;
}

export async function POST(req: Request) {
  try {
    const { messages, provider } = await req.json();
    if (!messages || !messages.length || !provider) {
      return new Response(JSON.stringify({ error: 'Invalid request parameters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stream = await getStream(provider, messages);
    if (stream) {
        // Assuming StreamingTextResponse can accept StreamResponse directly or through some processing/wrapping
        return new StreamingTextResponse(stream);
    } else {
        return new Response(JSON.stringify({ error: 'Unsupported provider or failed to get stream' }), {
            status: 400, headers: { 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error(`Request processing failed due to:`, error);
    return new Response(JSON.stringify({ error: `Request processing failure` }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
}