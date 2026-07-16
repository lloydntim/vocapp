import Icon from '@/components/ui/Icon/Icon';
import Badge from '@/components/ui/Badge/Badge';

const langBadgeIconClass = 'text-(--text-dim) mx-1 m-0';

const ICON_SIZE = 10;

interface LangBadgesProps {
  sourceLang: string;
  targetLang: string;
  showIcon?: boolean;
}

function LangBadges({
  sourceLang,
  targetLang,
  showIcon = true,
}: LangBadgesProps) {
  return (
    <div className="flex items-center">
      <Badge text={sourceLang} />
      {showIcon && (
        <Icon
          type="chevron-right"
          size={ICON_SIZE}
          className={langBadgeIconClass}
        />
      )}
      <Badge text={targetLang} />
    </div>
  );
}

export default LangBadges;
