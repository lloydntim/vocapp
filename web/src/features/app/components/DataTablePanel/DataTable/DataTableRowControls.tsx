import { cn } from '@/lib/utils';
import IconButton from '@/components/ui/IconButton/IconButton';
import type { RowControl } from './types';

const dataTableRowActionsClass = 'row-actions flex justify-end gap-2';

interface DataTableRowControlProps {
  rowId: string;
  controls: RowControl[];
}

export default function DataTableRowControls({
  rowId,
  controls,
}: DataTableRowControlProps) {
  return (
    <div className={cn(dataTableRowActionsClass, 'justify-end')}>
      {controls.map(({ onClick, ...rest }, index) => (
        <IconButton
          key={index}
          size="small"
          {...rest}
          onClick={() => onClick?.(rowId)}
        />
      ))}
    </div>
  );
}
