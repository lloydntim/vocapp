import z from 'zod';

export const listItemSchema = z.object({
  id: z.string(),
  listId: z.string(),
  position: z.number().optional().nullable(),
  sourceText: z.string(),
  targetText: z.string(),
  status: z.enum(['LEARNING', 'MASTERED']),
  createdAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  updatedAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
});

const getListItemsResponse = z.object({
  data: z.array(listItemSchema),
  message: z.string(),
});

type GetListItemsResponse = z.infer<typeof getListItemsResponse>;

export type { GetListItemsResponse };
export { getListItemsResponse };

const getListItemResponse = z.object({
  data: z.array(listItemSchema),
  message: z.string(),
});

type GetListItemResponse = z.infer<typeof getListItemResponse>;

export type { GetListItemResponse };
export { getListItemResponse };

export const createListItemSchema = z
  .object({
    sourceText: z.string().min(1, 'Source text is required'),
    targetText: z.string() /* .min(1, 'Target text is required')*/,
    status: z.boolean().optional(),
  })
  .transform(({ status, ...rest }) => ({
    ...rest,
    status: status ? ('MASTERED' as const) : ('LEARNING' as const),
  }));

export type CreateListItemFormValues = z.input<typeof createListItemSchema>;
export type CreateListItemPayload = z.output<typeof createListItemSchema>;

const createListItemResponseSchema = z.object({
  data: listItemSchema,
  message: z.string(),
});

type CreateListItemResponse = z.infer<typeof createListItemResponseSchema>;
export type { CreateListItemResponse };
export { createListItemResponseSchema };

const updateListItemPayloadSchema = z
  .object({
    status: z.boolean(),
  })
  .transform(({ status }) => ({
    status: status ? ('MASTERED' as const) : ('LEARNING' as const),
  }));

type UpdateListItemPayload = z.infer<typeof updateListItemPayloadSchema>;

export { updateListItemPayloadSchema };
export type { UpdateListItemPayload };

const updateListItemResponseSchema = z.object({
  data: listItemSchema,
  message: z.string(),
});

type UpdateListItemResponse = z.infer<typeof updateListItemResponseSchema>;

export { updateListItemResponseSchema };
export type { UpdateListItemResponse };
