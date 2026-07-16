import { ChangeEvent, MouseEvent } from 'react';
import Headline from '@/components/ui/Headline/Headline';
import { cn } from '@/lib/utils';
import InputField from '@/components/ui/InputField/InputField';
import Button from '@/components/ui/Button/Button';
import Icon from '@/components/ui/Icon/Icon';
import DataTable, { DataTableProps } from './DataTable/DataTable';
import Select from '@/components/ui/Select/Select';

const panelTextSmall = 'text-[12px] text-(--text-dim) tracking-[0.04em]';
const panelHeaderClass =
  'p-[18px_22px] flex items-center gap-[14px] border-b border-(--border) bg-(--surface)';

const panelHeadlineClass =
  'text-[18px] font-bold tracking-[-0.01em] m-0 var(--text);';
const panelToolbarClass = 'ml-auto flex gap-[10px] items-center';

interface DataTablePanelHeaderProps {
  showAddButton?: boolean;
  showSearch?: boolean;
  showLanguageFilter?: boolean;
  title?: string;
  smallText?: string;
  resultCount?: number;
  totalCount?: number;
  addButtonLabel?: string;
  // languageFilterLabel?: string;
  searchPlaceholder?: string;
  searchId?: string;
  searchInputChangeHandler?(event: ChangeEvent<HTMLInputElement>): void;
  addButtonClickHandler?(event: MouseEvent<HTMLButtonElement>): void;
  languageFilterClickHandler?(value: string): void;
}

function DataTablePanelHeader({
  searchId = 'data-table-search',
  showAddButton = true,
  showSearch = true,
  showLanguageFilter = true,
  title = 'All lists',
  smallText = '',
  searchPlaceholder = '',
  addButtonLabel = '',
  // languageFilterLabel = '',
  searchInputChangeHandler = undefined,
  addButtonClickHandler = undefined,
  languageFilterClickHandler = undefined,
}: DataTablePanelHeaderProps) {
  return (
    <div className={cn(panelHeaderClass)}>
      <Headline level="h2" className={panelHeadlineClass}>
        {title}
      </Headline>
      {smallText && <span className={panelTextSmall}>{smallText}</span>}
      <div className={panelToolbarClass}>
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
            /*  <Button
              isLink
              rank="secondary"
              size="small"
              to="/vocablists"
              onClick={languageFilterClickHandler}
            >
              {languageFilterLabel}
              <Icon type="funnel" size={15} />
            </Button> */
            <Select
              icon="funnel"
              size="small"
              options={[
                { value: 'en', label: ' All languages' },
                { value: 'fr', label: '🇫🇷 French' },
                { value: 'es', label: '🇪🇸 Spanish' },
                { value: 'de', label: '🇩🇪 German' },
                { value: 'it', label: '🇮🇹 Italian' },
              ]}
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
      </div>
    </div>
  );
}

interface DataTablePanelProps {
  headerProps: DataTablePanelHeaderProps;
  tableProps: DataTableProps;
}

const dataTablePanelClass =
  'bg-(--surface) border border-(--border) rounded-(--radius-lg) shadow-(--shadow-sm) overflow-hidden last:border-b-0';

function DataTablePanel({ headerProps, tableProps }: DataTablePanelProps) {
  return (
    <div className={dataTablePanelClass}>
      <DataTablePanelHeader {...headerProps} />
      <DataTable {...tableProps} />
    </div>
  );
}

export default DataTablePanel;
