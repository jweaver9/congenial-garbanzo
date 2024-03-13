"use client";

import React from 'react';
import { useChat } from 'ai/react';
import "@fontsource-variable/inter-tight";
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import { motion } from 'framer-motion';

// Enhanced sidebar with dynamic content
function Sidebar() {
  const sidebarItems = ["Home", "Profile", "Messages", "Settings"];
  return React.createElement("div", { className: "w-64 h-full bg-gray-200 p-5 shadow-lg" },
    React.createElement("h4", { className: "font-lexend text-lg mb-4" }, "Navigation"),
    React.createElement(List, { size: "sm" },
      sidebarItems.map((item, index) =>
        React.createElement(ListItem, { key: index },
          React.createElement(ListItemButton, { 
            href: "#", 
            sx: { '&:hover': { bgcolor: 'primary.light', color: 'white' } } 
          }, item)
        )
      )
    )
  );
}

// Main chat component with aesthetic enhancements
export default function RefactoredChatPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return React.createElement("div", { className: "flex h-screen" },
    React.createElement(Sidebar),
    React.createElement("div", { className: "flex flex-col flex-grow" },
      React.createElement("header", { className: "flex justify-between items-center p-8 bg-primary.main text-white shadow-md" },
        React.createElement(Typography, { level: "h4", style: { fontSize: '24px' } }, "Bayard Chat")
      ),
      React.createElement("main", { className: "flex-1 overflow-auto p-8", style: { backgroundColor: '#F7F7F7' } },
        React.createElement(Stack, { spacing: 2 },
          messages.map((message, index) =>
            React.createElement(motion.div, {
              key: index,
              initial: { opacity: 0, y: 50 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.2, delay: index * 0.05 }
            },
              React.createElement(Card, {
                variant: "outlined", sx: {
                  borderColor: message.role === 'user' ? '#1976d2' : '#9e9e9e',
                  bgcolor: message.role === 'user' ? '#e3f2fd' : '#eceff1',
                  '&:hover': { boxShadow: 'md', transform: 'scale(1.02)' },
                  transition: 'all 0.2s ease-in-out',
                }
              },
                React.createElement(CardContent, null,
                  React.createElement(Typography, { sx: { color: '#333', fontFamily: 'Lexend' } },
                    React.createElement("strong", null, message.role === 'user' ? 'You' : 'AI'), ": ", message.content
                  )
                )
              )
            )
          ))
      ),
      React.createElement("footer", { className: "p-8 bg-white shadow-up" },
        React.createElement("form", { onSubmit: handleSubmit, className: "flex gap-4 items-center" },
          React.createElement(Input, {
            fullWidth: true,
            value: input,
            onChange: handleInputChange,
            placeholder: "Type your message here...",
            size: "lg",
            variant: "soft"
          }),
          React.createElement(Button, { type: "submit", variant: "solid", sx: { bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } } }, "Send")
        )
      )
    )
  );
}