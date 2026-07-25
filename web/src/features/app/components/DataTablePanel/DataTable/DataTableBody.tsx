import DataTableRow from './DataTableRow';
import { DataTableRowItem, RowControl } from './types';

interface DataTableBodyProps {
  rows: DataTableRowItem[];
  isSelectable: boolean;
  controls: RowControl[];
}

function DataTableBody({ rows, isSelectable, controls }: DataTableBodyProps) {
  return (
    <tbody>
      {rows.map(({ id, cells }: DataTableRowItem) => (
        <DataTableRow
          key={id}
          id={id}
          data={cells}
          isSelectable={isSelectable}
          controls={controls}
        />
      ))}
    </tbody>
  );
}

export default DataTableBody;
