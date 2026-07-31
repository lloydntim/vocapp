import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import DataTablePanel from './DataTablePanel';
import { DataTableRowItem, RowControl } from './DataTable/types';

const columns = [
  { id: 'name', name: 'Name', isSortable: true, type: 'primaryText' },
  { id: 'languages', name: 'Languages', isSortable: false, type: 'badge' },
  { id: 'progress', name: 'Progress', isSortable: true, type: 'progress' },
  { id: 'items', name: 'Items', isSortable: true, type: 'secondaryText' },
  { id: 'status', name: 'Status', isSortable: false, type: 'chip' },
];

const rows: DataTableRowItem[] = [
  {
    id: 'list-1',
    cells: [
      {
        type: 'primaryText',
        props: {
          type: 'primary',
          title: 'Spanish Basics',
          subtitle: 'Created 3 weeks ago',
          to: '/lists/list-1',
        },
      },
      {
        type: 'badge',
        props: { sourceLang: 'EN', targetLang: 'ES' },
      },
      {
        type: 'progress',
        props: { progress: 68, showPercent: false },
      },
      {
        type: 'secondaryText',
        props: { type: 'secondary', title: 48 },
      },
      {
        type: 'chip',
        props: { title: 'Status', label: 'Active', type: 'success' },
      },
    ],
  },
  {
    id: 'list-2',
    cells: [
      {
        type: 'primaryText',
        props: {
          type: 'primary',
          title: 'French Travel Phrases',
          subtitle: 'Created 2 months ago',
          to: '/lists/list-2',
        },
      },
      {
        type: 'badge',
        props: { sourceLang: 'EN', targetLang: 'FR' },
      },
      {
        type: 'progress',
        props: { progress: 21, showPercent: false },
      },
      {
        type: 'secondaryText',
        props: { type: 'secondary', title: 30 },
      },
      {
        type: 'chip',
        props: { title: 'Status', label: 'Needs review', type: 'warn' },
      },
    ],
  },
  {
    id: 'list-3',
    cells: [
      {
        type: 'primaryText',
        props: {
          type: 'primary',
          title: 'German Vocabulary',
          subtitle: 'Created 6 months ago',
          to: '/lists/list-3',
        },
      },
      {
        type: 'badge',
        props: { sourceLang: 'EN', targetLang: 'DE' },
      },
      {
        type: 'progress',
        props: { progress: 100, showPercent: false },
      },
      {
        type: 'secondaryText',
        props: { type: 'secondary', title: 60 },
      },
      {
        type: 'chip',
        props: { title: 'Status', label: 'Mastered', type: 'success' },
      },
    ],
  },
];

const rowControls: RowControl[] = [
  { icon: 'play', title: 'Practice', variant: 'ghost' },
  { icon: 'square-pen', title: 'Edit', variant: 'ghost' },
  { icon: 'trash-2', title: 'Delete', variant: 'ghost-danger' },
];

const meta = {
  component: DataTablePanel,
  args: {
    headerProps: {
      title: 'Vocabulary lists',
      smallText: `${rows.length} lists`,
      searchPlaceholder: 'Search lists…',
      addButtonLabel: 'New list',
      languageFilterOptions: [
        { value: '', label: 'All languages' },
        { value: 'es', label: 'Spanish' },
        { value: 'fr', label: 'French' },
        { value: 'de', label: 'German' },
      ],
    },
    tableProps: {
      columns,
      rows,
      isSelectable: false,
      controls: rowControls,
    },
    emptyViewProps: {
      title: 'No vocabulary lists yet',
      subtitle: 'Create your first list to start adding words.',
      buttons: [{ label: 'New list', icon: 'plus' }],
    },
  },
} satisfies Meta<typeof DataTablePanel>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic = {} satisfies Story;

export const WithStatusFilter = {
  args: {
    headerProps: {
      ...meta.args.headerProps,
      showLanguageFilter: false,
      showStatusFilter: true,
      statusFilterOptions: [
        { value: '', label: 'All' },
        { value: 'active', label: 'Active' },
        { value: 'mastered', label: 'Mastered' },
      ],
    },
  },
} satisfies Story;

export const Selectable = {
  args: {
    tableProps: {
      ...meta.args.tableProps,
      isSelectable: true,
    },
  },
} satisfies Story;

export const Empty = {
  args: {
    tableProps: {
      ...meta.args.tableProps,
      rows: [],
    },
  },
} satisfies Story;

export const NoToolbarOptions = {
  args: {
    headerProps: {
      ...meta.args.headerProps,
      showSearch: false,
      showLanguageFilter: false,
      showAddButton: false,
    },
  },
} satisfies Story;
