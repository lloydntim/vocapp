import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import SkeletonProfileDetails from './SkeletonProfileDetails';

const meta = {
  component: SkeletonProfileDetails,
} satisfies Meta<typeof SkeletonProfileDetails>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic = {} satisfies Story;
