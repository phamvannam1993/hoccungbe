interface BadgeProps {
  label: string;
  variant?: 'green' | 'red' | 'blue' | 'yellow' | 'gray' | 'orange' | 'purple';
}

const variantClasses: Record<string, string> = {
  green: 'bg-green-100 text-green-700',
  red: 'bg-red-100 text-red-700',
  blue: 'bg-blue-100 text-blue-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  gray: 'bg-gray-100 text-gray-600',
  orange: 'bg-orange-100 text-orange-700',
  purple: 'bg-purple-100 text-purple-700',
};

export default function Badge({ label, variant = 'gray' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]}`}>
      {label}
    </span>
  );
}

export function statusBadge(status: string) {
  const map: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    active: { label: 'Hoạt động', variant: 'green' },
    inactive: { label: 'Không hoạt động', variant: 'gray' },
    banned: { label: 'Bị cấm', variant: 'red' },
    expired: { label: 'Hết hạn', variant: 'yellow' },
    cancelled: { label: 'Đã hủy', variant: 'red' },
    published: { label: 'Đã xuất bản', variant: 'green' },
    draft: { label: 'Nháp', variant: 'gray' },
    true: { label: 'Có', variant: 'green' },
    false: { label: 'Không', variant: 'gray' },
  };
  const cfg = map[String(status)] || { label: status, variant: 'gray' };
  return <Badge label={cfg.label} variant={cfg.variant} />;
}
