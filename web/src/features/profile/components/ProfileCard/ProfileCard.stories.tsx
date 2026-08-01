import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import ProfileCard from './ProfileCard';

const meta = {
  component: ProfileCard,
  args: {
    initials: 'AL',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    isVerified: true,
    buttons: [
      { label: 'Edit profile', rank: 'secondary' },
      { label: 'Log out', rank: 'secondary', variant: 'danger' },
    ],
  },
} satisfies Meta<typeof ProfileCard>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Verified = {} satisfies Story;

export const Unverified = {
  args: {
    isVerified: false,
  },
} satisfies Story;
