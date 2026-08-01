import type { ReactNode, Ref } from 'react';
import Modal from '@/features/app/components/Modal/Modal';

interface DeleteModalProps {
  ref: Ref<HTMLDialogElement>;
  objectId?: string;
  title: string;
  message: ReactNode;
  isLoading: boolean;
  onDelete(args: unknown): void;
  onModalClose(): void;
}

function DeleteModal({
  ref,
  title,
  message,
  objectId,
  isLoading,
  onDelete,
  onModalClose,
}: DeleteModalProps) {
  return (
    <Modal
      ref={ref}
      header={{
        title,
        icon: {
          variant: 'danger',
          type: 'trash-2',
        },
      }}
      footer={{
        saveButtonProps: {
          label: 'Delete',
          variant: 'danger',
          loading: isLoading,
          onClick: () => onDelete(objectId),
        },
        cancelButtonProps: {
          label: 'Cancel',
        },
      }}
      onModalClose={onModalClose}
    >
      {message}
    </Modal>
  );
}

export type { DeleteModalProps };
export default DeleteModal;
