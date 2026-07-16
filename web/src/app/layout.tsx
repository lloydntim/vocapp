import React, { ReactNode } from 'react';
import './global.css';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html className="dark">
      <body>{children}</body>
    </html>
  );
}
