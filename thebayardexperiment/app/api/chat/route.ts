import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse, AnthropicStream /* assuming similar utility for Anthropic */, } from 'ai';
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Initialize OpenAI Client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,});

 const anthropic = new Anthropic({apiKey: process.env.ANTHROPIC_API_KEY,});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages, service } = await req.json();

    // Validate the input before making the API request
    if (!messages || !Array.isArray(messages) || messages.length === 0 || !service) {
      return NextResponse.json({ error: 'Invalid or missing input data.' }, { status: 400 });
    }

    let response;
    let stream;

    switch(service) {
      case 'openai':
        response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          stream: true,
          messages,
        });
        stream = OpenAIStream(response);
        break;
    
      case 'anthropic': // Assuming you have similar methods for Anthropic
        response = await anthropic.messages.create({ 
          model: 'claude-2.1',
          stream: true,
          messages: messages, // Fix: Pass the 'messages' array directly
          max_tokens: 100, // Add the 'max_tokens' property with an appropriate value
        });

          default:
            return NextResponse.json({ error: 'Unsupported AI service specified.', status: 400 });
    }

    return new StreamingTextResponse(stream);
  } catch (error) {
    if (error instanceof OpenAI.APIError // || error instanceof Anthropic.APIError assuming similar structure
      ) {
      const { name, status, message } = error;
      const errorResponse = { error: name, message: message, statusCode: status };
      return NextResponse.json(errorResponse, { status });
    } else {
      console.error('Unexpected error:', error);
      const genericErrorMessage = 'Unexpected error occurred.';
      return NextResponse.json({ error: 'ServerError', message: genericErrorMessage }, { status: 500 });
    }
  }
}