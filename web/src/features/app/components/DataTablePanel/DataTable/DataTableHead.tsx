import Checkbox from '@/components/ui/Checkbox/Checkbox';
import type { DataTableColumnItem, RowControl } from './types';
import { cn } from '@/lib/utils';

interface DataTableHeadProps {
  isSelectable: boolean;
  checked: boolean;
  columns: DataTableColumnItem[];
  controls: RowControl[];
}

const headColumnClass =
  'font-medium text-[12px] uppercase text-(--text-dim) text-left px-4 py-3 bg-(--surface-2) border-b border-(--border) whitespace-nowrap select-none';

export default function DataTableHead({
  columns,
  isSelectable,
  controls,
  checked,
}: DataTableHeadProps) {
  return (
    <thead>
      <tr>
        {isSelectable && (
          <th className={cn(headColumnClass, 'w-10')}>
            <Checkbox checked={checked} onChange={() => {}} />
          </th>
        )}
        {columns.map(({ id, name, className }) => (
          <th key={id} className={cn(headColumnClass, className)}>
            {name}
          </th>
        ))}
        {!!controls && <th className={cn(headColumnClass, 'w-35')}></th>}
      </tr>
    </thead>
  );
}
