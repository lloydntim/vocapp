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
  languages: [
    { flag: 'fr', href: '/dashboard/languages/fr', text: 'French', pill: 5 },
    { flag: 'es', href: '/dashboard/languages/es', text: 'Spanish', pill: 3 },
    { flag: 'de', href: '/dashboard/languages/de', text: 'German', pill: 4 },
    { flag: 'it', href: '/dashboard/languages/it', text: 'Italian', pill: 2 },
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
} satisfies Record<'languages' | 'account' | 'main', SideNavItemProps[]>;

export const flagIconMap: Record<string, string> = {
  fr: '🇫🇷',
  es: '🇪🇸',
  de: '🇩🇪',
  it: '🇮🇹',
};
