import { ReactNode } from 'react';
import Headline from '@/components/ui/Headline/Headline';
import { cn } from '@/lib/utils';

const panelHeaderClass =
  'p-[18px_22px] flex items-center gap-[14px] border-b border-(--border) bg-(--surface)';
const panelHeadlineClass = 'text-[18px] font-bold tracking-[-0.01em] m-0';
const panelToolbarClass = 'ml-auto flex gap-[10px] items-center';
const panelTextSmallClass = 'text-[12px] text-(--text-dim) tracking-[0.04em]';

interface PanelHeaderProps {
  title: string;
  smallText?: string;
  toolbar?: ReactNode;
  className?: string;
}

function PanelHeader({ title, smallText, toolbar, className }: PanelHeaderProps) {
  return (
    <div className={cn(panelHeaderClass, className)}>
      <Headline level="h2" className={panelHeadlineClass}>
        {title}
      </Headline>
      {smallText && <span className={panelTextSmallClass}>{smallText}</span>}
      {toolbar && <div className={panelToolbarClass}>{toolbar}</div>}
    </div>
  );
}

export type { PanelHeaderProps };
export default PanelHeader;
