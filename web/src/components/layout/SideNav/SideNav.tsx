import React from 'react';

const appSidebarClass =
  'w-[260px] flex-0-0-[260px] text-(--text-light) py-5 px-3.5 flex flex-col gap-1 sticky top-0 h-screen bg-(--surface) border-r border-(--border)';

export default function SideNav({ children }: React.PropsWithChildren) {
  return <aside className={appSidebarClass}>{children}</aside>;
}
