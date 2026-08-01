import React from 'react';
import Card from '@/components/ui/Card/Card';
import { cn } from '@/lib/utils';
import Headline from '@/components/ui/Headline/Headline';
import Text from '@/components/ui/Text/Text';
import LandingSection, {
  LandingSectionProps,
  SectionData,
  SectionHeadAlign,
} from '../LandingSection/LandingSection';
import { ButtonProps } from '@/components/ui/Button/Button';
import ButtonGroup from '@/components/ui/ButtonGroup/ButtonGroup';

export const ctaSectionData = {
  id: 'cta',
  eyebrow: 'Start building your vocabulary today',
  title: 'Start building your vocabulary today',
  headAlign: 'center' as SectionHeadAlign,
  subtitle:
    'Free to use. Your lists, your pace — on any device, in light or dark.',
  items: [
    {
      rank: 'primary',
      size: 'large',
      isLink: true,
      to: '/signup',
      label: 'Open VocApp',
      className:
        'bg-white text-[var(--teal-600)] hover:bg-white/90 border-white hover:border-white/90 shadow-[0_1px_2px_rgba(11,93,93,0.25)]',
    },
    {
      rank: 'secondary',
      variant: 'ghost',
      size: 'large',
      isLink: true,
      to: '#features',
      label: 'Explore features',
      className: 'border-white hover:bg-white/12',
    },
  ],
} as SectionData<ButtonProps & { label: string }>;

interface CtaSectionProps extends LandingSectionProps {
  items: ButtonProps[];
}

// function CtaButton

const ctaCardClass =
  'relative text-center bg-[linear-gradient(135deg,var(--teal-600),var(--teal-500)_55%,var(--teal-400))]';
const ctaButtonGroupClass = 'flex gap-3 justify-center flex-wrap mt-6';

function CtaSection({ id, title, subtitle }: CtaSectionProps) {
  return (
    <LandingSection id={id}>
      <Card
        className={cn(ctaCardClass, 'lp-cta-card reveal in')}
        style={{ animationDelay: '0ms' }}
      >
        <Headline level="h2">{title}</Headline>
        <Text>{subtitle}</Text>
        <ButtonGroup
          buttons={ctaSectionData.items}
          className={ctaButtonGroupClass}
          stretch={false}
        />
      </Card>
    </LandingSection>
  );
}

export default CtaSection;
