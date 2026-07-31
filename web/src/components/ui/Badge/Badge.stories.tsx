import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Badge from './Badge';

const meta = {
  component: Badge,
  args: {
    text: 'EN',
  },
} satisfies Meta<typeof Badge>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic = {} satisfies Story;

export const LongText = {
  args: {
    text: 'Spanish',
  },
} satisfies Story;
