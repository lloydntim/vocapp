import ButtonGroup, {
  ButtonItemProps,
} from '@/components/ui/ButtonGroup/ButtonGroup';
import Card from '@/components/ui/Card/Card';
import Chip from '@/components/ui/Chip/Chip';

import Headline from '@/components/ui/Headline/Headline';
import ProfileAvatar from '../ProfileAvatar/ProfileAvatar';

const profileCardClass =
  'bg-(--surface) border border-(--border) rounded-(--radius-lg) p-[28px_22px] text-center flex flex-col items-center gap-2.5';
const profileCardHeadlineClass = 'm-2 text-[20px] font-bold';
const profileCardSubClass = 'sub text-(--text-muted) text-[13px]';
const profileCardButtonGroupClass = 'flex gap-2.5 mt-4 w-full justify-center';

interface ProfileCardProps {
  initials: string;
  name: string;
  email: string;
  isVerified: boolean;
  buttons: ButtonItemProps<'button'>[];
}
function ProfileCard({
  initials,
  name,
  email,
  isVerified,
  buttons,
}: ProfileCardProps) {
  return (
    <Card className={profileCardClass}>
      <ProfileAvatar initials={initials} size="large" />
      <Headline level="h3" className={profileCardHeadlineClass}>
        {name}
      </Headline>
      <div className={profileCardSubClass}>{email}</div>
      <Chip
        type={isVerified ? 'success' : 'warn'}
        label={isVerified ? 'Verified' : 'Unverified'}
        title={isVerified ? 'Verified' : 'Unverified'}
        icon={isVerified ? 'check' : 'close'}
        hasBorder={false}
        className="mt-1"
      />
      <ButtonGroup
        size="small"
        className={profileCardButtonGroupClass}
        buttons={buttons}
      />
    </Card>
  );
}

export default ProfileCard;
