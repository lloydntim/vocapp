import React from 'react';
import { cn } from '@/lib/utils';

const appSidebarClass = cn(
  'hidden md:flex flex-col gap-1 shrink-0',
  'py-5 md:w-[84px] md:px-2 lg:w-[260px] lg:px-3.5',
  'text-(--text) sticky top-0 h-screen overflow-y-auto',
  'bg-(--surface) border-r border-(--border)',
);

export default function SideNav({ children }: React.PropsWithChildren) {
  return <aside className={appSidebarClass}>{children}</aside>;
}
