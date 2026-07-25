import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import SkeletonVocabListSummaryBar from './SkeletonVocabListSummaryBar';

const meta = {
  component: SkeletonVocabListSummaryBar,
} satisfies Meta<typeof SkeletonVocabListSummaryBar>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
