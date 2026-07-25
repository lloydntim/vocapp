import { clientApi } from '@/lib/client-api';
import {
  GetLanguagesResponse,
  getLanguagesResponseSchema,
  GetTranslationsFormValues,
  GetTranslationsResponse,
  getTranslationsResponseSchema,
} from '../schemas';

export async function getLanguages(q?: string): Promise<GetLanguagesResponse> {
  const searchParams = new URLSearchParams();
  if (q) searchParams.set('q', q);

  const response = await clientApi<unknown>(
    `/languages${searchParams.size ? `?${searchParams}` : ''}`,
  );
  return getLanguagesResponseSchema.parse(response);
}

export async function getTranslations(
  payload: GetTranslationsFormValues,
): Promise<GetTranslationsResponse> {
  const response = await clientApi<unknown>('/languages', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return getTranslationsResponseSchema.parse(response);
}
