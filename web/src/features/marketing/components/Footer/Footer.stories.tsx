import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Footer from './Footer';

const meta = {
  component: Footer,
  args: {
    branding: (
      <p>
        The clean, focused way to learn and remember vocabulary in any
        language.
      </p>
    ),
    columns: [
      {
        title: 'Product',
        links: [
          { href: '#features', text: 'Features' },
          { href: '#how', text: 'How it works' },
          { href: '#practice', text: 'Practice' },
          { href: '/login', text: 'Open app' },
        ],
      },
      {
        title: 'Company',
        links: [
          { href: '#top', text: 'About' },
          { href: '#top', text: 'Privacy' },
          { href: '#top', text: 'Terms' },
          { href: '#top', text: 'Contact' },
        ],
      },
    ],
    bottom: {
      startYear: 2019,
      company: 'LNCD Ltd',
      slogan: 'Made for learners, not streak-chasers.',
    },
  },
} satisfies Meta<typeof Footer>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const NewCompany = {
  args: {
    bottom: {
      startYear: new Date().getFullYear(),
      company: 'LNCD Ltd',
      slogan: 'Made for learners, not streak-chasers.',
    },
  },
} satisfies Story;
