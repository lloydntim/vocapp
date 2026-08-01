import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Callout from './Callout';

const meta = {
  component: Callout,
  args: {
    title: '60 phrases · 47 mastered',
    message: 'Created 10/04/26 · last practiced 1w ago',
    icon: 'book',
    variant: 'neutral',
    hasBorder: true,
  },
  argTypes: {
    variant: {
      options: ['neutral', 'danger', 'warning', 'success'],
      control: { type: 'select' },
    },
    icon: {
      options: ['book', 'circle-alert', 'check', 'trash-2'],
      control: { type: 'select' },
    },
    hasBorder: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Callout>;
export default meta;

type Story = StoryObj<typeof meta>;

export const WithIcon = {} satisfies Story;

export const WithAction = {
  args: {
    title: 'Remove this word',
    message: 'This word will be deleted from the list.',
    icon: undefined,
    variant: 'danger',
    hasBorder: false,
    action: {
      label: 'Delete',
      icon: 'trash-2',
      variant: 'outline-danger',
      size: 'small',
    },
  },
} satisfies Story;

export const Warning = {
  args: {
    title: 'Practice session incomplete',
    message: 'Your current progress has not been saved.',
    icon: 'circle-alert',
    variant: 'warning',
  },
} satisfies Story;

export const Success = {
  args: {
    title: 'List saved',
    message: 'Your changes have been saved successfully.',
    icon: 'check',
    variant: 'success',
  },
} satisfies Story;

export const WithoutBorder = {
  args: {
    hasBorder: false,
  },
} satisfies Story;
