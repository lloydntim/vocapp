import Card from '@/components/ui/Card/Card';
import ProgressBar from '@/components/ui/ProgressBar/ProgressBar';
import { cn } from '@/lib/utils';
import React from 'react';

const miniTextClass = 'text-[12px] text-(--text-dim)';
const largeTextClass = 'text-[22px] font-bold';

interface VocabListSummaryBarProps {
  total: number;
  mastered: number;
  progress: number;
  lastPracticed: string;
}

function VocabListSummaryBar(props: VocabListSummaryBarProps) {
  return (
    <Card hasBorder className="panel mb-5 py-5 px-6 flex  gap-6 flex-wrap">
      <div>
        <div className={miniTextClass}>Words</div>
        <div className={largeTextClass}>{props.total}</div>
      </div>
      <div>
        <div className={miniTextClass}>Mastered</div>
        <div className={cn(largeTextClass, 'text-(--success)')}>
          {props.mastered}
        </div>
      </div>
      <div>
        <div className={miniTextClass}>Last practiced</div>
        <div className={cn(largeTextClass, 'font-[600')}>
          {props.lastPracticed || 'Never'}
        </div>
      </div>
      <div className="flex-1 min-w-45 flex flex-col">
        <div className={miniTextClass}>Mastery · {props.progress}%</div>
        <div className="flex-1 flex items-center">
          <ProgressBar
            showPercent={false}
            progress={props.progress}
            size="large"
          />
        </div>
      </div>
    </Card>
  );
}

export default VocabListSummaryBar;
