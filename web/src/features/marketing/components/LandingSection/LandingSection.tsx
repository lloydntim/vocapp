'use client';

import Headline from '@/components/ui/Headline/Headline';
import { CSSProperties, PropsWithChildren } from 'react';
import Text from '@/components/ui/Text/Text';
import Container from '@/components/ui/Container/Container';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/useInView';

interface SectionData<T> {
  id?: string;
  eyebrow?: string;
  title?: string;
  headAlign?: SectionHeadAlign;
  subtitle?: string;
  items: T[];
}

type SectionHeadAlign = 'left' | 'center' | 'right';

const sectionClass = 'py-18';
const sectionReavalClass =
  'reveal-animation [reveal_armed_&]:aninate-[reveal-up_0.55s_var(--ease)_both]';
const sectionHeadClass = 'text-center max-w-2xl mx-auto mb-12';
const sectionHeadAlignClassMap: Record<SectionHeadAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};
const sectionEyebrowClass =
  'text-[13px] font-semibold tracking-[0.08em] uppercase text-[var(--brand)] mb-3';
const sectionSubtitleClass = 'text-[var(--text-muted)] m-0 text-pretty';

interface LandingSectionProps extends PropsWithChildren {
  id?: string;
  eyebrow?: string;
  title?: string;
  headAlign?: SectionHeadAlign;
  subtitle?: string;
}

function LandingSection({
  id,
  headAlign = 'center',
  eyebrow,
  title,
  subtitle,
  children,
}: LandingSectionProps) {
  const { ref, isInView } = useInView<HTMLDivElement>();
  const sectionHeadAlignClass = sectionHeadAlignClassMap[headAlign];

  const animationStyle = {
    '--animation-delay': `${160}ms`,
  } as CSSProperties;

  return (
    <section
      ref={ref}
      className={cn(sectionClass, isInView && 'reveal-armed')}
      id={id}
    >
      <Container>
        <div
          className={cn(
            sectionReavalClass,
            sectionHeadClass,
            sectionHeadAlignClass,
          )}
          style={animationStyle}
        >
          {eyebrow && <div className={sectionEyebrowClass}>{eyebrow}</div>}
          {title && <Headline level="h2">{title}</Headline>}
          {subtitle && <Text className={sectionSubtitleClass}>{subtitle}</Text>}
        </div>
        {children}
      </Container>
    </section>
  );
}

export type { LandingSectionProps, SectionData, SectionHeadAlign };
export default LandingSection;
