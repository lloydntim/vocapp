import { cn } from '@/lib/utils';

type HeroVisualRowVariant = 'default' | 'success';

type HeroVisualRow = {
  badge: string;
  variant?: HeroVisualRowVariant;
  title: string;
  subtitle: string;
  progress: number;
};

type HeroVisualStat = {
  percentage: number;
  label: string;
  value: string;
};

interface HeroVisualProps {
  title: string;
  rows: HeroVisualRow[];
  stat: HeroVisualStat;
}

const heroVisualData: HeroVisualProps = {
  title: 'VocApp · Vocabulary lists',
  rows: [
    {
      badge: 'FR→EN',
      title: "L'odyssée",
      subtitle: '22 / 35 mastered',
      progress: 63,
    },
    {
      badge: 'FR→EN',
      title: 'Mourir sur Seine 05',
      subtitle: '18 / 61 mastered',
      progress: 30,
    },
    {
      badge: 'ES→EN',
      variant: 'success',
      title: 'Kitchen & Cooking',
      subtitle: '42 / 42 mastered',
      progress: 100,
    },
    {
      badge: 'DE→EN',
      title: 'Business terms',
      subtitle: '35 / 88 mastered',
      progress: 40,
    },
  ],
  stat: { percentage: 76, label: 'Weekly mastery', value: '+42 words' },
};

const rowClass =
  'flex items-center gap-3 px-3.5 py-3 border border-[var(--border)] rounded-xl bg-[var(--surface)] transition-transform duration-[var(--dur)] ease-[var(--ease)] hover:translate-x-[3px]';
const bodyClass = 'flex-1 min-w-0';
const titleClass = 'font-semibold text-sm';
const subtitleClass = 'text-xs text-[var(--text-muted)]';
const progressTrackClass =
  'h-1.5 w-[90px] bg-[var(--surface-alt)] rounded-full overflow-hidden';
const progressFillClass = 'block h-full bg-[var(--brand)] rounded-full';

function MockRow({
  badge,
  variant = 'default',
  title,
  subtitle,
  progress,
}: HeroVisualRow) {
  const badgeClass = cn(
    'text-[10px] font-bold tracking-[.04em] px-[7px] py-[3px] rounded-md',
    variant === 'success'
      ? 'bg-[var(--success-soft)] text-[var(--success)]'
      : 'bg-[var(--brand-soft)] text-[var(--brand)]',
  );

  return (
    <div className={rowClass}>
      <span className={badgeClass}>{badge}</span>
      <div className={bodyClass}>
        <div className={titleClass}>{title}</div>
        <div className={subtitleClass}>{subtitle}</div>
      </div>
      <div className={progressTrackClass}>
        <span className={progressFillClass} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

const cardClass =
  'bg-[var(--surface)] border border-[var(--border)] rounded-[18px] shadow-[var(--shadow-lg)] overflow-hidden rotate-[0.5deg] [animation:hero-mock-float_7s_ease-in-out_infinite]';
const cardHeaderClass =
  'flex items-center gap-2 px-4 py-3.5 border-b border-[var(--border)] bg-[var(--surface-2)]';
const trafficLightClass = 'flex gap-1.5';
const trafficLightDotClass =
  'block w-2.5 h-2.5 rounded-full bg-[var(--border-strong)]';
const cardTitleClass = 'text-xs text-[var(--text-dim)] ml-1.5 font-medium';
const cardBodyClass = 'p-4 flex flex-col gap-2.5';
const floatCardClass = cn(
  'absolute -right-[18px] -bottom-5 flex items-center gap-3 rounded-[14px]',
  'border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-md)]',
  'px-4 py-3 [animation:hero-mock-float-2_6s_ease-in-out_infinite]',
);
const ringClass = 'relative grid place-items-center w-10 h-10 rounded-full';
const ringHoleClass =
  'absolute w-[30px] h-[30px] rounded-full bg-[var(--surface)]';
const ringValueClass = 'absolute text-[11px] font-extrabold';
const floatKeyClass = 'text-[11px] text-[var(--text-dim)]';
const floatValueClass = 'text-sm font-bold';
const animationClass = 'reveal in';

function HeroVisual({ title, rows, stat }: HeroVisualProps) {
  return (
    <div className={cn('relative', animationClass, '[animation-delay:80ms]')}>
      <div className={cardClass}>
        <div className={cardHeaderClass}>
          <div className={trafficLightClass}>
            <i className={trafficLightDotClass} />
            <i className={trafficLightDotClass} />
            <i className={trafficLightDotClass} />
          </div>
          <div className={cardTitleClass}>{title}</div>
        </div>
        <div className={cardBodyClass}>
          {rows.map((row) => (
            <MockRow key={row.title} {...row} />
          ))}
        </div>
      </div>
      <div className={floatCardClass}>
        <div
          className={ringClass}
          style={{
            background: `conic-gradient(var(--brand) ${stat.percentage}%, var(--surface-alt) 0)`,
          }}
        >
          <span className={ringHoleClass} />
          <b className={ringValueClass}>{stat.percentage}%</b>
        </div>
        <div>
          <div className={floatKeyClass}>{stat.label}</div>
          <div className={floatValueClass}>{stat.value}</div>
        </div>
      </div>
    </div>
  );
}

export { heroVisualData };
export default HeroVisual;
