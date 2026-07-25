import Card from '@/components/ui/Card/Card';
import Skel from '../Skel/Skel';

const skelProfileCardClass =
  'bg-(--surface) border border-(--border) rounded-(--radius-lg) p-[28px_22px] flex flex-col items-center gap-2.5';
const skelProfileCardButtonGroupClass = 'flex gap-2.5 mt-4 w-full justify-center';

function SkeletonProfileCard() {
  return (
    <Card className={skelProfileCardClass}>
      <Skel width={96} height={96} radius={999} />
      <Skel width={140} height={20} className="mt-2" />
      <Skel width={180} height={13} />
      <Skel width={90} height={22} radius={999} className="mt-1" />
      <div className={skelProfileCardButtonGroupClass}>
        <Skel width={90} height={34} radius={10} />
        <Skel width={90} height={34} radius={10} />
      </div>
    </Card>
  );
}

export default SkeletonProfileCard;
