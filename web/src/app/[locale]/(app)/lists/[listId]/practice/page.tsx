'use client';

import Button from '@/components/ui/Button/Button';
import RadioButtonGroup from '@/components/ui/RadioButtonGroup/RadioButtonGroup';
import SkeletonPanel from '@/components/ui/Skeletons/SkeletonPanel/SkeletonPanel';
import TopBar from '@/features/app/components/TopBar/TopBar';
import Content from '@/features/app/layouts/Content/Content';
import QueryBoundary from '@/components/ui/QueryBoundary/QueryBoundary';
import FormBanner from '@/components/ui/Form/FormBanner';
import { getErrorMessage } from '@/lib/client-api';

import FlashCard from '@/features/practice-sessions/components/FlashCard/FlashCard';
import PracticeProgressBar from '@/features/practice-sessions/components/PracticeProgressBar/PracticeProgressBar';
import { useGetListItems } from '@/features/vocab-items/hooks';
import { useGetList } from '@/features/vocab-lists/hooks';
import { cn } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SkeletonContentHeader from '@/components/ui/Skeletons/SkeletonContentHeader/SkeletonContentHeader';
import PracticeHeader from '@/features/practice-sessions/components/PracticeHeader/PracticeHeader';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { practiceSessionStorageKey } from '@/features/practice-sessions/helpers';
import { PracticeSessionState } from '@/features/practice-sessions/types';
import {
  PracticeSessionAction,
  practiceSessionReducer,
} from '@/features/practice-sessions/reducer';
import { useAddPracticeResults } from '@/features/practice-results/hooks';
import {
  useEndPracticeSession,
  useStartPracticeSession,
} from '@/features/practice-sessions/hooks';

const cardDeckClass = 'perspective-[1600px] min-h-[340px]';
const practiceWrapperClass = 'flex flex-col mx-auto gap-5.5 max-w-[720px]';
const practiceToolbarClass = 'flex items-center gap-2';

function PracticeSession({ listId }: { listId: string }) {
  const [sessionId, setSessionId] = useState('');
  const router = useRouter();
  const listQuery = useGetList(listId);
  const itemsQuery = useGetListItems(listId);

  const startSessionMutation = useStartPracticeSession(listId);
  const addResultsMutation = useAddPracticeResults(listId, sessionId);
  const endSessionMutation = useEndPracticeSession(listId, sessionId);

  const mutationError =
    startSessionMutation.error ??
    addResultsMutation.error ??
    endSessionMutation.error;

  const list = listQuery.data;
  const items = itemsQuery.data;

  const {
    sourceLanguageCode = '',
    targetLanguageCode = '',
    total = 0,
    name,
  } = list;

  const [session, setSession] = useLocalStorageState<PracticeSessionState>(
    practiceSessionStorageKey(listId),
    () => ({
      currentWordIndex: 0,
      hints: 0,
      errors: 0,
      skipped: 0,
      sessionId,
      practiceResults: [],
      translate: {
        from: sourceLanguageCode,
        to: targetLanguageCode,
        source: items[0].sourceText,
        target: items[0].targetText,
      },
      inputValue: '',
      sessionStartedAt: Date.now(),
      sessionCompletedAt: null,
    }),
  );

  const isSessionComplete = session.currentWordIndex >= items.length;
  const correctResultsCount = session.practiceResults.filter(
    (result) => !result.skipped,
  ).length;
  const currentItem = items[session.currentWordIndex];
  const sourceText = currentItem?.sourceText ?? '';
  const targetText = currentItem?.targetText ?? '';
  const itemId = currentItem?.id ?? '';
  // The practice direction is togglable (see toggleTranslate), so the
  // "prompt" shown on the card isn't always the item's source text.
  const promptField =
    session.translate.from === sourceLanguageCode ? 'source' : 'target';

  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [feedbackState, setFeedbackState] = useState<
    'neutral' | 'correct' | 'incorrect'
  >('neutral');

  const forward = `${sourceLanguageCode}-${targetLanguageCode}`;
  const reverse = `${targetLanguageCode}-${sourceLanguageCode}`;

  const names = new Intl.DisplayNames(['en'], {
    type: 'language',
  });

  const dispatch = (action: PracticeSessionAction) => {
    setSession((prev) => practiceSessionReducer(prev, action));
  };

  const startPracticeSession = () => {
    const payload = {
      startedAt: new Date().toISOString(),
      idempotencyKey: crypto.randomUUID(),
    };
    startSessionMutation.mutate(payload, {
      onSuccess: ({ data }) => {
        if (data.id) setSessionId(data.id);
      },
      onError: (error) => {
        console.error('Failed to start practice session:', error);
      },
    });
  };

  const toggleTranslate = (value: string) => {
    const [from, to] = value.split('-');
    dispatch({ type: 'TOGGLE_TRANSLATE', from, to, sourceText, targetText });
  };

  const advanceToNextWord = (
    action: Extract<PracticeSessionAction, { type: 'ADVANCE' | 'SKIP' }>,
  ) => {
    const nextState = practiceSessionReducer(session, action);
    setSession(nextState);
    setStartedAt(action.now);
    setFeedbackState('neutral');

    if (nextState.sessionCompletedAt !== null) {
      const payload = nextState.practiceResults.map((result) => {
        return {
          ...result,
          startedAt: new Date(result.startedAt).toISOString(),
          completedAt: new Date(result.completedAt).toISOString(),
        };
      });
      addResultsMutation.mutate(payload, {
        onSuccess: () => {
          endSessionMutation.mutate(
            {
              completedAt: new Date(action.now).toISOString(),
              totalErrors: nextState.errors,
              totalHints: nextState.hints,
              totalSkipped: nextState.skipped,
            },
            {
              onSuccess: ({ data }) => {
                router.push(`/lists/${listId}/practice/${data.id}/results`);
              },
              onError: (error) => {
                console.error('Failed to end practice session:', error);
              },
            },
          );
        },
        onError: (error) => {
          console.error('Failed to submit practice results:', error);
        },
      });
    }
  };

  const handleRestart = () => {
    const now = Date.now();
    dispatch({ type: 'RESTART', now });
    setStartedAt(now);
    setFeedbackState('neutral');
  };

  const handleCancel = () => {
    localStorage.removeItem(practiceSessionStorageKey(listId));
    router.push(`/lists/${listId}`);
  };

  const handleSkip = () => {
    if (session.currentWordIndex >= items.length) return;

    advanceToNextWord({
      type: 'SKIP',
      totalItems: items.length,
      context: { sourceText, targetText, itemId, sessionId, startedAt },
      now: Date.now(),
    });
  };

  const handleSubmit = () => {
    const isCorrect = session.inputValue.trim() === targetText;
    setFeedbackState(isCorrect ? 'correct' : 'incorrect');
    dispatch({
      type: 'SUBMIT_ANSWER',
      isCorrect,
      context: { sourceText, targetText, itemId, sessionId, startedAt },
      now: Date.now(),
    });
  };

  useEffect(() => {
    startPracticeSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      className={cn(
        practiceWrapperClass,
        'animate-[fade-in_320ms_[var(--ease)]_[var(--dur)]]',
      )}
    >
      {mutationError && (
        <FormBanner
          message={getErrorMessage(mutationError)}
          status="error"
          className="mb-4"
        />
      )}
      <PracticeHeader
        eyebrowline={`PRACTICE ·${name}`}
        title={`${names.of(session.translate.from)} → ${names.of(session.translate.to)}`}
        backLink={`/lists/${list.id}`}
        toolbar={
          <div className={practiceToolbarClass}>
            <RadioButtonGroup
              radios={[forward, reverse].map((value) => ({
                label: value.toUpperCase(),
                value,
              }))}
              changeHandler={toggleTranslate}
            />
            <Button size="small" rank="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        }
      />
      <PracticeProgressBar
        currentWord={session.currentWordIndex}
        totalWords={total}
        correctCount={correctResultsCount}
        attemptsCount={correctResultsCount + session.errors}
      />

      <div className={cardDeckClass}>
        {isSessionComplete ? (
          <SkeletonPanel />
        ) : (
          <FlashCard
            listId={listId}
            itemId={itemId}
            promptField={promptField}
            targetLanguage={names.of(session.translate.to) as string}
            sourceLanguageCode={session.translate.from}
            sourceLanguageValue={sourceText}
            targetLanguageValue={targetText}
            onReveal={() => dispatch({ type: 'REVEAL_HINT' })}
            onSkip={handleSkip}
            onRestart={handleRestart}
            inputValue={session.inputValue}
            onInputChange={(value) =>
              dispatch({ type: 'SET_INPUT', value })
            }
            loading={startSessionMutation.isPending}
            onSubmit={handleSubmit}
            onNext={() =>
              advanceToNextWord({
                type: 'ADVANCE',
                totalItems: items.length,
                now: Date.now(),
              })
            }
            state={feedbackState}
          />
        )}
      </div>
    </div>
  );
}

function PracticePage() {
  const { listId } = useParams<{ listId: string }>();

  return (
    <>
      <TopBar path="Practice" title="Vocabulary Lists" />
      <Content>
        <QueryBoundary
          className="mb-4"
          loadingFallback={
            <div className={practiceWrapperClass}>
              <SkeletonContentHeader />
              <SkeletonPanel />
            </div>
          }
        >
          <PracticeSession listId={listId} />
        </QueryBoundary>
      </Content>
    </>
  );
}

export default PracticePage;
