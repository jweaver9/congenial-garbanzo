import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { OpenAIStream, AnthropicStream } from 'ai';
import { experimental_buildAnthropicPrompt } from 'ai/prompts';

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
    return new Response(JSON.stringify({ error: 'Invalid or missing input data.' }), { status: 400 });
  }

  try {
    let streamResponse;

    switch(service) {
      case 'openai':
        const responseOpenAI = await openai.chat.completions.create({
          model: 'text-davinci-003',
          messages: messages.map(msg => ({ role: msg.role, content: msg.content })),
          stream: true,
          max_tokens: 300,
        });

        // Correctly handle the streaming data from OpenAI's response
        // Assuming OpenAIStream is a function you've defined to format or process the stream
        streamResponse = OpenAIStream(responseOpenAI); // Directly pass the entire response
        break;

      case 'anthropic':
        const prompt = experimental_buildAnthropicPrompt(messages.map(msg => msg.content));
        const responseAnthropic = await anthropic.completions.create({
          prompt,
          model: 'claude-2',
          stream: true,
          max_tokens_to_sample: 300,
        });

        // Correctly handle the streaming data from Anthropic's response
        // Assuming AnthropicStream is a function you've defined to format or process the stream
        streamResponse = AnthropicStream(responseAnthropic); // Directly pass the entire response
        break;

      default:
        return new Response(JSON.stringify({ error: 'Unsupported AI service specified.' }), { status: 400 });
    }

    // Ensure streamResponse is formatted correctly for your use case
    return streamResponse;
  } catch (error) {
    console.error('Error handling request:', error);
    return new Response(JSON.stringify({ error: 'ServerError', message: 'An error occurred while processing your request.' }), { status: 500 });
  }
}
