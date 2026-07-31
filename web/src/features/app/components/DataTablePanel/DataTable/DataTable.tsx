import DataTableBody from './DataTableBody';
import DataTableHead from './DataTableHead';
import { DataTableColumnItem, DataTableRowItem, RowControl } from './types';

export interface DataTableProps {
  columns: DataTableColumnItem[];
  rows: DataTableRowItem[];
  isSelectable: boolean;
  isSelectDisabled?: boolean;
  controls: RowControl[];
}

function DataTable({ columns, rows, ...rest }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse font-[14px]">
        <DataTableHead checked={false} columns={columns} {...rest} />
        <DataTableBody rows={rows} {...rest} />
      </table>
    </div>
  );
}

export default DataTable;
