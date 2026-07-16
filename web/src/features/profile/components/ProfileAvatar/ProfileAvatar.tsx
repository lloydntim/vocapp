import { cn } from '@/lib/utils';

interface ProfileAvatarProps {
  initials: string;
  size?: 'small' | 'large';
}

const avatarSizeClassMap: Record<string, string> = {
  small: 'size-8.5 text-[13px]',
  large: 'size-24 text-[36px]',
};

const avatarClass =
  'size-8.5 rounded-full bg-linear-135 from-(--teal-300) to-(--teal-500) text-white grid place-items-center font-semibold text-[13px] flex-shrink-0';

function ProfileAvatar({ initials, size }: ProfileAvatarProps) {
  return (
    <div className={cn(avatarClass, avatarSizeClassMap[size ?? 'small'])}>
      {initials}
    </div>
  );
}

export type { ProfileAvatarProps };
export default ProfileAvatar;
