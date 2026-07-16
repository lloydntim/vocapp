import Logo from '@/components/ui/Logo/Logo';
import Link from '@/components/ui/Link/Link';

const sideNavHeaderLogoClass =
  'flex items-baseline gap-1 text-[22px] font-semibold tracking-[-0.02em] p-[6px_12px_18px] text-(--text-light) no-underline cursor-pointer';

export interface SideNavHeaderProps {
  logo: { href: string; title: string };
}

export default function SideNavHeader({ logo }: SideNavHeaderProps) {
  return (
    <Link
      className={sideNavHeaderLogoClass}
      href={logo.href}
      title={logo.title}
    >
      <Logo />
    </Link>
  );
}