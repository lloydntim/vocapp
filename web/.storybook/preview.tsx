import type { Preview } from '@storybook/nextjs-vite';

import { withThemeByClassName } from '@storybook/addon-themes';
import { NextIntlClientProvider } from 'next-intl';

import '../src/app/global.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: '', // Empty string for light mode
        dark: 'dark', // Applies 'dark' class
      },
      defaultTheme: 'light',
    }),
    (Story) => (
      // Components using next-intl's Link/useRouter (e.g. our Link, and
      // anything built on it like DataTablePanel) need this context —
      // there's no real Next.js request in Storybook to infer it from.
      <NextIntlClientProvider locale="en">
        <Story />
      </NextIntlClientProvider>
    ),
  ],
};

export default preview;
