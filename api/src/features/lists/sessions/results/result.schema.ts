import z from 'zod';

const resultParams = z.object({
  userId: z.string().uuid(),
  listId: z.string().uuid(),
  sessionId: z.string().uuid(),
});

const resultInputSchema = z.object({
  sourceText: z.string().min(1),
  targetText: z.string().min(1),
  startedAt: z.coerce.date(),
  itemId: z.string().uuid(),
  completedAt: z.coerce.date().optional(),
  hints: z.number().int().min(0).optional(),
  errors: z.number().int().min(0).optional(),
  skipped: z.boolean().optional(),
});

export const getResultsSchema = z.object({
  params: resultParams,
});

export const getResultSchema = z.object({
  params: resultParams.extend({ id: z.string().uuid() }),
});

export const addResultsSchema = z.object({
  params: resultParams,
  body: z.object({
    results: z.array(resultInputSchema),
  }),
});

export type AddResultInput = z.infer<typeof resultInputSchema>;
export type AddResultsInput = z.infer<typeof resultInputSchema>[];
