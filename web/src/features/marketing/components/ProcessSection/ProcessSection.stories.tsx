import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import ProcessSection, { processSectionData } from './ProcessSection';

const meta = {
  component: ProcessSection,
  args: processSectionData,
} satisfies Meta<typeof ProcessSection>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic = {} satisfies Story;
