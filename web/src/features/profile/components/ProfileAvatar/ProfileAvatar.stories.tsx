import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import ProfileAvatar from './ProfileAvatar';

const meta = {
  component: ProfileAvatar,
  args: {
    initials: 'AL',
    size: 'small',
  },
  argTypes: {
    size: {
      options: ['small', 'large'],
      control: { type: 'select' },
    },
  },
} satisfies Meta<typeof ProfileAvatar>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Small = {} satisfies Story;

export const Large = {
  args: {
    size: 'large',
  },
} satisfies Story;
