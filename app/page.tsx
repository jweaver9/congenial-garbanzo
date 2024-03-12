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
import { motion } from 'framer-motion';
import "@fontsource/lexend"; 

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-[#1D0A32]">
      <header className="flex justify-between items-center px-8 py-4 bg-white dark:bg-[#1D0A32] shadow">

        <div className="text-[#1D0A32] dark:text-white text-lg font-semibold"><Typography level="h2">Bayard</Typography></div>
      </header>

      <main className="flex-1 overflow-auto p-8">
        <Stack spacing={4}>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card variant="outlined" sx={{ borderRadius: 4, boxShadow: 'none', border: '1px solid #E5E5E5', backgroundColor: 'transparent' }}>
                <CardContent>
                  <Typography sx={{ color: message.role === 'user' ? '#333333' : '#1D0A32', fontSize: 16 }}>
                    <strong>{message.role === 'user' ? 'You' : 'AI'}</strong>: {message.content}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Stack>
      </main>

      <footer className="px-8 py-4 bg-white dark:bg-[#240647] shadow">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <Input
            fullWidth
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            size="lg"
            sx={{ fontSize: 16, '&::placeholder': { color: '#BDBDBD' } }}
          />
          <Button type="submit" variant="soft" color="primary" sx={{  }}> 
            Send
          </Button>
        </form>
      </footer>
    </div>
  );
}