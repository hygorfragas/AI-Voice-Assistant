export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  choices: {
    delta: {
      content?: string;
    };
  }[];
}

export interface ApiError {
  error: string;
  message: string;
}