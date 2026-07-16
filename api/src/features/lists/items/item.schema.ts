import z from 'zod';
import { VocabularyItemStatus } from '../../../generated/prisma/browser.js';
import { userListItemParams, userListParams } from '../../users/user.schema.js';

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

export const updateItemSchema = z.object({
  params: itemParams,
  body: z.object({
    status: z.nativeEnum(VocabularyItemStatus),
  }),
});

export const updateUserListItemStatusSchema = z.object({
  params: userListItemParams,
  body: updateItemSchema.shape.body,
});

export const deleteItemSchema = z.object({
  params: itemParams,
});

export type AddItemInput = z.infer<typeof addItemSchema>['body'];
export type UpdateItemInput = z.infer<typeof updateItemSchema>['body'];
export type DeleteItemInput = z.infer<typeof deleteItemSchema>['params'];
