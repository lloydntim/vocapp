import { cn } from '@/lib/utils';
import Icon from '../Icon/Icon';
import IconButton from '../IconButton/IconButton';
import type { ButtonVariant } from '../Button/Button';

type FormBannerStatus = 'error' | 'warn' | 'success';

interface FormBannerProps {
  className?: string;
  title?: string;
  message: string;
  role?: string;
  status?: FormBannerStatus;
  onDismiss?: () => void;
  showDismissButton?: boolean;
}

const ICON_SIZE = 18;

const formBannerStatusClassMap: Record<
  FormBannerStatus,
  { bg: string; border: string; icon: string; variant: ButtonVariant }
> = {
  error: {
    bg: 'bg-(--danger-soft) text-(--danger)',
    border: 'border-[color-mix(in_oklab,var(--danger)_26%,transparent)]',
    icon: 'circle-alert',
    variant: 'ghost-danger',
  },
  warn: {
    bg: 'bg-(--warn-soft) text-(--warn)',
    border: 'border-[color-mix(in_oklab,var(--warn)_26%,transparent)]',
    icon: 'triangle-alert',
    variant: 'ghost-warn',
  },
  success: {
    bg: 'bg-(--success-soft) text-(--success)',
    border: 'border-[color-mix(in_oklab,var(--success)_26%,transparent)]',
    icon: 'circle-check',
    variant: 'ghost-success',
  },
};

const formBannerClass = cn(
  'flex items-flex-start gap-2.5 text-[13px] leading-[1.5] py-3 px-3.5 rounded-[12px] border',
  'animate-[form-banner-shake_200ms_var(--ease)]',
);

const closeButtonClass = cn(
  'transition-opacity duration-[var(--dur-fast)] ease-[var(--ease)]',
  'flex flex-[0_0_22px]',
  'cursor-pointer',
  'opacity-70',
  'grid place-items-center',
  'size-5.5',
  'border-none bg-transparent',
  'opacity-70 hover:opacity-100',
  'rounded-[6px] p-0 m-0 -mr-[2px] -mt-[2px]',
);

function FormBanner({
  className,
  title,
  message,
  role,
  status = 'error',
  onDismiss,
  showDismissButton = true,
}: FormBannerProps) {
  const { bg, border, icon, variant } = formBannerStatusClassMap[status];

  return (
    <div
      className={cn(formBannerClass, bg, border, className)}
      role={role ?? 'alert'}
    >
      <Icon type={icon} className="auth-error-icon" size={ICON_SIZE} />
      <div className="flex flex-1 min-w-0 flex-col gap-0.5">
        <strong>{title}</strong>
        <span>{message}</span>
      </div>
      {showDismissButton && (
        <IconButton
          variant={variant}
          icon="close"
          className={closeButtonClass}
          aria-label="Dismiss"
          onClick={onDismiss}
        />
      )}
    </div>
  );
}

export default FormBanner;
