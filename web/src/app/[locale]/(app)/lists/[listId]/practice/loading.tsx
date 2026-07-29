import TopBar from '@/features/app/components/TopBar/TopBar';
import Content from '@/features/app/layouts/Content/Content';
import SkeletonContentHeader from '@/components/ui/Skeletons/SkeletonContentHeader/SkeletonContentHeader';
import SkeletonPanel from '@/components/ui/Skeletons/SkeletonPanel/SkeletonPanel';

const practiceWrapperClass = 'flex flex-col mx-auto gap-5.5 max-w-[720px]';

function PracticeLoading() {
  return (
    <>
      <TopBar path="Practice" title="Vocabulary Lists" />
      <Content>
        <div className={practiceWrapperClass}>
          <SkeletonContentHeader />
          <SkeletonPanel />
        </div>
      </Content>
    </>
  );
}

export default PracticeLoading;
