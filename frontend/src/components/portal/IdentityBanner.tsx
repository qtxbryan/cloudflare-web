import { useAuth } from '../../context/AuthContext';
import { formatTimestamp } from '../../utils/formatTimestamp';

type BannerVariant = 'card' | 'header';

interface IdentityBannerProps {
  variant?: BannerVariant;
}

export function IdentityBanner({ variant = 'card' }: IdentityBannerProps) {
  const { email, country, timestamp } = useAuth();
  const initial = email.charAt(0).toUpperCase();

  if (variant === 'header') {
    return (
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-semibold text-[#e5e2e3]">{email}</p>
          <p className="text-[10px] text-[#9ca3af]">
            Authenticated · {country}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6633] to-[#E07318] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {initial}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-input rounded-xl p-3 space-y-0.5">
      <p className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-widest">
        Authenticating as
      </p>
      <p className="text-sm font-medium text-[#e5e2e3] truncate">{email}</p>
      <p className="text-[10px] text-[#9ca3af]">{formatTimestamp(timestamp)}</p>
    </div>
  );
}
