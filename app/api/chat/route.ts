// Assuming these imports work in your targeted runtime environment
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// Initialization
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const openaiApiKey = process.env.OPENAI_API_KEY || '';
const openaiModel = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

// Clients
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const openai = new OpenAI({
  apiKey: openaiApiKey,
});

async function chatHandler(req: { method: string; json: () => PromiseLike<{ messages: any; sessionId: any; }> | { messages: any; sessionId: any; }; }, res: { setHeader: (arg0: string, arg1: string[]) => void; status: (arg0: number) => { (): any; new(): any; end: { (arg0: string): any; new(): any; }; json: { (arg0: { messages?: any[]; error?: string; }): void; new(): any; }; }; }) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { messages, sessionId } = await req.json();
    
    // Call OpenAI and await response
    const response = await openai.chat.completions.create({
      model: openaiModel,
      messages: messages.map((msg: { role: any; content: any; }) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const aiMessage = {
      role: 'assistant',
      content: response.choices[0].message.content,
    };

    // Store all messages in Supabase (existing + AI response)
    const { error } = await supabase
      .from('chat_messages')
      .insert(
        [...messages, aiMessage].map((message) => ({
          session_id: sessionId,
          message: message.content,
          role: message.role,
          timestamp: new Date().toISOString(),
        }))
      );

    if (error) {
      throw new Error(`Supabase insert error: ${error.message}`);
    }

    // Respond with the updated message list
    res.status(200).json({ messages: [...messages, aiMessage] });

  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}

export default chatHandler;