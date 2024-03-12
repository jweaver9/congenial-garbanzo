// Ensure "use client" is correctly placed if needed, depending on your setup.
"use client";
import next from "next";
import React, { useState, useEffect, useRef } from "react";
import useChat from "ai/react";

function ChatComponent() {
  const [selectedModel, setSelectedModel] = useState<string>('openai');
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Array<{ role: string, content: string }>>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmitWithModel = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    // Your submission logic here
    console.log("Form submitted with model:", selectedModel, "and input:", input);
    // Reset input field after submission
    setInput('');
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Chat with AI</h2>
      {/* Model selection toggle */}
      <div className="flex justify-center gap-4 my-4">
        {["openai", "anthropic"].map((model) => (
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
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role === "user" ? "user" : "ai"}`}
          >
            {message.role === "user" ? "You: " : "AI: "}
            {message.content}
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
        <button className="p-2 border rounded" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatComponent;
