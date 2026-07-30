import { SideNavItemProps } from './SideNavItem';

export const sideNavData = {
  main: [
    {
      icon: 'house',
      href: '/dashboard',
      text: 'Overview',
      pill: 0,
    },
    {
      icon: 'book',
      href: '/lists',
      text: 'Vocabulary lists',
      pill: 0,
    },
    /*     {
      icon: 'play',
      href: '/practice',
      text: 'Practice',
      pill: 0,
    }, */
    {
      icon: 'bar-chart2',
      href: '/dashboard/stats',
      text: 'Statistics',
      pill: 0,
    },
  ],
  account: [
    {
      icon: 'user',
      href: '/profile',
      text: 'Profile',
      pill: 0,
    },
    {
      icon: 'settings',
      href: '/dashboard/account/settings',
      text: 'Settings',
      pill: 0,
    },
  ],
} satisfies Record<'account' | 'main', SideNavItemProps[]>;
