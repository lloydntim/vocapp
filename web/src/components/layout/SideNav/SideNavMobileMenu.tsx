'use client';

import { useEffect, useRef } from 'react';
import IconButton from '@/components/ui/IconButton/IconButton';
import { User } from '@/features/auth/types';
import SideNavSections from './SideNavSections';
import SideNavFooter from './SideNavFooter';
import { sideNavData } from './data';
import { useMobileNavStore } from './mobile-nav-store';

const dialogClass =
  'md:hidden open:flex flex-col gap-1 fixed inset-0 z-1000 h-dvh w-full max-w-none max-h-none m-0 p-5 bg-(--surface) text-(--text) backdrop:bg-black/50';
const closeButtonWrapClass = 'flex justify-end mb-2';

interface SideNavMobileMenuProps {
  user: Pick<User, 'firstName' | 'lastName' | 'plan'>;
}

export default function SideNavMobileMenu({ user }: SideNavMobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isOpen = useMobileNavStore((state) => state.isOpen);
  const close = useMobileNavStore((state) => state.close);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    const handleChange = () => {
      if (mql.matches) close();
    };
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [close]);

  return (
    <dialog
      ref={dialogRef}
      className={dialogClass}
      onClose={close}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          close();
        }
      }}
    >
      <div className={closeButtonWrapClass}>
        <IconButton
          icon="close"
          variant="outline"
          title="Close menu"
          onClick={close}
        />
      </div>
      <SideNavSections data={sideNavData} />
      <SideNavFooter user={user} />
    </dialog>
  );
}
