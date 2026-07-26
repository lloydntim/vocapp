import ButtonGroup, {
  ButtonItemProps,
} from '@/components/ui/ButtonGroup/ButtonGroup';
import Headline from '@/components/ui/Headline/Headline';
import IconButton from '@/components/ui/IconButton/IconButton';
import Icon from '@/components/ui/Icon/Icon';
import React, {
  ComponentProps,
  DialogHTMLAttributes,
  forwardRef,
  PropsWithChildren,
} from 'react';
import { cn } from '@/lib/utils';

interface ModalProps
  extends DialogHTMLAttributes<HTMLDialogElement>, PropsWithChildren {
  header: {
    title: string;
    icon?: {
      variant: 'danger' | 'success' | 'warn';
      type: ComponentProps<typeof Icon>['type'];
    };
  };
  footer: {
    cancelButtonProps?: ButtonItemProps<'button'>;
    saveButtonProps: ButtonItemProps<'button'>;
  };
  showCloseButton?: boolean;
  onModalClose?: () => void;
}

const modalClass = cn(
  'bg-(--surface) border border-(--border) rounded-(--radius-lg) shadow-(--shadow-lg) text-(--text)',
  'w-[min(520px,calc(100vw-32px))] max-h-[calc(100vh-32px)] overflow-hidden  m-auto',
  'animate-[rise_280ms_(--ease)] backdrop:bg-black/50 z-1000',
);
const modalHeaderIconClass = 'size-9 rounded-[10px] grid place-items-center';
const modalHeaderTitleClass = 'text-[17px] m-0 font-semibold';

const modalHeaderClass =
  'py-5 px-6 flex items-center gap-[12px] border-b border-(--border)';
const modalBodyClass = 'py-5.5 px-6 flex flex-col gap-4';
const modalFooterClass =
  'py-4 px-6 flex justify-end gap-2.5 border-t border-(--border) bg-(--surface-2)';

const Modal = forwardRef<HTMLDialogElement, ModalProps>(function Modal(
  {
    header: { title, icon },
    children,
    onModalClose,
    showCloseButton = true,
    footer: { cancelButtonProps, saveButtonProps },
    ...rest
  },
  ref,
) {
  const keyDownHandler = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      onModalClose?.();
    }
  };

  return (
    // <div className="scrim">
    <dialog
      ref={ref}
      className={modalClass}
      {...rest}
      onKeyDown={keyDownHandler}
    >
      <div className={modalHeaderClass}>
        {icon && (
          <div
            className={cn(
              modalHeaderIconClass,
              icon.variant === 'danger'
                ? 'bg-(--danger-soft) text-(--danger)'
                : icon.variant === 'warn'
                  ? 'bg-(--warn-soft) text-(--warn)'
                  : 'bg-(--success-soft) text-(--success)',
            )}
          >
            <Icon size={18} type={icon.type} />
          </div>
        )}

        <Headline level="h3" className={modalHeaderTitleClass}>
          {title}
        </Headline>

        {showCloseButton && (
          <IconButton
            icon="close"
            variant="ghost"
            size="small"
            className="ml-auto"
            onClick={onModalClose}
          />
        )}
      </div>
      <div className={modalBodyClass}>{children}</div>
      <ButtonGroup
        className={modalFooterClass}
        stretch={false}
        buttons={[
          {
            rank: 'secondary',
            ...cancelButtonProps,
            label: cancelButtonProps?.label || 'Cancel',
            onClick: onModalClose,
          },
          saveButtonProps,
        ]}
      />
    </dialog>
    // </div>
  );
});

export type { ModalProps };
export default Modal;
