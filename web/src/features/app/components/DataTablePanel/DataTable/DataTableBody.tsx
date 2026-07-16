import DataTableRow from './DataTableRow';
import { DataTableRowItem } from './types';

interface DataTableBodyProps {
  rows: DataTableRowItem[];
  isSelectable: boolean;
  hasControls: boolean;
}

function DataTableBody({
  rows,
  isSelectable,
  hasControls,
}: DataTableBodyProps) {
  return (
    <tbody>
      {rows.map(({ id, cells }: DataTableRowItem) => (
        <DataTableRow
          key={id}
          id={id}
          data={cells}
          isSelectable={isSelectable}
          hasControls={hasControls}
        />
      ))}
    </tbody>
  );
}

export default DataTableBody;
