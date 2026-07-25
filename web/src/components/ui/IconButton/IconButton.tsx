'use client';

import { MouseEventHandler, TouchEventHandler } from 'react';
import type { ButtonRank, ButtonVariant, ButtonType } from '../Button/Button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Icon from '../Icon/Icon';
import Spinner from '../Spinner/Spinner';

const rankMap: Record<string, string> = {
  primary: cn(
    'text-[var(--brand-ink)]',
    'bg-[var(--brand)]',
    'hover:border-[var(--brand-hover)]',
    'hover:bg-[var(--brand-hover)]',
    'shadow-[0_1px_2px_rgba(11,93,93,0.25)]',
  ),
  secondary: cn(
    'text-[var(--text)]',
    'bg-(--surface)',
    'hover:bg-(--surface-alt)',
  ),
};

const sizeMap: Record<string, { button: string; icon: number }> = {
  small: { button: 'size-9', icon: 16 },
  base: { button: 'size-9', icon: 16 },
  large: { button: 'size-10', icon: 18 },
};
const ghostVariantClass =
  'bg-transparent text-(--text-muted) border-transparent shadow-none';

const variantMap: Record<string, string> = {
  ghost: cn(
    ghostVariantClass,
    'hover:bg-(--surface-alt) hover:text-(--brand) hover:border-(--border) shadow-none',
  ),
  'ghost-danger': cn(
    ghostVariantClass,
    'hover:bg-(--danger-soft) hover:text-(--danger) hover:border-(--danger)',
  ),
  'ghost-success': cn(
    ghostVariantClass,
    'hover:bg-(--success-soft) hover:text-(--success) hover:border-(--success)',
  ),
  'ghost-warn': cn(
    ghostVariantClass,
    'hover:bg-(--warn-soft) hover:text-(--warn) hover:border-(--warn)',
  ),
  outline: cn(
    ghostVariantClass,
    'border-(--border)',
    'hover:border-(--brand) hover:bg-(--surface-alt) hover:text-(--brand)',
  ),
};

interface IconButtonProps {
  className?: string;
  disabled?: boolean;
  title?: string;
  ariaLabel?: string;
  type?: ButtonType;
  tabIndex?: number;
  rank?: ButtonRank;
  variant?: ButtonVariant;
  isLink?: boolean;
  icon?: string;
  size?: 'small' | 'base' | 'large';
  to?: string;
  loading?: boolean;
  onClick?: MouseEventHandler;
  onMouseUp?: MouseEventHandler;
  onMouseDown?: MouseEventHandler;
  onMouseLeave?: MouseEventHandler;
  onTouchStart?: TouchEventHandler;
  onTouchEnd?: TouchEventHandler;
}

const baseClass = cn(
  'font-(--font-sans)',
  'gap-2',
  'font-semibold',
  'size-10',
  'cursor-pointer',
  'border border-(--border)',
  'rounded-[10px]',
  'transition-all duration-(--dur-fast) ease-(--ease)',
  'text-sm',
  'grid',
  'place-items-center',
);

function IconButton({
  rank = 'primary',
  disabled,
  to = '',
  className,
  title,
  ariaLabel,
  variant = undefined,
  size = 'large',
  onClick,
  onMouseUp,
  onMouseDown,
  onTouchStart,
  onTouchEnd,
  type = 'button',
  isLink = false,
  icon,
  loading = false,
  ...rest
}: IconButtonProps) {
  const isDisabledClass = disabled && 'opacity-50 cursor-not-allowed';

  const iconButtonClass = cn(
    baseClass,
    rankMap[rank],
    isDisabledClass,
    variant && variantMap[variant],
    sizeMap[size].button,
    className,
  );
  const iconButtonIconSize = sizeMap[size].icon;

  if (isLink) {
    return (
      <Link href={to} className={iconButtonClass}>
        <Icon type={icon} size={iconButtonIconSize} />
      </Link>
    );
  }
  return (
    <button
      type={type}
      disabled={disabled}
      className={iconButtonClass}
      title={title}
      aria-label={ariaLabel}
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
        <Icon type={icon} size={iconButtonIconSize} />
      )}
    </button>
  );
}

export type { IconButtonProps };
export default IconButton;
