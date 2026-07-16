import { VocabListItem } from './types';
import type { DataTableRowItem } from '@/features/app/components/DataTablePanel/DataTable/types';

const buildListItemTableRows = (listData: VocabListItem[]) =>
  listData.map((row) => ({
    id: row.id,
    cells: [
      {
        type: 'primaryText',
        props: {
          type: 'primary',
          title: row.sourceText,
          button: { icon: 'volume-1', title: 'Play audio', onClick: () => {} },
        },
      },
      {
        type: 'secondaryText',
        props: {
          type: 'secondary',
          title: row.targetText,
        },
      },
      {
        type: 'chip',
        props: {
          className: 'w-full',
          label: row.status,
          title: `Status: ${row.status}`,
          icon: row.status === 'MASTERED' ? 'check' : 'notepad-text',
          type: row.status === 'MASTERED' ? 'success' : 'warn',
        },
      },
    ],
  })) satisfies DataTableRowItem[];

export { buildListItemTableRows };
