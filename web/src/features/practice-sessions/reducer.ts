import { PracticeResult, PracticeSessionState } from './types';

export type PracticeResultContext = Pick<
  PracticeResult,
  'sourceText' | 'targetText' | 'itemId' | 'sessionId' | 'startedAt'
>;

export type PracticeSessionAction =
  | {
      type: 'SUBMIT_ANSWER';
      isCorrect: boolean;
      context: PracticeResultContext;
      now: number;
    }
  | {
      type: 'SKIP';
      totalItems: number;
      context: PracticeResultContext;
      now: number;
    }
  | { type: 'ADVANCE'; totalItems: number; now: number }
  | { type: 'TOGGLE_TRANSLATE'; from: string; to: string; sourceText: string; targetText: string }
  | { type: 'REVEAL_HINT' }
  | { type: 'SET_INPUT'; value: string }
  | { type: 'RESTART'; now: number };

/** Moves to the next word, resetting the answer input and (once the last
 * word is passed) stamping the session as complete. Shared by ADVANCE and
 * SKIP since skipping a word always advances too. */
function advance(
  state: PracticeSessionState,
  totalItems: number,
  now: number,
  patch: Partial<PracticeSessionState> = {},
): PracticeSessionState {
  const nextIndex = Math.min(totalItems, state.currentWordIndex + 1);
  const isComplete = nextIndex >= totalItems;

  return {
    ...state,
    ...patch,
    currentWordIndex: nextIndex,
    inputValue: '',
    sessionCompletedAt: isComplete ? now : state.sessionCompletedAt,
  };
}

export function practiceSessionReducer(
  state: PracticeSessionState,
  action: PracticeSessionAction,
): PracticeSessionState {
  switch (action.type) {
    case 'SUBMIT_ANSWER': {
      if (!action.isCorrect) {
        return { ...state, errors: state.errors + 1 };
      }
      const result: PracticeResult = {
        ...action.context,
        completedAt: action.now,
        hints: state.hints,
        errors: state.errors,
        skipped: false,
      };
      return { ...state, practiceResults: [...state.practiceResults, result] };
    }

    case 'SKIP': {
      // Nothing left to skip past — leave the state untouched.
      if (state.currentWordIndex >= action.totalItems) return state;

      const result: PracticeResult = {
        ...action.context,
        completedAt: action.now,
        hints: state.hints,
        errors: state.errors,
        skipped: true,
      };
      return advance(state, action.totalItems, action.now, {
        skipped: state.skipped + 1,
        practiceResults: [...state.practiceResults, result],
      });
    }

    case 'ADVANCE':
      return advance(state, action.totalItems, action.now);

    case 'TOGGLE_TRANSLATE': {
      const source =
        state.translate.source === action.sourceText
          ? action.targetText
          : action.sourceText;
      const target =
        state.translate.target === action.targetText
          ? action.sourceText
          : action.targetText;
      return {
        ...state,
        translate: { from: action.from, to: action.to, source, target },
      };
    }

    case 'REVEAL_HINT':
      return { ...state, hints: state.hints + 1 };

    case 'SET_INPUT':
      return { ...state, inputValue: action.value };

    case 'RESTART':
      return {
        ...state,
        currentWordIndex: 0,
        hints: 0,
        errors: 0,
        skipped: 0,
        practiceResults: [],
        sessionStartedAt: action.now,
        sessionCompletedAt: null,
      };

    default:
      return state;
  }
}
