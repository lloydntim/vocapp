import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import SoundButton from './SoundButton';
import { withQueryClient } from '@/lib/storybook/withQueryClient';

const meta = {
  component: SoundButton,
  args: {
    listId: 'list-1',
    itemId: 'item-1',
    field: 'source',
  },
  argTypes: {
    size: {
      options: ['small', 'base', 'large'],
      control: { type: 'select' },
    },
  },
  decorators: [withQueryClient],
} satisfies Meta<typeof SoundButton>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic = {} satisfies Story;

export const Large = {
  args: {
    size: 'large',
  },
} satisfies Story;
