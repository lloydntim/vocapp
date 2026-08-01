import React from 'react';
import LandingSection, {
  LandingSectionProps,
  SectionData,
  SectionHeadAlign,
} from '../LandingSection/LandingSection';
import Headline from '@/components/ui/Headline/Headline';
import Text from '@/components/ui/Text/Text';
import { cn } from '@/lib/utils';

const processSectionData = {
  id: 'process',
  eyebrow: 'Three steps',
  title: 'From blank list to fluent recall',
  headAlign: 'center' as SectionHeadAlign,
  subtitle: '',
  items: [
    {
      number: 1,
      title: 'Build a list',
      description:
        'Pick your two languages, name your list, and add words with translations and optional notes.',
      delay: 0,
    },
    {
      number: 2,
      title: 'Practice daily',
      description:
        'Run quick flashcard sessions in either direction. Reveal hints when stuck, skip when needed.',
      delay: 80,
    },
    {
      number: 3,
      title: 'Review & master',
      description:
        'Check your recap, revisit the tricky words, and watch mastery climb toward 100%.',
      delay: 160,
    },
  ],
} as SectionData<ProcessStepProps>;

interface ProcessStepProps {
  number: number;
  title: string;
  description: string;
  delay: number;
}

const stepNumberClass =
  'relative size-10 rounded-[12px] bg-[var(--brand)] text-[var(--brand-ink)] grid place-items-center font-bold text-lg mb-4';
const stepDescriptionClass = 'text-[var(--text-muted)]';
const stepNumberLineClass =
  "relative after:content-[''] text-[var(--text)] after:absolute after:top-[20px] after:right-[-12px] after:left-[56px] after:h-[2px] after:bg-gradient-to-r after:from-[var(--border)] after:to-transparent";

function ProcessStep({ number, title, description, delay }: ProcessStepProps) {
  return (
    <div
      className={stepNumberLineClass}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={cn(stepNumberClass)}>{number}</div>
      <Headline level="h3">{title}</Headline>
      <Text className={stepDescriptionClass}>{description}</Text>
    </div>
  );
}

const processContentGridClass = 'grid grid-cols-[repeat(3,1fr)] gap-6';

function ProcessContent({ items }: { items: ProcessStepProps[] }) {
  return (
    <div className={processContentGridClass}>
      {items.map((step) => (
        <ProcessStep key={step.number} {...step} />
      ))}
    </div>
  );
}

interface ProcessSectionProps extends LandingSectionProps {
  items: ProcessStepProps[];
}

function ProcessSection({ items, ...sectionProps }: ProcessSectionProps) {
  return (
    <LandingSection {...sectionProps}>
      <ProcessContent {...{ items }} />
    </LandingSection>
  );
}

export { processSectionData };
export default ProcessSection;
