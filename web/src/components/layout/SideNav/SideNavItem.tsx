import Link from '@/components/ui/Link/Link';
import Icon from '@/components/ui/Icon/Icon';
import { cn } from '@/lib/utils';
import { languageFlagMap } from '@/features/languages/helpers';

const sideNavItemClass = cn(
  'font-normal flex flex-row items-center text-left gap-3 py-2.5 px-3 text-[13.5px]',
  'md:flex-col md:items-center md:text-center md:gap-1 md:py-2.5 md:px-2 md:text-[11px]',
  'lg:flex-row lg:items-center lg:text-left lg:gap-3 lg:py-2.5 lg:px-3 lg:text-[13.5px]',
  'rounded-(--radius-sm) text-(--text-muted) cursor-pointer border-none bg-transparent w-full transition-colors duration-(--dur-fast) ease-(--ease)',
);
const sideNavItemHoverClass =
  'hover:no-underline hover:bg-(--surface-alt) hover:text-(--text)';
const sideNavItemIconClass = 'flex opacity-90';
const sideNavItemPillClass = cn(
  'text-[11px] py-0.5 px-2 rounded-full bg-(--surface-alt) text-(--text-dim)',
  'ml-auto md:ml-0 lg:ml-auto',
);
const sideNavItemActiveClass = 'bg-(--brand-soft) font-semibold text-(--brand)';

export interface SideNavItemProps {
  icon?: string;
  href: string;
  text: string;
  pill: number;
  isActive?: boolean;
  flag?: string;
}

export default function SideNavItem({
  icon,
  href,
  text,
  pill,
  isActive,
  flag,
}: SideNavItemProps) {
  const sideNavItemClassName = cn(
    sideNavItemClass,
    isActive && sideNavItemActiveClass,
  );

  return (
    <Link
      className={cn(sideNavItemClassName, sideNavItemHoverClass)}
      href={href}
    >
      {icon && <Icon size={18} type={icon} className={sideNavItemIconClass} />}
      {flag && languageFlagMap[flag] && (
        <span className={cn(sideNavItemIconClass, 'size-4.5')}>
          {languageFlagMap[flag]}
        </span>
      )}
      {text}
      {pill > 0 && <span className={sideNavItemPillClass}>{pill}</span>}
    </Link>
  );
}
