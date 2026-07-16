import IconButton from '@/components/ui/IconButton/IconButton';
import ProfileAvatar from '@/features/profile/components/ProfileAvatar/ProfileAvatar';

const sideNavFooterClass =
  'mt-auto py-3 px-2.5 border-t border-white/8 flex items-center gap-2.5';
const sideNavFooterIconButtonClass = 'ml-auto text-white/60 border-transparent';

interface SideNavFooterProps {
  user: { firstName: string; lastName: string; plan: string };
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
        <small className="text-white/50 text-11px flex">{`${plan} plan`}</small>
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
