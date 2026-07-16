import { timeAgo } from '@/lib/date';
import { DataTableRowItem } from '@/features/app/components/DataTablePanel/DataTable/types';
import { VocabList } from './types';

export const buildListTableRows = (data: VocabList[]) =>
  data.map((row) => ({
    id: row.id,
    cells: [
      {
        type: 'primaryText',
        props: {
          type: 'primary',
          title: row.title,
          subtitle: `Created ${timeAgo(row.createdAt)}`,
        },
      },
      {
        type: 'badge',
        props: {
          sourceLang: row.sourceLanguageCode.toUpperCase(),
          targetLang: row.targetLanguageCode.toUpperCase(),
        },
      },
      {
        type: 'secondaryText',
        props: {
          type: 'secondary',
          title: row.total,
        },
      },
      {
        type: 'progress',
        props: {
          progress:
            row.total > 0 ? Math.round((row.mastered / row.total) * 100) : 0,
        },
      },
      {
        type: 'secondaryText',
        props: {
          type: 'secondary',
          title: row.lastPracticed ? timeAgo(row.lastPracticed) : 'Never',
        },
      },
    ],
  })) satisfies DataTableRowItem[];
