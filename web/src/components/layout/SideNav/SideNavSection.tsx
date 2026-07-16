import React from 'react';

const sideNavSectionTitleClass =
  'uppercase tracking-[0.14em] text-white/45 p-[18px_12px_6px] text-[11px]';

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