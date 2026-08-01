import z from 'zod';

export const itemAudioResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    audioUrl: z.string(),
    audioKey: z.string(),
  }),
});

export type ItemAudioResponse = z.infer<typeof itemAudioResponseSchema>;

export type ItemAudioField = 'source' | 'target';
