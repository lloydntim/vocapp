import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ContainerProps {
  className?: string;
  children: ReactNode;
}

const containerClass = 'w-full max-w-[1180px] mx-auto px-6';

function Container({ children, className }: ContainerProps) {
  return <div className={cn(containerClass, className)}>{children}</div>;
}

export default Container;
