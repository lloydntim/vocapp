import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Checkbox from './Checkbox';

const meta = {
  component: Checkbox,
  args: {
    id: 'terms',
    label: 'I agree to the terms',
  },
} satisfies Meta<typeof Checkbox>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic = {} satisfies Story;

export const Checked = {
  args: {
    checked: true,
  },
} satisfies Story;

export const NoLabel = {
  args: {
    id: 'no-label',
    label: undefined,
  },
} satisfies Story;

export const WithError = {
  args: {
    error: 'You must accept the terms to continue.',
  },
} satisfies Story;
