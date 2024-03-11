import OpenAI from 'openai';
import OpenAIStream from 'ai';
import { Tokens } from 'ai/react';

export const runtime = 'edge';

// Import the correct ReadableStream type

export default async function Page() {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY ?? '',
  });

  const tokens = await Tokens({ stream: new ReadableStream() });

  return tokens;
}
