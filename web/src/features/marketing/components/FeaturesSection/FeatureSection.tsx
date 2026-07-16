import React, { CSSProperties } from 'react';
import LandingSection, {
  LandingSectionProps,
  SectionHeadAlign,
  SectionData,
} from '../LandingSection/LandingSection';
import Icon, { IconProps } from '@/components/ui/Icon/Icon';
import Text from '@/components/ui/Text/Text';
import { cn } from '@/lib/utils';
import Headline from '@/components/ui/Headline/Headline';

export const featureSectionData = {
  id: 'features',
  eyebrow: 'Everything in one place',
  title: 'Built for the way you actually study',
  headAlign: 'center' as SectionHeadAlign,
  subtitle:
    "Organize what you're learning, then turn it into focused practice — no clutter, no busywork.",
  items: [
    {
      icon: 'book',
      title: 'Organize into lists',
      description:
        'Group vocabulary by book, topic, or lesson. Rename, re-language, and archive anytime — your library stays tidy.',
      delay: 0,
    },
    {
      icon: 'play',
      title: 'Practice both ways',
      description:
        'Flip any list to drill source→target or target→source. Type your answer and get instant, honest feedback.',
      delay: 80,
    },
    {
      icon: 'bar-chart2',
      title: 'Track mastery',
      description:
        'Every word carries a status. Watch progress bars fill and see exactly what still needs work at a glance.',
      delay: 160,
    },
    {
      icon: 'sparkles',
      title: 'Session recaps',
      description:
        'Finish a round and get a clean recap — accuracy, time, hints used, and a star rating to keep you motivated.',
      delay: 0,
    },
    {
      icon: 'flame',
      title: 'Keep your streak',
      description:
        'A daily goal and gentle reminders help you show up. Small sessions compound into a big vocabulary.',
      delay: 80,
    },
    {
      icon: 'sun',
      title: 'Light & dark',
      description:
        'A calm, legible interface in either theme, tuned for long study sessions on any device — phone to desktop.',
      delay: 160,
    },
  ],
} as SectionData<FeatureCardProps>;

interface FeatureCardProps {
  icon: IconProps['type'];
  title: string;
  description: string;
  delay: number;
}

const featureCardRevealClass =
  'reveal-animation [reveal-armed_&]:animate-[reveal-up_0.55s_[var(--ease)]_both]';
// .reveal-armed .reveal.in {
//     animation: revealUp 0.55s var(--ease) both;
// }
// .reveal {
//     opacity: 1;
// }

const featureCardClass =
  'bg-[var(--surface)] border border-(color:--border) rounded-[16px] p-5.5 transition-[transform,box-shadow,border-color] duration-[var(--dur)] ease-[var(--ease)]';

//   .lp-feature {
//     background: var(--surface);
//     border: 1px solid var(--border);
//     border-radius: 16px;
//     padding: 26px;
//     transition: transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease), border-color var(--dur) var(--ease);
// }
const iconContainerClass =
  'w-11 h-11 rounded-[12px] grid place-items-center mb-4 bg-[var(--brand-soft)] text-[var(--brand)]';

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  const animationStyle = { '--animation-delay': `${delay}ms` } as CSSProperties;

  return (
    <div
      className={cn(featureCardClass, featureCardRevealClass)}
      style={animationStyle}
    >
      <div className={iconContainerClass}>
        <Icon type={icon} />
      </div>
      <Headline level="h3">{title}</Headline>
      <Text>{description}</Text>
    </div>
  );
}

const featureContentGridClass = 'grid grid-cols-[repeat(3,1fr)] gap-4.5';

function FeatureContent({ items }: { items: FeatureCardProps[] }) {
  return (
    <div className={featureContentGridClass}>
      {items.map((card) => (
        <FeatureCard key={card.title} {...card} />
      ))}
    </div>
  );
}

interface FeatureSectionProps extends LandingSectionProps {
  items: FeatureCardProps[];
}

function FeatureSection({
  items,
  ...featureSectionProps
}: FeatureSectionProps) {
  return (
    <LandingSection {...featureSectionProps}>
      <FeatureContent {...{ items }} />
    </LandingSection>
  );
}

export { FeatureCard, FeatureContent };
export default FeatureSection;
