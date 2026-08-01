import { z } from 'zod';
import { practiceResultSchema } from '@/features/practice-results/schemas';

const sessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  listId: z.string(),
  startedAt: z.string(),
  completedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  idempotencyKey: z.string(),
  totalHints: z.number(),
  totalErrors: z.number(),
  totalSkipped: z.number(),
  results: z.array(practiceResultSchema).optional().default([]),
});

export { sessionSchema };
export type PracticeSession = z.infer<typeof sessionSchema>;

const sessionRequestResponseSchema = z.object({
  message: z.string(),
  data: sessionSchema,
});

export { sessionRequestResponseSchema };
export type SessionRequestResponse = z.infer<
  typeof sessionRequestResponseSchema
>;

const startSessionSchema = sessionSchema.pick({
  startedAt: true,
  idempotencyKey: true,
});

export { startSessionSchema };
export type StartSessionPayload = z.infer<typeof startSessionSchema>;

const endSessionSchema = sessionSchema.pick({
  totalHints: true,
  totalErrors: true,
  totalSkipped: true,
  completedAt: true,
});

export { endSessionSchema };
export type EndSessionPayload = z.infer<typeof endSessionSchema>;
