import Button, { ButtonProps } from '@/components/ui/Button/Button';
import Card from '@/components/ui/Card/Card';
import Headline from '@/components/ui/Headline/Headline';
import ProfileDetailsCardRow, {
  ProfileDetailCardRow,
} from './ProfileDetailsCardRow';
import { cn } from '@/lib/utils';

interface ProfileDetailsCardProps {
  className?: string;
  title: string;
  rows?: ProfileDetailCardRow[];
  text?: string;
  button?: Omit<ButtonProps, 'children'> & { label: string };
}

function ProfileDetailsCard({
  title,
  rows,
  text,
  button,
  className,
}: ProfileDetailsCardProps) {
  return (
    <Card className={cn('py-6 px-5.5 rounded-lg', className)} hasBorder>
      <Headline level="h3" className="m-0 mb-2.5 text-[15px] font-bold">
        {title}
      </Headline>

      {rows &&
        rows.map((row, index) => (
          <ProfileDetailsCardRow key={index} {...row} />
        ))}
      {text && (
        <div className="text-[13px] text-(--text-muted) mb-2">{text}</div>
      )}
      {button && <Button {...button}>{button.label}</Button>}
    </Card>
  );
}

export type { ProfileDetailsCardProps };
export default ProfileDetailsCard;
