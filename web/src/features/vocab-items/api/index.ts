import { clientApi } from '@/lib/client-api';
import {
  CreateListItemPayload,
  CreateListItemResponse,
  createListItemResponseSchema,
  GetListItemsResponse,
  getListItemsResponse,
  UpdateListItemPayload,
  UpdateListItemResponse,
  updateListItemResponseSchema,
} from '../schemas';

export async function getListItems(
  userId: string,
  listId: string,
): Promise<GetListItemsResponse> {
  const response = await clientApi<unknown>(
    `/users/${userId}/lists/${listId}/items`,
  );
  return getListItemsResponse.parse(response);
}

export async function createListItem(
  userId: string,
  listId: string,
  payload: CreateListItemPayload,
): Promise<CreateListItemResponse> {
  const response = await clientApi<unknown>(
    `/users/${userId}/lists/${listId}/items`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );
  return createListItemResponseSchema.parse(response);
}

export async function updateListItem(
  userId: string,
  listId: string,
  itemId: string,
  payload: UpdateListItemPayload,
): Promise<UpdateListItemResponse> {
  const response = await clientApi<unknown>(
    `/users/${userId}/lists/${listId}/items/${itemId}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
  );
  return updateListItemResponseSchema.parse(response);
}

export async function deleteListItem(
  userId: string,
  listId: string,
  itemId: string,
) {
  const response = await clientApi<unknown>(
    `/users/${userId}/lists/${listId}/items/${itemId}`,
    {
      method: 'DELETE',
    },
  );
  return response;
}
