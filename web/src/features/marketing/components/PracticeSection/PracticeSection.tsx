import Tag from '@/components/ui/Tag/Tag';
import Headline from '@/components/ui/Headline/Headline';
import Text from '@/components/ui/Text/Text';
import Icon from '@/components/ui/Icon/Icon';
import { LandingSectionProps } from '../LandingSection/LandingSection';
import Button from '@/components/ui/Button/Button';
import Container from '@/components/ui/Container/Container';

const practiceSectionData = {
  id: 'practice',
  eyebrow: 'Focused practice',
  title: 'A practice flow that respects your time',
  headAlign: 'left' as const,
  subtitle:
    'No streaks to grind for hours. Short, sharp sessions that fit between meetings, on the train, or before bed.',
  items: [
    {
      title: 'Type-to-answer checks',
      description: 'Catches near-misses without punishing typos.',
    },
    {
      title: 'Keyboard-first',
      description: 'Submit and navigate without leaving the home row.',
    },
    {
      title: 'Reversible direction',
      description: 'Drill recognition and recall from one list.',
    },
    {
      title: 'Honest recaps',
      description: 'See accuracy and hints so you know what to revisit.',
    },
  ],
} as const;

const mockFlashcardClass =
  'bg-[var(--surface)] border border-[var(--border)] rounded-[20px] shadow-[var(--shadow-lg)] p-[30px] flex flex-col gap-[18px] min-h-[300px]';
const mockFlashcardTopClass =
  'flex items-center gap-[10px] text-[12px] uppercase tracking-[.1em] text-[var(--text-dim)]';
const mockFlashcardPromptClass =
  'text-[40px] font-[700] tracking-[-.02em] flex-1 flex items-center';
const mockFlashcardBarClass =
  'h-[8px] bg-[var(--surface-alt)] rounded-full overflow-hidden';
const mockFlashcardBarFillClass =
  'block h-full w-[62%] bg-gradient-to-r from-[var(--teal-400)] to-[var(--brand)] rounded-full';
const mockFlashcardInputClass =
  'h-[50px] border-[1.5px] border-[var(--brand)] rounded-[14px] bg-[var(--success-soft)] text-[var(--success)] flex items-center px-[18px] font-mono font-[500] shadow-[0_0_0_4px_color-mix(in_oklab,var(--brand)_14%,transparent)]';

function MockFlashcard() {
  return (
    <div className={mockFlashcardClass}>
      <div className={mockFlashcardTopClass}>
        <Tag>FR</Tag> Translate to English
      </div>
      <div className={mockFlashcardPromptClass}>Appareiller</div>
      <div className={mockFlashcardBarClass}>
        <span className={mockFlashcardBarFillClass}></span>
      </div>
      <div className={mockFlashcardInputClass}>to set sail ✓</div>
    </div>
  );
}

const sectionContainerClass = 'py-[72px] px-0';
const eyebrowClass =
  'text-[13px] font-semibold tracking-[0.08em] uppercase text-[var(--brand)] mb-3';
const sectionBandGridClass = 'grid grid-cols-2 gap-14 items-center';
const sectionBandListClass =
  'list-none p-0 m-0 mt-[22px] flex flex-col gap-[14px]';
const sectionBandListItemClass = 'flex gap-[12px] items-start';
const listIconBgClass =
  'grid flex-[0_0_24px] size-6 rounded-[7px] bg-(--success-soft) place-items-center mt-[1px] text-(--success)';

interface PracticeSectionProps extends LandingSectionProps {
  items: typeof practiceSectionData.items;
}
function PracticeSection({
  title,
  subtitle,
  eyebrow,
  items,
}: PracticeSectionProps) {
  return (
    <section className="lp-band" id="practice">
      <Container className={sectionContainerClass}>
        <div className={sectionBandGridClass}>
          {/* <div className="reveal in" style="animation-delay: 80ms;"> */}
          <div>
            <div className={eyebrowClass}>{eyebrow}</div>
            <Headline level="h2" className="mb-3">
              {title}
            </Headline>
            <Text size="large" className="text-(--text-muted) m-0">
              {subtitle}
            </Text>
            <ul className={sectionBandListClass}>
              {items.map((item, index) => {
                return (
                  <li className={sectionBandListItemClass} key={index}>
                    <span className={listIconBgClass}>
                      <Icon type="check" size="14" />
                    </span>
                    <span>
                      <b>{item.title}</b> {item.description}
                    </span>
                  </li>
                );
              })}
            </ul>

            <Button
              className="mt-7"
              rank="primary"
              size="large"
              isLink
              to="/signup"
            >
              Try a session
            </Button>
          </div>
          {/* </div> */}
          {/* <div className="reveal in" style="animation-delay: 160ms;"> */}
          <MockFlashcard />
          {/* </div> */}
        </div>
      </Container>
    </section>
  );
}

export { practiceSectionData };
export default PracticeSection;
