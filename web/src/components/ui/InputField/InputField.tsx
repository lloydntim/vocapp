'use client';

import { cn } from '@/lib/utils';
import { ChangeEvent, InputHTMLAttributes, forwardRef, useState } from 'react';
import Icon from '../Icon/Icon';
import IconButton from '../IconButton/IconButton';

export interface InputFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  className?: string;
  label?: string;
  id: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  icon?: string;
  hint?: string;
  error?: string;
  size?: 'small' | 'base' | 'large';
  showPasswordStrength?: boolean;
}

const ICON_SIZE = 17;

const inputIconWrapperClass =
  'absolute left-[13px] top-1/2 -translate-y-1/2 text-(--text-dim) pointer-events-none h';

const inputClass =
  'h-12 bg-[var(--surface-2)] border border-[var(--border)] rounded-[10px] px-10 w-full text-sm text-[var(--text)] transition-[border-color,background] duration-[var(--dur-fast)] ease-[var(--ease)] disabled:opacity-50 disabled:cursor-not-allowed';
const inputFocus =
  'focus:outline-none focus:border-[var(--brand)] focus:bg-[var(--surface)] focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--brand)_20%,transparent)]';

const inputFieldClass = 'group flex flex-col gap-1.5 flex-1';
const inputWrapClass = 'relative flex';
const inputLabelClass =
  'text-sm font-medium text-[var(--text-muted)] group-has-[:disabled]:opacity-50';
const inputHintClass = 'text-sm text-[var(--text-dim)]';
const inputErrorClass =
  'flex items-center gap-1.5 text-sm text-[var(--danger)] leading-1.4 animate-field-error-in ease-[var(--ease)] duration-[160ms]';

const inputIconMap: Record<string, string> = {
  password: 'lock',
  email: 'mail',
  search: 'search',
};

const passwordStrengthBarClassMap: Record<string, string> = {
  empty: 'bg-(--surface-alt)',
  weak: ' first:bg-(--danger)',
  medium: 'nth-[-n+2]:bg-(--warn)',
  strong: 'bg-(--success)',
};

const sizeMap: Record<string, { input: string; icon: number }> = {
  small: { input: cn('h-10', 'px-9', 'text-sm'), icon: 14 },
  base: { input: cn('h-12', 'px-10', 'text-base'), icon: ICON_SIZE },
  large: { input: cn('h-14', 'px-11', 'text-lg'), icon: 18 },
};

const passwordVisibilityToggleClass =
  'absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent text-(--text-dim) cursor-pointer grid place-items-center p-1 shadow-none hover:bg-(--transparent) hover:text-(--text-muted) h-auto';

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField(
    {
      label,
      id,
      type = 'text',
      placeholder,
      autoComplete,
      required = false,
      onChange,
      icon,
      hint,
      error,
      showPasswordStrength,
      className,
      size = 'base',
      ...rest
    },
    ref,
  ) {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState<
      'weak' | 'medium' | 'strong' | 'empty'
    >('empty');
    const hasError = Boolean(error);
    const isPassword = type === 'password';

    const hintId = `${id}-hint`;
    const errorId = `${id}-error`;
    const strengthId = `${id}-strength`;
    const describedBy = [hintId, hasError && errorId].filter(Boolean).join(' ');

    const resolvedIcon = icon || inputIconMap[type];

    const passwordStrengthClass = isPassword ? 'flex gap-1 mt-0.5' : 'hidden';
    const passwordStrengthBarClass = cn(
      'flex-1 h-1 rounded-full',
      passwordStrengthBarClassMap[passwordStrength],
    );

    const togglePasswordVisibility = () => {
      setPasswordVisible((prev) => !prev);
    };

    const updatePasswordStrength = (value: string) => {
      const hasMinLength = value.length >= 8;
      const hasLetter = /[a-zA-Z]/.test(value);
      const hasNumber = /\d/.test(value);

      if (value.length === 0) {
        setPasswordStrength('empty');
      } else if (!hasMinLength) {
        setPasswordStrength('weak');
      } else if (!hasLetter || !hasNumber) {
        setPasswordStrength('medium');
      } else {
        setPasswordStrength('strong');
      }
    };

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      if (isPassword) {
        updatePasswordStrength(e.target.value);
      }
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className={inputFieldClass}>
        {label && (
          <label className={inputLabelClass} htmlFor={id}>
            {label}
          </label>
        )}
        <div className={inputWrapClass}>
          {resolvedIcon && (
            <span className={inputIconWrapperClass} aria-hidden="true">
              <Icon size={sizeMap[size].icon} type={resolvedIcon} />
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              inputClass,
              inputFocus,
              sizeMap[size].input,
              !resolvedIcon && 'pl-4.5',
              className,
            )}
            id={id}
            type={isPassword && !passwordVisible ? 'password' : 'text'}
            placeholder={placeholder}
            autoComplete={autoComplete}
            required={required}
            aria-invalid={hasError}
            aria-describedby={describedBy}
            onChange={onChangeHandler}
            {...rest}
          />
          {isPassword && (
            <IconButton
              onClick={togglePasswordVisibility}
              ariaLabel={passwordVisible ? 'Hide password' : 'Show password'}
              className={passwordVisibilityToggleClass}
              icon={passwordVisible ? 'eye-off' : 'eye'}
            />
          )}
        </div>
        {isPassword && showPasswordStrength && (
          <div
            className={passwordStrengthClass}
            id={strengthId}
            aria-hidden={isPassword ? 'true' : 'false'}
          >
            <span className={passwordStrengthBarClass}></span>
            <span className={passwordStrengthBarClass}></span>
            <span className={passwordStrengthBarClass}></span>
          </div>
        )}
        {hint && (
          <span className={inputHintClass} id={hintId}>
            {hint}
          </span>
        )}
        {hasError && (
          <div className={inputErrorClass} id={errorId} role="alert">
            <Icon size={sizeMap[size].icon} type="circle-alert" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  },
);

export default InputField;
