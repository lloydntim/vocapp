import z from 'zod';
import { userListItemParams } from '../users/user.schema.js';

export const getItemAudioSchema = z.object({
  params: userListItemParams,
  query: z.object({ field: z.enum(['source', 'target']) }),
});

export type GetItemAudioQuery = z.infer<typeof getItemAudioSchema>['query'];
