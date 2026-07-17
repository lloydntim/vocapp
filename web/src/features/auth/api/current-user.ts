import { clientApi } from '@/lib/client-api';
import { User } from '../schemas';

export async function getCurrentUser() {
  const response = await clientApi<{ data: User }>('/users/me');
  return response?.data;
}
