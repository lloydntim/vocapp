import Card from '@/components/ui/Card/Card';
import { cn } from '@/lib/utils';
import Skel from '../Skel/Skel';

const skelDetailsCardClass = 'py-6 px-5.5 rounded-lg';
const skelRowClass =
  'grid grid-cols-[160px_1fr_auto] items-center py-3.5 border-b border-(--border) text-[14px] last:border-b-0';

interface SkeletonRowData {
  labelWidth: number;
  valueWidth: number;
}

const skeletonAccountRows: SkeletonRowData[] = [
  { labelWidth: 70, valueWidth: 120 },
  { labelWidth: 45, valueWidth: 160 },
  { labelWidth: 80, valueWidth: 70 },
  { labelWidth: 95, valueWidth: 90 },
];

function SkeletonProfileDetails() {
  return (
    <div className="flex flex-col gap-4.5">
      <Card className={skelDetailsCardClass} hasBorder>
        <Skel width={90} height={15} className="mb-3" />
        {skeletonAccountRows.map(({ labelWidth, valueWidth }, index) => (
          <div key={index} className={skelRowClass}>
            <Skel width={labelWidth} height={12} />
            <Skel width={valueWidth} height={12} />
          </div>
        ))}
      </Card>

      <Card
        className={cn(skelDetailsCardClass, 'border-t border-(--danger-soft)')}
        hasBorder
      >
        <Skel width={110} height={15} className="mb-3" />
        <Skel width="70%" height={12} className="mb-4" />
        <Skel width={140} height={34} radius={8} />
      </Card>
    </div>
  );
}

export default SkeletonProfileDetails;
