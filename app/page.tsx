"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { experimental_buildAnthropicPrompt } from 'ai/prompts';
import { OpenAIStream, AnthropicStream } from 'ai';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "", dangerouslyAllowBrowser: true
});

const anthropicClient = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ""
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';


const ChatPage = () => {
  const [service, setService] = useState<'openai' | 'anthropic'>('openai');
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleServiceChange = (newService: 'openai' | 'anthropic') => {
    setService(newService);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;
    
    const newMessage: Message = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    const chatMessages = messages.map(msg => ({ role: msg.role, content: msg.content }));
    
    if (service === 'openai') {
      const response = await openaiClient.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [...chatMessages, { role: 'user', content: input }, { role: 'assistant', content: '' }, { role: 'system', content: '' }],
        stream: true,
        max_tokens: 150
      });
      const stream = OpenAIStream(response);
      // Handle the OpenAI stream
    } else if (service === 'anthropic') {
      const prompt = experimental_buildAnthropicPrompt([{ role: 'user', content: input }]);
      const response = await anthropicClient.completions.create({
        prompt,
        model: 'claude',
        stream: true,
        max_tokens_to_sample: 150
      });
      const stream = AnthropicStream(response);
      // Handle the Anthropic stream
    }

    // Placeholder: Add the AI response handling logic here

    setInput('');
  }, [input, service, messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Chat with AI</h1>
      <div className="flex justify-around mb-4">
        <button onClick={() => handleServiceChange('openai')} 
                className={`py-2 px-4 rounded ${service === 'openai' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
          OpenAI
        </button>
        <button onClick={() => handleServiceChange('anthropic')} 
                className={`py-2 px-4 rounded ${service === 'anthropic' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
          Anthropic
        </button>
      </div>
      <div className="chat-messages h-96 overflow-auto mb-4 bg-gray-100 rounded p-4">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role === 'user' ? 'text-right' : ''}`}>
            {message.role === 'user' ? 'You: ' : 'AI: '}
            {message.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="flex-1 border p-2 rounded mr-2"
        />
        <button onClick={sendMessage} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
export default ChatPage; // This line exports the ChatPage component as the default export
