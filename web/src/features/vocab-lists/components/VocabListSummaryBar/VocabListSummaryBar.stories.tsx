import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import VocabListSummaryBar from './VocabListSummaryBar';

const meta = {
  component: VocabListSummaryBar,
  args: {
    total: 48,
    mastered: 21,
    progress: 44,
    lastPracticed: '2 days ago',
  },
} satisfies Meta<typeof VocabListSummaryBar>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic = {} satisfies Story;

export const NeverPracticed = {
  args: {
    mastered: 0,
    progress: 0,
    lastPracticed: '',
  },
} satisfies Story;

export const FullyMastered = {
  args: {
    total: 48,
    mastered: 48,
    progress: 100,
    lastPracticed: 'Today',
  },
} satisfies Story;
