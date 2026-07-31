import DataTableRow from './DataTableRow';
import { DataTableRowItem, RowControl } from './types';

interface DataTableBodyProps {
  rows: DataTableRowItem[];
  isSelectable: boolean;
  isSelectDisabled?: boolean;
  controls: RowControl[];
}

function DataTableBody({
  rows,
  isSelectable,
  isSelectDisabled,
  controls,
}: DataTableBodyProps) {
  return (
    <tbody>
      {rows.map(({ id, cells }: DataTableRowItem) => (
        <DataTableRow
          key={id}
          id={id}
          data={cells}
          isSelectable={isSelectable}
          isSelectDisabled={isSelectDisabled}
          controls={controls}
        />
      ))}
    </tbody>
  );
}

export default DataTableBody;
