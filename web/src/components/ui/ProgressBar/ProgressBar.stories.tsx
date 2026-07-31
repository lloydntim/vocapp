import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import ProgressBar from './ProgressBar';

const meta = {
  component: ProgressBar,
  args: {
    progress: 42,
    size: 'small',
    showPercent: true,
  },
  argTypes: {
    size: {
      options: ['small', 'large'],
      control: { type: 'select' },
    },
    progress: {
      control: { type: 'range', min: 0, max: 100 },
    },
  },
} satisfies Meta<typeof ProgressBar>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic = {} satisfies Story;

export const Empty = {
  args: {
    progress: 0,
  },
} satisfies Story;

export const Complete = {
  args: {
    progress: 100,
  },
} satisfies Story;

export const Large = {
  args: {
    size: 'large',
  },
} satisfies Story;

export const NoPercentLabel = {
  args: {
    showPercent: false,
  },
} satisfies Story;
