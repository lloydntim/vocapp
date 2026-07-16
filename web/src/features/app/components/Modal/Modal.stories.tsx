import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ComponentProps, useEffect, useRef } from 'react';

import Modal from './Modal';

function ModalPreview(args: ComponentProps<typeof Modal>) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  return <Modal ref={dialogRef} {...args} />;
}

const meta = {
  component: Modal,
  args: {
    header: {
      title: 'Delete this list?',
    },
    footer: {
      cancelButtonProps: { children: 'Cancel' },
      saveButtonProps: { children: 'Delete', rank: 'primary' },
    },
    children: 'This action cannot be undone.',
  },
  render: (args) => <ModalPreview {...args} />,
} satisfies Meta<typeof Modal>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const WithDangerIcon = {
  args: {
    header: {
      title: 'Delete this list?',
      icon: { variant: 'danger', type: 'trash-2' },
    },
  },
} satisfies Story;

export const WithSuccessIcon = {
  args: {
    header: {
      title: 'List saved',
      icon: { variant: 'success', type: 'check' },
    },
  },
} satisfies Story;

export const NoCloseButton = {
  args: {
    showCloseButton: false,
  },
} satisfies Story;

export const LongContent = {
  args: {
    children: Array.from({ length: 8 }, (_, i) => (
      <p key={i}>
        Paragraph {i + 1}: this modal body scrolls once its content exceeds
        the available height.
      </p>
    )),
  },
} satisfies Story;
