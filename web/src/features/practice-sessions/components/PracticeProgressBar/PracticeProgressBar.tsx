import ProgressBar from '@/components/ui/ProgressBar/ProgressBar';
import { cn } from '@/lib/utils';

const practiceProgressClass = 'flex items-center gap-3.5';
const practiceProgressCountClass =
  'font-mono text-[12px] text-(--text-muted) tabular-nums';

interface PracticeProgressBarProps {
  currentWord: number;
  totalWords: number;
  correctCount: number;
  attemptsCount: number;
}

function PracticeProgressBar({
  currentWord,
  totalWords,
  correctCount,
  attemptsCount,
}: PracticeProgressBarProps) {
  const progress =
    totalWords > 0 ? Math.round((currentWord / totalWords) * 100) : 0;

  return (
    <div className={practiceProgressClass}>
      <ProgressBar size="large" showPercent={false} progress={progress} />
      <div className={practiceProgressCountClass}>
        {currentWord} / {totalWords}
      </div>
      <div className={cn(practiceProgressCountClass, 'text-(--success)')}>
        {correctCount}/{attemptsCount}
      </div>
    </div>
  );
}

export default PracticeProgressBar;
