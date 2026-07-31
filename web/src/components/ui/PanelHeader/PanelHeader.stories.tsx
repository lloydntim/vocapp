import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import PanelHeader from './PanelHeader';
import Button from '@/components/ui/Button/Button';

const meta = {
  component: PanelHeader,
  args: {
    title: 'Vocabulary lists',
  },
} satisfies Meta<typeof PanelHeader>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic = {} satisfies Story;

export const WithSmallText = {
  args: {
    smallText: '24 items',
  },
} satisfies Story;

export const WithToolbar = {
  args: {
    smallText: '24 items',
    toolbar: (
      <>
        <Button rank="secondary">Filter</Button>
        <Button icon="plus">New list</Button>
      </>
    ),
  },
} satisfies Story;
