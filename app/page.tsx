// Ensure "use client" is correctly placed if needed, depending on your setup.
// It seems to be part of a directive or comment that might be specific to your environment or build tool.

import React, { useState, useEffect, useRef } from "react";
import { useChat } from "ai/react";
import { UseChatHelpers } from "ai/react"; // Import the UseChatHelpers type.

// Assuming useChat is a custom hook that provides state and functionality for chatting,
// including message state, input handling, and potentially submitting messages.

const ChatPage = () => {
  // Add the 'selectedModel' property to the UseChatHelpers type
  interface UseChatHelpersWithModel extends UseChatHelpers {
    selectedModel: string;
    setSelectedModel: React.Dispatch<React.SetStateAction<string>>;
  }

  const { messages, input, handleInputChange, handleSubmit, selectedModel, setSelectedModel } = useChat() as UseChatHelpersWithModel; // Cast the useChat() result to UseChatHelpersWithModel

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSubmitWithModel = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission action.
    
    // Your custom logic for model selection and message submission here.
    // This might involve using the selectedModel state to determine how to submit the message.
    handleSubmit(e); // This should be the method provided by useChat for submitting messages.
  };

  useEffect(() => {
    // Logic to scroll to the bottom of the message list every time the messages update.
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Chat with AI</h2>
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
          <div key={index} className={`message ${message.role === "user" ? "user" : "ai"}`}>
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
};

export default ChatPage;

// Assuming the original `handleSubmit` was a placeholder for your actual submit logic within useChat.
