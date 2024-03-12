import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Supabase Initialization
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// OpenAI Initialization
const openaiApiKey = process.env.OPENAI_API_KEY || '';
const openaiModel = process.env.OPENAI_MODEL || 'text-davinci-003'; // Update model as needed
const openai = new OpenAI({ apiKey: openaiApiKey });

export const runtime = 'edge'; // Setting runtime to edge for Vercel

export const handler = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    // Invalid request method handler
    res.status(405).send(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const { messages, sessionId } = req.body;
    // OpenAI chat model request
    const response = await openai.chat.completions.create({
      model: openaiModel,
      stream: true,
      messages: messages.map((msg: { role: string; content: string; }) => ({
        role: msg.role,
        content: msg.content,
      })),
    });
    // Transform the OpenAI response into a readable stream
    const stream = OpenAIStream(response);
    // Save messages to Supabase (Assuming this needs to be done asynchronously and not waited on)
    messages.push({ role: 'assistant', content: '[AI Response]' }); // Add a placeholder for the AI response
    saveMessagesToSupabase(messages, sessionId);
  } catch (error) {
    // Error handling
    console.error('Error processing request:', error);
    res.status(500).json({ error: (error as Error).message || 'An unexpected error occurred' });
  }
};

async function saveMessagesToSupabase(messages: any[], sessionId: string) {
  // Implementation to save messages to Supabase, adjusting as necessary
  for (const message of messages) {
    const { error } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        message: message.content,
        role: message.role,
        timestamp: new Date().toISOString()
      });
    if (error) {
      console.error(`Supabase insert error for session ${sessionId}: ${error.message}`);
      // Consider handling this error more gracefully in a real-world application
    }
  }
}

    