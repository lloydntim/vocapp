'use client';

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

import {
  getCurrentUser,
  login,
  logout,
  signup,
  verify,
} from '@/features/auth/api';

import { currentUserQueryKey } from '../query-keys';

function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (result) => {
      queryClient.setQueryData(currentUserQueryKey, { data: result.user });
    },
  });
}

function useSignup() {
  return useMutation({
    mutationFn: signup,
  });
}

function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

function useVerify() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verify,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: currentUserQueryKey });
    },
  });
}

function useCurrentUser() {
  return useSuspenseQuery({
    queryKey: currentUserQueryKey,
    queryFn: getCurrentUser,
    select: (response) => response.data,
    // staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes. No background refetching!
  });
}

export { useLogin, useSignup, useLogout, useVerify, useCurrentUser };
