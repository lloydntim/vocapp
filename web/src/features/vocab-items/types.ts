import type { z } from 'zod';
import type { listItemSchema } from './schemas';

export type VocabListItem = z.infer<typeof listItemSchema>;

export type VocabItemStatus = 'LEARNING' | 'MASTERED';
