import { VercelRequest, VercelResponse } from '@vercel/node';
import { AnthropicStream, StreamingTextResponse } from 'ai';
import Anthropic from '@anthropic-ai/sdk';
// Assume AnthropicStream and StreamingTextResponse are utilities you've defined for handling streaming.

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Assign the async function to a variable before exporting it.
export const routeHandler = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { messages } = req.body; 

    // Validating the input
    if (!messages || !Array.isArray(messages) || messages.some(msg => typeof msg.content !== 'string')) {
      return res.status(400).json({ error: 'Invalid message format' });
    }

    // Assuming 'messages' structure fits Anthropic's API requirements
    const response = await anthropic.messages.create({
      messages,
      model: 'claude-2.1',
      stream: true,
      max_tokens: 300,
    });

    // Let's assume AnthropicStream modifies or processes 'response' to be sent back properly. 
    // Ensure this function exists and correctly handles the response for your needs.
    const stream = AnthropicStream(response);

    // Assuming StreamingTextResponse properly wraps 'stream' for the response.
    // This part may need adjustment based on your actual StreamingTextResponse implementation.
    return new StreamingTextResponse(stream);

  } catch (error) {
    console.error('Error from Anthropic:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  return routeHandler(req, res);
}
