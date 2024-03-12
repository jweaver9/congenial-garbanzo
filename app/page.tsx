'use client';

import React from 'react';
import { useChat } from 'ai/react';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import IconButton from '@mui/joy/IconButton';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Input  from '@mui/joy/Input'; 

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div className="container mx-auto p-4">
      <Typography level="h4" component="h1" sx={{ mb: 2 }}>
        Chat with AI
      </Typography>
      <Stack spacing={2} className="chat-messages overflow-auto mb-4 bg-gray-100 rounded p-4" sx={{ maxHeight: '80vh' }}>
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
      </Stack>
      <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 p-2">
        <Stack direction="row" spacing={2}>
          <Input
            fullWidth
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            size="md"
          />
          <IconButton type="submit" variant="solid" color="primary">
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
    </div>
  );
}