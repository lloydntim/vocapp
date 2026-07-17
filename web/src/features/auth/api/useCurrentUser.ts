'use client';

import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/features/auth/api/current-user';
import { User } from '@/features/auth/schemas';

export const currentUserQueryKey = ['current-user'];

export function useCurrentUser() {
  return useQuery<User>({
    queryKey: currentUserQueryKey,
    queryFn: getCurrentUser,
  });
}
