import Headline from '@/components/ui/Headline/Headline';
import Text from '@/components/ui/Text/Text';
import Button from '@/components/ui/Button/Button';
import Tag from '@/components/ui/Tag/Tag';
import Icon from '@/components/ui/Icon/Icon';
import { cn } from '@/lib/utils';
import { PropsWithChildren, ReactNode } from 'react';

type MetaDataItem = {
  value: string;
  key: string;
};

const heroMetaDataItems: MetaDataItem[] = [
  {
    value: '1,800+',
    key: 'words per learner',
  },
  {
    value: '14',
    key: 'lists per learner',
  },
  {
    value: '93%',
    key: 'recall accuracy',
  },
];

const heroEyeBrowContainer =
  'inline-flex items-center gap-2 py-1.5  pr-3 pl-2 border border-[var(--border)] rounded-full bg-[var(--surface)] shadow-[var(--shadow-sm)] text-sm font-medium text-[var(--text-muted)] mb-5.5';

function HeroEyeBrow({ children }: PropsWithChildren) {
  return <div className={heroEyeBrowContainer}>{children}</div>;
}

const metaContainerClass = 'flex gap-6.5 mt-8.5';
const metaValueClass = 'text-2xl font-extrabold tracking-[-0.02em]';
const metaKeyClass = 'text-sm text-[var(--text-dim)]';

function HeroMeta({ items }: { items: MetaDataItem[] }) {
  return (
    <div className={metaContainerClass}>
      {items.map((item, index) => {
        const { value, key } = item;
        return (
          <div key={index} className="m">
            <div className={metaValueClass}>{value}</div>
            <div className={metaKeyClass}>{key}</div>
          </div>
        );
      })}
    </div>
  );
}

type CtaLink = {
  href: string;
  text: string;
  icon?: string;
};

interface HeroCopyProps {
  eyebrow?: ReactNode;
  headline?: ReactNode;
  leadText?: string;
  ctaText?: string;
  links?: CtaLink[];
}

const heroHeadlineGradient =
  'bg-linear-120 from-[var(--brand)] to-[var(--teal-300)] bg-clip-text text-transparent';

const heroCopyContent = {
  eyebrow: (
    <span>
      <Tag>NEW</Tag> Session recaps & smarter review
    </span>
  ),
  headline: (
    <>
      <span>Vocabulary that </span>
      <span className={heroHeadlineGradient}>actually sticks.</span>
    </>
  ),
  leadText:
    'Create your own lists, drill them with fast flashcards, and watch your mastery climb — across French, Spanish, German, Italian and more.',
  links: [
    { href: '#', text: 'Start learning free' },
    { href: '#how', text: 'See how it works' },
  ],
};

const animationClass = 'reveal in';
const animationStyle = '[animation-delay:0ms]';
const heroLeadText =
  'leading-[1.6] text-[var(--text-muted)] max-w-[520px] mb-7.5 text-pretty';
const heroCtaClass = 'flex gap-3 items-center flex-wrap';

function HeroCopy({ eyebrow, headline, leadText, links }: HeroCopyProps) {
  const [ctaPrimary, ctaSecondary] = links || [];

  return (
    <div className={cn(animationClass, animationStyle)}>
      <HeroEyeBrow>{eyebrow}</HeroEyeBrow>
      <Headline>{headline}</Headline>
      <Text className={heroLeadText} size="large">
        {leadText}
      </Text>
      <div className={heroCtaClass}>
        {ctaPrimary && (
          <Button isLink to={ctaPrimary.href}>
            <span>{ctaPrimary.text}</span>
            {ctaPrimary.icon && <Icon type={ctaPrimary.icon} size={16} />}
          </Button>
        )}
        {ctaSecondary && (
          <Button isLink rank="secondary" to={ctaSecondary.href}>
            {ctaSecondary.text}
          </Button>
        )}
        <HeroMeta items={heroMetaDataItems} />
      </div>
    </div>
  );
}

export { heroCopyContent };
export default HeroCopy;
