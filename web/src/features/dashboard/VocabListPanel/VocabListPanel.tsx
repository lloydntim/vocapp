import Button from '@/components/ui/Button/Button';
import Headline from '@/components/ui/Headline/Headline';
import Icon from '@/components/ui/Icon/Icon';
import ProgressBar from '@/components/ui/ProgressBar/ProgressBar';
import LangBadges from '@/features/app/components/Badges/LangBadges';

const panelClass =
  'bg-(--surface) border border-(--border) rounded-(--radius-lg) shadow-(--shadow-sm) overflow-hidden';
const panelHeaderClass =
  'p-[18px_22px] flex items-center gap-[14px] border-b border-(--border) bg-(--surface)';
const panelHeadlineClass = 'text-[18px] font-bold tracking-[-0.01em] m-0';
const panelToolbarClass = 'ml-auto flex gap-[10px] items-center';
const panelContentClass = 'py-2 px-0';

const panelRowClass =
  'resume-row flex items-center gap-[14px] px-[22px] py-[14px] text-[12px] text-(--text-muted) cursor-pointer border-b border-(--border)';

const panelRowListInfo = 'flex-1 min-w-0';
const panelRowListTitle =
  'font-semibold text-[14px] text-(--text) overflow-hidden text-ellipsis whitespace-nowrap';
const panelRowListSubtitle = 'text-[12px]';

interface VocabListPanelRowProps {
  sourceLang: string;
  targetLang: string;
  title: string;
  mastered: number;
  total: number;
  lastPracticed: string;
  progress: number;
  buttonLabel?: string;
  buttonIcon?: string;
  buttonClickHandler?(): void;
}

function VocabListPanelRow({
  sourceLang,
  targetLang,
  title,
  mastered,
  total,
  lastPracticed,
  progress,
  buttonLabel,
  buttonIcon = 'play',
  buttonClickHandler,
}: VocabListPanelRowProps) {
  return (
    <div className={panelRowClass}>
      <LangBadges sourceLang={sourceLang} targetLang={targetLang} />

      <div className={panelRowListInfo}>
        <div className={panelRowListTitle}>{title}</div>
        <div className={panelRowListSubtitle}>
          {mastered} / {total} mastered · last {lastPracticed} ago
        </div>
      </div>

      <ProgressBar progress={progress} />

      <Button
        rank="primary"
        icon={buttonIcon}
        size="small"
        onClick={buttonClickHandler}
      >
        {buttonLabel}
      </Button>
    </div>
  );
}

const vocablistsData: VocabListPanelRowProps[] = [
  {
    sourceLang: 'FR',
    targetLang: 'EN',
    title: "L'odyssée",
    mastered: 22,
    total: 35,
    lastPracticed: '2d',
    progress: 63,
    buttonLabel: 'Practice',
  },
  {
    sourceLang: 'FR',
    targetLang: 'EN',
    title: 'Mourir sur Seine 05',
    mastered: 18,
    total: 61,
    lastPracticed: '5h',
    progress: 30,
    buttonLabel: 'Practice',
  },
  {
    sourceLang: 'FR',
    targetLang: 'EN',
    title: 'Errors that I make',
    mastered: 3,
    total: 12,
    lastPracticed: 'Today',
    progress: 25,
    buttonLabel: 'Practice',
  },
  {
    sourceLang: 'FR',
    targetLang: 'EN',
    title: 'Mourir sur Seine 04',
    mastered: 47,
    total: 60,
    lastPracticed: '1w',
    progress: 78,
    buttonLabel: 'Practice',
  },
];

interface VocabListPanelProps {
  title: string;
  buttonLinkLabel: string;
  data: VocabListPanelRowProps[];
}

function VocabListPanel({ title, buttonLinkLabel, data }: VocabListPanelProps) {
  return (
    <div className={panelClass}>
      <div className={panelHeaderClass}>
        <Headline level="h2" className={panelHeadlineClass}>
          {title}
        </Headline>
        <div className={panelToolbarClass}>
          <Button isLink rank="secondary" size="small" to="/vocablists">
            {buttonLinkLabel}
            <Icon type="chevron-right" size={15} />
          </Button>
        </div>
      </div>

      <div className={panelContentClass}>
        {data.map((row, index) => (
          <VocabListPanelRow key={index} {...row} />
        ))}
      </div>
    </div>
  );
}
export { vocablistsData };

export default VocabListPanel;
