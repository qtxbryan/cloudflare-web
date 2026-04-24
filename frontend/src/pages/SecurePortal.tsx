import { motion } from 'motion/react';
import { Navbar } from '../components/layout/Navbar';
import { SecurityBadge } from '../components/portal/SecurityBadge';
import { ChatInterface } from '../components/portal/ChatInterface';
import { useInference } from '../hooks/useInference';

const ease = [0.25, 1, 0.5, 1] as const;

export function SecurePortal() {
  const { messages, isStreaming, submit, retry, loadSession, reset } = useInference();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex h-screen portal-gradient overflow-hidden"
    >
      {/* Navbar slides in from left */}
      <motion.div
        initial={{ x: -240, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease }}
        className="w-60 flex-shrink-0"
      >
        <Navbar onNewChat={reset} onSelectSession={loadSession} />
      </motion.div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* SecurityBadge: diagonal from center to top-right via transform */}
        <motion.div
          initial={{ opacity: 0, x: 'calc(-50vw + 60px)', y: 'calc(-50vh + 10px)' }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
          className="absolute top-5 right-6 z-10"
        >
          <SecurityBadge />
        </motion.div>

        {/* ChatInterface with fade-in */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15, ease }}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <ChatInterface
            messages={messages}
            isStreaming={isStreaming}
            onSubmit={submit}
            onRetry={retry}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
