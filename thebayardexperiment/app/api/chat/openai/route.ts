import { VercelRequest, VercelResponse } from npm install @vercel/node; // Using Vercel's types as an example
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { messages, model = 'gpt-3.5-turbo' } = await req.json();

    if (!Array.isArray(messages) || messages.some(msg => typeof msg.content !== 'string')) {
      return res.status(400).json({ error: 'Invalid message format' });
    }

    const response = await openai.chat.completions.create({
      model,
      stream: true,
      messages,
    });

    const stream = OpenAIStream(response); // Ensure this operation is correct for your implementation
    return new StreamingTextResponse(stream); // Make sure StreamingTextResponse fits your use case
  } catch (error) {
    console.error('Error from OpenAI:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
};