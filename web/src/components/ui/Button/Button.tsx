'use client';

import { MouseEventHandler, ReactNode, TouchEventHandler } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Icon from '../Icon/Icon';
import Spinner from '../Spinner/Spinner';

type ButtonType = 'submit' | 'button' | 'reset';
type ButtonSize = 'small' | 'base' | 'large';
type ButtonRank = 'primary' | 'secondary';
type ButtonVariant =
  | 'ghost'
  | 'standard'
  | 'ghost-danger'
  | 'ghost-warn'
  | 'ghost-success'
  | 'outline'
  | 'danger'
  | 'outline-danger'
  | 'warn'
  | 'outline-warn';

export type { ButtonSize, ButtonRank, ButtonVariant, ButtonType };

export interface ButtonProps {
  className?: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  title?: string;
  ariaLabel?: string;
  children?: ReactNode;
  type?: ButtonType;
  tabIndex?: number;
  rank?: ButtonRank;
  size?: ButtonSize;
  form?: string;
  isLink?: boolean;
  to?: string;
  icon?: string;
  loading?: boolean;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: 'noopener' | 'noreferrer' | 'nofollow' | 'external';
  onClick?: MouseEventHandler;
  onMouseUp?: MouseEventHandler;
  onMouseDown?: MouseEventHandler;
  onMouseLeave?: MouseEventHandler;
  onTouchStart?: TouchEventHandler;
  onTouchEnd?: TouchEventHandler;
}

export default function Button({
  rank = 'primary',
  icon = '',
  size = 'base',
  variant = 'standard',
  disabled,
  children,
  to = '',
  className,
  title = '',
  ariaLabel = '',
  onClick,
  onMouseUp,
  onMouseDown,
  onTouchStart,
  onTouchEnd,
  type = 'button',
  isLink = false,
  target = '_self',
  rel = 'noopener',
  loading = false,
  form,
  ...rest
}: ButtonProps) {
  const baseClass = cn(
    'font-(--font-sans)',
    'gap-2',
    'px-4',
    'justify-center',
    'font-semibold',
    'cursor-pointer',
    'border border-(--border)',
    'rounded-[10px]',
    'transition-all duration-(--dur-fast) ease-(--ease)',
    'inline-flex',
    'shrink-0',
    'whitespace-nowrap',
    'text-sm',
    'items-center',
    disabled && 'opacity-50 cursor-not-allowed',
  );

  const backgroundStyle = (buttonBgStyle: string) =>
    variant === 'ghost' ? 'bg-transparent' : buttonBgStyle;

  const rankMap: Record<string, string> = {
    primary: cn(
      'text-[var(--brand-ink)]',
      backgroundStyle('bg-(--brand)'),
      'hover:border-[var(--brand-hover)]',
      'hover:bg-(--brand-hover)',
      // 'shadow-[0_1px_2px_rgba(11,93,93,0.25)]',
    ),
    secondary: cn(
      'text-[var(--text)]',
      backgroundStyle('bg-(--surface)'),
      'hover:bg-(--surface-alt)',
    ),
  };

  const variantMap: Record<string, string> = {
    danger: cn(
      'text-white',
      'bg-(--danger)',
      'border-(--danger)',
      'hover:brightness-90',
    ),
    'outline-danger': cn(
      'text-(--danger)',
      'bg-transparent',
      'border-(--danger)',
      'hover:bg-(--danger-soft)',
    ),
    warn: cn(
      'text-white',
      'bg-(--warn)',
      'border-(--warn)',
      'hover:brightness-90',
    ),
    'outline-warn': cn(
      'text-(--warn)',
      'bg-transparent',
      'border-(--warn)',
      'hover:bg-(--warn-soft)',
    ),
  };

  const sizeMap: Record<string, { button: string; icon: number }> = {
    small: { button: cn('h-10', 'px-4', 'text-sm'), icon: 14 },
    base: { button: cn('h-12', 'px-6', 'text-base'), icon: 16 },
    large: { button: cn('h-14', 'px-8', 'text-lg'), icon: 18 },
  };

  const buttonClassName = cn(
    baseClass,
    variantMap[variant] ?? rankMap[rank],
    sizeMap[size].button,
    className,
  );

  if (isLink) {
    return (
      <Link
        href={to}
        className={buttonClassName}
        target={target}
        title={title}
        aria-label={ariaLabel}
        rel={rel}
      >
        {icon && <Icon type={icon} size={sizeMap[size].icon} />}
        {children}
      </Link>
    );
  }
  return (
    <button
      type={type}
      disabled={disabled}
      className={buttonClassName}
      title={title}
      aria-label={ariaLabel}
      form={form}
      onClick={onClick}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      {...rest}
    >
      {loading ? (
        <Spinner size={size} />
      ) : (
        icon && <Icon type={icon} size={sizeMap[size].icon} />
      )}
      {children}
    </button>
  );
}
