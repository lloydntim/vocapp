import Headline from '@/components/ui/Headline/Headline';
import IconButton from '@/components/ui/IconButton/IconButton';
import { PropsWithChildren, ReactNode } from 'react';

const contentHeaderClass = 'flex items-center gap-3.5 mb-4.5';
const eyebrowClass = 'text-[12px] text-(--text-dim)';

interface ContentHeaderProps extends PropsWithChildren {
  eyebrow: ReactNode;
  title: string;
  backLink: string;
}

function ContentHeader({
  eyebrow,
  title,
  backLink,
  children,
}: ContentHeaderProps) {
  return (
    <div className={contentHeaderClass}>
      <IconButton
        className="icon-btn ghost"
        size="small"
        variant="ghost"
        icon="arrow-left"
        title="Back to list"
        isLink
        to={backLink}
      />
      <div className="flex-1">
        <div className={eyebrowClass}>{eyebrow}</div>
        <Headline
          level="h1"
          className="m-0 mt-1 tracking-[-0.01em] text-[22px] font-bold"
        >
          {title}
        </Headline>
      </div>
      {children}
    </div>
  );
}

export { ContentHeader };
