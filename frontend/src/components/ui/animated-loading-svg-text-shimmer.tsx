import { motion } from 'motion/react';

interface LoadingBreadcrumbProps {
  text?: string;
}

export function LoadingBreadcrumb({ text = 'Thinking' }: LoadingBreadcrumbProps) {
  const textWidth = text.length * 7.8 + 4;

  return (
    <div className="flex items-center gap-3 min-h-[28px]" role="status" aria-label={`${text}…`}>
      {/* Bouncing dots */}
      <div className="flex gap-[3px] items-center pt-[1px]">
        {([0, 0.15, 0.3] as const).map((delay, i) => (
          <motion.div
            key={i}
            className="w-[5px] h-[5px] rounded-full bg-[#FF6633]"
            animate={{ opacity: [0.35, 1, 0.35], y: [1, -4, 1] }}
            transition={{ duration: 0.9, repeat: Infinity, delay, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* SVG shimmer text — SMIL stop-color animation avoids CSS custom-property hacks */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={textWidth}
        height="20"
        aria-hidden="true"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="ng-loading-shimmer" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4b5563">
              <animate
                attributeName="stop-color"
                values="#4b5563;#9ca3af;#e5e2e3;#9ca3af;#4b5563"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor="#9ca3af">
              <animate
                attributeName="stop-color"
                values="#9ca3af;#e5e2e3;#4b5563;#e5e2e3;#9ca3af"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#e5e2e3">
              <animate
                attributeName="stop-color"
                values="#e5e2e3;#4b5563;#9ca3af;#4b5563;#e5e2e3"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        </defs>
        <text
          x="0"
          y="14"
          fill="url(#ng-loading-shimmer)"
          fontSize="13"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="500"
          letterSpacing="0.01em"
        >
          {text}
        </text>
      </svg>
    </div>
  );
}
