// app/api/anthropic/route.ts
import Anthropic from '@anthropic-ai/sdk';
import { AnthropicStream, StreamingTextResponse } from 'ai';
import { experimental_buildAnthropicPrompt } from 'ai/prompts';

// Initialize the Anthropic client with API key
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Build the prompt using the provided messages
  const prompt = experimental_buildAnthropicPrompt(messages);

  // Ask Anthropic for a streaming chat completion given the prompt
  const response = await anthropic.completions.create({
    prompt,
    model: process.env.ANTHROPIC_MODEL || 'claude-2', // Use model from environment variable
    stream: true,
    max_tokens_to_sample: 300,
  });

  // Convert the response into a friendly text-stream using AnthropicStream
  const stream = AnthropicStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
