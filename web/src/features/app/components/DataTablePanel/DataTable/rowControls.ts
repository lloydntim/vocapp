import type { RowControl } from './types';

export const rowControls = [
  {
    icon: 'play',
    title: 'Practice',
    variant: 'ghost',
    onClick: (id: string) => {
      console.log(id);
    },
  },
  {
    icon: 'square-pen',
    title: 'Edit',
    variant: 'ghost',
    onClick: (id: string) => {
      console.log(id);
    },
  },
  {
    icon: 'trash-2',
    title: 'Delete',
    variant: 'ghost-danger',
    onClick: (id: string) => {
      console.log(id);
    },
  },
] as unknown as RowControl[];