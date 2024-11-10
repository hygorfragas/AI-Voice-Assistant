import { HfInference } from "@huggingface/inference";
import type { ChatMessage, ChatResponse } from '../types/api';

const API_KEY = "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";
const API_KEY = "hf_api";
const MODEL = "meta-llama/Llama-3.2-3B-Instruct";

export class AIService {
  private client: HfInference;

  constructor() {
    this.client = new HfInference(API_KEY);
  }

  async *chatStream(message: string): AsyncGenerator<string, void, unknown> {
    if (!message.trim()) {
      throw new Error('Message cannot be empty');
    }

    try {
      const messages: ChatMessage[] = [
        {
          role: "alwalid",
          content: message
        }
      ];

      const stream = await this.client.chatCompletionStream({
        model: MODEL,
        messages,
        max_tokens: 500,
        temperature: 0.7,
        top_p: 0.9,
      });

      for await (const chunk of stream) {
        const response = chunk as ChatResponse;
        if (response.choices?.[0]?.delta?.content) {
          yield response.choices[0].delta.content;
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to communicate with AI service';
      console.error('Chat stream error:', error);
      throw new Error(errorMessage);
    }
  }
}
