import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';

const contentClass = 'flex-1 max-w-[1280px] w-full mx-auto p-[24px_28px_48px]';

interface ContentProps extends PropsWithChildren {
  className?: string;
}
function Content({ children, className }: ContentProps) {
  return <main className={cn(contentClass, className)}>{children}</main>;
}

export default Content;
