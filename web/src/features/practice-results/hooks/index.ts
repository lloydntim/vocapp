import { useCurrentUser } from '@/features/auth/hooks';
import { getQueryClient } from '@/lib/query-client';
import { useMutation } from '@tanstack/react-query';
import { AddPracticeResultsPayload } from '../schemas';
import { addPracticeResults } from '../api';

export function useAddPracticeResults(listId: string, sessionId: string) {
  const { data: user } = useCurrentUser();

  return useMutation({
    mutationFn: (payload: AddPracticeResultsPayload) =>
      addPracticeResults(user.id, listId, sessionId, payload),
    onSuccess: () => {
      const queryClient = getQueryClient();
      queryClient.invalidateQueries({
        queryKey: ['results', user.id, listId, sessionId],
      });
    },
  });
}
