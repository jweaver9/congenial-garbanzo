import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { experimental_buildAnthropicPrompt } from "ai/prompts"; // Ensure this path is correct

type Message = {
  role: 'user' | 'system' | 'assistant'; // Specify known roles for clarity
  content: string;
};

// Assuming OpenAI and Anthropic clients are initialized here
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropicClient = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function handleOpenAIRequest(messages: Message[]) {
  // Format messages for OpenAI
  const formattedMessages = messages.map(msg => ({
    role: msg.role,
    content: msg.content,
  }));

  const roles = ['user', 'system', 'assistant'];


  // Send request to OpenAI
  const response = await openaiClient.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-3.5-turbo", // Use environment variable for model ID
    messages: formattedMessages,
    max_tokens: 300,
  });

  // Simplify response handling
  return response.choices[0]?.message?.content?.trim() || ""; // Adjust based on the actual structure of OpenAI's response
}

export async function handleAnthropicRequest(messages: Message[]) {
  // Assuming the Anthropic SDK provides a method similar to `createCompletion` to send prompts
  const prompt = experimental_buildAnthropicPrompt(messages.map(msg => ({
    role: msg.role,
    content: msg.content,
  })));

  try {
    // Adjust this call according to the actual Anthropic SDK's method for generating completions
    const response = await anthropicClient.messages.stream({
      max_tokens: 1024,
      messages: [{ "role": "user", "content": "Hello" }],
      model: process.env.ANTHROPIC_MODEL || "claude-2",
    });

    if (response && (response as any)[0]?.choices && (response as any)[0].choices.length > 0) {
      const textStream = (response as any)[0].choices[0].message.text_stream;
      for (const text of textStream) {
        console.log(text);
      }
      return (response as any)[0].choices[0].message.text.trim(); // Simplify and return the first choice's text
    } else {
      throw new Error("No completion choices returned from Anthropic.");
    }
  } catch (error) {
    console.error("Error in handleAnthropicRequest:", error);
    throw error; // Re-throw the error or handle it as needed
  }
}
