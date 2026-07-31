import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import CtaSection, { ctaSectionData } from './CtaSection';

const meta = {
  component: CtaSection,
  args: ctaSectionData,
} satisfies Meta<typeof CtaSection>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic = {} satisfies Story;
