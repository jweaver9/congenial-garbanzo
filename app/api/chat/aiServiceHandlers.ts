// Assuming these imports are correct and available in your environment
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { OpenAIStream, AnthropicStream } from "ai"; // Adjust based on actual import paths
import { experimental_buildAnthropicPrompt } from "ai/prompts"; // Adjust based on actual import paths
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

type Message = {
  role: string;
  content: string;
};

export async function handleOpenAIRequest(
  messages: ChatCompletionMessageParam[], // Update the type of the 'messages' parameter
  openaiClient: OpenAI,
) {
  // Note: Ensure the model, stream, and max_tokens settings are aligned with your application's requirements
  const response = await openaiClient.chat.completions.create({
    model: "text-davinci-003",
    messages,
    stream: true,
    max_tokens: 300,
  });

  // Assuming OpenAIStream properly formats the streaming data from OpenAI's response
  return OpenAIStream(response);
}

export async function handleAnthropicRequest(
  messages: Message[],
  anthropicClient: Anthropic,
) {
  const prompt = experimental_buildAnthropicPrompt(
    messages.map((msg) => ({ role: "user", content: msg.content })),
  );
  const response = await anthropicClient.completions.create({
    prompt,
    model: "claude-2",
    stream: true,
    max_tokens_to_sample: 300,
  });

  // Assuming AnthropicStream properly formats the streaming data from Anthropic's response
  return AnthropicStream(response);
}