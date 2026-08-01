import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import SkeletonContentHeader from './SkeletonContentHeader';

const meta = {
  component: SkeletonContentHeader,
} satisfies Meta<typeof SkeletonContentHeader>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
