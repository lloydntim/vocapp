import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Tag from './Tag';

const meta = {
  component: Tag,
  args: {
    children: 'New',
  },
} satisfies Meta<typeof Tag>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic = {} satisfies Story;

export const LongLabel = {
  args: {
    children: 'Beginner friendly',
  },
} satisfies Story;
