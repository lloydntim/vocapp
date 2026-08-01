import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Text from './Text';

const meta = {
  component: Text,
  args: {
    size: 'base',
    children: 'The quick brown fox jumps over the lazy dog.',
  },
  argTypes: {
    size: {
      options: ['small', 'base', 'large'],
      control: { type: 'select' },
    },
  },
} satisfies Meta<typeof Text>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Base = {} satisfies Story;

export const Small = {
  args: {
    size: 'small',
  },
} satisfies Story;

export const Large = {
  args: {
    size: 'large',
  },
} satisfies Story;
