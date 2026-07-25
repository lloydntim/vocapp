import { z } from 'zod';

const paramsSchema = <T extends z.ZodRawShape>(shape: T) =>
  z.object({
    params: z.object(shape),
  });

const uuidParam = () => z.string().uuid();

export const userIdParams = z.object({
  userId: uuidParam(),
});

export const userListParams = z.object({
  userId: uuidParam(),
  listId: uuidParam(),
});

export const userIdParamSchema = z.object({
  params: userIdParams,
});

export const userListParamsSchema = z.object({
  params: userListParams,
});

export const userListItemParams = z.object({
  userId: uuidParam(),
  listId: uuidParam(),
  itemId: uuidParam(),
});

export const userListItemParamsSchema = z.object({
  params: userListItemParams,
});

export const userListSessionParamsSchema = paramsSchema({
  userId: uuidParam(),
  listId: uuidParam(),
  sessionId: uuidParam(),
});

export const createUserSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    email: z.string().email(),
    username: z
      .string()
      .min(3)
      .max(30)
      .regex(/^[a-z0-9_-]+$/, 'Only lowercase letters, numbers, hyphens and underscores'),
    password: z.string().min(8).max(128),
    locale: z.string().optional(),
  }),
});

export const updateUserSchema = z.object({
  params: userIdParams,
  body: z.object({
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    username: z
      .string()
      .min(3)
      .max(30)
      .regex(/^[a-z0-9_-]+$/, 'Only lowercase letters, numbers, hyphens and underscores')
      .optional(),
    email: z.string().email().optional(),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>['body'];
export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];
