import IconButton from '@/components/ui/IconButton/IconButton';
import ProfileAvatar from '@/features/profile/components/ProfileAvatar/ProfileAvatar';
import { User } from '@/features/auth/schemas';

const sideNavFooterClass =
  'mt-auto py-3 px-2.5 border-t border-white/8 flex items-center gap-2.5';
const sideNavFooterIconButtonClass = 'ml-auto text-white/60 border-transparent';

interface SideNavFooterProps {
  user: Pick<User, 'firstName' | 'lastName' | 'plan'>;
}

export default function SideNavFooter({ user }: SideNavFooterProps) {
  if (!user) {
    return null;
  }
  const { firstName, lastName, plan } = user;

  const userInitials = `${firstName[0]}${lastName[0]}`.toUpperCase();

  return (
    <div className={sideNavFooterClass}>
      <ProfileAvatar initials={userInitials} size="small" />
      <div className="text-sm leading-[1.2]">
        {`${firstName} ${lastName.slice(0, 1).toLocaleUpperCase()}.`}
        <small className="text-white/50 text-11px flex">{`${plan[0]}${plan.slice(1, plan.length).toLocaleLowerCase()} plan`}</small>
      </div>
      <IconButton
        icon="log-out"
        variant="ghost"
        className={sideNavFooterIconButtonClass}
        title="Logout"
      />
    </div>
  );
}
