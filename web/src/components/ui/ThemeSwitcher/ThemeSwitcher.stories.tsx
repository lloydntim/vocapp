import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ThemeProvider } from 'next-themes';

import { ThemeSwitcher } from './ThemeSwitcher';

const meta = {
  component: ThemeSwitcher,
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof ThemeSwitcher>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic = {} satisfies Story;
