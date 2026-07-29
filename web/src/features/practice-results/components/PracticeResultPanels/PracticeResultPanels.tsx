import React from 'react';
import Card from '@/components/ui/Card/Card';
import Icon from '@/components/ui/Icon/Icon';
import Headline from '@/components/ui/Headline/Headline';
import { cn } from '@/lib/utils';
import ButtonGroup from '@/components/ui/ButtonGroup/ButtonGroup';

const gradientBackgroundClass =
  'absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_-20%,var(--brand-soft),transparent_60%)] opacity-90';
const animationClass =
  'w-[72px] h-[72px] rounded-full mx-auto mb-[14px] bg-[var(--brand)] text-[var(--brand-ink)] grid place-items-center shadow-[0_10px_30px_-10px_color-mix(in_oklab,var(--brand)_55%,transparent)] animate-[rise_380ms_var(--ease)]';

const starIconContainerClass = 'inline-flex gap-1.5 mb-2.5';
const CHECK_ICON_SIZE = 32;
const STAR_ICON_SIZE = 22;

const headlineClass = 'mt-1 mb-1.5 text-[26px] font-bold tracking-[-0.01em]';
const subheadlineClass =
  'text-[var(--text-muted)] text-sm max-w-[440px] mx-auto';

interface PracticeResultTilesProps {
  tiles: {
    label: string;
    value: number;
    delta: string;
    status?: string;
  }[];
}

function PracticeResultTiles({ tiles }: PracticeResultTilesProps) {
  const containerClass = 'grid grid-cols-3 gap-3';
  const tileClass =
    'py-4 px-4.5 gap-2 flex flex-col text-center rounded-(--radius-lg)';

  const tileLabelClass = 'text-[12px] text-(--text-dim) uppercase';
  const tileValueClass =
    'text-[28px] font-bold tracking-[0.08] tabular-nums tracking-[0.02]';
  const tileDeltaClass = 'text-[12px] font-medium';

  return (
    <div className={containerClass}>
      {tiles.map((tile, index) => {
        return (
          <Card key={index} hasBorder className={tileClass}>
            <div className={tileLabelClass}>{tile.label}</div>
            <div
              className={cn(tileValueClass, tile.status && 'text-(--success)')}
            >
              {tile.value}
            </div>
            <div className={cn(tileDeltaClass)}>{tile.delta}</div>
          </Card>
        );
      })}
    </div>
  );
}

const practiceResultsContainerClass =
  'max-w-[720px] my-0 mx-auto flex flex-col gap-5.5';
const fadeInAnimationClass = 'animate-[fade_var(--dur)_var(--ease)]';
const checkIconClass = 'grid place-items-center';

interface PracticeResultPanelsProps {
  totalPhrases: number;
  correctCount: number;
  skippedCount: number;
  hintsUsed: number;
  hintsFreeCount: number;
  totalTimeMs: number;
  listId: string;
  onPracticeAgain: () => void;
}

function PracticeResultPanels({
  totalPhrases,
  correctCount,
  skippedCount,
  hintsUsed,
  hintsFreeCount,
  totalTimeMs,
  listId,
  onPracticeAgain,
}: PracticeResultPanelsProps) {
  const accuracy =
    totalPhrases > 0 ? Math.round((correctCount / totalPhrases) * 100) : 0;
  const avgSecondsPerCard =
    totalPhrases > 0
      ? Math.round((totalTimeMs / totalPhrases / 1000) * 10) / 10
      : 0;

  const totalSeconds = Math.max(0, Math.round(totalTimeMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const totalTimeLabel = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  const tiles = [
    {
      label: 'Accuracy',
      value: accuracy,
      delta: `${correctCount} / ${totalPhrases} correct`,
      status: accuracy >= 80 ? 'success' : undefined,
    },
    {
      label: 'Time',
      value: avgSecondsPerCard,
      delta: `avg ${avgSecondsPerCard}s per card`,
    },
    {
      label: 'Hints used',
      value: hintsUsed,
      delta: `${hintsFreeCount} without hint`,
    },
  ];

  return (
    <div className={cn(practiceResultsContainerClass, fadeInAnimationClass)}>
      <Card hasBorder className="py-9 px-7 text-center relative rounded-lg">
        <div aria-hidden="true" className={gradientBackgroundClass}></div>
        <div className="relative">
          <div className={cn(checkIconClass, animationClass)}>
            <Icon type="check" size={CHECK_ICON_SIZE} />
          </div>

          <div className={starIconContainerClass}>
            <Icon
              type="star"
              size={STAR_ICON_SIZE}
              style={{ transitionDelay: '0ms' }}
            />
            <Icon
              type="star"
              size={STAR_ICON_SIZE}
              style={{ transitionDelay: '200ms' }}
            />
            <Icon
              type="star"
              size={STAR_ICON_SIZE}
              style={{ transitionDelay: '400ms' }}
              fill="none"
            />
          </div>
        </div>

        <Headline level="h3" className={headlineClass}>
          Great session!
        </Headline>

        <div className={subheadlineClass}>
          You practiced{' '}
          <strong className="text-(--text)">{totalPhrases} phrases</strong>{' '}
          and got <strong className="text-(--success)">{correctCount} correct</strong>.
        </div>
      </Card>

      <PracticeResultTiles tiles={tiles} />

      <Card hasBorder hasShadow className="py-1 px-5 rounded-lg">
        {[
          { key: 'Phrases', value: totalPhrases },
          { key: 'Correct', value: correctCount },
          { key: 'Skipped', value: skippedCount },
          { key: 'Time spent', value: totalTimeLabel },
        ].map(({ key, value }, index) => {
          return (
            <div
              key={index}
              className="items-center py-3.5 p-0 grid grid-cols-[1fr_auto] border-b border-b-(--border) text-[14px] last:border-b-0"
            >
              <div className="text-(--muted)">{key}</div>
              <div className="text-(--text) font-medium tabular-nums">
                {value}
              </div>
            </div>
          );
        })}
      </Card>
      <ButtonGroup
        buttons={[
          {
            className:
              'inline-flex hover:bg-(--surface-alt) hover:border hover:border-(--border-strong)',
            rank: 'secondary',
            size: 'small',
            icon: 'book',
            label: 'Back to list',
            isLink: true,
            to: `/lists/${listId}`,
          },
          {
            className:
              'inline-flex hover:bg-(--surface-alt) hover:border hover:border-(--border-strong)',
            rank: 'secondary',
            size: 'small',
            icon: 'repeat',
            label: 'Practice again',
            onClick: onPracticeAgain,
          },
        ]}
      />
    </div>
  );
}

export default PracticeResultPanels;
