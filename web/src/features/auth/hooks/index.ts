'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { login, logout, signup } from '@/features/auth/api/auth';

function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (result) => {
      queryClient.setQueryData(['current-user'], result.user);
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

export { useLogin, useSignup, useLogout };
