import Headline from '@/components/ui/Headline/Headline';
import IconButton from '@/components/ui/IconButton/IconButton';
import { ReactNode } from 'react';

const practiceHeaderClass = 'flex items-center gap-3.5';

const metaClass = 'text-[12px] text-(--text-dim)';

interface PracticeHeaderProps {
  eyebrowline: string;
  title: string;
  backLink: string;
  toolbar?: ReactNode;
}

function PracticeHeader({
  eyebrowline,
  title,
  backLink,
  toolbar,
}: PracticeHeaderProps) {
  return (
    <div className={practiceHeaderClass}>
      <IconButton
        className="icon-btn ghost"
        size="small"
        variant="ghost"
        icon="chevron-left"
        title="Back to list"
        isLink
        to={backLink}
      />
      <div className="flex-1">
        <div className={metaClass}>{eyebrowline}</div>
        <Headline
          level="h2"
          className="m-0 tracking-[-0.01em] text-[22px] font-bold"
        >
          {title}
        </Headline>
      </div>
      {toolbar}
    </div>
  );
}

export default PracticeHeader;
