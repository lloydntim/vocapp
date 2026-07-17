import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';

type TextSize = 'small' | 'base' | 'large';

interface TextProps extends PropsWithChildren {
  className?: string;
  size?: TextSize;
  role?: string;
}

const textSizeClassMap: Record<TextSize, string> = {
  small: 'text-sm',
  base: 'text-base',
  large: 'text-lg',
};
const textClass = 'text-[var(--text)]';

function Text({ children, className, size = 'base', role }: TextProps) {
  const textSizeClass = textSizeClassMap[size];
  return (
    <p className={cn(textClass, textSizeClass, className)} role={role}>
      {children}
    </p>
  );
}

export default Text;
