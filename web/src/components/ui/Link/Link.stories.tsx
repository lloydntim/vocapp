import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Link from './Link';

const meta = {
  component: Link,
  args: {
    href: '/lists',
    children: 'View your lists',
  },
} satisfies Meta<typeof Link>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Internal = {} satisfies Story;

export const External = {
  args: {
    href: 'https://example.com',
    children: 'Read the docs',
    isExternal: true,
  },
} satisfies Story;
