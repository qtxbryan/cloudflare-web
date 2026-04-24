import { useState, useRef, useEffect, useCallback, type KeyboardEvent, type ChangeEvent } from 'react';
import { motion } from 'motion/react';
import { MessageBubble } from './MessageBubble';
import type { ChatMessage } from '../../types/InferenceTypes';

interface SuggestionChip { icon: string; iconColor: string; label: string; sublabel: string; }

const SUGGESTION_CHIPS: SuggestionChip[] = [
  { icon: 'security', iconColor: 'text-[#FF6633]', label: 'Review WAF Events', sublabel: 'Analyze recent blocked requests and suggest rule tuning.' },
  { icon: 'code', iconColor: 'text-purple-400', label: 'Optimize Worker', sublabel: 'Review edge script performance and memory usage.' },
];

const ease = [0.25, 1, 0.5, 1] as const;

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  onSubmit: (prompt: string) => Promise<void>;
  onRetry: (messageId: string) => Promise<void>;
}

export function ChatInterface({ messages, isStreaming, onSubmit, onRetry }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasMessages = messages.length > 0;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = '20px';
    await onSubmit(trimmed);
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = '20px';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void handleSend(); }
  };

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur  = useCallback(() => setIsFocused(false), []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
      className="flex-1 flex flex-col overflow-hidden"
    >
      {/* Chat canvas */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-16">
          {!hasMessages && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.2, ease }}>
              <div className="text-center mb-14">
                <h1 className="text-[52px] font-black leading-[1.1] tracking-tight text-gradient-heading mb-5">
                  How can I help you today?
                </h1>
                <p className="text-[#9ca3af] text-base max-w-md mx-auto leading-relaxed">
                  Analyze network traffic, optimize security rules, or debug Cloudflare Workers with enterprise-grade AI assistance.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {SUGGESTION_CHIPS.map(({ icon, iconColor, label, sublabel }, i) => (
                  <motion.button
                    key={label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.1, ease }}
                    onClick={() => { setInput(label); textareaRef.current?.focus(); }}
                    className="glass-panel rounded-2xl p-6 text-left transition-all duration-200 group hover:bg-white/[0.05] hover:border-white/[0.14]"
                  >
                    <span className={`material-symbols-outlined ${iconColor} text-[28px] mb-3 block`}>{icon}</span>
                    <p className="text-sm font-semibold text-[#e5e2e3] group-hover:text-white leading-snug">{label}</p>
                    <p className="text-xs text-[#9ca3af] mt-1.5 leading-relaxed">{sublabel}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {hasMessages && (
            <div className="flex flex-col gap-6">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} onRetry={onRetry} />
              ))}
            </div>
          )}

          <div ref={bottomRef} className="h-4" />
        </div>
      </div>

      {/* Input area */}
      <div className="px-6 pb-6 pt-2">
        <div className="max-w-2xl mx-auto">
          <div
            className="p-px rounded-2xl transition-all duration-200"
            style={isFocused
              ? { background: 'linear-gradient(135deg, rgba(255,102,51,0.6) 0%, rgba(255,140,0,0.35) 50%, rgba(255,102,51,0.5) 100%)' }
              : { background: 'rgba(255,255,255,0.07)' }}
          >
            <div className="bg-[#0c0c0c] rounded-[calc(1rem-1px)] flex items-center gap-3 px-4 py-3">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Ask anything about your infrastructure…"
                rows={1}
                aria-label="Message input"
                className="flex-1 bg-transparent text-[#e5e2e3] text-sm placeholder:text-[#9ca3af]/50 outline-none resize-none leading-5 overflow-hidden p-0 self-center"
                style={{ height: '20px' }}
              />
              <button
                onClick={() => void handleSend()}
                disabled={!input.trim() || isStreaming}
                aria-label="Send message"
                className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-[#FF6633] to-[#E07318] disabled:opacity-30 transition-all hover:scale-105 active:scale-95"
              >
                <span className={`material-symbols-outlined text-white text-[15px] ${isStreaming ? 'animate-spin' : ''}`}>
                  {isStreaming ? 'autorenew' : 'arrow_upward'}
                </span>
              </button>
            </div>
          </div>
          <p className="text-[10px] text-[#9ca3af]/40 text-center mt-2.5 tracking-wide">
            AI responses may be inaccurate. Verify critical configurations independently.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
