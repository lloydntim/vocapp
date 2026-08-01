import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import OverlayLoader from './OverlayLoader';

const meta = {
  component: OverlayLoader,
  args: {
    title: 'Loading…',
  },
  decorators: [
    (Story) => (
      <div className="relative h-64 w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OverlayLoader>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic = {
  args: {
    isContained: true,
  },
} satisfies Story;

export const WithSubtitle = {
  args: {
    isContained: true,
    subtitle: 'This should only take a moment.',
  },
} satisfies Story;
