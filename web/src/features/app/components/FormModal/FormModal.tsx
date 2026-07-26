import Modal, { ModalProps } from '@/features/app/components/Modal/Modal';

import Form, { FormHandle, FormProps } from '@/components/ui/Form/Form';
import { Ref, useRef } from 'react';
import { FieldValues } from 'react-hook-form';

interface FormModalProps<T extends FieldValues, TOutput extends FieldValues = T> {
  ref: Ref<HTMLDialogElement>;
  modalProps: ModalProps;
  formProps: FormProps<T, TOutput>;
}

function FormModal<T extends FieldValues, TOutput extends FieldValues = T>({
  ref,
  modalProps,
  formProps,
}: FormModalProps<T, TOutput>) {
  const formRef = useRef<FormHandle<T>>(null);

  const handleModalClose = () => {
    formRef.current?.reset();
    modalProps.onModalClose?.();
  };

  return (
    <Modal
      ref={ref}
      {...{
        ...modalProps,
        onModalClose: handleModalClose,
      }}
    >
      <Form {...formProps} ref={formRef} />
    </Modal>
  );
}

export type { FormModalProps };
export default FormModal;
