import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Switch from './Switch';

const meta = {
  component: Switch,
  args: {
    id: 'mastered',
    name: 'mastered',
    label: 'Mastered',
  },
} satisfies Meta<typeof Switch>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic = {} satisfies Story;

export const Checked = {
  args: {
    defaultChecked: true,
  },
} satisfies Story;

export const Disabled = {
  args: {
    disabled: true,
  },
} satisfies Story;

export const NoLabel = {
  args: {
    id: 'notifications',
    'aria-label': 'Enable notifications',
    label: undefined,
  },
} satisfies Story;
