// page.tsx

'use client';

import { useChat } from 'ai/react';
import React, { useRef, useEffect } from 'react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  // Automate scrolling to the latest message
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto">
      {/* Welcome Message */}
      <div className="mb-6 bg-blue-500 text-white p-4 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-center">Welcome to Bayard</h1>
        <p className="text-center mt-2">Your AI companion is ready to chat.</p>
      </div>
      
      <div className="flex flex-col gap-4 mb-10 p-4 overflow-auto rounded-lg shadow-inner" style={{height: '80vh', backgroundColor: '#f0f0f5'}}>
        {messages.map((m, index) => (
          <div key={index} className={`whitespace-pre-wrap p-3 rounded-lg ${m.role === 'user' ? 'bg-blue-500 self-end' : 'bg-green-500 self-start'} text-white`}>
            <span>{m.role === 'user' ? 'You: ' : 'Bayard: '}</span>
            {m.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="fixed bottom-0 w-full max-w-md bg-white shadow-lg p-4 rounded-t-lg">
        <input
          className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 transition-all placeholder-black"
          style={{backgroundColor: '#e6e6ea'}}
          value={input}
          onChange={handleInputChange}
          placeholder="Say something..."
          autoComplete="off"
        />
      </form>
    </div>
  );
}