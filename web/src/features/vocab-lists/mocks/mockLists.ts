import { VocabList } from '../types';

export const mockListData = [
  {
    id: '01',
    sourceLanguageCode: 'fr',
    targetLanguageCode: 'en',
    name: 'Mourir sur Seine 06',
    mastered: 22,
    total: 35,
    lastPracticed: '2026-07-06T12:00:00Z',
    createdAt: '2026-05-05T12:00:00Z',
  },
  {
    id: '02',
    sourceLanguageCode: 'fr',
    targetLanguageCode: 'en',
    name: 'Mourir sur Seine 07',
    mastered: 22,
    total: 35,
    lastPracticed: '2026-07-01T12:00:00Z',
    createdAt: '2023-08-01T12:00:00Z',
  },
  {
    id: '03',
    sourceLanguageCode: 'es',
    targetLanguageCode: 'en',
    name: 'Don Quijote',
    mastered: 10,
    total: 20,
    lastPracticed: '2026-07-04T12:00:00Z',
    createdAt: '2023-08-01T12:00:00Z',
  },
] satisfies VocabList[];
