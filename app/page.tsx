'use client';

// Import necessary hooks and libraries
import React, { useState, useEffect, useCallback, useRef, KeyboardEvent } from 'react';
import { Button, Input } from '@mui/joy';

// Define the Message type for consistency
type Message = {
  role: 'user' | 'assistant';
  content: string;
};

// The ChatPage component
const ChatPage = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Send message and fetch AI response
  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;

    const newMessage: Message = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Adjust the URL to your API endpoint
    const response = await fetch('/api/v1/chat/completions', { // Use the correct endpoint here
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: input,
      }),
    });

    if (response.ok) {
      const { messages: updatedMessages } = await response.json();
      setMessages(updatedMessages);
    } else {
      console.error('Failed to send message');
    }

    setInput('');
  }, [input]);

  // Handle Enter key press to send messages
  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  // Automatically scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Chat with AI</h1>
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
        <Input
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 border p-2 rounded mr-2"
        />
        <Button onClick={sendMessage} color="primary">
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatPage;
