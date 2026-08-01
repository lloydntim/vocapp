import { CSSProperties, ReactNode } from 'react';
import { LinkProps as NextLinkProps } from 'next/link';
import { Link as NextIntlLink } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

interface LinkProps extends NextLinkProps {
  href: string;
  children: ReactNode;
  isExternal?: boolean;
  className?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  style?: CSSProperties;
  rel?:
    | 'noopener noreferrer'
    | 'nofollow'
    | 'noreferrer'
    | 'noopener'
    | 'external';
  title?: string;
}
const baseLinkClass =
  'text-(--brand) font-semibold no-underline text-sm hover:text-(--brand-hover) hover:underline';

function Link({
  className,
  href,
  children,
  isExternal,
  target = '_blank',
  rel = 'noopener noreferrer',
  title,
  style,
}: LinkProps) {
  const linkClass = cn(baseLinkClass, className);

  if (isExternal) {
    return (
      <a
        className={linkClass}
        href={href}
        target={target}
        rel={rel}
        title={title}
        style={style}
      >
        {children}
      </a>
    );
  }

  return (
    <NextIntlLink
      className={linkClass}
      href={href}
      title={title}
      style={style}
      prefetch={false}
    >
      {children}
    </NextIntlLink>
  );
}

export default Link;
