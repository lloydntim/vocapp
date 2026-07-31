import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Chip from './Chip';

const meta = {
  component: Chip,
  args: {
    title: 'Status',
    label: 'Mastered',
    type: 'success',
  },
  argTypes: {
    type: {
      options: ['success', 'warn', 'danger'],
      control: { type: 'select' },
    },
    hasBorder: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Chip>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Success = {} satisfies Story;

export const Warn = {
  args: {
    label: 'Needs review',
    type: 'warn',
  },
} satisfies Story;

export const Danger = {
  args: {
    label: 'Failed',
    type: 'danger',
  },
} satisfies Story;

export const WithIcon = {
  args: {
    icon: 'check',
    label: 'Mastered',
  },
} satisfies Story;

export const WithBorder = {
  args: {
    hasBorder: true,
  },
} satisfies Story;

export const Clickable = {
  args: {
    onClick: () => alert('Chip clicked'),
  },
} satisfies Story;
