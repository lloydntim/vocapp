import { DataTableColumnItem } from '../app/components/DataTablePanel/DataTable/types';

export const itemColumnConfigData = [
  {
    name: 'French',
    // className: 'w-auto',
    isSortable: true,
    id: 'sourceLanguage',
    type: 'primaryText',
  },
  {
    name: 'English',
    // className: 'w-[120px]',
    isSortable: false,
    id: 'targetLanguage',
    type: 'primaryText',
  },
  {
    name: 'Status',
    className: 'w-30 hidden md:table-cell',
    isSortable: true,
    id: 'status',
    type: 'chip',
  },
] satisfies DataTableColumnItem[];
