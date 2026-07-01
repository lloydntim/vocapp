import z from 'zod';

const sessionParams = z.object({
  userId: z.string().uuid(),
  listId: z.string().uuid(),
});

export const getSessionsSchema = z.object({
  params: sessionParams,
});

export const getSessionSchema = z.object({
  params: sessionParams.extend({ id: z.string().uuid() }),
});

export const startSessionSchema = z.object({
  params: sessionParams,
  body: z.object({
    startedAt: z.coerce.date(),
  }),
});

export const endSessionSchema = z.object({
  params: sessionParams.extend({ id: z.string().uuid() }),
  body: z.object({
    completedAt: z.coerce.date(),
    totalHints: z.number().int().min(0),
    totalErrors: z.number().int().min(0),
    totalSkipped: z.number().int().min(0),
  }),
});

export type StartSessionInput = z.infer<typeof startSessionSchema>['body'];
export type EndSessionInput = z.infer<typeof endSessionSchema>['body'];
