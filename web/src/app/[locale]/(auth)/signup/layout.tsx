import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

export const metadata: Metadata = {
  title: 'Sign up',
  description:
    'Create a free VocApp account and start building custom vocabulary lists in minutes.',
  robots: { index: false, follow: true },
};

export default function Layout({ children }: Readonly<PropsWithChildren>) {
  return children;
}
