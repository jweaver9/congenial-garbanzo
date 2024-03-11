import { VercelRequest, VercelResponse } from '@vercel/node'; 
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

// Define the route handler
const routeHandler = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { messages, model = 'gpt-3.5-turbo' } = req.body;

    // Ensure proper handling of 'messages' and 'model'

    const response = await openai.chat.completions.create({
      model,
      messages,
      // Assuming 'stream: true' is handled correctly within your platform or utility functions not shown here
      // For Vercel, you might not directly stream responses but prepare the response and send it
    });

    // Directly send response data as JSON, or process 'response' as needed
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error from OpenAI:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
};

// Export the route handler
export default routeHandler;