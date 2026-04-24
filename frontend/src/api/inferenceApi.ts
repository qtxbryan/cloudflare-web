import type { InferenceResponse, StreamChunk } from '../types/InferenceTypes';

export class InferenceError extends Error {
  readonly statusCode: number;
  constructor(statusCode: number) {
    super(`Inference API error: ${statusCode}`);
    this.name = 'InferenceError';
    this.statusCode = statusCode;
  }
}

export async function sendMessage(prompt: string): Promise<InferenceResponse> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL as string;
  const res = await fetch(`${baseUrl}/api/inference`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new InferenceError(res.status);
  return res.json() as Promise<InferenceResponse>;
}

export async function streamMessage(
  prompt: string,
  onChunk: (chunk: StreamChunk) => void,
  signal?: AbortSignal,
): Promise<void> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL as string;
  const res = await fetch(`${baseUrl}/api/inference/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
    signal,
  });

  if (!res.ok) throw new InferenceError(res.status);
  if (!res.body) {
    onChunk({ type: 'error', message: 'No response body from server' });
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data: ')) continue;
        const data = trimmed.slice(6).trim();

        if (data === '[DONE]') {
          onChunk({ type: 'done' });
          return;
        }
        if (data === '[ERROR]') {
          onChunk({ type: 'error', message: 'Stream error from server' });
          return;
        }
        try {
          const parsed = JSON.parse(data) as { response?: string };
          if (parsed.response) onChunk({ type: 'token', text: parsed.response });
        } catch {
          // skip malformed SSE line
        }
      }
    }
    onChunk({ type: 'done' });
  } finally {
    reader.releaseLock();
  }
}
