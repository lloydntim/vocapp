import React, { PropsWithChildren } from 'react';
import Providers from './providers';
import './global.css';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html className="dark">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
