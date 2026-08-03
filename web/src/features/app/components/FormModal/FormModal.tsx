import Modal, { ModalProps } from '@/features/app/components/Modal/Modal';

import Form, { FormHandle, FormProps } from '@/components/ui/Form/Form';
import { RefObject, Ref, useRef } from 'react';
import { FieldValues } from 'react-hook-form';

interface FormModalProps<T extends FieldValues, TOutput extends FieldValues = T> {
  ref: Ref<HTMLDialogElement>;
  modalProps: ModalProps;
  formProps: FormProps<T, TOutput>;
  /** Exposes the form's imperative handle (setValue/getValues/trigger/reset)
   * to the caller — needed when an action button living in the modal footer
   * (outside the <form> element) has to read or write field values, e.g. a
   * "Translate" button that fills in a field before the "Save" step. Pass a
   * `useRef<FormHandle<T>>(null)` object; a plain object ref, not a callback,
   * so it can double as the ref FormModal itself uses to reset the form. */
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

  // The dialog can also close without going through onModalClose — e.g. a
  // parent calling dialogRef.current?.close() directly after a successful
  // save. The native `close` event fires either way, so reset the form
  // there too (idempotent if handleModalClose already reset it).
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
