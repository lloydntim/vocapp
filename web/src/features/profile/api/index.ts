import { clientApi } from '@/lib/client-api';
import {
  UpdateProfilePayload,
  UpdateProfileResponse,
  updateProfileResponseSchema,
} from '../schemas';

export async function updateProfile(
  userId: string,
  payload: UpdateProfilePayload,
): Promise<UpdateProfileResponse> {
  const response = await clientApi<unknown>(`/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  return updateProfileResponseSchema.parse(response);
}

export async function deleteProfile(userId: string) {
  const response = await clientApi(`/users/${userId}`, {
    method: 'DELETE',
  });

  return response;
}
