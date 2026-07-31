import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import PanelEmptyView from './PanelEmptyView';

const meta = {
  component: PanelEmptyView,
  args: {
    title: 'No vocabulary lists yet',
    subtitle:
      'Create your first list to start adding words and practicing them.',
  },
} satisfies Meta<typeof PanelEmptyView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic = {} satisfies Story;

export const NoSubtitle = {
  args: {
    subtitle: undefined,
  },
} satisfies Story;

export const WithButtons = {
  args: {
    buttons: [
      { label: 'Import list', rank: 'secondary' },
      { label: 'New list', icon: 'plus' },
    ],
  },
} satisfies Story;

export const CustomIcon = {
  args: {
    icon: 'search',
    badgeIcon: undefined,
    title: 'No results found',
    subtitle: 'Try adjusting your search or filters.',
  },
} satisfies Story;
