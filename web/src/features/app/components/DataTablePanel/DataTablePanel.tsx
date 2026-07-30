import { ChangeEvent, MouseEvent, ReactNode } from 'react';
import DataTable, { DataTableProps } from './DataTable/DataTable';
import PanelEmptyView, {
  PanelEmptyViewProps,
} from '@/components/ui/PanelEmptyView/PanelEmptyView';
import PanelHeader from '@/components/ui/PanelHeader/PanelHeader';
import InputField from '@/components/ui/InputField/InputField';
import Button from '@/components/ui/Button/Button';
import Select from '@/components/ui/Select/Select';
import Card from '@/components/ui/Card/Card';

interface LanguageFilterOption {
  value: string;
  label: string;
}

const defaultLanguageFilterOptions: LanguageFilterOption[] = [
  { value: '', label: 'All languages' },
];

interface DataTablePanelHeaderProps {
  showAddButton?: boolean;
  showSearch?: boolean;
  showLanguageFilter?: boolean;
  title?: string;
  smallText?: string;
  resultCount?: number;
  totalCount?: number;
  toolbar?: ReactNode;
  addButtonLabel?: string;
  searchPlaceholder?: string;
  searchId?: string;
  languageFilterValue?: string;
  languageFilterOptions?: LanguageFilterOption[];
  searchInputChangeHandler?(event: ChangeEvent<HTMLInputElement>): void;
  addButtonClickHandler?(event: MouseEvent<HTMLButtonElement>): void;
  languageFilterClickHandler?(value: string): void;
}

interface DataTablePanelProps {
  headerProps: DataTablePanelHeaderProps;
  tableProps: DataTableProps;
  emptyViewProps: PanelEmptyViewProps;
}
const dataTablePanelClass =
  'rounded-(--radius-lg) shadow-(--shadow-sm) p-0 last:border-b-0';

function DataTablePanel({
  headerProps: {
    searchId = 'data-table-search',
    showAddButton = true,
    showSearch = true,
    showLanguageFilter = true,
    title = 'All lists',
    smallText = '',
    searchPlaceholder = '',
    addButtonLabel = '',
    searchInputChangeHandler = undefined,
    addButtonClickHandler = undefined,
    languageFilterValue = '',
    languageFilterOptions = defaultLanguageFilterOptions,
    languageFilterClickHandler = undefined,
  },
  tableProps,
  emptyViewProps,
}: DataTablePanelProps) {
  if (!tableProps.rows || tableProps.rows.length === 0) {
    return <PanelEmptyView {...emptyViewProps} />;
  }

  const toolbar = (
    <>
      {showSearch && (
        <div className="relative flex-1" style={{ minWidth: '240px' }}>
          <InputField
            icon="search"
            type="text"
            size="small"
            placeholder="Search lists…"
            value={searchPlaceholder}
            id={searchId}
            onChange={searchInputChangeHandler}
          />
        </div>
      )}
      <div className="relative">
        {showLanguageFilter && (
          <Select
            icon="funnel"
            size="small"
            value={languageFilterValue}
            options={languageFilterOptions}
            onValueChange={languageFilterClickHandler}
          />
        )}
      </div>

      {showAddButton && (
        <Button
          rank="primary"
          size="small"
          icon="plus"
          onClick={addButtonClickHandler}
        >
          {addButtonLabel}
        </Button>
      )}
    </>
  );

  return (
    <Card hasBorder hasShadow className={dataTablePanelClass}>
      <PanelHeader title={title} smallText={smallText} toolbar={toolbar} />
      <DataTable {...tableProps} />
    </Card>
  );
}

export type { DataTablePanelHeaderProps };
export default DataTablePanel;
