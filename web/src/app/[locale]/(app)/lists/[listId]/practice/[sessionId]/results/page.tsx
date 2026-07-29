'use client';

import Content from '@/features/app/layouts/Content/Content';
import QueryBoundary from '@/components/ui/QueryBoundary/QueryBoundary';
import SkeletonContentHeader from '@/components/ui/Skeletons/SkeletonContentHeader/SkeletonContentHeader';
import SkeletonPanel from '@/components/ui/Skeletons/SkeletonPanel/SkeletonPanel';
import TopBar from '@/features/app/components/TopBar/TopBar';
import PracticeHeader from '@/features/practice-sessions/components/PracticeHeader/PracticeHeader';
import { practiceSessionStorageKey } from '@/features/practice-sessions/helpers';
import { PracticeSessionState } from '@/features/practice-sessions/types';
import PracticeResultPanels from '@/features/practice-results/components/PracticeResultPanels/PracticeResultPanels';
import { getHintsFreeCount } from '@/features/practice-results/helpers';
import { useGetListItems } from '@/features/vocab-items/hooks';
import { useGetList } from '@/features/vocab-lists/hooks';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { useParams, useRouter } from 'next/navigation';

const practiceResultsWrapperClass =
  'flex flex-col mx-auto gap-5.5 max-w-[720px]';

function PracticeResultsPage() {
  const { listId } = useParams<{ listId: string }>();
  const router = useRouter();
  const listQuery = useGetList(listId);
  const itemsQuery = useGetListItems(listId);
  const list = listQuery.data;
  const items = itemsQuery.data;

  const [session] = useLocalStorageState<PracticeSessionState | null>(
    practiceSessionStorageKey(listId),
    null,
    { persist: false },
  );

  const handlePracticeAgain = () => {
    localStorage.removeItem(practiceSessionStorageKey(listId));
    router.push(`/lists/${listId}/practice`);
  };

  const totalTimeMs =
    session?.sessionCompletedAt != null
      ? session.sessionCompletedAt - session.sessionStartedAt
      : 0;

  return (
    <>
      <TopBar path="Practice" title="Vocabulary Lists" />
      <Content>
        <div className={practiceResultsWrapperClass}>
          <QueryBoundary
            className="mb-4"
            loadingFallback={<SkeletonContentHeader />}
          >
            <PracticeHeader
              eyebrowline={`SESSION COMPLETE · ${list.name}`}
              title="Nice work."
              backLink={`/lists/${list.id}`}
            />
          </QueryBoundary>

          <QueryBoundary className="mb-4" loadingFallback={<SkeletonPanel />}>
            {session ? (
              <PracticeResultPanels
                totalPhrases={items.length}
                correctCount={
                  session.practiceResults.filter((result) => !result.skipped)
                    .length
                }
                skippedCount={session.skipped}
                hintsUsed={session.hints}
                hintsFreeCount={getHintsFreeCount(session.practiceResults)}
                totalTimeMs={totalTimeMs}
                listId={listId}
                onPracticeAgain={handlePracticeAgain}
              />
            ) : (
              <SkeletonPanel />
            )}
          </QueryBoundary>
        </div>
      </Content>
    </>
  );
}

export default PracticeResultsPage;
