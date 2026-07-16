import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';

const switchRowClass =
  'inline-flex items-center gap-2.5 text-sm text-(--text-muted) leading-1.5 cursor-pointer has-disabled:cursor-not-allowed has-disabled:opacity-50';

const switchTrackClass = cn(
  'relative h-[22px] w-[38px] shrink-0 cursor-pointer rounded-full border-0 bg-(--border-strong)',
  'transition-colors duration-(--dur-fast) ease-(--ease)',
  'after:absolute after:left-[3px] after:top-[3px] after:size-4 after:rounded-full after:bg-white after:shadow-(--shadow-sm) after:content-[\'\']',
  'after:transition-transform after:duration-(--dur-fast) after:ease-(--ease)',
  'peer-checked:bg-(--brand) peer-checked:after:translate-x-4',
  'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-(--brand)',
  'peer-disabled:cursor-not-allowed',
);

interface SwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { id, label, disabled, ...rest },
  ref,
) {
  return (
    <label htmlFor={id} className={switchRowClass}>
      <input
        ref={ref}
        id={id}
        type="checkbox"
        role="switch"
        disabled={disabled}
        className="peer sr-only"
        {...rest}
      />
      <span aria-hidden="true" className={switchTrackClass} />
      {label && <span>{label}</span>}
    </label>
  );
});

export default Switch;
