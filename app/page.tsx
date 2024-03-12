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

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#240647] to-[#1D0A32]">
      <header className="flex justify-center items-center p-4">
        <motion.img
          className="w-40 h-16"
          src="https://via.placeholder.com/180x70"
          alt="Logo"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      </header>

      <main className="flex-1 overflow-auto p-4">
        <Stack spacing={2}>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card variant="outlined" sx={{ alignSelf: message.role === 'user' ? 'end' : 'start', backgroundColor: message.role === 'user' ? '#36175A' : '#B17CEE' }}>
                <CardContent>
                  <Typography sx={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                    {message.role === 'user' ? 'You: ' : 'AI: '}
                    {message.content}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
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
            sx={{ color: 'white', fontSize: 18, fontWeight: 'bold', '&::placeholder': { color: 'rgba(255, 255, 255, 0.7)' } }}
          />
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button type="submit" variant="solid" color="primary" sx={{ backgroundColor: '#E9D6FF', color: '#240647', fontWeight: 'bold', '&:hover': { backgroundColor: '#C7A7FF' } }}>
              Send
            </Button>
          </motion.div>
        </form>
      </footer>
    </div>
  );
}