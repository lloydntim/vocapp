export type VocabList = {
  id: string;
  sourceLanguageCode: string;
  targetLanguageCode: string;
  name: string;
  mastered?: number;
  total?: number;
  lastPracticed: string | null;
  createdAt: string;
};
