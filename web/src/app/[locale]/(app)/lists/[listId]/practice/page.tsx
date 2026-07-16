'use client';

import Headline from '@/components/ui/Headline/Headline';
import IconButton from '@/components/ui/IconButton/IconButton';
import ProgressBar from '@/components/ui/ProgressBar/ProgressBar';
import RadioButtonGroup from '@/components/ui/RadioButtonGroup/RadioButtonGroup';
import Select from '@/components/ui/Select/Select';
import TopBar from '@/features/app/components/TopBar/TopBar';
import Content from '@/features/app/layouts/Content/Content';

import FlashCard from '@/features/practice/components/FlashCard/FlashCard';
import { cn } from '@/lib/utils';

interface PageProps {
  params: { practice: string };
}

const practiceHeaderClass = 'flex items-center gap-3.5';

const cardDeckClass = 'perspective-[1600px] min-h-[340px]';
const practiceWrapperClass = 'flex flex-col mx-auto gap-5.5 max-w-[720px]';

const practiceProgressClass = 'flex items-center gap-3.5';
const practiceProgressCountClass =
  'font-mono text-[12px] text-(--text-muted) tabular-nums';

const metaClass = 'text-[12px] text-(--text-dim)';

function page({ params }: PageProps) {
  const { practice } = params;

  return (
    <>
      <TopBar path={practice} title="Vocabulary Lists" />
      <Content>
        <Select
          icon="funnel"
          options={[
            { label: 'All languages', value: 'all' },
            { label: '🇫🇷 French', value: 'fr' },
            { label: '🇬🇧 English', value: 'en' },
          ]}
          valueChangeHandler={(value) => console.log(value)}
          size="small"
        />
        <div
          className={cn(
            practiceWrapperClass,
            'animate-[fade-in_320ms_[var(--ease)]_[var(--dur)]]',
          )}
        >
          <div className={practiceHeaderClass}>
            <IconButton
              className="icon-btn ghost"
              size="small"
              variant="ghost"
              icon="chevron-left"
              title="Back to list"
            />
            <div className="flex-1">
              <div className={metaClass}>PRACTICE · L&apos;odyssée</div>
              <Headline
                level="h2"
                className="m-0 tracking-[-0.01em] text-[22px] font-bold"
              >
                English → French
              </Headline>
            </div>
            <RadioButtonGroup
              radios={[
                {
                  label: 'FR→EN',
                  value: 'FR→EN',
                },
                {
                  label: 'EN→FR',
                  value: 'EN→FR',
                },
              ]}
              changeHandler={(value) => console.log(value)}
            />
          </div>
          <div className={practiceProgressClass}>
            <ProgressBar
              size="large"
              showPercent={false}
              progress={Math.round((1 / 14) * 100)}
            />
            <div className={practiceProgressCountClass}>01 / 14</div>
            <div className={cn(practiceProgressCountClass, 'text-(--success)')}>
              0/0
            </div>
          </div>

          <div className={cardDeckClass}>
            <FlashCard />
          </div>
        </div>
      </Content>
    </>
  );
}

export default page;
