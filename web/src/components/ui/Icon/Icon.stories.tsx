import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Icon from './Icon';

const meta = {
  component: Icon,
  args: {
    type: 'check',
    size: 24,
  },
  argTypes: {
    type: {
      options: [
        'check',
        'moon',
        'sun',
        'arrow-right',
        'book',
        'play',
        'flame',
        'user',
        'mail',
        'lock',
        'circle-alert',
        'circle-check',
        'trash-2',
        'plus',
        'search',
        'settings',
        'star',
        'volume-1',
      ],
      control: { type: 'select' },
    },
    size: {
      control: { type: 'number' },
    },
    color: {
      control: { type: 'color' },
    },
  },
} satisfies Meta<typeof Icon>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic = {} satisfies Story;

export const Large = {
  args: {
    size: 48,
  },
} satisfies Story;

export const Colored = {
  args: {
    type: 'flame',
    color: 'var(--brand)',
  },
} satisfies Story;

export const Unknown = {
  args: {
    type: '',
  },
} satisfies Story;
