// app/chat.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit: originalHandleSubmit } = useChat();
  const [model, setModel] = useState('openai');

  // Automate scrolling to the latest message
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Wrap the original handleSubmit to include model selection
  const handleSubmit = (e) => {
    originalHandleSubmit(e, { model });
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Chat with AI</h2>
      {/* Model Selection */}
      <div className="my-4">
        <select className="p-2 border rounded" value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic</option>
        </select>
      </div>

      <div className="chat-messages h-96 overflow-auto mb-4 p-4 bg-gray-50">
        {messages.map((m, index) => (
          <div key={index} className={`message ${m.role === 'user' ? 'user' : 'ai'}`}>
            <span>{m.role === 'user' ? 'You: ' : 'AI: '}</span>
            {m.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input">
        <input type="text" value={input} onChange={handleInputChange} placeholder="Type your message..." />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}