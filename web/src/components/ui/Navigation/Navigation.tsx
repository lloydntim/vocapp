import { MouseEventHandler, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import IconButton from '../IconButton/IconButton';
import Button, { type ButtonSize, type ButtonRank } from '../Button/Button';

type NavigationLink = {
  href: string;
  text: string;
};

type NavButtonType = {
  type: 'button' | 'iconButton';
  text?: string;
  icon?: string;
  size?: ButtonSize;
  rank?: ButtonRank;
  isLink?: boolean;
  to?: string;
  onClick?: MouseEventHandler;
};

interface NavigationProps {
  logo: ReactNode;
  links?: NavigationLink[];
  buttons?: NavButtonType[];
}

const navigationData = {
  links: [
    { href: '#features', text: 'Features' },
    { href: '#how', text: 'How it works' },
    { href: '#practice', text: 'Practice' },
  ],
};

const navClass =
  'sticky top-0 z-50 bg-[color-mix(in_oklab,var(--bg)_82%,transparent)] backdrop-saturate-150 backdrop-blur-[14px] border-b border-transparent transition-colors duration-[var(--dur)] ease-[var(--ease)]';

const navContainerClass = 'w-full max-w-[1180px] mx-auto px-6';
const navInnerClass = 'flex items-center gap-5 h-17';
const navLinksClass = 'hidden lg:flex lg:gap-1 lg:ml-[18px]';
const navLinkClass =
  'px-3 py-2 rounded-lg text-sm font-medium text-[var(--text-muted)] no-underline transition-all duration-[var(--dur-fast)] ease-[var(--ease)]';
const navRightClass = 'ml-auto flex items-center gap-2.5';

function NavButton({
  type,
  text,
  icon,
  size,
  rank,
  isLink,
  to,
  onClick,
}: NavButtonType) {
  if (type === 'iconButton') {
    return (
      <IconButton icon={icon} rank={rank} isLink={isLink} to={to} onClick={onClick} />
    );
  }

  return (
    <Button size={size} rank={rank} isLink={isLink} to={to} onClick={onClick}>
      {text}
    </Button>
  );
}

function Navigation({ logo, links, buttons }: NavigationProps) {
  return (
    <nav className={cn(navClass)} id="nav">
      <div className={cn(navContainerClass, navInnerClass)}>
        {logo}
        {links && (
          <div className={navLinksClass}>
            {links.map((link) => (
              <a key={link.href} className={navLinkClass} href={link.href}>
                {link.text}
              </a>
            ))}
          </div>
        )}
        {buttons && (
          <div className={navRightClass}>
            {buttons.map((button, index) => (
              <NavButton key={index} {...button} />
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

export { navigationData };
export type { NavigationLink, NavButtonType, NavigationProps };
export default Navigation;
