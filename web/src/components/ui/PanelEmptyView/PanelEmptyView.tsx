import Card from '@/components/ui/Card/Card';
import ButtonGroup, {
  ButtonItemProps,
} from '@/components/ui/ButtonGroup/ButtonGroup';
import { cn } from '@/lib/utils';
import Icon from '@/components/ui/Icon/Icon';
import Headline from '@/components/ui/Headline/Headline';

const iconBackgroundClass = cn(
  'size-18.5',
  'rounded-[20px]',
  'bg-(--brand-soft)',
  'text-(--brand)',
  'grid place-items-center',
  'mb-5',
  'relative',
);

const iconBadgeBackgroundClass = cn(
  'size-7',
  'rounded-[50%]',
  'bg-(--brand)',
  'text-(--brand-ink)',
  'grid place-items-center',
  'absolute',
  '-right-[6px]',
  '-bottom-[6px]',
  'border-3 border-(--surface)',
);

function PanelIconBadge({ icon }: { icon: string }) {
  const ICON_SIZE = 14;
  return (
    <span className={iconBadgeBackgroundClass}>
      <Icon type={icon} size={ICON_SIZE} />
    </span>
  );
}

interface PanelIconProps {
  icon: string;
  badgeIcon?: string;
}

function PanelIcon({ icon, badgeIcon }: PanelIconProps) {
  const ICON_SIZE = 32;
  return (
    <div className={iconBackgroundClass}>
      <Icon type={icon} size={ICON_SIZE} />
      {badgeIcon && <PanelIconBadge icon={badgeIcon} />}
    </div>
  );
}

interface PanelEmptyViewProps {
  icon?: string;
  badgeIcon?: string;
  title: string;
  subtitle?: string;
  buttons?: ButtonItemProps<'button'>[];
}

const containerClass = cn(
  'flex',
  'flex-col',
  'items-center',
  'text-center',
  'py-23',
  'px-8',
  'gap-1.5',
  'rounded-lg',
);

const titleClass = cn('m-0', 'text-20', 'font-bold', 'tracking-[-0.01em]');
const subtitleClass = cn(
  'm-0 max-w-[400px]',
  'text-(--text-muted)',
  'text-[14px]',
  'leading-[1.6]',
  'text-wrap-pretty',
);
const buttonGroupClass = cn(
  'flex',
  'gap-2.5',
  'mt-5.5',
  'flex-wrap',
  'justify-center',
);

function PanelEmptyView({
  icon = 'book',
  badgeIcon = 'plus',
  title,
  subtitle,
  buttons,
}: PanelEmptyViewProps) {
  return (
    <Card hasBorder className={containerClass}>
      <PanelIcon icon={icon} badgeIcon={badgeIcon} />
      <Headline level="h3" className={titleClass}>
        {title}
      </Headline>
      {subtitle && <p className={subtitleClass}>{subtitle}</p>}
      {buttons && (
        <ButtonGroup
          className={buttonGroupClass}
          buttons={buttons}
          stretch={false}
        />
      )}
    </Card>
  );
}

export type { PanelEmptyViewProps };
export default PanelEmptyView;
