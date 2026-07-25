import { ProfileDetailsCardProps } from '../components/ProfileDetails/ProfileDetailsCard';

export const mockProfileDetailsCards: ProfileDetailsCardProps[] = [
  {
    title: 'Account',
    rows: [
      { label: 'Full name', value: 'Kwame A.', action: () => {} },
      { label: 'Email', value: 'kwame.23@gmail.com' },
      // { label: 'Password', value: '••••••••••', action: () => {} },
      { label: 'Verification', value: 'Verified' },
      { label: 'Member since', value: 'March 2025' },
    ],
  },
  /*   {
    title: 'Learning',
    rows: [
      { label: 'Daily goal', value: '20 minutes', action: () => {} },
      { label: 'Review reminders', value: '9:00 AM daily', action: () => {} },
      { label: 'Native language', value: 'English', action: () => {} },
    ],
  }, */
  {
    title: 'Danger zone',
    className: 'border-t border-(--danger-soft)',
    text: 'Permanently remove your account and all vocabulary data.',
    button: {
      label: 'Delete Account',
      size: 'small',
      variant: 'outline-danger',
      onClick: () => {},
    },
  },
];
