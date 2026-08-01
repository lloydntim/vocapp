export const listColumnConfigData = [
  {
    name: 'List Name',
    className: 'w-auto',
    isSortable: true,
    id: 'title',
    type: 'primaryText',
  },
  {
    name: 'Languages',
    className: 'w-[120px]',
    isSortable: false,
    id: 'languages',
    type: 'badge',
  },
  {
    name: 'Phrases',
    className: 'w-[110px]',
    isSortable: true,
    id: 'phrases',
    type: 'secondaryText',
  },
  {
    name: 'Mastery',
    className: 'w-[220px]',
    isSortable: true,
    id: 'mastery',
    type: 'progress',
  },
  {
    name: 'Last practiced',
    className: 'w-[140px]',
    isSortable: false,
    id: 'lastPracticed',
    type: 'secondaryText',
  },
];
