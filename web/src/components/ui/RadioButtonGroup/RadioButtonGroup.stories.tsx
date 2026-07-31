import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import RadioButtonGroup from './RadioButtonGroup';

const meta = {
  component: RadioButtonGroup,
  args: {
    radios: [
      { id: 'all', name: 'status', value: 'all', label: 'All' },
      { id: 'active', name: 'status', value: 'active', label: 'Active' },
      { id: 'mastered', name: 'status', value: 'mastered', label: 'Mastered' },
    ],
  },
} satisfies Meta<typeof RadioButtonGroup>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic = {} satisfies Story;

export const PreselectedValue = {
  args: {
    value: 'mastered',
  },
} satisfies Story;
