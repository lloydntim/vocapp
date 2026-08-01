import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import SkeletonProfileCard from './SkeletonProfileCard';

const meta = {
  component: SkeletonProfileCard,
} satisfies Meta<typeof SkeletonProfileCard>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic = {} satisfies Story;
