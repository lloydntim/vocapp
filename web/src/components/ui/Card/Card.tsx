import { cn } from '@/lib/utils';
import { CSSProperties, PropsWithChildren } from 'react';

interface CardProps extends PropsWithChildren {
  className?: string;
  style?: CSSProperties;
  hasBorder?: boolean;
  hasShadow?: boolean;
}

function Card({ children, className, hasBorder, hasShadow }: CardProps) {
  const cardClass = cn(
    'overflow-hidden',
    'rounded-[24px]',
    'text-(--text)',
    'bg-(--surface)',
    'py-16',
    'px-10',
    hasShadow ? 'shadow-(--shadow-md)' : '',
    hasBorder ? 'border border-(--border)' : '',
  );
  return <div className={cn(cardClass, className)}>{children}</div>;
}

export default Card;
