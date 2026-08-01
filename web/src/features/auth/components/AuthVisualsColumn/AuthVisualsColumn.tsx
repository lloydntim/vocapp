import { cn } from '@/lib/utils';
import Icon from '@/components/ui/Icon/Icon';
import Headline from '@/components/ui/Headline/Headline';

type AuthVisualRowVariant = 'default' | 'success';

type AuthVisualRow = {
  badge: string;
  variant?: AuthVisualRowVariant;
  title: string;
  subtitle: string;
  progress: number;
};

const authVisualMockTitle = 'VocApp · Vocabulary lists';

const authVisualRows: AuthVisualRow[] = [
  {
    badge: 'FR→EN',
    title: "L'odyssée",
    subtitle: '22 / 35 mastered',
    progress: 63,
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
];

const authVisualFeatures = [
  'Organize vocabulary into custom lists by language, book, or topic.',
  'Practice with fast flashcards and instant, honest feedback.',
  'Track mastery as you go, one word at a time.',
];

const rowClass = 'flex items-center gap-3';
const bodyClass = 'flex-1 min-w-0';
const titleClass = 'font-semibold text-sm';
const subtitleClass = 'text-xs text-[var(--text-muted)]';
const progressTrackClass =
  'h-1.5 w-[90px] bg-[var(--surface-alt)] rounded-full overflow-hidden';
const progressFillClass = 'block h-full bg-[var(--brand)] rounded-full';

function AuthVisualMockRow({
  badge,
  variant = 'default',
  title,
  subtitle,
  progress,
}: AuthVisualRow) {
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
  'bg-[var(--surface)] border border-[var(--border)] rounded-[18px] shadow-[var(--shadow-lg)] overflow-hidden';
const cardHeaderClass =
  'flex items-center gap-2 px-4 py-3.5 border-b border-[var(--border)] bg-[var(--surface-2)]';
const trafficLightClass = 'flex gap-1.5';
const trafficLightDotClass =
  'block w-2.5 h-2.5 rounded-full bg-[var(--border-strong)]';
const cardTitleClass = 'text-xs text-[var(--text-dim)] ml-1.5 font-medium';
const cardBodyClass = 'p-4 flex flex-col gap-2.5';

function AuthVisualMock() {
  return (
    <div className={cardClass}>
      <div className={cardHeaderClass}>
        <div className={trafficLightClass} aria-hidden="true">
          <i className={trafficLightDotClass} />
          <i className={trafficLightDotClass} />
          <i className={trafficLightDotClass} />
        </div>
        <div className={cardTitleClass}>{authVisualMockTitle}</div>
      </div>
      <div className={cardBodyClass}>
        {authVisualRows.map((row) => (
          <AuthVisualMockRow key={row.title} {...row} />
        ))}
      </div>
    </div>
  );
}

const authVisualColClass = cn(
  'hidden md:flex flex-[0.92] flex-col justify-center relative overflow-hidden',
  'text-white p-14',
  'bg-[linear-gradient(150deg,var(--teal-700),var(--teal-500)_60%,var(--teal-400))]',
  "before:content-[''] before:absolute before:inset-0 before:pointer-events-none",
  'before:bg-[radial-gradient(55%_60%_at_85%_10%,rgba(255,255,255,.16),transparent_60%)]',
);

const authVisualInnerClass = 'relative z-[1] max-w-[420px] mx-auto w-full';
const featureListClass = 'list-none p-0 m-0 flex flex-col gap-3.5';
const featureItemClass = 'flex gap-3 items-start text-[15px] leading-[1.5]';
const featureIconClass =
  'grid flex-none size-[22px] rounded-[7px] bg-white/16 text-white place-items-center mt-px';

function AuthVisualsColumn() {
  return (
    <div className={authVisualColClass}>
      <div className={authVisualInnerClass}>
        <AuthVisualMock />
        <Headline
          level="h2"
          className="text-2xl mt-7.5 mb-4 leading-[1.3] tracking-[-0.01em] text-balance"
        >
          Everything you need to learn
        </Headline>
        <ul className={featureListClass}>
          {authVisualFeatures.map((feature) => (
            <li key={feature} className={featureItemClass}>
              <span className={featureIconClass} aria-hidden="true">
                <Icon type="check" size={14} />
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AuthVisualsColumn;
