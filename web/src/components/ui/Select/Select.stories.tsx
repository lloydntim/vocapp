import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Select from './Select';

const languageOptions = [
  { value: '', label: 'All languages' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
];

const meta = {
  component: Select,
  args: {
    options: languageOptions,
  },
  argTypes: {
    size: {
      options: ['small', 'base', 'large'],
      control: { type: 'select' },
    },
  },
} satisfies Meta<typeof Select>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic = {} satisfies Story;

export const WithIcon = {
  args: {
    icon: 'funnel',
  },
} satisfies Story;

export const Small = {
  args: {
    size: 'small',
  },
} satisfies Story;

export const PreselectedValue = {
  args: {
    value: 'fr',
  },
} satisfies Story;
