import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import FormBanner from './FormBanner';

const meta = {
  component: FormBanner,
  args: {
    title: 'Something went wrong',
    message: 'Check your username and password and try again.',
    status: 'error',
    showDismissButton: true,
  },
  argTypes: {
    status: {
      options: ['error', 'warn', 'success'],
      control: { type: 'select' },
    },
    showDismissButton: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof FormBanner>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Error = {} satisfies Story;

export const Warn = {
  args: {
    title: 'Password about to expire',
    message: 'Update your password within the next 3 days.',
    status: 'warn',
  },
} satisfies Story;

export const Success = {
  args: {
    title: 'Account verified',
    message: 'You can now log in with your new credentials.',
    status: 'success',
  },
} satisfies Story;

export const WithoutDismissButton = {
  args: {
    showDismissButton: false,
  },
} satisfies Story;
