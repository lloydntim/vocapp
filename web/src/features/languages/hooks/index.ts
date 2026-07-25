import { useCurrentUser } from '@/features/auth/hooks';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getLanguages, getTranslations } from '../api';
import { GetTranslationsFormValues } from '../schemas';

export const useGetLanguages = (q?: string) => {
  const { data: user } = useCurrentUser();

  return useQuery({
    queryKey: ['languages', q],
    queryFn: () => getLanguages(q),
    enabled: !!user?.id,
    select: (response) => response.data,
  });
};

export const useGetTranslations = () => {
  return useMutation({
    mutationFn: (payload: GetTranslationsFormValues) =>
      getTranslations(payload),
  });
};
