import { getStatusConfig } from '../../utils/statusColor';

export default function Badge({ status, className = '', size = 'md' }) {
  const config = getStatusConfig(status);

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 sm:px-3 py-1 text-xs',
    lg: 'px-3 sm:px-4 py-1.5 text-xs sm:text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 sm:gap-1.5 rounded-full font-semibold
        ${config.bg} ${config.text} border ${config.border}
        ${sizes[size]}
        ${className}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} shrink-0`} />
      <span className="truncate">{config.label}</span>
    </span>
  );
}

export function CategoryBadge({ category, label, color, className = '', size = 'md' }) {
  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 sm:px-3 py-1 text-xs',
    lg: 'px-3 sm:px-4 py-1.5 text-xs sm:text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 sm:gap-1.5 rounded-full font-semibold ${sizes[size]} ${className}`}
      style={{
        backgroundColor: `${color}15`,
        color: color,
        border: `1px solid ${color}30`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="truncate">{label}</span>
    </span>
  );
}
