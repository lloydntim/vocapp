import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import RadioButton from './RadioButton';

const meta = {
  component: RadioButton,
  args: {
    id: 'weekly',
    name: 'interval',
    label: 'Weekly',
  },
} satisfies Meta<typeof RadioButton>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Unchecked = {} satisfies Story;

export const Checked = {
  args: {
    checked: true,
  },
} satisfies Story;
