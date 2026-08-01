'use client';

import { useRef } from 'react';
import IconButton from '@/components/ui/IconButton/IconButton';
import ProfileAvatar from '@/features/profile/components/ProfileAvatar/ProfileAvatar';
import LogoutModal from '@/features/auth/components/LogoutModal/LogoutModal';
import { User } from '@/features/auth/types';

const sideNavFooterClass =
  'mt-auto py-3 px-2.5 border-t border-(--border) flex items-center gap-2.5 md:justify-center lg:justify-start';
const sideNavFooterIconButtonClass =
  'ml-auto text-(--text-dim) border-transparent md:hidden lg:grid';

interface SideNavFooterProps {
  user: Pick<User, 'firstName' | 'lastName' | 'plan'>;
}

export default function SideNavFooter({ user }: SideNavFooterProps) {
  const logoutDialogRef = useRef<HTMLDialogElement>(null);

  if (!user) {
    return null;
  }
  const { firstName, lastName, plan } = user;

  const userInitials = `${firstName[0]}${lastName[0]}`.toUpperCase();

  return (
    <div className={sideNavFooterClass}>
      <ProfileAvatar initials={userInitials} size="small" />
      <div className="hidden lg:block text-sm leading-[1.2]">
        {`${firstName} ${lastName.slice(0, 1).toLocaleUpperCase()}.`}
        <small className="text-(--text-dim) text-11px flex">{`${plan[0]}${plan.slice(1, plan.length).toLocaleLowerCase()} plan`}</small>
      </div>
      <IconButton
        icon="log-out"
        variant="ghost"
        className={sideNavFooterIconButtonClass}
        title="Logout"
        onClick={() => logoutDialogRef.current?.showModal()}
      />
      <LogoutModal
        ref={logoutDialogRef}
        onModalClose={() => logoutDialogRef.current?.close()}
      />
    </div>
  );
}
