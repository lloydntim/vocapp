import React, {
  ChangeEventHandler,
  InputHTMLAttributes,
  ReactNode,
  forwardRef,
  useState,
} from 'react';
import Icon from '../Icon/Icon';
import { cn } from '@/lib/utils';

const CHECK_ICON_SIZE = 12;
const ERROR_ICON_SIZE = 17;

const checkboxRowClass =
  'flex items-center gap-2.5 text-sm text-(--text-muted) leading-1.5 cursor-pointer';
const checkboxClass =
  'size-4.5 mt-0.5 rounded-[5px] border-[1.5px] border-(--border-strong) bg-(--surface) inline-grid place-items-center cursor-pointer transition-all duration-(--dur) ease-(--ease) flex-shrink-0';
const checkboxActiveClass = 'bg-(--brand) border-(--brand) text-white';

const inputErrorClass =
  'flex items-center gap-1.5 text-sm text-[var(--danger)] leading-1.4 animate-field-error-in ease-[var(--ease)] duration-[160ms]';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  label?: ReactNode;
  error?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ id, checked, label, error, onChange, ...rest }, ref) {
    const [isChecked, setIsChecked] = useState(checked ?? false);
    const errorId = `${id}-error`;
    const hasError = Boolean(error);
    return (
      <>
        <label className={checkboxRowClass}>
          <input
            ref={ref}
            className="hidden"
            id={id}
            type="checkbox"
            checked={isChecked}
            onChange={(e) => {
              setIsChecked(e.target.checked);
              onChange?.(e);
            }}
            {...rest}
          />
          <span
            className={cn(checkboxClass, isChecked && checkboxActiveClass)}
          >
            {isChecked && <Icon size={CHECK_ICON_SIZE} type="check" />}
          </span>
          {label && <span>{label}</span>}
        </label>
        {hasError && (
          <div className={inputErrorClass} id={errorId} role="alert">
            <Icon size={ERROR_ICON_SIZE} type="circle-alert" />
            <span>{error}</span>
          </div>
        )}
      </>
    );
  },
);

export default Checkbox;
