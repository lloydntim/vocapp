import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import PracticeResultPanels from './PracticeResultPanels';

const meta = {
  component: PracticeResultPanels,
  args: {
    totalPhrases: 20,
    correctCount: 17,
    skippedCount: 1,
    hintsUsed: 3,
    hintsFreeCount: 14,
    totalTimeMs: 245_000,
    listId: 'list-1',
    onPracticeAgain: () => {},
  },
} satisfies Meta<typeof PracticeResultPanels>;
export default meta;

type Story = StoryObj<typeof meta>;

export const HighAccuracy = {} satisfies Story;

export const LowAccuracy = {
  args: {
    correctCount: 6,
    skippedCount: 4,
    hintsUsed: 12,
    hintsFreeCount: 2,
  },
} satisfies Story;

export const PerfectScore = {
  args: {
    correctCount: 20,
    skippedCount: 0,
    hintsUsed: 0,
    hintsFreeCount: 20,
  },
} satisfies Story;

export const ShortSession = {
  args: {
    totalPhrases: 3,
    correctCount: 3,
    skippedCount: 0,
    hintsUsed: 0,
    hintsFreeCount: 3,
    totalTimeMs: 12_000,
  },
} satisfies Story;
