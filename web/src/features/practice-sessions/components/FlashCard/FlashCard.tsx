'use client';
import Badge from '@/components/ui/Badge/Badge';
import Button from '@/components/ui/Button/Button';
import ButtonGroup from '@/components/ui/ButtonGroup/ButtonGroup';
import Card from '@/components/ui/Card/Card';
import Icon from '@/components/ui/Icon/Icon';
import InputField from '@/components/ui/InputField/InputField';
import SoundButton from '@/features/audio/components/SoundButton/SoundButton';
import { ItemAudioField } from '@/features/audio/schemas';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const flashCardClass =
  'py-10.5 px-9 transition-[transition:transform_var(--dur-slow)_var(--ease),opacity_var(--dur)_var(--ease)]';
const isEnteringClass = 'animate-[flip-in_320ms_(--ease)]';

const cardTopClass =
  'flex items-center gap-2.5 text-(--text-dim) text-[12px] uppercase tracking-[0.1em]';
const promptClass =
  'mt-6 text-[44px] font-semibold tracking-[-0.02em] leading-[1.15] flex-1 flex items-center text-wrap-pretty';

const hintClass = `
inline-flex
items-center
gap-2
text-(--text-muted)
text-[13px]
mt-3.5
py-2.5
px-3.5
bg-(--surface-alt)
rounded-[10px]
align-flex-start`;

const fadeInClass = 'animate-[fade-in_var(--dur)_var(--ease)]';

const practiceControlsClass = 'flex items-center justify-between mt-2 gap-3';

const keyboardDescriptionClass =
  'inline-flex items-center text-[11px] bg-(--surface-alt) border border-(--border) rounded-[4px] py-0.5 px-1.5 text-(--text-muted) font-mono';

const inputFieldClass = 'text-[16px] font-mono border-[1.5px] flex flex-1';
const inputIncorrectStateClass =
  'border border-(--danger) bg-(--danger-soft) text-(--danger)';
const inputCorrectStateClass =
  'border border-(--success) bg-(--success-soft) text-(--success)';

const inputStateMap = {
  correct: inputCorrectStateClass,
  incorrect: inputIncorrectStateClass,
  neutral: '',
};

interface FlashCardProps {
  listId: string;
  itemId: string;
  promptField: ItemAudioField;
  sourceLanguageCode: string;
  targetLanguage: string;
  sourceLanguageValue: string;
  targetLanguageValue: string;
  inputValue: string;
  onReveal(): void;
  onRestart(): void;
  onSkip(): void;
  onPrevious?(): void;
  onInputChange(value: string): void;
  onSubmit(): void;
  onNext(): void;
  loading?: boolean;
  state?: 'neutral' | 'incorrect' | 'correct';
}
function FlashCard({
  listId,
  itemId,
  promptField,
  targetLanguage,
  sourceLanguageCode,
  sourceLanguageValue,
  targetLanguageValue,
  onReveal,
  onSkip,
  onRestart,
  onPrevious,
  onSubmit,
  onNext,
  loading,
  inputValue,
  onInputChange,
  state = 'neutral' as const,
}: FlashCardProps) {
  const [showHint, setShowHint] = useState(false);
  const isReviewing = state !== 'neutral';
  const handlePrimaryAction = () => {
    if (isReviewing) {
      onNext();
      setShowHint(false);
    } else {
      onSubmit();
    }
  };

  return (
    <Card hasShadow hasBorder className={cn(flashCardClass, isEnteringClass)}>
      <div className={cardTopClass}>
        <Badge text={sourceLanguageCode} />
        <span>{`Translate to ${targetLanguage}`}</span>
        <SoundButton
          className="ml-auto"
          size="large"
          listId={listId}
          itemId={itemId}
          field={promptField}
          title="Listen"
        />
      </div>
      <div className={promptClass}>{sourceLanguageValue}</div>
      {showHint && (
        <div className={cn(hintClass, fadeInClass)}>
          <Icon type="eye" size={14} />
          <span>
            Answer:{' '}
            <strong className="text-(--text)">{targetLanguageValue}</strong>
          </span>
        </div>
      )}
      <div className="answer-row flex items-stretch gap-3 mt-5">
        <InputField
          value={inputValue}
          className={cn(inputFieldClass, inputStateMap[state])}
          placeholder={`Type in ${targetLanguage}…`}
          onChange={(event) => {
            onInputChange(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handlePrimaryAction();
            }
          }}
          disabled={isReviewing}
          id={''}
        />
        <Button
          icon="chevron-right"
          className="flex-row-reverse"
          onClick={handlePrimaryAction}
          disabled={loading || (!isReviewing && !inputValue.trim())}
          loading={loading}
        >
          {isReviewing ? 'Next' : 'Submit'}
        </Button>
      </div>
      <div className={practiceControlsClass}>
        <ButtonGroup
          type="icon"
          variant="outline"
          buttons={[
            ...(onPrevious
              ? [
                  {
                    icon: 'arrow-left',
                    title: 'Previous (Ctrl ←)',
                    onClick: () => onPrevious(),
                  },
                ]
              : []),
            {
              icon: 'eye',
              title: 'Reveal answer',
              className: cn(
                showHint &&
                  'text-(--brand) border-color-(--brand) bg-(--brand-soft)',
              ),
              onClick: () => {
                setShowHint((prev) => !prev);
                onReveal();
              },
              disabled: isReviewing,
            },
            {
              icon: 'repeat',
              title: 'Shuffle',
              onClick: () => onRestart(),
            },
          ]}
        />
        <div className="flex items-center gap-3.5">
          <span className="text-[12px] text-(--text-dim)">
            <span className={keyboardDescriptionClass}>Enter</span> submit ·{' '}
            <span className={keyboardDescriptionClass}>Ctrl+←/→</span> navigate
          </span>
          <Button
            size="small"
            rank="secondary"
            onClick={() => onSkip()}
            disabled={isReviewing}
          >
            Skip
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default FlashCard;
