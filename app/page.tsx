"use client";

import React from 'react';
import { useChat } from 'ai/react';
import "@fontsource/lexend";
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import { motion } from 'framer-motion';

export default function RefactoredChatPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return React.createElement("div", {className: "flex flex-col h-screen"},
    React.createElement("header", {className: "flex justify-between items-center px-8 py-4 bg-[#FAFAFA] shadow-md"},
      React.createElement(Typography, {level: "h4", component: "h1"}, "Bayard Chat")
    ),
    React.createElement("main", {className: "flex-1 overflow-auto p-8 bg-[#F0F2F5]"},
      React.createElement(Stack, {spacing: 2},
        messages.map((message, index) => 
          React.createElement(motion.div, {
            key: index,
            initial: { opacity: 0, y: 50 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.2, delay: index * 0.05 }
          },
            React.createElement(Card, {variant: "outlined", sx: {
              borderColor: message.role === 'user' ? 'primary.main' : 'neutral.dark',
              bgcolor: message.role === 'user' ? 'info.lighter' : 'neutral.light',
            }},
              React.createElement(CardContent, null,
                React.createElement(Typography, {sx: { color: '#333' }},
                  React.createElement("strong", null, message.role === 'user' ? 'You' : 'AI'), ": ", message.content
                )
              )
            )
          )
        )
      )
    ),
    React.createElement("footer", {className: "px-8 py-4 bg-white shadow-up"},
      React.createElement("form", {onSubmit: handleSubmit, className: "flex gap-4"},
        React.createElement(Input, {
          fullWidth: true,
          value: input,
          onChange: handleInputChange,
          placeholder: "Type your message here...",
          size: "lg",
          variant: "soft"
        }),
        React.createElement(Button, {type: "submit", variant: "solid", color: "success"}, "Send")
      )
    )
  );
}