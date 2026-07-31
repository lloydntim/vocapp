import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Headline from './Headline';

const meta = {
  component: Headline,
  args: {
    level: 'h1',
    children: 'Learn vocabulary faster',
  },
  argTypes: {
    level: {
      options: ['h1', 'h2', 'h3', 'h4', 'h5'],
      control: { type: 'select' },
    },
  },
} satisfies Meta<typeof Headline>;
export default meta;

type Story = StoryObj<typeof meta>;

export const H1 = {} satisfies Story;

export const H2 = {
  args: {
    level: 'h2',
    children: 'Practice sessions',
  },
} satisfies Story;

export const H3 = {
  args: {
    level: 'h3',
    children: 'Recent activity',
  },
} satisfies Story;

export const H4 = {
  args: {
    level: 'h4',
    children: 'LAST PRACTICED',
  },
} satisfies Story;

export const H5 = {
  args: {
    level: 'h5',
    children: 'Small label heading',
  },
} satisfies Story;
