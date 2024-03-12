import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const openaiApiKey = process.env.OPENAI_API_KEY || '';
const openaiModel = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const openai = new OpenAI({
  apiKey: openaiApiKey,
});

async function chatHandler(req, res) {
  if (req.method === 'POST') {
    try {
      const { messages, sessionId } = await req.json();

      const response = await openai.chat.completions({
        model: openaiModel,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      });

      const aiMessage = {
        role: 'assistant',
        content: response.data.choices[0].message.content,
      };

      await Promise.all(
        [...messages, aiMessage].map(async (message) => {
          const { error } = await supabase
            .from('chat_messages')
            .insert([{
              session_id: sessionId,
              message: message.content,
              role: message.role,
              timestamp: new Date().toISOString(),
            }]);

          if (error) throw new Error(`Supabase insert error: ${error.message}`);
        })
      );

      res.status(200).json({ messages: [...messages, aiMessage] });
    } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).json({ error: (error as Error).message || 'An unexpected error occurred' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default chatHandler;
