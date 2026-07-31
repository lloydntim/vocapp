import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Card from './Card';

const meta = {
  component: Card,
  args: {
    children: 'Card content goes here.',
  },
  argTypes: {
    hasBorder: {
      control: { type: 'boolean' },
    },
    hasShadow: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Card>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic = {} satisfies Story;

export const WithBorder = {
  args: {
    hasBorder: true,
  },
} satisfies Story;

export const WithShadow = {
  args: {
    hasShadow: true,
  },
} satisfies Story;

export const BorderAndShadow = {
  args: {
    hasBorder: true,
    hasShadow: true,
  },
} satisfies Story;
