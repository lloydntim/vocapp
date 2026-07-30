'use client';

import Headline from '@/components/ui/Headline/Headline';
import IconButton from '@/components/ui/IconButton/IconButton';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher/ThemeSwitcher';
import { useMobileNavStore } from '@/components/layout/SideNav/mobile-nav-store';

const topbarClass =
  'h-16 px-7 flex items-center gap-4 bg-(--surface) border-b border-(--border) sticky top-0 z-30 py-2';

const topbarRightClass = 'flex ml-auto gap-2.5 items-center';
const titleClass = 'text-[20px] font-bold tracking-[-0.01em] m-0';
const titleWrapClass = 'flex flex-col justify-center';
const titleCrumbClass =
  'text-[12px] text-(--text-dim) mb-0.5 tracking-[0.04em] uppercase';

interface TopBarProps {
  path: string;
  title: string;
}

function TopBar({ path, title }: TopBarProps) {
  const openMobileNav = useMobileNavStore((state) => state.open);

  return (
    <header className={topbarClass}>
      <IconButton
        icon="menu"
        variant="ghost"
        title="Toggle menu"
        className="md:hidden"
        onClick={openMobileNav}
      />
      <div className={titleWrapClass}>
        <div className={titleCrumbClass}>{path || 'Dashboard'}</div>
        <Headline level="h1" className={titleClass}>
          {title}
        </Headline>
      </div>
      <div className={topbarRightClass}>
        <ThemeSwitcher />
      </div>
    </header>
  );
}

export default TopBar;
