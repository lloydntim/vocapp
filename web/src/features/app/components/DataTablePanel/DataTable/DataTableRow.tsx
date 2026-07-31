import { cn } from '@/lib/utils';
import DataTableCell, { DataTableCellProps } from './DataTableCell';
import { RowControl } from './types';

const dataTableRowClass =
  'border-b border-(--border) transition-[background] duration-(--dur-fast) ease-(--ease) hover:bg-(--surface-2)';
const dataTableCellClass = 'py-3.5 px-4 text-(--text) vertical-align-middle';

interface DataTableRowProps {
  id: string;
  data: DataTableCellProps[];
  isSelectable: boolean;
  isSelectDisabled?: boolean;
  controls?: RowControl[];
}

export default function DataTableRow({
  id: rowId,
  data,
  controls,
  isSelectable,
  isSelectDisabled,
}: DataTableRowProps) {
  return (
    <tr className={dataTableRowClass}>
      {isSelectable && (
        <DataTableCell
          type="checkbox"
          className={dataTableCellClass}
          props={{ checked: false, onChange: () => {}, disabled: isSelectDisabled }}
        />
      )}
      {data.map((cell, index) => (
        <DataTableCell
          key={index}
          {...cell}
          className={cn(dataTableCellClass, cell.className)}
        />
      ))}
      {!!controls && (
        <DataTableCell
          type="controls"
          className={cn(
            dataTableCellClass,
            'opacity-100 md:opacity-0 md:[tr:hover_&]:opacity-100',
          )}
          props={{ rowId, controls }}
        />
      )}
    </tr>
  );
}
