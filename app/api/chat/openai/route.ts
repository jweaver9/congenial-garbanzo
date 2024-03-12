import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai'; // Assuming 'ai' is correctly pointing to Vercel's SDK or your implementation.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);


// Initialize the OpenAI client with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages, sessionId } = await req.json(); // Assuming each chat sequence has a unique session ID
  
  // Process messages with OpenAI as before
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo-0613',
    stream: true,
    messages,
    // Assume 'functions' is defined elsewhere if you're using it
  });

  // Store each message in Supabase
  for (const message of messages) {
    const { error } = await supabase
      .from('messages.chatmessages')
      .insert([
        {
          session_id: sessionId,
          message: message.content,
          role: message.role,
          timestamp: new Date().toISOString(),
        },
      ]);
      
      if (error) {
        console.error('Error inserting message into Supabase:', error);
        // Handle the error appropriately
      }
    }
  }