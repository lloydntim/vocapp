import z from 'zod';

export const listSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(1, 'List name is required'),
  sourceLanguageCode: z.string().min(1, 'Source language is required'),
  targetLanguageCode: z.string().min(1, 'Target language is required'),
  lastPracticed: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    })
    .nullable(),
  total: z.int().nonnegative().optional(),
  mastered: z.int().nonnegative().optional(),
  progress: z.int().nonnegative().optional(),
  createdAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  updatedAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
});

const getListsResponseSchema = z.object({
  message: z.string(),
  data: z.array(listSchema),
});

type GetListsResponse = z.infer<typeof getListsResponseSchema>;

export type { GetListsResponse };
export { getListsResponseSchema };

const getListResponseSchema = z.object({
  message: z.string(),
  data: listSchema,
});

type GetListResponse = z.infer<typeof getListResponseSchema>;
export type { GetListResponse };
export { getListResponseSchema };

const createListSchema = z.object({
  name: z.string().min(1, 'List name is required'),
  sourceLanguageCode: z.string().min(1, 'Source language is required'),
  targetLanguageCode: z.string().min(1, 'Target language is required'),
  total: z.int().nonnegative().optional(),
  mastered: z.int().nonnegative().optional(),
  progress: z.int().nonnegative().optional(),
});

type CreateListFormValues = z.infer<typeof createListSchema>;

export type { CreateListFormValues };
export { createListSchema };

const createListResponseSchema = z.object({
  message: z.string(),
  data: listSchema,
});

type CreateListResponse = z.infer<typeof createListResponseSchema>;

export type { CreateListResponse };
export { createListResponseSchema };

const updateListPayloadSchema = z.object({
  name: z.string(),
});

type UpdateListPayload = z.infer<typeof updateListPayloadSchema>;

export type { UpdateListPayload };
export { updateListPayloadSchema };

const updateListResponseSchema = z.object({
  message: z.string(),
  data: listSchema,
});

type UpdateListResponse = z.infer<typeof updateListResponseSchema>;

export type { UpdateListResponse };
export { updateListResponseSchema };
