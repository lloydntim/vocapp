import z from 'zod';
import { userIdParams, userListParams } from '../users/user.schema.js';

const listParams = z.object({
  listId: z.string().uuid(),
});

export const getListSchema = z.object({
  params: listParams,
});

export const addListSchema = z.object({
  body: z.object({
    sourceLanguageCode: z.string().regex(/^[a-z]{2,3}(-[A-Za-z]{2,4})?$/),
    targetLanguageCode: z.string().regex(/^[a-z]{2,3}(-[A-Za-z]{2,4})?$/),
    name: z.string().min(1).max(128),
  }),
});

export const addUserListSchema = z.object({
  params: userIdParams,
  body: addListSchema.shape.body,
});

export const updateListSchema = z.object({
  params: listParams,
  body: z
    .object({
      sourceLanguageCode: z
        .string()
        .regex(/^[a-z]{2,3}(-[A-Za-z]{2,4})?$/)
        .optional(),
      targetLanguageCode: z
        .string()
        .regex(/^[a-z]{2,3}(-[A-Za-z]{2,4})?$/)
        .optional(),
      name: z.string().min(1).max(128).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided',
    }),
});

export const updateUserListSchema = z.object({
  params: userListParams,
  body: updateListSchema.shape.body,
});

export const deleteListSchema = z.object({
  params: listParams,
});

export type AddListInput = z.infer<typeof addListSchema>['body'];
export type UpdateListInput = z.infer<typeof updateListSchema>['body'];
