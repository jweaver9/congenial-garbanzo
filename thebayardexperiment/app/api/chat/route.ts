import { AnthropicStream, StreamingTextResponse, OpenAIStream } from 'ai';
import { NextResponse } from 'next/server';
import { experimental_buildAnthropicPrompt } from 'ai/prompts';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// Initialize both AI Clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages, service } = await req.json();

  // Basic input validation
  if (!messages || !Array.isArray(messages) || messages.length === 0 || !service) {
    return NextResponse.json({ error: 'Invalid or missing input data.' }, { status: 400 });
  }

  try {
    let response, stream;

    switch(service) {
      case 'openai':
        // Use OpenAI's chat completion
        response = await openai.chat.completions.create({
          model: 'text-davinci-003', // Specify your desired OpenAI model
          messages: messages.map(msg => msg.content), // Use 'messages' instead of 'prompt'
          stream: true,
          max_tokens: 300, // Example parameter
        });
        stream = OpenAIStream(response);
        break;

      case 'anthropic':
        // Use Anthropic's completion
        const prompt = experimental_buildAnthropicPrompt(messages);
        response = await anthropic.completions.create({
          prompt,
          model: 'claude-2', // Specifying the model
          stream: true,
          max_tokens_to_sample: 300, // Example parameter
        });
        stream = AnthropicStream(response);
        break;

      default:
        return NextResponse.json({ error: 'Unsupported AI service specified.' }, { status: 400 });
    }

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error handling request:', error);
    const genericErrorMessage = 'An error occurred while processing your request.';
    return NextResponse.json({ error: 'ServerError', message: genericErrorMessage }, { status: 500 });
  }
}