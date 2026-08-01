import { cn } from '@/lib/utils';
import Icon from '../Icon/Icon';

const ICON_SIZE = 11;
const chipClass =
  'inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full font-semibold text-[12px] bg-(--surface-alt) text-(--text-muted) border border-(--border)';
const chipStatusClassMap: Record<string, string> = {
  success: 'bg-(--success-soft) text-(--success)',
  warn: 'bg-(--warn-soft) text-(--warn)',
  danger: 'bg-(--danger-soft) text-(--danger)',
};

interface ChipProps {
  className?: string;
  title: string;
  label: string;
  type: 'success' | 'warn' | 'danger';
  icon?: string;
  onClick?: () => void;
  hasBorder?: boolean;
}

function Chip({
  className,
  title = '',
  label,
  type,
  icon,
  onClick,
  hasBorder,
}: ChipProps) {
  return (
    <button
      className={cn(
        chipClass,
        chipStatusClassMap[type],
        className,
        !hasBorder && 'border-transparent',
      )}
      onClick={onClick}
      title={title}
    >
      {icon && <Icon size={ICON_SIZE} type={icon} />}
      {label}
    </button>
  );
}

export default Chip;
