import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Spinner from './Spinner';

const meta = {
  component: Spinner,
  args: {
    size: 'base',
  },
  argTypes: {
    size: {
      options: ['small', 'base', 'large'],
      control: { type: 'select' },
    },
  },
} satisfies Meta<typeof Spinner>;
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

export const BrandColored = {
  args: {
    className: 'text-(--brand)',
  },
} satisfies Story;
