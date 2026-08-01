import { clientApi } from '@/lib/client-api';
import {
  CreateListFormValues,
  CreateListResponse,
  createListResponseSchema,
  GetListResponse,
  getListResponseSchema,
  GetListsResponse,
  getListsResponseSchema,
  UpdateListPayload,
  UpdateListResponse,
  updateListResponseSchema,
} from '../schemas';

export async function getLists(userId: string): Promise<GetListsResponse> {
  const response = await clientApi<unknown>(`/users/${userId}/lists`);
  return getListsResponseSchema.parse(response);
}

export async function getList(
  userId: string,
  listId: string,
): Promise<GetListResponse> {
  const response = await clientApi<unknown>(`/users/${userId}/lists/${listId}`);
  return getListResponseSchema.parse(response);
}

export async function createList(
  userId: string,
  payload: CreateListFormValues,
): Promise<CreateListResponse> {
  const response = await clientApi<unknown>(`/users/${userId}/lists`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return createListResponseSchema.parse(response);
}

export async function updateList(
  userId: string,
  listId: string,
  payload: UpdateListPayload,
): Promise<UpdateListResponse> {
  console.log('updateList 1', listId);
  const response = await clientApi(`/users/${userId}/lists/${listId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  return updateListResponseSchema.parse(response);
}

export async function deleteList(userId: string, listId: string) {
  const response = await clientApi<unknown>(
    `/users/${userId}/lists/${listId}`,
    {
      method: 'DELETE',
    },
  );

  return response;
}
