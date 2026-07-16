import Badge from '@/components/ui/Badge/Badge';
import Button from '@/components/ui/Button/Button';
import ButtonGroup from '@/components/ui/ButtonGroup/ButtonGroup';
import Card from '@/components/ui/Card/Card';
import IconButton from '@/components/ui/IconButton/IconButton';
import InputField from '@/components/ui/InputField/InputField';
import { cn } from '@/lib/utils';

const flashCardClass =
  'py-10.5 px-9 transition-[transition:transform_var(--dur-slow)_var(--ease),opacity_var(--dur)_var(--ease)]';
const isEnteringClass = 'animate-[flip-in_320ms_(--ease)]';

const cardTopClass =
  'flex items-center gap-2.5 text-(--text-dim) text-[12px] uppercase tracking-[0.1em]';
const promptClass =
  'mt-6 text-[44px] font-semibold tracking-[-0.02em] leading-[1.15] flex-1 flex items-center text-wrap-pretty';

const practiceControlsClass = 'flex items-center justify-between mt-2 gap-3';

const keyboardDescriptionClass =
  'inline-flex items-center text-[11px] bg-(--surface-alt) border border-(--border) rounded-[4px] py-0.5 px-1.5 text-(--text-muted) font-mono';

function FlashCard() {
  return (
    <Card hasShadow hasBorder className={cn(flashCardClass, isEnteringClass)}>
      <div className={cardTopClass}>
        <Badge text="FR" />
        <span>Translate to English</span>
        <IconButton
          className="ml-auto"
          size="small"
          variant="ghost"
          icon="volume-1"
          title="Listen"
        />
      </div>
      <div className={promptClass}>Par surcroît</div>
      <div className="answer-row flex items-stretch gap-3 mt-5">
        <InputField
          value={''}
          className="text-[16px] font-mono border-[1.5px] flex flex-1"
          placeholder="Type in English…"
          onChange={() => {}}
          id={''}
        />
        <Button
          icon="chevron-right"
          className="flex-row-reverse"
          onClick={() => {}}
          disabled
        >
          Submit
        </Button>
      </div>
      <div className={practiceControlsClass}>
        <ButtonGroup
          type="icon"
          variant="outline"
          buttons={[
            {
              icon: 'arrow-left',
              title: 'Previous (Ctrl ←)',
              onClick: () => {},
            },
            {
              icon: 'eye',
              title: 'Reveal answer',
              onClick: () => {},
            },
            {
              icon: 'repeat',
              title: 'Shuffle',
              onClick: () => {},
            },
          ]}
        />
        <div className="flex items-center gap-3.5">
          <span className="text-[12px] text-(--text-dim)">
            <span className={keyboardDescriptionClass}>Enter</span> submit ·{' '}
            <span className={keyboardDescriptionClass}>Ctrl+←/→</span> navigate
          </span>
          <Button size="small" rank="secondary">
            Skip
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default FlashCard;
