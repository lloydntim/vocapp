import type { PracticeResult } from './types';

export function getHintsFreeCount(practiceResults: PracticeResult[]) {
  const answered = practiceResults.filter((result) => !result.skipped);

  return answered.filter((result, index) => {
    const previousHints = index === 0 ? 0 : answered[index - 1].hints;
    return result.hints === previousHints;
  }).length;
}
