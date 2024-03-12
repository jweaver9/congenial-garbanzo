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

// Assign the arrow function to a variable
export const chatHandler = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    res.status(405).send(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const { messages, sessionId } = req.body;

    // OpenAI chat model request
    const response = await openai.chat.completions.create({
      model: openaiModel,
      stream: true,
      messages: messages.map((msg: { role: any; content: any; }) => ({
        role: msg.role,
        content: msg.content,
        stream: true,
        max_tokens: 2480, // Limit max tokens to 2480
      })),
    });

    // Transform the OpenAI response into a readable stream
    const stream = OpenAIStream(response);
    return new StreamingTextResponse (stream);

    // Asynchronously save messages to Supabase as a side effect
    messages.push({ role: 'assistant', content: '[AI Response]' }); 
    messages.push({ role: 'user', content: '[User Response]' });
    saveMessagesToSupabase(messages, sessionId);

  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};

async function saveMessagesToSupabase(messages: any[], sessionId: string) {
  for (const message of messages) {
    const { error } = await supabase
      .from('messages.chatmessages')
      .insert({
        session_id: sessionId,
        message: message.content,
        role: message.role,
        timestamp: new Date().toISOString(),
      });

    if (error) {
      console.error(`Supabase insert error for session ${sessionId}: ${error.message}`);
    }
  }
}