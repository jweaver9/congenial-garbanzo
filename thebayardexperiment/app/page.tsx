'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [selectedModel, setSelectedModel] = useState('openai');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmitWithModel = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form action
    // Integrate model selection logic here, potentially by setting global state, context, or directly invoking an API with both `input` and `selectedModel` as parameters.
    // Since the originalHandleSubmit cannot be modified to accept additional parameters directly, the integration or handling of the model must occur elsewhere.
    
    // Use original handleSubmit for now to continue normal operation
    handleSubmit(e); // Assuming this triggers message sending without needing `input` directly.
    // In scenarios where the `input` is needed, consider rethinking how the `useChat` setup can allow for additional parameters or look to handle the form submission differently.
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Chat with AI</h2>
      {/* Model selection toggle */}
      <div className="flex justify-center gap-4 my-4">
        {['openai', 'anthropic'].map((model) => (
          <label key={model} className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="aiModel"
              value={model}
              checked={selectedModel === model}
              onChange={() => setSelectedModel(model)}
              className="mr-2"
            />
            {model.charAt(0).toUpperCase() + model.slice(1)}
          </label>
        ))}
      </div>
      
      <div className="chat-messages h-96 overflow-auto mb-4 p-4 bg-gray-50">
        {messages.map((m, index) => (
          <div key={index} className={`message ${m.role === 'user' ? 'user' : 'ai'}`}>
            {m.role === 'user' ? 'You: ' : 'AI: '}
            {m.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmitWithModel} className="chat-input">
        <input
          className="w-full p-2 border rounded"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button className="p-2 border rounded" type="submit">Send</button>
      </form>
    </div>
  );
}