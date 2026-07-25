import { z } from 'zod';

export const getLanguagesSchema = z.object({
  query: z.object({
    q: z.string().trim().min(1).optional(),
  }),
});

export const getTranslationsSchema = z.object({
  body: z.object({
    sourceLanguageCode: z.string().trim().min(1),
    targetLanguageCode: z.string().trim().min(1),
    sourceText: z.string().trim().min(1).max(200),
  }),
});
