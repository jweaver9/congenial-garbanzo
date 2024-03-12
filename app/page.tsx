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
import Sidebar from './components/sidebar'; // Assuming you have a Sidebar component
import { motion } from 'framer-motion';
import "@fontsource/lexend"; 
import './App.css'; // Import additional CSS for custom styles

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="App">
      <Sidebar /> {/* Sidebar component */}
      <div className="chatContainer">
        <header className="chatHeader">
          <Typography level="h2">Bayard</Typography>
        </header>

        <main className="chatMain">
          <Stack spacing={4}>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card variant="outlined" className="messageCard">
                  <CardContent>
                    <Typography className={`messageText ${message.role}`}>
                      <strong>{message.role === 'user' ? 'You' : 'AI'}</strong>: {message.content}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Stack>
        </main>

        <footer className="chatFooter">
          <form onSubmit={handleSubmit} className="messageForm">
            <Input
              fullWidth
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              size="lg"
            />
            <Button type="submit" variant="solid">Send</Button>
          </form>
        </footer>
      </div>
    </div>
  );
}
