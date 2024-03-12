import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const openaiApiKey = process.env.OPENAI_API_KEY || '';
const openaiModel = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: openaiApiKey,
});

export const config = {
  runtime: "experimental-edge", // Ensure compatibility with Vercel Edge Functions
};

export default async function handler(req: Request) {
  if (req.method === 'POST') {
    try {
      const { messages, sessionId } = await req.json();

      // Process messages with OpenAI
      const response = await openai.chat.completions.create({
        model: openaiModel,
        messages: messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
      });

      // Append the AI response to messages
      const aiMessage = {
        role: 'assistant',
        content: response.choices[0].message.content,
      };

      // Store each message in Supabase, including AI's response
      await Promise.all(
        [...messages, aiMessage].map(async (message) => {
          const { error } = await supabase
            .from('chat_messages') // Adjust table name as necessary
            .insert([{
              session_id: sessionId,
              message: message.content,
              role: message.role,
              timestamp: new Date().toISOString(),
            }]);

          if (error) throw new Error(`Supabase insert error: ${error.message}`);
        })
      );

      // Respond with updated message list, including AI's response
      return new Response(JSON.stringify({ messages: [...messages, aiMessage] }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error: unknown) {
      console.error('Error processing request:', error);
      return new Response(JSON.stringify({ error: (error as Error).message || 'An unexpected error occurred' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else {
    // Handle non-POST requests
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
