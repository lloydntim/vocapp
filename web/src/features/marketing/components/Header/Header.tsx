import Navigation, {
  navigationData,
  type NavigationProps,
} from '@/components/ui/Navigation/Navigation';
import Logo from '@/components/ui/Logo/Logo';

type HeaderProps = Omit<NavigationProps, 'links' | 'buttons'> & {
  navlinks?: NavigationProps['links'];
  navButtons?: NavigationProps['buttons'];
};

function Header({ logo, navlinks, navButtons }: HeaderProps) {
  return (
    <header>
      <Navigation logo={logo} links={navlinks} buttons={navButtons} />
    </header>
  );
}

const headerData: HeaderProps = {
  logo: <Logo href="/" />,
  navlinks: navigationData.links,
  navButtons: [
    { type: 'iconButton', icon: 'moon', rank: 'secondary' },
    { type: 'button', size: 'small', isLink: true, to: '/login', text: 'Open app' },
  ],
};

export { headerData };
export type { HeaderProps };
export default Header;
