import { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

const skelClass = cn(
  'relative overflow-hidden bg-(--surface-alt) rounded-[8px]',
  "after:content-[''] after:absolute after:inset-0 after:-translate-x-full",
  'after:bg-[linear-gradient(90deg,_transparent,_color-mix(in_oklab,_var(--border-strong)_60%,_transparent),_transparent)]',
  'after:animate-[skel-shimmer_1.5s_infinite]',
  'motion-reduce:after:animate-none',
);

interface SkelProps {
  width: number | string;
  height: number;
  radius?: number;
  className?: string;
}

function Skel({ width, height, radius = 6, className }: SkelProps) {
  const style: CSSProperties = { width, height, borderRadius: radius };
  return <div className={cn(skelClass, className)} style={style} />;
}

export default Skel;
