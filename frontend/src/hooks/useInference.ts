import { useState, useCallback, useRef, useEffect } from 'react';
import { streamMessage, InferenceError } from '../api/inferenceApi';
import type { ChatMessage } from '../types/InferenceTypes';

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface UseInferenceReturn {
  messages: ChatMessage[];
  isStreaming: boolean;
  submit: (prompt: string) => Promise<void>;
  retry: (messageId: string) => Promise<void>;
  loadSession: (sessionName: string) => void;
  reset: () => void;
}

export function useInference(): UseInferenceReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const runStream = useCallback(async (prompt: string, assistantId: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setIsStreaming(true);

    try {
      await streamMessage(
        prompt,
        (chunk) => {
          if (chunk.type === 'token') {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: m.content + chunk.text, status: 'streaming' }
                  : m,
              ),
            );
          } else if (chunk.type === 'done') {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, status: 'complete', timestamp: new Date().toISOString() }
                  : m,
              ),
            );
          } else {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, status: 'error', content: chunk.message, timestamp: new Date().toISOString() }
                  : m,
              ),
            );
          }
        },
        controller.signal,
      );
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      const detail =
        err instanceof InferenceError
          ? `API error (${err.statusCode}). Please try again.`
          : 'An unexpected error occurred.';
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, status: 'error', content: detail, timestamp: new Date().toISOString() }
            : m,
        ),
      );
    } finally {
      setIsStreaming(false);
    }
  }, []);

  const submit = useCallback(
    async (prompt: string) => {
      const userMsg: ChatMessage = {
        id: makeId(),
        role: 'user',
        content: prompt,
        timestamp: new Date().toISOString(),
        status: 'complete',
      };
      const assistantId = makeId();
      const pendingMsg: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        status: 'pending',
      };
      setMessages((prev) => [...prev, userMsg, pendingMsg]);
      await runStream(prompt, assistantId);
    },
    [runStream],
  );

  const retry = useCallback(
    async (messageId: string) => {
      const current = messagesRef.current;
      const idx = current.findIndex((m) => m.id === messageId);
      if (idx === -1) return;
      const userMsg = [...current.slice(0, idx)].reverse().find((m) => m.role === 'user');
      if (!userMsg) return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, content: '', status: 'pending' as const, timestamp: new Date().toISOString() }
            : m,
        ),
      );
      await runStream(userMsg.content, messageId);
    },
    [runStream],
  );

  const loadSession = useCallback((sessionName: string) => {
    abortRef.current?.abort();
    const ts = new Date().toISOString();
    setMessages([
      { id: makeId(), role: 'user', content: sessionName, timestamp: ts, status: 'complete' },
      {
        id: makeId(),
        role: 'assistant',
        content: `Here's a summary of the "${sessionName}" session. This conversation was loaded from your history. You can continue from where you left off.`,
        timestamp: ts,
        status: 'complete',
      },
    ]);
    setIsStreaming(false);
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setIsStreaming(false);
  }, []);

  return { messages, isStreaming, submit, retry, loadSession, reset };
}
