import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Header from './Header';
import Logo from '@/components/ui/Logo/Logo';
import { navigationData } from '@/components/ui/Navigation/Navigation';

const meta = {
  component: Header,
  args: {
    logo: <Logo />,
    navlinks: navigationData.links,
    navButtons: [
      { type: 'iconButton', icon: 'moon', rank: 'secondary' },
      { type: 'button', size: 'small', isLink: true, to: '/login', text: 'Open app' },
    ],
  },
} satisfies Meta<typeof Header>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const NoNavLinks = {
  args: {
    navlinks: undefined,
  },
} satisfies Story;

export const NoButtons = {
  args: {
    navButtons: undefined,
  },
} satisfies Story;
