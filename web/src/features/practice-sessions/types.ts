export type PracticeResult = {
  sessionId: string;
  sourceText: string;
  targetText: string;
  startedAt: number;
  completedAt: number;
  hints: number;
  errors: number;
  skipped: boolean;
  itemId: string;
};

export type TranslateDirection = {
  from: string;
  to: string;
  source: string;
  target: string;
};

export type PracticeSessionState = {
  currentWordIndex: number;
  hints: number;
  errors: number;
  skipped: number;
  practiceResults: PracticeResult[];
  translate: TranslateDirection;
  inputValue: string;
  sessionStartedAt: number;
  sessionCompletedAt: number | null;
};
