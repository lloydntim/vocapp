import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

export const metadata: Metadata = {
  title: 'Log in',
  description:
    'Log in to your VocApp account to keep building and practicing your vocabulary lists.',
  robots: { index: false, follow: true },
};

export default function Layout({ children }: Readonly<PropsWithChildren>) {
  return children;
}
