import Button from '@/components/ui/Button/Button';
import Icon from '@/components/ui/Icon/Icon';
import ProgressBar from '@/components/ui/ProgressBar/ProgressBar';
import LangBadges from '@/features/app/components/Badges/LangBadges';
import PanelEmptyView, {
  PanelEmptyViewProps,
} from '@/components/ui/PanelEmptyView/PanelEmptyView';
import PanelHeader from '@/components/ui/PanelHeader/PanelHeader';

const panelClass =
  'bg-(--surface) border border-(--border) rounded-(--radius-lg) shadow-(--shadow-sm) overflow-hidden';
const panelContentClass = 'py-2 px-0';

const panelRowClass =
  'resume-row flex items-center gap-[14px] px-[22px] py-[14px] text-[12px] text-(--text-muted) cursor-pointer border-b border-(--border)';

const panelRowListInfo = 'flex-1 min-w-0';
const panelRowListTitle =
  'font-semibold text-[14px] text-(--text) overflow-hidden text-ellipsis whitespace-nowrap';
const panelRowListSubtitle = 'text-[12px]';

export interface VocabListPanelRowProps {
  id: string;
  sourceLang: string;
  targetLang: string;
  title: string;
  subtitle: string;
  // mastered: number;
  // total: number;
  // lastPracticed: string;
  progress: number;
  buttonLabel?: string;
  buttonIcon?: string;
  buttonClickHandler?(): void;
}

function VocabListPanelRow({
  sourceLang,
  targetLang,
  title,
  subtitle,
  // mastered,
  // total,
  // lastPracticed,
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
        <div className={panelRowListSubtitle}>{subtitle}</div>
      </div>

      <ProgressBar progress={progress} className="hidden sm:flex" />

      <Button
        rank="primary"
        icon={buttonIcon}
        size="small"
        title={buttonLabel}
        ariaLabel={buttonLabel}
        onClick={buttonClickHandler}
      >
        <span className="hidden sm:inline">{buttonLabel}</span>
      </Button>
    </div>
  );
}

interface VocabListPanelProps {
  title: string;
  buttonLinkLabel: string;
  data: VocabListPanelRowProps[];
  emptyViewProps: PanelEmptyViewProps;
}

function VocabListPanel({
  title,
  buttonLinkLabel,
  data,
  emptyViewProps,
}: VocabListPanelProps) {
  if (data.length === 0) {
    return <PanelEmptyView {...emptyViewProps} />;
  }

  const toolbar = (
    <Button isLink rank="secondary" size="small" to="/lists">
      {buttonLinkLabel}
      <Icon type="chevron-right" size={15} />
    </Button>
  );

  return (
    <div className={panelClass}>
      <PanelHeader title={title} toolbar={toolbar} />

      <div className={panelContentClass}>
        {data.map((row, index) => (
          <VocabListPanelRow key={index} {...row} />
        ))}
      </div>
    </div>
  );
}
export default VocabListPanel;
