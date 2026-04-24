import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onNewChat?: () => void;
  onSelectSession?: (name: string) => void;
}

const CHAT_HISTORIES = [
  'WAF Rules Optimization',
  'DDoS Mitigation Strategy',
  'Workers Script Debug',
  'Security Audit Q4 2024',
  'Load Balancer Configuration',
  'API Rate Limiting Setup',
  'Zero Trust Policy Review',
  'SSL Certificate Renewal',
  'Firewall Rule Analysis',
  'DNS Configuration',
  'R2 Storage Permissions',
  'Access Policy Update',
];

export function Navbar({ onNewChat, onSelectSession }: NavbarProps) {
  const { email } = useAuth();
  const displayName = email.split('@')[0] ?? email;
  const initial = displayName[0]?.toUpperCase() ?? '?';

  return (
    <aside className="w-60 flex-shrink-0 bg-[#0a0a0a] border-r border-white/[0.05] flex flex-col h-screen sticky top-0">

      {/* Brand */}
      <div className="px-4 pt-5 pb-5 flex items-center gap-2.5">
        <span
          className="material-symbols-outlined text-[#FF6633] text-[20px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          shield_lock
        </span>
        <span className="text-[13px] font-bold text-[#e5e2e3] tracking-wide">NeuralGate</span>
      </div>

      {/* New Chat */}
      <div className="px-3 pb-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-[#e5e2e3] hover:text-white bg-[#FF6633]/10 hover:bg-[#FF6633]/15 border border-[#FF6633]/20 hover:border-[#FF6633]/35 transition-all active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[#FF6633] text-[17px]">add</span>
          New Chat
        </button>
      </div>

      {/* Chat history */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        <p className="px-3 mb-1.5 text-[10px] font-semibold text-[#9ca3af]/40 uppercase tracking-[0.12em]">
          Recents
        </p>
        {CHAT_HISTORIES.map((chat) => (
          <button
            key={chat}
            onClick={() => onSelectSession?.(chat)}
            className="w-full group flex items-center gap-2.5 text-left px-3 py-[7px] rounded-lg text-[12.5px] text-[#9ca3af] hover:text-[#e5e2e3] hover:bg-white/[0.05] transition-colors"
          >
            <span className="material-symbols-outlined text-[13px] text-[#9ca3af]/25 group-hover:text-[#9ca3af]/55 transition-colors flex-shrink-0">
              chat_bubble
            </span>
            <span className="truncate">{chat}</span>
          </button>
        ))}
      </div>

      {/* User footer */}
      <div className="px-3 py-3 border-t border-white/[0.05]">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/[0.04] transition-colors group cursor-default">
          <div className="w-6 h-6 rounded-full bg-[#FF6633]/15 border border-[#FF6633]/25 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-bold text-[#FF6633]">{initial}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-[#e5e2e3] truncate leading-snug">{displayName}</p>
            <p className="text-[10px] text-[#9ca3af]/60 truncate">{email}</p>
          </div>
          <button className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" title="Sign out">
            <span className="material-symbols-outlined text-[#9ca3af] hover:text-red-400 text-[16px] transition-colors">
              logout
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
