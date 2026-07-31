import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import FlashCard from './FlashCard';
import { withQueryClient } from '@/lib/storybook/withQueryClient';

const meta = {
  component: FlashCard,
  args: {
    listId: 'list-1',
    itemId: 'item-1',
    promptField: 'source',
    sourceLanguageCode: 'ES',
    targetLanguage: 'English',
    sourceLanguageValue: 'la mariposa',
    targetLanguageValue: 'the butterfly',
    inputValue: '',
    onReveal: () => {},
    onRestart: () => {},
    onSkip: () => {},
    onInputChange: () => {},
    onSubmit: () => {},
    onNext: () => {},
  },
  argTypes: {
    state: {
      options: ['neutral', 'correct', 'incorrect'],
      control: { type: 'select' },
    },
  },
  decorators: [withQueryClient],
} satisfies Meta<typeof FlashCard>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Neutral = {} satisfies Story;

export const WithPreviousEnabled = {
  args: {
    onPrevious: () => {},
  },
} satisfies Story;

export const Correct = {
  args: {
    inputValue: 'the butterfly',
    state: 'correct',
  },
} satisfies Story;

export const Incorrect = {
  args: {
    inputValue: 'the buterfly',
    state: 'incorrect',
  },
} satisfies Story;

export const Loading = {
  args: {
    inputValue: 'the butterfly',
    loading: true,
  },
} satisfies Story;
