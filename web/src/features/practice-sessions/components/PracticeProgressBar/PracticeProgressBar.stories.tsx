import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import PracticeProgressBar from './PracticeProgressBar';

const meta = {
  component: PracticeProgressBar,
  args: {
    currentWord: 6,
    totalWords: 20,
    correctCount: 5,
    attemptsCount: 6,
  },
} satisfies Meta<typeof PracticeProgressBar>;
export default meta;

type Story = StoryObj<typeof meta>;

export const InProgress = {} satisfies Story;

export const JustStarted = {
  args: {
    currentWord: 0,
    correctCount: 0,
    attemptsCount: 0,
  },
} satisfies Story;

export const Complete = {
  args: {
    currentWord: 20,
    correctCount: 18,
    attemptsCount: 20,
  },
} satisfies Story;
