import Link from '@/components/ui/Link/Link';
import Icon from '@/components/ui/Icon/Icon';
import { cn } from '@/lib/utils';
import { flagIconMap } from './data';

const sideNavItemClass =
  'font-normal flex items-center gap-3 py-2.5 px-3 rounded-(--radius-sm) text-white/78 cursor-pointer text-[14px] border-none bg-transparent text-left w-full transition-colors duration-(--dur-fast) ease-(--ease)';
const sideNavItemHoverClass =
  'hover:no-underline hover:bg-white/6 hover:text-white';
const sideNavItemIconClass = 'flex opacity-90';
const sideNavItemPillClass =
  'ml-auto text-[11px] py-0.5 px-2 rounded-full bg-white/10 text-white/70';
const sideNavItemActiveClass = 'bg-white/10 font-semibold text-white';

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
      {flag && (
        <span className={cn(sideNavItemIconClass, 'size-4.5')}>
          {flagIconMap[flag]}
        </span>
      )}
      {text}
      {pill > 0 && <span className={sideNavItemPillClass}>{pill}</span>}
    </Link>
  );
}
