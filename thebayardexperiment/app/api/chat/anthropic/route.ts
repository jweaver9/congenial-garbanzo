import { Request, Response } from 'express'; // or from '@vercel/node' if you're using Vercel
import Anthropic from '@anthropic-ai/sdk';
import { AnthropicStream, StreamingTextResponse } from 'ai';
import { json } from 'express';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export const runtime = 'edge';

export async function POST(req: Request, res: Response) {
  try {
        await json()(req, res, next); // Parse request body as JSON

        const { messages } = req.body; // Access the parsed JSON body

        // Validate input - ensuring `messages` is an array with proper structure
        if (!Array.isArray(messages) || messages.some(message => typeof message !== 'object')) {
          return res.status(400).json({ error: 'Invalid message format' });
        }

        const response = await anthropic.messages.create({
          messages,
          model: 'claude-2.1',
          stream: true,
          max_tokens: 300,
        });

        const stream = AnthropicStream(response);
        return new StreamingTextResponse(stream);
      } catch (error) {
        console.error('Error from Anthropic:', error);
        // Return an error as a response
        return res.status(500).json({ error: 'Failed to process request', details: error });
      }
    }

function next(err?: any): void {
  throw new Error('Function not implemented.');
}
