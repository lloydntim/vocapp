import { clientApi } from '@/lib/client-api';
import {
  ItemAudioField,
  ItemAudioResponse,
  itemAudioResponseSchema,
} from '../schemas';

export async function getItemAudio(
  userId: string,
  listId: string,
  itemId: string,
  field: ItemAudioField,
): Promise<ItemAudioResponse> {
  const response = await clientApi<unknown>(
    `/users/${userId}/lists/${listId}/items/${itemId}/audio?field=${field}`,
  );
  return itemAudioResponseSchema.parse(response);
}
