import Modal, { ModalProps } from '@/features/app/components/Modal/Modal';

import Form, { FormProps } from '@/components/ui/Form/Form';
import type { Ref } from 'react';
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
  return (
    <Modal
      ref={ref}
      {...{
        ...modalProps,
        onModalClose: modalProps.onModalClose,
      }}
    >
      <Form {...formProps} />
    </Modal>
  );
}

export type { FormModalProps };
export default FormModal;
