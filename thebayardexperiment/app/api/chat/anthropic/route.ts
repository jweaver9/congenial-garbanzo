import { VercelRequest, VercelResponse } from '@vercel/node';
import { AnthropicStream, StreamingTextResponse } from 'ai';
import Anthropic from '@anthropic-ai/sdk';
// Ensure AnthropicStream and StreamingTextResponse are correctly defined and imported.

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { messages } = req.body; // Direct use of 'req.body' assuming Vercel environment.

    // Input validation (if necessary)
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid message format' });
    }

    // Perform the Anthropic API call
    const response = await anthropic.messages.create({
      messages,
      model: 'claude-2.1',
      stream: true,
      max_tokens: 300,
    });

    // Handle the response, assuming that AnthropicStream properly wraps the response for Vercel compatibility.
    const stream = AnthropicStream(response); // Ensure this fits your implementation.
    
    // Return the stream as the response, or adapt as necessary for your context.
    return new StreamingTextResponse(stream); // Adjust based on actual implementation suitability.

  } catch (error) {
    console.error('Error from Anthropic:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
};