import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Logo from './Logo';

const meta = {
  component: Logo,
} satisfies Meta<typeof Logo>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic = {} satisfies Story;
