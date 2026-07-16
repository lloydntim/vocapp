import type { MouseEvent } from 'react';
import { rowControls } from './rowControls';
import { cn } from '@/lib/utils';
import DataTableCell, { DataTableCellProps } from './DataTableCell';

const dataTableRowClass =
  'border-b border-(--border) transition-[background] duration-(--dur-fast) ease-(--ease) hover:bg-(--surface-2)';
const dataTableCellClass = 'py-3.5 px-4 text-(--text) vertical-align-middle';

interface DataTableRowProps {
  id: string;
  data: DataTableCellProps[];
  isSelectable: boolean;
  hasControls: boolean;
  editButtonClickHandler?(event: MouseEvent<HTMLButtonElement>): void;
  practiceButtonClickHandler?(event: MouseEvent<HTMLButtonElement>): void;
  deleteButtonClickHandler?(event: MouseEvent<HTMLButtonElement>): void;
}

export default function DataTableRow({
  id,
  data,
  isSelectable,
  hasControls,
}: DataTableRowProps) {
  return (
    <tr className={dataTableRowClass}>
      {isSelectable && (
        <DataTableCell
          type="checkbox"
          className={dataTableCellClass}
          props={{ checked: false, onChange: () => {} }}
        />
      )}
      {data.map((cell, index) => (
        <DataTableCell key={index} className={dataTableCellClass} {...cell} />
      ))}
      {hasControls && (
        <DataTableCell
          type="controls"
          className={cn(
            dataTableCellClass,
            'opacity-0 [tr:hover_&]:opacity-100',
          )}
          props={{ rowId: id, controls: rowControls }}
        />
      )}
    </tr>
  );
}
