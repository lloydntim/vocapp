import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import InputField from './InputField';

const meta = {
  component: InputField,
  args: {
    id: 'email',
    label: 'Email',
    placeholder: 'you@example.com',
  },
  argTypes: {
    type: {
      options: ['text', 'email', 'password', 'search'],
      control: { type: 'select' },
    },
    icon: {
      options: [undefined, 'mail', 'lock', 'search', 'user'],
      control: { type: 'select' },
    },
  },
} satisfies Meta<typeof InputField>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic = {} satisfies Story;

export const WithIcon = {
  args: {
    icon: 'mail',
  },
} satisfies Story;

export const WithHint = {
  args: {
    hint: 'We will never share your email.',
  },
} satisfies Story;

export const Password = {
  args: {
    id: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    hint: 'Use 8+ characters with a mix of letters and numbers.',
  },
} satisfies Story;

export const WithError = {
  args: {
    id: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    error: 'Password must be at least 8 characters.',
  },
} satisfies Story;

export const Required = {
  args: {
    label: 'Email',
    required: true,
  },
} satisfies Story;
