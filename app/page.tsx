'use client';

// Import necessary hooks, libraries, and icons
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import TextField from '@mui/joy/TextField';
import IconButton from '@mui/joy/IconButton';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import { Input } from '@mui/joy';

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

  // Automatically scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="container mx-auto p-4">
      <Typography level="h4" component="h1" sx={{ mb: 2 }}>
        Chat with AI
      </Typography>
      <Stack spacing={2} className="chat-messages h-96 overflow-auto mb-4 bg-gray-100 rounded p-4">
        {messages.map((message, index) => (
          <Card key={index} variant="outlined" sx={{ alignSelf: message.role === 'user' ? 'end' : 'start' }}>
            <CardContent>
              <Typography level="body-sm">
                {message.role === 'user' ? 'You: ' : 'AI: '}
                {message.content}
              </Typography>
            </CardContent>
          </Card>
        ))}
        <div ref={messagesEndRef} />
      </Stack>
      <Stack direction="row" spacing={2}>
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          autoFocus
          sx={{ flex: 1 }}
        />
        <IconButton variant="solid" color="primary" onClick={sendMessage}>
          <SendIcon />
        </IconButton>
      </Stack>
    </div>
  );
};

export default ChatPage;