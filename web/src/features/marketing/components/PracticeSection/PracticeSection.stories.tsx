import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import PracticeSection, { practiceSectionData } from './PracticeSection';

const meta = {
  component: PracticeSection,
  args: practiceSectionData,
} satisfies Meta<typeof PracticeSection>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic = {} satisfies Story;
