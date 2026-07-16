import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import IconButton, { IconButtonType } from './IconButton';

const meta = {
  component: IconButton,
  args: {
    rank: 'primary',
    icon: 'moon',
  },
  argTypes: {
    rank: {
      options: ['primary', 'secondary'],
      control: { type: 'select' },
    },
    icon: {
      options: ['moon', 'sun'], // add more icon names as they're supported
      control: { type: 'select' },
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic = {
  args: {
    rank: 'primary',
  },
} satisfies Story;

export const Primary = {
  args: {
    icon: 'moon' as IconButtonType,
    rank: 'primary',
  },
} satisfies Story;

export const Secondary = {
  args: {
    icon: 'moon' as IconButtonType,
    rank: 'secondary',
  },
} satisfies Story;
