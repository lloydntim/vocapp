import Skel from '../Skel/Skel';

const skelPanelClass =
  'bg-(--surface) border border-(--border) rounded-(--radius-lg) overflow-hidden';
const skelPanelHeadClass =
  'p-[18px_22px] border-b border-(--border) flex items-center gap-3.5';
const skelRowClass =
  'flex items-center gap-4 p-[16px_22px] border-b border-(--border) last:border-b-0';

interface SkeletonRowData {
  opacity: number;
  titleWidthPercent: number;
}

const skeletonRows: SkeletonRowData[] = [
  { opacity: 1, titleWidthPercent: 60 },
  { opacity: 0.89, titleWidthPercent: 73 },
  { opacity: 0.78, titleWidthPercent: 86 },
  { opacity: 0.67, titleWidthPercent: 69 },
  { opacity: 0.56, titleWidthPercent: 82 },
  { opacity: 0.45, titleWidthPercent: 65 },
];

function SkeletonRow({ opacity, titleWidthPercent }: SkeletonRowData) {
  return (
    <div className={skelRowClass} style={{ opacity }}>
      <Skel width={18} height={18} radius={5} />
      <div className="flex-1 max-w-[280px]">
        <Skel
          width={`${titleWidthPercent}%`}
          height={13}
          className="mb-[7px]"
        />
        <Skel width={90} height={9} />
      </div>
      <Skel width={80} height={22} radius={6} />
      <Skel width={40} height={13} />
      <Skel width={150} height={8} radius={999} />
      <Skel width={90} height={13} />
    </div>
  );
}

function SkeletonPanel() {
  return (
    <div className={skelPanelClass}>
      <div className={skelPanelHeadClass}>
        <Skel width={120} height={16} />
        <div className="ml-auto flex gap-2.5">
          <Skel width={200} height={38} radius={10} />
          <Skel width={130} height={38} radius={10} />
        </div>
      </div>
      {skeletonRows.map((row, index) => (
        <SkeletonRow key={index} {...row} />
      ))}
    </div>
  );
}

export default SkeletonPanel;
