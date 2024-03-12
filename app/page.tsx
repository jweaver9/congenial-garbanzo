'use client';

// Import necessary hooks and libraries
import React, { useState, useEffect, useCallback, useRef, ChangeEvent } from 'react';
import { Button, Input, TextField } from '@mui/joy';

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
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Send message and fetch AI response
  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;

    const newMessage: Message = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Send the message to your API endpoint
    const response = await fetch('/api/chat', { // Adjust the URL to your API endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [...messages, newMessage],
      }),
    });

    if (response.ok) {
      const { messages: updatedMessages } = await response.json();
      setMessages(updatedMessages);
    } else {
      console.error('Failed to send message');
    }

    setInput('');
  }, [input, messages]);

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