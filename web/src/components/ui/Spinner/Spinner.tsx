import { cn } from '@/lib/utils';

const spinnerClass = cn(
  'border-2',
  'border-[color-mix(in_oklab,currentColor_28%,transparent)]',
  'border-t-current',
  'rounded-full',
  'animate-spin',
  '[animation-duration:0.6s]',
  'flex-[0_0_auto]',
);

type SpinnerSize = 'small' | 'base' | 'large';

const spinnerSizeMap: Record<SpinnerSize, string> = {
  small: cn('size-3.5'),
  base: cn('size-4'),
  large: cn('size-8.5 border-3'),
};

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

function Spinner({ size = 'base', className }: SpinnerProps) {
  return <div className={cn(spinnerClass, spinnerSizeMap[size], className)} />;
}

export type { SpinnerSize };
export default Spinner;
