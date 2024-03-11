// page.tsx

'use client';

import { useChat } from 'ai/react';
import React, { useEffect, useRef } from 'react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  
  // Automate scrolling to the latest message
  const messagesEndRef = useRef<HTMLDivElement>(null); // Add type assertion here

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto">
      <div className="flex flex-col gap-4 mb-10 p-4 overflow-auto" style={{height: '80vh'}}>
        {messages.map(m => (
          <div key={m.id} className={`whitespace-pre-wrap p-3 rounded-lg ${m.role === 'user' ? 'bg-blue-200 self-end' : 'bg-green-200 self-start'}`}>
            <span className={`${m.role === 'user' ? 'text-blue-800' : 'text-green-800'}`}>{m.role === 'user' ? 'You: ' : 'AI: '}</span>
            {m.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="fixed bottom-0 w-full max-w-md">
        <input
          className="w-full p-2 mb-8 border border-gray-300 rounded shadow-xl focus:ring-2 focus:ring-blue-500 transition-all"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
          autoComplete="off"
        />
      </form>
    </div>
  );
}