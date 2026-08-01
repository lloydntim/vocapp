import Card from '@/components/ui/Card/Card';
import Skel from '../Skel/Skel';

const skeletonSummaryCellClass = 'flex flex-col gap-2';

interface SkeletonSummaryStatData {
  labelWidth: number;
  valueWidth: number;
}

const skeletonSummaryStats: SkeletonSummaryStatData[] = [
  { labelWidth: 50, valueWidth: 40 },
  { labelWidth: 70, valueWidth: 40 },
  { labelWidth: 90, valueWidth: 60 },
];

function SkeletonVocabListSummaryBar() {
  return (
    <Card hasBorder className="mb-5 py-5 px-6 flex gap-6 flex-wrap">
      {skeletonSummaryStats.map(({ labelWidth, valueWidth }, index) => (
        <div key={index} className={skeletonSummaryCellClass}>
          <Skel width={labelWidth} height={11} />
          <Skel width={valueWidth} height={26} radius={6} />
        </div>
      ))}
      <div className="flex-1 min-w-45 flex flex-col">
        <Skel width={110} height={11} className="mb-2" />
        <div className="flex-1 flex items-center">
          <Skel width="100%" height={10} radius={999} />
        </div>
      </div>
    </Card>
  );
}

export default SkeletonVocabListSummaryBar;
