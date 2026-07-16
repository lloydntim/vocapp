import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Navigation from './Navigation';

const meta = {
  component: Navigation,
} satisfies Meta<typeof Navigation>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    logo: 'Logo',
  },
} satisfies Story;
