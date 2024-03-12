import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { OpenAIStream, AnthropicStream } from "ai"; // Ensure these paths are correct
import { experimental_buildAnthropicPrompt } from "ai/prompts"; // Ensure this path is correct
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

type Message = {
  role: string;
  content: string;
};

export async function handleOpenAIRequest(
  messages: Message[],
  openaiClient: OpenAI,
) {
  // Map messages to the format expected by OpenAI, assuming that the role needs to be specified as 'user' or similar for each message
  // If every message should indeed be marked as 'system', then the original mapping can be kept, but this is an unusual use case
  const chatMessages: ChatCompletionMessageParam[] = messages.map((msg) => ({
    role: "function",
    content: msg.content,
    name: "message",
  }));

  const response = await openaiClient.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: chatMessages,
    stream: true,
    max_tokens: 300, // This should be adjusted based on the requirements of your application
  });

  // No changes here as it's already streamlined for the operation in question
  // Additional processing of `response` can be done here if necessary
  return OpenAIStream(response);
}

export async function handleAnthropicRequest(
  messages: Message[],
  anthropicClient: Anthropic,
) {
  // Build the prompt by joining messages contents. Adjust according to your prompt structure needs
  const prompt = experimental_buildAnthropicPrompt(
    messages.map((msg) => ({
      role: msg.role as
        | "function"
        | "system"
        | "user"
        | "assistant"
        | "data"
        | "tool",
      content: msg.content,
    })),
  );

  const response = await anthropicClient.completions.create({
    prompt,
    model: "claude-2",
    stream: true,
    max_tokens_to_sample: 300, // Adjust as needed
  });

  // Assuming AnthropicStream properly formats the streaming data from Anthropic's response
  return AnthropicStream(response);
}
