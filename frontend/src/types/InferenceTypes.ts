export interface InferenceRequest {
  prompt: string;
}

export interface InferenceResponse {
  response: string;
  model?: string;
}

export type MessageStatus = 'pending' | 'streaming' | 'complete' | 'error';
export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  status: MessageStatus;
  model?: string;
}

export type StreamChunk =
  | { type: 'token'; text: string }
  | { type: 'done'; model?: string }
  | { type: 'error'; message: string };
