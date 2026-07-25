import type { ComponentProps, ComponentType } from 'react';
import Checkbox from '@/components/ui/Checkbox/Checkbox';
import ProgressBar from '@/components/ui/ProgressBar/ProgressBar';
import { cn } from '@/lib/utils';
import DataTableRowControls from './DataTableRowControls';
import LangBadges from '../../Badges/LangBadges';
import IconButton, {
  IconButtonProps,
} from '@/components/ui/IconButton/IconButton';
import Chip from '@/components/ui/Chip/Chip';
import Link from '@/components/ui/Link/Link';

const rowListTitle =
  'font-semibold text-[14px] text-(--text) overflow-hidden text-ellipsis whitespace-nowrap';
const rowListSubtitle = 'text-[11px] text-(--text-dim)';

interface DataTableCellTextProps {
  title: string | number;
  subtitle?: string;
  button?: IconButtonProps;
  type: 'primary' | 'secondary';
  to?: string;
}

function DataTableCellText({
  title,
  subtitle,
  button,
  type,
  to,
}: DataTableCellTextProps) {
  if (type === 'secondary') {
    const numColClass = cn(
      'text-(--text-muted)',
      typeof title === 'number' && 'tabular-nums',
    );
    return <span className={numColClass}>{title}</span>;
  }

  return to ? (
    <Link className="hover:no-underline" href={to}>
      <div className="flex items-center">
        {button && (
          <IconButton
            variant="ghost"
            icon={button.icon}
            title={title as string}
            onClick={button.onClick}
          />
        )}
        <div className="flex flex-col">
          <div className={rowListTitle}>{title}</div>
          {subtitle && <small className={rowListSubtitle}>{subtitle}</small>}
        </div>
      </div>
    </Link>
  ) : (
    <>
      <div className="flex items-center">
        {button && (
          <IconButton
            variant="ghost"
            icon={button.icon}
            title={title as string}
            onClick={button.onClick}
          />
        )}
        <div className="flex flex-col">
          <div className={rowListTitle}>{title}</div>
          {subtitle && <small className={rowListSubtitle}>{subtitle}</small>}
        </div>
      </div>
    </>
  );
}

const dataTableCellMap = {
  primaryText: DataTableCellText,
  progress: ProgressBar,
  controls: DataTableRowControls,
  checkbox: Checkbox,
  badge: LangBadges,
  secondaryText: DataTableCellText,
  chip: Chip,
};
export type DataTableCellProps = {
  [K in keyof typeof dataTableCellMap]: {
    type: K;
    props: ComponentProps<(typeof dataTableCellMap)[K]>;
    className?: string;
  };
}[keyof typeof dataTableCellMap];

function DataTableCell({ type, props, className }: DataTableCellProps) {
  const CellContent = dataTableCellMap[type] as ComponentType<typeof props>;
  return (
    <td className={className}>
      <CellContent {...props} />
    </td>
  );
}

export default DataTableCell;
