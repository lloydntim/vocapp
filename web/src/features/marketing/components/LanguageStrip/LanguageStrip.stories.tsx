import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import LanguageStrip, { languageStripData } from './LanguageStrip';

const meta = {
  component: LanguageStrip,
  args: languageStripData,
} satisfies Meta<typeof LanguageStrip>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic = {} satisfies Story;
