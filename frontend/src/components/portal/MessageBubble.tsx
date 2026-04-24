import { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { LoadingBreadcrumb } from '../ui/animated-loading-svg-text-shimmer';
import { formatTimestamp } from '../../utils/formatTimestamp';
import { useAuth } from '../../context/AuthContext';
import type { ChatMessage } from '../../types/InferenceTypes';

interface MessageBubbleProps {
  message: ChatMessage;
  onRetry?: (id: string) => void;
}

export function MessageBubble({ message, onRetry }: MessageBubbleProps) {
  const { email } = useAuth();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [message.content]);

  const isUser = message.role === 'user';
  const isPending = message.status === 'pending';
  const isError = message.status === 'error';
  const isComplete = message.status === 'complete';
  const showActions = (isComplete || isError) && message.content.length > 0;
  const userInitial = (email.split('@')[0]?.[0] ?? 'U').toUpperCase();

  const userAvatar = (
    <div className="w-8 h-8 rounded-full bg-[#FF6633]/15 border border-[#FF6633]/25 flex items-center justify-center flex-shrink-0 self-start mt-0.5">
      <span className="text-[11px] font-bold text-[#FF6633]">{userInitial}</span>
    </div>
  );

  const assistantAvatar = (
    <div className="w-8 h-8 rounded-full bg-[#FF6633]/10 border border-[#FF6633]/18 flex items-center justify-center flex-shrink-0 self-start mt-0.5">
      <span
        className="material-symbols-outlined text-[#FF6633] text-[15px]"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        shield_lock
      </span>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
      className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {isUser ? userAvatar : assistantAvatar}

      <div className={`flex flex-col gap-1.5 max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Bubble */}
        {isPending ? (
          <div className="glass-panel rounded-2xl rounded-tl-md px-4 py-3">
            <LoadingBreadcrumb text="Thinking" />
          </div>
        ) : isError ? (
          <div className="bg-red-500/[0.08] border border-red-500/20 rounded-2xl px-4 py-3">
            <p className="text-red-400/90 text-sm leading-relaxed">
              {message.content || 'Something went wrong.'}
            </p>
          </div>
        ) : (
          <div
            className={
              isUser
                ? 'bg-[#FF6633]/[0.12] border border-[#FF6633]/20 rounded-2xl rounded-tr-md px-4 py-3'
                : 'glass-panel rounded-2xl rounded-tl-md px-4 py-3'
            }
          >
            <p className="text-[#e5e2e3] text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
        )}

        {/* Timestamp + actions */}
        {showActions && (
          <div className={`flex items-center gap-1 px-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className="text-[10px] text-[#9ca3af]/40 leading-none">
              {formatTimestamp(message.timestamp)}
            </span>
            {isComplete && (
              <button
                onClick={() => void handleCopy()}
                className="p-1 rounded-md text-[#9ca3af]/40 hover:text-[#9ca3af] hover:bg-white/[0.05] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF6633]/50"
                aria-label={copied ? 'Copied' : 'Copy message'}
              >
                <span className="material-symbols-outlined text-[13px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
              </button>
            )}
            {!isUser && onRetry && (
              <button
                onClick={() => onRetry(message.id)}
                className="p-1 rounded-md text-[#9ca3af]/40 hover:text-[#9ca3af] hover:bg-white/[0.05] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF6633]/50"
                aria-label="Retry response"
              >
                <span className="material-symbols-outlined text-[13px]">refresh</span>
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
