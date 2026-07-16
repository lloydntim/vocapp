import type { IconButtonProps } from '@/components/ui/IconButton/IconButton';
import type { DataTableCellProps } from './DataTableCell';

export type DataTableRowItem = {
  id: string;
  cells: DataTableCellProps[];
};

export type RowControl = Pick<IconButtonProps, 'icon' | 'title' | 'variant'> & {
  onClick?(id: string): void;
};

export type DataTableColumnItem = {
  name: string;
  className: string;
  isSortable: boolean;
  id: string;
};
