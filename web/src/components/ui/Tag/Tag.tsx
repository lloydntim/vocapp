import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';

interface TagProps extends PropsWithChildren {
  className?: string;
}

const tagContainerClass =
  'bg-[var(--brand-soft)] text-[var(--brand)] font-bold text-[11px] px-2 py-0.5 rounded-full tracking-[.02em]';
// background: var(--brand-soft);
// color: var(--brand);
// font-weight: 700;
// font-size: 11px;
// padding: 2px 8px;
// border-radius: 999px;
// letter-spacing: .02em;

function Tag({ children, className }: TagProps) {
  if (!children) {
    return null;
  }

  return <span className={cn(tagContainerClass, className)}>{children}</span>;
}

export default Tag;
