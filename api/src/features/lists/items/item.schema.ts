import z from 'zod';
import { userListParams } from '../../users/user.schema.js';

const itemParams = z.object({
  itemId: z.string().uuid(),
});
export const getItemSchema = z.object({
  params: itemParams,
});

export const addItemSchema = z.object({
  body: z.object({
    sourceText: z.string().min(1).max(255),
    targetText: z.string().min(1).max(255),
  }),
});

export const addUserListItemSchema = z.object({
  params: userListParams,
  body: addItemSchema.shape.body,
});

export const deleteItemSchema = z.object({
  params: itemParams,
});

export type AddItemInput = z.infer<typeof addItemSchema>['body'];
