import { cn } from '@/lib/utils';

const progressBarWrapperClass =
  'flex flex-1 items-center tabular-nums gap-2.5 min-w-[140px]';

const progressBarClass =
  'flex-1 h-1.5 min-w-[80px] bg-(--surface-alt) rounded-full overflow-hidden';

const progressBarFillClass =
  'block h-full bg-(--brand) rounded-full transition-[width] duration-[600ms] ease-(--ease)';

const progressBarPercentClass = 'text-(--text-dim)';

type ProgressBarSize = 'small' | 'large';

interface ProgressBarProps {
  progress: number;
  showPercent?: boolean;
  className?: string;
  size?: ProgressBarSize;
}

function ProgressBar({
  progress,
  showPercent = true,
  size = 'small',
  className = '',
}: ProgressBarProps) {
  const progressBarSizeClass = size === 'large' ? 'h-2' : '';

  return (
    <div className={cn(progressBarWrapperClass, className)}>
      <div className={cn(progressBarClass, progressBarSizeClass)}>
        <span
          className={progressBarFillClass}
          style={{ width: progress + '%' }}
        />
      </div>
      {showPercent && (
        <span className={progressBarPercentClass}>{progress}%</span>
      )}
    </div>
  );
}

export default ProgressBar;
