import { Badge } from '../ui/Badge';

interface SecurityBadgeProps {
  label?: string;
}

export function SecurityBadge({ label = 'Zero Trust Active' }: SecurityBadgeProps) {
  return (
    <Badge variant="green" className="!py-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      {label}
    </Badge>
  );
}
