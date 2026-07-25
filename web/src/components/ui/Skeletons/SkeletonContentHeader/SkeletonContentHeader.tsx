import Skel from '../Skel/Skel';

const skeletonContentHeaderClass = 'flex items-center gap-3.5 mb-4.5';

function SkeletonContentHeader() {
  return (
    <div className={skeletonContentHeaderClass}>
      <Skel width={32} height={32} radius={10} />
      <div className="flex-1">
        <Skel width={70} height={11} className="mb-1.5" />
        <Skel width={220} height={22} radius={6} />
      </div>
      <Skel width={130} height={40} radius={10} />
    </div>
  );
}

export default SkeletonContentHeader;
