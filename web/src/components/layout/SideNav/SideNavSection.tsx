import React from 'react';

const sideNavSectionTitleClass =
  'hidden lg:block uppercase tracking-[0.14em] text-(--text-dim) p-[18px_12px_6px] text-[11px]';

export interface SideNavSectionProps {
  title?: string;
  children: React.ReactNode;
}

export default function SideNavSection({
  title,
  children,
}: SideNavSectionProps) {
  return (
    <>
      {title && <div className={sideNavSectionTitleClass}>{title}</div>}
      {children}
    </>
  );
}