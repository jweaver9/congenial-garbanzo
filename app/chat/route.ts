import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { experimental_buildAnthropicPrompt } from "ai/prompts";
import { OpenAIStream, AnthropicStream, StreamingTextResponse } from "ai";

// Initialize both AI Clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages, service } = await req.json();

  // Basic input validation
  if (
    !messages ||
    !Array.isArray(messages) ||
    messages.length === 0 ||
    !service
  ) {
    return new Response(
      JSON.stringify({ error: "Invalid or missing input data." }),
      { status: 400 },
    );
  }

  try {
    switch (service) {
      case "openai": {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          stream: true,
        });
        const stream = OpenAIStream(response);
        return new StreamingTextResponse(stream);
      }
      case "anthropic": {
        const prompt = experimental_buildAnthropicPrompt(
          messages.map((msg) => msg.content),
        );
        const response = await anthropic.completions.create({
          prompt,
          model: "claude-2",
          stream: true,
          max_tokens_to_sample: 300,
        });
        const stream = AnthropicStream(response); // Assuming AnthropicStream works similarly
        return new StreamingTextResponse(stream);
      }
      default:
        return new Response(
          JSON.stringify({ error: "Unsupported AI service specified." }),
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return new Response(
      JSON.stringify({
        error: "ServerError",
        message: "An error occurred while processing your request.",
      }),
      { status: 500 },
    );
  }
}
