export type VocabListItem = {
  id: string;
  listId: string;
  position: number;
  sourceText: string;
  targetText: string;
  status: VocabItemStatus;
  createdAt: string;
  updatedAt: string;
};

export type VocabItemStatus = 'LEARNING' | 'MASTERED';
