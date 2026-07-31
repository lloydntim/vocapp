import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import FeatureSection, { featureSectionData } from './FeatureSection';

const meta = {
  component: FeatureSection,
  args: featureSectionData,
} satisfies Meta<typeof FeatureSection>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic = {} satisfies Story;
