import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import ProfileDetails from './ProfileDetails';

const meta = {
  component: ProfileDetails,
  args: {
    cards: [
      {
        title: 'Account',
        rows: [
          { label: 'Name', value: 'Ada Lovelace', action: () => {} },
          { label: 'Email', value: 'ada@example.com', action: () => {} },
          { label: 'Username', value: 'ada', action: () => {} },
          { label: 'Role', value: 'User' },
        ],
      },
      {
        title: 'Danger zone',
        text: 'Deleting your account removes all your lists and progress permanently.',
        button: { label: 'Delete account', variant: 'danger', rank: 'secondary' },
      },
    ],
  },
} satisfies Meta<typeof ProfileDetails>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic = {} satisfies Story;
