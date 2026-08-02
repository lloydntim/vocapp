'use client';

import IconButton from '@/components/ui/IconButton/IconButton';
import Logo from '@/components/ui/Logo/Logo';
import { PropsWithChildren, ReactNode } from 'react';

interface AuthFormColumnProps extends PropsWithChildren {
  authHeaderLink?: ReactNode;
}

const authPageColumnClass =
  'flex-1 flex flex-col py-6 px-5.5 min-w-0 md:px-8 md:py-10';
const authTopClass = 'flex items-center justify-between';
const authTopRightClass = 'flex items-center gap-3.5';
const authTopLink = 'text-sm text-(--text-muted)';

function AuthFormColumn({ authHeaderLink, children }: AuthFormColumnProps) {
  return (
    <div className={authPageColumnClass}>
      <div className={authTopClass}>
        <Logo href="/" />
        <div className={authTopRightClass}>
          <IconButton title="Toggle theme" icon="moon" onClick={() => {}} />
          {authHeaderLink && (
            <div className={authTopLink}>{authHeaderLink}</div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

export default AuthFormColumn;
