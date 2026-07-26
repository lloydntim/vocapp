'use client';

import type { Ref } from 'react';
import Modal from '@/features/app/components/Modal/Modal';
import { useLogout } from '@/features/auth/hooks';
import { useRouter } from '@/i18n/navigation';

interface LogoutModalProps {
  ref: Ref<HTMLDialogElement>;
  onModalClose(): void;
}

function LogoutModal({ ref, onModalClose }: LogoutModalProps) {
  const logoutMutation = useLogout();
  const router = useRouter();

  const logoutHandler = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        onModalClose();
        router.push('/login');
      },
    });
  };

  return (
    <Modal
      ref={ref}
      header={{
        title: 'You are about to logout',
        icon: {
          variant: 'warn',
          type: 'log-out',
        },
      }}
      footer={{
        saveButtonProps: {
          label: 'Logout',
          variant: 'warn',
          onClick: logoutHandler,
          loading: logoutMutation.isPending,
        },
        cancelButtonProps: {
          label: 'Cancel',
        },
      }}
      onModalClose={onModalClose}
    >
      Are you sure you want to log out?
    </Modal>
  );
}

export type { LogoutModalProps };
export default LogoutModal;
