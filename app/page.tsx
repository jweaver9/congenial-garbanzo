// page.tsx

'use client';

import React from 'react';
import { useChat } from 'ai/react';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex flex-col h-screen bg-[#240647]">
      <header className="flex justify-between items-center p-4">
        <div className="text-[#E9D6FF] text-lg font-bold">My Account</div>
      </header>

      <main className="flex-1 overflow-auto p-4">
        <Stack spacing={2}>
          {messages.map((message, index) => (
            <Card key={index} variant="outlined" sx={{ alignSelf: message.role === 'user' ? 'end' : 'start' }}>
              <CardContent>
                <Typography sx={{ color: message.role === 'user' ? 'white' : '#B17CEE', fontSize: 18 }}>
                  {message.role === 'user' ? 'You: ' : 'AI: '}
                  {message.content}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </main>

      <footer className="p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            fullWidth
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me something..."
            size="lg"
            sx={{ color: 'white', fontSize: 18 }}
          />
          <Button type="submit" variant="solid" color="primary" sx={{ backgroundColor: '#B17CEE', '&:hover': { backgroundColor: '#9564CD' } }}>
            Send
          </Button>
        </form>
      </footer>
    </div>
  );
}