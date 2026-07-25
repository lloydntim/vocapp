import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import SkeletonPanel from './SkeletonPanel';

const meta = {
  component: SkeletonPanel,
} satisfies Meta<typeof SkeletonPanel>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
