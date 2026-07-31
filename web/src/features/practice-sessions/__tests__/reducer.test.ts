import { describe, expect, it } from 'vitest';
import { practiceSessionReducer } from '../reducer';
import { PracticeSessionState } from '../types';

function createState(
  overrides: Partial<PracticeSessionState> = {},
): PracticeSessionState {
  return {
    currentWordIndex: 0,
    hints: 0,
    errors: 0,
    skipped: 0,
    practiceResults: [],
    translate: { from: 'es', to: 'en', source: 'la mariposa', target: 'the butterfly' },
    inputValue: '',
    sessionStartedAt: 0,
    sessionCompletedAt: null,
    ...overrides,
  };
}

const context = {
  sourceText: 'la mariposa',
  targetText: 'the butterfly',
  itemId: 'item-1',
  sessionId: 'session-1',
  startedAt: 1_000,
};

describe('practiceSessionReducer', () => {
  describe('SUBMIT_ANSWER', () => {
    it('records a result and leaves errors untouched when correct', () => {
      const state = createState({ hints: 2, errors: 1 });

      const next = practiceSessionReducer(state, {
        type: 'SUBMIT_ANSWER',
        isCorrect: true,
        context,
        now: 2_000,
      });

      expect(next.errors).toBe(1);
      expect(next.practiceResults).toEqual([
        { ...context, completedAt: 2_000, hints: 2, errors: 1, skipped: false },
      ]);
    });

    it('increments errors and records no result when incorrect', () => {
      const state = createState({ errors: 1 });

      const next = practiceSessionReducer(state, {
        type: 'SUBMIT_ANSWER',
        isCorrect: false,
        context,
        now: 2_000,
      });

      expect(next.errors).toBe(2);
      expect(next.practiceResults).toEqual([]);
    });
  });

  describe('SKIP', () => {
    it('advances, increments skipped, and records a skipped result', () => {
      const state = createState({ currentWordIndex: 1, skipped: 1 });

      const next = practiceSessionReducer(state, {
        type: 'SKIP',
        totalItems: 5,
        context,
        now: 2_000,
      });

      expect(next.currentWordIndex).toBe(2);
      expect(next.skipped).toBe(2);
      expect(next.inputValue).toBe('');
      expect(next.sessionCompletedAt).toBeNull();
      expect(next.practiceResults).toEqual([
        { ...context, completedAt: 2_000, hints: 0, errors: 0, skipped: true },
      ]);
    });

    it('marks the session complete when skipping the last word', () => {
      const state = createState({ currentWordIndex: 4 });

      const next = practiceSessionReducer(state, {
        type: 'SKIP',
        totalItems: 5,
        context,
        now: 9_999,
      });

      expect(next.currentWordIndex).toBe(5);
      expect(next.sessionCompletedAt).toBe(9_999);
    });

    it('is a no-op once the session is already past the last word', () => {
      const state = createState({ currentWordIndex: 5, sessionCompletedAt: 500 });

      const next = practiceSessionReducer(state, {
        type: 'SKIP',
        totalItems: 5,
        context,
        now: 9_999,
      });

      expect(next).toBe(state);
    });
  });

  describe('ADVANCE', () => {
    it('moves to the next word and resets the input', () => {
      const state = createState({ currentWordIndex: 1, inputValue: 'partial' });

      const next = practiceSessionReducer(state, {
        type: 'ADVANCE',
        totalItems: 5,
        now: 2_000,
      });

      expect(next.currentWordIndex).toBe(2);
      expect(next.inputValue).toBe('');
      expect(next.sessionCompletedAt).toBeNull();
    });

    it('marks the session complete when advancing past the last word', () => {
      const state = createState({ currentWordIndex: 4 });

      const next = practiceSessionReducer(state, {
        type: 'ADVANCE',
        totalItems: 5,
        now: 4_242,
      });

      expect(next.currentWordIndex).toBe(5);
      expect(next.sessionCompletedAt).toBe(4_242);
    });

    it('never advances currentWordIndex past totalItems', () => {
      const state = createState({ currentWordIndex: 5 });

      const next = practiceSessionReducer(state, {
        type: 'ADVANCE',
        totalItems: 5,
        now: 1,
      });

      expect(next.currentWordIndex).toBe(5);
    });
  });

  describe('TOGGLE_TRANSLATE', () => {
    it('flips source/target when the current direction matches the source text', () => {
      const state = createState({
        translate: { from: 'es', to: 'en', source: 'la mariposa', target: 'the butterfly' },
      });

      const next = practiceSessionReducer(state, {
        type: 'TOGGLE_TRANSLATE',
        from: 'en',
        to: 'es',
        sourceText: 'la mariposa',
        targetText: 'the butterfly',
      });

      expect(next.translate).toEqual({
        from: 'en',
        to: 'es',
        source: 'the butterfly',
        target: 'la mariposa',
      });
    });

    it('flips back when toggled again', () => {
      const state = createState({
        translate: { from: 'en', to: 'es', source: 'the butterfly', target: 'la mariposa' },
      });

      const next = practiceSessionReducer(state, {
        type: 'TOGGLE_TRANSLATE',
        from: 'es',
        to: 'en',
        sourceText: 'la mariposa',
        targetText: 'the butterfly',
      });

      expect(next.translate).toEqual({
        from: 'es',
        to: 'en',
        source: 'la mariposa',
        target: 'the butterfly',
      });
    });
  });

  describe('REVEAL_HINT', () => {
    it('increments hints', () => {
      const state = createState({ hints: 3 });

      const next = practiceSessionReducer(state, { type: 'REVEAL_HINT' });

      expect(next.hints).toBe(4);
    });
  });

  describe('SET_INPUT', () => {
    it('sets inputValue', () => {
      const state = createState({ inputValue: 'th' });

      const next = practiceSessionReducer(state, { type: 'SET_INPUT', value: 'the' });

      expect(next.inputValue).toBe('the');
    });
  });

  describe('RESTART', () => {
    it('resets counters and results but preserves translate direction and input', () => {
      const state = createState({
        currentWordIndex: 3,
        hints: 5,
        errors: 2,
        skipped: 1,
        practiceResults: [{ ...context, completedAt: 1, hints: 0, errors: 0, skipped: false }],
        sessionCompletedAt: 123,
        inputValue: 'stale',
        translate: { from: 'en', to: 'es', source: 'the butterfly', target: 'la mariposa' },
      });

      const next = practiceSessionReducer(state, { type: 'RESTART', now: 5_000 });

      expect(next.currentWordIndex).toBe(0);
      expect(next.hints).toBe(0);
      expect(next.errors).toBe(0);
      expect(next.skipped).toBe(0);
      expect(next.practiceResults).toEqual([]);
      expect(next.sessionCompletedAt).toBeNull();
      expect(next.sessionStartedAt).toBe(5_000);
      // Not part of what "restart" means — direction and any in-flight
      // typing survive a restart.
      expect(next.inputValue).toBe('stale');
      expect(next.translate).toEqual({
        from: 'en',
        to: 'es',
        source: 'the butterfly',
        target: 'la mariposa',
      });
    });
  });
});
