import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Initialize OpenAI Client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export default async function (req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    try {
      // Extract `messages` and optional `model` from the request body
      const { messages, model = 'gpt-3.5-turbo' } = req.body;
      
      // Validate input - ensuring `messages` is an array with proper structure
      if (!Array.isArray(messages) || messages.some(message => typeof message !== 'object')) {
        return res.status(400).json({ error: 'Invalid message format' });
      }

      // Request a streaming completion from OpenAI using the provided messages and model
      const response = await openai.chat.completions.create({
        model,
        messages,
        stream: true, // Confirm stream compatibility with your infrastructure
      });

      // Convert the response into a stream format compatible with your implementation
      const stream = OpenAIStream(response);

      // Return the streaming response
      return new StreamingTextResponse(stream);
    } catch (error) {
      console.error('Error from OpenAI:', error);
      // Return an error as a response
      return res.status(500).json({ error: 'Failed to process request', details: error });
    }
  } else {
    // Handling for non-POST requests
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}