import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // It's a good practice to validate the input before making the API request
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid or empty messages array.' }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages,
    });

    // Assuming OpenAIStream and StreamingTextResponse correctly handle streaming responses
    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
  } catch (error) {
    // Specific handling for OpenAI API errors
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      
      // Constructing an error response object
      const errorResponse = {
        error: name,
        message: message,
        // Including headers could leak sensitive information, use cautiously
        // headers: headers,
        statusCode: status
      };

      // Send back a structured error response using NextResponse
      return NextResponse.json(errorResponse, { status });
    } else {
      // For any other type of errors, log and return a generic server error message
      console.error('Unexpected error:', error);
      
      // Avoid exposing the actual error message in production environments
      const genericErrorMessage = 'Unexpected error occurred.';
      
      return NextResponse.json({ error: 'ServerError', message: genericErrorMessage }, { status: 500 });
    }
  }
}