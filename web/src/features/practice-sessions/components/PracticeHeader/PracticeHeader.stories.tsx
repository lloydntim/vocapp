import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import PracticeHeader from './PracticeHeader';
import PracticeProgressBar from '@/features/practice-sessions/components/PracticeProgressBar/PracticeProgressBar';

const meta = {
  component: PracticeHeader,
  args: {
    eyebrowline: 'PRACTICE SESSION',
    title: 'Spanish Basics',
    backLink: '/lists/list-1',
  },
} satisfies Meta<typeof PracticeHeader>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic = {} satisfies Story;

export const WithToolbar = {
  args: {
    toolbar: (
      <PracticeProgressBar
        currentWord={6}
        totalWords={20}
        correctCount={5}
        attemptsCount={6}
      />
    ),
  },
} satisfies Story;
