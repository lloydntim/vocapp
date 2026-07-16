import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Button from './Button';

const meta = {
  component: Button,
  args: {
    rank: 'primary',
    size: 'base',
    children: 'Click me',
  },
  argTypes: {
    rank: {
      options: ['primary', 'secondary'],
      control: { type: 'select' },
    },
    size: {
      options: ['small', 'base', 'large'],
      control: { type: 'select' },
    },
    variant: {
      options: [
        'standard',
        'ghost',
        'outline',
        'danger',
        'outline-danger',
        'ghost-danger',
      ],
      control: { type: 'select' },
    },
    icon: {
      options: ['plus', 'chevron-right', 'trash-2', 'check', 'funnel'],
      control: { type: 'select' },
    },
    isLink: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic = {} satisfies Story;

export const Primary = {
  args: {
    rank: 'primary',
    children: 'Click me',
  },
} satisfies Story;

export const Secondary = {
  args: {
    rank: 'secondary',
    children: 'Click me',
  },
} satisfies Story;

export const Small = {
  args: {
    size: 'small',
    children: 'Click me',
  },
} satisfies Story;

export const Base = {
  args: {
    size: 'base',
    children: 'Click me',
  },
} satisfies Story;

export const Large = {
  args: {
    size: 'large',
    children: 'Click me',
  },
} satisfies Story;

export const Ghost = {
  args: {
    variant: 'ghost',
    children: 'Click me',
  },
} satisfies Story;

export const Danger = {
  args: {
    variant: 'danger',
    children: 'Delete',
  },
} satisfies Story;

export const OutlineDanger = {
  args: {
    variant: 'outline-danger',
    children: 'Delete',
  },
} satisfies Story;

export const GhostDanger = {
  args: {
    variant: 'ghost-danger',
    children: 'Delete',
  },
} satisfies Story;

export const Outline = {
  args: {
    variant: 'outline',
    children: 'Click me',
  },
} satisfies Story;

export const WithIcon = {
  args: {
    icon: 'plus',
    children: 'New list',
  },
} satisfies Story;

export const Disabled = {
  args: {
    disabled: true,
    children: 'Click me',
  },
} satisfies Story;

export const AsLink = {
  args: {
    isLink: true,
    to: '/lists',
    children: 'Go to lists',
  },
} satisfies Story;
