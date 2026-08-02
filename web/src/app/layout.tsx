import React, { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import Providers from './providers';
import './global.css';

const siteDescription =
  'The clean, focused way to learn and remember vocabulary in any language. Build custom lists, drill them with fast flashcards, and track your mastery.';

export const metadata: Metadata = {
  title: {
    default: 'VocApp — Vocabulary that actually sticks',
    template: '%s | VocApp',
  },
  description: siteDescription,
  openGraph: {
    title: 'VocApp — Vocabulary that actually sticks',
    description: siteDescription,
    siteName: 'VocApp',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'VocApp — Vocabulary that actually sticks',
    description: siteDescription,
  },
};

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
