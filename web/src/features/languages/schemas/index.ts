import z from 'zod';

export const getLanguagesResponseSchema = z.object({
  data: z.object({
    languages: z.array(
      z.object({
        languageCode: z.string(),
        displayName: z.string(),
        supportSource: z.boolean(),
        supportTarget: z.boolean(),
      }),
    ),
    length: z.number().int().nonnegative(),
  }),
});

export type GetLanguagesResponse = z.infer<typeof getLanguagesResponseSchema>;

export const getTranslationsSchema = z.object({
  sourceLanguageCode: z.string().trim().min(2),
  targetLanguageCode: z.string().trim().min(2),
  sourceText: z.string().trim().min(1).max(200),
});

export type GetTranslationsFormValues = z.infer<typeof getTranslationsSchema>;

export const getTranslationsResponseSchema = z.object({
  data: z.object({
    translatedText: z.string(),
  }),
});

export type GetTranslationsResponse = z.infer<
  typeof getTranslationsResponseSchema
>;
