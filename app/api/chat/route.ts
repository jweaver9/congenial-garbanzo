import { VercelRequest, VercelResponse } from '@vercel/node';
import { OpenAI } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function chatHandler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { messages } = req.body as { messages: Array<{ role: string; content: string }> };

    // Validate the received messages
    if (!messages || messages.length === 0) {
      res.status(400).json({ error: 'No messages provided' });
      return;
    }

    // Fetch the chat completion with streaming enabled
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: messages as [],
      stream: true,
    });

    // Transform the response into a readable stream
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream) 

  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}