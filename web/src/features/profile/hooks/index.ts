'use client';

import { useMutation } from '@tanstack/react-query';
import { deleteProfile, updateProfile } from '../api';
import { UpdateProfilePayload } from '../schemas';
import { useCurrentUser } from '@/features/auth/hooks';
import { getQueryClient } from '@/lib/query-client';
import { currentUserQueryKey } from '@/features/auth/query-keys';

export function useUpdateProfileMutation() {
  const { data: user } = useCurrentUser();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      updateProfile(user?.id, payload),
    onSuccess: () => {
      const queryClient = getQueryClient();
      queryClient.invalidateQueries({ queryKey: currentUserQueryKey });
    },
  });
}

export function useDeleteProfileMutation() {
  return useMutation({
    mutationFn: (userId: string) => deleteProfile(userId),
    onSuccess: () => {
      const queryClient = getQueryClient();
      queryClient.invalidateQueries({ queryKey: currentUserQueryKey });
    },
  });
}
