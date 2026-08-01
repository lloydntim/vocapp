import React, { PropsWithChildren } from 'react';
import Providers from './providers';
import './global.css';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
