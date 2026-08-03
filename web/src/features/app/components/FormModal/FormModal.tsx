import Modal, { ModalProps } from '@/features/app/components/Modal/Modal';

import Form, { FormHandle, FormProps } from '@/components/ui/Form/Form';
import { RefObject, Ref, useRef } from 'react';
import { FieldValues } from 'react-hook-form';

interface FormModalProps<
  T extends FieldValues,
  TOutput extends FieldValues = T,
> {
  ref: Ref<HTMLDialogElement>;
  modalProps: ModalProps;
  formProps: FormProps<T, TOutput>;
  /**
   * Gives buttons outside the form access to its values and actions.
   * Pass a ref created with `useRef<FormHandle<T>>(null)`.
   */
  formRef?: RefObject<FormHandle<T> | null>;
}

function FormModal<T extends FieldValues, TOutput extends FieldValues = T>({
  ref,
  modalProps,
  formProps,
  formRef,
}: FormModalProps<T, TOutput>) {
  const localFormRef = useRef<FormHandle<T>>(null);
  const resolvedFormRef = formRef ?? localFormRef;

  const handleModalClose = () => {
    resolvedFormRef.current?.reset();
    modalProps.onModalClose?.();
  };

  // Reset the form whenever the dialog closes, including when it is closed
  // directly by the parent. Resetting twice is safe.
  const handleNativeClose = () => {
    resolvedFormRef.current?.reset();
  };

  return (
    <Modal
      ref={ref}
      {...{
        ...modalProps,
        onModalClose: handleModalClose,
        onClose: handleNativeClose,
      }}
    >
      <Form {...formProps} ref={resolvedFormRef} />
    </Modal>
  );
}

export type { FormModalProps };
export default FormModal;
