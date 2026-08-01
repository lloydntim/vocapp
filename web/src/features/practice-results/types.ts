export type PracticeResult = {
  sessionId: string;
  itemId: string;
  sourceText: string;
  targetText: string;
  startedAt: number | string;
  completedAt: number | string;
  hints: number;
  errors: number;
  skipped: boolean;
};
