import { z } from 'zod';

const practiceResultSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  itemId: z.string(),
  sourceText: z.string(),
  targetText: z.string(),
  startedAt: z.string(),
  completedAt: z.string(),
  hints: z.string(),
  errors: z.string(),
  skipped: z.string(),
  createdAt: z.string(),
});

export { practiceResultSchema };
export type PracticeResult = z.infer<typeof practiceResultSchema>;

const addPracticeResultsInput = z.array(
  practiceResultSchema.pick({
    sessionId: true,
    itemId: true,
    sourceText: true,
    targetText: true,
    startedAt: true,
    completedAt: true,
  }),
);

export { addPracticeResultsInput };
export type AddPracticeResultsPayload = z.infer<typeof addPracticeResultsInput>;
