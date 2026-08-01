import Button, { ButtonProps } from '@/components/ui/Button/Button';
import Icon, { IconProps } from '@/components/ui/Icon/Icon';
import { cn } from '@/lib/utils';
import { HTMLAttributes, ReactNode } from 'react';

type CalloutVariant = 'neutral' | 'danger' | 'warning' | 'success';

interface CalloutActionProps extends Omit<ButtonProps, 'children'> {
  label: ReactNode;
}

interface CalloutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  message?: ReactNode;
  icon?: IconProps['type'];
  action?: CalloutActionProps;
  variant?: CalloutVariant;
  hasBorder?: boolean;
}

export type { CalloutActionProps, CalloutProps, CalloutVariant };

const calloutClass =
  'flex flex-wrap items-center gap-3.5 rounded-[10px] px-3.5 py-3';
const calloutIconClass =
  'grid size-[42px] shrink-0 place-items-center rounded-[10px]';
const calloutContentClass = 'min-w-0 flex-1';
const calloutTitleClass = 'text-[13px] font-semibold';
const calloutMessageClass = 'text-xs text-(--text-muted)';

const variantClassMap: Record<
  CalloutVariant,
  { container: string; icon: string; title: string }
> = {
  neutral: {
    container: 'bg-(--surface-2)',
    icon: 'bg-(--brand-soft) text-(--brand)',
    title: 'text-(--text)',
  },
  danger: {
    container: 'bg-(--danger-soft)',
    icon: 'bg-(--surface) text-(--danger)',
    title: 'text-(--danger)',
  },
  warning: {
    container: 'bg-(--warn-soft)',
    icon: 'bg-(--surface) text-(--warn)',
    title: 'text-(--warn)',
  },
  success: {
    container: 'bg-(--success-soft)',
    icon: 'bg-(--surface) text-(--success)',
    title: 'text-(--success)',
  },
};

function CalloutAction({ label, ...buttonProps }: CalloutActionProps) {
  return (
    <div className="ml-auto shrink-0">
      <Button {...buttonProps}>{label}</Button>
    </div>
  );
}

export default function Callout({
  title,
  message,
  icon,
  action,
  variant = 'neutral',
  hasBorder = true,
  className,
  ...rest
}: CalloutProps) {
  const variantClasses = variantClassMap[variant];

  return (
    <div
      className={cn(
        calloutClass,
        variantClasses.container,
        hasBorder && 'border border-(--border)',
        className,
      )}
      {...rest}
    >
      {icon && (
        <div className={cn(calloutIconClass, variantClasses.icon)}>
          <Icon aria-hidden="true" size={20} type={icon} />
        </div>
      )}

      <div className={calloutContentClass}>
        <div className={cn(calloutTitleClass, variantClasses.title)}>
          {title}
        </div>
        {message && <div className={calloutMessageClass}>{message}</div>}
      </div>

      {action && <CalloutAction {...action} />}
    </div>
  );
}
